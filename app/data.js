let initialData = [
  { year: 2022, categories: [
    { category: 'Producción', valores: [10,15,20] },
    { category: 'Ventas', valores: [8,14,20] },
    { category: 'Precio', valores: [1,2,4] },
  ]},
  { year: 2023, categories: [
    { category: 'Producción', valores: [12,15,22] },
    { category: 'Ventas', valores: [10,14,21] },
    { category: 'Precio', valores: [2,3,5] },
  ]},
  { year: 2024, categories: [
    { category: 'Producción', valores: [14,16,23] },
    { category: 'Ventas', valores: [13,14,20] },
    { category: 'Precio', valores: [4,4,7] },
  ]},
  { year: 2025, categories: [
    { category: 'Producción', valores: [15,17,23] },
    { category: 'Ventas', valores: [12,14,21] },
    { category: 'Precio', valores: [6,5,8] },
  ]},
  { year: 2026, categories: [
    { category: 'Producción', valores: [18,17,22] },
    { category: 'Ventas', valores: [14,13,21] },
    { category: 'Precio', valores: [7,6,7] },
  ]},
];

let table = document.getElementById('data-table');
let conteo;
let tdRowspan;
let arreglo = ['', '', ''];

// Crear una función que actualice el valor en el arreglo según el índice del año, la categoría y el valor
function updateYear(yearCategoryIndex, newYear) {
  initialData[yearCategoryIndex].year = newYear;
}
// Crear una función que actualice el valor en el arreglo según el valor del año, el valor de la categoría y el índice del valor

function updateValueByYearAndCategory(year, category, valueIndex, newValue) {
  // Buscar el año que coincida con el valor del año
  const yearData = initialData.find(data => data.year == year);
  // Buscar la categoría que coincida con el valor de la categoría
  const categoryData = yearData.categories.find(cat => cat.category == category);
  // Actualizar el valor en el índice correspondiente
  categoryData.valores[valueIndex] = newValue;
}

// Modificar el código que crea los elementos input para añadir el evento change
initialData.forEach((data, yearCategoryIndex) => {
  data.categories.forEach((cat, categoryIndex) => {
    const row = table.insertRow();
    if (categoryIndex === 0) {
      const cellYear = row.insertCell();
      // Crear un elemento input con el tipo y el valor del año
      const input = document.createElement("input");
      input.type = "number";
      input.value = data.year;
      input.name = data.year;
      // Añadir el evento change al elemento input del año
      input.addEventListener("change", function () {
        // Actualizar el valor del año en el arreglo usando la función updateYear
        updateYear(yearCategoryIndex, this.value);
      });
      // Añadir el elemento input a la celda del año
      cellYear.appendChild(input);
      cellYear.rowSpan = data.categories.length;
    }

    const cellCategory = row.insertCell();
    const input = document.createElement("input");
    input.type = "text"; // Aquí creamos un campo de texto
    input.value = cat.category; // Aquí asignamos el valor inicial del campo
    cellCategory.appendChild(input); // Aquí añadimos el campo a la celda

    cat.valores.forEach((valor, valueIndex) => {
      const cellValue = row.insertCell();
      const input = document.createElement("input");
      input.type = "number";
      input.value = valor;
      // Añadir el evento change al elemento input del valor
      input.addEventListener("change", function () {
        // Actualizar el valor en el arreglo usando la función updateValueByYearAndCategory
        updateValueByYearAndCategory(data.year, cat.category, valueIndex, this.value);
      });
      cellValue.appendChild(input);
    });
  });
});

// Obtener la primera fila de la tabla
const firstRow = table.rows[0];

// Obtener la longitud del arreglo valores
const valoresLength = initialData[0].categories[0].valores.length;

//Crear e insertar thead como primer elemento de table
const thead = document.createElement("thead");
table.insertBefore(thead, table.children[0])

// Recorrer el arreglo valores
for (let i = 0; i < valoresLength; i++) {
  // Crear un elemento th
  const th = document.createElement("th");

  // Crear un elemento input con el tipo y el valor del texto
  const input = document.createElement("input");
  input.type = "text";
  input.value = 'Bien' + " " + Number(i+1);

  // Añadir el elemento input al elemento th
  th.appendChild(input);

  // Añadir el elemento th a la primera fila
  firstRow.appendChild(th);
}

thead.appendChild(table.children[1].children[0])

// Obtener el número de columnas de la tabla
var columnCount = firstRow.cells.length;
var columnas;

window.onload = updateFormElementNames()
function updateFormElementNames() {
const formElements = Array.from(document.querySelectorAll('input'));
  formElements.forEach((element, index) => {
    const uniqueName = `name_${index}_${Math.random().toString(36).substr(2, 9)}`;
    if(!element.getAttribute('name')) {element.setAttribute('name', uniqueName)};
  })
}

let nuevaFila
function retornarFila(category) {
  filas = document.querySelectorAll("#data-table tr");
  // Crear una nueva fila
  nuevaFila = document.createElement("tr");
  // Crear una celda para la categoría
  let nuevaCeldaCategoria = document.createElement("td");
  // Crear un elemento input con el tipo y el valor de la categoría
  let nuevoInputCategoria = document.createElement("input");
  nuevoInputCategoria.type = "text";
  nuevoInputCategoria.value = category;
  // Añadir el elemento input a la celda de la categoría
  nuevaCeldaCategoria.appendChild(nuevoInputCategoria);
  // Añadir la celda de la categoría a la nueva fila
  nuevaFila.appendChild(nuevaCeldaCategoria);

  // Crear tres celdas para los valores
  for (let g = 0; g < arreglo.length; g++) {
    let nuevaCeldaValor = document.createElement("td");
    // Crear un elemento input con el tipo y el valor de cero
    let nuevoInputValor = document.createElement("input");
    nuevoInputValor.type = "number";
    // Asignar el valor del arreglo valores de la categoría Producción según el índice del año y el índice del valor '';
    nuevoInputValor.value = '';
    // Añadir el elemento input a la celda del valor
    nuevaCeldaValor.appendChild(nuevoInputValor);
    // Añadir la celda del valor a la nueva fila
    nuevaFila.appendChild(nuevaCeldaValor);
  }
  // Retornar la nueva fila
  return nuevaFila;
}


