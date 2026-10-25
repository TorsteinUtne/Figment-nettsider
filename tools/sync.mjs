#!/usr/bin/env node
/*
  Synkroniserer felles deler (header, footer, hode, skript) inn i alle sider.

  Bruk:  node tools/sync.mjs

  Hver side har markører som dette:
    <!-- partial:header -->  ...  <!-- /partial:header -->
  Alt mellom markørene byttes ut med innholdet i partials/header.html.

  I partial-filene:
    {{root}}  blir stien tilbake til roten («», «../» eller «../../»)
    data-nav="x" får aria-current="page" når siden har <body data-page="x">

  Sidene fungerer som de er også uten at skriptet kjøres. Kjør det bare når
  du har endret noe i partials/, eller når du har laget en ny side.
*/
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const skip = new Set(['.git', 'node_modules', 'partials', 'tools', 'assets']);

const partials = Object.fromEntries(
  readdirSync(join(root, 'partials'))
    .filter(name => name.endsWith('.html'))
    .map(name => [name.replace(/\.html$/, ''), readFileSync(join(root, 'partials', name), 'utf8').trim()])
);

const pages = [];
const walk = dir => {
  for (const name of readdirSync(dir)) {
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name === 'index.html') pages.push(path);
  }
};
walk(root);

let changed = 0;
for (const page of pages) {
  const depth = relative(root, page).split(sep).length - 1;
  const prefix = '../'.repeat(depth);
  const original = readFileSync(page, 'utf8');
  const current = original.match(/<body[^>]*data-page="([^"]+)"/)?.[1];
  let html = original;
  for (const [name, content] of Object.entries(partials)) {
    const pattern = new RegExp(`(<!-- partial:${name} -->)[\\s\\S]*?(<!-- /partial:${name} -->)`, 'g');
    let filled = content.replaceAll('{{root}}', prefix || './');
    if (current) filled = filled.replaceAll(`data-nav="${current}"`, `data-nav="${current}" aria-current="page"`);
    html = html.replace(pattern, `$1\n${filled}\n$2`);
  }
  if (html !== original) {
    writeFileSync(page, html);
    changed++;
    console.log('oppdatert', relative(root, page));
  }
}
console.log(`${pages.length} sider sjekket, ${changed} oppdatert.`);
