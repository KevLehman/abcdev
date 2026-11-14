---
idx: 2
title: "De JavaScript a Go II"
date: 2019-11-02T17:12:33.962Z
lang: es
translationOf: "from-js-to-go-ii"
tags: ["golang", "javascript", "tutorial", "opinión"]
excerpt: "Continuamos la serie de JavaScript a Go: comparamos arreglos, slices, diccionarios, conjuntos y funciones."
draft: false
unlisted: true
featured: false
series:
  id: js-to-go
  title: "De JavaScript a Go"
  order: 2
featuredImage: "../../../assets/images/node-vs-go.png"
---

En el [artículo anterior](https://dev.to/kaleman15/from-javascript-to-go-50ef) vimos algunas diferencias entre JS y Go y empezamos a familiarizarnos con la lectura de código en Go.

Esta vez compararemos tipos y funciones. En concreto:

- Arreglos y slices
- Diccionarios
- Conjuntos
- Funciones

## Arreglos y slices

### ¿Cómo funcionan en JavaScript?

Un arreglo de JS tiene tamaño dinámico: no necesitas definir su longitud al crearlo.

```javascript
const myArr = ['this', 'is', 'good'];

console.log(myArr); // ['this', 'is', 'good']
```

El prototipo de `Array` incluye métodos útiles:

```javascript
myArr.push('b'); // Agrega un valor al final
myArr.shift(); // Elimina el primer elemento
myArr.pop(); // Elimina el último elemento
const combined = myArr.concat(['c']); // Devuelve un arreglo nuevo; no modifica myArr
```

Y la lista sigue. El prototipo de los arreglos de JS incluye muchas funciones y también puedes extenderlo:

```javascript
Array.prototype.sayHello = function() { return 'hello' }
myArr.sayHello(); // ¡Imprime 'hello'!
```

La API de arreglos de JS es amplia y muy útil.

### ¿Cómo funcionan en Go?

Go tiene dos tipos: arreglos y slices. La diferencia está en la longitud: los arreglos tienen un tamaño fijo que no puede cambiar después de definirlos.

```go
a1 := [3]int{1,2,3} // Crea un arreglo con [1,2,3]
var a2 [3]int // Crea un arreglo con [0,0,0]
```

La longitud de un arreglo forma parte de su tipo. Por eso no puedes pasar un arreglo de longitud 2 a una función que espera uno de longitud 3:

```go
var arr1 [2]int
var arr2 [3]int

func aDummyFunction(arr [3]int) { /* Hacer algo */ }

aDummyFunction(arr1) // No se puede usar [2]int como [3]int

aDummyFunction(arr2) // ¡Correcto!
```

Con los slices es distinto: no tienen una longitud fija y pueden crecer. Cada slice se apoya en un arreglo subyacente:

```go
var s1 []int // Declara un slice vacío
var s2 = []int{1,2,3} // Declara un slice con [1,2,3]
s3 := []int{1,2,3} // Declara un slice con [1,2,3]
```

Eso no significa que no puedas definir su longitud:

```go
s4 := make([]int, 10) // Slice con longitud 10 y valores inicializados en cero
s5 := make([]int, 10, 20) // Longitud 10 y capacidad 20
```

¿Cuál es la diferencia entre longitud y capacidad?

- La longitud es la cantidad de elementos del slice. `s4 := make([]int, 10)` crea uno con longitud 10.
- La capacidad es la longitud máxima que puede alcanzar usando su arreglo subyacente actual. En `s5 := make([]int, 10, 20)`, todavía hay espacio para agregar un elemento número 11. Cuando `append` supera la capacidad, Go asigna un arreglo nuevo y copia los elementos existentes. La nueva capacidad no necesariamente será el doble.

Para conocer más detalles sobre su funcionamiento interno, consulta el [artículo del blog de Go](https://blog.golang.org/go-slices-usage-and-internals). Ahora veamos algunas operaciones con slices.

Agregar un valor:

```go
s6 := []int{}

s6 = append(s6, 1) // s6 contendrá [1]
```

Agregar un slice a otro:

```go
s7 := []int{1,2}
s8 := []int{3,4}

s7 = append(s7, s8...)
```

Obtener slices de un arreglo:

```go
arr := [10]int{1,2,3,4,5,6,7,8,9,0}
s9 := arr[0:3] // s9 contendrá [1,2,3]
s10 := arr[:3] // Igual que el anterior
s11 := arr[7:] // s11 contendrá [8,9,0]
```

> [!NOTE] El arreglo subyacente
>
> Un slice hace referencia a elementos del arreglo subyacente: si modificas un elemento a través del slice, también modificas el arreglo. Si hay suficiente capacidad, `append` puede seguir usando ese arreglo; de lo contrario, asigna uno nuevo.

Puedes encontrar más operaciones útiles con slices [aquí](https://github.com/golang/go/wiki/SliceTricks).

## Diccionarios

### ¿Cómo funcionan en JS?

Puedes usar `Object`, `Map` o `WeakMap` para crear diccionarios. Veamos `Object`, que es común entre desarrolladores de JS:

```javascript
const x = {
  key1: 'value1',
  key2: 'value2',
};

// Consultar valores
x['key1'] // 'value1'
x.key2 // 'value2'

// Agregar elementos
x['newValue'] = 'value3';
x.newValue = 'value3'; // Equivalente; suele preferirse cuando ya conoces la clave
```

### ¿Cómo funcionan en Go?

Go usa el tipo `map`. Puedes inicializar un mapa con `make` o con un literal; puedes leer un mapa nil, pero no escribir en él. Asignar un mapa a otra variable no copia su contenido.

```go
// Crear mapas
// Con make
m1 := make(map[string]int)
// Con un literal de mapa
m2 := map[string]string {
  "key1": "value1",
  "key2": "value2",
}

// Consultar valores
value := m2["key1"] // "value1"
value, ok := m2["key2"] // "value2", true: se encontró la clave
value, ok = m2["nonValid"] // "", false: la clave no existe
```

## Conjuntos

### ¿Cómo funcionan en JS?

JS ofrece `Object`, `Set` y `WeakSet` para trabajar con conjuntos. Veamos `Set`:

```javascript
const set = new Set([1,1,2,2,3,3,4,4,5,5])
console.log(set) // 1,2,3,4,5: los valores de un Set son únicos

set.size // 5
set.add(9) // Agrega 9 y devuelve el conjunto
set.delete(9) // Elimina 9 y devuelve true
set.clear() // Elimina todos los valores y devuelve undefined
```

### ¿Cómo funcionan en Go?

Cuando escribí este artículo, Go no tenía soporte nativo para conjuntos. Aun así, puedes usar un mapa para representar uno. Encontrarás más detalles en [este artículo](https://blog.golang.org/go-maps-in-action).

## Funciones

### ¿Cómo funcionan en JS?

JS trata las funciones como valores de primera clase. Puedes asignarlas a variables, pasarlas como parámetros y devolverlas desde otras funciones, lo que permite crear *closures*. También puedes usar funciones lambda. Estas son formas alternativas de declarar una función:

```javascript
function x() {};
const x = function() {};
const x = () => {};
```

Ahora veamos un closure:

```javascript
function y() {
  let i = 0;
  return function() {
    return i++;
  }
}
```

Un closure es como una mochila: la función interna lleva consigo los valores de la función exterior, en este caso la variable `i`.

En JS, una función devuelve un solo valor. Para devolver varios, puedes ponerlos en un arreglo o un objeto; `return a, b` usa el operador coma y devuelve solo `b`.

### ¿Cómo funcionan en Go?

Go también trata las funciones como valores de primera clase. Además, permite devolver varios valores con `return`. Estas declaraciones son alternativas:

```go
func x() {}
x := func() {}
```

Veamos un closure:

```go
func y() func() int {
  i := 0
  return func() int {
    i += 1
    return i
  }
}
```

La lógica es la misma. Recuerda que una función que devuelve otra función debe declarar su tipo de retorno, incluidos los parámetros de la función interna:

```go
func y() func(int, string, rune) rune {
  return func(i int, b string, c rune) rune {
    return 'c'
  }
}
```

Hasta aquí aprendimos a declarar arreglos y slices, crear mapas, construir estructuras similares a conjuntos y usar funciones y closures en Go.

En el próximo artículo exploraremos el contexto de ejecución y el alcance en Go. ¡Sigamos con Go!
