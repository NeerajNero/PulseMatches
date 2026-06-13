"use client";

import { useState } from "react";
import { downloadAuthenticatedCsv, type DownloadParams } from "@/lib/apis/download";

export function ExportCsvButton({
  label = "Export CSV",
  params,
  path
}: Readonly<{
  label?: string;
  params?: DownloadParams;
  path: string;
}>) {
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  async function onExport() {
    setError(null);
    setIsExporting(true);
    try {
      await downloadAuthenticatedCsv(path, params);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Unable to export CSV.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="export-action-group">
      <button className="secondary-action" type="button" disabled={isExporting} onClick={() => void onExport()}>
        {isExporting ? "Exporting" : label}
      </button>
      {error ? <p className="form-error export-error">{error}</p> : null}
    </div>
  );
}
