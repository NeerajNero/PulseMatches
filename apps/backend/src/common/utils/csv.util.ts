import type { Response } from "express";

export type CsvCell = string | number | boolean | Date | null | undefined;
export type CsvRow = Record<string, CsvCell>;

const FORMULA_PREFIXES = ["=", "+", "-", "@"] as const;

export function createCsv(headers: string[], rows: CsvRow[]): string {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(","))
  ];

  return `\uFEFF${lines.join("\n")}\n`;
}

export function sendCsvResponse(response: Response, input: { filename: string; content: string }) {
  response.setHeader("Content-Type", "text/csv; charset=utf-8");
  response.setHeader("Content-Disposition", `attachment; filename="${sanitizeFilename(input.filename)}"`);
  response.send(input.content);
}

function escapeCsvCell(value: CsvCell): string {
  const raw = value instanceof Date ? value.toISOString() : value ?? "";
  const safe = protectFormulaCell(String(raw));
  return `"${safe.replace(/"/g, "\"\"")}"`;
}

function protectFormulaCell(value: string): string {
  const trimmedStart = value.trimStart();
  if (FORMULA_PREFIXES.some((prefix) => trimmedStart.startsWith(prefix))) {
    return `'${value}`;
  }
  return value;
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 160) || "export.csv";
}
