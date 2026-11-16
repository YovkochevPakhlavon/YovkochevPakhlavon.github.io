// Tests for the Uzbek alphabet converter:  npm run test:uz
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertText, convertWord, convertFile } from './uz-new-alphabet.mjs';

test('letters: oʻ gʻ sh ch with every apostrophe variant', () => {
  assert.equal(
    convertText("o'zbek oʻqish o‘rta o`rganish o’quvchi"),
    'özbek öqiş örta örganiş öquvçi',
  );
  assert.equal(convertText("g'alaba gʻoya tog‘"), 'ğalaba ğoya toğ');
  assert.equal(convertText('shahar chiroq'), 'şahar çiroq');
});

test('uppercase: Sh, SH, Ch, CH, Oʻ, Gʻ', () => {
  assert.equal(
    convertText("Shahar SHAHAR Chiroq CHIROQ O'zbekiston G'ulom"),
    'Şahar ŞAHAR Çiroq ÇIROQ Özbekiston Ğulom',
  );
  assert.equal(convertText('OʻZBEKISTON'), 'ÖZBEKISTON');
});

test('ng stays n + g, tutuq becomes ʼ (U+02BC)', () => {
  assert.equal(convertText('ming tong'), 'ming tong');
  assert.equal(convertText("ma'no san'at ta’lim"), 'maʼno sanʼat taʼlim');
  assert.equal(convertWord('maʼno'), 'maʼno');
});

test('already converted text is unchanged', () => {
  const s =
    'Fizika kafedrasi assistenti, Samarqand davlat pedagogika instituti. Öqitiş, Naşrlar, Boğlaniş.';
  assert.equal(convertText(s), s);
});

test('English words, names, CamelCase and code are not touched', () => {
  assert.equal(
    convertText('Schwarzschild metric, research, GitHub, BlackPy, Yovkochev, `shell`'),
    'Schwarzschild metric, research, GitHub, BlackPy, Yovkochev, `shell`',
  );
});

test('symbols with subscripts are not touched', () => {
  assert.equal(
    convertText('Soya radiusi R_sh va r_ph, shahar'),
    'Soya radiusi R_sh va r_ph, şahar',
  );
});

test('URLs, e-mails, DOIs and paths are not touched', () => {
  const s =
    'https://shop.example.com/ch?x=1 mail@chimgan.uz 10.1016/j.aop.2026.chapter files/charts/sh.pdf research/tools';
  assert.equal(convertText(s), s);
  assert.equal(
    convertText('[maqola](https://chiroq.uz/shahar)'),
    '[maqola](https://chiroq.uz/shahar)',
  );
});

test('Markdown: front-matter keys stay, values and body change', () => {
  const src = "---\ntitle: O'qitish\nchips:\n  - Qora o'ralar\n---\n\nShahar va qishloq.\n";
  assert.equal(
    convertFile('src/content/pages/uz.md', src),
    '---\ntitle: Öqitiş\nchips:\n  - Qora öralar\n---\n\nŞahar va qişloq.\n',
  );
});

test('YAML: only values under uz keys', () => {
  const src =
    "title:\n  en: Teaching chapter\n  uz: O'qitish\nlevel:\n  uz: 4-kurs\nhours: '[Hours]'\n";
  assert.equal(
    convertFile('course.yaml', src),
    "title:\n  en: Teaching chapter\n  uz: Öqitiş\nlevel:\n  uz: 4-kurs\nhours: '[Hours]'\n",
  );
});

test('BibTeX: only fields ending in uz', () => {
  const src =
    "@phdthesis{key-shadow,\n  title = {Shadows of black holes},\n  titleuz = {Qora o'ralar soyasi},\n}\n";
  assert.equal(
    convertFile('pubs.bib', src),
    '@phdthesis{key-shadow,\n  title = {Shadows of black holes},\n  titleuz = {Qora öralar soyasi},\n}\n',
  );
});

test('non-Uzbek Markdown files are skipped', () => {
  assert.equal(convertFile('src/content/about/en.md', 'Shadow'), null);
});
