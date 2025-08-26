from __future__ import annotations
import argparse, io, re, sys, time
from pathlib import Path
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import List, Dict, Optional
import requests, pandas as pd, numpy as np
from bs4 import BeautifulSoup
from dateutil import parser as dtp
from tqdm import tqdm
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

EXPLOITDB_CSV_URL = "https://gitlab.com/exploit-database/exploitdb/-/raw/main/files_exploits.csv"
EXPLOITDB_SHELLCODES_CSV_URL = "https://gitlab.com/exploit-database/exploitdb/-/raw/main/files_shellcodes.csv"
VULLAB_BASE = "https://www.vulnerability-lab.com/"
VULLAB_SECTIONS = ["", "web-application/", "mobile/", "remote/", "local/", "vendor/", "websites/"]
ZERODAY_INDEX_JSON = "https://raw.githubusercontent.com/vulncheck-oss/0day.today.archive/main/index.json"

CVE_RE = re.compile(r"CVE-\d{4}-\d{4,7}", re.I)
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

TIPU_ATSLEGAS = {
    "rce": ["remote code execution", "rce", "code execution"],
    "priv_esc": ["privilege escalation", "privesc", "eop"],
    "xss": ["xss", "cross site scripting"],
    "sqli": ["sqli", "sql injection"],
    "csrf": ["csrf", "cross site request forgery"],
    "lfi": ["local file inclusion", "lfi"],
    "rfi": ["remote file inclusion", "rfi"],
    "overflow": ["buffer overflow", "stack overflow"],
    "dos": ["denial of service", "dos", "crash"],
    "info": ["information disclosure", "leak"],
}
COL_MAP_CANDIDATES = {
    "avots": ["avots", "source", "источник"],
    "id": ["id", "ид", "код", "record_id"],
    "nosaukums": ["nosaukums", "title", "name", "описание", "название", "description"],
    "url": ["url", "link", "ссылка"],
    "diena": ["diena", "date", "дата", "datum", "published"],
    "cves": ["cves", "cve", "cve_list"],
    "tips": ["tips", "type", "вид", "категория", "тип"],
}

session = requests.Session()
session.headers.update(HEADERS)
def http_get(url, timeout=30):
    r = session.get(url, timeout=timeout)
    r.raise_for_status()
    return r
def parse_diena(val: Optional[str]) -> Optional[datetime]:
    if not val: return None
    try:
        d = dtp.parse(val)
        return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
    except Exception:
        return None
def within(d, since, until):
    if d is None: return True
    if since and d < since: return False
    if until and d > until: return False
    return True
def atrast_cves(teksts: str) -> List[str]:
    return sorted({m.upper() for m in CVE_RE.findall(teksts or "")})
def noteikt_tipu(nosaukums: str, saturs: str = "") -> Optional[str]:
    t = f"{nosaukums} {saturs}".lower()
    for tips, kws in TIPU_ATSLEGAS.items():
        if any(k in t for k in kws): return tips
    return None
@dataclass
class Ieraksts:
    avots: str; id: str; nosaukums: str; url: str
    diena: Optional[datetime]; cves: List[str]; ievainojamibas_tips: Optional[str]; extra: Dict[str,str]
    def to_row(self) -> Dict[str,str]:
        return {
            "avots": self.avots, "id": self.id, "nosaukums": self.nosaukums,
            "url": self.url, "diena": self.diena.isoformat() if self.diena else "",
            "cves": ",".join(self.cves), "tips": self.ievainojamibas_tips or "",
            **{f"extra_{k}": v for k,v in self.extra.items()}
        }
def lasit_exploitdb(since, until) -> List[Ieraksts]:
    out=[]
    for url in (EXPLOITDB_CSV_URL, EXPLOITDB_SHELLCODES_CSV_URL):
        try:
            df = pd.read_csv(io.StringIO(http_get(url).text))
        except Exception:
            continue
        for _, r in df.iterrows():
            eid = str(r.get("id",""))
            nos = str(r.get("description",""))
            d = parse_diena(str(r.get("date","")))
            if not within(d, since, until): continue
            out.append(Ieraksts("exploitdb", f"edb-{eid}", nos,
                                f"https://www.exploit-db.com/exploits/{eid}",
                                d, atrast_cves(nos), noteikt_tipu(nos), {}))
    return out
