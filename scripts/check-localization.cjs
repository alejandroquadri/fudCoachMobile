const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(
  fs.readFileSync('localization/registry.ts', 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } }
).outputText;
const context = { exports: {} };
vm.runInNewContext(code, context);
const { resolvePreferredLanguage: r, isLanguage } = context.exports;
assert.equal(
  r('system', [{ languageCode: 'fr' }, { languageCode: 'es' }]),
  'es'
);
assert.equal(
  r('system', [{ languageCode: 'en' }, { languageCode: 'es' }]),
  'en'
);
assert.equal(r('system', [{ languageCode: 'ja' }]), 'en');
assert.equal(r('en', [{ languageCode: 'es' }]), 'en');
assert.equal(r('es', [{ languageCode: 'en' }]), 'es');
assert.equal(isLanguage('__proto__'), false);
const en = JSON.parse(fs.readFileSync('localization/en.json'));
const es = JSON.parse(fs.readFileSync('localization/es.json'));
assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
for (const key of Object.keys(en))
  assert.ok(es[key].trim(), `Empty translation: ${key}`);
for (const [file, value] of [
  ['GoalScreen', 'Loose weight'],
  ['DietTypeScreen', 'Vegan'],
  ['OutcomeScreen', 'Have more energy'],
]) {
  assert.ok(
    fs
      .readFileSync(`screens/onboarding/${file}.tsx`, 'utf8')
      .includes(`renderOption('${value}')`)
  );
}
console.log(
  `Localization checks passed: ${Object.keys(en).length} paired translations, language resolution, safe canonical onboarding values.`
);

for (const language of Object.keys(context.exports.languages)) {
  const resource = JSON.parse(fs.readFileSync(`localization/${language}.json`));
  assert.deepEqual(Object.keys(resource).sort(), Object.keys(en).sort());
  for (const key of Object.keys(en)) assert.ok(resource[key].trim());
}
