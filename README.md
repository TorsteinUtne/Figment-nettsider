# Figment – nettsider

Kildekoden til figment.no. Statiske HTML-sider uten byggesteg: last opp mappen til webhotellet, så er siden ute. Figment eier all kode og alt innhold.

Bygget på designmalen [Onda fra 8B](https://8b.com/templates/onda/) (MIT-lisens), tilpasset Figments struktur, farger og innhold.

## Sidene

| Side | Mappe | Innhold |
|---|---|---|
| Forside | `index.html` | Hero, hvem vi er, tjenester, tidslinje, utvalgte prosjekter, Sonatgruppen, karriere, kontaktpersoner, logokarusell |
| Våre tjenester | `tjenester/` | Fire tjenesteområder med tre nivåer hver, logokarusell med kunder |
| Prosjekter | `prosjekter/` | Liste med filter på bransje, og én undermappe per prosjekt |
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

**Kundelogoer.** Prosjektene viser kundens logo på en hvit flate. Logoene ligger i `assets/img/logoer/` og heter det samme som prosjektmappen, for eksempel `sammen.png`. Bruk PNG eller SVG med gjennomsiktig bakgrunn.

**Logokarusellen.** Den står både på forsiden og på tjenestesiden. Hver kunde er en `<li class="logo-tile">` i `index.html` og `tjenester/index.html`, så husk å endre begge. Har kunden logo, legg filen i `assets/img/logoer/` og bruk `<img>`. Uten logo står navnet som tekst. Kopien som får båndet til å gå rundt lages automatisk, så hver kunde skal bare stå én gang.

**Legge til et prosjekt.** Kopier en prosjektmappe, for eksempel `prosjekter/sammen/`, gi den nytt navn og bytt tekst og bilde. Legg så til et kort i `prosjekter/index.html` (og eventuelt på forsiden). `data-tags` på kortet styrer bransjefilteret. Et prosjekt kan ha flere bransjer, skilt med komma (`data-tags="helse,offentlig-sektor"`). Hver bransje må matche en knapp øverst i lista. Ny bransje: legg til en knapp.

**Legge til en ansatt.** Kopier en `<article class="member">`-blokk i `jobbe-i-figment/index.html`. Sitat legges inn der det står `SITAT` i en kommentar.

**Endre den roterende teksten i hero.** I `index.html`, under hero-blokken, står hver setning som en `<span class="rotator__item">`. «Vi» står fast foran. Legg til, fjern eller endre setninger, og oppdater `aria-label` på avsnittet så skjermlesere får hele teksten. Tiden mellom byttene settes med `data-interval` (millisekunder, nå 5000).

**Legge inn video i hero.** Legg videofilen i `assets/video/hero.mp4` og fjern kommentartegnene rundt `<video>` øverst på forsiden.

# Vedlikehold av figment.no

Slik jobber vi med nettsidene i dette prosjektet. Gjelder alle i teamet som har tilgang.

## Hvor ting ligger

- **Kode og innhold:** github.com/TorsteinUtne/Figment-nettsider (grenen `main`). Alt som er pushet til `main` er gjeldende versjon.
- **Oppbygging:** Statiske HTML-sider uten byggesteg. Les `README.md` (vanlige endringer) og `CLAUDE.md` (regler for Claude) i repoet.
- **Forhåndsvisning:** https://claude.ai/code/artifact/1cb1f157-55e9-4579-bf4a-989ba94a2f26 (artefaktet «Figment nettside», festet i sidepanelet). Dette er den faste adressen for forhåndsvisningen.

## Fast forhåndsvisning (regel for Claude)

- Det finnes ett forhåndsvisnings-artefakt for nettstedet, med adressen over. Claude publiserer alltid til denne adressen (Artifact publish med `url`), og lager aldri et nytt artefakt for nettsiden.
- Før publisering leser Claude artefaktet (Artifact read) og bygger videre på den publiserte versjonen.
- Etter hver endring i repoet oppdaterer Claude forhåndsvisningen på samme adresse, så lenken her alltid viser siste versjon.
- Det eldre artefaktet …/8bc139b6-2933-4345-a889-2959d4fd318c (23. oktober) er utdatert og skal ikke brukes.

## Slik ber du om en endring

1. Start en ny samtale i dette prosjektet.
2. Si hvilken side og hvilken del det gjelder, og hva som skal endres. Lim inn ny tekst ordrett hvis du har den. Legg ved bilder, logoer eller skjermbilder.
3. Claude gjør endringen, tester på mobil og PC, oppdaterer forhåndsvisningen og pusher til GitHub.

Eksempler:
- «Bytt ingressen på Karriere-siden til: …»
- «Legg til Statkraft i logokarusellen» (vedlegg logo, helst SVG eller PNG med gjennomsiktig bakgrunn)
- «Legg inn nytt prosjekt for X, med bransje offentlig sektor» (vedlegg tekst og logo)

## Avtaler og regler

- Tekst skrives på norsk bokmål, aktivt og direkte, uten selgende vendinger.
- Claude finner ikke på kunder, resultater, sitater, tall eller kontaktinfo. Mangler noe, settes det inn en kommentar i koden, og Claude sier fra.
- Overskrifter slutter med burgunder prikk, ikke punktum.
- Farger: mørk bakgrunn #18171e, flater #2b2934, hvit tekst, burgunder #9b2d4f på prikker, linjer og knapper.
- Illustrasjoner på tjenestene er blyantskisser i SVG, i sidens farger.
- Logokarusellen står både på forsiden og på tjenestesiden. Endres en kunde, må begge oppdateres.
- Felles header og footer endres i `partials/` og synkes med `node tools/sync.mjs`.

## GitHub-tilgang

For at Claude skal kunne pushe, må den som starter samtalen ha koblet sin GitHub-konto til Claude og ha skrivetilgang til repoet. Uten det kan Claude bare lese repoet, og endringene må pushes manuelt.

## Åpne punkter (25. oktober 2026)

- Logo for Vis mangler (står som tekst i karusellen).
- Helse Vest i karusellen viser logoen til Helse Vest IKT. Avklar om det skal være Helse Vest RHF.
- Logoen til Fiskeridirektoratet har grå flate og liten tekst. Bytt ved bedre versjon.
- Sitater fra ansatte mangler på «Å jobbe i Figment».
- «Ting vi har levert» på tjenestekortene på forsiden er et utkast som bør kvalitetssikres.
- Delingsbildet `og.jpg` (vises når siden deles i sosiale medier) er en plassholder.

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
