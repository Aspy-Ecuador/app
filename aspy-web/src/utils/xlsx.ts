// Libro de Excel (.xlsx) mínimo y sin dependencias: una hoja con encabezados, textos y números.
// Un .xlsx es un ZIP con unos pocos archivos XML; aquí se arma sin comprimir (los listados del sistema
// son pequeños). Reemplaza al .csv que se descargaba antes: en un Excel en español, un .csv separado
// por comas se abre todo en una sola columna.

export type CeldaXlsx = string | number | null | undefined;

export interface OpcionesXlsx {
  /** Nombre de la hoja (hasta 31 caracteres, sin : / ? * [ ]). */
  hoja?: string;
  /** Índices de las columnas con montos: sus números se muestran con dos decimales. */
  conDecimales?: number[];
}

const CABECERA = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const NS = "http://schemas.openxmlformats.org";

// ── ZIP sin compresión ───────────────────────────────────────────────────────

const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabla[n] = c >>> 0;
  }
  return tabla;
})();

function crc32(datos: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < datos.length; i++) c = TABLA_CRC[(c ^ datos[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Junta varios archivos en un ZIP (método "almacenar", sin comprimir). */
function zip(archivos: { nombre: string; datos: Uint8Array }[]) {
  const codificar = new TextEncoder();
  const partes: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let posicion = 0;
  // Fecha fija (1 de enero de 2026): el ZIP la exige, pero aquí no aporta nada
  const FECHA = ((2026 - 1980) << 9) | (1 << 5) | 1;

  for (const { nombre, datos } of archivos) {
    const nombreBytes = codificar.encode(nombre);
    const crc = crc32(datos);

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true); // versión necesaria
    local.setUint16(6, 0, true); // sin banderas
    local.setUint16(8, 0, true); // método 0: almacenar
    local.setUint16(10, 0, true); // hora
    local.setUint16(12, FECHA, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, datos.length, true);
    local.setUint32(22, datos.length, true);
    local.setUint16(26, nombreBytes.length, true);
    local.setUint16(28, 0, true);
    partes.push(new Uint8Array(local.buffer), nombreBytes, datos);

    const entrada = new DataView(new ArrayBuffer(46));
    entrada.setUint32(0, 0x02014b50, true);
    entrada.setUint16(4, 20, true); // hecho con
    entrada.setUint16(6, 20, true); // versión necesaria
    entrada.setUint16(8, 0, true);
    entrada.setUint16(10, 0, true);
    entrada.setUint16(12, 0, true);
    entrada.setUint16(14, FECHA, true);
    entrada.setUint32(16, crc, true);
    entrada.setUint32(20, datos.length, true);
    entrada.setUint32(24, datos.length, true);
    entrada.setUint16(28, nombreBytes.length, true);
    entrada.setUint16(30, 0, true); // extra
    entrada.setUint16(32, 0, true); // comentario
    entrada.setUint16(34, 0, true); // disco
    entrada.setUint16(36, 0, true); // atributos internos
    entrada.setUint32(38, 0, true); // atributos externos
    entrada.setUint32(42, posicion, true);
    central.push(new Uint8Array(entrada.buffer), nombreBytes);

    posicion += 30 + nombreBytes.length + datos.length;
  }

  const tamanoCentral = central.reduce((total, parte) => total + parte.length, 0);
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true);
  fin.setUint16(4, 0, true);
  fin.setUint16(6, 0, true);
  fin.setUint16(8, archivos.length, true);
  fin.setUint16(10, archivos.length, true);
  fin.setUint32(12, tamanoCentral, true);
  fin.setUint32(16, posicion, true);
  fin.setUint16(20, 0, true);

  const todo = [...partes, ...central, new Uint8Array(fin.buffer)];
  const salida = new Uint8Array(todo.reduce((total, parte) => total + parte.length, 0));
  let i = 0;
  for (const parte of todo) {
    salida.set(parte, i);
    i += parte.length;
  }
  return salida;
}

// ── XML de la hoja ───────────────────────────────────────────────────────────

/** Texto seguro dentro del XML: sin caracteres de control y con & < > " escapados. */
function escapar(texto: string): string {
  let limpio = "";
  for (const letra of texto) {
    const codigo = letra.codePointAt(0) ?? 0;
    // Se conservan el tabulador y los saltos de línea; los demás caracteres de control no son válidos en XML
    if (codigo >= 32 || codigo === 9 || codigo === 10 || codigo === 13) limpio += letra;
  }
  return limpio.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** "A", "B"… "Z", "AA"… a partir del número de columna (0 = A). */
function letraDeColumna(indice: number): string {
  let letras = "";
  for (let n = indice + 1; n > 0; n = Math.floor((n - 1) / 26)) letras = String.fromCharCode(65 + ((n - 1) % 26)) + letras;
  return letras;
}

/**
 * Arma el .xlsx: la primera fila son los encabezados (en negrita, fija al desplazarse y con el filtro de
 * Excel puesto). Los números van como números, para poder sumarlos y ordenarlos; lo demás, como texto.
 */
export function crearXlsx(encabezados: string[], filas: CeldaXlsx[][], opciones: OpcionesXlsx = {}) {
  const conDecimales = new Set(opciones.conDecimales ?? []);
  const hoja = (opciones.hoja ?? "Datos").replace(/[:/?*[\]]/g, " ").slice(0, 31) || "Datos";
  const columnas = encabezados.length;

  const celda = (valor: CeldaXlsx, fila: number, columna: number, estilo: number): string => {
    const referencia = `${letraDeColumna(columna)}${fila}`;
    if (typeof valor === "number" && Number.isFinite(valor)) return `<c r="${referencia}" s="${estilo}"><v>${valor}</v></c>`;
    const texto = valor === null || valor === undefined ? "" : String(valor);
    if (texto === "") return `<c r="${referencia}" s="${estilo}"/>`;
    return `<c r="${referencia}" s="${estilo}" t="inlineStr"><is><t xml:space="preserve">${escapar(texto)}</t></is></c>`;
  };

  const filasXml = [
    `<row r="1">${encabezados.map((titulo, c) => celda(titulo, 1, c, 1)).join("")}</row>`,
    ...filas.map((fila, f) => `<row r="${f + 2}">${Array.from({ length: columnas }, (_, c) => celda(fila[c], f + 2, c, conDecimales.has(c) && typeof fila[c] === "number" ? 2 : 0)).join("")}</row>`),
  ].join("");

  // Ancho de cada columna según su texto más largo (entre 8 y 50 caracteres)
  const anchos = encabezados.map((titulo, c) => {
    const largo = Math.max(titulo.length, ...filas.map((fila) => String(fila[c] ?? "").length));
    return Math.min(50, Math.max(8, largo + 2));
  });
  const ultima = `${letraDeColumna(Math.max(0, columnas - 1))}${filas.length + 1}`;

  const hojaXml =
    `${CABECERA}<worksheet xmlns="${NS}/spreadsheetml/2006/main">` +
    `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
    `<cols>${anchos.map((ancho, c) => `<col min="${c + 1}" max="${c + 1}" width="${ancho}" customWidth="1"/>`).join("")}</cols>` +
    `<sheetData>${filasXml}</sheetData>` +
    (columnas > 0 ? `<autoFilter ref="A1:${ultima}"/>` : "") +
    `</worksheet>`;

  const estilos =
    `${CABECERA}<styleSheet xmlns="${NS}/spreadsheetml/2006/main">` +
    `<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>` +
    `<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8F5FA"/><bgColor indexed="64"/></patternFill></fill></fills>` +
    `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` +
    `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
    `<cellXfs count="3">` +
    `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
    `<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>` +
    `<xf numFmtId="2" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
    `</cellXfs></styleSheet>`;

  const libro =
    `${CABECERA}<workbook xmlns="${NS}/spreadsheetml/2006/main" xmlns:r="${NS}/officeDocument/2006/relationships">` +
    `<bookViews><workbookView/></bookViews><sheets><sheet name="${escapar(hoja)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;

  const tipos =
    `${CABECERA}<Types xmlns="${NS}/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
    `</Types>`;

  const relaciones =
    `${CABECERA}<Relationships xmlns="${NS}/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="${NS}/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

  const relacionesDelLibro =
    `${CABECERA}<Relationships xmlns="${NS}/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="${NS}/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
    `<Relationship Id="rId2" Type="${NS}/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

  const codificar = new TextEncoder();
  return zip(
    [
      ["[Content_Types].xml", tipos],
      ["_rels/.rels", relaciones],
      ["xl/workbook.xml", libro],
      ["xl/_rels/workbook.xml.rels", relacionesDelLibro],
      ["xl/styles.xml", estilos],
      ["xl/worksheets/sheet1.xml", hojaXml],
    ].map(([nombre, xml]) => ({ nombre, datos: codificar.encode(xml) })),
  );
}
