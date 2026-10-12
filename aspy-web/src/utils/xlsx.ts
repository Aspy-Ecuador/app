// Libro de Excel (.xlsx) mínimo y sin dependencias: una hoja con encabezados, textos y números y,
// si se pide, un membrete con el logo arriba.
// Un .xlsx es un ZIP con unos pocos archivos XML; aquí se arma sin comprimir (los listados del sistema
// son pequeños). Reemplaza al .csv que se descargaba antes: en un Excel en español, un .csv separado
// por comas se abre todo en una sola columna.

export type CeldaXlsx = string | number | null | undefined;

/** Lo que va arriba de la tabla: el logo y hasta cuatro renglones (organización, título de la lista y dos más). */
export interface MembreteXlsx {
  /** Logo en PNG y el tamaño con que se dibuja, en píxeles de pantalla. */
  logo?: { png: Uint8Array; ancho: number; alto: number; descripcion?: string };
  lineas: string[];
}

export interface OpcionesXlsx {
  /** Nombre de la hoja (hasta 31 caracteres, sin : / ? * [ ]). */
  hoja?: string;
  /** Índices de las columnas con montos: sus números se muestran con dos decimales. */
  conDecimales?: number[];
  /** Con membrete, la tabla empieza en la fila 6 (los encabezados) y los datos, en la 7. */
  membrete?: MembreteXlsx;
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

/** Filas que ocupa el membrete encima de la tabla: cuatro renglones y uno de aire. */
const FILAS_DEL_MEMBRETE = 5;

/** Ancho aproximado, en píxeles, de una columna de Excel de `caracteres` de ancho (Calibri 11). */
const pixelesDeColumna = (caracteres: number) => Math.round(caracteres * 7 + 5);

/** Un píxel de pantalla en las unidades de los dibujos de Office (EMU). */
const EMU_POR_PIXEL = 9525;

/**
 * Arma el .xlsx. Los encabezados van en negrita sobre el azul oscuro de ASPY, fijos al desplazarse y con el
 * filtro de Excel puesto; los números van como números, para poder sumarlos y ordenarlos, y lo demás como texto.
 * Con `membrete`, arriba van el logo y los datos de la lista, y la tabla empieza más abajo (fila 6).
 */
export function crearXlsx(encabezados: string[], filas: CeldaXlsx[][], opciones: OpcionesXlsx = {}) {
  const conDecimales = new Set(opciones.conDecimales ?? []);
  const hoja = (opciones.hoja ?? "Datos").replace(/[:/?*[\]]/g, " ").slice(0, 31) || "Datos";
  const columnas = encabezados.length;
  const membrete = opciones.membrete;
  const logo = membrete?.logo;
  /** Fila de los encabezados de la tabla (1 sin membrete). */
  const filaTitulos = membrete ? FILAS_DEL_MEMBRETE + 1 : 1;

  const celda = (valor: CeldaXlsx, fila: number, columna: number, estilo: number): string => {
    const referencia = `${letraDeColumna(columna)}${fila}`;
    if (typeof valor === "number" && Number.isFinite(valor)) return `<c r="${referencia}" s="${estilo}"><v>${valor}</v></c>`;
    const texto = valor === null || valor === undefined ? "" : String(valor);
    if (texto === "") return `<c r="${referencia}" s="${estilo}"/>`;
    return `<c r="${referencia}" s="${estilo}" t="inlineStr"><is><t xml:space="preserve">${escapar(texto)}</t></is></c>`;
  };

  // Ancho de cada columna según su texto más largo (entre 8 y 50 caracteres)
  const anchos = encabezados.map((titulo, c) => {
    const largo = Math.max(titulo.length, ...filas.map((fila) => String(fila[c] ?? "").length));
    return Math.min(50, Math.max(8, largo + 2));
  });

  // El texto del membrete va en la primera columna que queda a la derecha del logo
  let columnaDelTexto = 0;
  if (logo) {
    let recorrido = 0;
    while (columnaDelTexto < columnas && recorrido < logo.ancho + 16) recorrido += pixelesDeColumna(anchos[columnaDelTexto++]);
  }
  // Estilos: 3 = nombre de la organización, 4 = título de la lista, 5 = lo demás
  const filasDelMembrete = membrete
    ? Array.from({ length: FILAS_DEL_MEMBRETE }, (_, i) => {
        const texto = i < 4 ? membrete.lineas[i] : undefined;
        const alto = i === 4 ? 8 : 21;
        return `<row r="${i + 1}" ht="${alto}" customHeight="1">${texto ? celda(texto, i + 1, columnaDelTexto, Math.min(i, 2) + 3) : ""}</row>`;
      })
    : [];

  const filasXml = [
    ...filasDelMembrete,
    `<row r="${filaTitulos}" ht="20" customHeight="1">${encabezados.map((titulo, c) => celda(titulo, filaTitulos, c, 1)).join("")}</row>`,
    ...filas.map((fila, f) => {
      const r = filaTitulos + 1 + f;
      return `<row r="${r}">${Array.from({ length: columnas }, (_, c) => celda(fila[c], r, c, conDecimales.has(c) && typeof fila[c] === "number" ? 2 : 0)).join("")}</row>`;
    }),
  ].join("");
  const ultima = `${letraDeColumna(Math.max(0, columnas - 1))}${filaTitulos + filas.length}`;

  const hojaXml =
    `${CABECERA}<worksheet xmlns="${NS}/spreadsheetml/2006/main" xmlns:r="${NS}/officeDocument/2006/relationships">` +
    `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${filaTitulos}" topLeftCell="A${filaTitulos + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
    `<cols>${anchos.map((ancho, c) => `<col min="${c + 1}" max="${c + 1}" width="${ancho}" customWidth="1"/>`).join("")}</cols>` +
    `<sheetData>${filasXml}</sheetData>` +
    (columnas > 0 ? `<autoFilter ref="A${filaTitulos}:${ultima}"/>` : "") +
    (logo ? `<drawing r:id="rId1"/>` : "") +
    `</worksheet>`;

  const estilos =
    `${CABECERA}<styleSheet xmlns="${NS}/spreadsheetml/2006/main">` +
    `<fonts count="5">` +
    `<font><sz val="11"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="14"/><color rgb="FF12263A"/><name val="Calibri"/></font>` +
    `<font><b/><sz val="12"/><color rgb="FF3A9AB8"/><name val="Calibri"/></font>` +
    `<font><sz val="9"/><color rgb="FF5D6B7C"/><name val="Calibri"/></font>` +
    `</fonts>` +
    // Encabezados de la tabla: el azul oscuro de ASPY (#12263A) con letra blanca
    `<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF12263A"/><bgColor indexed="64"/></patternFill></fill></fills>` +
    `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` +
    `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
    `<cellXfs count="6">` +
    `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
    `<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
    `<xf numFmtId="2" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
    `<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
    `<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
    `<xf numFmtId="0" fontId="4" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
    `</cellXfs></styleSheet>`;

  const libro =
    `${CABECERA}<workbook xmlns="${NS}/spreadsheetml/2006/main" xmlns:r="${NS}/officeDocument/2006/relationships">` +
    `<bookViews><workbookView/></bookViews><sheets><sheet name="${escapar(hoja)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;

  const tipos =
    `${CABECERA}<Types xmlns="${NS}/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    (logo ? `<Default Extension="png" ContentType="image/png"/>` : "") +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
    (logo ? `<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>` : "") +
    `</Types>`;

  const relaciones =
    `${CABECERA}<Relationships xmlns="${NS}/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="${NS}/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

  const relacionesDelLibro =
    `${CABECERA}<Relationships xmlns="${NS}/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="${NS}/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
    `<Relationship Id="rId2" Type="${NS}/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

  const codificar = new TextEncoder();
  const archivos: { nombre: string; datos: Uint8Array }[] = [
    ["[Content_Types].xml", tipos],
    ["_rels/.rels", relaciones],
    ["xl/workbook.xml", libro],
    ["xl/_rels/workbook.xml.rels", relacionesDelLibro],
    ["xl/styles.xml", estilos],
    ["xl/worksheets/sheet1.xml", hojaXml],
  ].map(([nombre, xml]) => ({ nombre, datos: codificar.encode(xml) }));

  if (logo) {
    // El logo es un dibujo anclado a la celda A1: la hoja apunta al dibujo y el dibujo, a la imagen
    const cx = Math.round(logo.ancho * EMU_POR_PIXEL);
    const cy = Math.round(logo.alto * EMU_POR_PIXEL);
    const DIBUJO = `${NS}/drawingml/2006`;
    const dibujo =
      `${CABECERA}<xdr:wsDr xmlns:xdr="${DIBUJO}/spreadsheetDrawing" xmlns:a="${DIBUJO}/main">` +
      `<xdr:oneCellAnchor><xdr:from><xdr:col>0</xdr:col><xdr:colOff>${6 * EMU_POR_PIXEL}</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>${6 * EMU_POR_PIXEL}</xdr:rowOff></xdr:from>` +
      `<xdr:ext cx="${cx}" cy="${cy}"/>` +
      `<xdr:pic><xdr:nvPicPr><xdr:cNvPr id="2" name="Logo" descr="${escapar(logo.descripcion ?? "Logo")}"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr>` +
      `<xdr:blipFill><a:blip xmlns:r="${NS}/officeDocument/2006/relationships" r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>` +
      `<xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic>` +
      `<xdr:clientData/></xdr:oneCellAnchor></xdr:wsDr>`;
    const relacionesDeLaHoja =
      `${CABECERA}<Relationships xmlns="${NS}/package/2006/relationships">` +
      `<Relationship Id="rId1" Type="${NS}/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/></Relationships>`;
    const relacionesDelDibujo =
      `${CABECERA}<Relationships xmlns="${NS}/package/2006/relationships">` +
      `<Relationship Id="rId1" Type="${NS}/officeDocument/2006/relationships/image" Target="../media/image1.png"/></Relationships>`;
    archivos.push(
      { nombre: "xl/worksheets/_rels/sheet1.xml.rels", datos: codificar.encode(relacionesDeLaHoja) },
      { nombre: "xl/drawings/drawing1.xml", datos: codificar.encode(dibujo) },
      { nombre: "xl/drawings/_rels/drawing1.xml.rels", datos: codificar.encode(relacionesDelDibujo) },
      { nombre: "xl/media/image1.png", datos: logo.png },
    );
  }

  return zip(archivos);
}
