let buto = document.querySelector("div > div:nth-of-type(3)");
function handleAddColumn() {
  let butoPlus = Array.from(
    document.querySelectorAll("div > div:nth-child(4) > button")
  ).find((boton) => boton.innerHTML.includes("+"));
  if (buto.innerHTML.includes("+")) {
    butoPlus.click();
    again(butoPlus);
  }
  // Recorrer todos los años del arreglo initialData
  for (let i = 0; i < initialData.length; i++) {
    // Obtener el año actual
    const currentYear = initialData[i];
    // Recorrer todas las categorías del año actual
    for (let j = 0; j < currentYear.categories.length; j++) {
      // Obtener la categoría actual
      const currentCategory = currentYear.categories[j];
      currentCategory.valores.push("");
    }
  }
  // -------------------------------------------------------------------------------
  // Recorrer las filas restantes de la tabla
  for (let i = 1; i < table.rows.length; i++) {
    // Obtener la fila actual
    var currentRow = table.rows[i];
    // Crear un nuevo elemento td
    const newTd = document.createElement("td");
    // Crear un nuevo elemento input con el tipo y el valor del número
    const newInput = document.createElement("input");
    newInput.type = "number";
    newInput.value = "";
    // -------------------------------------------------------------------------------
    // Añadir el evento change al nuevo elemento input
    newInput.addEventListener("change", function () {
      // Obtener el índice de la categoría correspondiente a la fila actual
      let categoryIndex = (i - 1) % 3;
      // Obtener la categoría correspondiente a la fila actual
      let cat = initialData[Math.floor((i - 1) / 3)].categories[categoryIndex];
      // Actualizar solo el valor en el arreglo para la categoría correspondiente
      updateValueByYearAndCategory(
        initialData[Math.floor((i - 1) / 3)].year,
        cat.category,
        columnas - 1,
        this.value
      );
    });

    // Añadir el nuevo elemento input al nuevo elemento td
    newTd.appendChild(newInput);

    // Añadir el nuevo elemento td a la fila actual
    currentRow.appendChild(newTd);
  }
  function again(a) {
    a.click();
  }
  // -------------------------------------------------------------------------------
  columnas = table.rows[0].cells.length - 1;
  newArray();

  // Obtener el último elemento th de la primera fila
  let lastTh = firstRow.lastElementChild;

  // Obtener el valor del último elemento input de la primera fila
  let lastInputValue = lastTh.firstElementChild.value;
  // -------------------------------------------------------------------------------
  let newInput;
  // Extraer el número del último valor del input
  let match = lastInputValue.match(/(\d+)/);
  let newNumber;
  // Crear un nuevo elemento input con el tipo y el valor del texto
  newInput = document.createElement("input");
  newInput.type = "text";

  if (match) {
    newNumber = parseInt(match[0]) + 1;
    newInput.value = lastInputValue.replace(match[0], newNumber);
  } else {
    // Si no hay un número, buscamos una letra mayúscula al final de la cadena
    let letterMatch = lastInputValue.match(/(\s[A-Z])$/);
    if (letterMatch) {
      // Obtenemos la letra mayúscula, la convertimos a su código ASCII, le sumamos uno y la convertimos de nuevo a una letra
      let newLetter = String.fromCharCode(
        letterMatch[0].trim().charCodeAt(0) + 1
      );
      newInput.value = lastInputValue.replace(letterMatch[0], ` ${newLetter}`);
    }
  }
  // Crear un nuevo elemento th
  const newTh = document.createElement("th");
  // Añadir el nuevo elemento input al nuevo elemento th
  newTh.appendChild(newInput);
  // Añadir el nuevo elemento th a la primera fila
  firstRow.appendChild(newTh);
  // -------------------------------------------------------------------------------
  updateFormElementNames();
  inputsColor()
}