def _safe_title(soup: BeautifulSoup) -> str:
    el = soup.find(["h1","title","h2"])
    return el.get_text(strip=True) if el and el.get_text(strip=True) else "Vulnerability-Lab ieraksts"
def lasit_vullab(since, until, max_per=100) -> List[Ieraksts]:
    ieraksti, redzeti = [], set()
    for sec in VULLAB_SECTIONS:
        try: soup = BeautifulSoup(http_get(VULLAB_BASE+sec).text, "lxml")
        except: continue
        links = [a["href"] for a in soup.find_all("a", href=True)]
        links = [h if h.startswith("http") else VULLAB_BASE+h.lstrip("./")
                 for h in links if any(x in h for x in ("show.php","research.php","id="))]
        uniq = [u for u in links if not (u in redzeti or redzeti.add(u))][:max_per]
        for url in tqdm(uniq, desc=f"Vuln-Lab:{sec or 'index'}", leave=False):
            try: s2 = BeautifulSoup(http_get(url).text, "lxml")
            except: continue
            nos = _safe_title(s2)
            t = s2.find("time")
            d = parse_diena(t.get("datetime") or t.get_text(strip=True)) if t else None
            if not within(d, since, until): continue
            saturs = s2.get_text(" ", strip=True)[:2000]
            rid = re.sub(r"[^a-zA-Z0-9]+","-",url.strip("/")).strip("-")[-64:]
            ieraksti.append(Ieraksts("vulnlab", rid, nos, url, d,
                                     atrast_cves(nos+" "+saturs),
                                     noteikt_tipu(nos, saturs), {}))
            time.sleep(0.12)
    return ieraksti
def lasit_zeroday(since, until, limit=None) -> List[Ieraksts]:
    try: dati = http_get(ZERODAY_INDEX_JSON, timeout=60).json()
    except: return []
    out=[]
    for it in dati:
        nos = str(it.get("title") or it.get("name") or "0day Item")
        url = str(it.get("url") or it.get("link") or "")
        d = parse_diena(str(it.get("date") or it.get("published") or it.get("time") or ""))
        if not within(d, since, until): continue
        cfield = it.get("cve") or it.get("cves") or ""
        cves = [str(x).upper() for x in cfield if isinstance(cfield, list) and isinstance(x,str)] \
               or atrast_cves(str(cfield)+" "+nos)
        rid = re.sub(r"[^a-zA-Z0-9]+","-", (url.strip("/") or nos))[-64:].strip("-")
        out.append(Ieraksts("0day", rid, nos, url, d, cves, noteikt_tipu(nos), {}))
        if limit and len(out) >= limit: break
    return out
def normalizet_excel_df(df: pd.DataFrame) -> pd.DataFrame:
    cols, lower = list(df.columns), [str(c).strip().lower() for c in df.columns]
    mapping={}
    for target, cands in COL_MAP_CANDIDATES.items():
        for i, lc in enumerate(lower):
            if lc in cands: mapping[cols[i]]=target; break
    ndf = df.rename(columns=mapping).copy()
    for c in ["avots","id","nosaukums","url","diena","cves","tips"]:
        if c not in ndf: ndf[c]=""
    def _p(x):
        if pd.isna(x) or x=="": return pd.NaT
        if isinstance(x,(pd.Timestamp,datetime)): return pd.to_datetime(x, utc=True, errors="coerce")
        try: return pd.to_datetime(dtp.parse(str(x)), utc=True, errors="coerce")
        except: return pd.NaT
    ndf["diena"]=ndf["diena"].apply(_p)
    for c in ["avots","id","nosaukums","url","cves","tips"]:
        ndf[c]=ndf[c].astype(str).fillna("")
    ndf["avots"]=ndf["avots"].replace(["","nan","NaN"],"excel")
    return ndf
def lasit_excel(path: str) -> pd.DataFrame:
    xl = pd.ExcelFile(path)
    parts=[xl.parse(name).assign(__sheet__=name) for name in xl.sheet_names]
    return normalizet_excel_df(pd.concat(parts, ignore_index=True)) if parts else \
           pd.DataFrame(columns=["avots","id","nosaukums","url","diena","cves","tips"])
