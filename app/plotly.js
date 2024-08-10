function plotlyPIB(year, nominalPIB, realPIB) {

  const data = [{
    x: year,
    y: nominalPIB,
    name: "PIB nominal",
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "rgba(32,178,170,0.6)" }
  },
  {
    x: year,
    y: realPIB,
    name: "PIB real",
    type: "scatter",
    mode: "lines+markers",
    marker: { color: "rgba(0,0,255,0.6)" }
  },];

  var layout = {
    xaxis: {
      type: 'category',
      title: "años"
    },
    yaxis: {
      title: "PIB"
    },
    title: "PIB Nominal y Real"
  };

  Plotly.newPlot(document.querySelector("body > div:nth-of-type(3)"), data, layout);
}

function plotlyGrowth(year, growth, i) {
  nameArray = ["Crecimiento nominal", "Crecimiento real"]
  colorArray = ["rgba(32,178,170,0.6)", "rgba(0,0,255,0.6)"]
  const data = [
    {
      x: year,
      y: growth,
      type: "scatter",
      mode: "lines+markers",
      marker: { color: colorArray[i] }
    }
  ];

  var layout = {
    xaxis: {
      type: "category",
      title: "años",
    },
    yaxis: {
      title: "Crecimiento PIB (%)",
    },
    title: nameArray[i],
  };
  Plotly.newPlot(document.querySelector("body > div:nth-of-type(4)"), data, layout);
}

