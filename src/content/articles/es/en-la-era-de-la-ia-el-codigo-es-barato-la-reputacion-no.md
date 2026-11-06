---
idx: 13
title: "La IA puede escribir tu código. Tú construyes tu reputación."
date: "2026-03-04T21:01:29Z"
lang: es
translationOf: "in-the-ai-era-code-is-cheap-reputation-isnt-3482"
tags: ["ia", "código abierto", "programación", "software"]
excerpt: "La IA hace que contribuir al código abierto sea más fácil en lo mecánico, pero más difícil para tu reputación. Con agentes inundando repositorios de PRs, la reputación es lo que crece con el tiempo."
draft: false
featured: false
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fm0b25t9rnk2hseb0o8qx.png"
---

En la era de la IA, ¡contribuir al código abierto es más fácil que nunca!

Pero, al mismo tiempo y aunque parezca contradictorio, es más difícil que nunca.

¿Por qué? Porque ahora es *más fácil en lo mecánico, pero más difícil para tu reputación*.

Antes competías con otros voluntarios increíblemente inteligentes, con desarrolladores que aportaban su experiencia y tiempo libre al código abierto, o con personas que estaban empezando. Ahora compites con todos ellos y con un ejército de agentes de IA que generan pull requests, issues, refactorizaciones y reportes de vulnerabilidades más rápido que cualquier persona.

Es tentador. Un LLM puede reducir mucho el trabajo mental necesario para entender un repositorio e incluso para proponer un cambio valioso. Cosas que antes eran «muy difíciles» ahora están a unos cuantos prompts de distancia. Eso redujo la barrera de entrada para contribuir, ¡y es genial! Pero también aumentó enormemente el volumen de contribuciones y está inundando los repositorios.

¿Cuál es el problema?

*La capacidad de los maintainers no aumentó.*
*El costo de revisión no disminuyó.*

