const host = "http://localhost:3000";
let fruitArray = [];
let shoppingCartArray = {
  date: "",
  products: []
};

window.addEventListener("load", () => startApplication());

function startApplication() {
  getFruitsArrayFromAPI().then((fruits) => {
    fruitArray = fruits;

    fruitArray.sort((a, b) =>
      a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())
    );
    createFruitElements(fruitArray);
    giveFunctionalityToShoppingCartButton();
  });
}

function getFruitsArrayFromAPI() {
  return fetch(host + "/fruits")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.error(
          "Error HTTP:",
          response.status,
          "(",
          response.statusText,
          ")"
        );
        return [];
      }
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
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
    colFruitInput.id = fruit.mask;
    colFruitInput.name = fruit.mask;
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
  let shoppingCartMessage = document.getElementById("shoppingCartMessage");

  shoppingCartButton.addEventListener("click", () => {
    if (shoppingCartArray.length >= 1) {
      let message = "";
      let total = 0;
      let totalKilos = 0;

      shoppingCartArray.sort((a, b) =>
        b.name.toLocaleLowerCase().localeCompare(a.name.toLocaleLowerCase())
      );

      shoppingCartMessage.innerHTML = shoppingCartArray.forEach((element) => {
        let fruitName;
        if (element.quantity > 1) {
          fruitName = element.name.endsWith("ón")
            ? element.name.replace("ón", "ones")
            : element.name + "s";
        } else {
          fruitName = element.name;
        }

        message =
          message +
          element.quantity +
          " " +
          fruitName +
          " - " +
          element.price +
          "&#8364/kg - Total: " +
          (element.quantity * element.price).toFixed(2) +
          "&#8364<br>";
        total = total + element.quantity * element.price;
        totalKilos = totalKilos + element.quantity;
      });

      shoppingCartMessage.innerHTML =
        message +
        "<br>Precio total: " +
        total.toFixed(2) +
        "&#8364<br>Precio medio: " +
        (total / totalKilos).toFixed(2) +
        "&#8364";
    } else {
      document.getElementById("shoppingCartMessage").innerHTML = "Vacío";
    }

    shoppingCartArray = [];
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
  let message = document.querySelector("#productPanelMessage h6");
  if (message) {
    message.remove();
    document.getElementById("productPanelMessage").classList.replace("align-self-center", "align-self-start")    
  }

  let targetIndex = shoppingCartArray.products.findIndex((element) => element.fruitID == fruit.id);

  if (targetIndex == -1) {
    shoppingCartArray.products.push({
      fruitID: fruit.id,
      totalAmount: numberSelected * fruit.price,
      totalKilos: numberSelected
    });
  } else {
    shoppingCartArray.products[targetIndex].totalKilos = shoppingCartArray.products[targetIndex].totalKilos + numberSelected;
    shoppingCartArray.products[targetIndex].totalAmount = shoppingCartArray.products[targetIndex].totalKilos * fruit.price;
  }

  createProductPanelElement(fruit, numberSelected);

}

function createProductPanelElement(fruit, numberSelected) {

  let productPanel = document.getElementById("productPanelMessage");
  let row = createElementWithClassNames("div", ["row", "bg-dark", "border-2", "border-bottom", "px-2", "align-items-center", "justify-content-center", fruit.mask]);
  let imgContainer = createElementWithClassNames("div", ["col-auto"]);
  let img = createElementWithClassNames("img", ["ratio", "ratio-1x1", "py-2", "p-xxl-1", "rounded-circle", "imgCustom"]);
  img.src = "./media/fruits/" + fruit.mask + ".jpg";
  img.alt = fruit.mask;
  let nameContainer = createElementWithClassNames("div", ["col-auto", "text-truncate"]);
  nameContainer.innerHTML = fruit.name;
  let numberSelectedContainer = createElementWithClassNames("div", ["col-auto"]);
  numberSelectedContainer.innerHTML = "x " + numberSelected;
  
  productPanel.appendChild(row);
  row.appendChild(imgContainer);
  imgContainer.appendChild(img);
  row.appendChild(nameContainer)
  row.appendChild(numberSelectedContainer);

}

// UTILITIES

function getDate() {
  let date = new Date();
  return date.getMonth() + "/" + date.getFullYear();
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
  div.classList.replace("align-self-start", "align-self-center")
  let h6 = createElementWithClassNames("h6", "text-center");
  h6.innerText = "Vacío";
  div.appendChild(h6);

  return div;

}