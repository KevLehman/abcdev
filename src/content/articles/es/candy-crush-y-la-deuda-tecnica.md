---
idx: 4
title: "Candy Crush y la deuda técnica"
date: "2020-03-30T03:50:17Z"
lang: es
translationOf: "a-tale-of-candy-crush-technical-debt-143h"
tags: ["programación", "deuda-técnica", "scrum", "ágil"]
excerpt: "El chocolate de Candy Crush se multiplica cuando lo ignoras. La deuda técnica también. Esto fue lo que el juego me enseñó sobre cómo enfrentarla."
draft: false
featured: false
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2Faaqq9bag9dkshcx7pq5b.jpeg"
---

Un día estaba jugando Candy Crush —Soda Saga, para ser más específico— y me encontré con un nivel interesante, pero difícil. Personalmente, odio todos los niveles con chocolate. Pero bueno, si uno quiere seguir jugando, toca pasarlos.

Si nunca has jugado Candy Crush, hablo de algo así:

![Un nivel de Candy Crush con bloques de chocolate](https://dev-to-uploads.s3.amazonaws.com/i/ax28z62367a253mn3tth.jpg)

El objetivo es destruir todo el chocolate de la pantalla con los movimientos disponibles. No parece tan difícil hasta que descubres que, si haces un movimiento sin destruir chocolate, este se multiplica y te deja menos espacio. Lo que parecía un nivel tranquilo se convierte en una carrera: sigues destruyendo chocolate o terminas enterrado en él.

Eso me hizo pensar en algo fuera del juego: los proyectos ágiles y la deuda técnica. ¿Qué tienen en común con esos niveles? Veamos.

## El chocolate se multiplica. La deuda técnica también.

Primero, algo que hay que aceptar: es casi imposible tener un proyecto ágil sin acumular deuda técnica en algún momento.

Ahora pensemos en el chocolate. Empiezas el nivel con una cantidad determinada. Si no haces nada para eliminarlo pronto, se multiplica hasta que toda la pantalla queda cubierta.

Con la deuda técnica pasa algo parecido. Si tu proyecto no tiene un plan para reducirla, puede crecer hasta ocuparlo todo. Y entonces puedes llegar a un punto en el que parezca más fácil reconstruir el proyecto desde cero que arreglar el código existente.

![Una pantalla casi llena de bloques de chocolate](https://dev-to-uploads.s3.amazonaws.com/i/9s3fbvh9881z9yga483s.png)

## Sin estrategia, pierdes

En estos niveles hay que pensar antes de mover. Con la deuda técnica pasa lo mismo: necesitas saber qué estás haciendo.

Por ejemplo, alguien podría decirte que refactorices todo el código para reducir la deuda. Y sí, eso podría ayudar. Pero también podrías reemplazar código probado en batalla por algo que no funcione en todos los casos que el anterior ya manejaba. Resultado: más deuda y nuevos bugs.

Por otro lado, si el problema no está en el código en sí, sino en la arquitectura del proyecto, cambiarla a ciegas puede traerte más problemas que soluciones. Necesitas un plan; si no, podrías terminar peor que cuando empezaste.

![Pantalla de fin del juego](https://dev-to-uploads.s3.amazonaws.com/i/xqpro3anpibs5a3ms1og.jpg)

En [este artículo de DZone](https://dzone.com/articles/how-to-reduce-tech-debt-a-practical-experience-gui-1) se describen algunas estrategias para reducir la deuda técnica de un proyecto.

## Hay chocolates más difíciles de quitar que otros

Como en la vida real, hay partes del código, decisiones de arquitectura y fechas de entrega que son muy difíciles —o casi imposibles— de cambiar. Veamos un ejemplo simplificado de deuda técnica. Supongamos que el usuario tiene una empresa con un nombre y que la función solo procesa a los usuarios que cumplen esta condición:

```javascript
async function evaluateUser(user) {
  if (user.act && user.company.name !== 'fancy company') {
    /* hacer algo realmente complicado aquí */
  }
}
```

Quizá el equipo tenía una fecha de entrega encima y decidió dejar el nombre de la empresa escrito directamente en el código. ¡Y funciona! Hasta que el cliente dice: “También quiero excluir a los usuarios de la empresa `"bla"`, pero solo a los nuevos”.

Por sencillo que parezca el cambio, el equipo debe cuidar que no afecte la forma en que se evalúa a los usuarios de `"fancy company"`. Y, si es posible, debería facilitar los próximos cambios en esa parte del código: pagar la deuda. De lo contrario, los cambios tardan más y es más fácil cometer errores.

## El chocolate no siempre es malo

Cuando se habla de deuda técnica, hay quienes la tratan como si fuera la peste: la miran de lejos y no quieren tocarla ni con un palo. Pero eso no es realista. Todos tenemos deuda técnica.

Sobre este tema, me gusta [este artículo del blog de Squarespace](https://engineering.squarespace.com/blog/2019/three-kinds-of-good-tech-debt) sobre los tipos de deuda técnica que pueden ser útiles. La deuda puede ser una decisión consciente. Y cuando sabes que existe, puedes planear cómo pagarla. ¡No puedes pagar lo que no sabes que debes!

{% embed https://engineering.squarespace.com/blog/2019/three-kinds-of-good-tech-debt %}

Por eso conviene documentar la deuda técnica, mantener esa información actualizada e involucrar al equipo de gestión.

Si yo pude pasar ese nivel, ustedes pueden pagar su deuda técnica.

![Pantalla de victoria](https://dev-to-uploads.s3.amazonaws.com/i/gqa0s5oaa2adfgjw90qu.png)
