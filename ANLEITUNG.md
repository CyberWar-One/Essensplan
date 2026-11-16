# Essensplan – Installation auf dem Samsung S26

Die App ist eine **installierbare Web-App (PWA)**. Nach der Installation hat sie ein eigenes Icon,
läuft im Vollbild und funktioniert **komplett offline**. Daten bleiben nur auf dem Handy.

Eine PWA muss **einmal** über eine HTTPS-Adresse geöffnet werden, damit Android sie installieren kann.
Danach braucht sie kein Internet mehr. Am einfachsten und kostenlos geht das mit GitHub Pages.

## Weg A – PWA (empfohlen, ca. 10 Minuten)
1. Auf github.com ein kostenloses Konto anlegen → **New repository** → Name z. B. `essensplan`, **Public**.
2. **Add file → Upload files** → den *Inhalt* dieses Ordners hochladen (index.html, app.js, app.css,
   logic.js, sw.js, manifest.webmanifest und den Ordner `icons`) → **Commit**.
3. **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main` / `(root)` → Save.
   Nach ca. 1 Minute ist die App unter `https://DEINNAME.github.io/essensplan/` erreichbar.
4. Auf dem S26 diese Adresse in **Chrome** öffnen → Menü ⋮ → **„Zum Startbildschirm hinzufügen“ → Installieren**.
   (Samsung Internet: Menü → „Seite hinzufügen zu“ → „Startbildschirm“.)
5. Fertig: App über das Icon starten. Ab jetzt läuft sie auch im Flugmodus.

Hinweis: Die Adresse ist öffentlich, enthält aber **nur das Programm, keine Daten**.
Gerichte, Plan und Notizen liegen ausschließlich auf dem Handy.

## Weg B – echte .apk-Datei (optional, auf Basis von Weg A)
1. Weg A erledigen.
2. https://www.pwabuilder.com öffnen → die GitHub-Pages-Adresse eingeben → **Package for stores → Android**.
3. Die erzeugte ZIP enthält eine signierte `.apk` (plus Signaturschlüssel – **gut aufheben**, wird für Updates benötigt).
4. Die .apk aufs Handy kopieren und installieren (Android fragt einmal nach „Unbekannte Apps installieren“).

Ehrliche Einschätzung: Die .apk ist im Kern dieselbe App. Weg A ist einfacher, Updates kommen automatisch,
und es ist keine Freigabe für „unbekannte Quellen“ nötig.

## Bedienung
- **Plan:** 2 Wochen auf einen Blick (links diese, rechts nächste Woche). ◀ ▶ blättert wochenweise,
  Tippen auf den Titel springt zurück zu heute.
- **Tag antippen:** Gericht wählen, zufällig wählen, verschieben, entfernen, Notiz für den Tag.
- **Lange drücken und ziehen:** Gericht auf einen anderen Tag schieben (belegte Tage werden getauscht).
- **🎲 Automatisch füllen:** nur leere Tage oder alle ab heute. Kein Gericht wiederholt sich innerhalb von 14 Tagen;
  lange nicht gegessene Gerichte kommen bevorzugt dran.
- **Rückgängig:** nach jeder Änderung ein paar Sekunden lang unten möglich.
- **Gerichte:** 87 Gerichte aus den bisherigen Essensplänen sind vorinstalliert. Suchen (auch nach Kochbuch, z. B. „Walle“),
  neu anlegen (mit Prüfung auf ähnliche Namen), ✏️ bearbeiten (Name + 📖 Info wie „GU Cholesterin S. 64“), löschen,
  🎲/🚫 = bei Automatik berücksichtigen oder nicht (z. B. „Essen gehen“, „Reste“).
- **Termine:** Notizen für beliebige Tage, z. B. Weihnachten. Sie erscheinen auch im Plan. Feiertage sind markiert.
- **Mehr → Sicherung speichern:** legt eine Datei im Download-Ordner ab. **Regelmäßig machen!**

## Datenspeicherung
Gespeichert wird im lokalen Browser-Speicher der App (localStorage), und die App fordert „dauerhaften Speicher“ an.
**Achtung:** Wird die App deinstalliert oder werden in Chrome die Websitedaten gelöscht, sind die Daten weg.
Deshalb die Sicherung nutzen; sie lässt sich über „Sicherung laden“ wiederherstellen.

## Update einspielen
Neue Dateien auf GitHub hochladen und in `sw.js` die Versionsnummer `CACHE` erhöhen.
Beim nächsten Start (mit Internet) lädt die App die neue Version. Die Daten bleiben erhalten.
