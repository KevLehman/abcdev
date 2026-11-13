---
idx: 27
title: "Publicar en DEV con una skill"
date: 2026-11-12
lang: es
translationOf: "cross-posting-to-dev-with-an-agent-skill"
tags: ["ia", "devto", "escritura", "automatización"]
excerpt: "Una pequeña skill para publicar un artículo en DEV y mantener el original en tu propio sitio."
draft: false
unlisted: true
featured: false
coverImage: "https://kevinaleman.com/images/dev-cross-posting-skill.webp"
coverDimensions: { width: 1672, height: 941 }
---

Publico artículos en mi blog, pero también quiero compartirlos en DEV. Eso significa copiar el texto, arreglar los enlaces que solo funcionan en mi sitio y acordarme de que DEV apunte al original. Nada de eso es difícil. Simplemente no quiero hacerlo a mano cada vez.

Por eso hice una [skill para publicar en DEV](https://github.com/KevLehman/agent-skills/tree/main/publish-devto). Es un conjunto de instrucciones para un agente: le das un artículo y le pides un borrador en DEV o una publicación. El agente usa la [API de Forem](https://developers.forem.com/api/v1) para hacer el trabajo.

## ¿Dónde está el original?

El original vive en mi blog. Antes de publicarlo en DEV, la skill comprueba que la URL original sea pública y la establece como URL canónica en DEV. Eso les indica a los buscadores qué versión prefiero que traten como original, aunque ellos siguen decidiendo cómo indexarla.

También revisa mis publicaciones y borradores en DEV. Si el artículo ya está ahí, el agente debería actualizarlo en vez de crear un duplicado. ¿Y esas rutas relativas de imágenes que funcionan en mi blog? En DEV necesitan URL públicas, así que la skill también se encarga de eso.

Lo mismo pasa con los enlaces relativos. Prefiero arreglarlos antes de que alguien haga clic en el artículo de DEV y termine en un lugar inesperado.

## Cómo usarla

Necesitas una [clave API de DEV](https://dev.to/settings/extensions), disponible para el agente como `DEVTO_API_KEY` en tu entorno o en un archivo `.env` excluido de Git. Mantén esa clave privada. La skill comprueba la cuenta antes de hacer cambios e informa la URL y el estado de publicación después.

Si quiero revisarlo primero, puedo pedir un borrador. El agente no debería publicarlo a menos que se lo pida. De cualquier forma, voy a revisar la versión de DEV antes de compartirla. Quiero saber qué van a ver los lectores.

Esta skill y las demás en las que he estado trabajando están en [mi colección de skills](/es/skills/).
