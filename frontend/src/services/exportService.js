export function exportToCSV(filename, headers, rows) {
  const processCell = (cell) => {
    if (cell === null || cell === undefined) return '""';
    const stringVal = String(cell).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const headerLine = headers.map(processCell).join(';');
  const dataLines = rows.map((row) => row.map(processCell).join(';'));
  const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(filename, data) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPrintableReport(title, subtitle, metadata = {}, headers = [], rows = []) {
  const printWindow = window.open('', '_blank', 'width=1000,height=750');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para gerar a impressão do relatório.');
    return;
  }

  const metaHtml = Object.entries(metadata)
    .map(
      ([key, val]) => `
      <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; border:1px solid #e2e8f0;">
        <span style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:600; display:block;">${key}</span>
        <span style="font-size:13px; font-weight:700; color:#0f172a;">${val}</span>
      </div>`
    )
    .join('');

  const headersHtml = headers
    .map(
      (h) => `<th style="padding:10px 12px; background:#237a32; color:#ffffff; font-size:11px; text-transform:uppercase; text-align:left; border-bottom:2px solid #185824;">${h}</th>`
    )
    .join('');

  const rowsHtml = rows
    .map(
      (r, idx) => `
      <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
        ${r.map((c) => `<td style="padding:8px 12px; font-size:12px; color:#334155;">${c !== null && c !== undefined ? c : '-'}</td>`).join('')}
      </tr>`
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <title>${title} - WebFarm 2.0</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; color: #1e293b; background: #ffffff; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #237a32; padding-bottom: 16px; margin-bottom: 20px; }
        .brand { font-size: 22px; font-weight: 800; color: #237a32; letter-spacing: -0.5px; }
        .tagline { font-size: 11px; color: #64748b; font-weight: 500; }
        .report-title { font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px; }
        .report-sub { font-size: 12px; color: #475569; margin-top: 2px; }
        .metadata-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">🌱 WebFarm 2.0</div>
          <div class="tagline">Gestão Agropecuária Inteligente • Fazenda Santa Maria</div>
          <div class="report-title">${title}</div>
          <div class="report-sub">${subtitle}</div>
        </div>
        <div style="text-align: right;">
          <button class="no-print" onclick="window.print()" style="background:#237a32; color:#fff; border:none; padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer; font-size:12px; margin-bottom:8px;">Imprimir / Salvar PDF</button>
          <div style="font-size:11px; color:#64748b;">Emissão: ${new Date().toLocaleString('pt-BR')}</div>
          <div style="font-size:11px; color:#64748b; font-family:monospace;">Autenticação: WF-${Math.random().toString(36).substring(2, 9).toUpperCase()}</div>
        </div>
      </div>

      ${metadata && Object.keys(metadata).length > 0 ? `<div class="metadata-grid">${metaHtml}</div>` : ''}

      <table>
        <thead>
          <tr>${headersHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="footer">
        <div>Documento gerado automaticamente pelo sistema WebFarm 2.0 • Propriedade de Fazenda Santa Maria</div>
        <div>Página 1 de 1 • Registro Válido</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
