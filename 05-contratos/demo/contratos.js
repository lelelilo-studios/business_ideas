/* ============================================================================
   ANTEFIRMA — Datos del demo.
   ----------------------------------------------------------------------------
   Los dos contratos están REDACTADOS, no resumidos. El lenguaje es el que
   efectivamente se usa en Chile (comparecencia, cláusulas ordinales, UF,
   escritura pública, tácita reconducción, boleta bancaria de garantía) y las
   trampas son trampas reales, tomadas de patrones que se repiten en contratos
   de arriendo de strip center y en contratos marco de suministro con retail.

   Las anotaciones están escritas para un dueño de PYME, no para un abogado.
   Cada una responde tres preguntas: qué dice, por qué te va a doler, y cuánto.

   Valor de la UF: fijo en el demo. En producción viene de mindicador.cl.
   ========================================================================== */

const UF_CLP = 40150; // UF supuesta al 11-jul-2026. En producción: API Banco Central.

const CONTRATOS = {

/* ══════════════════════════════════════════════════════ 1. ARRIENDO ══════ */
arriendo: {
  id: "arriendo",
  etiqueta: "Arriendo de local comercial",
  titulo: "Contrato de Arrendamiento de Local Comercial",
  archivo: "arriendo-local-14B-portal-quilin.pdf",
  paginas: 14,
  palabras: 6840,
  contraparte: "Inmobiliaria Costanera Sur SpA",
  contraparteRut: "76.412.883-9",
  cliente: "Comercial Pan de Nos Ltda.",
  clienteRut: "77.219.640-K",
  firmaPrevista: "2026-08-14",
  inicio: "2026-09-01",
  termino: "2029-08-31",

  encabezado:
    "En Santiago de Chile, a 14 de agosto de 2026, entre INMOBILIARIA COSTANERA SUR SpA, " +
    "rol único tributario N° 76.412.883-9, representada por don RODRIGO ILLANES BRAVO, cédula " +
    "nacional de identidad N° 12.884.501-7, ambos domiciliados en Avenida Apoquindo N° 4.501, " +
    "oficina 1802, comuna de Las Condes, en adelante e indistintamente “el Arrendador”; y " +
    "COMERCIAL PAN DE NOS LIMITADA, rol único tributario N° 77.219.640-K, representada por doña " +
    "PAULINA ÓRDENES RIQUELME, cédula nacional de identidad N° 16.402.773-2, ambos domiciliados " +
    "en Avenida Vicuña Mackenna N° 7.320, comuna de La Florida, en adelante “el Arrendatario”; " +
    "se ha convenido el siguiente contrato de arrendamiento:",

  // Aritmética del costo oculto. Alimenta el simulador de renta efectiva.
  economia: {
    rentaBaseUF: 62,
    umbralVentasUF: 900,      // sobre este monto se gatilla la renta variable
    tasaVariable: 0.08,       // 8% sobre el excedente
    tasaFondoPromo: 0.03,     // 3% sobre TODAS las ventas netas
    reajusteAnual: 0.03,      // 3% real anual, POR SOBRE la UF
    meses: 36,
    ventasSupuestasUF: 1100,  // supuesto declarado del escenario
    // Renta base ya reajustada, promediada en los 36 meses:
    // año 1: 62 · año 2: 63,86 · año 3: 65,78  →  (744 + 766,3 + 789,3)/36 = 63,88 UF
    rentaBasePromedioUF: 63.88
  },

  clausulas: [
    { n: 1, ord: "PRIMERO", titulo: "Individualización del inmueble",
      texto: "El Arrendador es dueño del local comercial N° 14-B, de una superficie útil aproximada de 96,4 metros cuadrados, ubicado en el primer nivel del centro comercial denominado “Strip Center Portal Quilín”, situado en Avenida Quilín N° 5.780, comuna de Peñalolén, Región Metropolitana, inscrito a fojas 4.812 número 3.109 del Registro de Propiedad del Conservador de Bienes Raíces de Santiago correspondiente al año 2019.",
      riesgo: null },

    { n: 2, ord: "SEGUNDO", titulo: "Destino del local",
      texto: "El local se destinará exclusivamente al giro de panadería, pastelería y cafetería, con venta de productos para consumo en el local y para llevar. El Arrendatario no podrá variar el destino ni ampliar el giro sin autorización previa y escrita del Arrendador, quien podrá denegarla a su solo arbitrio y sin expresión de causa. La infracción a esta cláusula se considerará incumplimiento grave y facultará al Arrendador para poner término inmediato al contrato.",
      riesgo: {
        nivel: "revisar", categoria: "Operación",
        titulo: "No puedes cambiar ni ampliar tu giro sin permiso, y te lo pueden negar porque sí",
        llano: "Arrendaste para vender pan, pastelería y café. Si en dos años quieres agregar almuerzos, delivery de sándwiches o vender tus productos a otro local, necesitas que el arrendador te autorice por escrito — y el contrato dice expresamente que puede decir que no “a su solo arbitrio y sin expresión de causa”. No tiene que darte ninguna razón.",
        duele: "Los negocios de comida cambian de mix constantemente porque es la única forma de sobrevivir. Este contrato te congela el modelo de negocio por 36 meses (o 72, si se renueva). Y como “ampliar el giro” es causal de término inmediato, un mall que quiera echarte tiene una excusa lista el día que agregues un producto fuera de la descripción.",
        plata: "No es una multa. Es un techo a tus ventas.",
        plataDetalle: "El costo aparece como ingresos que no vas a generar, no como un cargo en la factura. Por eso nadie lo ve al firmar.",
        redline: {
          original: "El Arrendatario no podrá variar el destino ni ampliar el giro sin autorización previa y escrita del Arrendador, quien podrá denegarla a su solo arbitrio y sin expresión de causa.",
          propuesto: "El Arrendatario no podrá variar el destino sin autorización previa y escrita del Arrendador, la que no podrá ser denegada sin causa razonable y fundada. Se entenderá comprendida dentro del giro autorizado la venta de alimentos preparados, bebidas y productos afines al rubro gastronómico, sin requerir autorización adicional. El Arrendador deberá pronunciarse dentro de 15 días hábiles; su silencio se entenderá como aprobación.",
          justificacion: "Dos cambios: (1) reemplazas “a su solo arbitrio” por “causa razonable y fundada”, que es el estándar habitual y te deja algo que reclamar; (2) defines el giro por categoría (rubro gastronómico) y no por lista cerrada, para no tener que pedir permiso cada vez que agregas un producto."
        }
      } },

    { n: 3, ord: "TERCERO", titulo: "Renta de arrendamiento",
      texto: "La renta mensual de arrendamiento será la cantidad equivalente a 62 Unidades de Fomento, más el Impuesto al Valor Agregado cuando corresponda, pagadera por mes anticipado dentro de los primeros cinco días corridos de cada mes, en el domicilio del Arrendador o mediante transferencia electrónica a la cuenta que éste indique. Adicionalmente, y sin perjuicio del reajuste propio de la Unidad de Fomento, la renta se reajustará en un tres por ciento (3%) cada doce meses contados desde el inicio de la vigencia del contrato.",
      riesgo: {
        nivel: "revisar", categoria: "Precio",
        titulo: "Te están cobrando el reajuste dos veces: la UF y un 3% adicional",
        llano: "La renta está en UF. La UF ya sube con la inflación — para eso existe. Pero además de eso, este contrato le suma un 3% cada 12 meses. O sea: pagas inflación, y después pagas un 3% real por encima de la inflación. Es un alza de arriendo automática, todos los años, aunque tus ventas no suban ni un peso.",
        duele: "Tu renta parte en 62 UF, el año 2 son 63,86 UF y el año 3 son 65,78 UF — en poder adquisitivo real, no nominal. Y si el contrato se renueva automáticamente (ver cláusula DÉCIMA), el 3% sigue componiendo sobre el nuevo piso. En 6 años la renta real sube 19,4%.",
        plata: "$2.715.345 de sobrecosto en los 36 meses",
        plataDetalle: "Año 2: 1,86 UF/mes extra × 12 = 22,32 UF. Año 3: 3,78 UF/mes × 12 = 45,31 UF. Total 67,63 UF × $40.150 = $2.715.345. Esto es lo que pagas de más contra un contrato solo en UF.",
        redline: {
          original: "Adicionalmente, y sin perjuicio del reajuste propio de la Unidad de Fomento, la renta se reajustará en un tres por ciento (3%) cada doce meses contados desde el inicio de la vigencia del contrato.",
          propuesto: "La renta se expresa en Unidades de Fomento, quedando con ello íntegramente reajustada. No procederá reajuste adicional alguno durante la vigencia del contrato ni de sus prórrogas.",
          justificacion: "La UF ya incorpora el reajuste por inflación. Pedir además un 3% real anual es cobrar dos veces. Si el arrendador insiste en un alza real, negocia que esté atada a un hito objetivo (por ejemplo, aumento del flujo de público certificado del centro comercial), no a un calendario."
        }
      } },

    { n: 4, ord: "CUARTO", titulo: "Renta variable sobre ventas",
      texto: "Sin perjuicio de la renta mínima establecida en la cláusula anterior, el Arrendatario pagará al Arrendador, a título de renta variable, un ocho por ciento (8%) sobre el monto de las ventas netas mensuales que excedan de 900 Unidades de Fomento. Para estos efectos, el Arrendatario deberá entregar al Arrendador, dentro de los primeros cinco días hábiles de cada mes, un certificado emitido por contador auditor que dé cuenta de las ventas netas del mes anterior. El Arrendador tendrá derecho a auditar los registros contables y los sistemas de punto de venta del Arrendatario en cualquier momento y sin aviso previo. El retardo en la entrega del certificado será sancionado con una multa de 10 Unidades de Fomento por cada mes de atraso.",
      riesgo: {
        nivel: "critico", categoria: "Precio",
        titulo: "Cuando te vaya bien, el arrendador se lleva el 8% — y te multa por no entregar un papel",
        llano: "Sobre 900 UF de ventas mensuales (unos $36 millones), el arrendador se lleva un 8% de todo lo que vendas por encima de ese piso. Además, tienes que entregarle todos los meses un certificado de un contador auditor con tus ventas. Si se te pasa la fecha, son 10 UF de multa ($401.500) por cada mes de atraso.",
        duele: "Dos cosas. Primero: el 8% se calcula sobre ventas NETAS, no sobre utilidad. Una panadería tiene márgenes de 8% a 15% sobre venta. Si vendes 1.100 UF y el arrendador se lleva 16 UF de las 200 UF que están sobre el umbral, se está llevando una fracción enorme de tu margen sobre ese tramo. Segundo: la multa de 10 UF por certificado atrasado es una multa por un trámite administrativo, no por un incumplimiento real. Es plata gratis para el arrendador, y con un mes ocupado se te pasa.",
        plata: "$23.126.400 en 36 meses (+ $401.500 por cada certificado atrasado)",
        plataDetalle: "Supuesto declarado: ventas de 1.100 UF/mes. Excedente sobre el umbral = 200 UF. 8% = 16 UF/mes = $642.400. × 36 meses = 576 UF = $23.126.400. La multa del certificado va aparte y no tiene tope de veces.",
        redline: {
          original: "El Arrendador tendrá derecho a auditar los registros contables y los sistemas de punto de venta del Arrendatario en cualquier momento y sin aviso previo. El retardo en la entrega del certificado será sancionado con una multa de 10 Unidades de Fomento por cada mes de atraso.",
          propuesto: "El Arrendador tendrá derecho a auditar los registros de ventas del Arrendatario hasta dos veces por año calendario, previo aviso escrito con al menos 10 días hábiles de anticipación y en horario que no interfiera la operación del local. El retardo en la entrega del certificado será sancionado con una multa de 2 Unidades de Fomento por cada mes de atraso, con un tope anual de 6 Unidades de Fomento, y sólo procederá si el Arrendador ha requerido previamente su entrega por escrito y el Arrendatario no ha subsanado dentro de 5 días hábiles.",
          justificacion: "Tres cosas: acotas la auditoría (frecuencia, aviso, horario), bajas la multa a un monto proporcional al daño real (que es cero: el arrendador no pierde nada porque le llegue el certificado tarde), le pones tope, y exiges un requerimiento previo para que la multa no se gatille sola. Además: pide subir el umbral de 900 UF — es el número que más te conviene mover y casi nadie lo negocia."
        }
      } },

    { n: 5, ord: "QUINTO", titulo: "Gastos comunes y fondo de promoción",
      texto: "Serán de cargo exclusivo del Arrendatario los gastos comunes del centro comercial, los que serán determinados y prorrateados por el administrador del centro comercial conforme al criterio que éste estime pertinente, sin que el Arrendatario pueda objetarlos. Formará parte de los gastos comunes un fondo de promoción y marketing del centro comercial, equivalente al tres por ciento (3%) de las ventas netas mensuales del Arrendatario. Los gastos comunes se pagarán conjuntamente con la renta y su no pago se considerará, para todos los efectos, como no pago de renta.",
      riesgo: {
        nivel: "critico", categoria: "Precio",
        titulo: "Gastos comunes sin tope, prorrateados “como el administrador estime”, y sin derecho a objetar",
        llano: "Los gastos comunes no tienen tope, no tienen fórmula, y no los puedes objetar. Los define el administrador del mall “conforme al criterio que estime pertinente”. Y dentro de ellos te meten un fondo de marketing que es un 3% de TODAS tus ventas — no del excedente, de todas.",
        duele: "El 3% de marketing es el cargo más caro del contrato y es el que nadie mira, porque va escondido dentro de “gastos comunes”. No es un porcentaje sobre utilidad ni sobre el excedente: es sobre cada peso que vendes, desde el primero. Y la frase “sin que el Arrendatario pueda objetarlos” te deja sin ninguna herramienta si el gasto común se dispara. Súmale que el no pago de gastos comunes cuenta como no pago de renta: o sea, es causal de término del contrato.",
        plata: "$47.698.200 en 36 meses — más que la mitad de la renta base",
        plataDetalle: "Supuesto declarado: ventas de 1.100 UF/mes. 3% = 33 UF/mes = $1.324.950. × 36 meses = 1.188 UF = $47.698.200. Los gastos comunes propiamente tales (aseo, seguridad, luz de pasillos) van APARTE y no son cuantificables porque el contrato no les pone tope. Ese es exactamente el problema.",
        redline: {
          original: "los que serán determinados y prorrateados por el administrador del centro comercial conforme al criterio que éste estime pertinente, sin que el Arrendatario pueda objetarlos. Formará parte de los gastos comunes un fondo de promoción y marketing del centro comercial, equivalente al tres por ciento (3%) de las ventas netas mensuales del Arrendatario.",
          propuesto: "los que serán prorrateados en proporción a la superficie útil del local respecto de la superficie útil arrendable total del centro comercial. El Arrendador entregará mensualmente el detalle de los gastos comunes con sus respaldos, y el Arrendatario podrá objetarlos fundadamente dentro de 15 días hábiles. Los gastos comunes no podrán exceder del 25% de la renta mínima mensual. El fondo de promoción y marketing será equivalente al 1% de las ventas netas mensuales, con un tope de 8 Unidades de Fomento mensuales, y el Arrendador deberá rendir cuenta anual de su uso.",
          justificacion: "Cuatro cosas, en orden de importancia: (1) TOPE a los gastos comunes como porcentaje de la renta — sin esto el contrato es un cheque en blanco; (2) fórmula objetiva de prorrateo (superficie), no “el criterio que estime”; (3) el fondo de marketing con tope en UF y rendición de cuentas; (4) derecho a objetar. Si el arrendador sólo te acepta una, pide el tope."
        }
      } },

    { n: 6, ord: "SEXTO", titulo: "Garantía",
      texto: "Para caucionar el fiel cumplimiento de las obligaciones que emanan del presente contrato, el Arrendatario entregará al Arrendador, al momento de la firma, una boleta bancaria de garantía a la vista, tomada a nombre del Arrendador, por un monto equivalente a tres rentas mensuales, esto es, 186 Unidades de Fomento. Dicha boleta deberá mantenerse vigente durante toda la vigencia del contrato y sus prórrogas, debiendo el Arrendatario renovarla con a lo menos treinta días de anticipación a su vencimiento. La no renovación oportuna de la boleta constituirá incumplimiento grave y facultará al Arrendador para poner término inmediato al contrato y para hacer efectiva la boleta vigente. La garantía será restituida dentro de los noventa días siguientes a la restitución material del inmueble, previa deducción de todos los cargos que procedan.",
      riesgo: {
        nivel: "critico", categoria: "Fecha que muerde",
        titulo: "Si no renuevas la boleta de garantía a tiempo, pierdes el contrato Y la boleta",
        llano: "Dejas una boleta bancaria de 186 UF ($7.467.900) en garantía. Tienes que renovarla con 30 días de anticipación cada vez que vence. Si se te pasa: el arrendador puede terminar el contrato de inmediato Y cobrar la boleta. Las dos cosas.",
        duele: "Esta es la cláusula que más seguido se activa por accidente, porque la boleta bancaria vence en una fecha que no coincide con nada más de tu operación y el banco no siempre te avisa. Es un plazo administrativo con consecuencia nuclear. Y ojo con el final: la garantía te la devuelven 90 días después de entregar el local, “previa deducción de todos los cargos que procedan” — o sea, el arrendador decide qué descuenta, y tú te enteras después.",
        plata: "$7.467.900 (la boleta) + la pérdida del local",
        plataDetalle: "186 UF × $40.150 = $7.467.900. Pero el costo real es perder el local: si te terminan el contrato por esto, además te aplican la multa de la cláusula DÉCIMO PRIMERA.",
        redline: {
          original: "La no renovación oportuna de la boleta constituirá incumplimiento grave y facultará al Arrendador para poner término inmediato al contrato y para hacer efectiva la boleta vigente. La garantía será restituida dentro de los noventa días siguientes a la restitución material del inmueble, previa deducción de todos los cargos que procedan.",
          propuesto: "El Arrendador deberá requerir por escrito la renovación de la boleta con al menos 30 días de anticipación a su vencimiento. Sólo si el Arrendatario no la renueva dentro de los 15 días hábiles siguientes a dicho requerimiento se configurará incumplimiento. La garantía será restituida dentro de los 30 días siguientes a la restitución material del inmueble. Las deducciones deberán ser detalladas y fundadas por escrito, y el Arrendatario podrá objetarlas dentro de 10 días hábiles.",
          justificacion: "Lo clave: que el arrendador tenga que AVISARTE antes de que el incumplimiento exista. Hoy el reloj corre solo y en silencio. Además baja el plazo de devolución de 90 a 30 días (90 días es plata tuya inmovilizada sin razón) y exige que las deducciones sean fundadas."
        }
      } },

    { n: 7, ord: "SÉPTIMO", titulo: "Horario de funcionamiento",
      texto: "El Arrendatario se obliga a mantener el local abierto al público durante la totalidad del horario de funcionamiento del centro comercial, esto es, de lunes a domingo entre las 10:00 y las 21:00 horas, incluidos festivos. El incumplimiento del horario será sancionado con una multa de 3 Unidades de Fomento por cada día en que el local permanezca cerrado, total o parcialmente, fuera de los casos de fuerza mayor debidamente acreditada.",
      riesgo: {
        nivel: "revisar", categoria: "Multa",
        titulo: "3 UF de multa por cada día cerrado. Sin tope. Incluye cierres parciales.",
        llano: "Tienes que abrir todos los días del año, incluidos festivos, de 10 a 21 horas. Cada día que cierres — o que cierres “parcialmente”, lo que sea que eso signifique — son 3 UF de multa ($120.450). No hay tope.",
        duele: "Piensa en las cosas normales que hacen cerrar un local: remodelas la cocina, se te quema el horno y esperas el repuesto, te enfermaste y no tienes quién atienda, hay un corte de agua en el sector. Todo eso son días de multa. Y “cierre parcial” es una definición tan vaga que un administrador molesto puede aplicarla porque cerraste dos horas antes un martes. Fíjate también que el 1 de enero, el 18 de septiembre y el 25 de diciembre son días en que probablemente no quieras abrir — y este contrato dice “incluidos festivos”.",
        plata: "$1.806.750 por una remodelación de 15 días",
        plataDetalle: "15 días × 3 UF = 45 UF × $40.150 = $1.806.750. Sin tope: 60 días cerrados serían 180 UF = $7.227.000.",
        redline: {
          original: "El incumplimiento del horario será sancionado con una multa de 3 Unidades de Fomento por cada día en que el local permanezca cerrado, total o parcialmente, fuera de los casos de fuerza mayor debidamente acreditada.",
          propuesto: "El incumplimiento del horario será sancionado con una multa de 1 Unidad de Fomento por cada día completo en que el local permanezca cerrado, con un tope anual de 15 Unidades de Fomento. No se aplicará multa en casos de fuerza mayor, cortes de suministro no imputables al Arrendatario, obras de mantención o remodelación del local previamente informadas al Arrendador con 10 días de anticipación (hasta 20 días corridos por año), ni en los días 1 de enero, 18 y 19 de septiembre y 25 de diciembre.",
          justificacion: "Baja el monto, ponle TOPE anual (una multa sin tope no es una multa, es una hipoteca), elimina la ambigüedad de “cierre parcial”, y reserva expresamente los días de remodelación y los festivos en que nadie espera que abras. El tope es lo más importante: sin tope, un problema operativo largo te puede costar más que la renta."
        }
      } },

    { n: 8, ord: "OCTAVO", titulo: "Seguros",
      texto: "El Arrendatario deberá contratar y mantener vigente durante toda la vigencia del contrato una póliza de seguro contra incendio, sismo y responsabilidad civil por un monto no inferior a 5.000 Unidades de Fomento, endosada a favor del Arrendador, debiendo acreditar su vigencia anualmente mediante certificado emitido por la compañía aseguradora.",
      riesgo: {
        nivel: "estandar", categoria: "Operación",
        titulo: "Estándar de mercado. Pero anótalo: es una fecha anual que se te va a olvidar.",
        llano: "Tienes que contratar seguro de incendio, sismo y responsabilidad civil por 5.000 UF, endosado al arrendador, y acreditarlo todos los años. Esto es completamente normal en un arriendo comercial.",
        duele: "No es abusivo, pero es una obligación con fecha que se olvida. El costo aproximado de una póliza así para un local de 96 m² en Santiago es de 8 a 14 UF al año. Presupuéstala.",
        plata: "≈ 11 UF/año ($441.650), estimación de mercado",
        plataDetalle: "Rango observado en pólizas comerciales para locales de 80–120 m² en la RM. Cotiza: la diferencia entre aseguradoras en este producto es grande.",
        redline: null
      } },

    { n: 9, ord: "NOVENO", titulo: "Mejoras",
      texto: "Todas las mejoras, obras, instalaciones y adherencias que el Arrendatario introduzca en el inmueble quedarán en beneficio del Arrendador desde el momento de su ejecución, sin derecho a indemnización, reembolso ni retiro alguno, aun cuando se trate de mejoras útiles o necesarias. El Arrendatario renuncia expresamente al derecho de retención que pudiere corresponderle.",
      riesgo: {
        nivel: "revisar", categoria: "Inversión",
        titulo: "Todo lo que instales queda para el arrendador. Incluidos los hornos.",
        llano: "Cualquier cosa que instales en el local — hornos, campana, cámara de frío, mesón, instalación eléctrica, piso — pasa a ser del arrendador apenas la instalas. Al irte no puedes llevártela ni te pagan nada por ella. Y renuncias al derecho de retención, que es la herramienta legal que te permitiría no entregar el local hasta que te paguen.",
        duele: "Habilitar una panadería con horno, cámara de frío y campana de extracción cuesta entre $18 y $40 millones. Esa inversión, tal como está redactada la cláusula, se la regalas al arrendador el día que la haces. Ojo con la palabra “adherencias”: en la práctica se discute si un horno es adherido o mueble, y esta redacción está escrita para que todo sea del arrendador.",
        plata: "El monto de tu habilitación. En una panadería, $18–40 millones.",
        plataDetalle: "Es tu inversión, no una multa. Pero al mes 36 no vas a poder recuperar nada de ella si te vas, y eso cambia por completo el cálculo de si el negocio te conviene.",
        redline: {
          original: "Todas las mejoras, obras, instalaciones y adherencias que el Arrendatario introduzca en el inmueble quedarán en beneficio del Arrendador desde el momento de su ejecución, sin derecho a indemnización, reembolso ni retiro alguno, aun cuando se trate de mejoras útiles o necesarias.",
          propuesto: "Las mejoras que accedan de manera permanente al inmueble y no puedan retirarse sin detrimento de éste quedarán en beneficio del Arrendador al término del contrato, sin derecho a indemnización. El Arrendatario conservará la propiedad de los bienes muebles, maquinarias y equipos que instale — incluyendo, sin que la enumeración sea taxativa, hornos, cámaras de frío, campanas de extracción, mobiliario y equipos de punto de venta — y podrá retirarlos al término del contrato, obligándose a reparar los daños que el retiro ocasione.",
          justificacion: "La distinción que importa es entre lo que se puede sacar y lo que no. El piso y la pintura, bueno, quédatelos. El horno de $12 millones no. Enumera expresamente tus equipos caros para que no haya discusión sobre si son “adherencias”."
        }
      } },

    { n: 10, ord: "DÉCIMO", titulo: "Plazo y renovación",
      texto: "El presente contrato regirá por el plazo de treinta y seis meses, contados desde el 1 de septiembre de 2026 hasta el 31 de agosto de 2029. Se entenderá renovado automática y tácitamente por períodos sucesivos e iguales de treinta y seis meses cada uno, en las mismas condiciones, salvo que cualquiera de las partes manifieste su voluntad de no renovarlo mediante carta certificada despachada ante Notario Público con una anticipación de a lo menos ciento veinte días corridos al vencimiento del período que se encuentre vigente. La comunicación enviada fuera de dicho plazo no producirá efecto alguno.",
      riesgo: {
        nivel: "critico", categoria: "Fecha que muerde",
        titulo: "Si no avisas antes del 3 de mayo de 2029, te amarras tres años más. Automáticamente.",
        llano: "El contrato dura 36 meses. Pero si no mandas una carta certificada ante notario avisando que no quieres renovar, y no la mandas al menos 120 días antes del vencimiento, el contrato se renueva solo por OTROS 36 meses. Y así indefinidamente. La fecha límite para avisar es el 3 de mayo de 2029.",
        duele: "Esta es la cláusula que hace daño de verdad, y es la que nadie anota en ningún calendario, porque el daño llega en tres años. El 3 de mayo de 2029 va a ser un jueves cualquiera. Nadie va a estar pensando en este contrato. Y si ese día pasa sin que mandes la carta, quedaste amarrado hasta 2032 — a 65,78 UF de renta base más 3% anual más el 8% de renta variable más el 3% de fondo de promoción. Si para entonces el local ya no te sirve, tu única salida es la cláusula DÉCIMO PRIMERA, que cuesta 12 rentas como mínimo.\n\nOjo con dos detalles más: la carta tiene que ir por carta certificada Y ante notario (no basta un correo, y no basta una carta simple), y son 120 días CORRIDOS, no hábiles.",
        plata: "Hasta $59.743.200 si necesitas salirte después",
        plataDetalle: "Si el contrato se renueva y al año siguiente necesitas salir, la multa de la cláusula DÉCIMO PRIMERA son las rentas que resten: 24 meses × 62 UF = 1.488 UF × $40.150 = $59.743.200. El costo de olvidar una carta.",
        redline: {
          original: "Se entenderá renovado automática y tácitamente por períodos sucesivos e iguales de treinta y seis meses cada uno, en las mismas condiciones, salvo que cualquiera de las partes manifieste su voluntad de no renovarlo mediante carta certificada despachada ante Notario Público con una anticipación de a lo menos ciento veinte días corridos al vencimiento.",
          propuesto: "Se entenderá renovado automática y tácitamente por períodos sucesivos de doce meses cada uno, salvo que cualquiera de las partes manifieste su voluntad de no renovarlo mediante comunicación escrita enviada al correo electrónico designado por cada parte o mediante carta certificada, con una anticipación de a lo menos sesenta días corridos al vencimiento del período vigente. El Arrendador deberá recordar por escrito al Arrendatario la proximidad de dicho plazo con al menos treinta días de antelación al inicio del período de aviso.",
          justificacion: "Tres cambios y los tres importan: (1) que la renovación sea por 12 meses y no por 36 — así el error de olvidar la carta te cuesta un año, no tres; (2) que baste un correo electrónico, no una carta ante notario (ese trámite existe para que sea difícil); (3) el recordatorio del arrendador. Si sólo consigues uno, consigue el primero.\n\nY hagas lo que hagas: anota el 3 de mayo de 2029 en tu calendario hoy mismo. Antefirma ya lo hizo por ti — está en la pestaña de Fechas."
        }
      } },

    { n: 11, ord: "DÉCIMO PRIMERO", titulo: "Término anticipado por el Arrendatario",
      texto: "En caso que el Arrendatario ponga término anticipado al contrato por cualquier causa que no sea imputable al Arrendador, deberá pagar a éste, a título de cláusula penal y sin necesidad de acreditar perjuicio alguno, una suma equivalente a la totalidad de las rentas que resten hasta el vencimiento del período que se encuentre vigente, con un mínimo de doce rentas mensuales. Lo anterior es sin perjuicio de la facultad del Arrendador de hacer efectiva la garantía y de perseguir la indemnización de los perjuicios adicionales que acredite.",
      riesgo: {
        nivel: "critico", categoria: "Multa",
        titulo: "Salirte cuesta todas las rentas que falten. Mínimo, 12 meses de arriendo.",
        llano: "Si te vas antes de tiempo — porque el local no funcionó, porque las ventas no dieron, porque te ofrecieron algo mejor, por lo que sea — tienes que pagar TODAS las rentas que falten hasta el final del período. Y aunque falte poco, el mínimo son 12 rentas. Además pueden cobrar la boleta de garantía y pedirte más plata encima.",
        duele: "Esto convierte un contrato de arriendo en una deuda de $89 millones desde el día que firmas. Y la asimetría es brutal: mira la cláusula DÉCIMO SEGUNDA — el arrendador puede terminar el contrato con 60 días de aviso, gratis, si decide remodelar el mall. Tú pagas 1.488 UF por irte; él se va gratis.\n\nEl escenario real: abres, las ventas del strip center no son las que te prometieron (esto pasa siempre), y al año descubres que el local no da. Cerrar te cuesta $59,7 millones. Así que sigues abierto perdiendo plata, porque cerrar cuesta más que seguir. Ese es el diseño de la cláusula.",
        plata: "$59.743.200 si te sales en el mes 12",
        plataDetalle: "Quedan 24 meses × 62 UF = 1.488 UF × $40.150 = $59.743.200. Si te sales en el mes 30, quedan 6 rentas, pero el mínimo de 12 te obliga igual a pagar 744 UF = $29.871.600.",
        redline: {
          original: "deberá pagar a éste, a título de cláusula penal y sin necesidad de acreditar perjuicio alguno, una suma equivalente a la totalidad de las rentas que resten hasta el vencimiento del período que se encuentre vigente, con un mínimo de doce rentas mensuales.",
          propuesto: "el Arrendatario podrá poner término anticipado al contrato mediante aviso escrito con 90 días de anticipación, pagando a título de cláusula penal única y total una suma equivalente a tres rentas mensuales. Transcurridos 18 meses de vigencia, dicha cláusula penal se reducirá a dos rentas mensuales. El Arrendador imputará a este pago la garantía vigente. El presente monto constituye la única indemnización a que tendrá derecho el Arrendador, renunciando éste a perseguir perjuicios adicionales por este concepto.",
          justificacion: "Esta es la redline más importante del contrato. Estás cambiando una deuda de hasta $59,7 millones por una de $7,5 millones (3 rentas). Argumentos que funcionan con el arrendador: (1) el daño real de que te vayas es el tiempo que el local queda vacío, y eso son 2 o 3 meses, no 24; (2) una cláusula penal desproporcionada puede ser reducida por un tribunal (art. 1544 del Código Civil, cláusula penal enorme), así que no le sirve tanto como cree; (3) ofrécele simetría — si él tiene salida barata (cláusula DÉCIMO SEGUNDA), tú también."
        }
      } },

    { n: 12, ord: "DÉCIMO SEGUNDO", titulo: "Término anticipado por el Arrendador",
      texto: "El Arrendador podrá poner término anticipado al presente contrato, sin expresión de causa y sin derecho a indemnización alguna para el Arrendatario, mediante aviso escrito con sesenta días de anticipación, en caso que resuelva ejecutar obras de remodelación integral, reconstrucción, ampliación o reconversión del centro comercial, o en caso de enajenación del inmueble a un tercero.",
      riesgo: {
        nivel: "critico", categoria: "Asimetría",
        titulo: "Él se va con 60 días de aviso y sin pagarte nada. Tú pagas 1.488 UF.",
        llano: "El arrendador puede terminar el contrato cuando quiera, con 60 días de aviso, sin pagarte un peso, si decide remodelar el mall o si vende el inmueble. Tú, para salirte, tienes que pagar hasta 24 rentas.",
        duele: "Lee las dos cláusulas juntas — la DÉCIMO PRIMERA y esta — y vas a ver el contrato como realmente es: un compromiso de 36 meses para ti, y un contrato a 60 días para él. Además, “enajenación del inmueble a un tercero” es una causal muy fácil de gatillar: basta con que el dueño venda. Y tú acabas de invertir $30 millones en habilitar el local, que además, según la cláusula NOVENA, ya no son tuyos.\n\nEl escenario que te arruina: habilitas el local, funciona, y al año 2 el mall se vende. 60 días y estás en la calle, sin indemnización, sin tus hornos, y con la inversión perdida.",
        plata: "Tu inversión completa de habilitación, con 60 días de aviso",
        plataDetalle: "$18–40 millones de habilitación + los meses que tardes en encontrar otro local + el valor de la clientela que se pierde. Nada de eso te lo pagan.",
        redline: {
          original: "El Arrendador podrá poner término anticipado al presente contrato, sin expresión de causa y sin derecho a indemnización alguna para el Arrendatario, mediante aviso escrito con sesenta días de anticipación",
          propuesto: "El Arrendador podrá poner término anticipado al presente contrato, mediante aviso escrito con seis meses de anticipación, únicamente en caso que ejecute obras de remodelación integral que impidan materialmente la operación del local, debiendo en tal caso pagar al Arrendatario, a título de indemnización única, una suma equivalente al valor no amortizado de las mejoras e instalaciones ejecutadas por éste (amortizadas linealmente en 60 meses) más tres rentas mensuales. La enajenación del inmueble no constituirá causal de término, obligándose el Arrendador a que el adquirente respete el presente contrato en todos sus términos.",
          justificacion: "Dos cosas no negociables: (1) que la venta del inmueble NO sea causal de término — se resuelve con una cláusula de respeto del contrato por el comprador, es estándar y el arrendador no tiene buen argumento para negarse; (2) que si te sacan para remodelar, te paguen la inversión que no alcanzaste a amortizar. Sin esto, tu habilitación es una apuesta a que al arrendador no se le ocurra remodelar."
        }
      } },

    { n: 13, ord: "DÉCIMO TERCERO", titulo: "Prohibición de ceder y cambio en la propiedad",
      texto: "Se prohíbe al Arrendatario ceder, transferir, subarrendar o entregar a cualquier título el uso o goce del inmueble, total o parcialmente. Se entenderá que existe cesión del contrato, para todos los efectos legales, cualquier acto o conjunto de actos que importe la transferencia de más del treinta por ciento de los derechos sociales o acciones del Arrendatario, o el cambio de su controlador. La infracción a esta cláusula constituirá incumplimiento grave y facultará al Arrendador para poner término inmediato al contrato, haciendo efectiva la cláusula penal establecida en la cláusula DÉCIMO PRIMERA.",
      riesgo: {
        nivel: "critico", categoria: "Sociedad",
        titulo: "Si entra un socio nuevo o levantas capital, es causal de término del contrato",
        llano: "No puedes subarrendar — eso es normal. Pero fíjate en la segunda parte: si vendes más del 30% de tu sociedad, o si cambia el controlador, el contrato considera que “cediste el contrato” y el arrendador puede terminarlo de inmediato Y cobrarte la multa de 1.488 UF.",
        duele: "Esta es la trampa moderna y casi nadie la ve. Piensa en todo lo que gatilla esta cláusula: entra un socio inversionista, un hermano compra el 40%, te asocias con un proveedor, vendes el negocio, o simplemente reorganizas la sociedad por tema tributario. Cualquiera de esas cosas — que son cosas normales y sanas de un negocio que crece — te puede costar el local y $59,7 millones de multa.\n\nY el peor caso: quieres VENDER tu panadería. El comprador va a hacer due diligence, va a leer esta cláusula, y va a descubrir que comprar tu sociedad significa perder el local. Eso destruye el valor de venta de tu negocio.",
        plata: "$59.743.200 de multa + la pérdida del local + tu negocio pasa a ser invendible",
        plataDetalle: "La multa es la de la cláusula DÉCIMO PRIMERA. Pero el daño más grande no es la multa: es que esta cláusula, tal como está, hace que tu empresa no se pueda vender ni capitalizar sin permiso del arrendador.",
        redline: {
          original: "Se entenderá que existe cesión del contrato, para todos los efectos legales, cualquier acto o conjunto de actos que importe la transferencia de más del treinta por ciento de los derechos sociales o acciones del Arrendatario, o el cambio de su controlador.",
          propuesto: "No se considerará cesión del contrato la transferencia de derechos sociales o acciones del Arrendatario, ni el ingreso de nuevos socios o accionistas, ni las reorganizaciones societarias, siempre que se mantenga el mismo giro y se informe al Arrendador dentro de los 30 días siguientes. El Arrendatario podrá ceder el presente contrato a un tercero que continúe el mismo giro, previa autorización del Arrendador, la que no podrá ser denegada sin causa razonable y fundada, considerándose causa razonable únicamente la insuficiencia de solvencia acreditada del cesionario.",
          justificacion: "El cambio societario y el arriendo son cosas distintas y no tienen por qué estar amarradas. Al arrendador le importa que le paguen la renta y que el local siga operando en el mismo giro — eso es lo que hay que garantizarle, no el control de quiénes son tus socios. Y el derecho a ceder el contrato (con aprobación no arbitraria) es lo que le devuelve valor de venta a tu negocio."
        }
      } },

    { n: 14, ord: "DÉCIMO CUARTO", titulo: "Competencia y arbitraje",
      texto: "Cualquier dificultad o controversia que se produzca entre las partes respecto de la aplicación, interpretación, duración, validez o ejecución del presente contrato será sometida a arbitraje, conforme al Reglamento Procesal de Arbitraje del Centro de Arbitraje y Mediación de Santiago. Las partes confieren poder especial irrevocable a la Cámara de Comercio de Santiago A.G. para que designe a un árbitro arbitrador en cuanto al procedimiento y al fallo, en contra de cuyas resoluciones las partes renuncian desde ya a todos los recursos que les pudieren corresponder. Los honorarios del árbitro y los gastos del procedimiento serán de cargo de la parte que resulte vencida.",
      riesgo: {
        nivel: "revisar", categoria: "Conflicto",
        titulo: "Si tienes que pelear, cuesta plata que probablemente no tienes",
        llano: "Cualquier pelea se resuelve en un arbitraje del Centro de Arbitraje y Mediación de Santiago (CAM), con un árbitro arbitrador cuyo fallo no se puede apelar. Los honorarios del árbitro los paga el que pierde.",
        duele: "El arbitraje no es abusivo en sí — es lo normal en contratos comerciales en Chile y suele ser más rápido que un juicio. El problema es asimétrico: los honorarios del árbitro en el CAM pueden ir de 50 a 150 UF ($2 a $6 millones), y eso hay que anticiparlo aunque después lo recuperes. Una inmobiliaria puede financiar eso sin pestañear. Una panadería no.\n\nEn la práctica, esto significa que si el arrendador te cobra mal los gastos comunes por $3 millones, no te conviene pelear, porque pelear cuesta más. Y él lo sabe.",
        plata: "50–150 UF ($2.007.500 a $6.022.500) para poder reclamar",
        plataDetalle: "Rango de honorarios de árbitro del CAM Santiago según cuantía. Súmale abogado. Verifica el arancel vigente antes de firmar.",
        redline: {
          original: "Los honorarios del árbitro y los gastos del procedimiento serán de cargo de la parte que resulte vencida.",
          propuesto: "Previo al arbitraje, las partes se someterán obligatoriamente a una mediación ante el Centro de Arbitraje y Mediación de Santiago, cuyo costo será soportado por partes iguales. Las controversias cuya cuantía no exceda de 500 Unidades de Fomento serán conocidas por los Tribunales Ordinarios de Justicia del domicilio del Arrendatario. Los honorarios del árbitro y los gastos del procedimiento serán soportados por partes iguales, sin perjuicio de lo que resuelva el árbitro sobre costas.",
          justificacion: "La clave es sacar del arbitraje los conflictos chicos — que son los que realmente vas a tener (un cobro mal hecho de gastos comunes, una multa mal aplicada). Con un umbral de 500 UF, esos van a tribunales ordinarios, donde pelear es barato. Y agrega mediación previa: resuelve la mayoría de las cosas sin costo."
        }
      } },

    { n: 15, ord: "DÉCIMO QUINTO", titulo: "Solemnidades y gastos",
      texto: "El presente contrato se otorgará por escritura pública. Todos los gastos, impuestos, derechos notariales y de inscripción que origine el presente contrato y su eventual término serán de cargo exclusivo del Arrendatario.",
      riesgo: {
        nivel: "estandar", categoria: "Costo",
        titulo: "Los gastos de notaría los pagas tú. Es lo habitual, pero presupuéstalo.",
        llano: "El contrato va por escritura pública ante notario, y todos los gastos notariales los pagas tú, incluidos los del término.",
        duele: "Es la práctica de mercado y no vale la pena pelearla. Solo anótalo en el presupuesto: una escritura pública de arriendo comercial cuesta entre $180.000 y $400.000 según la notaría y la cuantía. Ojo con la frase “y su eventual término”: eso significa que si el contrato se termina, la escritura de término también la pagas tú.",
        plata: "$180.000 – $400.000, estimación",
        plataDetalle: "Arancel notarial referencial 2026 para escritura de arriendo comercial. Varía por notaría; conviene cotizar en dos.",
        redline: null
      } }
  ],

  obligaciones: [
    { id: "a1", fecha: "2026-07-16", titulo: "Renovar la boleta bancaria de garantía",
      clausula: 6, nivel: "critico", responsable: "Paulina Órdenes (gerencia)",
      detalle: "La boleta bancaria de 186 UF ($7.467.900) vence el 15 de agosto. El contrato exige renovarla con 30 días de anticipación: el plazo se cumple HOY + 4 días. Si no se renueva a tiempo, el arrendador puede terminar el contrato de inmediato y cobrar la boleta.",
      accion: "Pedir la renovación al banco (toma 3–5 días hábiles) y enviar copia al arrendador." },

    { id: "a2", fecha: "2026-09-05", titulo: "Primer certificado de ventas al arrendador",
      clausula: 4, nivel: "revisar", responsable: "Contador", recurrencia: "Mensual, primeros 5 días hábiles",
      detalle: "Certificado de contador auditor con las ventas netas del mes anterior. Multa: 10 UF ($401.500) por cada mes de atraso, sin tope de veces.",
      accion: "Coordinar con el contador una rutina mensual fija. Esta obligación se repite 36 veces." },

    { id: "a3", fecha: "2026-09-01", titulo: "Acreditar póliza de seguro (incendio, sismo, RC 5.000 UF)",
      clausula: 8, nivel: "estandar", responsable: "Paulina Órdenes", recurrencia: "Anual",
      detalle: "Póliza endosada a favor del arrendador. Debe estar vigente al inicio del contrato y acreditarse cada año.",
      accion: "Cotizar en al menos dos aseguradoras. Rango esperado: 8–14 UF anuales." },

    { id: "a4", fecha: "2027-09-01", titulo: "Primer reajuste adicional del 3% sobre la renta",
      clausula: 3, nivel: "revisar", responsable: "Contador",
      detalle: "La renta sube de 62 a 63,86 UF. Este reajuste es ADICIONAL al de la UF. Verifica que el arrendador lo aplique sobre el valor correcto y no sobre un valor ya reajustado dos veces.",
      accion: "Revisar la primera factura de septiembre 2027 contra el cálculo propio." },

    { id: "a5", fecha: "2028-09-01", titulo: "Segundo reajuste adicional del 3%",
      clausula: 3, nivel: "revisar", responsable: "Contador",
      detalle: "La renta sube de 63,86 a 65,78 UF.",
      accion: "Misma verificación." },

    { id: "a6", fecha: "2029-05-03", titulo: "ÚLTIMO DÍA para avisar que NO renuevas el contrato",
      clausula: 10, nivel: "critico", responsable: "Paulina Órdenes (decisión de gerencia)",
      detalle: "Carta certificada despachada ANTE NOTARIO. 120 días corridos antes del vencimiento (31-ago-2029). Si esta fecha pasa sin que envíes la carta, el contrato se renueva automáticamente por 36 meses más — hasta agosto de 2032 — y salirte después cuesta hasta $59.743.200.\n\nEsta es la fecha más importante de todo el contrato, y es la que nadie anota.",
      accion: "Decidir en marzo de 2029 si renuevas. Si no: notaría + carta certificada, con margen de 2 semanas." },

    { id: "a7", fecha: "2029-08-31", titulo: "Vencimiento del contrato (si avisaste a tiempo)",
      clausula: 10, nivel: "estandar", responsable: "Paulina Órdenes",
      detalle: "Restitución material del local. La garantía se devuelve 90 días después, con las deducciones que el arrendador estime.",
      accion: "Fotografiar el estado del local al entregar. Acta de entrega firmada por ambas partes." }
  ]
},

/* ═════════════════════════════════════════════════════ 2. SUMINISTRO ═════ */
suministro: {
  id: "suministro",
  etiqueta: "Contrato marco de suministro",
  titulo: "Contrato Marco de Suministro de Productos Alimenticios",
  archivo: "contrato-marco-retail-andes-2026.pdf",
  paginas: 11,
  palabras: 4930,
  contraparte: "Retail Andes S.A.",
  contraparteRut: "96.789.240-1",
  cliente: "Alimentos Trapananda SpA",
  clienteRut: "77.045.312-8",
  firmaPrevista: "2026-09-20",
  inicio: "2026-10-01",
  termino: "2027-09-30",

  encabezado:
    "En Santiago de Chile, a 20 de septiembre de 2026, entre RETAIL ANDES S.A., rol único " +
    "tributario N° 96.789.240-1, representada por doña CAROLINA VÁSQUEZ PEÑAILILLO, cédula " +
    "nacional de identidad N° 14.209.663-K, ambos domiciliados en Avenida Presidente Riesco " +
    "N° 5.335, piso 12, comuna de Las Condes, en adelante “el Comprador”; y ALIMENTOS " +
    "TRAPANANDA SpA, rol único tributario N° 77.045.312-8, representada por don IGNACIO MELLADO " +
    "SANHUEZA, cédula nacional de identidad N° 15.771.204-6, ambos domiciliados en Camino a " +
    "Melipilla N° 12.480, comuna de Maipú, en adelante “el Proveedor”; se ha convenido lo siguiente:",

  economia: null,

  clausulas: [
    { n: 1, ord: "PRIMERO", titulo: "Objeto",
      texto: "El Proveedor se obliga a suministrar al Comprador los productos alimenticios individualizados en el Anexo A, en las cantidades, plazos y condiciones que el Comprador determine mediante órdenes de compra emitidas a través de su plataforma electrónica de abastecimiento. El presente contrato no obliga al Comprador a adquirir volumen mínimo alguno.",
      riesgo: {
        nivel: "revisar", categoria: "Volumen",
        titulo: "No te garantizan comprarte nada. Pero a ti te van a exigir tener stock.",
        llano: "El contrato dice expresamente que el comprador no está obligado a comprarte ninguna cantidad mínima. Ellos emiten órdenes de compra cuando quieren. Pero más adelante (cláusula SEXTA) sí te obligan a mantener stock permanente y capacidad dedicada.",
        duele: "La asimetría es el punto. Tú tienes que estar listo para producir; ellos no tienen que comprarte. Y cuando armas tu presupuesto anual con este cliente adentro, estás asumiendo un volumen que el contrato no te promete.",
        plata: "Tu inversión en capacidad, sin ingreso garantizado",
        plataDetalle: "Si habilitas una línea de producción para este cliente, ese capital está apostado a una compra que el contrato no te obliga a recibir.",
        redline: {
          original: "El presente contrato no obliga al Comprador a adquirir volumen mínimo alguno.",
          propuesto: "El Comprador se obliga a adquirir durante cada trimestre calendario un volumen mínimo equivalente al 70% del volumen proyectado informado por el Comprador para dicho trimestre. En caso de no alcanzarse dicho mínimo, el Comprador pagará al Proveedor el 30% del valor del volumen no adquirido, a título de compensación por capacidad reservada.",
          justificacion: "Si te exigen capacidad dedicada y stock mínimo, tiene que haber una contrapartida. El 70% del volumen proyectado es un piso razonable y le da al comprador flexibilidad real. Si no te aceptan un mínimo, al menos elimina la obligación de stock de la cláusula SEXTA — no puedes tener las dos."
        }
      } },

    { n: 2, ord: "SEGUNDO", titulo: "Precios y condiciones comerciales",
      texto: "Los precios serán los indicados en el Anexo B. El Comprador podrá modificar unilateralmente las condiciones comerciales, incluidos los precios de lista, descuentos, rebates y aportes promocionales, mediante aviso escrito con quince días corridos de anticipación. Si el Proveedor no manifiesta su rechazo por escrito dentro de dicho plazo, se entenderán aceptadas. El rechazo facultará al Comprador para poner término inmediato al contrato.",
      riesgo: {
        nivel: "critico", categoria: "Precio",
        titulo: "Te pueden bajar el precio con 15 días de aviso. Y si dices que no, te terminan el contrato.",
        llano: "El comprador puede cambiar los precios, descuentos y aportes promocionales cuando quiera, avisando 15 días antes. Si no reclamas por escrito en esos 15 días, se entiende que aceptaste. Y si reclamas, ellos pueden terminar el contrato de inmediato.",
        duele: "Léelo dos veces, porque es peor de lo que parece. No es que puedan proponerte un precio nuevo: es que tu única alternativa a aceptarlo es perder el cliente. Eso no es una negociación, es un ultimátum contractual, y está escrito así a propósito.\n\nEl escenario: llevas ocho meses, ajustaste tu producción a este cliente, y te avisan que bajan el precio un 12%. Tienes 15 días. Aceptas y pierdes margen, o rechazas y pierdes el 40% de tu facturación. Y el silencio cuenta como aceptación, así que si el correo se te va a spam, aceptaste.",
        plata: "Tu margen completo, a discreción del comprador",
        plataDetalle: "Sobre una facturación anual de $80.000.000 con este cliente, una baja de precio de 10% son $8.000.000 al año de margen que desaparecen sin que puedas hacer nada.",
        redline: {
          original: "El Comprador podrá modificar unilateralmente las condiciones comerciales, incluidos los precios de lista, descuentos, rebates y aportes promocionales, mediante aviso escrito con quince días corridos de anticipación. Si el Proveedor no manifiesta su rechazo por escrito dentro de dicho plazo, se entenderán aceptadas. El rechazo facultará al Comprador para poner término inmediato al contrato.",
          propuesto: "Los precios permanecerán fijos durante cada período de doce meses y se reajustarán anualmente conforme a la variación del Índice de Precios al Consumidor. Cualquier modificación de las condiciones comerciales requerirá acuerdo escrito de ambas partes. El Proveedor podrá solicitar una revisión de precios cuando el costo de sus insumos principales varíe en más de un 8%, acreditándolo documentadamente.",
          justificacion: "Lo mínimo aceptable es que un cambio de precio requiera acuerdo, no aviso. Y agrega la revisión al alza por costo de insumos: si tu harina o tu envase suben, hoy no tienes cómo trasladarlo — la cláusula sólo funciona en una dirección."
        }
      } },

    { n: 3, ord: "TERCERO", titulo: "Facturación y pago",
      texto: "El Comprador pagará las facturas dentro de los treinta días corridos siguientes a la recepción conforme de los productos. La recepción conforme será declarada por el Comprador una vez verificada la conformidad de la mercadería con la orden de compra respectiva y con los estándares de calidad internos del Comprador, sin que exista plazo determinado para dicha verificación. Las facturas que no cuenten con recepción conforme no se entenderán devengadas ni exigibles.",
      riesgo: {
        nivel: "critico", categoria: "Pago",
        titulo: "El plazo de 30 días no empieza a correr hasta que ellos quieran que empiece",
        llano: "Dice “30 días”, que suena bien y suena a la Ley de Pago a 30 Días. Pero los 30 días no se cuentan desde que entregas: se cuentan desde que ellos declaran la “recepción conforme”. Y el contrato dice expresamente que NO hay plazo para que declaren esa recepción conforme. O sea: el reloj de los 30 días empieza cuando ellos digan.",
        duele: "Esto es un mecanismo diseñado para esquivar la Ley 21.131, que establece el pago a 30 días. En la práctica, tu pago a 30 días se convierte en un pago a 60, 90 o 120 días, y no tienes cómo reclamar, porque técnicamente el plazo “no ha empezado”. Y remata: “las facturas que no cuenten con recepción conforme no se entenderán devengadas ni exigibles” — es decir, ni siquiera existe una deuda que puedas cobrar.\n\nCombina esta cláusula con la SÉPTIMA (prohibición de ceder créditos) y el resultado es letal: no te pagan, y tampoco puedes factorizar la factura para conseguir el efectivo.",
        plata: "$20.000.000 de capital de trabajo inmovilizado, permanentemente",
        plataDetalle: "Supuesto: facturas $80.000.000 al año a este cliente. Con pago real a 90 días en vez de 30, tienes 3 meses de facturación siempre por cobrar: $80.000.000 ÷ 12 × 3 = $20.000.000 congelados de forma permanente. A un costo de capital de 18% anual, eso te cuesta $3.600.000 al año en plata que no ves.",
        redline: {
          original: "El Comprador pagará las facturas dentro de los treinta días corridos siguientes a la recepción conforme de los productos. La recepción conforme será declarada por el Comprador (…) sin que exista plazo determinado para dicha verificación.",
          propuesto: "El Comprador pagará las facturas dentro de los treinta días corridos siguientes a la fecha de recepción de la mercadería en el centro de distribución, conforme a lo dispuesto en la Ley N° 21.131. El Comprador dispondrá de un plazo máximo de 5 días hábiles desde la entrega para objetar la mercadería; transcurrido dicho plazo sin objeción, se entenderá otorgada la recepción conforme para todos los efectos. Las objeciones deberán ser fundadas y detalladas por escrito.",
          justificacion: "El cambio de fondo es poner un PLAZO MÁXIMO para declarar la recepción conforme, con silencio positivo. Sin ese plazo, la cláusula de 30 días es decorativa. Invoca la Ley 21.131 expresamente: es un argumento fuerte y el comprador sabe que la está bordeando."
        }
      } },

    { n: 4, ord: "CUARTO", titulo: "Nivel de servicio y multas",
      texto: "El Proveedor deberá cumplir un nivel de servicio (fill rate) no inferior al noventa y ocho por ciento sobre cada orden de compra. Por cada punto porcentual bajo dicho nivel, el Proveedor pagará una multa equivalente al cinco por ciento del valor total de la orden de compra respectiva. El Comprador queda expresamente facultado para descontar, compensar y retener el monto de las multas directamente de cualquier factura pendiente de pago, sin necesidad de notificación previa ni de aceptación del Proveedor.",
      riesgo: {
        nivel: "critico", categoria: "Multa",
        titulo: "Un 94% de cumplimiento te cuesta el 20% de la orden. Y te lo descuentan sin avisar.",
        llano: "Tienes que entregar al menos el 98% de lo que te piden en cada orden. Por cada punto que bajes de ahí, te multan con el 5% del valor TOTAL de la orden. Y se lo descuentan solos de las facturas que te deben, sin avisarte y sin que tengas que estar de acuerdo.",
        duele: "Haz el cálculo: si entregas 94% en vez de 98%, son 4 puntos × 5% = 20% del valor total de la orden. En una orden de $6.500.000, eso es $1.300.000 de multa por haber entregado el 94% — es decir, la multa es más grande que el valor de lo que dejaste de entregar. Eso es desproporcionado y es exactamente lo que un tribunal miraría con lupa.\n\nY no hay tope. Un mes malo — un problema con un proveedor de insumos, un camión que se echó a perder — se puede llevar el margen del trimestre. La compensación unilateral remata el problema: te enteras de la multa cuando ves la factura pagada de menos.",
        plata: "$1.300.000 por una sola orden con 94% de fill rate",
        plataDetalle: "4 puntos bajo el umbral × 5% = 20% × $6.500.000 = $1.300.000. Sin tope. Con seis órdenes así en un trimestre malo: $7.800.000.",
        redline: {
          original: "Por cada punto porcentual bajo dicho nivel, el Proveedor pagará una multa equivalente al cinco por ciento del valor total de la orden de compra respectiva. El Comprador queda expresamente facultado para descontar, compensar y retener el monto de las multas directamente de cualquier factura pendiente de pago, sin necesidad de notificación previa ni de aceptación del Proveedor.",
          propuesto: "Por cada punto porcentual bajo el nivel de servicio comprometido, el Proveedor pagará una multa equivalente al cinco por ciento del valor de la mercadería NO ENTREGADA de la orden de compra respectiva, con un tope trimestral equivalente al 3% de la facturación del trimestre. No se aplicará multa cuando el incumplimiento derive de caso fortuito, fuerza mayor, hechos imputables al Comprador, o de modificaciones a la orden de compra efectuadas con menos de 72 horas de anticipación. El Comprador notificará por escrito toda multa con 10 días hábiles de anticipación a su descuento, y el Proveedor podrá objetarla fundadamente.",
          justificacion: "Tres correcciones y las tres son estándar de mercado: (1) la multa se calcula sobre lo NO entregado, no sobre el total de la orden — esta sola palabra cambia $1.300.000 por $65.000; (2) tope trimestral; (3) notificación previa antes de descontar. Ninguna de las tres es una petición agresiva y las tres son perfectamente defendibles."
        }
      } },

    { n: 5, ord: "QUINTO", titulo: "Exclusividad",
      texto: "Durante la vigencia del presente contrato y por el plazo de doce meses contados desde su término por cualquier causa, el Proveedor no podrá suministrar, directa ni indirectamente, productos iguales o similares a los señalados en el Anexo A a ninguna de las empresas que el Comprador identifique como competidoras en el Anexo C, el que podrá ser actualizado unilateralmente por el Comprador.",
      riesgo: {
        nivel: "critico", categoria: "Exclusividad",
        titulo: "No puedes venderle a la competencia — y el comprador decide unilateralmente quién es “la competencia”",
        llano: "Mientras dure el contrato, y durante 12 meses DESPUÉS de que termine, no puedes venderles a las empresas que aparezcan en una lista de competidores. Y esa lista la actualiza el comprador solo, cuando quiera.",
        duele: "El comprador puede ir agregando empresas a la lista de competidores hasta dejarte sin mercado. No hay límite a lo que puede poner en el Anexo C. Y como la restricción sobrevive 12 meses al término del contrato — que ellos pueden terminar con 30 días de aviso (cláusula OCTAVA) — el escenario completo es este: te terminan el contrato en 30 días, y quedas 12 meses sin poder venderle a nadie más del rubro. Sin cliente y sin poder buscar otro.\n\nEsa combinación es la que mata proveedores.",
        plata: "Un año entero sin poder vender tu producto en el canal",
        plataDetalle: "Si este cliente es el 40% de tu facturación ($80.000.000 de $200.000.000), y quedas 12 meses sin poder reemplazarlo con otro retailer, la pérdida es tu capacidad de sustituir esa venta: hasta $80.000.000.",
        redline: {
          original: "Durante la vigencia del presente contrato y por el plazo de doce meses contados desde su término por cualquier causa, el Proveedor no podrá suministrar (…) a ninguna de las empresas que el Comprador identifique como competidoras en el Anexo C, el que podrá ser actualizado unilateralmente por el Comprador.",
          propuesto: "Durante la vigencia del presente contrato, el Proveedor no podrá suministrar los productos desarrollados exclusivamente para el Comprador bajo marca propia de éste a las empresas individualizadas en el Anexo C, cuya nómina es taxativa y sólo podrá modificarse de común acuerdo. Esta restricción no se extenderá con posterioridad al término del contrato. El Proveedor conserva el derecho de comercializar sus productos de marca propia a cualquier tercero.",
          justificacion: "Tres límites: (1) la exclusividad cubre sólo los productos hechos a medida para ellos (marca propia), no todo tu catálogo; (2) la lista de competidores es cerrada y no la pueden ampliar solos; (3) NO sobrevive al término del contrato. El punto 3 es innegociable: no puedes aceptar que te terminen en 30 días y te dejen un año sin poder trabajar."
        }
      } },

    { n: 6, ord: "SEXTO", titulo: "Stock y capacidad",
      texto: "El Proveedor se obliga a mantener en todo momento un stock de seguridad equivalente a treinta días de la demanda proyectada por el Comprador, y a reservar capacidad productiva dedicada suficiente para atender un incremento de hasta un cuarenta por ciento sobre dicha demanda, sin costo adicional para el Comprador.",
      riesgo: {
        nivel: "revisar", categoria: "Operación",
        titulo: "Tienes que financiar stock y capacidad ociosa para un cliente que no se obliga a comprarte",
        llano: "Debes mantener siempre 30 días de stock listo, y además reservar un 40% de capacidad extra por si te piden más — todo eso sin cobrar nada por ello.",
        duele: "Lee esta cláusula junto con la PRIMERA (“el contrato no obliga al Comprador a adquirir volumen mínimo alguno”) y el negocio queda claro: tú financias el inventario y la capacidad ociosa, ellos no se comprometen a nada. Es capital de trabajo tuyo, inmovilizado, para el beneficio operacional de ellos.",
        plata: "≈ $6.700.000 permanentemente inmovilizados en stock",
        plataDetalle: "30 días de demanda proyectada sobre una facturación anual de $80.000.000, a un costo de producción del ~60% del precio de venta: $80.000.000 ÷ 12 × 0,6 ≈ $4.000.000 de stock, más el margen de seguridad y merma. Súmale el costo de la capacidad reservada, que no se ve pero existe.",
        redline: {
          original: "y a reservar capacidad productiva dedicada suficiente para atender un incremento de hasta un cuarenta por ciento sobre dicha demanda, sin costo adicional para el Comprador.",
          propuesto: "y a reservar capacidad productiva suficiente para atender un incremento de hasta un quince por ciento sobre la demanda proyectada, comunicado con al menos 30 días de anticipación. Incrementos superiores serán acordados entre las partes y podrán dar lugar a un ajuste de precio. El stock de seguridad se reducirá a quince días de demanda proyectada.",
          justificacion: "Un 40% de capacidad reservada gratis es mucho. Bájalo a 15%, exige aviso previo, y deja abierta la puerta a cobrar por sobre eso. Si además consigues el volumen mínimo de la cláusula PRIMERA, esta cláusula deja de ser un problema."
        }
      } },

    { n: 7, ord: "SÉPTIMO", titulo: "Prohibición de cesión de créditos",
      texto: "Se prohíbe expresamente al Proveedor ceder, transferir, endosar, dar en prenda o en garantía, descontar, factorizar o disponer a cualquier título de los créditos que emanen del presente contrato o de las facturas emitidas en virtud de él. La infracción a esta prohibición constituirá incumplimiento grave y facultará al Comprador para poner término inmediato al contrato.",
      riesgo: {
        nivel: "critico", categoria: "Financiamiento",
        titulo: "No puedes factorizar tus facturas. Esta es la cláusula que te ahoga.",
        llano: "No puedes vender, ceder ni factorizar las facturas de este cliente. Están expresamente prohibidos el factoring, el descuento y la prenda. Si lo haces igual, es causal de término inmediato del contrato.",
        duele: "Ésta es, de lejos, la cláusula más peligrosa del contrato para una PYME, y es la que menos se mira porque suena a tecnicismo.\n\nEl factoring es cómo sobrevive una PYME que le vende a una empresa grande. Facturas hoy, te pagan en 90 días, y el factoring te adelanta la plata para poder seguir produciendo. Esta cláusula te lo prohíbe. Y combinada con la cláusula TERCERA — donde el plazo de pago ni siquiera empieza a correr hasta que ellos digan — el resultado es que tu plata está en manos del comprador por tiempo indefinido y no tienes ninguna forma de adelantarla.\n\nEl escenario concreto: te llega una orden grande, la mejor del año. Necesitas comprar insumos para producirla. No puedes factorizar la orden anterior porque este contrato te lo prohíbe. Entonces o consigues crédito caro, o rechazas la orden. Muchas PYMES chilenas quiebran exactamente así: no por falta de ventas, sino por falta de caja.",
        plata: "$20.000.000 de capital de trabajo que no puedes liberar",
        plataDetalle: "El mismo saldo por cobrar de la cláusula TERCERA, pero ahora congelado sin salida. El costo de reemplazarlo con crédito bancario para PYME (24–36% anual) sobre $20.000.000 es de $4.800.000 a $7.200.000 al año. Y eso si te dan el crédito.",
        redline: {
          original: "Se prohíbe expresamente al Proveedor ceder, transferir, endosar, dar en prenda o en garantía, descontar, factorizar o disponer a cualquier título de los créditos que emanen del presente contrato o de las facturas emitidas en virtud de él.",
          propuesto: "El Proveedor podrá ceder o factorizar los créditos que emanen de las facturas emitidas en virtud del presente contrato, debiendo informar al Comprador la individualización del cesionario dentro de los 5 días hábiles siguientes a la cesión, para efectos de dirigir el pago. La cesión no alterará las excepciones y compensaciones que el Comprador pudiere oponer conforme a este contrato.",
          justificacion: "Esta es la redline que más plata vale de las dos que valen plata en este contrato. El argumento con el comprador es directo y honesto: la prohibición de cesión no lo protege de nada real — sus derechos de compensación quedan a salvo con la frase final — y en cambio le encarece el proveedor y lo pone en riesgo de que su proveedor no pueda financiar la producción. Muchos compradores grandes ceden en este punto cuando se lo plantean así, porque no ganan nada con la prohibición. Si te dicen que no: es la señal más clara de que este contrato no te conviene."
        }
      } },

    { n: 8, ord: "OCTAVO", titulo: "Vigencia, renovación y término",
      texto: "El presente contrato tendrá una vigencia de doce meses contados desde el 1 de octubre de 2026, renovándose automáticamente por períodos iguales y sucesivos, salvo aviso escrito de cualquiera de las partes con noventa días corridos de anticipación al vencimiento. Sin perjuicio de lo anterior, el Comprador podrá poner término al presente contrato en cualquier momento, sin expresión de causa y sin derecho a indemnización alguna para el Proveedor, mediante aviso escrito con treinta días corridos de anticipación.",
      riesgo: {
        nivel: "critico", categoria: "Asimetría",
        titulo: "Se renueva solo cada año (avisas con 90 días), pero ellos se van cuando quieran con 30",
        llano: "El contrato se renueva automáticamente cada año salvo que avises con 90 días. Pero el comprador puede terminarlo cuando se le ocurra, sin dar razones, con sólo 30 días de aviso y sin pagarte nada.",
        duele: "La asimetría es de 3 a 1 y va toda para el mismo lado. Tú quedas amarrado por un año a menos que te acuerdes de avisar con 90 días de anticipación (el plazo vence el 2 de julio de 2027). Ellos se sueltan en 30 días.\n\nAhora súmale la cláusula QUINTA: te terminan con 30 días de aviso, y todavía te quedan 12 meses sin poder venderle a la competencia. Y súmale la SEXTA: invertiste en stock y capacidad para ellos. La combinación de estas tres cláusulas es la que deja a un proveedor con la planta parada y sin poder buscar otro cliente.",
        plata: "$31.000.000 de inversión dedicada no amortizada, si te terminan al mes 4",
        plataDetalle: "Supuesto: $35.000.000 en línea de producción dedicada, amortizable en 36 meses. Al mes 4 llevas amortizado $3.900.000. Pérdida: $31.100.000. Más 12 meses sin poder vender en el canal.",
        redline: {
          original: "el Comprador podrá poner término al presente contrato en cualquier momento, sin expresión de causa y sin derecho a indemnización alguna para el Proveedor, mediante aviso escrito con treinta días corridos de anticipación.",
          propuesto: "Cualquiera de las partes podrá poner término al presente contrato, sin expresión de causa, mediante aviso escrito con noventa días corridos de anticipación. En caso de término sin causa por parte del Comprador antes de cumplirse doce meses de vigencia, éste pagará al Proveedor el valor no amortizado de las inversiones en capacidad dedicada que el Proveedor hubiere efectuado a requerimiento del Comprador, previamente acreditadas. El plazo de aviso para la no renovación será de sesenta días corridos para ambas partes.",
          justificacion: "Simetría. Si ellos pueden irse sin causa, que sea con el mismo plazo que a ti te exigen. Y si te pidieron invertir en capacidad dedicada, que paguen lo que no alcanzaste a amortizar — es el estándar en contratos de suministro industrial y no es una petición exótica."
        }
      } },

    { n: 9, ord: "NOVENO", titulo: "Indemnidad",
      texto: "El Proveedor mantendrá indemne al Comprador de toda responsabilidad, reclamo, demanda, sanción o perjuicio de cualquier naturaleza, sin límite de monto, que derive directa o indirectamente de los productos suministrados, incluyendo reclamos de consumidores, sanciones administrativas y daños a terceros, aun cuando el hecho generador se deba a caso fortuito o fuerza mayor.",
      riesgo: {
        nivel: "revisar", categoria: "Responsabilidad",
        titulo: "Respondes por todo, sin tope, incluso por caso fortuito",
        llano: "Si un consumidor reclama, si el SERNAC o la SEREMI multa, si alguien se enferma — respondes tú, sin límite de monto. Y la cláusula agrega algo insólito: respondes incluso si la causa fue un caso fortuito o de fuerza mayor, es decir, algo que no dependía de ti.",
        duele: "Que el proveedor de alimentos responda por sus productos es completamente razonable, y no vale la pena pelearlo. Lo que no es razonable son dos cosas: que no haya tope de monto, y que respondas por hechos que no son culpa tuya. Una indemnidad sin tope significa que un incidente grave con un producto puede quebrar tu empresa entera, incluso si el retailer rompió la cadena de frío en su propia bodega.",
        plata: "Sin tope — ese es exactamente el problema",
        plataDetalle: "No es cuantificable, y por eso es peligroso. Un solo retiro de producto del mercado (recall) en la industria de alimentos puede costar entre $50 y $500 millones.",
        redline: {
          original: "El Proveedor mantendrá indemne al Comprador de toda responsabilidad (…) sin límite de monto (…) aun cuando el hecho generador se deba a caso fortuito o fuerza mayor.",
          propuesto: "El Proveedor mantendrá indemne al Comprador de los reclamos y perjuicios que deriven de defectos de los productos suministrados que le sean imputables, con un tope global equivalente al monto facturado por el Proveedor al Comprador durante los doce meses anteriores al hecho generador. El Proveedor no responderá por hechos de caso fortuito o fuerza mayor, ni por daños derivados del almacenamiento, manipulación o transporte de los productos una vez recibidos por el Comprador.",
          justificacion: "Tres cosas: tope (el estándar de mercado es la facturación de 12 meses), sólo por lo que te sea imputable, y corte claro de responsabilidad cuando el producto ya está en manos de ellos. Contrata además un seguro de responsabilidad civil de productos: cuesta poco y es lo que te salva."
        }
      } },

    { n: 10, ord: "DÉCIMO", titulo: "Certificaciones y auditorías",
      texto: "El Proveedor deberá mantener vigentes durante toda la vigencia del contrato la resolución sanitaria de su planta productiva y las certificaciones que el Comprador requiera, y someterse a auditorías de calidad del Comprador al menos una vez al año.",
      riesgo: {
        nivel: "estandar", categoria: "Cumplimiento",
        titulo: "Estándar de la industria. Pero son dos fechas anuales que se olvidan.",
        llano: "Mantener vigente la resolución sanitaria de la planta y pasar la auditoría anual de calidad del comprador.",
        duele: "Nada abusivo — esto es lo normal y correcto en alimentos. Pero son obligaciones con fecha: la resolución sanitaria de la SEREMI vence, y renovarla toma semanas. Ponlas en el calendario.",
        plata: "Costo de renovación de resolución sanitaria y auditoría",
        plataDetalle: "Variable según la SEREMI y el tipo de planta. Presupuesta el tiempo, más que la plata: el trámite puede tomar 4–8 semanas.",
        redline: null
      } }
  ],

  obligaciones: [
    { id: "s1", fecha: "2026-11-30", titulo: "Renovar resolución sanitaria de la planta (SEREMI)",
      clausula: 10, nivel: "critico", responsable: "Ignacio Mellado / Jefe de Planta",
      detalle: "La resolución sanitaria debe estar vigente durante todo el contrato. Su vencimiento sin renovación es incumplimiento e interrumpe el suministro. El trámite ante la SEREMI de Salud toma entre 4 y 8 semanas.",
      accion: "Iniciar el trámite con 10 semanas de anticipación." },

    { id: "s2", fecha: "2027-01-01", titulo: "Entregar proyección de demanda del trimestre",
      clausula: 6, nivel: "revisar", responsable: "Comercial", recurrencia: "Trimestral (1-ene, 1-abr, 1-jul, 1-oct)",
      detalle: "Base del stock de seguridad (30 días) y de la capacidad reservada (40%). Ojo: la proyección la informa el comprador, y sobre ella se calculan tus obligaciones de stock. Revísala.",
      accion: "Exigir la proyección por escrito. Si no llega, dejar constancia escrita." },

    { id: "s3", fecha: "2027-03-15", titulo: "Auditoría anual de calidad del comprador",
      clausula: 10, nivel: "estandar", responsable: "Jefe de Planta", recurrencia: "Anual",
      detalle: "Auditoría de calidad en planta. Un hallazgo grave puede gatillar el término del contrato por incumplimiento.",
      accion: "Pre-auditoría interna 30 días antes." },

    { id: "s4", fecha: "2027-07-02", titulo: "ÚLTIMO DÍA para avisar que NO renuevas el contrato",
      clausula: 8, nivel: "critico", responsable: "Ignacio Mellado (decisión de gerencia)",
      detalle: "90 días corridos antes del vencimiento (30-sep-2027). Si no avisas, el contrato se renueva automáticamente por 12 meses más, con las mismas condiciones — incluidas la prohibición de factoring y la exclusividad.\n\nOjo con la asimetría: tú necesitas 90 días para salir; el comprador sale con 30.",
      accion: "Decidir en mayo de 2027 si renuevas. Carta escrita con acuse de recibo." },

    { id: "s5", fecha: "2027-09-30", titulo: "Vencimiento del contrato (si avisaste a tiempo)",
      clausula: 8, nivel: "revisar", responsable: "Ignacio Mellado",
      detalle: "Atención: la cláusula de exclusividad (QUINTA) sigue rigiendo por 12 MESES DESPUÉS de esta fecha. No puedes venderle a los competidores del Anexo C hasta el 30 de septiembre de 2028.",
      accion: "Planificar la sustitución de este cliente con 6 meses de anticipación." }
  ]
}
};
