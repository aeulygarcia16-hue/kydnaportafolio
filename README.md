## KYDNA! Portafolio

Sitio estático de una sola página. `index.html` contiene la experiencia completa y `gallery.json` organiza las obras que aparecen en el portafolio.

### Añadir una imagen

1. Coloca la imagen dentro de `gallery/`.
2. Abre `gallery.json` y añade un objeto dentro de la categoría correspondiente:

```json
{"image":"gallery/mi-obra.png","title":"Nombre de la obra","description":"Descripcion breve."}
```

Las categorías disponibles son `3d`, `dibujos` y `personajes`. No hace falta modificar el HTML ni el JavaScript.

Para probarlo localmente, ejecuta `python3 -m http.server` desde la raíz y abre `http://localhost:8000`.
