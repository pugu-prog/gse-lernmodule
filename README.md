# GSE-Lernmodule

Interaktive Lernmodule für **Sciences Environnementales** und **Smart Technologies** am Lycée Technique d'Ettelbruck: rechnen, simulieren, üben. Reines HTML/JavaScript, keine Anmeldung, läuft auf jedem Gerät.

| Ordner | Modul |
|---|---|
| `u-wert/` | U-Wert-Rechner mit Glaser, Phasenverschiebung, Lernpfad und Übungen |
| `waermewelle/` | Wärmewelle durch die Wand (Simulation, TAV, φ) |
| `sonnenstand/` | Sonnenstand über Ettelbruck und Verschattung durch Auskragungen |
| `trombewand/` | Trombe- und Solarwand (Animation, Speicherverzögerung) |
| `waermetauscher/` | Kreuzwärmetauscher mit Kondensat |
| `schichtspeicher/` | Schichtspeicher: Zapfen, Laden, Schichtenlanze, Verwirbelung |
| `solarspeicher/` | Solaranlage mit bivalentem Speicher einen Tag in Ettelbruck, Auslegung |
| `waermepumpe/` | Wärmepumpe: Kreisprozess, ε, COP, Carnot, Heizjahr Ettelbruck mit Betriebsweise und JAZ |
| `lehrer/` | Aufgabenblätter mit Lösungen (verschlüsselt, Passwort) |

Gemeinsam genutzt: `assets/base.css` (Design), `assets/core.js` (Zahlen, MathJax, Aufgaben prüfen), `assets/speicher.js` (Speichermodell in Wasserschichten), `assets/bauphysik.js` (Materialien aus der ENTEC-Formelsammlung 26/27 und Bauphysik-Rechnungen).

## Neues Modul hinzufügen
1. Ordner mit `index.html` anlegen (Kopf und Fuß von einem bestehenden Modul übernehmen).
2. In `index.html` (Startseite) im Array `KAP` einen Eintrag ergänzen.

## Lehrkraft-Bereich
Der Inhalt liegt nur verschlüsselt als `lehrer/lehrer.enc.json` im Repository (AES-256-GCM, Schlüssel per PBKDF2-SHA256 aus dem Passwort). Die unverschlüsselte Quelle bleibt lokal; neu verschlüsseln mit `python3 werkzeug/verschluesseln.py`.
