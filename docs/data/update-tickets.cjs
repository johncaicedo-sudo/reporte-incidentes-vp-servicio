/**
 * Actualiza el CSV de incidentes con datos frescos de Jira.
 * Solo modifica los campos "Estado", "Estado homologado" y "Resuelta"
 * para los tickets que cambiaron de estado.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const CSV_PATH = path.join(DIR, 'incidentes-vp-servicio.csv');

// Mapeo de estado Jira → Estado homologado
const ESTADO_HOMOLOGADO = {
  'Resuelto': 'Resuelto',
  'Cerrado': 'Resuelto',
  'Cancelado': 'Cancelado',
  'Pendiente': 'En progreso',
  'Abierto': 'En progreso',
  'Escalado': 'En progreso',
  'Esperando por ayuda': 'En progreso',
  'Trabajo en progreso': 'En progreso'
};

// Tickets con estado diferente a "Resuelto" (datos frescos de Jira)
const ticketsActualizados = new Map([
  ['MDSB-1040223', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1039924', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1039877', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1039798', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1039757', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1039744', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1039619', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1039600', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1039593', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1039319', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1039253', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1039243', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1039219', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1039053', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1038933', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1038872', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1038689', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1038653', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1038535', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1038349', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1038190', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1038140', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1038111', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1038104', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1037854', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1037824', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1037773', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1037628', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1037106', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1034768', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1033819', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1031484', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1028825', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1028178', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1027399', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1026952', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1026931', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1026312', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1025756', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1025500', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1025145', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1023980', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1023534', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1023304', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1023281', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1023252', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1021955', { estado: 'Cancelado', resolutiondate: null }],
  ['MDSB-1021015', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1020619', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1020334', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1020210', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1019456', { estado: 'Esperando por ayuda', resolutiondate: null }],
  ['MDSB-1019439', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1019427', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-1018390', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1017496', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1017419', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-1017340', { estado: 'Abierto', resolutiondate: null }],
  ['MDSB-988526', { estado: 'Escalado', resolutiondate: null }],
  ['MDSB-943409', { estado: 'Pendiente', resolutiondate: null }],
  ['MDSB-1008687', { estado: 'Cerrado', resolutiondate: null }],
]);

function parseCSV(text) {
  const rows = [];
  let current = '';
  let inQuotes = false;
  for (const line of text.split('\n')) {
    if (inQuotes) { current += '\n' + line; } else { current = line; }
    inQuotes = ((current.match(/"/g) || []).length % 2 !== 0);
    if (!inQuotes) { rows.push(current); current = ''; }
  }
  return rows;
}

function parseRow(line) {
  const f = [];
  let field = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') { field += '"'; i++; }
      else q = !q;
    } else if (c === ',' && !q) {
      f.push(field);
      field = '';
    } else {
      field += c;
    }
  }
  f.push(field);
  return f;
}

function fieldsToCSVLine(fields) {
  return fields.map(f => {
    if (f.includes(',') || f.includes('"') || f.includes('\n')) {
      return '"' + f.replace(/"/g, '""') + '"';
    }
    return f;
  }).join(',');
}

// Leer CSV
const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = parseCSV(csvContent);

// Parsear headers
const headers = parseRow(lines[0]);
const colEstado = headers.indexOf('Estado');
const colEstadoH = headers.indexOf('Estado homologado');
const colClave = headers.indexOf('Clave');
const colResuelta = headers.indexOf('Resuelta');
const colResolucion = headers.indexOf('Resolución');
const colAnoCierre = headers.indexOf('Año cierre');
const colMesCierre = headers.indexOf('Mes cierre');

console.log(`Columnas: Estado=${colEstado}, Estado homologado=${colEstadoH}, Clave=${colClave}, Resuelta=${colResuelta}`);

let actualizados = 0;
const outputLines = [lines[0]];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line || !line.trim()) {
    outputLines.push(line);
    continue;
  }

  const fields = parseRow(line);
  const clave = fields[colClave];

  if (ticketsActualizados.has(clave)) {
    const datos = ticketsActualizados.get(clave);
    const estadoAnterior = fields[colEstado];
    const nuevoEstado = datos.estado;
    const nuevoHomologado = ESTADO_HOMOLOGADO[nuevoEstado] || 'En progreso';

    fields[colEstado] = nuevoEstado;
    fields[colEstadoH] = nuevoHomologado;

    // Si no hay fecha de resolución y no es resuelto/cancelado, limpiar campos de cierre
    if (!datos.resolutiondate && nuevoHomologado !== 'Resuelto') {
      fields[colResuelta] = '';
      if (colResolucion >= 0 && colResolucion < fields.length) fields[colResolucion] = '';
      if (colAnoCierre >= 0 && colAnoCierre < fields.length) fields[colAnoCierre] = '1899';
      if (colMesCierre >= 0 && colMesCierre < fields.length) fields[colMesCierre] = '12/1899';
    }

    if (estadoAnterior !== nuevoEstado) {
      actualizados++;
    }

    outputLines.push(fieldsToCSVLine(fields));
  } else {
    outputLines.push(line);
  }
}

// Escribir CSV actualizado
const output = outputLines.join('\n');
fs.writeFileSync(CSV_PATH, output, 'utf-8');

console.log(`\nActualizacion completada:`);
console.log(`- Tickets en mapa: ${ticketsActualizados.size}`);
console.log(`- Tickets con cambio de estado: ${actualizados}`);
console.log(`- CSV actualizado: ${CSV_PATH}`);
