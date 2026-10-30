#!/usr/bin/env python3
"""Verschlüsselt den Lehrkraft-Bereich für die GSE-Lernmodule.

Aufruf (im Ordner gse-lernmodule):  python3 werkzeug/verschluesseln.py
Liest _privat/lehrer.src.js, fragt zweimal nach dem Passwort und schreibt
lehrer/lehrer.enc.json (AES-256-GCM, Schlüssel per PBKDF2-SHA256 aus dem Passwort).
Das Passwort wird nirgends gespeichert. Ohne Passwort ist der Inhalt nicht lesbar.
"""
import base64, getpass, json, os, sys
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

ITER = 600_000
root = Path(__file__).resolve().parent.parent
src = root / "_privat" / "lehrer.src.js"
out = root / "lehrer" / "lehrer.enc.json"

def key(pw: str, salt: bytes) -> bytes:
    return PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=ITER).derive(pw.encode("utf-8"))

def main():
    pw = os.environ.get("LEHRER_PW_TEST") or getpass.getpass("Passwort für den Lehrkraft-Bereich: ")
    if not os.environ.get("LEHRER_PW_TEST"):
        if len(pw) < 10:
            sys.exit("Bitte mindestens 10 Zeichen verwenden.")
        if getpass.getpass("Passwort wiederholen: ") != pw:
            sys.exit("Die Passwörter stimmen nicht überein. Nichts geändert.")
    salt, iv = os.urandom(16), os.urandom(12)
    ct = AESGCM(key(pw, salt)).encrypt(iv, src.read_bytes(), None)
    b64 = lambda b: base64.b64encode(b).decode()
    out.write_text(json.dumps({"v": 1, "iter": ITER, "salt": b64(salt), "iv": b64(iv), "ct": b64(ct)}))
    print(f"Fertig: {out.relative_to(root)} ({out.stat().st_size // 1024} KB) verschlüsselt.")

main()