function addChangeEventToRow(row) {
  let hayArregloIgual2 = initialData.some(data => data.categories.length == 2);
  if (hayArregloIgual2) {modificarArreglo (initialData);};
  // Obtener los elementos input de la fila
  let inputs = row.getElementsByTagName("input");
  // Recorrer los elementos input
  for (let i = 0; i < inputs.length; i++) {
    // Si el elemento input es de tipo number, añadir el evento change
      inputs[i].addEventListener("change", function () {
        // Obtener el valor del año y de la categoría de los elementos input anteriores
        let n;
        let year;
        let category;
        if (row.childNodes[0].firstChild.type == 'number') {year = row.firstChild.firstChild.value; category = row.firstChild.nextSibling.firstChild.value; n = 2}
        else {year = row.previousSibling.childNodes[0].firstChild.value; category = row.childNodes[0].firstChild.value; n = 1}
        // Obtener el índice del valor dentro de la celda
        let valueIndex = this.parentNode.cellIndex - n;
        // Actualizar el valor en el arreglo usando la función updateValueByYearAndCategory
        updateValueByYearAndCategory(year, category, valueIndex, this.value);
      });
  }
}

// Crear una función que modifique el arreglo initialData
function modificarArreglo (arr) {
  // Buscar el índice del objeto que tenga un arreglo categories con longitud igual a 2
  let indice = arr.findIndex(data => data.categories.length == 2);
  // Si se encuentra el índice
  if (indice != -1) {
    // Obtener el año y el arreglo categories del objeto encontrado
    let categories = arr [indice].categories;
    // Crear un arreglo con las posibles categorías
    let posiblesCategorias = ['Producción', 'Ventas', 'Precio'];
    // Recorrer el arreglo de posibles categorías
    for (let i = 0; i < posiblesCategorias.length; i++) {
      // Obtener la categoría actual
      let categoria = posiblesCategorias [i];
      // Buscar si la categoría actual existe en el arreglo categories
      let existe = categories.some(cat => cat.category == categoria);
      // Si no existe la categoría
      if (!existe) {
        // Crear un nuevo objeto con la categoría y los valores en cero
        let nuevoObjeto = {category: categoria, valores: arreglo};
        // Agregar el nuevo objeto al arreglo categories
        if (nuevoObjeto.category == 'Producción') {categories.splice(0,0, nuevoObjeto)};
        if (nuevoObjeto.category == 'Ventas') {categories.splice(1,0, nuevoObjeto)};
      }
    }
  } 
}

let production = [];
function copyrow(caN,rn,coN) {
  for (let i = 0; i < initialData.length; i++) {
  for (let m = 0; m < initialData[i].categories[caN].valores.length; m++)  {
    production.push(initialData[i].categories[caN].valores[m]);
  }
}

let index = 0;
for (let k = rn; k < table.rows.length && index < production.length; k+=3) {
  for (let j = coN; j < table.rows[k].childNodes.length && index < production.length; j++) {
    table.rows[k].childNodes[j].firstChild.value = production[index];
    index++;
  }
}
production = []; 
}

var rs = document.querySelector("td[rowspan]");
let trRows = document.querySelectorAll("#data-table tr")
function trRowsUpdate(){trRows = document.querySelectorAll("#data-table tr")};
function rowSpanUpdate() {rs = document.querySelector("td[rowspan]")};

window.onload = borderBottom()
function borderBottom() {
  rowSpanUpdate();
  trRowsUpdate();
  if(rs.getAttribute("rowspan") == 3) {
  for (let i = 3; i < trRows.length; i+=3) {
    trRows[i].style.borderBottom = '1px solid black'; 
  }
} else {for (let k = 2; k < trRows.length; k+=2) {
  trRows[k].style.borderBottom = '1px solid black';
}}
}

/* function updateLastColumn(){
for (let i = 1; i < table.rows.length; i++) {
  table.rows[i].lastChild.firstChild.addEventListener("change", function () {
    let categoryIndex = (i-1) % 3;
    let cat = initialData[Math.floor((i-1)/3)].categories[categoryIndex];
    updateValueByYearAndCategory(initialData[Math.floor((i-1)/3)].year, cat.category, columnas-1, this.value);
  })
}} */


/* newInput.addEventListener("change", function () {
  // Obtener el índice de la categoría correspondiente a la fila actual
  let n;
  let m;
  if (buto.innerHTML.includes('+')) {n = 2} else {n = 3}
  if (proButton.innerHTML.includes('+')) {m = 1} else {m = 0}
  let categoryIndex = (i-1) % n;
  if (sellButton.innerHTML.includes('+')) {if (categoryIndex == 1) categoryIndex = 2} else {if (categoryIndex == 1) categoryIndex = 1}
  // Obtener la categoría correspondiente a la fila actual
  let cat = initialData[Math.floor((i-1)/n)].categories[categoryIndex + m];
  // Actualizar solo el valor en el arreglo para la categoría correspondiente
  updateValueByYearAndCategory(initialData[Math.floor((i-1)/n)].year, cat.category, columnas-1, this.value);
}); */