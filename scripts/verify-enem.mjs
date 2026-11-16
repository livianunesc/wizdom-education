// Run when www.gov.br and download.inep.gov.br are allowed by the environment.
// Python urllib honors the managed HTTPS proxy and retains TLS verification.
import { spawnSync } from "node:child_process";
import { exams } from "../src/exams-data.js";
const urls = exams.flatMap(e => [e.officialProof,e.officialAnswer]).filter(Boolean);
const result = spawnSync("python3", ["-c", `
import concurrent.futures,json,sys,urllib.request
urls=json.load(sys.stdin)
def check(url):
 try:
  request=urllib.request.Request(url,headers={'Range':'bytes=0-1023','User-Agent':'Wizdom-Link-Check/1.0'})
  with urllib.request.urlopen(request,timeout=25) as response:
   magic=response.read(5)
   good=response.status in (200,206) and magic==b'%PDF-'
   return {'url':url,'ok':good,'status':response.status,'is_pdf':magic==b'%PDF-'}
 except Exception as error:return {'url':url,'ok':False,'error':str(error)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(check,urls))
print(json.dumps({'total':len(results),'passed':sum(r['ok'] for r in results),'results':results},ensure_ascii=False,indent=2))
sys.exit(0 if all(r['ok'] for r in results) else 1)
`], { input: JSON.stringify(urls), encoding: "utf8", maxBuffer: 1024 * 1024 });
process.stdout.write(result.stdout || "");
process.stderr.write(result.stderr || "");
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
