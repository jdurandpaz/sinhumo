# Ficha para la Chrome Web Store

Textos listos para copiar en el panel de desarrollador (https://chrome.google.com/webstore/devconsole).

## Nombre
sinhumo

> No usar "LinkedIn" en el nombre: la política de la tienda no permite marcas de terceros en el título. Sí se puede mencionar en la descripción ("para LinkedIn").

## Descripción breve (máx. 132 caracteres)
```
Menos humo, mejor debate: filtra historias infladas, autobombo, cebo y anuncios de tu feed de LinkedIn. Todo local.
```

## Descripción detallada
```
sinhumo filtra el humo de tu feed de LinkedIn: la historia de superación que empezó con un café, el "orgulloso de anunciar", el "comenta SÍ y te lo envío", la plantilla publicada sin editar y los anuncios.

Menos humo, mejor debate
sinhumo no está hecho para que veas solo lo que piensas. Los filtros juzgan la forma vacía, nunca la opinión: un post bien argumentado con el que no estás de acuerdo pasa siempre. Los filtros de temas, como política, vienen apagados y apartan el tema completo, de todos los sectores por igual.

No persigue la IA, persigue el humo
Escribir con IA a partir de una idea real está perfecto. Lo que filtramos es el contenido sin nada propio.

Cómo funciona
• Cada post filtrado se atenúa (o se oculta, o solo se etiqueta) y muestra el motivo.
• "Ver igual" lo abre; "No es humo" lo marca como falso positivo y abre un reporte para mejorar la regla.
• Eliges qué filtros usar y qué tan estrictos son.

Filtros
• Historias infladas
• Piloto automático (plantilla sin editar)
• Autobombo
• Cebo de interacción
• Promocionados
• Política (apagado por defecto)

Privacidad
Todo se procesa en tu navegador. Sin servidor, sin cuenta, sin analítica. sinhumo no hace ninguna acción en tu cuenta: no deja de seguir, no da likes ni hace scraping.

Código abierto (MIT) y hecho por la comunidad: las reglas son archivos simples y cualquiera puede proponer nuevas.
https://github.com/jdurandpaz/sinhumo

sinhumo no está afiliado con LinkedIn Corporation.
```

## Categoría
Elegir la más cercana a "Herramientas de redes sociales" o "Productividad" en el panel.

## Idioma principal
Español (agregar inglés como segundo idioma de la ficha más adelante).

## Propósito único (single purpose)
```
Filtrar visualmente los posts del feed de LinkedIn según filtros de calidad y de tema elegidos por la persona, sin realizar acciones en su cuenta.
```

## Justificación de permisos
| Permiso | Justificación |
|---|---|
| `storage` | Guardar la configuración de filtros y la lista local de posts marcados como falso positivo. |
| Acceso a `https://www.linkedin.com/*` (content script) | Leer el texto de los posts del feed para clasificarlos y atenuarlos en la página. No se envía a ningún lado. |

¿Usa código remoto? **No.** Todo el código está empaquetado en la extensión.

## Uso de datos (formulario de privacidad)
- No recolecta ninguna categoría de datos de usuario.
- Certificar: no se venden datos, no se usan para fines ajenos al propósito único, no se usan para crédito.
- URL de la política de privacidad: `https://github.com/jdurandpaz/sinhumo/blob/main/PRIVACY.md`

## Recursos gráficos
| Recurso | Tamaño | Estado |
|---|---|---|
| Ícono | 128x128 PNG | `icons/icon-128.png` |
| Capturas (1 a 5) | 1280x800 o 640x400 | Pendiente: feed con un post atenuado, la barra con "Ver igual / No es humo", la página de opciones. **Sin nombres ni caras de terceros**: usar posts sintéticos o difuminar. |
| Imagen promocional pequeña | 440x280 | Pendiente (opcional pero recomendada) |

## Antes de enviar
- [ ] Cuenta de desarrollador de Chrome Web Store (pago único de USD 5, lo hace Julio).
- [ ] `npm run pack` y subir `dist/sinhumo-<versión>.zip`.
- [ ] Revisión de Google: suele tardar de unos días a un par de semanas.
