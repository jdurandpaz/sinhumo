# Cómo aportar a sinhumo

Gracias por sumarte. La mayor parte del valor está en las reglas, y para aportar reglas no hace falta programar.

## Principios (no negociables)

1. **Filtramos contenido vacío, no la IA.** Una regla no puede apuntar a "esto lo escribió una IA"; tiene que apuntar a un recurso vacío (epifanía de manual, cebo, autobombo).
2. **Temas, no posturas.** Un filtro temático (política, religión, fútbol…) debe atrapar por igual a todos los sectores. Si agregas una regla que solo atrapa a un lado, agrega su espejo en el mismo PR. Los tests de política incluyen un caso por lado.
3. **Nada de datos personales.** Los ejemplos de prueba son **sintéticos** o están reescritos de forma que no se pueda reconocer al autor. Nunca pegues un post real con nombre, empresa ni enlace.
4. **Nada de acciones en la cuenta.** sinhumo no deja de seguir, no da likes, no hace scraping ni envía datos a servidores. Los PRs que agreguen algo de esto no se aceptan.

## Agregar o ajustar una regla

Las reglas viven en `filters/<filtro>/<idioma>.json`:

```json
{ "id": "humo.es.lee-de-nuevo", "pattern": "\\b(lee(lo)? (eso|esto)? ?(de nuevo|otra vez)|vuelve a leer(lo)?)", "weight": 2, "description": "\"Léelo de nuevo\"" }
```

- `id`: único, con el formato `<filtro>.<idioma>.<nombre-corto>`.
- `pattern`: expresión regular. El texto se compara **en minúsculas y sin tildes**, así que escribe el patrón sin tildes (`enseno`, no `enseñó`).
- `weight`: cuánto suma. Como guía: 1 = indicio débil, 2 = recurso típico, 3 = casi seguro por sí solo.
- `description`: lo que verá la persona al pasar el mouse por la barra.

Cada filtro se activa cuando la suma alcanza su `threshold` (en `filter.json`). Una regla no debería alcanzar el umbral sola salvo que sea inequívoca.

## Agregar un filtro nuevo

1. Crea `filters/<id>/filter.json` con `id`, `name`, `description`, `threshold`, `defaultEnabled` (los temáticos van en `false`), `reducedByAporta` (`true` para filtros de calidad, `false` para temáticos) y `signals`.
2. Agrega al menos un archivo de reglas (`es.json` o `en.json`).
3. Suma el id a `filters/index.json`.
4. Agrega ejemplos a `test/fixtures/posts.json`: al menos uno que debe caer y uno parecido que **no** debe caer.

## Agregar un idioma

Agrega el código a `languages` en `filters/index.json` y crea `<idioma>.json` en los filtros que quieras cubrir (no hace falta hacerlos todos de una vez).

## Ejemplos y tests

```
npm test
```

Cada ejemplo de `test/fixtures/posts.json` declara qué filtros deben atraparlo (`"expect": ["humo"]`, o `[]` si es un post que aporta). Un PR que cambia reglas tiene que dejar todos los tests en verde. Los **falsos positivos** valen tanto como los aciertos: si un post bueno quedó filtrado, agrégalo como ejemplo con `"expect": []` y ajusta la regla.

## Cuando LinkedIn cambia su HTML

Si el filtro deja de aplicarse, casi siempre se arregla en `src/linkedin-dom.js` (selectores del contenedor del post y del texto). Indica en el PR la fecha y el navegador donde lo probaste.
