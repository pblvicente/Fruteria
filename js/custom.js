const host = "http://localhost:3000";
let fruitArray = [];
let shoppingCartArray = {
  date: "",
  products: []
};

window.addEventListener("load", () => startApplication());

async function startApplication() {
  fruitArray = await getFruitsArrayFromAPI();

  fruitArray.sort((a, b) =>
    a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())
  );
  createFruitElements(fruitArray);
  giveFunctionalityToShoppingCartButton();
}

async function getFruitsArrayFromAPI() {
  try {
    let response = await fetch(host + "/fruits");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener frutas:", error);
    return [];
  }
}

function createFruitElements(fruitArray) {
  let fruitContainer = document.getElementById("fruitContainer");

  fruitArray.forEach((fruit) => {
    let column = createElementWithClassNames("div", "col");

    let card = createElementWithClassNames("div", "card");

    let img = createElementWithClassNames("img", ["card-img-top", "ratio", "ratio-1x1", "bg-secondary-subtle"]);
    img.src = "./media/fruits/" + fruit.mask + ".jpg";
    img.alt = fruit.mask;    

    let cardBody = createElementWithClassNames("div", "card-body");

    let rowFruitInfo = createElementWithClassNames("div", ["row", "gy-1", "justify-content-between", "card-text"]);

    let colFruitName = createElementWithClassNames("div", ["col", "text-truncate"]);
    colFruitName.innerHTML = fruit.name;

    let colFruitPrice = createElementWithClassNames("div", ["col-12", "col-md-auto"]);
    colFruitPrice.innerHTML = fruit.price + "&#8364";

    let colFruitInputContainer = createElementWithClassNames("div", "col-12");

    let colFruitInput = createElementWithClassNames("input", "form-control");
    colFruitInput.type = "number";
    colFruitInput.id = fruit.mask + "_input";
    colFruitInput.name = fruit.mask + "_input";
    colFruitInput.value = 0;
    colFruitInput.min = 0;
    colFruitInput.max = 100;

    img.addEventListener("error", () => { img.src = "./media/default/image.jpg"; });
    img.addEventListener("click", () => { giveFunctionalityToClickOnFruitImage(fruit, colFruitInput) });

    fruitContainer.appendChild(column);
    column.appendChild(card);
    card.appendChild(img);
    card.appendChild(cardBody);
    cardBody.appendChild(rowFruitInfo);
    rowFruitInfo.appendChild(colFruitName);
    rowFruitInfo.appendChild(colFruitPrice);
    rowFruitInfo.appendChild(colFruitInputContainer);
    colFruitInputContainer.appendChild(colFruitInput);
  });
}

function giveFunctionalityToShoppingCartButton() {

  let shoppingCartButton = document.getElementById("shoppingCartButton");

  shoppingCartButton.addEventListener("click", () => {

    if(shoppingCartArray.products.length <= 0) { return; }

    sendShoppingCartToJsonServer();

  });
  
}

// FUNCTIONALITIES

function giveFunctionalityToClickOnFruitImage(fruit, input) {  

  let numberSelected = parseInt(input.value);

  if(numberSelected <= 0) { 
    
    alert("Introduce un número mayor que 0")
    return;
  
  }

  input.value = 0;

  deleteEmptyMessageElement("productPanelMessage");
  
  createOrUpdateFruitOnShoppingCart(fruit, numberSelected);

  createProductPanelElement(fruit, numberSelected);

  changeBackgroundColoursFromProductPanelElements(fruit);

}

function createOrUpdateFruitOnShoppingCart(fruit, numberSelected) {

  let targetIndex = shoppingCartArray.products.findIndex((product) => product.fruitInfo.id == fruit.id);

  if (targetIndex == -1) {
    shoppingCartArray.products.push({
      fruitInfo: fruit,
      totalKilos: numberSelected
    });
  } else {
    shoppingCartArray.products[targetIndex].totalKilos = shoppingCartArray.products[targetIndex].totalKilos + numberSelected;
  }

}

