# El contrato del piloto automático

Este documento define **cómo una idea se enchufa al sistema meta** que la comercializa,
la mide y decide si sigue viva. Lo leen dos tipos de agente:

- El que construye **el sistema meta** (`00-sistema/`).
- El que construye **una idea** que quiere ser operada por él (`17-…` en adelante, y
  cualquier idea futura).

Si los dos respetan este archivo, cualquier idea —incluidas las que todavía no existen—
se enchufa sin tocar el sistema.

---

## 1. El núcleo de cumplimiento (no es negociable, y no es moralismo)

El sistema opera **sin humano en el loop**. Eso significa que nadie va a atajar un error
antes de que salga a producción y se repita diez mil veces. Por eso las reglas de abajo
se implementan como un **kernel que bloquea la acción**, no como una recomendación en un
prompt. Un prompt se puede convencer; un kernel no.

El argumento es económico antes que ético: **el canal es el activo.** Un sistema que hace
astroturfing se quema los canales en semanas —Meta cierra la cuenta publicitaria, X banea,
Reddit marca el dominio, la operadora quema el número— y un sistema autónomo que se quema
sus propios canales no es un negocio autónomo: es una máquina de destruir activos rápido.

### Permitido (y 100% automatizable)

| Canal | Cómo |
|---|---|
| **Anuncios pagados** | Meta Ads API, Google Ads API, TikTok Ads API. La plataforma los rotula como publicidad. Automatizable de punta a punta. |
| **Cuentas propias de marca** | Instagram Graph API, X API, LinkedIn API. Es *tu marca* hablando con su nombre. Legítimo. |
| **SEO y contenido programático** | En **tu propio dominio**. Útil, indexable, tuyo. |
| **Email / WhatsApp** | **Sólo a quien se registró.** WhatsApp Business API con plantillas aprobadas. Baja en un clic, honrada al instante. |
| **Patrocinios comprados** | Newsletters, podcasts, sitios — declarados como publicidad. |
| **Voz** | **Entrante**, o **saliente sólo a quien dejó su número y consintió** (§3). |

### Prohibido (el kernel lo rechaza)

- **Cuentas falsas, sockpuppets, publicar en foros o comunidades haciéndose pasar por un
  usuario orgánico.** Es astroturfing: viola los ToS de toda plataforma, es práctica comercial
  engañosa, y te cuesta el canal.
- **Reseñas falsas.** Mismo motivo, más responsabilidad legal directa.
- **Llamadas en frío con voz sintética a quien no consintió.** En Chile choca con el registro
  *No Molestar* (Ley 21.398) y la Ley 19.496; en EE.UU. la FCC ya declaró ilegales las robocalls
  con voz de IA bajo la TCPA.
- **Voz sintética que no declara ser IA**, o que imita a una persona real.
- **Afirmaciones falsas o no verificables.** La regla de números del contrato principal se
  hereda: toda cifra citada o con su derivación a la vista.
- **Contactar a personas con datos raspados sin base legal.** Ley 19.628 y Ley 21.719.

Cada acción bloqueada por el kernel **se registra y aparece en el tablero**. Un sistema
autónomo sin bitácora de lo que *no* hizo es un sistema que no se puede auditar.

## 2. El manifiesto: `autopilot.json`

Cada idea que quiere ser operada declara un `autopilot.json` en su carpeta. Es el único
punto de acoplamiento: el sistema no sabe nada de la idea salvo lo que este archivo dice.

