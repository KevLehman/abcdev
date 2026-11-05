---
idx: 1
title: "De JavaScript a Go I"
date: 2019-10-15T17:12:33.962Z
lang: es
translationOf: "from-js-to-go-i"
tags: ["golang", "javascript", "tutorial", "opinión"]
excerpt: "Una introducción al ecosistema de Go para desarrolladores de JavaScript: qué es Go, quién lo usa y por qué podrías empezar a programar con él."
draft: false
featured: false
series:
  id: js-to-go
  title: "De JavaScript a Go"
  order: 1
featuredImage: "../../../assets/images/javascript-to-go-illustration.png"
---

Este artículo, basado en el libro [_Go for JavaScript developers_](https://www.pazams.com/Go-for-Javascript-Developers), busca ayudarte a conocer un poco el ecosistema de Go y, por qué no, ¡a empezar a escribir código en este lenguaje!

Primero, algunos datos básicos.

## ¿Qué es Go?

Según su propia descripción, Go es _un lenguaje de programación de código abierto que facilita la creación de software simple, confiable y eficiente_. Es decir, Go se enfoca en la simplicidad y la eficiencia. Veremos cómo lo hace.

## ¿Quién usa Go?

En 2019, empresas como Uber, Google, Dailymotion, Twitch, SendGrid y Medium usaban Go en sus sistemas. El equipo de ingeniería de Uber incluso escribió sobre [cómo lo usan para consultas de geocercas en tiempo real](https://eng.uber.com/go-geofence/).

## ¿Por qué Go?

Espero que encuentres tu propia respuesta al terminar el artículo :)

Eso es suficiente por ahora. ¡Veamos código!

Nos enfocaremos en cuatro áreas:

- Sistema de tipos
- Manejo de memoria
- Manejo de errores
- Sistema de módulos

## El sistema de tipos de Go vs. los... ¿tipos de JavaScript?

Empecemos por lo básico: ¿cómo declaramos una variable?

En JavaScript:

```javascript
// JavaScript
const aVariable = 1;
```

En Go:

```go
// Golang
var aVariable int = 1;

// O, como declaración alternativa, con inferencia de tipo
aVariable := 1;
```

Como puedes ver, la estructura de las variables en Go es distinta a la de la familia C/C++:

- En C/C++: `type your identifier = value`.
- En Go: `var yourIdentifier type = value`.

En Go, el tipo se coloca _después_ del nombre de la variable. ¿Por qué? Rob Pike [escribió un artículo](https://blog.golang.org/gos-declaration-syntax) sobre esa diferencia y cómo mejora la legibilidad de las declaraciones.

JavaScript tiene tipado dinámico: una variable puede contener valores de distintos tipos. Algunos de esos tipos son:

- Números
- Cadenas de texto
- Booleanos
- Objetos

La lista no está completa: JavaScript también tiene tipos como `undefined`, `bigint` y `symbol`.

Go tiene tipos más explícitos, entre ellos:

- Enteros (`int`, `int8`, `int16`, `int32`, `int64`, `uint`, `uint32`...)
- Números de punto flotante (`float32`, `float64`)
- Arreglos y slices
- Mapas
- Canales
- Booleanos
- Etcétera

Go tiene tipado estático: cada variable tiene un tipo que el compilador verifica. También puedes definir tus propios tipos con `type`:

```go
type ServerResponse map[string]interface{}
```

¡Veamos más código! Para eso estás aquí, después de todo.

```javascript
// Definición de valores en JS
const x = 1.0;
const y = false;
const z = 'string';
const a = { b: 'string' };
```

¡Ahora veamos lo mismo en Go!

```go
// Usaremos la declaración abreviada

x := 1.0 // Go inferirá el tipo float64
y := false // Se inferirá el tipo bool
z := "string" // Es una cadena de texto
a := struct {
  b string
}{"string"} // Entonces, a.b tendrá el valor "string"
```

Estas son algunas diferencias importantes:

- Las cadenas de Go usan comillas dobles o acentos graves para cadenas literales sin procesar. Las comillas simples indican un literal de tipo rune, como `'c'`. En JS, tanto las comillas simples como las dobles delimitan cadenas.
- Go no tiene objetos como los de JS. Podemos representar estructuras de datos similares con structs.
- En Go, puedes inicializar un struct justo después de declararlo, como en el ejemplo anterior. Solo recuerda que el orden importa:

```go
// Esto producirá un error de compilación
a := struct {
  b string
  c int
}{1, "string"}

// Esto sí compilará
a := struct {
  b string
  c int
}{"string", 1}
```

- En Go, puedes declarar variables sin inicializarlas. El compilador les asignará su valor cero correspondiente. Por ejemplo:

```go
var x int
var y bool

fmt.Println(x) // imprimirá 0
fmt.Println(y) // imprimirá false
```

Para profundizar, revisa [este capítulo](https://www.pazams.com/Go-for-Javascript-Developers/pages/types/) de _Go for JavaScript developers_.

{% embed https://www.pazams.com/Go-for-Javascript-Developers/ %}

## Manejo de memoria

Go y JavaScript manejan la memoria automáticamente. Sus recolectores de basura recuperan la memoria que ya no es accesible. Veamos sus diferencias:

### El recolector de Go vs. el de JS

Go usa un recolector concurrente de marcado y barrido. Gran parte de su trabajo ocurre mientras el programa sigue ejecutándose, aunque la recolección incluye pausas breves. Puedes solicitar un ciclo con `runtime.GC()`. La [guía del recolector de Go](https://go.dev/doc/gc-guide) tiene más detalles.

Los motores de JavaScript también usan recolección de basura, pero el lenguaje no exige una implementación específica. Los motores modernos usan marcado y barrido con técnicas como la recolección incremental o concurrente. JavaScript no ofrece una forma de iniciar la recolección desde el lenguaje, aunque algunos entornos tienen opciones para depuración.

### Asignación en heap y stack

Ambos lenguajes abstraen la mayor parte del manejo del heap y el stack. En Go, el compilador decide dónde se pueden asignar los valores; en JavaScript, esa asignación la maneja el motor. Los detalles dependen de la implementación.

## Manejo de errores

Ambos lenguajes pueden representar errores como valores, pero el flujo habitual es distinto. JavaScript puede lanzar excepciones; las funciones de Go suelen devolver un `error` junto con el resultado.

JS incluye las construcciones try/catch/finally en el lenguaje. ¿Recuerdas cuando todo se manejaba con `window.onerror`? Funcionan con código síncrono o cuando usas `await`:

```javascript
try {
  throw new Error("This is an error");
  // Este código no se ejecutará
} catch (e) {
  // Maneja e como prefieras.
  // ¿Qué tal un `throw e`?
} finally {
  // Este bloque se ejecutará haya ocurrido un error o no.
}
```

Si los errores vienen de operaciones asíncronas, puedes manejarlos así, por ejemplo, con promesas:

```javascript
aPromise
  .then(value => value)
  .catch(err => { /* manejar err */ });
```

El manejo de errores en Go es un poco más explícito. Cuando una falla es esperada, una función normalmente devuelve un `error`. Por ejemplo, convertir la entrada de un usuario de texto a número puede fallar:

```go
func ParseDollars(input string) (float64, error) {
  return strconv.ParseFloat(input, 64)
}
```

Este fragmento usa el paquete `strconv` de la biblioteca estándar. Quien llama a la función debe revisar el error antes de usar el valor.

Go también tiene `panic` para situaciones en las que la ejecución normal no puede continuar, como cuando se incumple una condición que el programa necesita para funcionar. Por lo general, es mejor devolver un error si falla la conexión con la base de datos: quien llama a la función podría reintentar o informar el problema.

Un panic interrumpe la goroutine actual y ejecuta sus funciones diferidas mientras sale de la pila de llamadas. Si nadie lo recupera, el programa termina. Una función diferida en la misma goroutine puede llamar a `recover`:

```go
func foo() {
  defer func() {
    if err := recover(); err != nil {
      fmt.Println(err)
    }
  }()
  panic("foo: fail")
}
```

¿Notaste `defer`? Esta palabra programa una llamada para cuando la función que la contiene termine, ya sea normalmente o durante un panic. Aquí, la función diferida llama a `recover` y revisa el resultado antes de imprimirlo.

El blog de Go tiene [un buen artículo](https://go.dev/blog/defer-panic-and-recover) para aprender más sobre `defer`, `panic` y `recover`.

{% embed https://go.dev/blog/defer-panic-and-recover %}

Solo recuerda algo: el contexto de ejecución de `defer` podría no ser el que esperas ;).

## Módulos de Go vs. módulos de JS

### ¿Cómo exportar e importar módulos?

Desde `ES6`, JS tiene un sistema de módulos integrado. JS no se creó pensando en módulos. En sus primeros años era común ver archivos largos con todo el código necesario, y estaba bien: JS solo se usaba para agregar algunas funciones a los sitios web. Más adelante, con el auge de JS como lenguaje «de verdad», surgió la necesidad de dividir el código. Así aparecieron herramientas que permitían usar módulos, como [CommonJS](https://en.wikipedia.org/wiki/CommonJS) y [RequireJS](https://requirejs.org/). Pero ¿cómo se define un módulo de ES6?

```javascript
export const name = 'square';

export function draw(ctx, length, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, length, length);

  return {
    length,
    x,
    y,
    color,
  };
}
```

Y ahora, _a importarlo_, porque solo exportar sería aburrido.

```javascript
import { name, draw } from './path/to/module.js';
```

¿Y en Go? La historia es un poco distinta. Go se diseñó con soporte para paquetes desde el principio. Go 1.6 mejoró el soporte para guardar dependencias en una carpeta `vendor`, pero las herramientas del lenguaje todavía no ofrecían la gestión de versiones basada en módulos que tienen hoy. Los proyectos de JavaScript suelen usar `package.json` y archivos de bloqueo para administrar dependencias.

Go 1.11 introdujo los módulos. El archivo `go.mod` de un módulo registra sus dependencias y versiones; `go.sum` guarda sumas de verificación para comprobar el contenido descargado. Los módulos también permiten usar `vendor`. En conjunto, estas herramientas ayudan a que las compilaciones sean reproducibles.

¿Cuál es la diferencia? En JS puedes exportar cualquier tipo válido, incluso una función anónima. En Go no funciona así: el código se organiza en paquetes, que sirven como espacios de nombres para sus identificadores exportados.

```go
package square

var Name = "square"

func Area(side int) int {
  return side * side
}
```

Y en otro archivo:

```go
// Un nombre de importación puede renombrar el paquete localmente.
import shape "example.com/project/square"

func example() int {
  return shape.Area(4)
}
```

Tal vez te preguntes: _¿cómo sabe Go qué se exporta de un paquete si no se lo estoy diciendo?_

En Go, los identificadores que empiezan con una letra mayúscula se exportan por defecto. Por ejemplo:

```go
package test

var name string = "not exported"
```

Intentar acceder a `test.name` desde otro paquete producirá un error, porque ese identificador no está exportado.

### ¿Cómo instalar dependencias?

En JS puedes usar [npm](https://www.npmjs.com/) para instalar bibliotecas externas con `npm install my-dependency@latest`.

En Go, la gestión de dependencias está integrada en el comando `go`. Desde un módulo, ejecuta `go get example.com/my-library` para agregar o actualizar una dependencia. Para instalar un ejecutable, usa `go install example.com/tool@latest`. Las dependencias pueden estar alojadas en GitHub, GitLab y otros servidores.

Esta fue una breve introducción al enorme ecosistema de Go y a su diseño, que busca ser simple, claro y legible. Espero que ahora conozcas:

- Las diferencias entre JS y Go en tipos, módulos y sintaxis
- Cómo crear variables en Go
- Cómo maneja Go los errores y los panic

¡A programar en Go!