function createProductPanelElement(fruit, numberSelected) {

  let productPanel = document.getElementById("productPanelMessage");
  let row = createElementWithClassNames("div", ["row", "border-2", "border-bottom", "px-2", "align-items-center", "justify-content-center", fruit.mask, "bg-info-subtle"]);
  let imgContainer = createElementWithClassNames("div", ["col-auto"]);
  let img = createElementWithClassNames("img", ["ratio", "ratio-1x1", "py-2", "p-xxl-1", "rounded-circle", "imgCustom"]);
  img.src = "./media/fruits/" + fruit.mask + ".jpg";
  img.alt = fruit.mask;
  let nameContainer = createElementWithClassNames("div", ["col-auto", "text-truncate"]);
  nameContainer.innerHTML = fruit.name;
  let numberSelectedContainer = createElementWithClassNames("div", ["col-auto"]);
  numberSelectedContainer.innerHTML = "x " + numberSelected;

  img.addEventListener("error", () => { img.src = "./media/default/image.jpg"; });
  
  productPanel.appendChild(row);
  row.appendChild(imgContainer);
  imgContainer.appendChild(img);
  row.appendChild(nameContainer)
  row.appendChild(numberSelectedContainer);

}

function changeBackgroundColoursFromProductPanelElements(fruit) {

  let rows = document.querySelectorAll("#productPanelMessage .row");

  if(rows.length > 1) {

    rows.forEach((element) => {

      if(element.classList.contains(fruit.mask)) {

        if(!element.classList.contains("bg-info-subtle")) {

          element.classList.add("bg-info-subtle")

        }
        if (element.classList.contains("bg-warning-subtle")) {

          element.classList.remove("bg-warning-subtle")

        }

      } else {

        if (!element.classList.contains("bg-warning-subtle")) {

          element.classList.add("bg-warning-subtle")

        }
        if (element.classList.contains("bg-info-subtle")) {

          element.classList.remove("bg-info-subtle")

        }

      }

    });

  }
  
}

function sendShoppingCartToJsonServer() {

  shoppingCartArray.date = getDate();
  let shoppingCartArrayToJSON = {
    ...shoppingCartArray,
    products: shoppingCartArray.products.map(product => ({
      fruitID: product.fruitInfo.id,
      totalAmount: (product.fruitInfo.price * product.totalKilos).toFixed(2),
      totalKilos: product.totalKilos
    }))
  };
  
  let URL = host + "/orders";  
  let init = {
    method: 'POST',
    body: JSON.stringify(shoppingCartArrayToJSON),
    headers: { 'Content-Type': 'application/json' }
  };

  fetch(URL, init)
  .then(response => response.json())
  .then(() =>  {
    createShoppingCartMessage();
    let window = createShoppingCartFruitPeculiaritiesWindow();
    setDefaultStateOfApplication(window);
  })
  .catch(error => console.error(error));
  
}

function createShoppingCartMessage() {

  deleteEmptyMessageElement("shoppingCartMessage");
  
  let shoppingCartMessage = document.getElementById("shoppingCartMessage");

  let dateRow = createElementWithClassNames("div", ["row", "px-2", "align-items-center", "justify-content-center"]);
  let dateCol = createElementWithClassNames("div", ["col-auto"]);
  dateCol.innerHTML = getFullDate();

  shoppingCartMessage.appendChild(dateRow);
  dateRow.appendChild(dateCol);

  let shoppingCartTotalAmount = 0;
  let shoppingCartTotalKilos = 0;

  shoppingCartArray.products
  .slice()
  .sort((a, b) =>
    b.fruitInfo.name.toLocaleLowerCase().localeCompare(a.fruitInfo.name.toLocaleLowerCase()))
  .forEach((product) => {

    shoppingCartTotalAmount = shoppingCartTotalAmount + (product.fruitInfo.price * product.totalKilos);
    shoppingCartTotalKilos = shoppingCartTotalKilos + product.totalKilos;

    let productName = product.fruitInfo.name;
    let productKilos = product.totalKilos + " kilo"
    
    if (product.totalKilos > 1) {
      productName = productName.endsWith("ón")
        ? productName.replace("ón", "ones")
        : productName + "s";
      productKilos = productKilos + "s";
    }    

    let productRow = createElementWithClassNames("div", ["row", "px-2", "align-items-center", "justify-content-center"]);  

    let productNameCol = createElementWithClassNames("div", ["col-auto", "text-truncate"]);
    productNameCol.innerHTML = productName

    let productKilosCol = createElementWithClassNames("div", ["col-auto"]);
    productKilosCol.innerHTML = productKilos

    let productPriceKiloCol = createElementWithClassNames("div", ["col-auto"]);
    productPriceKiloCol.innerHTML = (product.fruitInfo.price).toFixed(2) + "&#8364"
    
    let productTotalAmountCol = createElementWithClassNames("div", ["col-auto"]);
    productTotalAmountCol.innerHTML = (product.fruitInfo.price * product.totalKilos).toFixed(2) + "&#8364"

    shoppingCartMessage.appendChild(productRow);
    productRow.appendChild(productNameCol);
    productRow.appendChild(productKilosCol)
    productRow.appendChild(productPriceKiloCol)
    productRow.appendChild(productTotalAmountCol)

  });

  let totalAmountRow = createElementWithClassNames("div", ["row", "px-2", "align-items-center", "justify-content-center"]);   
  let totalAmountCol = createElementWithClassNames("div", ["col-auto"]);
  totalAmountCol.innerHTML = "Precio total: " + Math.floor(shoppingCartTotalAmount).toFixed(2) + " &#8364"

  let averageAmountRow = createElementWithClassNames("div", ["row", "px-2", "align-items-center", "justify-content-center"]);   
  let averageAmountCol = createElementWithClassNames("div", ["col-auto"]);
  averageAmountCol.innerHTML = "Precio medio: " + (shoppingCartTotalAmount / shoppingCartTotalKilos).toFixed(3) + " &#8364/kg"

  shoppingCartMessage.appendChild(totalAmountRow);
  totalAmountRow.appendChild(totalAmountCol)
  shoppingCartMessage.appendChild(averageAmountRow);
  averageAmountRow.appendChild(averageAmountCol)

}