function handleRemoveColumn() {
  // Obtener la primera fila de la tabla
  const firstRow = table.rows[0];
  // Obtener el número de columnas de la tabla
  const columnCount = firstRow.cells.length;
  // Verificar si hay más de tres columnas en la tabla
  if (columnCount > 4) {
    // Recorrer todas las filas de la tabla
    for (let i = 0; i < table.rows.length; i++) {
      // Obtener la fila actual
      const currentRow = table.rows[i];
      // Eliminar la última celda de la fila
      currentRow.deleteCell(-1);
    }
    // Recorrer todos los años del arreglo initialData
    for (let i = 0; i < initialData.length; i++) {
      // Obtener el año actual
      const currentYear = initialData[i];
      // Recorrer todas las categorías del año actual
      for (let j = 0; j < currentYear.categories.length; j++) {
        // Obtener la categoría actual
        const currentCategory = currentYear.categories[j];
        // Eliminar el último valor de la categoría actual usando el método pop
        currentCategory.valores.pop();
      }
    }
  } else {
    // Mostrar un mensaje de alerta
    alert("No se puede eliminar más columnas");
  }
  columnas = table.rows[0].cells.length - 2;
  newArray();
}

function newArray() {
  arreglo = new Array(columnas);
  arreglo.fill("");
}

// Crear una función que adicione un nuevo año en la parte inferior de la tabla
// Crear una función que actualice el valor del año en el arreglo según el índice del año y el nuevo valor
function updateYear(yearCategoryIndex, newYear) {
  initialData[yearCategoryIndex].year = newYear;
}

function handleAddYear() {
  // Obtener el último año de la tabla
  const lastYear = Number(
    table.rows[table.rows.length - rs.getAttribute("rowspan")].cells[0]
      .firstChild.value
  );
  // Obtener las categorías del último año
  const categories = [];
  // Obtener el índice de la primera fila del último año
  let i = table.rows.length - 1;
  // Obtener la celda de la categoría de la fila actual
  let cell = table.rows[i].cells[0];
  // Mientras la celda tenga un elemento input de tipo text
  while (cell.firstChild && cell.firstChild.type === "text") {
    // Añadir el valor de la categoría al arreglo
    categories.push(cell.firstChild.value);
    // Decrementar el índice de la fila
    i--;
    // Obtener la celda de la categoría de la fila anterior
    cell = table.rows[i].cells[1];
  }
  if (rs.getAttribute("rowspan") == 3) {
    var sell = table.rows[i].cells[0].firstChild.value;
    var production = table.rows[i - 1].cells[1].firstChild.value;
    categories.push(sell, production);
  }
  categories.reverse();
  // Crear un nuevo año con las mismas categorías y valores en cero usando el método map
  const newYear = {
    year: lastYear + 1,
    categories: categories.map((cat) => {
      // Crear un nuevo arreglo valores copiando el del último año y rellenándolo con ceros
      const valores = arreglo.slice().fill("");
      return { category: cat, valores };
    }),
  };
  // Insertar el nuevo año en la tabla
  newYear.categories.forEach((cat, index) => {
    const row = table.insertRow();

    if (index === 0) {
      const cellYear = row.insertCell();
      // Crear un elemento input con el tipo y el valor del año
      const input = document.createElement("input");
      input.type = "number";
      input.value = newYear.year;
      // Añadir el evento change al elemento input del año
      input.addEventListener("change", function () {
        // Obtener el índice del nuevo año en el arreglo initialData usando el método length
        const yearCategoryIndex = initialData.at(-1);
        // Actualizar el valor del año en el arreglo usando la función updateYear y pasando el índice como parámetro
        updateYear(yearCategoryIndex, this.value);
      });
      // Añadir el elemento input a la celda del año
      cellYear.appendChild(input);
      cellYear.rowSpan = newYear.categories.length;
    }

    const cellCategory = row.insertCell();
    const input = document.createElement("input");
    input.type = "text";
    input.value = cat.category;
    // Añadir el evento change al elemento input de la categoría
    input.addEventListener("change", function () {
      // Actualizar el valor de la categoría en el arreglo usando la función updateValueByYearAndCategory
      updateValueByYearAndCategory(newYear.year, cat.category, 1, this.value);
    });
    cellCategory.appendChild(input);

    cat.valores.forEach((valor, valueIndex) => {
      const cellValue = row.insertCell();
      const input = document.createElement("input");
      input.type = "number";
      input.value = valor;
      // Añadir el evento change al elemento input del valor
      input.addEventListener("change", function () {
        // Actualizar el valor en el arreglo usando la función updateValueByYearAndCategory
        updateValueByYearAndCategory(
          newYear.year,
          cat.category,
          valueIndex,
          this.value
        );
      });
      cellValue.appendChild(input);
    });
  });
  // Actualizar el arreglo initialData con el nuevo año usando el método push
  initialData.push(newYear);
  updateFormElementNames();
  if (!buto.innerHTML.includes("+")) {
    trRowsUpdate();
  }
  rowsUpdate();
  rowSpan();
  borderBottom();
  inputsColor()
}

