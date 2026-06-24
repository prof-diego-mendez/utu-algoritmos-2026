# Exercise Management Guide

## Overview

Exercises are now stored in **JSON files** separate from the JavaScript code. This makes it easy to add, edit, or remove exercises without touching any code.

## File Structure

```
01 algoritmos/
├── exercises.json              # Exercises for index.html (Algoritmos)
├── algoritmos.js               # Logic (no exercise content)
├── tipos-de-datos/
│   ├── exercises-java.json     # Exercises for Java types page
│   └── tipos-de-datos.js       # Logic (no exercise content)
```

## Exercise JSON Format

Each exercise is an object with 5 required fields:

```json
{
  "titulo": "Title of the Exercise",
  "nivel": "Básico|Intermedio|Avanzado",
  "tema": "Topic name (e.g., Secuencia, Selección, String)",
  "enunciado": "Full exercise description. Use \\n for line breaks.",
  "hint": "Hint to help students (shown when they click to expand)"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `titulo` | String | ✅ | Short, descriptive title |
| `nivel` | String | ✅ | Difficulty: `"Básico"`, `"Intermedio"`, or `"Avanzado"` |
| `tema` | String | ✅ | Topic/category for the badge |
| `enunciado` | String | ✅ | Full exercise text. Use `\n` for newlines |
| `hint` | String | ✅ | Helpful hint (hidden by default) |

## How to Add a New Exercise

### Step 1: Open the JSON file
- For **index.html**: Edit `exercises.json`
- For **Java types**: Edit `tipos-de-datos/exercises-java.json`

### Step 2: Add the exercise object

Add a new object to the array (don't forget the comma after the previous exercise):

```json
{
  "titulo": "Mi nuevo ejercicio",
  "nivel": "Básico",
  "tema": "Secuencia",
  "enunciado": "Descripción del ejercicio. Podés usar múltiples líneas.\n\nUsá \\n para saltos de línea.",
  "hint": "Pista para ayudar al estudiante"
}
```

### Step 3: Save and test
Open the page in your browser and verify the exercise appears correctly.

## How to Edit an Exercise

1. Find the exercise in the JSON file by its `titulo`
2. Modify any field you need
3. Save the file
4. Refresh the page (no code changes needed!)

## How to Remove an Exercise

1. Find the exercise object in the JSON file
2. Delete the entire object (from `{` to `}`)
3. Make sure the previous exercise has a comma at the end
4. Save the file

## Tips

### Multi-line text
Use `\n` for line breaks in `enunciado` and `hint`:
```json
"enunciado": "Primera línea.\n\nSegunda línea (párrafo nuevo).\n· Item con viñeta"
```

### Special characters
JSON supports Unicode, so you can use Spanish characters directly:
- `ñ`, `á`, `é`, `í`, `ó`, `ú`
- `¿`, `¡`, `→`, `≥`, `≤`

### Escaping quotes
If you need quotes inside the text, escape them with `\"`:
```json
"enunciado": "Mostrá el mensaje \"Hola mundo\" en pantalla"
```

### Difficulty levels
- **Básico**: Fundamental concepts, straightforward tasks
- **Intermedio**: Requires combining multiple concepts
- **Avanzado**: Complex problems, error detection, real-world scenarios

## Validation

Make sure your JSON is valid:
1. Use a JSON validator like [jsonlint.com](https://jsonlint.com/)
2. Check that all strings have double quotes `"` (not single quotes `'`)
3. Ensure there's a comma between exercises, but NOT after the last one
4. All field names must be in double quotes

## Example: Complete Exercise

```json
{
  "titulo": "Suma de dos números",
  "nivel": "Básico",
  "tema": "Secuencia",
  "enunciado": "Escribí un algoritmo que:\n1. Pida dos números al usuario\n2. Calcule la suma\n3. Muestre el resultado con un mensaje descriptivo\n\nIdentificá las variables, entradas y salidas.",
  "hint": "Necesitás 3 variables: num1, num2 y suma. Usá LEER para entradas y ESCRIBIR para la salida."
}
```

## Troubleshooting

### Exercises don't load
- Check browser console for errors (F12 → Console)
- Verify the JSON file exists in the correct location
- Validate JSON syntax at jsonlint.com

### Only some exercises appear
- Check for missing commas between objects
- Look for unclosed quotes or brackets
- Verify all required fields are present

### Styling looks broken
- Check that `nivel` is exactly `"Básico"`, `"Intermedio"`, or `"Avanzado"` (case-sensitive)
