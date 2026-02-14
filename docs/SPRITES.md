# Guía de sprites para el player (Kaboom)

## Cómo recorta Kaboom

Kaboom divide la imagen en una **cuadrícula de celdas iguales**:

- `sliceX`: número de columnas
- `sliceY`: número de filas (por defecto 1 si no lo pones)

Cada celda debe tener **exactamente el mismo ancho y alto**. Los frames se numeran así:

- **Una fila:** `0, 1, 2, ...` de izquierda a derecha.
- **Varias filas:** primero la fila 0 (0, 1, 2...), luego la fila 1, etc.

---

## Tamaños recomendados para `player.png`

### Regla

- **Ancho total** = `sliceX × anchoDeUnFrame`
- **Alto total** = `sliceY × altoDeUnFrame`

Para tu player actual: **3 frames en una fila** → `sliceX: 3`, `sliceY: 1`.

### Por resolución (por frame)

| Estilo   | Tamaño por frame | Tu imagen (3 frames en 1 fila) |
|----------|-------------------|----------------------------------|
| Pixel art bajo | 16×16 o 32×32 | **48×16** o **96×32** |
| Pixel art alto | 48×48           | **144×48**                      |
| HD / suave     | 64×64 o 96×96   | **192×64** o **288×96**         |

### Recomendación práctica

- **32×32 px por frame** → imagen **96×32 px** (3 frames seguidos, 1 fila).
- **64×64 px por frame** → imagen **192×64 px**.

Usar **potencias de 2** (16, 32, 64, 128) suele dar mejor resultado al escalar.

---

## Consejos

1. **Sin espacio entre frames**  
   Si pones márgenes o huecos entre dibujos, el recorte automático (`sliceX`/`sliceY`) ya no coincide. En ese caso hay que definir los frames a mano con la opción `frames` (coordenadas exactas).

2. **Mismo tamaño en todos los frames**  
   Aunque un frame (ej. salto) sea más alto, en la imagen debe ocupar la misma celda; puedes dejar padding transparente alrededor para centrar el dibujo.

3. **Orden de frames**  
   En el código los frames son: `0` = primer recorte, `1` = segundo, `2` = tercero. Ajusta `anims` en `loadAssets.js` al orden que uses en la imagen (idle, jump, run, etc.).

4. **Varias filas**  
   Si un día usas varias filas (ej. 3×2 = 6 frames), pon `sliceY: 2`. La numeración sería: fila 0: 0,1,2; fila 1: 3,4,5.
