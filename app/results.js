let tableandButtons = document.querySelector("div");
let checkboxLabel;
let PIBsection;
let IPCsection;
let PriceIndex;
let SellIndex;
let baseYear;
let baseSellRow;
let basePriceRow;
var nominalTctResult;

function calculateSumAndGrowth() {
  // Crear una variable para almacenar el resultado
  PriceIndex = initialData[0].categories.length - 1;
  SellIndex = PriceIndex - 1;
  baseYear = initialData[0];
  baseSellRow = baseYear.categories[SellIndex];
  basePriceRow = baseYear.categories[PriceIndex];
  if (!document.querySelector("body > div:nth-of-type(2)")) {
    divResult = document.createElement("div");
    tableandButtons.insertAdjacentElement("afterend", divResult);
  }
  // ---------------------------------------------------------------------------------------
  let resultPIB = () => {
    PIBsection = document.createElement("section");
    PIBsection.id = "production";
    divResult.appendChild(PIBsection);
    if (IPCsection) {
      divResult.insertBefore(PIBsection, IPCsection);
    }
    if (!document.querySelector("body > div:nth-of-type(3)")) {
        divResult.insertAdjacentHTML("afterend",'<div></div><div></div>');
      document
          .querySelector("body > div:nth-of-type(4)")
          .insertAdjacentHTML(
            "afterend",
            '<div class=checkbox-wrapper-49><div class=block><input data-index=0 id=cheap-49 type=checkbox class=sf-hidden><label for=cheap-49></label></div>'
          )
    };
    checkboxLabel = document.querySelector(".checkbox-wrapper-49"); 
    calculatePIB();
    console.log(document.getElementsByClassName('js-plotly-plot')[0])
  };

  if (proButton.innerHTML.includes("-")) {
    if (!document.getElementById("production")) {
      resultPIB();
    } else if (document.getElementById("production")) {
      divResult.removeChild(PIBsection);
      resultPIB();
    }
  } else if (
    proButton.innerHTML.includes("+") &&
    document.getElementById("production")
  ) {
    PIBsection.remove();
  for (i = 0; i < 2; i++) {
    document.querySelector("body > div:nth-of-type(3)").remove();
  };
    checkboxLabel.remove()
  }
  // ---------------------------------------------------------------------------------------
  let resultIPC = () => {
    IPCsection = document.createElement("section");
    IPCsection.id = "inflation";
    divResult.appendChild(IPCsection);
    calculateIPC();
  };

  if (sellButton.innerHTML.includes("-")) {
    if (!document.getElementById("inflation")) {
      resultIPC();
    }
    if (document.getElementById("inflation")) {
      divResult.removeChild(IPCsection);
      resultIPC();
    }
  } else if (
    sellButton.innerHTML.includes("+") &&
    document.getElementById("inflation")
  ) {
    IPCsection.remove();
    IPCsection = false;
  }
  // ---------------------------------------------------------------------------------------
}