function handleRemoveYear() {
  // Obtener el número de filas a eliminar
  var rowsToDelete = rs.getAttribute("rowspan");
  // Recorrer el número de filas a eliminar
  initialData.pop();
  rowSpan();
  if (tdRowspan > 2) {
    for (let i = 0; i < rowsToDelete; i++) {
      // Eliminar la última fila
      table.deleteRow(-1);
    }
  }
  if (!buto.innerHTML.includes("+")) {
    trRowsUpdate();
  }
  rowsUpdate();
}

function rowSpan() {
  tdRowspan = document.querySelectorAll("td[rowspan]").length;
}

let proButton = document.querySelector(
  "div > div:nth-child(4) > button:nth-child(1)"
);
let sellButton = document.querySelector(
  "div > div:nth-child(4) > button:nth-child(2)"
);
proButton.addEventListener("click", eliminarFilasProduccion);
sellButton.addEventListener("click", eliminarFilasVentas);
proButton.title = "Eliminar filas de Producción";
sellButton.title = "Eliminar filas de Ventas";

function ordo() {
  return (filas = document.querySelectorAll("#data-table tr"));
}
let priceLength;

let rows = document.querySelectorAll("#data-table tr");
function rowsUpdate() {
  rows = document.querySelectorAll("#data-table tr");
}

function eliminarFilasProduccion() {
  if (rs.getAttribute("rowspan") == 3) {
    ordo();
    for (let k = 1; k < table.rows.length; k += 3) {
      let newChild = table.rows[k].cells[0].cloneNode(true);
      table.rows[k + 1].insertBefore(newChild, table.rows[k + 1].firstChild);
    }
    for (let i = 1; i < filas.length - 1; i += 3) {
      filaremovida = filas[i];
      filas[i].remove();
    }
    rowSpanUpdate();
    rowSpaNumber();
    sellButton.disabled = true;
    sellButton.style.cursor = "not-allowed";
    proButton.innerHTML = proButton.innerHTML.replace("-", "+");
    proButton.title = proButton.title.replace("Eliminar", "Agregar");
    borderBottom();
  } else {
    retornarFila("Producción");
    let produccion;
    for (let k = 1; k < filas.length; k += 2) {
      produccion = nuevaFila.cloneNode(true);
      /* console.log(produccion) */
      filas[k].insertAdjacentElement("beforebegin", produccion);
      let newChild = filas[k].cells[0].cloneNode(true);
      newChild.rowSpan = 3;
      produccion.insertBefore(newChild, produccion.firstChild);
      filas[k].removeChild(filas[k].cells[0]);
      addChangeEventToRow(produccion);
    }
    copyrow(0, 1, 2);
    for (let i = 1; i < trRows.length; i += 3) {
      if (priceLength > trRows[i].childNodes.length - 1) {
        let newTd = document.createElement("td");
        const newInput = document.createElement("input");
        newInput.type = "number";
        newInput.value = "";
        newTd.appendChild(newInput);
        trRows[i].appendChild(newTd);
      }
    }
    updateFormElementNames();
    rowSpanUpdate();
    sellButton.disabled = false;
    sellButton.style.cursor = "pointer";
    proButton.innerHTML = proButton.innerHTML.replace("+", "-");
    proButton.title = proButton.title.replace("Agregar", "Eliminar");
    borderBottom();
    inputsColor()
  }
};

