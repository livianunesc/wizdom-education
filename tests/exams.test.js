import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { exams, examYears } from "../src/exams-data.js";
const manifest = JSON.parse(readFileSync(new URL("../docs/enem-arquivos.json", import.meta.url), "utf8"));

test("biblioteca local: todas as 36 provas/gabaritos cadastrados existem e preservam o hash conferido", () => {
  assert.equal(manifest.length, 36);
  for (const record of manifest) {
    const bytes = readFileSync(new URL(`../${record.file}`, import.meta.url));
    assert.equal(bytes.subarray(0, 5).toString(), "%PDF-", record.file);
    assert.equal(bytes.length, record.bytes, record.file);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), record.sha256, record.file);
    assert.equal(record.blue_booklet_in_text, true);
    assert.equal(record.year_in_text_or_metadata, true);
  }
});
test("catálogo relaciona corretamente edição, dia e gabarito de nove anos locais", () => {
  assert.equal(examYears.length, 10);
  assert.equal(exams.length, 20);
  for (const exam of exams.filter((item) => item.proof)) {
    for (const [kind, key] of [["PV", "proof"], ["GB", "answer"]]) {
      const filename = exam[key].replace(/^\.\//, "");
      const record = manifest.find((item) => item.file === filename);
      assert.ok(record, filename);
      assert.equal(record.year, exam.year);
      assert.equal(record.day, exam.day);
      assert.equal(record.kind, kind);
    }
  }
  assert.equal(exams.filter((item) => item.proof).length, 18);
});
test("2016 identifica o formato anterior e acesso anual sem inventar arquivos locais", () => {
  const [first, second] = exams.filter((exam) => exam.year === 2016);
  assert.equal(first.proof, null);
  assert.equal(second.answer, null);
  assert.match(first.areas, /Humanas e Ciências da Natureza/);
  assert.match(second.areas, /Linguagens, Matemática e Redação/);
  assert.equal(first.duration, "4h30");
  assert.equal(second.duration, "5h30");
  assert.match(first.source, /gov\.br.*2016$/);
});
