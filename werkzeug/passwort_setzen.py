#!/usr/bin/env python3
"""Lehrkraft-Passwort setzen – mit Mac-Dialogfenster statt Terminal-Eingabe.

Start per Doppelklick auf „Lehrer-Passwort setzen.command“.
1. Fragt zweimal nach dem Passwort (Dialog mit verdeckter Eingabe).
2. Verschlüsselt _privat/lehrer.src.js zu lehrer/lehrer.enc.json (AES-256-GCM, PBKDF2-SHA256).
3. Lädt nur diese verschlüsselte Datei auf GitHub hoch; die Seite ist 1–2 Minuten später aktuell.
Das Passwort wird nirgends gespeichert.
"""
import base64, json, os, shutil, subprocess, sys, tempfile
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

ITER = 600_000
REPO = "https://github.com/pugu-prog/gse-lernmodule"
root = Path(__file__).resolve().parent.parent
src = root / "_privat" / "lehrer.src.js"
out = root / "lehrer" / "lehrer.enc.json"
TITEL = "GSE-Lernmodule"

def osa(script: str):
    r = subprocess.run(["osascript", "-e", script], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else None   # None = Abbrechen

def meldung(text: str, icon: str = "note"):
    osa(f'display dialog "{text}" with title "{TITEL}" buttons {{"OK"}} default button "OK" with icon {icon}')

def frage(text: str):
    a = osa(f'text returned of (display dialog "{text}" with title "{TITEL}" default answer "" with hidden answer buttons {{"Abbrechen", "Weiter"}} default button "Weiter" cancel button "Abbrechen")')
    return a

def passwort():
    if os.environ.get("LEHRER_PW_TEST"):
        return os.environ["LEHRER_PW_TEST"]
    while True:
        pw = frage("Neues Passwort für den Lehrkraft-Bereich (mindestens 10 Zeichen):")
        if pw is None:
            return None
        if len(pw) < 10:
            meldung("Das Passwort ist zu kurz. Bitte mindestens 10 Zeichen verwenden.", "caution")
            continue
        pw2 = frage("Bitte das Passwort noch einmal eingeben:")
        if pw2 is None:
            return None
        if pw2 != pw:
            meldung("Die beiden Eingaben stimmen nicht überein. Bitte noch einmal.", "caution")
            continue
        return pw

def verschluesseln(pw: str):
    salt, iv = os.urandom(16), os.urandom(12)
    key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITER).derive(pw.encode("utf-8"))
    ct = AESGCM(key).encrypt(iv, src.read_bytes(), None)
    b64 = lambda b: base64.b64encode(b).decode()
    out.write_text(json.dumps({"v": 1, "iter": ITER, "salt": b64(salt), "iv": b64(iv), "ct": b64(ct)}))

def hochladen():
    """Lädt nur lehrer/lehrer.enc.json hoch. Gibt bei Fehler eine Meldung zurück."""
    tmp = Path(tempfile.mkdtemp(prefix="gse-pw-"))
    env = {**os.environ, "GIT_TERMINAL_PROMPT": "0"}
    try:
        def git(*a):
            return subprocess.run(["git", *a], cwd=tmp, env=env, capture_output=True, text=True)
        r = subprocess.run(["git", "clone", "-q", "--depth", "1", REPO, str(tmp / "r")], env=env, capture_output=True, text=True)
        if r.returncode: return "GitHub ist nicht erreichbar: " + r.stderr.strip()[-200:]
        tmp = tmp / "r"
        shutil.copy(out, tmp / "lehrer" / "lehrer.enc.json")
        git("add", "lehrer/lehrer.enc.json")
        if not git("status", "--porcelain").stdout.strip():
            return None
        git("-c", "user.name=Guy Putz", "-c", "user.email=pugu@me.com", "commit", "-q", "-m", "Lehrkraft-Bereich neu verschlüsselt")
        r = git("push", "-q", "origin", "HEAD:main")
        if r.returncode: return "Hochladen fehlgeschlagen: " + r.stderr.strip()[-200:]
        return None
    finally:
        shutil.rmtree(tmp.parent if tmp.name == "r" else tmp, ignore_errors=True)

def main():
    if not src.exists():
        meldung("Die Quelldatei _privat/lehrer.src.js fehlt. Bitte Claude fragen.", "stop"); sys.exit(1)
    pw = passwort()
    if pw is None:
        print("Abgebrochen, nichts geändert."); return
    verschluesseln(pw)
    if os.environ.get("NO_PUSH"):
        print("Verschlüsselt (Test, nicht hochgeladen)."); return
    fehler = hochladen()
    if fehler:
        meldung(f"Das Passwort ist gesetzt, aber noch nicht online.\\n\\n{fehler}", "caution"); sys.exit(1)
    meldung("Fertig. Das neue Passwort gilt in 1 bis 2 Minuten auf der Seite.\\n\\nhttps://pugu-prog.github.io/gse-lernmodule/lehrer/")
    print("Fertig.")

main()