def uz_df(ieraksti: List[Ieraksts]) -> pd.DataFrame:
    df=pd.DataFrame([r.to_row() for r in ieraksti])
    if not df.empty: df["diena"]=pd.to_datetime(df["diena"],errors="coerce",utc=True)
    return df
def saglabat_csv(df: pd.DataFrame, path: Path): df.to_csv(path,index=False,encoding="utf-8")
def grafiks_laiks(df,out,src):
    sdf=df[df["avots"]==src].dropna(subset=["diena"]).copy()
    if sdf.empty: return
    sdf["menesis"]=sdf["diena"].dt.to_period("M").dt.to_timestamp()
    s=sdf.groupby("menesis")["id"].count()
    plt.figure(figsize=(9,4.5)); s.plot(marker="o")
    plt.title(f"{src}: pa mēnešiem"); plt.tight_layout()
    plt.savefig(out/f"{src}_timeline.png"); plt.close()
def grafiks_tipi(df,out,src):
    c=df[df["avots"]==src]["tips"].fillna("nezināms").replace({"":"nezināms"}).value_counts().head(12)
    if c.empty: return
    plt.figure(figsize=(9,4.5)); c.plot(kind="bar")
    plt.title(f"{src}: tipu sadalījums"); plt.xticks(rotation=45,ha="right")
    plt.tight_layout(); plt.savefig(out/f"{src}_types.png"); plt.close()
def grafiks_avoti(df,out):
    c=df["avots"].value_counts()
    if c.empty: return
    plt.figure(figsize=(8,4.5)); c.plot(kind="bar")
    plt.title("Ieraksti pa avotiem"); plt.tight_layout()
    plt.savefig(out/"all_counts.png"); plt.close()
def grafiks_laiks_kopa(df,out):
    d=df.dropna(subset=["diena"]).copy()
    if d.empty: return
    d["menesis"]=d["diena"].dt.to_period("M").dt.to_timestamp()
    piv=d.pivot_table(index="menesis",columns="avots",values="id",aggfunc="count",fill_value=0)
    if piv.empty: return
    plt.figure(figsize=(10,5))
    for col in piv.columns: plt.plot(piv.index,piv[col],marker="o",label=col)
    plt.legend(); plt.title("Dinamika pa avotiem")
    plt.tight_layout(); plt.savefig(out/"all_timeline.png"); plt.close()
def grafiks_cve_parklasanas(df,out):
    by=defaultdict(set)
    for _,r in df.iterrows():
        for c in str(r.get("cves") or "").split(","):
            c=c.strip().upper()
            if c: by[r["avots"]].add(c)
    srcs=sorted(by)
    if not srcs: return
    mat=np.array([[len(by[s1]&by[s2]) for s2 in srcs] for s1 in srcs], dtype=int)
    plt.figure(figsize=(6+len(srcs)*0.5,5+len(srcs)*0.3))
    plt.imshow(mat,aspect="auto"); plt.xticks(range(len(srcs)),srcs,rotation=45,ha="right")
    plt.yticks(range(len(srcs)),srcs); plt.title("CVE pārklāšanās")
    for i in range(len(srcs)):
        for j in range(len(srcs)):
            plt.text(j,i,str(mat[i,j]),ha="center",va="center")
    plt.tight_layout(); plt.savefig(out/"cve_overlap_heatmap.png"); plt.close()
def grafiks_top_cve(df: pd.DataFrame, out: Path, suffix: str = ""):
    exploded = (df.assign(cves=df["cves"].fillna("").astype(str).str.upper().str.split(",")).explode("cves"))
    exploded["cves"]=exploded["cves"].str.strip()
    exploded=exploded[exploded["cves"].str.match(r"^CVE-\d{4}-\d{4,7}$", na=False)]
    counts=exploded["cves"].value_counts().head(20)
    if counts.empty: return
    plt.figure(figsize=(10,5)); counts.plot(kind="bar")
    plt.title(f"Top 20 CVEs{(' ('+suffix+')') if suffix else ''}")
    plt.xticks(rotation=45, ha="right"); plt.tight_layout()
    plt.savefig(out/f"top_cves{('_'+suffix.lower()) if suffix else ''}.png"); plt.close()
