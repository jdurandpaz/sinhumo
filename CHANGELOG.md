# Cambios

## 0.2.2 — 2026-10-13

- **Cebo:** "Comenta \"SÍ\" y te lo envío" con la palabra clave entre comillas volvía a pasar, porque el motor ignoraba todo lo citado. Ahora solo ignora citas de varias palabras (las que se usan para comentar una frase).
- **Tienda:** capturas 1280x800 e imagen promocional en `store/capturas/`, generadas con posts sintéticos y el motor real (`npm run capturas`).

## 0.2.1 — 2026-10-12

- **Ícono nuevo:** un búho que sale de la neblina, la sabiduría que aparece cuando se despeja el humo. Los conceptos anteriores siguen en `icons/conceptos/`.

## 0.2.0 — 2026-10-12

Calibración con 111 posts reales de un feed (español e inglés).

- **Nuevo filtro "Cambios de trabajo"** (apagado por defecto): los anuncios de trabajo nuevo o de salida dejan de contarse como autobombo. Son noticias, no humo.
- **Historias infladas:** "¡GRAN ENSEÑANZA!" / "la lección que nos deja", el contraste "Hay quienes… Y hay quienes…", más variantes de lágrimas y la moraleja "esto es lo que nos hace humanos".
- **Piloto automático:** señal de apertura alarmista (3 o más emojis de alerta en la primera línea) y "No es un X cualquiera".
- **Autobombo:** "happy/glad/delighted to (finally) share", insignias autogeneradas ("View my verified achievement"), premios y reconocimientos.
- **Política:** reglas por institución (Cámara, Senado, Ejecutivo) y "la política actual". Menos falsos indicios: "the right way", "congreso de IA", "gobierno corporativo" y "ejecutivo de cuentas" ya no cuentan.
- **Promocionados:** detecta también "Promocionado • Colaboración con…".
- **Motor:** normaliza el apóstrofo curvo (’) que usa LinkedIn, para que calcen las reglas en inglés.

## 0.1.1 — 2026-10-12

Primera versión pública: filtros de historias infladas, piloto automático, autobombo, cebo, promocionados y política; botón "No es humo" para reportar falsos positivos.
