//Storing Element
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


// Watchlist to be stored in local Storage
const myWatchlist = new Map();
// localStorage.setItem("myList",myWatchlist);

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

// Fetching Data

searchButton.addEventListener("click", ()=>{
let symbol = searchInput.value;
let type = document.querySelector(".option-button.active").value;

if(symbol && type){
changeActiveItem();

fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_${type}&symbol=${symbol}&interval=5min&apikey=3KSL9WN0OHTD9PZI`)
  .then((res) => res.json())
  .then((fetchedObj) => {  
let fetchSymbol = fetchedObj["Meta Data"]["2. Symbol"];
let fetchType = fetchedObj["Meta Data"]["1. Information"].split(" ")[0];

let mainKeys = Object.keys(fetchedObj);
let output = fetchedObj[mainKeys[1]];

let openPrice = Object.keys(output);
let currentPrice = output[openPrice[0]]["1. open"];
let oldPrice = output[openPrice[1]]["1. open"];

createNewListElement(fetchedObj, fetchSymbol, currentPrice, oldPrice, fetchType);
searchInput.value ="";
symbol= "";
type = "";
// console.log("Then Block Running")
 })
 .catch((error) => {
     symbol= "";
     type = "";
     searchInput.value = "";
     console.log("Catch Block Running");
    // alert("Wrong Symbol Entered");
  });
}
});



// Function to check for input and if not Present add to watchlist
function createNewListElement(fetchedObj, fetchSymbol, currentPrice, oldPrice, fetchType){
if (myWatchlist.has(`${fetchSymbol}-${fetchType}`)){
    console.log("aleady present");
}  else{
listItem = document.createElement("ul");
listItem.classList.add(`${fetchSymbol}-${fetchType}`)
listItem.classList.add("watchlist");
listItem.setAttribute(`data-${fetchSymbol}-${fetchType}`,"0");
listItem.id = `${fetchSymbol}-${fetchType}`;
listItem.setAttribute("onclick","showDetails(this)");
currentPrice = (Number(currentPrice)).toFixed(2);

listItem.innerHTML = `<li id="symbol" class="${fetchSymbol}-${fetchType} symbol">${fetchSymbol}</li>
            <li  id="price" class="${fetchSymbol}-${fetchType} price">${currentPrice}</li>
            <li  id="information" class="${fetchSymbol}-${fetchType} time">${fetchType.toUpperCase()}</li>
            <li  id="close" class="${fetchSymbol}-${fetchType} close" onclick="closeElement(event)">
            <i class="${fetchSymbol}-${fetchType} fa-solid fa-xmark"></i>
           </li>`;

listContainer.appendChild(listItem); 


let watchlist = document.querySelector(".watchlist:last-child");
let priceCheck = watchlist.querySelector(".price");

if(oldPrice > currentPrice){
    priceCheck.classList.add("bg-red");
} else if(oldPrice < currentPrice){
    priceCheck.classList.add("bg-green");
} else {
     priceCheck.classList.add("bg-white");
}

myWatchlist.set(`${fetchSymbol}-${fetchType}`,getLastFiveDetails(fetchedObj, fetchType));
// localStorage.setItem("stockList", listContainer.innerHTML);
}

}



// Fetching last 5 details
function getLastFiveDetails(fetchedObj ,fetchType){

let mainKeys = Object.keys(fetchedObj);
let output = fetchedObj[mainKeys[1]];
let dayObject = Object.keys(output);

let returnedMap = new Map();
for(let i=0;i<5;i++){
    if(fetchType === "Intraday"){
    returnedMap.set(dayObject[i].split(" ")[1], output[dayObject[i]]); 
    } else{
    returnedMap.set(dayObject[i].split(" ")[0], output[dayObject[i]]); 
    }
}
return returnedMap;
}

//  Delete Element from the Watchlist
function closeElement(event){
    event.stopPropagation();

    let clickedElement = event.target.classList[0];
    let elementToBeRemoved = listContainer.querySelector(`.${clickedElement}`);
    let toBeRemoved = document.getElementById(elementToBeRemoved.classList[0]);
    listContainer.removeChild(toBeRemoved);
    removeDetails(elementToBeRemoved);
    myWatchlist.delete(clickedElement);

    // localStorage.setItem("stockList", listContainer.innerHTML); 
}

// Remoing the Detaied Modal
function removeDetails(event){
    // console.log(event)
    let itemID = event.id;
     let deleteElement = listContainer.querySelector(`.${itemID}-detail`);
    //  console.log(deleteElement);
    listContainer.removeChild(deleteElement);
    // console.log(listContainer);
  event.setAttribute(`data-${itemID}`,0);
}



function showDetails(event){
 let itemID = event.id;
 if(event.getAttribute(`data-${itemID}`) != 0){  
   removeDetails(event);
 }
 else {
  event.setAttribute(`data-${itemID}`,1);
 
 if(itemID.includes("Intraday")){
    dateOrTime = "TIME";
 }
 else{
    dateOrTime = "DATE"
 }
  let detailedModal = document.createElement("div");
     detailedModal.className = `${itemID}-detail detailed-model`;
     detailedModal.innerHTML = `<ul class="detail-list">
            <li id="date">${dateOrTime}</li>
            <li id="open">OPEN</li>
            <li id="high">HIGH</li>
            <li id="low">LOW</li>
            <li id="close">CLOSE</li>
            <li id="volume">VOLUME</li>
          </ul>`
     
    let timeMap = myWatchlist.get(itemID)
    let mapIterator = timeMap.keys();

    const iterator1 = mapIterator[Symbol.iterator]();

  for (const timeDate of iterator1) {   // variable for Date or Time
    let rowObject = timeMap.get(timeDate); // main Object from where need to fetch data
    let open  = giveMeKey("open", rowObject);
    let high = giveMeKey("high", rowObject);
    let low = giveMeKey("low", rowObject);
    let close = giveMeKey("close", rowObject);
    let volume = giveMeKey("volume", rowObject);

    // console.log(open, high, low, close, volume);

    // Check present string and Return Actual actual Key As per Object
    function giveMeKey(check, rowObject){
    let mainKeys = Object.keys(rowObject);
    for(let key of mainKeys){
    if(key.includes(check))
    return key;
   }
   }

    let rowDetail = document.createElement("ul");
     rowDetail.className = `${itemID} detailed-row`;
     rowDetail.className = "detail-list";
     rowDetail.innerHTML = 
            `<li id="date">${timeDate}</li>
            <li id="open">${(Number(rowObject[open])).toFixed(2)}</li>
            <li id="high">${(Number(rowObject[high])).toFixed(2)}</li>
            <li id="low">${(Number(rowObject[low])).toFixed(2)}</li>
            <li id="close">${(Number(rowObject[close])).toFixed(2)}</li>
            <li id="volume">${rowObject[volume]}</li>`

    
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
