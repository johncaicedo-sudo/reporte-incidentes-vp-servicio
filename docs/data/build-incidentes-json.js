/**
 * build-incidentes-json.js
 *
 * Pre-procesa los CSVs de incidentes y genera JSONs listos para consumo:
 *   - incidentes-catalogo.json  → catálogo de apps con tribu/squad
 *   - incidentes-datos.json     → todos los incidentes normalizados
 *
 * Ejecutar: node docs/data/build-incidentes-json.js
 * Solo se necesita correr cuando el CSV cambie.
 */
const fs = require('fs');
const path = require('path');

const CSV_INCIDENTES = path.join(__dirname, 'incidentes-vp-servicio.csv');
const CSV_LISTAS = path.join(__dirname, 'incidentes-listas.csv');
const OUT_CATALOGO = path.join(__dirname, 'incidentes-catalogo.json');
const OUT_DATOS = path.join(__dirname, 'incidentes-datos.json');

// ── CSV parser robusto (maneja comillas, comas internas) ──
function parseCSV(text) {
  const lines = text.split('\n');
  const headers = csvLine(lines[0]);
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const vals = csvLine(line);
    if (vals.length < headers.length) continue;
    const obj = {};
    headers.forEach((h, idx) => (obj[h.trim()] = (vals[idx] || '').trim()));
    data.push(obj);
  }
  return data;
}

function csvLine(line) {
  const r = [];
  let c = '',
    q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          c += '"';
          i++;
        } else q = false;
      } else c += ch;
    } else {
      if (ch === '"') q = true;
      else if (ch === ',') {
        r.push(c);
        c = '';
      } else c += ch;
    }
  }
  r.push(c);
  return r;
}

// ── Parsear fecha dd/mm/yyyy → ISO string (o null) ──
function parseDate(s) {
  if (!s) return null;
  const p = s.split('/');
  if (p.length !== 3) return null;
  const d = new Date(+p[2], +p[1] - 1, +p[0]);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

// ── Main ──
console.log('Leyendo CSVs...');
const rawIncidentes = fs.readFileSync(CSV_INCIDENTES, 'utf8');
const rawListas = fs.readFileSync(CSV_LISTAS, 'utf8');

const allRaw = parseCSV(rawIncidentes);
const catRaw = parseCSV(rawListas);

// 1. Catálogo: app → { tribu, squad, estados, rango }
const catalogo = catRaw
  .map((c) => {
    const app = (c['Categoría / Ítem Configuración'] || '').trim();
    if (!app) return null;
    return {
      app,
      tribu: (c['Tribu'] || '').trim(),
      squad: (c['Squad'] || '').trim(),
      estado: (c['Estado'] || '').trim() || null,
      estadoHomologado: (c['Estado homologado'] || '').trim() || null,
      rango: (c['RANGO'] || '').trim() || null,
    };
  })
  .filter(Boolean);

const catMap = {};
catalogo.forEach((c) => {
  catMap[c.app] = { tribu: c.tribu, squad: c.squad };
});

// 2. Incidentes normalizados
const datos = allRaw.map((r) => {
  const app = (r['Categoría / Ítem Configuración'] || '').trim();
  const cat = catMap[app];
  const tribu = cat ? cat.tribu : (r['Tribu Informe'] || 'Sin Tribu').trim();
  const squad = cat ? cat.squad : (r['Squad'] || 'Sin Squad').trim();
  const estado = r['Estado homologado'] || r['Estado'] || '';
  const dias = parseInt(r['Duración (días)']) || 0;
  const agrupacion = r['Agrupación de atención'] || '';
  const mesCreacion = r['Año-Mes creación'] || '';
  const mesCierre =
    r['Mes cierre'] && r['Mes cierre'] !== '12/1899' ? r['Mes cierre'] : null;

  return {
    clave: r['Clave'] || '',
    resumen: r['Resumen'] || '',
    estado,
    creada: r['Creada'] || '',
    creadaISO: parseDate(r['Creada']),
    resuelta: r['Resuelta'] || '',
    resueltaISO: parseDate(r['Resuelta']),
    dias,
    app,
    tribu,
    squad,
    agrupacion,
    mesCreacion,
    mesCierre,
    anioCreacion: r['Año creación'] || '',
    resuelto: ['Resuelto', 'Cancelado'].includes(estado),
    vicepresidencia: r['Vicepresidencia  / Gerencia'] || '',
  };
});

// 3. Formato compacto: headers + rows (reduce ~60% vs JSON con keys repetidas)
const headers = [
  'clave','resumen','estado','creada','creadaISO','resuelta','resueltaISO',
  'dias','app','tribu','squad','agrupacion','mesCreacion','mesCierre',
  'anioCreacion','resuelto','vicepresidencia'
];
const rows = datos.map((d) => headers.map((h) => d[h]));

// 4. Escribir JSONs
fs.writeFileSync(OUT_CATALOGO, JSON.stringify(catalogo));
fs.writeFileSync(OUT_DATOS, JSON.stringify({ headers, rows }));

console.log(`✓ ${OUT_CATALOGO} → ${catalogo.length} registros`);
console.log(`✓ ${OUT_DATOS} → ${datos.length} registros`);

const sizeCSV = (fs.statSync(CSV_INCIDENTES).size / 1024).toFixed(1);
const sizeJSON = (fs.statSync(OUT_DATOS).size / 1024).toFixed(1);
console.log(`  CSV original: ${sizeCSV} KB → JSON compacto: ${sizeJSON} KB`);
console.log('Listo. Los reportes HTML y _classify.js pueden consumir estos JSONs.');