const calculatePIB = () => {
  let items = [
    "PIB Nominal",
    "PIB Real",
    "PIB Inflación",
    "Deflactor",
    "Inflación (deflactor)",
    "Tasa de crecimiento tendencial",
  ];
  let titles = [
    "Producto Interno Bruto a precios corrientes",
    "Producto Interno Bruto a precios constantes",
    "ΔPIB(N) – ΔPIB(R)",
    "ΔPIB(N) / ΔPIB(R)",
    "Inflación mediante deflactor del PIB\nDEFn - DEFn - 1",
    "TCT = [(PIBt ÷ PIBₒ)^1/n] -1 \nPIBt = PIB del año final\nPIBₒ = PIB del año inicial\nn = cantidad de años",
  ];

  let yearArray = [];
  let nominalPIBArray = [];
  let realPIBArray = [];

  const sum = initialData.map((year) => {
    const productionRow = year.categories[0];
    const priceRow = year.categories[PriceIndex];
    const nominalYearSum =
      productionRow && priceRow && basePriceRow
        ? productionRow.valores.reduce(
            (acc, value, index) => acc + value * priceRow.valores[index],
            0
          )
        : 0;
    const realYearSum =
      productionRow && priceRow && basePriceRow
        ? productionRow.valores.reduce(
            (acc, value, index) => acc + value * basePriceRow.valores[index],
            0
          )
        : 0;
    yearArray.push(year.year);
    nominalPIBArray.push(parseFloat(nominalYearSum));
    realPIBArray.push(parseFloat(realYearSum));
    return { ...year, nominalSum: nominalYearSum, realSum: realYearSum };
  });

  const deflactors = [100];

  let nominalGrowthArray = [];
  let realGrowthArray = [];

  const growth = sum.map((yearSum, index) => {
    if (index === 0) {
      return {
        year: yearSum.year,
        nominalGrowth: null,
        realGrowth: null,
        inflation: null,
        deflactor: null,
        deflactorChange: null,
      };
    } else {
      const previousYearSum = sum[index - 1] || { deflactor: 100 };
      const nominalGrowth = (
        ((yearSum.nominalSum - previousYearSum.nominalSum) /
          previousYearSum.nominalSum) *
        100
      ).toFixed(4);
      const realGrowth = (
        ((yearSum.realSum - previousYearSum.realSum) /
          previousYearSum.realSum) *
        100
      ).toFixed(4);
      const inflation = (
        parseFloat(nominalGrowth) - parseFloat(realGrowth)
      ).toFixed(4);
      const deflactor = ((yearSum.nominalSum / yearSum.realSum) * 100).toFixed(
        2
      );
      deflactors.push(parseFloat(deflactor));
      const deflactorChange =
        index > 0
          ? (
              ((deflactor - deflactors[index - 1]) / deflactors[index - 1]) *
              100
            ).toFixed(4)
          : null;
      nominalGrowthArray.push(nominalGrowth);
      realGrowthArray.push(realGrowth);
      return {
        year: yearSum.year,
        nominalGrowth: parseFloat(nominalGrowth),
        realGrowth: parseFloat(realGrowth),
        inflation: inflation,
        deflactor: parseFloat(deflactor),
        deflactorChange: parseFloat(deflactorChange),
      };
    }
  });

  const nominalTct = `${(
    (Math.pow(
      nominalPIBArray[nominalPIBArray.length - 1] / nominalPIBArray[0],
      1 / yearArray.length
    ) -
      1) *
    100
  ).toFixed(4)} %`;
  const realTct = `${(
    (Math.pow(
      realPIBArray[realPIBArray.length - 1] / realPIBArray[0],
      1 / yearArray.length
    ) -
      1) *
    100
  ).toFixed(4)} %`;
  const tctArray = [
    { values: [nominalTct, realTct] },
    { namesValues: ["Nominal: ", "Real: "] },
    {
      titles: [
        "tasa de crecimiento medio para el PIB nominal",
        "tasa de crecimiento medio para el PIB real",
      ],
    },
  ];

  let checkbox = document.querySelector("input[type=checkbox]");

  plotlyPIB(yearArray, nominalPIBArray, realPIBArray);
  yearArray.shift();
  plotlyGrowth(yearArray, nominalGrowthArray, 0);

  let changeCategory = () => {
    if (checkbox.checked) {
      plotlyGrowth(yearArray, realGrowthArray, 1);
    } else {
      plotlyGrowth(yearArray, nominalGrowthArray, 0);
    }
  };
  changeCategory();
  checkbox.addEventListener("change", changeCategory);
  checkboxLabel.title = "Haga click para alternar entre nominal y real";

  items.forEach((item, index) => {
    let h3 = document.createElement("h3");
    h3.textContent = item;
    h3.setAttribute("title", titles[index]);
    h3.style.color = "lightseagreen";
    PIBsection.appendChild(h3);

    if (index < 2) {
      for (let i = 0; i < sum.length; i++) {
        let p = document.createElement("p");
        let sumItem = sum[i];
        switch (index) {
          case 0:
            p.textContent += `PIB ${sumItem.year}: ${sumItem.nominalSum}`;
            break;
          case 1:
            p.textContent += `PIB ${sumItem.year}: ${sumItem.realSum}`;
            break;
        }
        PIBsection.appendChild(p);
      }
    }
    if (index < 5) {
      for (let i = 1; i < growth.length; i++) {
        let p = document.createElement("p");
        let growthItem = growth[i];
        switch (index) {
          case 0:
            p.textContent += `Δ ${growthItem.year}: ${growthItem.nominalGrowth} %`;
            break;
          case 1:
            p.textContent += `Δ ${growthItem.year}: ${growthItem.realGrowth} %`;
            break;
          case 2:
            p.textContent = `Δ ${growthItem.year}: ${growthItem.inflation} %`;
            break;
          case 3:
            p.textContent = `Δ ${growthItem.year}: ${growthItem.deflactor} %`;
            break;
          case 4:
            p.textContent = `Δ ${growthItem.year}: ${growthItem.deflactorChange} %`;
            break;
        }
        PIBsection.appendChild(p);
      }
    }
    if (index > 4) {
      for (let i = 0; i < tctArray.length - 1; i++) {
        let p = document.createElement("p");
        let tctValues = tctArray[0].values[i];
        let tctNamesValues = tctArray[1].namesValues[i];
        p.setAttribute("title", tctArray[2].titles[i]);
        switch (index) {
          case 5:
            p.textContent = tctNamesValues + tctValues;
            break;
        }
        PIBsection.appendChild(p);
      }
    }
  });
};

