/**
 * Genera incidentes-datos.json e incidentes-catalogo.json
 * a partir de incidentes-vp-servicio.csv
 */
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

function parseCSV(text) {
  const rows = [];
  let current = '';
  let inQuotes = false;
  for (const line of text.split('\n')) {
    if (inQuotes) { current += '\n' + line; } else { current = line; }
    inQuotes = ((current.match(/"/g) || []).length % 2 !== 0);
    if (!inQuotes) { rows.push(parseRow(current)); current = ''; }
  }
  return rows.filter(r => r.length > 1 || (r.length === 1 && r[0].trim()));
}
function parseRow(line) {
  const f = []; let field = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { if (q && line[i+1] === '"') { field += '"'; i++; } else q = !q; }
    else if (c === ',' && !q) { f.push(field.trim()); field = ''; }
    else field += c;
  }
  f.push(field.trim());
  return f;
}
function toISO(ddmmyyyy) {
  if (!ddmmyyyy) return null;
  const p = ddmmyyyy.split('/');
  if (p.length !== 3) return null;
  return `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`;
}

const csv = fs.readFileSync(path.join(DIR, 'incidentes-vp-servicio.csv'), 'utf-8');
const rows = parseCSV(csv);
const headers = rows[0];
const col = {}; headers.forEach((h, i) => col[h] = i);

const dataHeaders = ['clave','resumen','estado','creada','creadaISO','resuelta','resueltaISO','dias','app','tribu','squad','agrupacion','mesCreacion','mesCierre','anioCreacion','resuelto','vicepresidencia'];
const dataRows = [];
const appsSet = new Map();

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  if (!r || r.length < 5) continue;
  const clave = r[col['Clave']] || '';
  if (!clave) continue;
  const resumen = r[col['Resumen']] || '';
  const estadoH = r[col['Estado homologado']] || 'En progreso';
  const creada = r[col['Creada']] || '';
  const resuelta = r[col['Resuelta']] || '';
  const dias = parseInt(r[col['Duración (días)']] || '0') || 0;
  const app = r[col['Categoría / Ítem Configuración']] || '';
  const tribu = r[col['Tribu Informe']] || '';
  const squad = r[col['Squad']] || '';
  const agrupacion = r[col['Agrupación de atención']] || '';
  const mesCreacion = r[col['Año-Mes creación']] || '';
  const mesCierre = r[col['Mes cierre']] || '';
  const anio = r[col['Año creación']] || '';
  const vp = r[col['Vicepresidencia / Gerencia']] || '';
  const resuelto = ['Resuelto','Cancelado'].includes(estadoH);

  dataRows.push([clave, resumen, estadoH, creada, toISO(creada), resuelta, toISO(resuelta), dias, app, tribu, squad, agrupacion, mesCreacion, mesCierre, anio, resuelto, vp]);

  if (app && !appsSet.has(app)) appsSet.set(app, { app, tribu, squad });
}

const datosJson = JSON.stringify({ headers: dataHeaders, rows: dataRows });
fs.writeFileSync(path.join(DIR, 'incidentes-datos.json'), datosJson, 'utf-8');

const catalogo = Array.from(appsSet.values());
fs.writeFileSync(path.join(DIR, 'incidentes-catalogo.json'), JSON.stringify(catalogo), 'utf-8');

console.log(`Build OK: ${dataRows.length} registros, ${catalogo.length} apps en catalogo`);
