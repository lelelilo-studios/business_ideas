/* =============================================================================
   FEDATIA — Explorador de API (sandbox)
   -----------------------------------------------------------------------------
   Todo lo que ves acá corre en el navegador. No hay servidor. Los datos son
   ficticios pero verosímiles y los RUT son RESERVADOS: todos terminan en -K y
   ninguno cumple el módulo 11, así que ninguno puede colisionar con una empresa
   chilena real. Ese es un rasgo del sandbox real, no un atajo del demo.
   ========================================================================== */
(function () {
  'use strict';

  /* --- dígito verificador (módulo 11) — implementación de verdad ---------- */
  function dvDe(cuerpo) {
    var s = 0, m = 2, i;
    for (i = cuerpo.length - 1; i >= 0; i--) {
      s += parseInt(cuerpo.charAt(i), 10) * m;
      m = m === 7 ? 2 : m + 1;
    }
    var r = 11 - (s % 11);
    return r === 11 ? '0' : r === 10 ? 'K' : String(r);
  }
  function limpiar(v) { return (v || '').toUpperCase().replace(/[^0-9K]/g, ''); }
  function puntear(cuerpo) {
    var out = '', c = 0, i;
    for (i = cuerpo.length - 1; i >= 0; i--) {
      out = cuerpo.charAt(i) + out;
      if (++c % 3 === 0 && i > 0) out = '.' + out;
    }
    return out;
  }
  function formatear(v) {
    var s = limpiar(v);
    if (!s) return '';
    var dv = s.length > 1 ? s.slice(-1) : '';
    var cuerpo = s.length > 1 ? s.slice(0, -1) : s;
    cuerpo = cuerpo.slice(0, 8);
    return dv ? puntear(cuerpo) + '-' + dv : puntear(cuerpo);
  }

  /* --- catálogo de fuentes ------------------------------------------------ */
  var FUENTES = {
    diario_oficial:  { nom: 'Diario Oficial',            org: 'diarioficial.interior.gob.cl', cadencia: 'cada día, 06:00',  ventana: '24 h' },
    res:             { nom: 'Registro de Empresas y Sociedades', org: 'registrodeempresasysociedades.cl (Ley 20.659)', cadencia: 'cada día', ventana: '24 h' },
    sii:             { nom: 'SII — situación tributaria', org: 'zeus.sii.cl — consulta de terceros', cadencia: 'cada día', ventana: '24 h' },
    sii_dte:         { nom: 'SII — nómina DTE',           org: 'palena.sii.cl', cadencia: 'semanal', ventana: '7 días' },
    mercado_publico: { nom: 'Mercado Público',            org: 'api.mercadopublico.cl', cadencia: 'cada 6 h', ventana: '12 h' },
    chileproveedores:{ nom: 'ChileProveedores',           org: 'chileproveedores.cl', cadencia: 'semanal', ventana: '7 días' },
    inapi:           { nom: 'INAPI — marcas',             org: 'ion.inapi.cl', cadencia: 'semanal', ventana: '7 días' },
    cmf:             { nom: 'CMF',                        org: 'cmfchile.cl — registro de valores y entidades', cadencia: 'semanal', ventana: '7 días' },
    concursal:       { nom: 'Boletín Concursal',          org: 'boletinconcursal.cl', cadencia: 'cada día', ventana: '24 h' },
    dt:              { nom: 'Dirección del Trabajo',      org: 'dt.gob.cl — multas publicadas', cadencia: 'mensual', ventana: '30 días' },
    aduanas:         { nom: 'Aduanas',                    org: 'aduana.cl — comercio exterior', cadencia: 'mensual', ventana: '30 días' }
  };

  /* --- salud base de las fuentes ----------------------------------------- */
  function saludBase() {
    return {
      diario_oficial:  { e: 'ok', t: 'hace 8 h' },
      res:             { e: 'ok', t: 'hace 8 h' },
      sii:             { e: 'ok', t: 'hace 3 h' },
      sii_dte:         { e: 'ok', t: 'hace 2 d' },
      mercado_publico: { e: 'ok', t: 'hace 41 min' },
      chileproveedores:{ e: 'ok', t: 'hace 5 d' },
      inapi:           { e: 'ok', t: 'hace 2 d' },
      cmf:             { e: 'ok', t: 'hace 4 d' },
      concursal:       { e: 'ok', t: 'hace 9 h' },
      dt:              { e: 'ok', t: 'hace 12 d' },
      aduanas:         { e: 'ok', t: 'hace 21 d' }
    };
  }

  /* --- procedencia por bloque -------------------------------------------- */
  var PROC = {
    identidad: {
      fuente: 'diario_oficial',
      doc: 'Extracto de constitución — Diario Oficial N.º 42.312, CVE 1550231',
      capturado: '2026-07-13 06:04',
      estado: 'vigente',
      metodo: 'Descarga del PDF de la edición diaria → extracción del extracto con modelo → validación contra el texto original (RUT, razón social y capital se contrastan carácter a carácter).',
      hash: 'sha256:9f2c41e0…a7b3'
    },
    actividad: {
      fuente: 'sii',
      doc: 'Consulta de situación tributaria de terceros — RUT 76.543.210-K',
      capturado: '2026-07-13 11:12',
      estado: 'vigente',
      metodo: 'Consulta pública del SII, una petición por RUT, con caché de 24 h. Los códigos de actividad se normalizan contra el catálogo oficial del SII.',
      hash: 'sha256:2be9d7c1…0f14'
    },
    mercado_publico: {
      fuente: 'mercado_publico',
      doc: 'API de ChileCompra — órdenes de compra y licitaciones adjudicadas, ventana 24 meses',
      capturado: '2026-07-13 13:41',
      estado: 'vigente',
      metodo: 'API oficial con ticket. Se agregan las órdenes por RUT proveedor y se suman los montos netos. El estado hábil/inhábil viene de ChileProveedores, que es otra fuente y otra frescura.',
      hash: 'sha256:c40a19f5…88de'
    },
    marcas: {
      fuente: 'inapi',
      doc: 'Buscador de marcas de INAPI — titular RUT 76.543.210-K',
      capturado: '2026-07-11 04:02',
      estado: 'vigente',
      metodo: 'Consulta semanal por titular. Se distinguen marcas registradas y solicitudes en trámite; la fecha de vencimiento sale del registro, no se calcula.',
      hash: 'sha256:7d11ba90…3c62'
    },
    cmf: {
      fuente: 'cmf',
      doc: 'Registro de Valores y nómina de entidades fiscalizadas — CMF',
      capturado: '2026-07-09 05:30',
      estado: 'vigente',
      metodo: 'Descarga de las nóminas publicadas y cruce por RUT. Un "false" acá significa "no aparece en las nóminas al momento de la captura", no "no existe".',
      hash: 'sha256:11c8ef34…95a0'
    },
    concursal: {
      fuente: 'concursal',
      doc: 'Boletín Concursal (Superintendencia de Insolvencia y Reemprendimiento)',
      capturado: '2026-07-13 06:20',
      estado: 'vigente',
      metodo: 'Publicaciones diarias del Boletín, indexadas por RUT del deudor. Esto es publicidad legal obligatoria: no es DICOM ni información comercial.',
      hash: 'sha256:5a0e77bd…4412'
    },
    sanciones: {
      fuente: 'dt',
      doc: 'Multas administrativas publicadas por la Dirección del Trabajo',
      capturado: '2026-07-01 07:00',
      estado: 'vigente',
      metodo: 'Captura mensual. Marcado por_validar: no nos consta que la publicidad de estas multas sea completa ni que se mantengan publicadas indefinidamente. Lo decimos en la respuesta en vez de aparentar certeza.',
      hash: 'sha256:e8b3d052…7ff1'
    }
  };

  /* --- escenarios (RUT reservados del sandbox) ---------------------------- */
  var ESCENARIOS = {
    '76.543.210-K': {
      etiqueta: 'Perfil completo',
      http: 200, ms: 148, facturado: true,
      salud: saludBase(),
      cuerpo: function (o) {
        var r = {
          rut: '76.543.210-K',
          consultado_en: '2026-07-13T14:22:07Z',
          estado_respuesta: 'completo',
          facturado: true
        };
        if (o.identidad) r.identidad = {
          razon_social: 'Comercializadora Aysén Austral SpA',
          nombre_fantasia: 'Austral Foods',
          tipo: 'SpA',
          constitucion: '2019-03-12',
          capital_clp: 180000000,
          domicilio: 'Ruta 5 Sur 1450, Puerto Montt, Los Lagos',
          _meta: { fuente: 'diario_oficial', capturado: '2026-07-13T06:04:00Z', estado: 'vigente' }
        };
        if (o.actividad) r.actividad = {
          giro_principal: { codigo: '463000', glosa: 'Venta al por mayor de alimentos, bebidas y tabaco' },
          giros_secundarios: [{ codigo: '522190', glosa: 'Otras actividades de apoyo al transporte' }],
          inicio_actividades: '2019-03-20',
          situacion_tributaria: 'vigente',
          emite_dte: true,
          _meta: { fuente: 'sii', capturado: '2026-07-13T11:12:00Z', estado: 'vigente' }
        };
        if (o.mercado_publico) r.mercado_publico = {
          proveedor_estado: 'habil',
          inscrito_desde: '2020-06-11',
          ordenes_24m: 14,
          monto_adjudicado_24m_clp: 412680000,
          ultima_adjudicacion: {
            licitacion: '1057-42-LR24', organismo: 'JUNAEB',
            fecha: '2025-11-08', monto_clp: 186400000
          },
          _meta: { fuente: 'mercado_publico', capturado: '2026-07-13T13:41:00Z', estado: 'vigente' }
        };
        if (o.marcas) r.marcas = {
          registradas: [{ registro: '1284507', signo: 'AUSTRAL FOODS', clase: 29, vence: '2032-04-18' }],
          en_tramite: [{ solicitud: '1712930', signo: 'AF AUSTRAL', clase: 35, presentada: '2026-02-03' }],
          _meta: { fuente: 'inapi', capturado: '2026-07-11T04:02:00Z', estado: 'vigente' }
        };
        if (o.cmf) r.cmf = {
          inscrita_registro_valores: false,
          entidad_fiscalizada: false,
          _meta: { fuente: 'cmf', capturado: '2026-07-09T05:30:00Z', estado: 'vigente' }
        };
        if (o.concursal) r.concursal = {
          procedimientos_vigentes: 0,
          historial: [],
          _meta: { fuente: 'concursal', capturado: '2026-07-13T06:20:00Z', estado: 'vigente' }
        };
        if (o.sanciones) r.sanciones = {
          total: 1,
          detalle: [{
            organismo: 'Dirección del Trabajo', fecha: '2024-07-19',
            materia: 'No llevar registro de asistencia', monto_clp: 2180000,
            confianza: 'por_validar'
          }],
          _meta: { fuente: 'dt', capturado: '2026-07-01T07:00:00Z', estado: 'vigente' }
        };
        return r;
      }
    },

    '77.984.120-K': {
      etiqueta: 'Una fuente caída',
      http: 200, ms: 6042, facturado: false,
      motivo: 'Mercado Público no respondió. La respuesta viene incompleta y por eso no se cobra.',
      salud: (function () { var s = saludBase(); s.mercado_publico = { e: 'fa', t: 'falla desde hace 4 h' }; return s; })(),
      cuerpo: function (o) {
        var r = {
          rut: '77.984.120-K',
          consultado_en: '2026-07-13T14:23:11Z',
          estado_respuesta: 'parcial',
          facturado: false,
          avisos: ['La fuente mercado_publico no respondió tras 3 intentos. Esta consulta no se cobra.']
        };
        if (o.identidad) r.identidad = {
          razon_social: 'Constructora Valle del Elqui Limitada',
          nombre_fantasia: null,
          tipo: 'Ltda.',
          constitucion: '2016-11-07',
          capital_clp: 95000000,
          domicilio: 'Av. Balmaceda 1290, La Serena, Coquimbo',
          _meta: { fuente: 'diario_oficial', capturado: '2026-07-13T06:04:00Z', estado: 'vigente' }
        };
        if (o.actividad) r.actividad = {
          giro_principal: { codigo: '410010', glosa: 'Construcción de edificios para uso residencial' },
          giros_secundarios: [],
          inicio_actividades: '2016-11-22',
          situacion_tributaria: 'vigente',
          emite_dte: true,
          _meta: { fuente: 'sii', capturado: '2026-07-13T11:14:00Z', estado: 'vigente' }
        };
        if (o.mercado_publico) r.mercado_publico = {
          valor: null,
          _meta: {
            fuente: 'mercado_publico',
            estado: 'no_disponible',
            error: 'HTTP 503 en api.mercadopublico.cl · 3 intentos · último éxito 2026-07-13T10:05:00Z',
            ultimo_valor_conocido: '2026-07-13T10:05:00Z',
            como_obtenerlo: 'Reintente, o pase permitir_cache_vencida=true para recibir el último valor conocido marcado como vencido.'
          }
        };
        if (o.marcas) r.marcas = {
          registradas: [],
          en_tramite: [],
          _meta: { fuente: 'inapi', capturado: '2026-07-11T04:02:00Z', estado: 'vigente' }
        };
        if (o.cmf) r.cmf = {
          inscrita_registro_valores: false,
          entidad_fiscalizada: false,
          _meta: { fuente: 'cmf', capturado: '2026-07-09T05:30:00Z', estado: 'vigente' }
        };
        if (o.concursal) r.concursal = {
          procedimientos_vigentes: 0, historial: [],
          _meta: { fuente: 'concursal', capturado: '2026-07-13T06:20:00Z', estado: 'vigente' }
        };
        if (o.sanciones) r.sanciones = {
          total: 0, detalle: [],
          _meta: { fuente: 'dt', capturado: '2026-07-01T07:00:00Z', estado: 'vigente' }
        };
        return r;
      },
      /* Variante con permitir_cache_vencida=true */
      cuerpoCache: function (o) {
        var r = ESCENARIOS['77.984.120-K'].cuerpo(o);
        r.estado_respuesta = 'parcial_con_cache_vencida';
        r.avisos = ['mercado_publico se sirve desde caché vencida (4 h 18 min de antigüedad). Usted lo pidió con permitir_cache_vencida=true. La consulta no se cobra igual.'];
        if (o.mercado_publico) r.mercado_publico = {
          proveedor_estado: 'habil',
          inscrito_desde: '2019-02-28',
          ordenes_24m: 3,
          monto_adjudicado_24m_clp: 74200000,
          ultima_adjudicacion: {
            licitacion: '2311-8-LE25', organismo: 'Municipalidad de La Serena',
            fecha: '2025-06-30', monto_clp: 41900000
          },
          _meta: {
            fuente: 'mercado_publico', estado: 'vencido',
            capturado: '2026-07-13T10:05:00Z',
            ventana_prometida: '12 h', vencido_hace: '4 h 18 min',
            advertencia: 'No confíe en esto para decidir un pago. La fuente está caída y este valor puede haber cambiado.'
          }
        };
        return r;
      }
    },

    '79.612.043-K': {
      etiqueta: 'Un dato vencido',
      http: 200, ms: 132, facturado: false,
      motivo: 'La captura de INAPI tiene 41 días y la ventana prometida es de 7. El campo se entrega marcado como vencido y la consulta no se cobra.',
      salud: (function () { var s = saludBase(); s.inapi = { e: 'al', t: 'última captura hace 41 d' }; return s; })(),
      cuerpo: function (o) {
        var r = {
          rut: '79.612.043-K',
          consultado_en: '2026-07-13T14:24:52Z',
          estado_respuesta: 'completo_con_vencidos',
          facturado: false,
          avisos: ['1 campo fuera de su ventana de frescura (marcas). La consulta no se cobra.']
        };
        if (o.identidad) r.identidad = {
          razon_social: 'Transportes Punta Lobos SpA',
          nombre_fantasia: 'Punta Lobos',
          tipo: 'SpA',
          constitucion: '2014-05-21',
          capital_clp: 42000000,
          domicilio: 'Camino a Pichilemu km 8, Litueche, O’Higgins',
          _meta: { fuente: 'diario_oficial', capturado: '2026-07-13T06:04:00Z', estado: 'vigente' }
        };
        if (o.actividad) r.actividad = {
          giro_principal: { codigo: '492300', glosa: 'Transporte de carga por carretera' },
          giros_secundarios: [{ codigo: '522192', glosa: 'Servicios de agencias de transporte' }],
          inicio_actividades: '2014-06-02',
          situacion_tributaria: 'vigente',
          emite_dte: true,
          _meta: { fuente: 'sii', capturado: '2026-07-13T11:15:00Z', estado: 'vigente' }
        };
        if (o.mercado_publico) r.mercado_publico = {
          proveedor_estado: 'inhabil',
          motivo_inhabilidad: 'Sin inscripción vigente en ChileProveedores',
          inscrito_desde: null,
          ordenes_24m: 0,
          monto_adjudicado_24m_clp: 0,
          _meta: { fuente: 'mercado_publico', capturado: '2026-07-13T13:41:00Z', estado: 'vigente' }
        };
        if (o.marcas) r.marcas = {
          registradas: [{ registro: '1103488', signo: 'PUNTA LOBOS', clase: 39, vence: '2027-09-30' }],
          en_tramite: [],
          _meta: {
            fuente: 'inapi', estado: 'vencido',
            capturado: '2026-06-02T04:02:00Z',
            ventana_prometida: '7 días', vencido_hace: '34 días',
            causa: 'El buscador de INAPI cambió de formulario el 2026-06-03 y el adaptador quedó fuera de servicio. Reparación en curso.'
          }
        };
        if (o.cmf) r.cmf = {
          inscrita_registro_valores: false, entidad_fiscalizada: false,
          _meta: { fuente: 'cmf', capturado: '2026-07-09T05:30:00Z', estado: 'vigente' }
        };
        if (o.concursal) r.concursal = {
          procedimientos_vigentes: 1,
          historial: [{ tipo: 'Reorganización', rol: 'C-4120-2025', tribunal: '1.º Juzgado Civil de Rancagua', publicado: '2025-10-14', estado: 'en tramitación' }],
          _meta: { fuente: 'concursal', capturado: '2026-07-13T06:20:00Z', estado: 'vigente' }
        };
        if (o.sanciones) r.sanciones = {
          total: 2,
          detalle: [
            { organismo: 'Dirección del Trabajo', fecha: '2025-03-11', materia: 'Jornada de trabajo', monto_clp: 3400000, confianza: 'por_validar' },
            { organismo: 'Dirección del Trabajo', fecha: '2023-11-28', materia: 'Cotizaciones previsionales', monto_clp: 5820000, confianza: 'por_validar' }
          ],
          _meta: { fuente: 'dt', capturado: '2026-07-01T07:00:00Z', estado: 'vigente' }
        };
        return r;
      }
    },

    '78.455.901-K': {
      etiqueta: 'Sin inicio de actividades',
      http: 404, ms: 96, facturado: false,
      motivo: 'No encontramos la empresa. Una consulta sin resultado no se cobra.',
      salud: saludBase(),
      cuerpo: function () {
        return {
          error: 'empresa_no_encontrada',
          rut: '78.455.901-K',
          mensaje: 'El RUT es válido en forma, pero no aparece con inicio de actividades en el SII ni con constitución publicada.',
          fuentes_consultadas: ['sii', 'diario_oficial', 'res'],
          consultado_en: '2026-07-13T14:26:03Z',
          facturado: false,
          posibles_causas: [
            'Sociedad constituida pero sin inicio de actividades.',
            'RUT de persona natural (Fedatia no entrega datos de personas).',
            'RUT inexistente.'
          ]
        };
      }
    },

    '76.543.210-5': {
      etiqueta: 'Dígito verificador malo',
      http: 400, ms: 4, facturado: false,
      motivo: 'Ni siquiera salió del borde de la API. Un 400 nunca se cobra.',
      salud: saludBase(),
      cuerpo: function () {
        return {
          error: 'dv_invalido',
          rut_recibido: '76.543.210-5',
          dv_esperado: '3',
          mensaje: 'El dígito verificador no cumple el módulo 11. El RUT correcto para el cuerpo 76.543.210 es 76.543.210-3.',
          facturado: false
        };
      }
    }
  };

  /* --- respuesta 403 de personas ----------------------------------------- */
  function cuerpoPersonas(rut) {
    return {
      error: 'personas_no_disponibles',
      rut: rut,
      mensaje: 'Fedatia no entrega datos de personas naturales: ni nombres de socios, ni de representantes legales, ni sus RUT, ni sus domicilios. No es una limitación técnica. Es una decisión.',
      por_que: 'Que un dato esté publicado en el Diario Oficial no nos habilita a revenderlo para otro fin. Tratarlo exigiría un contrato de tratamiento con cada cliente, y este servicio se opera sin humanos que firmen contratos.',
      base_legal: 'Ley 19.628 y Ley 21.719 (entra en plena vigencia el 1 de diciembre de 2026 — por validar la fecha exacta de aplicación de cada artículo).',
      lo_que_si_entregamos: {
        representacion: {
          poderes_vigentes: true,
          cantidad_apoderados: 2,
          ultima_modificacion: '2023-08-04',
          _meta: { fuente: 'res', capturado: '2026-07-13T06:10:00Z', estado: 'vigente' }
        }
      },
      facturado: false
    };
  }

  /* --- render del JSON con procedencia ------------------------------------ */
  var ESTADO_CLASE = {
    vigente: 't-ok', completo: 't-ok', habil: 't-ok',
    vencido: 't-al', parcial: 't-al', obsoleto: 't-al',
    no_disponible: 't-fa', inhabil: 't-fa'
  };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function pintarValor(v, clave) {
    if (v === null) return '<span class="t-pun">null</span>';
    if (typeof v === 'boolean' || typeof v === 'number') return '<span class="t-num">' + v + '</span>';
    var cls = 't-txt';
    if (clave === 'estado' || clave === 'estado_respuesta' || clave === 'proveedor_estado' || clave === 'situacion_tributaria') {
      var k = String(v).replace('completo_con_vencidos', 'vencido').replace('parcial_con_cache_vencida', 'parcial');
      if (ESTADO_CLASE[k]) cls = ESTADO_CLASE[k];
    }
    if (clave === 'confianza' && v === 'por_validar') cls = 't-al';
    if (clave === 'error') cls = 't-fa';
    return '<span class="' + cls + '">"' + esc(v) + '"</span>';
  }

  function lineas(valor, sangria, claveP, salida, ruta) {
    var pad = new Array(sangria + 1).join('  ');
    var i, k, ks;
    if (Array.isArray(valor)) {
      if (valor.length === 0) { salida.push(pad + clavePre(claveP) + '<span class="t-pun">[]</span><span class="t-pun">,</span>'); return; }
      salida.push(pad + clavePre(claveP) + '<span class="t-pun">[</span>');
      for (i = 0; i < valor.length; i++) lineas(valor[i], sangria + 1, null, salida, ruta);
      salida.push(pad + '<span class="t-pun">],</span>');
      return;
    }
    if (valor && typeof valor === 'object') {
      var pin = '';
      if (valor._meta && claveP) {
        pin = ' <button class="pin" data-proc="' + esc(claveP) + '" aria-label="Ver procedencia de ' + esc(claveP) + '">' +
              '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.6c-2.2 0-4 1.8-4 4 0 2.9 4 8.8 4 8.8s4-5.9 4-8.8c0-2.2-1.8-4-4-4Z" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="5.6" r="1.4" fill="currentColor"/></svg>' +
              'procedencia</button>';
      }
      salida.push(pad + clavePre(claveP) + '<span class="t-pun">{</span>' + pin);
      ks = Object.keys(valor);
      for (i = 0; i < ks.length; i++) {
        k = ks[i];
        if (k === '_meta') continue;
        lineas(valor[k], sangria + 1, k, salida, ruta);
      }
      if (valor._meta) {
        var m = valor._meta, mk = Object.keys(m);
        salida.push(pad + '  <span class="t-com">"_meta"</span><span class="t-pun">: {</span>');
        for (i = 0; i < mk.length; i++) {
          salida.push(pad + '    <span class="t-com">"' + mk[i] + '"</span><span class="t-pun">: </span>' +
            pintarValor(m[mk[i]], mk[i]) + '<span class="t-pun">,</span>');
        }
        salida.push(pad + '  <span class="t-pun">},</span>');
      }
      salida.push(pad + '<span class="t-pun">},</span>');
      return;
    }
    salida.push(pad + clavePre(claveP) + pintarValor(valor, claveP) + '<span class="t-pun">,</span>');
  }
  function clavePre(k) {
    return k ? '<span class="t-cla">"' + esc(k) + '"</span><span class="t-pun">: </span>' : '';
  }

  function aHtml(obj) {
    var out = [];
    lineas(obj, 0, null, out, '');
    // limpia la coma final de cada cierre de nivel superior
    var txt = out.join('\n').replace(/,(\s*[}\]])/g, '$1').replace(/<span class="t-pun">,<\/span>(\n\s*<span class="t-pun">[}\]])/g, '$1');
    // quita la última coma colgante antes de un cierre
    txt = txt.replace(/<span class="t-pun">,<\/span>\n(\s*)<span class="t-pun">\}/g, '\n$1<span class="t-pun">}');
    txt = txt.replace(/<span class="t-pun">\},<\/span>\s*$/, '<span class="t-pun">}</span>');
    return txt;
  }

  /* --- estado de la UI ---------------------------------------------------- */
  var estado = {
    rut: '76.543.210-K',
    incluir: { identidad: true, actividad: true, mercado_publico: true, marcas: true, cmf: false, concursal: true, sanciones: true },
    personas: false,
    cacheVencida: false,
    lang: 'curl',
    ultima: null
  };

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  function paramsIncluir() {
    var v = Object.keys(estado.incluir).filter(function (k) { return estado.incluir[k]; });
    return v;
  }
  function urlActual() {
    var q = [];
    var inc = paramsIncluir();
    if (inc.length && inc.length < 7) q.push('incluir=' + inc.join(','));
    if (estado.personas) q.push('personas=true');
    if (estado.cacheVencida) q.push('permitir_cache_vencida=true');
    var rut = limpiar(estado.rut) ? formatear(estado.rut) : '{rut}';
    return 'https://api.fedatia.com/v1/empresas/' + rut + (q.length ? '?' + q.join('&') : '');
  }

  function pintarUrl() {
    var u = urlActual();
    $('#urlView').innerHTML =
      '<span class="metodo">GET</span> <span class="t-txt">' + esc(u.split('?')[0]) + '</span>' +
      (u.indexOf('?') > -1 ? '<span class="t-pun">?</span><span class="t-num">' + esc(u.split('?')[1]) + '</span>' : '');
    pintarSnippet();
  }

  function pintarSnippet() {
    var u = urlActual();
    var s;
    if (estado.lang === 'curl') {
      s = '<span class="t-cmd">curl</span> <span class="t-txt">"' + esc(u) + '"</span> \\\n' +
          '  -H <span class="t-txt">"Authorization: Bearer fd_test_9f4c…"</span>';
    } else if (estado.lang === 'node') {
      s = '<span class="t-cla">const</span> r = <span class="t-cla">await</span> <span class="t-cmd">fetch</span>(<span class="t-txt">"' + esc(u) + '"</span>, {\n' +
          '  headers: { Authorization: <span class="t-txt">"Bearer fd_test_9f4c…"</span> }\n' +
          '});\n' +
          '<span class="t-cla">const</span> empresa = <span class="t-cla">await</span> r.<span class="t-cmd">json</span>();\n' +
          '<span class="t-com">// cada bloque trae _meta con su fuente y su frescura</span>\n' +
          'console.<span class="t-cmd">log</span>(empresa.identidad._meta.fuente);';
    } else {
      s = '<span class="t-cla">import</span> httpx\n\n' +
          'r = httpx.<span class="t-cmd">get</span>(\n' +
          '    <span class="t-txt">"' + esc(u) + '"</span>,\n' +
          '    headers={<span class="t-txt">"Authorization"</span>: <span class="t-txt">"Bearer fd_test_9f4c…"</span>},\n' +
          ')\n' +
          'empresa = r.<span class="t-cmd">json</span>()\n' +
          '<span class="t-com"># si estado_respuesta != "completo", la consulta no se cobra</span>\n' +
          '<span class="t-cmd">print</span>(empresa[<span class="t-txt">"estado_respuesta"</span>], empresa[<span class="t-txt">"facturado"</span>])';
    }
    $('#snippet').innerHTML = s;
  }

  function pintarDv() {
    var s = limpiar(estado.rut);
    var caja = $('#dvAviso');
    if (s.length < 2) { caja.className = 'dv'; caja.textContent = 'Escriba un RUT o elija un caso.'; return; }
    var cuerpo = s.slice(0, -1), dv = s.slice(-1);
    var esperado = dvDe(cuerpo);
    var rutFmt = formatear(s);
    if (ESCENARIOS[rutFmt] && dv === 'K') {
      caja.className = 'dv dv--cob';
      caja.textContent = 'RUT reservado del sandbox. No cumple módulo 11 a propósito: así nunca choca con una empresa real.';
      return;
    }
    if (dv === esperado) {
      caja.className = 'dv dv--ok';
      caja.textContent = 'Dígito verificador correcto (módulo 11).';
    } else {
      caja.className = 'dv dv--fa';
      caja.textContent = 'Dígito verificador inválido. Para el cuerpo ' + puntear(cuerpo) + ' el DV correcto es ' + esperado + '.';
    }
  }

  /* --- envío -------------------------------------------------------------- */
  var enviando = false;
  function enviar() {
    if (enviando) return;
    var rutFmt = formatear(estado.rut);
    var esc_ = ESCENARIOS[rutFmt];
    var s = limpiar(estado.rut);
    var res, http, ms, facturado, motivo, salud;

    if (s.length < 2) return;

    if (estado.personas && esc_ && esc_.http === 200) {
      res = cuerpoPersonas(rutFmt); http = 403; ms = 6; facturado = false;
      motivo = 'El parámetro personas=true siempre responde 403. Está documentado y es a propósito.';
      salud = esc_.salud;
    } else if (!esc_) {
      var cuerpo = s.slice(0, -1), dv = s.slice(-1), esperado = dvDe(cuerpo);
      if (dv !== esperado) {
        res = { error: 'dv_invalido', rut_recibido: rutFmt, dv_esperado: esperado,
                mensaje: 'El dígito verificador no cumple el módulo 11.', facturado: false };
        http = 400; ms = 4; facturado = false;
        motivo = 'Un 400 nunca se cobra.';
      } else {
        res = { error: 'fuera_del_sandbox', rut_recibido: rutFmt,
                mensaje: 'Este RUT es válido, pero el sandbox sólo responde por sus RUT reservados (todos terminan en -K). En producción esta consulta iría contra las 11 fuentes.',
                ruts_de_prueba: Object.keys(ESCENARIOS), facturado: false };
        http = 422; ms = 5; facturado = false;
        motivo = 'El sandbox no inventa empresas. Si no la tiene, lo dice.';
      }
      salud = saludBase();
    } else {
      var inc = estado.incluir;
      if (esc_.cuerpoCache && estado.cacheVencida) res = esc_.cuerpoCache(inc);
      else res = esc_.cuerpo(inc);
      http = esc_.http; ms = esc_.ms; facturado = esc_.facturado; motivo = esc_.motivo; salud = esc_.salud;
    }

    estado.ultima = { res: res, http: http, ms: ms, facturado: facturado, motivo: motivo, rut: rutFmt };
    pintarSalud(salud);
    pintarRespuesta(estado.ultima);
    $('#panelVigilancia').classList.toggle('oculto', http !== 200);
    if (http === 200) $('#vigRut').textContent = rutFmt;
  }

  function pintarRespuesta(r) {
    var barra = $('#estadoResp');
    var clase = r.http === 200 ? 'eti--ok' : (r.http === 404 || r.http === 422 ? 'eti--al' : 'eti--fa');
    var txtHttp = r.http === 200 ? '200 OK' : r.http === 400 ? '400 Bad Request'
      : r.http === 403 ? '403 Forbidden' : r.http === 404 ? '404 Not Found' : '422 Unprocessable';
    barra.innerHTML =
      '<span class="eti ' + clase + '"><span class="punto"></span>' + txtHttp + '</span>' +
      '<span class="eti eti--gris">' + r.ms + ' ms</span>' +
      '<span class="eti ' + (r.facturado ? 'eti--cob' : 'eti--al') + '">' +
        (r.facturado ? 'facturada · 1 consulta' : 'NO facturada · $0') + '</span>';
    $('#motivoCobro').textContent = r.motivo || 'Respuesta completa dentro de su ventana de frescura. Se cobra 1 consulta.';
    $('#motivoCobro').className = 'motivo ' + (r.facturado ? '' : 'motivo--al');

    var pre = $('#respuesta');
    var html = aHtml(r.res);
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { pre.innerHTML = html; return; }

    // Revelado progresivo línea por línea: la respuesta se "arma".
    enviando = true;
    var ls = html.split('\n');
    pre.innerHTML = '';
    var i = 0;
    var paso = function () {
      if (i >= ls.length) { enviando = false; return; }
      var d = document.createElement('div');
      d.className = 'ln';
      d.innerHTML = ls[i] || '&nbsp;';
      pre.appendChild(d);
      i++;
      window.setTimeout(paso, 14);
    };
    paso();
  }

  function pintarSalud(s) {
    var cont = $('#salud');
    cont.innerHTML = Object.keys(FUENTES).map(function (k) {
      var f = FUENTES[k], e = (s && s[k]) || { e: 'ok', t: '—' };
      var cls = e.e === 'ok' ? 'eti--ok' : e.e === 'al' ? 'eti--al' : 'eti--fa';
      var txt = e.e === 'ok' ? 'al día' : e.e === 'al' ? 'vencida' : 'caída';
      return '<div class="fuente">' +
        '<div class="fuente__n">' + esc(f.nom) + '</div>' +
        '<div class="fuente__o mono">' + esc(f.org) + '</div>' +
        '<div class="fuente__e"><span class="eti ' + cls + '"><span class="punto"></span>' + txt + '</span>' +
        '<span class="peq mono">' + esc(e.t) + '</span></div>' +
        '</div>';
    }).join('');
  }

  /* --- hoja de procedencia ------------------------------------------------ */
  function abrirProc(bloque) {
    var p = PROC[bloque];
    var r = estado.ultima && estado.ultima.res;
    var meta = r && r[bloque] && r[bloque]._meta;
    if (!p && !meta) return;
    var f = FUENTES[(meta && meta.fuente) || (p && p.fuente)] || {};
    var filas = [];
    filas.push(['Campo', '<code>' + esc(bloque) + '</code>']);
    filas.push(['Fuente', esc(f.nom || '—')]);
    filas.push(['Origen', '<span class="mono peq">' + esc(f.org || '—') + '</span>']);
    if (p) filas.push(['Documento', esc(p.doc)]);
    if (meta && meta.capturado) filas.push(['Capturado', '<span class="mono">' + esc(meta.capturado) + '</span>']);
    filas.push(['Cadencia', esc(f.cadencia || '—')]);
    filas.push(['Ventana de frescura', esc((meta && meta.ventana_prometida) || f.ventana || '—')]);
    var est = (meta && meta.estado) || 'vigente';
    var ecls = est === 'vigente' ? 'eti--ok' : est === 'vencido' ? 'eti--al' : 'eti--fa';
    filas.push(['Estado', '<span class="eti ' + ecls + '"><span class="punto"></span>' + esc(est) + '</span>']);
    if (meta && meta.vencido_hace) filas.push(['Vencido hace', '<strong>' + esc(meta.vencido_hace) + '</strong>']);
    if (meta && meta.error) filas.push(['Error', '<span class="mono peq">' + esc(meta.error) + '</span>']);
    if (meta && meta.causa) filas.push(['Causa', esc(meta.causa)]);
    if (meta && meta.advertencia) filas.push(['Advertencia', esc(meta.advertencia)]);
    if (p) filas.push(['Método', esc(p.metodo)]);
    if (p) filas.push(['Hash del documento', '<span class="mono peq">' + esc(p.hash) + '</span>']);

    $('#procCuerpo').innerHTML = '<dl class="proc">' + filas.map(function (x) {
      return '<div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>';
    }).join('') + '</dl>';
    $('#hoja').classList.add('abierta');
    $('#hoja').setAttribute('aria-hidden', 'false');
    $('#cerrarHoja').focus();
  }
  function cerrarProc() {
    $('#hoja').classList.remove('abierta');
    $('#hoja').setAttribute('aria-hidden', 'true');
  }

  /* --- vigilancia / webhook ---------------------------------------------- */
  function dispararWebhook() {
    var rut = (estado.ultima && estado.ultima.rut) || '76.543.210-K';
    var payload = {
      evento: 'empresa.cambio',
      rut: rut,
      detectado_en: '2026-07-13T15:02:44Z',
      cambios: [{
        campo: 'mercado_publico.proveedor_estado',
        antes: 'habil',
        despues: 'inhabil',
        motivo: 'Inscripción en ChileProveedores vencida',
        _meta: { fuente: 'chileproveedores', capturado: '2026-07-13T15:01:10Z', estado: 'vigente' }
      }],
      firma: 'sha256=6b1f0a…c3d8'
    };
    $('#webhook').innerHTML = aHtml(payload);
    $('#webhookEstado').innerHTML =
      '<span class="eti eti--ok"><span class="punto"></span>entregado</span>' +
      '<span class="eti eti--gris">POST https://tu-app.cl/hooks/fedatia → 200</span>' +
      '<span class="eti eti--gris">312 ms</span>';
  }

  /* --- cableado ----------------------------------------------------------- */
  function init() {
    var input = $('#rutInput');

    input.addEventListener('input', function () {
      var pos = input.selectionStart, largoAntes = input.value.length;
      estado.rut = input.value;
      input.value = formatear(input.value);
      var delta = input.value.length - largoAntes;
      try { input.setSelectionRange(pos + delta, pos + delta); } catch (e) {}
      estado.rut = input.value;
      pintarDv(); pintarUrl();
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); enviar(); } });

    $$('[data-caso]').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-caso]').forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        estado.rut = b.dataset.caso;
        input.value = b.dataset.caso;
        pintarDv(); pintarUrl(); enviar();
      });
    });

    $$('[data-inc]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.inc;
        estado.incluir[k] = !estado.incluir[k];
        b.setAttribute('aria-pressed', estado.incluir[k] ? 'true' : 'false');
        pintarUrl(); enviar();
      });
    });

    $('#optPersonas').addEventListener('click', function () {
      estado.personas = !estado.personas;
      this.setAttribute('aria-pressed', estado.personas ? 'true' : 'false');
      pintarUrl(); enviar();
    });
    $('#optCache').addEventListener('click', function () {
      estado.cacheVencida = !estado.cacheVencida;
      this.setAttribute('aria-pressed', estado.cacheVencida ? 'true' : 'false');
      pintarUrl(); enviar();
    });

    $$('#tabsLang [role="tab"]').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('#tabsLang [role="tab"]').forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
        t.setAttribute('aria-selected', 'true');
        estado.lang = t.dataset.lang;
        pintarSnippet();
      });
    });

    $('#enviar').addEventListener('click', enviar);

    $('#respuesta').addEventListener('click', function (e) {
      var b = e.target.closest('[data-proc]');
      if (b) abrirProc(b.dataset.proc);
    });
    $('#cerrarHoja').addEventListener('click', cerrarProc);
    $('#velo').addEventListener('click', cerrarProc);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarProc(); });

    $('#simularCambio').addEventListener('click', dispararWebhook);

    input.value = estado.rut;
    pintarDv(); pintarUrl(); pintarSalud(saludBase()); enviar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