const calculateIPC = () => {
  let items = [
    "Índice de precios al consumo",
    "Inflación",
    "Deflactor",
    "Inflación (deflactor)",
  ];
  let titles = [
    "(∑PtQ0 / ∑P0Q0) · 100",
    "(IPCt – IPC0) / IPC0",
    "(∑PtQt / ∑P0Qt) · 100",
    "(Deflactor - 100) / 100",
  ];

  const SumsIPC = initialData.map((year) => {
    const sellRow = year.categories[SellIndex];
    const priceRow = year.categories[PriceIndex];
    const VxP =
      priceRow && baseSellRow
        ? priceRow.valores.reduce(
            (acc, value, index) => acc + value * baseSellRow.valores[index],
            0
          )
        : 0;
    const VxPt =
      sellRow && priceRow
        ? sellRow.valores.reduce(
            (acc, value, index) => acc + value * priceRow.valores[index],
            0
          )
        : 0;
    const PxV =
      sellRow && basePriceRow
        ? sellRow.valores.reduce(
            (acc, value, index) => acc + value * basePriceRow.valores[index],
            0
          )
        : 0;
    return { ...year, SxP: VxP, PxS: PxV, VxPt: VxPt, PxV: PxV };
  });

  const GrowthIPC = SumsIPC.map((yearSum, index) => {
    if (index === 0) {
      return { IPC: null };
    } else {
      const baseYearSum = SumsIPC[0] || { deflactor: 100 };
      const IPC = ((yearSum.SxP / baseYearSum.SxP) * 100).toFixed(4);
      const IPCpc = ((yearSum.SxP / baseYearSum.SxP) * 100 - 100).toFixed(4);
      const ipcDef = ((yearSum.VxPt / yearSum.PxV) * 100).toFixed(4);
      const ipcDefpc = ((yearSum.VxPt / yearSum.PxV) * 100 - 100).toFixed(4);
      return { ipc: IPC, ipcpc: IPCpc, ipcDef: ipcDef, ipcDefpc: ipcDefpc };
    }
  });

  items.forEach((item, index) => {
    let h3 = document.createElement("h3");
    h3.textContent = item;
    h3.setAttribute("title", titles[index]);
    h3.style.color = "dodgerblue";
    IPCsection.appendChild(h3);

    for (let i = 1; i < GrowthIPC.length; i++) {
      let p = document.createElement("p");
      let IPCItem = GrowthIPC[i];
      switch (index) {
        case 0:
          p.textContent += `IPC ${SumsIPC[i].year}: ${IPCItem.ipc}`;
          break;
        case 1:
          p.textContent += `π ${SumsIPC[i].year}: ${IPCItem.ipcpc} %`;
          break;
        case 2:
          p.textContent = `DEF ${SumsIPC[i].year}: ${IPCItem.ipcDef}`;
          break;
        case 3:
          p.textContent = `π ${SumsIPC[i].year}: ${IPCItem.ipcDefpc} %`;
          break;
      }
      IPCsection.appendChild(p);
    }
  });
};
