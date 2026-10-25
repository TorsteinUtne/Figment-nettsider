# Figment – nettsider

Kildekoden til figment.no. Statiske HTML-sider uten byggesteg: last opp mappen til webhotellet, så er siden ute. Figment eier all kode og alt innhold.

Bygget på designmalen [Onda fra 8B](https://8b.com/templates/onda/) (MIT-lisens), tilpasset Figments struktur, farger og innhold.

## Sidene

| Side | Mappe | Innhold |
|---|---|---|
| Forside | `index.html` | Hero, hvem vi er, tjenester, tidslinje, utvalgte prosjekter, Sonatgruppen, karriere, kontaktpersoner |
| Strategisk teknologiledelse | `strategisk-teknologiledelse/` | Fire tjenesteområder med tre nivåer hver, fagområder, kundesitat |
| Prosjekter | `prosjekter/` | Liste med filter på tjenesteområde, og én undermappe per prosjekt |
| Å jobbe i Figment | `jobbe-i-figment/` | Verdier, ansattgoder, sosialt, alle ansatte |
| Karriere | `karriere/` | Hvem vi ser etter og ledige stillinger |
| Kontakt | `kontakt/` | Kontaktpersoner, kontorer i Oslo og Bergen, firmainfo |

Hver side ligger som `index.html` i sin egen mappe, så adressene blir pene: `figment.no/prosjekter/`.

## Mappestruktur

```
assets/css/site.css      all styling, delt av alle sider
assets/js/site.js        meny, animasjoner og prosjektfilter
assets/img/              bilder
assets/fonts/            fonter (lagret lokalt, ingen kall til Google)
assets/vendor/           GSAP og Lenis (animasjon og myk scrolling)
partials/                felles header, footer, hode og skript
tools/sync.mjs           kopierer partials inn i alle sider
```

## Vanlige endringer

**Endre tekst.** Åpne sidens `index.html` og rediger teksten. Hver del av siden er merket med en kommentar `<!-- BLOKK: … -->`.

**Bytte et bilde.** Legg det nye bildet i `assets/img/` med samme filnavn som det gamle. Bildene som finnes på dagens figment.no har samme filnavn som i Lovable-prosjektet (`src/assets/`), så de kan kopieres rett over. De øvrige er plassholdere med filnavnet skrevet på bildet.

**Endre farger.** Øverst i `assets/css/site.css` under «Designtokens». Bytt hex-koden, så endres fargen overalt. Kontrastfargen heter `--color-accent` (prikker og detaljer) og `--color-accent-strong` (knapper, der tekst ligger oppå).

**Endre font.** Legg fontfilene i `assets/fonts/`, oppdater `@font-face` øverst i `site.css` og variablene `--font-display` og `--font-body`.

**Endre meny eller footer.** Rediger filen i `partials/`, og kjør deretter:

```bash
node tools/sync.mjs
```

Skriptet oppdaterer alle sider. Det krever Node.js, men sidene fungerer som de er også uten.

**Legge til et prosjekt.** Kopier en prosjektmappe, for eksempel `prosjekter/sammen/`, gi den nytt navn og bytt tekst og bilde. Legg så til et kort i `prosjekter/index.html` (og eventuelt på forsiden). `data-tags` på kortet styrer filteret.

**Legge til en ansatt.** Kopier en `<article class="member">`-blokk i `jobbe-i-figment/index.html`. Sitat legges inn der det står `SITAT` i en kommentar.

**Legge inn video i hero.** Legg videofilen i `assets/video/hero.mp4` og fjern kommentartegnene rundt `<video>` øverst på forsiden.

## Se siden lokalt

Lenkene peker på mapper (`prosjekter/`), så siden må vises gjennom en enkel webserver:

```bash
python3 -m http.server 8000
```

Åpne så http://localhost:8000.

## Publisering

Last opp alt unntatt `partials/`, `tools/`, `README.md`, `CLAUDE.md`, `AGENTS.md` og `.git/` til rotmappen på webhotellet. Siden trenger ingen database eller serverkode.

## Animasjoner og tilgjengelighet

Overskrifter glir inn, tjenestekortene stables, tidslinjen tegnes og prosjektene glir sidelengs mens man scroller. Har brukeren slått på «reduser bevegelse», vises alt statisk og komplett. Uten JavaScript fungerer alt innhold og alle lenker, bortsett fra mobilmenyen og prosjektfilteret.

## Lisenser

Se [LICENSE](LICENSE) og [CREDITS.md](CREDITS.md).
