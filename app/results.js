let result = document.getElementsByTagName('span');
let divResult = document.getElementsByTagName('div')[4];
let PIBspan;
let IPCspan;

let PriceIndex;
let SellIndex;
let baseYear;
let baseSellRow;
let basePriceRow;

function calculateSumAndGrowth() {
// Crear una variable para almacenar el resultado
  PriceIndex = initialData[0].categories.length-1;
  SellIndex = PriceIndex-1
  baseYear = initialData[0];
  baseSellRow = baseYear.categories[SellIndex];
  basePriceRow = baseYear.categories[PriceIndex];
// ---------------------------------------------------------------------------------------
  let resultPIB = () => {
    PIBspan = document.createElement('span');
    PIBspan.id = 'production';
    divResult.appendChild(PIBspan)
    if (IPCspan) {divResult.insertBefore(PIBspan, IPCspan)}
    calculatePIB();
  };

  if (proButton.innerHTML.includes('-')) {
    if (!document.getElementById('production')) {
      resultPIB()
  } else if (document.getElementById('production')){
    divResult.removeChild(PIBspan);
      resultPIB()
  }
  } else if (proButton.innerHTML.includes('+') && document.getElementById('production')){
    divResult.removeChild(PIBspan)
  };
// ---------------------------------------------------------------------------------------
let resultIPC = () => {
  IPCspan = document.createElement('span');
  IPCspan.id = 'inflation';
  divResult.appendChild(IPCspan)
  calculateIPC();
};

  if (sellButton.innerHTML.includes('-')) {
    if (!document.getElementById('inflation')) {
      resultIPC()
    }
    if (document.getElementById('inflation')) {
      divResult.removeChild(IPCspan);
      resultIPC()
    }
  } else if (sellButton.innerHTML.includes('+') && document.getElementById('inflation')){
    IPCspan.remove()
    IPCspan = false
  }
// ---------------------------------------------------------------------------------------
  if (result.length == 1) {
    divResult.style.justifyContent = 'center';
  } else if (result.length == 2) {
    divResult.style.justifyContent = 'space-evenly';
  }
};

const calculatePIB = () => {
  let items = ['PIB Nominal', 'PIB Real', 'PIB Inflación', 'Deflactor', 'Inflación (deflactor)'];
  let titles = ['Producto Interno Bruto a precios corrientes','Producto Interno Bruto a precios constantes','ΔPIB(N) – ΔPIB(R)', 'ΔPIB(N) / ΔPIB(R)', 'DEFn - DEFn - 1'];

  const sum = initialData.map(year => {
      const productionRow = year.categories[0];
      const priceRow = year.categories[PriceIndex];
      const nominalYearSum = productionRow && priceRow && basePriceRow ? productionRow.valores.reduce((acc, value, index) => acc + value * priceRow.valores[index], 0) : 0;
      const realYearSum = productionRow && priceRow && basePriceRow ? productionRow.valores.reduce((acc, value, index) => acc + value * basePriceRow.valores[index], 0) : 0;
      return { ...year, nominalSum: nominalYearSum, realSum: realYearSum };
    });
    
      const deflactors = [100];
  const growth = sum.map((yearSum, index) => {
          if (index === 0) {
            return { year: yearSum.year, nominalGrowth: null, realGrowth: null, inflation: null, deflactor: null, deflactorChange: null};
          } else {
            const previousYearSum = sum[index - 1] || { deflactor: 100 };
            const nominalGrowth = ((yearSum.nominalSum - previousYearSum.nominalSum) / previousYearSum.nominalSum).toFixed(4)*100;
            const realGrowth = ((yearSum.realSum - previousYearSum.realSum) / previousYearSum.realSum).toFixed(4)*100;
            const inflation = nominalGrowth - realGrowth;
            const deflactor = ((yearSum.nominalSum / yearSum.realSum)*100).toFixed(2);
            deflactors.push(deflactor);
            const deflactorChange = index > 0 ? ((deflactor - deflactors[index - 1]) / deflactors[index - 1]).toFixed(4)*100 : null;
            return { year: yearSum.year, nominalGrowth: nominalGrowth, realGrowth: realGrowth, inflation: inflation, deflactor: deflactor, deflactorChange: deflactorChange };
          }
        });

        items.forEach((item, index) => {
          let h3 = document.createElement('h3');
          h3.textContent = item;
          h3.setAttribute('title', titles[index])
          h3.style.color = 'lightseagreen';
          PIBspan.appendChild(h3);

          if(index < 2) {
          for (let i = 0; i < sum.length; i++) {
            let p = document.createElement('p');
            let sumItem = sum[i];
            switch(index) {
              case 0:
                p.textContent += `PIB ${sumItem.year}: ${sumItem.nominalSum}`;
                break;
              case 1:
                p.textContent += `PIB ${sumItem.year}: ${sumItem.realSum}`;
                break;
            }
            PIBspan.appendChild(p);
          }}
          
          for (let i = 1; i < growth.length; i++) {
            let p = document.createElement('p');
            let growthItem = growth[i];
            switch(index) {
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
            PIBspan.appendChild(p);
          }
        });
}

const calculateIPC = () => {
  let items = ['Índice de precios al consumidor', 'Inflación', 'Deflactor', 'Inflación (deflactor)'];
  let titles = ["(∑PtQ0 / ∑P0Q0) · 100", "(IPCt – IPC0) / IPC0", "(∑PtQt / ∑P0Qt) · 100", "(Deflactor - 100) / 100"];
  
  const SumsIPC = initialData.map(year => {
    const sellRow = year.categories[SellIndex];
    const priceRow = year.categories[PriceIndex];
    const VxP = priceRow && baseSellRow ? priceRow.valores.reduce((acc, value, index) => acc + value * baseSellRow.valores[index], 0) : 0;
    const VxPt = sellRow && priceRow ? sellRow.valores.reduce((acc, value, index) => acc + value * priceRow.valores[index], 0) : 0;
    const PxV = sellRow && basePriceRow ? sellRow.valores.reduce((acc, value, index) => acc + value * basePriceRow.valores[index], 0) : 0;
    return { ...year, SxP: VxP, PxS: PxV, VxPt: VxPt, PxV: PxV};
  });
  
      const GrowthIPC = SumsIPC.map((yearSum, index) => {
        if (index === 0) {
          return { IPC: null};
        } else {
          const baseYearSum = SumsIPC[0] || { deflactor: 100 };
          const IPC = (yearSum.SxP / baseYearSum.SxP*100).toFixed(4);
          const IPCpc = (yearSum.SxP / baseYearSum.SxP*100-100).toFixed(4);
          const ipcDef = (yearSum.VxPt / yearSum.PxV*100).toFixed(4);
          const ipcDefpc = (yearSum.VxPt / yearSum.PxV*100-100).toFixed(4);
          return { ipc: IPC, ipcpc: IPCpc, ipcDef: ipcDef, ipcDefpc: ipcDefpc };
        }
      });

      items.forEach((item, index) => {
        let h3 = document.createElement('h3');
        h3.textContent = item;
        h3.setAttribute('title', titles[index]);
        h3.style.color = 'dodgerblue';
        IPCspan.appendChild(h3);

        for (let i = 1; i < GrowthIPC.length; i++) {
          let p = document.createElement('p');
          let IPCItem = GrowthIPC[i];
          switch(index) {
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
          IPCspan.appendChild(p);
        }
      });

}

