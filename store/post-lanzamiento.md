# Borrador: post de lanzamiento en LinkedIn

Regla para este post: tiene que pasar los filtros de sinhumo. Antes de publicarlo, correr:
`node -e "..."` (ver abajo) o pegarlo en un post de prueba con la extensión activa.

```
Hice una extensión de Chrome que filtra el humo de LinkedIn. Es gratis, de código abierto y no envía datos a ningún lado.

Qué filtra:
- Historias infladas: el café que terminó en lección de vida, el taxista que te cambió la carrera.
- Piloto automático: la plantilla publicada sin editar ("No es X. Es Y.", "Spoiler:", "si tu empresa ya hace esto, este post no es para ti").
- Autobombo, cebo de interacción ("comenta SÍ y te lo envío") y anuncios.
- Política, si la activas. Viene apagado.

Lo probé con mi feed: de 13 posts, 5 eran anuncios y 1 era una historia de superación de manual.

Dos decisiones que tomé a propósito:

1. No persigue la IA. Usar IA para escribir a partir de algo real está bien. Lo que filtra es el contenido sin nada propio.

2. No arma burbujas. Las reglas no pueden apuntar a opiniones: un post bien argumentado con el que no estás de acuerdo tiene que pasar. El filtro de política aparta el tema completo, de todos los sectores por igual.

Nada desaparece sin explicación: cada post filtrado muestra el motivo y tiene un botón para verlo igual o reportarlo como falso positivo.

Las reglas son archivos de texto. Si ves una frase que se repite en miles de posts, puedes proponerla sin saber programar.

Repo: https://github.com/jdurandpaz/sinhumo
```

## Notas
- El dato "13 posts, 5 anuncios, 1 historia" es de la prueba del 12-oct-2026. Actualizarlo si hay una muestra más grande antes de publicar.
- Opcional: una captura del feed con un anuncio atenuado (sin nombres ni caras de terceros).
- Una vez aprobada en la Chrome Web Store, cambiar el enlace del repo por el de la tienda y dejar el repo en un comentario.
