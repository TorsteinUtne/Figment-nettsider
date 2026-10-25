# CLAUDE.md – Figment nettsider

Instruksjoner for Claude (og andre KI-agenter) som jobber i dette repoet. Les README.md for oversikt.

## Arkitektur

- Statiske HTML-sider, ingen rammeverk og ingen byggesteg. Hver side er `index.html` i egen mappe.
- All styling i `assets/css/site.css`, organisert i CSS-lag (`tokens, base, atoms, blocks, sections, scenes`). Farger og fonter er variabler i `:root` under «Designtokens». Bruk variablene, aldri hardkodede farger.
- All logikk i `assets/js/site.js`. Hver del ser etter sine elementer og hopper over seg selv hvis de mangler.
- Felles deler (`partials/head.html`, `header.html`, `footer.html`, `scripts.html`) står i sidene mellom `<!-- partial:navn -->` og `<!-- /partial:navn -->`. Endre alltid filen i `partials/` og kjør `node tools/sync.mjs`. Rediger aldri innholdet mellom markørene direkte.
- I partials blir `{{root}}` stien til roten. `data-nav="x"` får `aria-current="page"` når `<body data-page="x">`.
- Stier er relative. En side i `prosjekter/sammen/` bruker `../../assets/…`.

## Byggeklosser

Gjenbruk disse klassene før du lager nye:

- Tekst: `t-display`, `t-h1`, `t-h2`, `t-h3`, `t-h4`, `t-lead`, `t-small`, `t-eyebrow`, `prose`
- Knapper og lenker: `btn`, `btn--light`, `btn--ghost`, `link` (med pil-svg), `link-2`, `badge`
- Blokker: `page-hero`, `section` (+ `--dark`, `--surface`, `--tight`), `section-head`, `text-block`, `split` (+ `--flip`), `media` + `ratio-*`, `media-row`, `grid-cards` + `line-card`, `cta-band`, `quote`, `dots-list`, `contact-people` + `person-card`
- Animasjon via attributter: `data-motion="rise"` (overskrift), `"ink"` (tekst mørkner ord for ord), `"iris"` (bilde åpner seg), `"up"` (barna glir inn)

## Regler

- Hver seksjonsoverskrift slutter med prikken: `<span class="nowrap">sisteord<span class="dot" aria-hidden="true"></span></span>`. Ikke skriv punktum, og ikke bruk prikken etter spørsmål (skriv om til påstand).
- Siden må fungere med «reduser bevegelse»: innhold skal aldri være skjult uten at animasjonen kjører. Scroll-effekter legges i `@media (prefers-reduced-motion: no-preference)` og i GSAP-blokken i `site.js`.
- Ingen eksterne kall: fonter og biblioteker ligger lokalt. Ikke legg til Google Fonts, CDN-er, sporing eller innebygde kart uten at Figment ber om det.
- Språk: norsk bokmål, aktivt og direkte, uten selgende vendinger og KI-aktige formuleringer. Ikke finn på kunder, resultater, sitater, tall eller kontaktinfo. Mangler noe, legg inn en HTML-kommentar og si fra.
- Bilder: legg dem i `assets/img/`, sett `width`/`height` og `alt`, og `loading="lazy"` for alt under første skjermbilde.
- Test på 375 og 1440 piksler, med og uten redusert bevegelse, og sjekk at konsollen er ren og at det ikke er vannrett scroll.

## Fakta

- Firma: Figment AS (registrert som Sonat Figment AS), org.nr. 930 185 817
- Oslo: Karl Johans gate 13, 0154 Oslo. Leder Lise Aasland Ursin, lise@figment.no, 466 64 240
- Bergen: C. Sundts gate 17 (Grieggården), 5004 Bergen. Leder Torstein Utne, torstein@figment.no, 966 26 365
- Felles e-post: hei@figment.no. Søknader sendes også dit (mailto-lenker på karrieresiden)
- Sonatgruppen: Figment, Sonat (sonat.no), These Ways (theseways.com)
