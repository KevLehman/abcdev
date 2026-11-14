---
idx: 2
title: "De JavaScript a Go II"
date: 2019-11-02T17:12:33.962Z
lang: es
translationOf: "from-js-to-go-ii"
tags: ["golang", "javascript", "tutorial", "opinión"]
excerpt: "Seguimos explorando Go desde JavaScript: arreglos, slices, diccionarios, conjuntos y funciones."
draft: false
unlisted: true
featured: false
series:
  id: js-to-go
  title: "De JavaScript a Go"
  order: 2
featuredImage: "../../../assets/images/node-vs-go.png"
---

En el [artículo anterior](https://dev.to/kaleman15/from-javascript-to-go-50ef) vimos algunas diferencias entre JS y Go y empezamos a familiarizarnos con el código de Go.

Esta vez vamos a comparar cómo trabajan ambos lenguajes con:

- Arreglos y slices
- Diccionarios
- Conjuntos
- Funciones

## Arreglos y slices

### ¿Cómo funcionan en JavaScript?

En JS, los arreglos tienen tamaño dinámico. No necesitas definir su longitud al crearlos:

```javascript
const myArr = ['this', 'is', 'good'];

console.log(myArr); // ['this', 'is', 'good']
```

El prototipo de `Array` tiene varios métodos útiles:

```javascript
myArr.push('b'); // Agrega un valor al final
myArr.shift(); // Elimina el primer elemento
myArr.pop(); // Elimina el último elemento
const combined = myArr.concat(['c']); // Devuelve un arreglo nuevo; no modifica myArr
```

Y hay muchos más. Incluso puedes extender el prototipo con tus propios métodos:

```javascript
Array.prototype.sayHello = function() { return 'hello' }
myArr.sayHello(); // ¡Imprime 'hello'!
```

La API de arreglos de JS tiene mucho que ofrecer.

### ¿Cómo funcionan en Go?

En Go tenemos arreglos y slices. Los arreglos tienen un tamaño fijo: una vez definidos, no pueden crecer.

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

Los slices son distintos: pueden crecer. Un slice describe una parte de un arreglo donde se guardan los elementos. A ese arreglo lo llamamos **arreglo subyacente**. Por ejemplo:

```go
var s1 []int // Declara un slice vacío
var s2 = []int{1,2,3} // Declara un slice con [1,2,3]
s3 := []int{1,2,3} // Declara un slice con [1,2,3]
```

También puedes crear un slice con una longitud determinada:

```go
s4 := make([]int, 10) // Slice con longitud 10 y valores inicializados en cero
s5 := make([]int, 10, 20) // Longitud 10 y capacidad 20
```

¿Cuál es la diferencia entre longitud y capacidad?

- La longitud es la cantidad de elementos del slice. `s4 := make([]int, 10)` crea uno con longitud 10.
- La capacidad es la longitud máxima que puede alcanzar el slice sin cambiar de arreglo subyacente. En `s5 := make([]int, 10, 20)` hay espacio para agregar un elemento más. Cuando `append` supera la capacidad, Go asigna un arreglo nuevo y copia los elementos existentes. La nueva capacidad no necesariamente será el doble.

El [blog de Go](https://blog.golang.org/go-slices-usage-and-internals) explica con más detalle cómo funcionan por dentro. Por ahora, veamos algunas operaciones con slices.

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

Crear slices a partir de un arreglo:

```go
arr := [10]int{1,2,3,4,5,6,7,8,9,0}
s9 := arr[0:3] // s9 contendrá [1,2,3]
s10 := arr[:3] // Igual que el anterior
s11 := arr[7:] // s11 contendrá [8,9,0]
```

> [!NOTE] El arreglo subyacente
>
> Un slice comparte los elementos de su arreglo subyacente. Si cambias un elemento desde el slice, también cambia en el arreglo:
>
> ```go
> numeros := [3]int{10, 20, 30}
> primeros := numeros[:2] // Slice con [10, 20]; capacidad: 3
> primeros[0] = 99
> fmt.Println(numeros) // [99 20 30]
> ```
>
> Todavía queda espacio en el arreglo. Por eso, al agregar un tercer elemento, `append` usa ese mismo espacio:
>
> ```go
> primeros = append(primeros, 40)
> fmt.Println(numeros) // [99 20 40]
> ```
>
> Al agregar un cuarto elemento, ya no cabe en el arreglo original. Go crea otro arreglo y copia los valores. A partir de ahí, modificar el slice ya no cambia `numeros`:
>
> ```go
> primeros = append(primeros, 50)
> primeros[0] = 42
> fmt.Println(primeros) // [42 20 40 50]
> fmt.Println(numeros)  // [99 20 40]
> ```

Encontrarás más operaciones útiles en esta [guía de slices](https://github.com/golang/go/wiki/SliceTricks).

## Diccionarios

### ¿Cómo funcionan en JS?

En JS puedes usar `Object`, `Map` o `WeakMap` como diccionarios. Veamos `Object`, que se usa con frecuencia:

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

En Go usamos `map`. Puedes inicializar un mapa con `make` o con un literal. También puedes leer un mapa nil, pero no escribir en él. Si asignas un mapa a otra variable, su contenido no se copia.

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

Cuando escribí este artículo, Go no tenía conjuntos como tipo integrado. Aun así, puedes usar un mapa para representar uno. El [blog de Go](https://blog.golang.org/go-maps-in-action) explica cómo.

## Funciones

### ¿Cómo funcionan en JS?

En JS, las funciones son valores de primera clase: puedes asignarlas a variables, pasarlas como parámetros y devolverlas desde otras funciones. Esto también te permite crear *closures*.

Estas son algunas formas de definir una función, incluida una función flecha:

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

Un closure es como una mochila: la función interna puede llevarse variables de la función exterior. En este caso, se lleva `i`.

En JS, una función devuelve un solo valor. Para devolver varios, puedes ponerlos en un arreglo o un objeto; `return a, b` usa el operador coma y devuelve solo `b`.

### ¿Cómo funcionan en Go?

En Go, las funciones también son valores de primera clase. Además, una función puede devolver varios valores con `return`. Estas son dos formas de definir una función:

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

La idea es la misma. Recuerda que, si una función devuelve otra función, debes declarar el tipo de retorno, incluidos los parámetros de la función interna:

```go
func y() func(int, string, rune) rune {
  return func(i int, b string, c rune) rune {
    return 'c'
  }
}
```

Ya vimos cómo declarar arreglos y slices, crear mapas, representar conjuntos y usar funciones y closures en Go.

En el próximo artículo exploraremos el contexto de ejecución y el alcance en Go. ¡Seguimos!
