INSTALLERA I CHROME

Det här är en PWA-version av träningsappen.

Viktigt:
- Den kan inte installeras direkt från en lokal file://-fil.
- Lägg mappen på en webbserver med HTTPS, exempelvis GitHub Pages, Netlify eller Cloudflare Pages.
- Öppna sedan sidan i Chrome.
- Dator: klicka på installationsikonen i adressfältet eller välj Installera app.
- Android: Chrome-menyn > Installera app / Lägg till på startskärmen.

För lokal testning på dator:
1. Öppna en terminal i denna mapp.
2. Kör: python3 -m http.server 8000
3. Öppna http://localhost:8000 i Chrome.


NYTT I VERSION 2
- Veckovis viktregistrering efter avslutat pass.
- Viktgraf under Vikt & trend.
- Varning vid tydlig eller upprepad viktnedgång.
- En vikt per vecka; samma vecka kan uppdateras.


NYTT I VERSION 3
- Flera viktregistreringar per vecka.
- Varje mätpunkt sparas separat.
- Grafen visar alla mätningar samt en tydligare linje för veckomedel.
- Varningar baseras på veckomedel i stället för enstaka vägningar.


NYTT I VERSION 4
- Datum och tid visas på genomförda pass i checklistan.
- Historiken visar datum och tid för registrerade set.
- Varje viktpunkt visar datum och tid i listan.
- Viktgrafens punkter har tooltip med datum, tid och vikt.
