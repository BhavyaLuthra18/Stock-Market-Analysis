const stocks = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "PYPL",
  "TSLA",
  "JPM",
  "NVDA",
  "NFLX",
  "DIS",
];

// Async function to fetch stock data and render charts
async function render() {
  //Hide the chart initially while data is loading
  document.getElementById("chart").style.display = "none";
  let stockChartsData, stockStatsData, stockSummary;
  try {
    stockChartsData = await (
      await fetch(
        "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata"
      )
    ).json();
    stockSummary = await (
      await fetch(
        "https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata"
      )
    ).json();
    stockStatsData = await (
      await fetch(
        "https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata"
      )
    ).json();
  } finally {
    //Show the chart once data is loaded
    document.getElementById("chart").style.display = "block";
    document.getElementById("waiting").style.display = "none";
  }

  const stockListEle = document.getElementById("stockList");

  // chart Options using ApexCharts
  let options = {
    series: [
      {
        name: "AAPL",
        data: createChart(
          stockChartsData,
          stockStatsData,
          stockSummary,
          "AAPL",
          "5y"
        ),
      },
    ],
    chart: {
      id: "area-datetime",
      type: "area",
      height: 400,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 2,
      style: "hollow",
    },
    xaxis: {
      type: "datetime",
      min: createChart(
        stockChartsData,
        stockStatsData,
        stockSummary,
        "AAPL",
        "5y"
      )[0][0],
      tickAmount: 10,
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#00FF00"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
      },
    },
  };

  // Create a new ApexCharts chart instance
  let chart = new ApexCharts(
    document.querySelector("#chart-timeline"),
    options
  );

  chart.render();

  // Loop through each stock and create buttons and data elements
  stocks.forEach((val) => {
    // div for stock details
    const stockDetailsDivEle = document.createElement("div");
    stockDetailsDivEle.classList.add("stockDetailsDiv");
    // button for the stock
    const stockBtnEle = document.createElement("button");
    // spans for stock price and profit
    const stockPriceEle = document.createElement("span");
    const stockProfitEle = document.createElement("span");
    // button text to stock symbol
    stockBtnEle.textContent = val;

    // Set the stock price
    stockPriceEle.textContent = `$${stockStatsData.stocksStatsData[0][
      `${val}`
    ].bookValue.toFixed(2)}`;
    // Set the stock profit and apply color based on whether it's +ve or -ve
    stockProfitEle.textContent = `${stockStatsData.stocksStatsData[0][
      `${val}`
    ].profit.toFixed(2)}%`;
    if (stockStatsData.stocksStatsData[0][`${val}`].profit > 0)
      stockProfitEle.style.color = "green";
    else stockProfitEle.style.color = "red";
    stockDetailsDivEle.append(stockBtnEle, stockPriceEle, stockProfitEle);
    stockBtnEle.onclick = () => {
      const arr = createChart(
        stockChartsData,
        stockStatsData,
        stockSummary,
        val,
        "5y"
      );
      chart.updateOptions({
        series: [
          {
            data: arr,
            name: val, // update chart name to the selected stock
          },
        ],
        xaxis: {
          min: arr[0][0],
        },
      });
    };
    stockListEle.append(stockDetailsDivEle);
  });
  document.querySelector("#one_month").onclick = () => {
    const arr = createChart(
      stockChartsData,
      stockStatsData,
      stockSummary,
      document.getElementById("stockName").textContent,
      "1mo"
    );
    chart.updateOptions({
      series: [
        {
          data: arr,
          name: document.getElementById("stockName").textContent,
        },
      ],
      xaxis: {
        min: arr[0][0],
      },
    });
  };
  document.querySelector("#three_months").onclick = () => {
    const arr = createChart(
      stockChartsData,
      stockStatsData,
      stockSummary,
      document.getElementById("stockName").textContent,
      "3mo"
    );
    chart.updateOptions({
      series: [
        {
          data: arr,
          name: document.getElementById("stockName").textContent,
        },
      ],
      xaxis: {
        min: arr[0][0],
      },
    });
  };
  document.querySelector("#one_year").onclick = () => {
    const arr = createChart(
      stockChartsData,
      stockStatsData,
      stockSummary,
      document.getElementById("stockName").textContent,
      "1y"
    );
    chart.updateOptions({
      series: [
        {
          data: arr,
          name: document.getElementById("stockName").textContent,
        },
      ],
      xaxis: {
        min: arr[0][0],
      },
    });
  };
  document.querySelector("#five_years").onclick = () => {
    const arr = createChart(
      stockChartsData,
      stockStatsData,
      stockSummary,
      document.getElementById("stockName").textContent,
      "5y"
    );
    chart.updateOptions({
      series: [
        {
          data: arr,
          name: document.getElementById("stockName").textContent,
        },
      ],
      xaxis: {
        min: arr[0][0],
      },
    });
  };
}

//  Fuction to create chart for the selected stock and time period

function createChart(
  stockChartsData,
  stockStatsData,
  stockSummary,
  brand,
  time
) {
  // timestamps and value for selected stock and time period
  const timeArr =
    stockChartsData.stocksData[0][`${brand}`][`${time}`].timeStamp;
  const valArr = stockChartsData.stocksData[0][`${brand}`][`${time}`].value;
  // To store processed chart data
  const dataArr = [];
  let minVal = valArr[0].toFixed(2),
    maxVal = minVal;

  // Array for timestamp, value pairs for the chart
  for (let i = 0; i < timeArr.length; i++) {
    const newArr = [timeArr[i] * 1000, valArr[i].toFixed(2)];
    minVal = Math.min(minVal, newArr[1]);
    maxVal = Math.max(maxVal, newArr[1]);
    dataArr.push(newArr);
  }

  //Updating the stock info on the page
  document.getElementById("stockName").textContent = brand;
  document.getElementById("book_Value").textContent = `$${
    stockStatsData.stocksStatsData[0][`${brand}`].bookValue
  }`;
  document.getElementById("profit").textContent = `${
    stockStatsData.stocksStatsData[0][`${brand}`].profit
  }%`;
  if (stockStatsData.stocksStatsData[0][`${brand}`].profit > 0) {
    document.getElementById("profit").style.color = "green";
  } else {
    document.getElementById("profit").style.color = "red";
  }
  //Updating the stock summary details
  document.getElementById("stockSummary").textContent =
    stockSummary.stocksProfileData[0][`${brand}`].summary;
  //Updating the  stock Max and Min value for selected period of time
  document.getElementById(
    "stockMin"
  ).textContent = `Low value in the selected period of time = $${minVal}`;
  document.getElementById(
    "stockMax"
  ).textContent = `Peak value in the selected period of time = $${maxVal}`;
  return dataArr;
}
render();
