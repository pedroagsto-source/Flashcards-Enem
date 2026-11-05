# Guía del primer video

**De la computadora lista al primer video editado por el CHIP ABOGADO.**
Tiempo total: unos 40 minutos la primera vez. Después, cada video toma el tiempo de grabarlo y enviarlo.

---

## Lo que necesitas

| Ítem | Detalle |
|---|---|
| Computadora | Mac (Apple Silicon o Intel) o Windows 10/11, con 8 GB de RAM o más y 10 GB libres |
| Internet | Para instalar las herramientas la primera vez |
| Claude con plan de pago | Pro o Max, que incluyen **Claude Code**. La suscripción se paga directo a Anthropic, en claude.ai |
| Los archivos del CHIP ABOGADO | `CHIP_ABOGADO.md` y `MAPA_EFECTOS_CHIP_ABOGADO.pdf`, que recibiste por correo |
| Un video grabado con el celular | Vertical, de 20 a 90 segundos, contigo hablando |

---

## Paso 1 · Suscríbete a Claude

1. Entra a **claude.ai** y crea tu cuenta (o inicia sesión con la que ya tienes).
2. Haz clic en **Upgrade** y elige el plan **Pro**. Ya incluye Claude Code.

---

## Paso 2 · Instala Claude en la computadora

La forma más simple es la app:

1. Entra a **claude.ai/download** y descarga la app para Mac o Windows.
2. Instálala, ábrela e inicia sesión con tu cuenta.
3. En la app, abre la pestaña **Code**. Ahí trabaja el CHIP ABOGADO.

> **¿Prefieres la terminal?** En Mac, abre Terminal y pega `curl -fsSL https://claude.ai/install.sh | bash`. En Windows, abre PowerShell y pega `irm https://claude.ai/install.ps1 | iex`. Después escribe `claude` para empezar.

---

## Paso 3 · Crea la carpeta del CHIP ABOGADO

1. En tu escritorio, crea una carpeta llamada **CHIP ABOGADO**.
2. Pon dentro los archivos `CHIP_ABOGADO.md` y `MAPA_EFECTOS_CHIP_ABOGADO.pdf`.
3. En Claude (pestaña Code), elige esa carpeta como carpeta de trabajo.

---

## Paso 4 · Deja que Claude prepare la computadora

Pega este mensaje y envíalo:

> **Prepara esta computadora para el CHIP ABOGADO. Revisa e instala lo que falte: Node.js (versión LTS), ffmpeg y Python 3. Después dime si todo está listo.**

Claude te pedirá permiso para correr algunos comandos. Léelos y haz clic en **Permitir**. Esto pasa solo la primera vez.

**Si prefieres instalar a mano:**

| | Mac | Windows |
|---|---|---|
| Node.js | nodejs.org → botón **LTS** | nodejs.org → botón **LTS** |
| ffmpeg | En Terminal: `brew install ffmpeg` (si no tienes Homebrew, instálalo en brew.sh) | En PowerShell: `winget install Gyan.FFmpeg` |
| Python 3 | python.org/downloads | python.org/downloads (marca **Add to PATH**) |

---

## Paso 5 · Graba el video

- **Celular en vertical**, a la altura de los ojos, a un brazo de distancia.
- **Luz de frente**: la ventana detrás del celular, nunca detrás de ti.
- **Audio limpio**: micrófono de solapa, o audífonos con micrófono cerca de la boca. Sin aire acondicionado ni ventilador ruidoso.
- **¿Te equivocaste? Repite la frase entera** sin detener la grabación. El CHIP corta la pausa y se queda con la mejor toma.
- Habla **un poco más rápido** que en una conversación y mira al lente.
- Puedes grabar el **gancho** y el **cuerpo** en archivos separados. El CHIP los une.

---

## Paso 6 · Pasa el video a la computadora

Usa **AirDrop** (iPhone → Mac), **cable USB** o **Google Drive**. No lo envíes por WhatsApp: lo comprime y el video pierde calidad.

Pon el video dentro de la carpeta **CHIP ABOGADO**.

---

## Paso 7 · Corre el CHIP ABOGADO

En Claude (pestaña Code), arrastra a la conversación el `CHIP_ABOGADO.md`, el mapa y tu video. Escribe:

> **Corre el CHIP ABOGADO.**

Si quieres orientar el resultado, agrega una línea:

> `Objetivo: atraer clientes de Derecho de Familia · Tono: autoridad · CTA: link en la bio`

Lo que pasa ahora:

1. Claude analiza el video, transcribe lo que dices y corta pausas y errores.
2. Te muestra una **tabla con el guion de edición**: cada tramo, su función y el efecto elegido.
3. Arma el proyecto y renderiza. **La primera vez tarda más** (de 10 a 20 minutos), porque instala el editor. Las siguientes son mucho más rápidas.
4. El video listo aparece en la carpeta `out/`, dentro de la carpeta CHIP ABOGADO.

---

## Paso 8 · Pide ajustes

Mira el video y pide lo que quieras, en una frase:

- "Haz el subtítulo más grande."
- "Cambia el efecto del segundo 12 por portada de revista."
- "Pon la frase fuerte detrás de mí."
- "Haz una versión de 15 segundos."
- "Usa mi logo al final." (arrastra el logo a la conversación)

Claude rehace solo lo que pediste.

---

## Problemas comunes

| Problema | Qué hacer |
|---|---|
| "El video del iPhone no abre" | Es el formato HEVC. El CHIP ya lo convierte; si se traba, pide: "Convierte mi video a H.264 antes de editar." |
| El render es muy lento | Cierra otros programas. En una computadora con 8 GB de RAM, pide: "Renderiza con concurrencia 2." |
| "Sin espacio en disco" | Libera al menos 10 GB. Borra la carpeta `out/` de videos viejos que ya descargaste. |
| El subtítulo salió con una palabra mal | Pide: "Corrige la palabra X por Y en el subtítulo." |
| Claude se detuvo a la mitad | Escribe: "Continúa donde te quedaste." |
| Pidió permiso para un comando | Lee el comando y haz clic en Permitir. Son instalaciones y el propio render. |

---

## Checklist del primer video

- [ ] Plan Pro de Claude activo
- [ ] App de Claude instalada, pestaña Code abierta
- [ ] Carpeta CHIP ABOGADO con `CHIP_ABOGADO.md` y el mapa
- [ ] Node.js, ffmpeg y Python instalados
- [ ] Video grabado en vertical y copiado a la carpeta
- [ ] "Corre el CHIP ABOGADO." enviado
- [ ] Video listo en la carpeta `out/`

---

**Recordatorio ético:** el CHIP ABOGADO edita lo que dices y no pone promesas en pantalla. El contenido sigue siendo tuyo y tu responsabilidad, según las normas de publicidad del colegio de abogados de tu país.
