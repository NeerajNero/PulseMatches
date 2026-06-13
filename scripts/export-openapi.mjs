import { writeFile } from "node:fs/promises";

const apiUrl = process.env.OPENAPI_URL ?? "http://127.0.0.1:3010/docs-json";
const outputPath = process.env.OPENAPI_OUTPUT ?? "openapi.json";

const response = await fetch(apiUrl);

if (!response.ok) {
  throw new Error(`OpenAPI export failed: ${response.status} ${response.statusText}`);
}

const spec = await response.text();
await writeFile(outputPath, spec);
console.log(`OpenAPI spec written to ${outputPath}`);