function createShoppingCartFruitPeculiaritiesWindow() {
  let width = 720;
  let height = 480;

  let left = (window.innerWidth / 2) - (width / 2);
  let top = (window.innerHeight / 2) - (height / 2);

  let newWindow = window.open("./subpage/window/fruitInformationWindow.html", "fruitPeculiaritiesWindow", `width=${width},height=${height},top=${top},left=${left}`);

  if (!newWindow) { return; }

  newWindow.onload = () => {

    let windowContainer = newWindow.document.getElementById("windowContainer");
    if (!windowContainer) {
      console.error("Window container not found.");
      return;
    }

    shoppingCartArray.products.forEach((product) => {

      let paragraph = newWindow.document.createElement("div");
      paragraph.classList.add("col-auto");

      let productName = product.fruitInfo.name.endsWith("ón")
        ? product.fruitInfo.name.replace("ón", "ones")
        : `${product.fruitInfo.name}s`;

      let message = `Las ${productName} son frutas de ${product.fruitInfo.season.name}`;

      if (product.fruitInfo.season.mask === "summer") {
        let selection = product.fruitInfo.local ? ", de proximidad" : ", NO es de proximidad";
        message += `${selection} y están recogidas en ${product.fruitInfo.region}.`;
      } else {
        let selection = product.fruitInfo.refrigerate ? " y es recomendable conservarlas en la nevera." : " NO hace falta conservarlas en la nevera.";
        message += selection;
      }

      paragraph.innerText = message;
      windowContainer.appendChild(paragraph);
    });

  };

  return newWindow;

}

function setDefaultStateOfApplication(window) {

  setTimeout(() => {

    if (typeof window !== 'undefined' && window && !window.closed) {
      window.close();
    }
    
    createEmptyMessageElement("productPanelMessage");
    createEmptyMessageElement("shoppingCartMessage");
    
    shoppingCartArray = {
      date: "",
      products: []
    };

  }, 10000);

}

// UTILITIES

function getDate() {
  let date = new Date();
  return (date.getMonth() + 1) + "/" + date.getFullYear();
}

function getFullDate() {
    let date = new Date();

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');

    return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
}

function createElementWithClassNames(element, classNames) {
  let div = document.createElement(element);
  if (typeof classNames === "string") {
    div.classList.add(classNames);
  }
  if (Array.isArray(classNames)) {
    div.classList.add(...classNames);
  }
  return div;
}

function createEmptyMessageElement(id) {

  let div = document.getElementById(id);
  div.replaceChildren();
  div.classList.replace("align-self-start", "align-self-center");
  let h6 = createElementWithClassNames("h6", "text-center");
  h6.innerText = "Vacío";
  div.appendChild(h6);

  return div;

}

function deleteEmptyMessageElement(id) {

  if(id == "productPanelMessage") {

    let emptyMessage = document.querySelector("#" + id + " h6");
    if (emptyMessage) {
      emptyMessage.remove();
      document.getElementById(id).classList.replace("align-self-center", "align-self-start");
    }

  } else {

    let emptyMessage = document.getElementById(id);
    emptyMessage.replaceChildren();
    document.getElementById(id).classList.replace("align-self-center", "align-self-start");

  }

}