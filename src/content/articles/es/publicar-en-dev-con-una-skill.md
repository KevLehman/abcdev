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
---

Publicar un artículo en mi blog es solo una parte del trabajo. También quiero compartirlo en DEV, y eso significa copiar el artículo, revisar los enlaces y asegurarme de que DEV apunte al original. No es complicado, pero es el tipo de cosa en la que es fácil equivocarse cuando la repites para cada publicación.

Por eso hice [una skill para publicar en DEV](https://github.com/KevLehman/agent-skills/tree/main/publish-devto). Una skill es un conjunto de instrucciones que un agente puede seguir para realizar una tarea específica. En este caso, puedo pedirle al agente que prepare un borrador en DEV o publique un artículo, y la skill le da un flujo de trabajo para hacerlo a través de la [API de Forem](https://developers.forem.com/api/v1).

![Un artículo viaja del escritorio de su autora a un tablón comunitario, con un hilo que conecta ambas copias.](/images/dev-cross-posting-skill.webp)

## Un original, dos lugares para leerlo

Mi blog tiene el original y DEV es otro lugar donde se puede leer el artículo. Para una publicación cruzada, la skill comprueba que la URL original sea accesible públicamente y la establece como la URL canónica en DEV. Eso les indica a los buscadores cuál es la URL original preferida; no garantiza cómo van a indexar ninguna de las dos páginas.

La skill también revisa los borradores y artículos publicados de la cuenta antes de crear algo. Si el artículo ya está ahí, el agente debería actualizar la publicación correspondiente en vez de crear otra copia. También convierte los enlaces y las imágenes con rutas relativas en URL públicas, para que un enlace que funciona en mi blog no termine apuntando a otro lugar en DEV.

## Un borrador sigue siendo un borrador

La skill necesita una [clave API de DEV](https://dev.to/settings/extensions), proporcionada mediante `DEVTO_API_KEY` en el entorno o en un archivo `.env` excluido de Git. Mantén esa clave privada. El agente comprueba la cuenta e informa la URL y el estado de publicación después de crear o actualizar el artículo.

Puedes pedir primero un borrador. Pedir un borrador no autoriza su publicación; pedir que se publique, sí. Yo igual revisaría la versión de DEV antes de compartirla: la skill puede encargarse de los pasos repetitivos, pero quiero ver que el artículo y sus enlaces se vean bien donde los lectores los van a encontrar.