function eliminarFilasVentas() {
  if (rs.getAttribute("rowspan") == 3) {
    ordo();
    for (let i = 2; i < filas.length; i += 3) {
      filas[i].remove();
    }
    rowSpaNumber();
    proButton.disabled = true;
    proButton.style.cursor = "not-allowed";
    sellButton.innerHTML = sellButton.innerHTML.replace("-", "+");
    sellButton.title = sellButton.title.replace("Eliminar", "Agregar");
    borderBottom();
  } else {
    retornarFila("Ventas");
    for (let k = 2; k < filas.length; k += 2) {
      let ventas = nuevaFila.cloneNode(true);
      filas[k].insertAdjacentElement("beforebegin", ventas);
      addChangeEventToRow(ventas);
    }
    for (let i = 2; i < trRows.length; i += 3) {
      if (priceLength > trRows[i].childNodes.length) {
        let newTd = document.createElement("td");
        const newInput = document.createElement("input");
        newInput.type = "number";
        newInput.value = "";
        newTd.appendChild(newInput);
        trRows[i].appendChild(newTd);
        updateFormElementNames();
      }
    }
    copyrow(1, 2, 1);
    updateFormElementNames();
    rowSpaNumber(3);
    proButton.disabled = false;
    proButton.style.cursor = "pointer";
    sellButton.innerHTML = sellButton.innerHTML.replace("+", "-");
    sellButton.title = sellButton.title.replace("Agregar", "Eliminar");
    borderBottom();
    inputsColor()
  }
};

function rowSpaNumber(n = 2) {
  for (let i = 1; i < table.rows.length; i += n) {
    table.rows[i].cells[0].rowSpan = n;
  }
}

const inputsColor = () => {
  let proInputsColor = document.querySelectorAll("tr:nth-of-type(3n-2) > td:nth-of-type(n+2) > input")
  let sellInputsColor = document.querySelectorAll("tr:nth-of-type(3n-1) > td > input");
if (buto.innerHTML.includes("+") == false) {
for (let i = 0 ; i < sellInputsColor.length; i ++) {
proInputsColor[i].style.color = "lightseagreen";
sellInputsColor[i].style.color = "dodgerblue"
   }
  };
  let firstRowInputsColor;
  let priceRowInputColor;
  if (buto.innerHTML.includes("+")) {
    firstRowInputsColor = document.querySelectorAll("tr:nth-of-type(2n-1) > td > input")
    priceRowInputColor = document.querySelectorAll("tr:nth-of-type(2n-2) > td > input")
    for (let i = 0 ; i < priceRowInputColor.length; i ++) {
      priceRowInputColor[i].style.color = 'black';
      priceRowInputColor[i].style.textDecoration = 'none'
  }
}
if (buto.firstElementChild.innerHTML.includes('+')) {
  for (let i = 0 ; i < firstRowInputsColor.length; i ++) {
    firstRowInputsColor[i].style.color = 'dodgerblue';
    firstRowInputsColor[i].style.textDecoration = 'none'
 }
}
if (buto.lastElementChild.innerHTML.includes('+')) {
  for (let i = 0 ; i < firstRowInputsColor.length; i ++) {
    firstRowInputsColor[i].style.color = 'lightseagreen'
 }
}
};
window.onload = inputsColor()

function proHighlight(typeLine = "none") {
  if (buto.innerHTML.includes("+") == false) {
    let produccion = document.querySelectorAll(
      "#data-table tr:nth-of-type(3n-2) > td:nth-of-type(n+2) > input"
    );
    for (let i = 0; i < produccion.length; i++) {
      produccion[i].style.textDecoration = typeLine;
    }
  }
}

function sellHighlight(typeLine = "none") {
  if (buto.innerHTML.includes("+") == false) {
    let ventas = document.querySelectorAll(
      "#data-table tr:nth-of-type(3n-1) > td > input"
    );
    for (let i = 0; i < ventas.length; i++) {
      ventas[i].style.textDecoration = typeLine;
    }
  }
}
