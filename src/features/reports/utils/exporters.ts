// =====================================================
// PCMS - Report Exporters
//  - Excel: xuất CSV với BOM (Excel mở trực tiếp, hỗ trợ UTF-8 tiếng Việt)
//  - PDF:   mở print dialog với template riêng
// Không cần thêm dependency.
// =====================================================

export interface ReportColumn {
  header: string;
  key: string;
  format?: (value: unknown, row: Record<string, unknown>) => string;
}

export interface ReportPayload {
  title: string;
  subtitle?: string;
  generatedAt?: string;
  rows: Record<string, unknown>[];
  columns: ReportColumn[];
  summary?: { label: string; value: string }[];
}

/**
 * Xuất Excel (CSV UTF-8 BOM — Excel nhận diện đúng tiếng Việt có dấu).
 */
export function exportToExcel(payload: ReportPayload) {
  const headers = payload.columns.map((c) => csvEscape(c.header));
  const dataRows = payload.rows.map((row) =>
    payload.columns
      .map((c) => {
        const raw = row[c.key];
        const value = c.format ? c.format(raw, row) : String(raw ?? '');
        return csvEscape(value);
      })
      .join(',')
  );

  // BOM + UTF-8
  const lines = [headers.join(','), ...dataRows];
  const csv = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, fileName(payload, 'csv'));
}

/**
 * Mở print dialog với template in chuyên biệt cho báo cáo.
 * Browser "Save as PDF" sẽ tạo file PDF sạch.
 */
export function exportToPDF(payload: ReportPayload) {
  const html = buildPrintableHTML(payload);
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) {
    throw new Error('Popup bị chặn — cho phép popup để xuất PDF');
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  // Auto-trigger print
  win.addEventListener('load', () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 300);
  });
}

function fileName(payload: ReportPayload, ext: string): string {
  const safe = payload.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  return `${safe || 'bao-cao'}-${date}.${ext}`;
}

function csvEscape(value: string): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  // Escape nếu chứa dấu phẩy, nháy kép, hoặc xuống dòng
  if (/[",\r\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildPrintableHTML(payload: ReportPayload): string {
  const { title, subtitle, generatedAt, rows, columns, summary } = payload;
  const ts = generatedAt || new Date().toLocaleString('vi-VN');

  const summaryHTML = summary
    ? `<table class="summary">
        <tbody>
          ${summary.map((s) => `<tr><th>${s.label}</th><td>${s.value}</td></tr>`).join('')}
        </tbody>
      </table>`
    : '';

  const head = `<tr>${columns.map((c) => `<th>${c.header}</th>`).join('')}</tr>`;
  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((c) => {
            const raw = row[c.key];
            const v = c.format ? c.format(raw, row) : String(raw ?? '');
            return `<td>${escapeHTML(v)}</td>`;
          })
          .join('')}</tr>`
    )
    .join('');

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<title>${escapeHTML(title)}</title>
<style>
  @page { size: A4 landscape; margin: 1.2cm; }
  * { box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, sans-serif; color: #141d49; font-size: 11pt; line-height: 1.45; margin: 0; padding: 24px; }
  h1 { font-size: 20pt; margin: 0 0 4px; }
  .subtitle { color: #475089; margin: 0 0 4px; font-size: 10pt; }
  .meta { color: #6b75a8; font-size: 9pt; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  thead th { background: #f1f3f9; color: #1e2a5e; font-weight: 600; text-align: left; padding: 8px 10px; border: 1px solid #c5cce4; font-size: 10pt; }
  tbody td { padding: 7px 10px; border: 1px solid #e6e9f5; font-size: 10pt; }
  tbody tr:nth-child(even) { background: #f8f9fc; }
  table.summary { width: auto; margin-bottom: 12px; }
  table.summary th { background: transparent; border: none; padding: 4px 12px 4px 0; text-align: left; color: #475089; }
  table.summary td { border: none; padding: 4px 0; font-weight: 600; }
  footer { margin-top: 24px; color: #6b75a8; font-size: 8pt; text-align: center; }
</style>
</head>
<body>
  <h1>${escapeHTML(title)}</h1>
  ${subtitle ? `<p class="subtitle">${escapeHTML(subtitle)}</p>` : ''}
  <p class="meta">Phát hành: ${ts} · Hệ thống PCMS</p>
  ${summaryHTML}
  <table>
    <thead>${head}</thead>
    <tbody>${body || `<tr><td colspan="${columns.length}" style="text-align:center; padding:24px; color:#6b75a8;">Không có dữ liệu</td></tr>`}</tbody>
  </table>
  <footer>Báo cáo được tạo tự động từ PCMS · ${ts}</footer>
</body>
</html>`;
}

function escapeHTML(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