Estas dos realidades ya han llevado a maintainers a tomar medidas drásticas, como ocurrió con `curl`. Daniel Stenberg escribió sobre el problema en [«Death by a thousand slops»](https://daniel.haxx.se/blog/2025/07/14/death-by-a-thousand-slops/).

Entonces, ¿cómo te conviertes en un contribuidor valioso de código abierto en la era de la generación infinita de código? Aquí van algunos consejos que he aprendido al lidiar con un gran volumen de contribuciones.

## 1. Piensa. Y luego vuelve a pensar

La IA puede producir código excelente, pero también puede producir el peor código que la humanidad haya visto. Depende mucho de:

- El _prompt_ que uses.
- La _calidad_ del LLM.
- El _contexto_ que compartas.

Y lo más importante:

- Tu propia capacidad para programar.

¿Por qué necesitas saber programar antes de usar LLMs para contribuir al código abierto?

Porque *un LLM no puede saberlo todo*.

Por ejemplo, recibimos un PR que intentaba cambiar esto:

Antes:

```typescript
		} catch (error) {
			console.error('Some error:', error);
		}
```

Después:

```typescript
		} catch (error) {
			logger.error('Some error:', error);
		}
```

Podrías decir: «¡Ese cambio es válido, queremos usar `logger` en lugar de `console`!». ¿Cuál es el problema?

El LLM no sabía —y no lo comprobó, porque nadie se lo pidió— que recientemente habíamos cambiado los tipos de nuestras instancias de `logger`, por lo que el cambio no era válido.

Un cambio válido se habría visto así:

```typescript
		} catch (err) {
			logger.error({ msg: 'Some error', err });
		}
```

Pero el LLM no lo sabía y habría necesitado bastante contexto para saberlo. Buenos LLMs (Claude, Codex, etc.) lo habrían detectado, pero otros no, a menos que se lo pidieras. ¿Cómo vas a pedir algo que no sabías que existía? Ahí es donde entra tu capacidad para programar.

Este es el punto: *no puedes pedir en un prompt lo que no sabes que existe*.

Quien quiere contribuir no confía ciegamente en lo que produce el LLM. Sabe usar las herramientas —en este caso, el chequeo de tipos— para detectar esos problemas y lee el código para entender las convenciones actuales y sus particularidades.

Para estos programadores, *los LLMs son una herramienta poderosa*: les ayudan con la tarea mecánica de programar y les dejan tiempo para pensar.

Esto también protege tu reputación. Si los maintainers ven que constantemente envías PRs que aportan poco, con el tiempo dejarán de revisarlos. O algo peor.

Los LLMs hacen que contribuir sea más rápido, pero no reemplazan tu cerebro, a menos que tú se lo permitas.

## 2. Respeta el volumen. Revisar no es gratis.

Estás feliz. Y nosotros también estamos felices de que quieras contribuir al código abierto. Es una actividad noble que puede hacer más seguro al repositorio y ayudarte a mejorar. ¡Todos ganan!

Pero los maintainers tienen:

- Capacidad limitada.
- Tiempo limitado.
- _Paciencia limitada._

Entendemos que estés feliz de haber creado tu PR. Todos hemos sentido esa emoción. Por supuesto que quieres que se integre para poder decir con orgullo: «¡Contribuí a X!».

Pero sé razonable:

- El costo de abrir un PR ahora es casi cero.
- El costo de *revisarlo* no lo es.

Esa asimetría es la verdadera tensión de la era de la IA.

Si:

- comentas «por favor revisen» repetidamente,
- insistes de forma agresiva a los maintainers,
- exiges fechas para integrar tu PR,

aumentas el costo mental de tu contribución. Incluso si tu PR es válido.

Y esta es la dura realidad:

*Los maintainers son humanos.*

Si interactuar contigo les resulta costoso, podrían darle menos prioridad a tu trabajo sin darse cuenta. Eso significa menos revisiones, menos PRs integrados y menos menciones en las notas de lanzamiento.

Esto es especialmente importante cuando usas LLMs o agentes, porque son rápidos, mucho más rápidos que los humanos. Podrías terminar haciendo 100 PRs que crees válidos, ¡y quizás lo sean! Pero si los maintainers no tienen capacidad para revisarlos todos, simplemente no lo harán.

Esa es la definición de un DoS (denegación de servicio): envías más solicitudes de las que el servidor —los maintainers— puede procesar.

## 3. Calidad sin tomar atajos (Wendy's, por favor no me demandes)

La capacidad de los maintainers es limitada. En el último mes cerramos alrededor de 700 issues que estaban abandonados, no eran válidos o ya estaban resueltos, pero al mismo tiempo recibimos 300 nuevos. Algunos eran válidos y otros no. El problema es que no lo sabemos de antemano: *tenemos que revisarlos todos*. No puedes confiar en que un LLM confirme si algo es slop, ¡porque la comprobación también podría ser slop!

Un ejemplo relacionado es este [reporte de curl en HackerOne](https://hackerone.com/reports/3516186), sobre los reportes de vulnerabilidades generados con IA.

El enlace anterior y esta hermosa [lista de reportes de seguridad de curl generados con IA](https://gist.github.com/bagder/07f7581f6e3d78ef37dfbfc81fd1d1cd) tienen algo en común:

Parecen legítimos hasta que dejan de parecerlo. Pero para darte cuenta de que algo es slop tienes que revisarlo manualmente, y eso consume tiempo y esfuerzo. A los maintainers no les gusta que desperdicien su tiempo: tienen otras cosas que hacer.

Así que sé humano, respeta el tiempo y el trabajo de los maintainers. ¿Cómo? *Ayudándolos a reducir el costo de revisar tu código*.

Antes de enviar tu contribución:

- ¿Reprodujiste el problema tú mismo?
- ¿Ejecutaste el CI localmente?
- ¿Incluiste capturas de pantalla para los cambios de interfaz?
- ¿Incluiste benchmarks para respaldar las afirmaciones sobre rendimiento?
- ¿Incluiste una prueba de concepto para los reportes de seguridad?
- ¿Comprobaste si ya existe una solicitud para esa funcionalidad?

Si afirmas que mejoraste el rendimiento, *muestra los números*.
Si corriges un bug, *explica la causa raíz*.
Si propones una funcionalidad, *pregunta primero*.

Las contribuciones de calidad se revisan más rápido.
Las contribuciones que aportan poco se acumulan.

En la era de la IA, *la reputación se acumula*. Si los maintainers pueden confiar en ti, revisarán tus PRs más rápido y tú estarás más feliz. ¡Todos ganan!

## 4. Agrupa los cambios triviales

Los errores tipográficos pasan. Los pequeños errores pasan. Por ejemplo:

Antes:

```typescript
		if (!sub) {
			throw new Error('subsciption not found');
		}
```

Después:

```typescript
		if (!sub) {
			throw new Error('subscription not found');
		}
```

¿Ves el error? Sí, falta una `r` en `subscription`. La contribución es válida: queremos escribir correctamente en inglés.

¿Merece un PR? Por sí sola, no. Quizás si la combinas con algunas más. Imagina que encuentras 10 errores como ese. ¿Qué es más fácil para los maintainers: un PR con 10 cambios o 10 PRs con un cambio cada uno? Jeje.

*Si tú fueras el maintainer, ¿qué preferirías?*

Cada PR tiene un costo adicional: ejecución de CI, notificaciones, tiempo de revisión, tiempo para integrarlo, cambio de contexto mental, etc. Reduce ese costo agrupando el trabajo trivial.

La IA puede encontrar una enorme lista de arreglos como este en un repositorio. Y si usas un agente como Claude o Clawd, puedes decirle «crea un PR por cada problema» y convertirte en el contribuidor más odiado del proyecto :(

No hagas eso. Por favor. Sé considerado. *Sé humano*.

## Los LLMs son divertidos, pero el trabajo humano es mejor

Estamos en la era de la IA. Ya no podemos luchar contra ella: llegó para quedarse. Lo que sí podemos cambiar es cómo la usamos.

En GSoC, por ejemplo, valoramos las contribuciones humanas. Ese es el objetivo del programa: ¡que más personas se conviertan en contribuidores de código abierto!

Necesitamos nuevas generaciones de maintainers, de personas inteligentes que usen los LLMs con criterio. Puedes hacer cosas increíbles con ellos si los usas bien, pero nada reemplazará tu capacidad de hacer cosas increíbles como persona. Recuerda eso.

Es más fácil contribuir, pero más difícil destacar entre la multitud.
La reputación importa.
La confianza se gana.
La construyes haciendo buen trabajo.

Como nota final, esto se basa principalmente en mi experiencia personal. Algunos proyectos pueden tener reglas distintas. Quizás a algunos les guste recibir 1,000 PRs al día. ¿Quién sabe?

Pero la idea principal es esta: la IA no es humana, pero los maintainers y contribuidores sí. No lo olvides.

¡Bienvenido al código abierto!

Si quieres leer más, aquí está [«AI is destroying Open Source, and it’s not even good yet», de Jeff Geerling](https://www.jeffgeerling.com/blog/2026/ai-is-destroying-open-source/).
