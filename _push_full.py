import json, ssl, base64, subprocess, urllib.request, os

REPO = "BadCodeZ/Jiazi-Practice-Platform"
BRANCH = "main"

# token
out = subprocess.run(["git","credential-manager","get"],
                     input=b"protocol=https\nhost=github.com\n\n",
                     capture_output=True, timeout=20).stdout.decode()
tok = ""
for line in out.splitlines():
    if line.startswith("password="):
        tok = line.split("=",1)[1].strip()
assert tok, "no token"

ctx = ssl.create_default_context(); ctx.check_hostname=False; ctx.verify_mode=ssl.CERT_NONE
op = urllib.request.build_opener(urllib.request.ProxyHandler({}), urllib.request.HTTPSHandler(context=ctx))
def api(method, path, data=None):
    url = f"https://api.github.com{path}"
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(url, data=body, method=method,
                                 headers={"Authorization":f"token {tok}","User-Agent":"wb",
                                          "Accept":"application/vnd.github+json"})
    with op.open(req, timeout=30) as r:
        return json.load(r)

# base head
head = api("GET", f"/repos/{REPO}/git/ref/heads/{BRANCH}")["object"]["sha"]

# collect tracked files
files = subprocess.run(["git","-c","core.quotepath=false","ls-files"], cwd=os.path.dirname(__file__),
                       capture_output=True, text=True).stdout.splitlines()
entries=[]
for f in files:
    if not f.strip(): continue
    with open(os.path.join(os.path.dirname(__file__), f), "rb") as fh:
        content = fh.read()
    is_bin = not content.isascii() and False  # all files text-ish; but html/doc? we exclude docx already
    blob = api("POST", f"/repos/{REPO}/git/blobs",
               {"content": base64.b64encode(content).decode(), "encoding":"base64"})
    entries.append({"path":f, "mode":"100644", "type":"blob", "sha":blob["sha"]})

tree = api("POST", f"/repos/{REPO}/git/trees", {"tree":entries})
msg = "chore: remove non-essential docs/dev files (使用说明, sim_e2e, RELEASE, V1.3_DESIGN) + refresh README"
commit = api("POST", f"/repos/{REPO}/git/commits",
            {"message":msg,"tree":tree["sha"],"parents":[head]})
api("PATCH", f"/repos/{REPO}/git/refs/heads/{BRANCH}", {"sha":commit["sha"]})
print("PUSHED commit", commit["sha"][:12])

# self-verify
rtree = api("GET", f"/repos/{REPO}/git/trees/{commit['sha']}?recursive=1")["tree"]
remote = {(t["path"]) for t in rtree if t["type"]=="blob"}
local = set(files)
print("match", len(local & remote), "missing", len(local - remote), "extra", len(remote - local))
print("crlf", sum(1 for f in files if "\r\n" in open(os.path.join(os.path.dirname(__file__),f),"rb").read().decode("utf-8","ignore")))
