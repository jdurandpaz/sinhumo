# sinhumo

**Filtra el humo de tu feed de LinkedIn.** Una extensión de navegador, abierta y hecha por la comunidad, que atenúa u oculta los posts que no aportan: el café convertido en historia de superación, el "orgulloso de anunciar", el "comenta SÍ y te lo envío", y los temas que tú decidas no ver.

> *English summary below.*

## Por qué

LinkedIn se llenó de historias inspiradoras vacías, sin toque personal, con la misma plantilla repetida mil veces. Una persona se toma un café y lo sube como una epopeya de resiliencia.

sinhumo busca **subir el nivel del debate y de la divulgación**: que en el feed se note más la gente que enseña, discute con argumentos o cuenta algo real, y menos la que solo llena espacio.

### No es una burbuja

sinhumo **no está hecho para que veas solo las ideas con las que estás de acuerdo.** Una opinión distinta a la tuya, bien argumentada, es justo el tipo de post que queremos que llegue a tu feed. Por eso:

- Los filtros de calidad juzgan la **forma vacía** (la epifanía de manual, el cebo, el autobombo), nunca la postura de quien escribe.
- Los filtros temáticos (como política) vienen **apagados** y apartan un tema completo, de todos los sectores por igual. Sirven para elegir de qué quieres hablar en LinkedIn, no para silenciar a quien piensa distinto.
- Cada post filtrado muestra el motivo y un botón **"Ver igual"**. Nada desaparece sin que sepas por qué.

### La IA no es el enemigo

La IA trae una capacidad de creación increíble, y también se puede usar mal: para fabricar historias que nunca pasaron o producir posts en serie sin nada detrás. **sinhumo no persigue la IA, persigue el humo.** Escribir con IA a partir de una premisa real, con algo que enseñar, e iterarla hasta que diga lo que quieres decir, está perfecto.

Este proyecto quiere usar la IA para eso: no solo para filtrar, sino para **motivarnos a redactar mejor nuestros propios posts.**

## Qué hace (y qué no)

- ✅ Clasifica cada post **en tu navegador** mientras haces scroll y lo atenúa, oculta o etiqueta, siempre con un botón **"Ver igual"** y el motivo a la vista.
- ✅ Filtros independientes que activas a gusto.
- ✅ Sin servidor, sin cuenta, sin telemetría. Ningún dato sale de tu computador.
- ❌ **No hace acciones en tu cuenta.** No deja de seguir, no elimina contactos, no da likes, no hace scraping. Solo cambia lo que tú ves. Así no arriesgas tu cuenta: LinkedIn restringe las cuentas que usan automatización.

## Filtros incluidos

| Filtro | Qué atrapa | Activo por defecto |
|---|---|---|
| **Historias infladas** (`humo`) | Hecho trivial → lección de vida; el taxista o el barista que te cambió la carrera; "léelo de nuevo"; formato de una línea por idea | Sí |
| **Piloto automático** (`piloto`) | Plantilla publicada sin editar: "No es X. Es Y.", "Spoiler:", "si tu empresa ya hace esto, este post no es para ti", negritas Unicode. No dice "esto es IA": dice que nadie le puso nada propio, y necesita varias marcas juntas | Sí |
| **Autobombo** (`brag`) | "Orgulloso de anunciar", "no suelo publicar esto, pero…", de la nada a la cima | Sí |
| **Cebo de interacción** (`cebo`) | "Comenta X y te lo envío", "dale like si…", "sígueme para más" | Sí |
| **Promocionados** (`promocionados`) | Anuncios pagados ("Promocionado por LinkedIn"), detectados por la etiqueta y no por el texto | Sí |
| **Política** (`politica`) | Contenido partidista o electoral, **de cualquier sector** | No |

Las señales de que un post **aporta** (cifras concretas, código, fuentes, un "cómo lo hicimos" con lo que no funcionó) le restan puntaje en los filtros de calidad.

## Instalar (modo desarrollador)

1. Descarga o clona este repo.
2. Abre `chrome://extensions` y activa **Modo de desarrollador**.
3. Haz clic en **Cargar descomprimida** y elige la carpeta del repo.
4. Haz clic en el ícono de sinhumo para elegir filtros, sensibilidad e idiomas.

Funciona en Chrome, Edge, Brave y Arc. Firefox está pendiente.

## Cómo funciona

```
filters/
  index.json            # filtros e idiomas disponibles
  humo/
    filter.json         # nombre, descripción, umbral, señales de formato
    es.json             # reglas en español
    en.json             # reglas en inglés
  _aporta/              # señales que restan puntaje (datos, código, fuentes)
src/
  engine.js             # motor de puntaje (sin dependencias)
  linkedin-dom.js       # selectores del HTML de LinkedIn — lo primero que se rompe
  content.js            # recorre el feed y aplica el filtro
```

Cada regla tiene un patrón y un peso. Si la suma de un filtro supera su umbral, el post queda filtrado y la barra muestra qué filtro lo atrapó; al pasar el mouse se ven las reglas exactas.

## Falsos positivos

Ninguna regla es perfecta. Cada post filtrado tiene un botón **"No es humo"**: lo muestra, lo recuerda para no volver a filtrarlo en tu navegador y abre un reporte prellenado en este repo con el filtro y las reglas que se activaron. **El texto del post no se envía**, porque es de otra persona; si quieres, puedes agregar una versión anonimizada.

### ¿Tu post quedó filtrado?

Si escribiste un post que aportaba y alguien te dijo que sinhumo lo filtró, [abre un reporte](../../issues/new?template=falso-positivo.yml) y elige "Soy quien escribió el post". Revisamos la regla, y si estaba mal, se ajusta y se agrega un caso de prueba para que no se repita.

## Aportar

Lo más valioso **no requiere programar**: reglas nuevas, idiomas nuevos, filtros nuevos y ejemplos de prueba. Lee [CONTRIBUTING.md](CONTRIBUTING.md).

## Hoja de ruta

- [ ] Verificar los selectores contra el feed actual de LinkedIn
- [ ] Más marcas de "piloto automático" sacadas del feed real en español
- [ ] Portugués
- [ ] Filtros nuevos: venta encubierta, carruseles motivacionales, "10 herramientas de IA que…"
- [ ] Clasificador opcional con LLM usando la API key de cada persona (nunca un servidor del proyecto)
- [ ] Puntaje por perfil (verificado + % de posts que aportan) como ayuda para decidir a quién dejar de seguir, siempre con clic humano
- [ ] **Modo redactor:** al escribir tu propio post, sinhumo te avisa si cae en los recursos vacíos y te sugiere cómo darle fondo (un dato, un ejemplo real, lo que no funcionó), sin reescribirlo por ti
- [ ] Publicar en la Chrome Web Store

---

## English summary

**sinhumo** ("smoke-free") is an open-source browser extension that dims or hides low-value LinkedIn posts: inflated life-lesson stories, humblebrags, engagement bait, and any topic you opt out of (e.g. politics). It does not fight AI-assisted writing, only empty content, and it is explicitly not a filter bubble: quality filters judge empty form, never viewpoints, and topic filters (off by default) remove a whole topic for every side alike. The goal is to raise the level of debate and knowledge-sharing, and eventually to help people write better posts themselves. Everything runs locally; it never performs actions on your account. Rules are plain JSON files per filter and language, so contributing doesn't require coding. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

[MIT](LICENSE). Ver también la [política de privacidad](PRIVACY.md).

*sinhumo no está afiliado, respaldado ni patrocinado por LinkedIn Corporation.*
