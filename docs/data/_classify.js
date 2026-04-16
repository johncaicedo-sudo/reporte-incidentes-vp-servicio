/**
 * _classify.js
 *
 * Clasifica incidentes por causa raíz usando heurísticas.
 * Consume los JSONs pre-procesados (generados por build-incidentes-json.js)
 * en vez de parsear CSVs en cada ejecución.
 *
 * Ejecutar: node docs/data/_classify.js
 * Prerequisito: node docs/data/build-incidentes-json.js
 */
const fs = require('fs');
const path = require('path');

const DATOS_PATH = path.join(__dirname, 'incidentes-datos.json');
const OUT_PATH = path.join(__dirname, 'analisis-causa-raiz.json');

if (!fs.existsSync(DATOS_PATH)) {
  console.error('No se encontró incidentes-datos.json. Ejecuta primero:');
  console.error('  node docs/data/build-incidentes-json.js');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(DATOS_PATH, 'utf8'));
const allData = raw.rows.map((row) => {
  const obj = {};
  raw.headers.forEach((h, i) => (obj[h] = row[i]));
  return obj;
});
const data2026 = allData.filter((r) => r.anioCreacion === '2026');
console.log('2026 tickets:', data2026.length);

const dtKw = ['error','falla','bug','no funciona','no carga','no genera','no muestra','no permite','bloqueo','timeout','intermitente','lentitud','no responde','master','poliza digital'];
const iiKw = ['servidor','infraestructura','red','dns','certificado','deploy','latencia','conectividad','file system','espacio','memoria','cpu','reinicio'];
const fcKw = ['acceso','usuario','permiso','rol','login','ingreso','clave','autoayuda','desconocimiento','control de accesos'];

const tickets = data2026.map((r) => {
  const res = (r.resumen || '').toLowerCase();
  const appLower = (r.app || '').toLowerCase();
  const dias = r.dias || 0;

  let causa = 'Falta de Capacitación',
    just = 'Clasificado por heurística.';

  if (iiKw.some((k) => res.includes(k) || appLower.includes(k))) {
    causa = 'Inestabilidad de Infraestructura';
    just = 'Keywords de infraestructura.';
  } else if (dtKw.some((k) => res.includes(k)) || (r.estado === 'En progreso' && dias > 7)) {
    causa = 'Deuda Técnica';
    just = 'Error de software o incidente prolongado.';
  } else if (fcKw.some((k) => res.includes(k) || appLower.includes(k)) || r.agrupacion === '1. En el mismo día') {
    causa = 'Falta de Capacitación';
    just = 'Problema de acceso/usuario.';
  }

  if (['Escalado'].includes(r.estado) && dias > 7) {
    causa = 'Deuda Técnica';
    just = 'Escalado >' + dias + ' días.';
  }

  const component = r.app.replace(/^[^-]+ - /, '');
  const rec =
    causa === 'Deuda Técnica' ? 'Revisar y corregir ' + component + '.' :
    causa === 'Falta de Capacitación' ? 'Crear guía de autoservicio para ' + component + '.' :
    causa === 'Inestabilidad de Infraestructura' ? 'Monitoreo proactivo para ' + component + '.' :
    'Actualizar docs de ' + component + '.';

  return {
    clave: r.clave,
    resumen: r.resumen,
    squad: r.squad,
    tribu: r.tribu,
    estado: r.estado,
    causaRaiz: causa,
    justificacion: just,
    componenteAfectado: component,
    recomendacion: rec,
    descripcionResumida: r.resumen,
    comentariosCount: 0,
    prioridad: 'Medium / Media',
  };
});

const stats = {};
tickets.forEach((t) => {
  stats[t.causaRaiz] = (stats[t.causaRaiz] || 0) + 1;
});
console.log('Stats:', JSON.stringify(stats));

fs.writeFileSync(
  OUT_PATH,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalAnalyzed: tickets.length,
      method: 'heuristic-json-2026',
      tickets,
    },
    null,
    2
  )
);
console.log('Saved', tickets.length, 'tickets →', OUT_PATH);