```json
{
  "idea": "17-datos-empresas",
  "brand": "…",
  "autonomia": "total",
  "por_que": "Producto digital, alta self-service, sin onboarding humano, entrega por API.",

  "oferta": {
    "landing": "https://…",
    "checkout": "stripe|flow|mercadopago",
    "modelo": "suscripcion|uso|freemium",
    "precio_clp": 29000,
    "prueba_sin_tarjeta": true
  },

  "publico": {
    "icp": "…",
    "geo": ["CL"],
    "canales": ["google_ads", "meta_ads", "seo", "x_propio", "instagram_propio",
                "whatsapp_optin", "voz_entrante"]
  },

  "presupuesto": {
    "tope_diario_clp": 15000,
    "tope_mensual_clp": 400000,
    "tope_total_antes_de_revisar_clp": 1200000
  },

  "metricas": {
    "endpoint": "https://…/metrics",
    "eventos": ["visita", "registro", "activacion", "pago", "churn"],
    "activacion": "Definición honesta del momento en que el producto entregó valor."
  },

  "criterios_de_muerte": [
    { "hito": "M1", "mes": 2, "condicion": "CAC > 3x el precio mensual", "accion": "pausar" },
    { "hito": "M2", "mes": 4, "condicion": "activacion < 15%", "accion": "matar" }
  ],

  "economia": {
    "cac_objetivo_clp": 25000,
    "ltv_estimado_clp": 180000,
    "margen_bruto": 0.82
  },

  "cumplimiento": {
    "voz_saliente": false,
    "datos_personales": "Sólo email de quien se registra. Sin datos de menores.",
    "riesgo_declarado": "…"
  }
}
```

**Los `criterios_de_muerte` salen del `roadmap.html` que la idea ya escribió.** No se
inventan acá: se copian. Esa es la gracia — el contrato original ya obligaba a cada idea a
declarar la observación que debería hacerla parar, y el sistema meta simplemente los ejecuta.

## 3. Arquitectura de voz (cómo hacerla creíble *y* legal)

- **Cadena:** telefonía (Twilio/Vonage) → ASR en streaming → LLM → TTS en streaming, con
  *barge-in* (que se pueda interrumpir) y presupuesto de latencia **&lt;800 ms** de punta a punta.
  La latencia es lo que hace que una voz suene viva; no el timbre.
- **Divulgación en los primeros 5 segundos.** *"Te habla un asistente virtual de &lt;marca&gt;."*
  Esto **no** mata la credibilidad: lo que la mata es que la persona se sienta engañada al
  descubrirlo. El AI Act europeo (art. 50) ya lo exige y la tendencia es global.
- **Identidad de la voz:** voz sintética con licencia. **Nunca** clonar a una persona real
  sin consentimiento escrito, nunca hacerse pasar por alguien específico.
- **Consentimiento y supresión:** lista de supresión honrada al instante, registro *No Molestar*,
  tope de frecuencia por número. Saliente **sólo** a quien dejó su teléfono.
- **Cuando piden un humano y no hay humano:** el sistema lo dice. *"No tengo cómo pasarte con
  una persona, pero te dejo agendada una devolución por correo."* Mentir acá es lo único que
  convierte un producto honesto en una estafa.
- **Bitácora:** cada llamada grabada y transcrita, con su aviso de grabación.

## 4. El juez: la IA que decide si la idea sigue

- Evalúa cada idea **contra los criterios que la idea se comprometió de antemano**.
- **No puede modificar los criterios.** Sólo aplicarlos. Un juez que puede mover el arco
  siempre encuentra una razón para seguir gastando: eso es exactamente el sesgo que se está
  tratando de eliminar al sacar al humano.
- Decisiones posibles: `escalar` · `mantener` · `reducir` · `pausar` · `matar`.
- **Honestidad estadística:** no se declara un ganador con 12 conversiones. Tamaño mínimo de
  muestra y prueba secuencial antes de mover plata.
- **Topes duros** por idea y por portafolio, más un interruptor global. El juez opera *dentro*
  del tope; no puede levantarlo.
- Cada decisión queda registrada con la evidencia y la regla aplicada.

## 5. El tablero

Por idea y por portafolio: **gasto vs. ingreso**, CAC, payback, activación, churn, runway,
la bitácora del juez, y las acciones que el kernel bloqueó. Una sola pantalla para las 16
ideas que ya existen y las que vengan.
