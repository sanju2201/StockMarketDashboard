//  Load Event listener
window.addEventListener("load", () => {
  loadWatchlist();
});

//Storing all Element
const mainContainer = document.getElementById("container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const optionButton = document.querySelectorAll(".option-button");
const intraday = document.getElementById("intraday");
const daily = document.getElementById("daily");
const weekly = document.getElementById("weekly");
const monthly = document.getElementById("monthly");
const listContainer = document.getElementById("watchlist-container");
let closeButton = document.getElementById("close");
let listItem;

// My Map
const myWatchlist = new Map();
// localStorage.setItem("myList",myWatchlist);

const arrayOfWatchlist = {
  key: new Map(),
};

// Load watchlist on Page Reloading
function loadWatchlist() {
  const newMap = new Map(JSON.parse(localStorage.getItem("localList")));
  let mapIterator = newMap.keys();
  let array = Array.from(mapIterator);
  // console.log(array)
  if (array.length != 0) {
    for (let i in array) {
      let symbol = array[i].split("-")[0];
      let type = array[i].split("-")[1];
      fetchDetail(symbol, type);
    }
  }
}

// Litener for Active Button
optionButton.forEach((item) => {
  item.addEventListener("click", () => {
    changeActiveItem();
    item.classList.add("active");
    // console.log(item.value);
  });
});

const changeActiveItem = () => {
  optionButton.forEach((item) => {
    item.classList.remove("active");
  });
};

// On Clicking Search Button Fetching Data from API
searchButton.addEventListener("click", () => {
  let symbol = searchInput.value.toUpperCase();
  let type;
  try {
    type = document.querySelector(".option-button.active").value;
  } catch (error) {
    searchInput.value = "";
  }
  if (symbol && type) {
    fetchDetail(symbol, type);
  }
});

// Fetching data from API
async function fetchDetail(symbol, type) {
  if (symbol && type) {
    changeActiveItem();
    try {
      let fetchData = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_${type}&symbol=${symbol}&interval=5min&apikey=3KSL9WN0OHTD9PZI`
      );
      let fetchedObj = await fetchData.json();

      let fetchSymbol = fetchedObj["Meta Data"]["2. Symbol"];
      let fetchType = fetchedObj["Meta Data"]["1. Information"].split(" ")[0];
      let mainKeys = Object.keys(fetchedObj);
      let output = fetchedObj[mainKeys[1]];
      let openPrice = Object.keys(output);
      let currentPrice = output[openPrice[0]]["1. open"];
      let oldPrice = output[openPrice[1]]["1. open"];

      createNewListElement(
        fetchedObj,
        fetchSymbol,
        currentPrice,
        oldPrice,
        fetchType
      );
      searchInput.value = "";
      // console.log("then Block Running");
    } catch (error) {
      searchInput.value = "";
      // console.log("Catch Block Running");
      document
        .querySelector(".option-button.active")
        .classList.remove("active");
    }
  } else {
    document.querySelector(".option-button.active").classList.remove("active");
  }
}

// Function to Element add in watchlist
function createNewListElement(
  fetchedObj,
  fetchSymbol,
  currentPrice,
  oldPrice,
  fetchType
) {
  if (myWatchlist.has(`${fetchSymbol}-${fetchType}`)) {
    console.log("aleady present");
  } else {
    listItem = document.createElement("ul");
    listItem.classList.add(`${fetchSymbol}-${fetchType}`);
    listItem.classList.add("watchlist");
    listItem.setAttribute(`data-${fetchSymbol}-${fetchType}`, "0");
    listItem.id = `${fetchSymbol}-${fetchType}`;
    listItem.setAttribute("onclick", "showDetails(this)");
    currentPrice = Number(currentPrice).toFixed(2);

    listItem.innerHTML = `<li id="symbol" class="${fetchSymbol}-${fetchType} symbol">${fetchSymbol}</li>
            <li  id="price" class="${fetchSymbol}-${fetchType} price">${currentPrice}</li>
            <li  id="information" class="${fetchSymbol}-${fetchType} time">${fetchType.toUpperCase()}</li>
            <li  id="close" class="${fetchSymbol}-${fetchType} close" onclick="closeElement(event)">
            <i class="${fetchSymbol}-${fetchType} fa-solid fa-xmark"></i>
           </li>`;

    listContainer.appendChild(listItem);
    let watchlist = document.querySelector(".watchlist:last-child");
    let priceCheck = watchlist.querySelector(".price");

    if (oldPrice > currentPrice) {
      priceCheck.classList.add("bg-red");
    } else if (oldPrice < currentPrice) {
      priceCheck.classList.add("bg-green");
    } else {
      priceCheck.classList.add("bg-white");
    }
    myWatchlist.set(
      `${fetchSymbol}-${fetchType}`,
      getLastFiveDetails(fetchedObj, fetchType)
    );
    localStorage.setItem("localList", JSON.stringify([...myWatchlist]));
  }
}

// Fetching last 5 details
function getLastFiveDetails(fetchedObj, fetchType) {
  let mainKeys = Object.keys(fetchedObj);
  let output = fetchedObj[mainKeys[1]];
  let dayObject = Object.keys(output);

  let returnedMap = new Map();
  for (let i = 0; i < 5; i++) {
    if (fetchType === "Intraday") {
      returnedMap.set(dayObject[i].split(" ")[1], output[dayObject[i]]);
    } else {
      returnedMap.set(dayObject[i].split(" ")[0], output[dayObject[i]]);
    }
  }
  return returnedMap;
}

//  Delete Element from the Watchlist
function closeElement(event) {
  event.stopPropagation();
  let clickedElement = event.target.classList[0];
  let elementToBeRemoved = listContainer.querySelector(`.${clickedElement}`);
  let toBeRemoved = document.getElementById(elementToBeRemoved.classList[0]); // ul= watchlist item
  listContainer.removeChild(toBeRemoved);
  myWatchlist.delete(clickedElement);
  localStorage.setItem("localList", JSON.stringify([...myWatchlist]));
  removeDetails(elementToBeRemoved);
}

// Remoing the Detaied Modal
function removeDetails(event) {
  // console.log(event)
  let itemID = event.id;
  let deleteElement = listContainer.querySelector(`.${itemID}-detail`);
  listContainer.removeChild(deleteElement);
  event.setAttribute(`data-${itemID}`, 0);
}

// Show Detailed Modal
function showDetails(event) {
  let itemID = event.id;
  if (event.getAttribute(`data-${itemID}`) != 0) {
    removeDetails(event);
  } else {
    event.setAttribute(`data-${itemID}`, 1);

    if (itemID.includes("Intraday")) {
      dateOrTime = "TIME";
    } else {
      dateOrTime = "DATE";
    }
    let detailedModal = document.createElement("div");
    detailedModal.className = `${itemID}-detail detailed-model`;
    detailedModal.innerHTML = `<ul class="detail-list">
            <li class="date">${dateOrTime}</li>
            <li class="open">OPEN</li>
            <li class="high">HIGH</li>
            <li class="low">LOW</li>
            <li class="close">CLOSE</li>
            <li class="volume">VOLUME</li>
          </ul>`;

    let timeMap = myWatchlist.get(itemID);
    let mapIterator = timeMap.keys();

    const iterator1 = mapIterator[Symbol.iterator]();

    for (const timeDate of iterator1) {
      // variable for Date or Time
      let rowObject = timeMap.get(timeDate); // main Object from where need to fetch data
      let open = giveMeKey("open", rowObject);
      let high = giveMeKey("high", rowObject);
      let low = giveMeKey("low", rowObject);
      let close = giveMeKey("close", rowObject);
      let volume = giveMeKey("volume", rowObject);

      // Check present string and Return Actual actual Key As per Object
      function giveMeKey(check, rowObject) {
        let mainKeys = Object.keys(rowObject);
        for (let key of mainKeys) {
          if (key.includes(check)) return key;
        }
      }

      let rowDetail = document.createElement("ul");
      rowDetail.className = `${itemID} detailed-row`;
      rowDetail.className = "detail-list";
      rowDetail.innerHTML = `<li class="date">${timeDate}</li>
            <li class="open">${Number(rowObject[open]).toFixed(2)}</li>
            <li class="high">${Number(rowObject[high]).toFixed(2)}</li>
            <li class="low">${Number(rowObject[low]).toFixed(2)}</li>
            <li class="close">${Number(rowObject[close]).toFixed(2)}</li>
            <li class="volume">${rowObject[volume]}</li>`;

      detailedModal.appendChild(rowDetail);
    }
    event.after(detailedModal);
  }
}

/*
Map Methods
Method	Description
new Map()	Creates a new Map object
set()	Sets the value for a key in a Map
get()	Gets the value for a key in a Map
clear()	Removes all the elements from a Map
delete()	Removes a Map element specified by a key
has()	Returns true if a key exists in a Map
forEach()	Invokes a callback for each key/value pair in a Map
entries()	Returns an iterator object with the [key, value] pairs in a Map
keys()	Returns an iterator object with the keys in a Map
values()	Returns an iterator object of the values in a Map
*/

// fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_${type}&symbol=${symbol}&interval=5min&apikey=3KSL9WN0OHTD9PZI`)
//   .then((res) => res.json())
//   .then((fetchedObj) => {
// let fetchSymbol = fetchedObj["Meta Data"]["2. Symbol"];
// let fetchType = fetchedObj["Meta Data"]["1. Information"].split(" ")[0];

// let mainKeys = Object.keys(fetchedObj);
// let output = fetchedObj[mainKeys[1]];

// let openPrice = Object.keys(output);
// let currentPrice = output[openPrice[0]]["1. open"];
// let oldPrice = output[openPrice[1]]["1. open"];
// console.log("create ke upr")
//  createNewListElement(fetchedObj, fetchSymbol, currentPrice, oldPrice, fetchType);
// searchInput.value ="";
// console.log("then Block Running");
//  })
//  .catch((error) => {
//      searchInput.value = "";
//      console.log("Catch Block Running");
//      document.querySelector(".option-button.active").classList.remove("active");

// });
