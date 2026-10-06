import { test, expect } from "@playwright/test";
import { buildDemoConfirmation, demoLang } from "../../src/lib/demoConfirmation";

test("the visitor's site language picks the email language", () => {
  expect(demoLang("ru")).toBe("ru");
  expect(demoLang("es")).toBe("es");
  expect(demoLang("en")).toBe("en");
  expect(demoLang(undefined)).toBe("en");
});

test("each language is a founder letter, signed by Maks", () => {
  const en = buildDemoConfirmation({ lang: "en", name: "David Leone" });
  expect(en.from).toBe("Maks · Stroyka <hello@getstroyka.com>");
  expect(en.text.startsWith("Hi David,\n\nMaks here, founder of Stroyka.")).toBe(true);
  expect(en.text.endsWith("Maks\nFounder, Stroyka")).toBe(true);

  const ru = buildDemoConfirmation({ lang: "ru", name: "Станислав Шушляев" });
  expect(ru.from).toBe("Макс · Stroyka <hello@getstroyka.com>");
  expect(ru.text.startsWith("Здравствуйте, Станислав!\n\nЭто Макс, основатель Stroyka.")).toBe(true);

  const es = buildDemoConfirmation({ lang: "es", name: "Jair" });
  expect(es.text.startsWith("Hola, Jair:\n\nSoy Maks, fundador de Stroyka.")).toBe(true);
});

test("no template voice: no em-dash, no semicolon, no promised deadline, no 'team'", () => {
  for (const lang of ["en", "ru", "es"] as const) {
    const m = buildDemoConfirmation({ lang, name: "Ann" });
    expect(m.text).not.toContain("—");
    expect(m.text).not.toContain(";");
    expect(m.text).not.toMatch(/24/);
    expect(m.text.toLowerCase()).not.toContain("team");
  }
});

test("html carries the same words and escapes the name", () => {
  for (const lang of ["en", "ru", "es"] as const) {
    const m = buildDemoConfirmation({ lang, name: "Ann" });
    for (const line of m.text.split("\n").filter(Boolean)) {
      expect(m.html).toContain(line.replace(/'/g, "&#39;"));
    }
    expect(m.html).toContain(`<html lang="${lang}">`);
  }
  const x = buildDemoConfirmation({ lang: "en", name: "<img src=x onerror=alert(1)>" });
  expect(x.html).not.toContain("<img src=x");
});

test("a missing or one-letter name falls back to a plain greeting", () => {
  expect(buildDemoConfirmation({ lang: "en", name: "  " }).text.startsWith("Hi there,")).toBe(true);
  expect(buildDemoConfirmation({ lang: "ru", name: "a" }).text.startsWith("Здравствуйте!")).toBe(true);
});
