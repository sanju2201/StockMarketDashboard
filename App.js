/*
API Parameters
❚ Required: function

The time series of your choice. In this case, function=TIME_SERIES_INTRADAY

❚ Required: symbol

The name of the equity of your choice. For example: symbol=IBM

❚ Required: interval
Time interval between two consecutive data points in the time series. The following values are supported: 1min, 5min, 15min, 30min, 60min

❚ Optional: adjusted

By default, adjusted=true and the output time series is adjusted by historical split and dividend events. Set adjusted=false to query raw (as-traded) intraday values.

❚ Optional: outputsize

By default, outputsize=compact. Strings compact and full are accepted with the following specifications: compact returns only the latest 100 data points in the intraday time series; full returns the full-length intraday time series. The "compact" option is recommended if you would like to reduce the data size of each API call.

❚ Optional: datatype

By default, datatype=json. Strings json and csv are accepted with the following specifications: json returns the intraday time series in JSON format; csv returns the time series as a CSV (comma separated value) file.

❚ Required: apikey

Your API key. Claim your free API key here.

key ==> 3KSL9WN0OHTD9PZI
Examples (click for JSON output)
https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo */


// fetch("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=3KSL9WN0OHTD9PZI")
// .then((data)=>{
//     console.log(data);
// })
// .catch((srror)=>{
//     console.log("Error");
// });


// fetch("https://jsonplaceholder.typicode.com/todos/")
//   .then((res) => res.json())
//   .then((todoItems) => {
//     console.log(todoItems);
//   })
//   .catch((error) => {
//     console.log("ERROR IN API CALL", error);
//   });


// fetch("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AMZN&interval=5min&apikey=3KSL9WN0OHTD9PZI")
//   .then((res) => res.json())
//   .then((fetchedObj) => {
//     console.log(fetchedObj);
//   })
//   .catch((error) => {
//     console.log("ERROR IN API CALL", error);
//   });


  const fetchedObj ={
    "Meta Data": {
        "1. Information": "Intraday (5min) open, high, low, close prices and volume",
        "2. Symbol": "IBM",
        "3. Last Refreshed": "2023-01-30 20:00:00",
        "4. Interval": "5min",
        "5. Output Size": "Compact",
        "6. Time Zone": "US/Eastern"
    },
    "Time Series (5min)": {
        "2023-01-30 20:00:00": {
            "1. open": "136.3700",
            "2. high": "135.3700",
            "3. low": "135.3700",
            "4. close": "135.3700",
            "5. volume": "248"
        },
        "2023-01-30 19:55:00": {
            "1. open": "136.3700",
            "2. high": "135.3900",
            "3. low": "135.3900",
            "4. close": "135.3900",
            "5. volume": "285"
        }
    }
}


// console.log(myObj["work"]);
const mainContainer = document.getElementById("container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const optionButton = document.querySelectorAll(".option-button");
const intraday = document.getElementById("intraday");
const daily = document.getElementById("daily");
const weekly = document.getElementById("weekly");
const monthly = document.getElementById("monthly");
const listContainer = document.getElementById("watchlist-container");


// ///////// Active Button /////////////
optionButton.forEach((item)=>{
    item.addEventListener("click",()=>{
        changeActiveItem();
        item.classList.add("active");
        // console.log(item.value);
    })
});

const changeActiveItem = ()=>{
optionButton.forEach((item)=>{
    item.classList.remove("active");
})
};

// //////// Taking Data from Input ///////////
const myWatchlist = [];

searchButton.addEventListener("click", ()=>{
// mainContainer.addEventListener("keyup", ()=>{
let symbol = searchInput.value;
let type = document.querySelector(".option-button.active").value;

if(symbol && type){
changeActiveItem();

 // here to fetch API based on the symbol and type

let fetchSymbol = fetchedObj["Meta Data"]["2. Symbol"];
let fetchType = fetchedObj["Meta Data"]["1. Information"].split(" ")[0];

let output = fetchedObj["Time Series (5min)"];
let openPrice = Object.keys(output);
let currentPrice = output[openPrice[0]]["1. open"];
let oldPrice = output[openPrice[1]]["1. open"];
 
createNewListElement(fetchSymbol, currentPrice, oldPrice, fetchType);


searchInput.value = "";
document.querySelector(".option-button.active").value ="";

}
});



function createNewListElement(symbol, currentPrice, oldPrice, type){
let listItem = document.createElement("ul");
listItem.setAttribute("class","watchlist");
listItem.innerHTML = `<li id="symbol" class="list-element symbol">${symbol}</li>
            <li id="price" class="list-element price">${currentPrice}</li>
            <li id="information" class="list-element time">${type}</li>
            <li id="close" class="list-element close">
            <i class="fa-solid fa-xmark"></i>
            </li>`;

listContainer.append(listItem);  
let priceCheck = document.getElementById("price");

if(oldPrice > currentPrice){
    priceCheck.classList.add("bg-red");
} else if(oldPrice < currentPrice){
    priceCheck.classList.add("bg-green");
} else {
     priceCheck.classList.add("bg-white");
}

}



// listContainer.addEventListener("keydown",()=>{});

// listContainer.addEventListener("keyup", (event) => {
//   if (event.keyCode === 13) {
//     console.log('Enter key pressed')
//   }
// });


// https://sentry.io/answers/save-arrays-objects-browser-storage/#:~:text=The%20code%20example%20below%20shows,jsonArray%20as%20the%20value%20localStorage.

//     let output = myObj["time"];
//    Object.keys(output).forEach(key => {
//   console.log(key, output[key]);
// });

listContainer.addEventListener("click",()=>{
    console.log("You clicked Me");
})