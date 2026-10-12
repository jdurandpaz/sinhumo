# sinhumo

**Filtra el humo de tu feed de LinkedIn.** Una extensión de navegador, abierta y hecha por la comunidad, que atenúa u oculta los posts que no aportan: el café convertido en historia de superación, el "orgulloso de anunciar", el "comenta SÍ y te lo envío", y los temas que tú decidas no ver.

> *English summary below.*

## Por qué

LinkedIn se llenó de historias inspiradoras vacías, sin toque personal, con la misma plantilla repetida mil veces. Una persona se toma un café y lo sube como una epopeya de resiliencia.

**sinhumo no persigue la IA.** Usar IA para escribir a partir de una idea real, con algo que enseñar, está perfecto. Lo que filtramos es el contenido vacío: la forma sin fondo, venga de donde venga.

## Qué hace (y qué no)

- ✅ Clasifica cada post **en tu navegador** mientras haces scroll y lo atenúa, oculta o etiqueta, siempre con un botón **"Ver igual"** y el motivo a la vista.
- ✅ Filtros independientes que activas a gusto.
- ✅ Sin servidor, sin cuenta, sin telemetría. Ningún dato sale de tu computador.
- ❌ **No hace acciones en tu cuenta.** No deja de seguir, no elimina contactos, no da likes, no hace scraping. Solo cambia lo que tú ves. Así no arriesgas tu cuenta: LinkedIn restringe las cuentas que usan automatización.

## Filtros incluidos

| Filtro | Qué atrapa | Activo por defecto |
|---|---|---|
| **Historias infladas** (`humo`) | Hecho trivial → lección de vida; el taxista o el barista que te cambió la carrera; "léelo de nuevo"; formato de una línea por idea | Sí |
| **Autobombo** (`brag`) | "Orgulloso de anunciar", "no suelo publicar esto, pero…", de la nada a la cima | Sí |
| **Cebo de interacción** (`cebo`) | "Comenta X y te lo envío", "dale like si…", "sígueme para más" | Sí |
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

## Aportar

Lo más valioso **no requiere programar**: reglas nuevas, idiomas nuevos, filtros nuevos y ejemplos de prueba. Lee [CONTRIBUTING.md](CONTRIBUTING.md).

## Hoja de ruta

- [ ] Verificar los selectores contra el feed actual de LinkedIn
- [ ] Portugués
- [ ] Filtros nuevos: venta encubierta, carruseles motivacionales, "10 herramientas de IA que…"
- [ ] Clasificador opcional con LLM usando la API key de cada persona (nunca un servidor del proyecto)
- [ ] Puntaje por perfil (verificado + % de posts que aportan) como ayuda para decidir a quién dejar de seguir, siempre con clic humano
- [ ] Publicar en la Chrome Web Store

---

## English summary

**sinhumo** ("smoke-free") is an open-source browser extension that dims or hides low-value LinkedIn posts: inflated life-lesson stories, humblebrags, engagement bait, and any topic you opt out of (e.g. politics). It does not fight AI-assisted writing, only empty content. Everything runs locally; it never performs actions on your account. Rules are plain JSON files per filter and language, so contributing doesn't require coding. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

[MIT](LICENSE)