def grafiks_tips_laika(df: pd.DataFrame, out: Path, suffix: str = ""):
    d=df.dropna(subset=["diena"]).copy()
    if d.empty: return
    d["menesis"]=d["diena"].dt.to_period("M").dt.to_timestamp()
    piv=d.pivot_table(index="menesis", columns="tips", values="id", aggfunc="count", fill_value=0)
    if piv.empty: return
    totals=piv.sum().sort_values(ascending=False); piv=piv[totals.head(8).index]
    plt.figure(figsize=(10,5))
    for col in piv.columns:
        lbl = (col or "").strip() or "nezināms"
        plt.plot(piv.index, piv[col], marker="o", label=lbl)
    plt.legend(); plt.title(f"Dinamika pa ievainojamību tipiem{(' ('+suffix+')') if suffix else ''}")
    plt.tight_layout(); plt.savefig(out/f"types_timeline{('_'+suffix.lower()) if suffix else ''}.png"); plt.close()
def main():
    ap=argparse.ArgumentParser(description="Ievainojamību apkopošana (Exploit-DB, Vuln-Lab, 0day) + Excel")
    ap.add_argument("--since",type=str, help="Sākuma datums, напр. 2024-01-01")
    ap.add_argument("--until",type=str, help="Beigu datums")
    ap.add_argument("--out",type=str,default="./output", help="Katalogs izvadei")
    ap.add_argument("--excel",type=str,help="Ceļš uz Excel failu ar datiem, напр. ./Darbgrāmata1.xlsx")
    args=ap.parse_args()
    since=parse_diena(args.since) if args.since else None
    until=parse_diena(args.until) if args.until else None
    out=Path(args.out); out.mkdir(parents=True,exist_ok=True)
    visi: List[Ieraksts] = []
    print("[*] Exploit-DB...");      visi += lasit_exploitdb(since,until)
    print("[*] Vulnerability-Lab..."); visi += lasit_vullab(since,until)
    print("[*] 0day.today...");      visi += lasit_zeroday(since,until)
    if args.excel:
        print("[*] Excel dati...")
        try: df_excel = lasit_excel(args.excel)
        except Exception as e:
            print(f"[!] Neizdevās nolasīt Excel: {e}", file=sys.stderr)
            df_excel = pd.DataFrame(columns=["avots","id","nosaukums","url","diena","cves","tips"])
        if not df_excel.empty:
            for _, r in df_excel.iterrows():
                d = pd.to_datetime(r["diena"], utc=True, errors="coerce")
                d = d.to_pydatetime() if isinstance(d, pd.Timestamp) and not pd.isna(d) else None
                if not within(d, since, until): continue
                cves=[c.strip().upper() for c in str(r["cves"]).split(",") if c.strip()]
                visi.append(Ieraksts(str(r["avots"]), str(r["id"]), str(r["nosaukums"]), str(r["url"]),
                                     d, cves, (str(r["tips"]) or None), {}))
    if not visi:
        print("Nav datu"); sys.exit(1)
    df=uz_df(visi)
    for src in df["avots"].unique():
        sdf=df[df["avots"]==src]
        saglabat_csv(sdf, out/f"{src}.csv")
        grafiks_laiks(df,out,src)
        grafiks_tipi(df,out,src)
    saglabat_csv(df,out/"visi_avoti.csv")
    grafiks_avoti(df,out)
    grafiks_laiks_kopa(df,out)
    grafiks_cve_parklasanas(df,out)
    out_excel = out/"excel_only"; out_excel.mkdir(exist_ok=True, parents=True)
    out_all   = out/"combined";   out_all.mkdir(exist_ok=True, parents=True)
    dfx = df[df["avots"]=="excel"].copy()
    if not dfx.empty:
        grafiks_top_cve(dfx, out_excel, suffix="Excel")
        grafiks_tips_laika(dfx, out_excel, suffix="Excel")
    grafiks_top_cve(df, out_all, suffix="All")
    grafiks_tips_laika(df, out_all, suffix="All")
    print(f"Gatavs. CSV un grafiki saglabāti: {out}")
if __name__=="__main__":
    main()
