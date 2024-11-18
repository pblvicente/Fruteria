const host = "http://localhost:3000";
var fruitArray = [];
var shoppingCartArray = {
  date: "",
  products: []
};

window.addEventListener("load", () => startApplication());

async function startApplication() {
  fruitArray = await getFruitsArrayFromAPI();

  fruitArray.sort((a, b) =>
    a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())
  );
  createFruitElements();
  giveFunctionalityToForm();
}

async function getFruitsArrayFromAPI() {
  try {
    let response = await fetch(`${host}/fruits`);
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener frutas: ${error}`);
    return [];
  }
}

function createFruitElements() {
  let fruitContainer = document.getElementById("fruitContainer");

  fruitArray.forEach((fruit) => {
    let column = createElementWithClassNames("div", "col");

    let primaryContainer = createElementWithClassNames("div", ["bg-dark", "p-2", "rounded"]);

    let secondaryContainer = createElementWithClassNames("div", ["position-relative", "overflow-hidden", "rounded", "border", "border-2"]);

    let image = createElementWithClassNames("img", ["bg-secondary-subtle", "ratio", "ratio-1x1"]);
    image.src = `./media/fruits/${fruit.mask}.jpg`;
    image.alt = fruit.mask; 
    
    let svgContainer = createElementWithClassNames("div", ["position-absolute", "top-0", "end-0", "m-1", "p-1", "bg-dark", "bg-opacity-25", "rounded"]);

    let infoContainer = createElementWithClassNames("div", ["position-absolute", "bottom-0", "start-50", "translate-middle-x", "w-100", "bg-dark", "bg-opacity-75"]);

    let infoRow = createElementWithClassNames("div", ["row", "justify-content-between", "card-text", "px-1"]);

    let colFruitName = createElementWithClassNames("div", ["col", "text-truncate"]);
    colFruitName.innerHTML = fruit.name;

    let colFruitPrice = createElementWithClassNames("div", ["col-12", "col-md-auto"]);
    colFruitPrice.innerHTML = `${fruit.price}&#8364`;

    let input = createElementWithClassNames("input", ["form-control", "mt-2"]);
    input.type = "number";
    input.id = `${fruit.mask}_input`;
    input.name = `${fruit.mask}_input`;
    input.value = 0;
    input.min = 0;
    input.max = 100;

    image.addEventListener("error", () => { setDefaultImageSrc(image); });
    image.addEventListener("click", () => { giveFunctionalityToClickOnFruitImage(fruit, input) });

    fruitContainer.appendChild(column);
      column.appendChild(primaryContainer);
        primaryContainer.appendChild(secondaryContainer);  
          secondaryContainer.appendChild(image);     
          secondaryContainer.appendChild(svgContainer);
            giveIconsToSvgContainer(svgContainer, fruit);
          secondaryContainer.appendChild(infoContainer);
            infoContainer.appendChild(infoRow);
              infoRow.appendChild(colFruitName);
              infoRow.appendChild(colFruitPrice);
        primaryContainer.appendChild(input);
  });
}

function giveFunctionalityToForm() {

  let form = document.getElementById("formContainer");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    validateInputs();

  });

  form.addEventListener("reset", () => {

    removeClientCodeInputContainer();

  });

  giveFunctionalityToHasClientCardInput(form);

}

// FUNCTIONALITIES

function giveFunctionalityToClickOnFruitImage(fruit, input) {  

  let numberSelected = parseInt(input.value);

  if(numberSelected <= 0) { 
    
    alert(`Introduce un número mayor que 0.`)
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
  img.src = `./media/fruits/${fruit.mask}.jpg`;
  img.alt = fruit.mask;
  let nameContainer = createElementWithClassNames("div", ["col-auto", "text-truncate"]);
  nameContainer.innerHTML = fruit.name;
  let numberSelectedContainer = createElementWithClassNames("div", ["col-auto"]);
  numberSelectedContainer.innerHTML = `x ${numberSelected}`;

  img.addEventListener("error", () => { setDefaultImageSrc(img); });
  
  productPanel.appendChild(row);
    row.appendChild(imgContainer);
      imgContainer.appendChild(img);
    row.appendChild(nameContainer);
    row.appendChild(numberSelectedContainer);

  row.scrollIntoView({ behavior: 'smooth', block: 'end' });

}

function changeBackgroundColoursFromProductPanelElements(fruit) {

  let rows = document.querySelectorAll("#productPanelMessage .row");

  if (rows.length > 1) {
    rows.forEach(element => {
      let hasFruitMask = element.classList.contains(fruit.mask);
      element.classList.toggle("bg-info-subtle", hasFruitMask);
      element.classList.toggle("bg-warning-subtle", !hasFruitMask);
    });
  }
  
}

function validateInputs() {

  let isValid = true;

  if(!validateClientCodeInput()) { isValid = false; }
  if(!validateNameInput()) { isValid = false; }
  if(!validateEmailInput()) { isValid = false; }

  if(!isValid) { alert("Hay datosincorrectos en el formulario"); }

}

function validateClientCodeInput() {

  let regex = /^[a-zA-Z]{3}\d{4}[/.#&]$/;
  let input = document.getElementById("clientCodeInput");

  if(input) {

    if (regex.test(input.value)) {
      return true;
    }
    
  }

  return false;

}

function validateNameInput() {

  let input = document.getElementById("nameInput");

  if(input.value.length >= 4 && input.value.length <= 15) {
    return true;
  }
  
  return false;  
  
}

function validateEmailInput() {

  let regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
  let input = document.getElementById("emailInput");

  if(regex.test(input.value)) {
    return true;
  }

  return false;
}

function giveFunctionalityToHasClientCardInput(form) {

  let hasClientCardInputs = document.querySelectorAll(`[name="hasClientCardInput"]`);

  hasClientCardInputs.forEach(input => {
    input.addEventListener("input", () => {
      if (input.value === "yes" && input.checked) {
        createClientCodeInputContainer(form);
      } else if (input.value === "no" && input.checked) {
        removeClientCodeInputContainer();
      }
    });
  });

}

function createClientCodeInputContainer(form) {

  let col = createElementWithClassNames("div", ["col-12", "col-xxl-5"]);
  col.id = `clientCodeInputContainer`

  let inputContainer = createElementWithClassNames("div", "form-floating");
  
  let input = createElementWithClassNames("input", ["col-12", "form-control"]);
  input.type = "text";
  input.id = `clientCodeInput`;
  input.name = `clientCodeInput`;
  input.required = true;

  let label = document.createElement("label");
  label.innerText = "Código de cliente";

  form.insertBefore(col, form.lastElementChild);
    col.appendChild(inputContainer);
      inputContainer.appendChild(input);
      inputContainer.appendChild(label);

  col.scrollIntoView({ behavior: 'smooth', block: 'end' });

}

function removeClientCodeInputContainer() {

  let clientCodeInputContainer = document.getElementById("clientCodeInputContainer");

  if(clientCodeInputContainer) {
    clientCodeInputContainer.remove();
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
  
  let URL = `${host}/orders`;  
  let init = {
    method: "POST",
    body: JSON.stringify(shoppingCartArrayToJSON),
    headers: { "Content-Type": "application/json" }
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
  .sort((a, b) => b.fruitInfo.name.toLocaleLowerCase().localeCompare(a.fruitInfo.name.toLocaleLowerCase()))
  .forEach((product) => {

    shoppingCartTotalAmount = shoppingCartTotalAmount + (product.fruitInfo.price * product.totalKilos);
    shoppingCartTotalKilos = shoppingCartTotalKilos + product.totalKilos;

    let productName = product.fruitInfo.name;
    let productKilos = product.totalKilos + " kilo"
    
    if (product.totalKilos > 1) {
      productName = productName.endsWith("ón") ? productName.replace("ón", "ones") : `${productName}s`;
      productKilos = productKilos + "s";
    }    

    let productRow = createElementWithClassNames("div", ["row", "px-2", "align-items-center", "justify-content-center"]);  

    let productNameCol = createElementWithClassNames("div", ["col-auto", "text-truncate"]);
    productNameCol.innerHTML = productName

    let productKilosCol = createElementWithClassNames("div", ["col-auto"]);
    productKilosCol.innerHTML = productKilos

    let productPriceKiloCol = createElementWithClassNames("div", ["col-auto"]);
    productPriceKiloCol.innerHTML = `${ (product.fruitInfo.price).toFixed(2) }&#8364`;
    
    let productTotalAmountCol = createElementWithClassNames("div", ["col-auto"]);
    productTotalAmountCol.innerHTML = `${ (product.fruitInfo.price * product.totalKilos).toFixed(2) }&#8364`;

    shoppingCartMessage.appendChild(productRow);
    productRow.appendChild(productNameCol);
    productRow.appendChild(productKilosCol)
    productRow.appendChild(productPriceKiloCol)
    productRow.appendChild(productTotalAmountCol)

  });

  let totalAmountRow = createElementWithClassNames("div", ["row", "px-2", "align-items-center", "justify-content-center"]);   
  let totalAmountCol = createElementWithClassNames("div", ["col-auto"]);
  totalAmountCol.innerHTML = `Precio total: ${ Math.floor(shoppingCartTotalAmount * 100) / 100 } &#8364`;

  let averageAmountRow = createElementWithClassNames("div", ["row", "px-2", "align-items-center", "justify-content-center"]);   
  let averageAmountCol = createElementWithClassNames("div", ["col-auto"]);
  averageAmountCol.innerHTML = `Precio medio: ${ (shoppingCartTotalAmount / shoppingCartTotalKilos).toFixed(3) } &#8364/kg`;

  shoppingCartMessage.appendChild(totalAmountRow);
  totalAmountRow.appendChild(totalAmountCol)
  shoppingCartMessage.appendChild(averageAmountRow);
  averageAmountRow.appendChild(averageAmountCol)

}

function createShoppingCartFruitPeculiaritiesWindow() {
  let width = 500;
  let height = 300;

  let left = (window.innerWidth / 2) - (width / 2);
  let top = (window.innerHeight / 2) - (height / 2);

  let newWindow = window.open("./subpage/window/fruitInformationWindow.html", "fruitPeculiaritiesWindow", `width=${width},height=${height},top=${top},left=${left}`);

  newWindow.onload = () => {

    let windowContainer = newWindow.document.getElementById("windowContainer");

    shoppingCartArray.products.forEach((product) => {

      let paragraph = newWindow.document.createElement("div");
      paragraph.classList.add("col-auto");

      let productName = product.fruitInfo.name.endsWith("ón")
        ? product.fruitInfo.name.replace("ón", "ones")
        : `${product.fruitInfo.name}s`;

      let message = `${productName} son frutas de ${product.fruitInfo.season.name}`;

      if (product.fruitInfo.season.mask === "summer") {
        let selection = product.fruitInfo.local ? "son de proximidad" : "NO son de proximidad";
        message += `, ${selection} y se recogen en ${product.fruitInfo.region}.`;
      } else {
        let selection = product.fruitInfo.refrigerate ? " y es recomendable que su conserva sea en nevera." : " NO es necesaria su conserva en nevera.";
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
  return `${(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function getFullDate() {
    let date = new Date();

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function setDefaultImageSrc(img) {

  img.src = `./media/default/image.jpg`;

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

function createSVG(svgAttributes, paths) {
  let svgNS = "http://www.w3.org/2000/svg";

  let svgElement = document.createElementNS(svgNS, "svg");

  for (let [key, value] of Object.entries(svgAttributes)) {
      svgElement.setAttribute(key, value);
  }

  paths.forEach(pathData => {
    let pathElement = document.createElementNS(svgNS, "path");
      pathElement.setAttribute("d", pathData);
      svgElement.appendChild(pathElement);
  });

  return svgElement;
}

function giveIconsToSvgContainer(svgContainer, fruit) {

  let seasonSvg = "";

  if(fruit.season.mask === "summer") {

    seasonSvg = createSVG({
      xmlns: "http://www.w3.org/2000/svg",
      width: "32",
      height: "32",
      fill: "currentColor",
      class: "bi bi-thermometer-sun rounded p-1 bg-danger-subtle bg-gradient text-warning",
      viewBox: "0 0 16 16"
    }, [
        "M5 12.5a1.5 1.5 0 1 1-2-1.415V2.5a.5.5 0 0 1 1 0v8.585A1.5 1.5 0 0 1 5 12.5",
        "M1 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM3.5 1A1.5 1.5 0 0 0 2 2.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0L5 10.486V2.5A1.5 1.5 0 0 0 3.5 1m5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5m4.243 1.757a.5.5 0 0 1 0 .707l-.707.708a.5.5 0 1 1-.708-.708l.708-.707a.5.5 0 0 1 .707 0M8 5.5a.5.5 0 0 1 .5-.5 3 3 0 1 1 0 6 .5.5 0 0 1 0-1 2 2 0 0 0 0-4 .5.5 0 0 1-.5-.5M12.5 8a.5.5 0 0 1 .5-.5h1a.5.5 0 1 1 0 1h-1a.5.5 0 0 1-.5-.5m-1.172 2.828a.5.5 0 0 1 .708 0l.707.708a.5.5 0 0 1-.707.707l-.708-.707a.5.5 0 0 1 0-.708M8.5 12a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5"
    ]);

    let localSvg = "";

    if(fruit.local) {

      localSvg = createSVG({
        xmlns: "http://www.w3.org/2000/svg",
        width: "32",
        height: "32",
        fill: "currentColor",
        class: "bi bi-globe-europe-africa rounded p-1 ms-1 bg-success bg-gradient",
        viewBox: "0 0 16 16"
      }, [
        "M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M3.668 2.501l-.288.646a.847.847 0 0 0 1.479.815l.245-.368a.81.81 0 0 1 1.034-.275.81.81 0 0 0 .724 0l.261-.13a1 1 0 0 1 .775-.05l.984.34q.118.04.243.054c.784.093.855.377.694.801-.155.41-.616.617-1.035.487l-.01-.003C8.274 4.663 7.748 4.5 6 4.5 4.8 4.5 3.5 5.62 3.5 7c0 1.96.826 2.166 1.696 2.382.46.115.935.233 1.304.618.449.467.393 1.181.339 1.877C6.755 12.96 6.674 14 8.5 14c1.75 0 3-3.5 3-4.5 0-.262.208-.468.444-.7.396-.392.87-.86.556-1.8-.097-.291-.396-.568-.641-.756-.174-.133-.207-.396-.052-.551a.33.33 0 0 1 .42-.042l1.085.724c.11.072.255.058.348-.035.15-.15.415-.083.489.117.16.43.445 1.05.849 1.357L15 8A7 7 0 1 1 3.668 2.501"
      ]);

    } else {

      localSvg = createSVG({
        xmlns: "http://www.w3.org/2000/svg",
        width: "32",
        height: "32",
        fill: "currentColor",
        class: "bi bi-airplane-engines-fill rounded p-1 ms-1 bg-secondary bg-gradient",
        viewBox: "0 0 16 16"
      }, [
          "M8 0c-.787 0-1.292.592-1.572 1.151A4.35 4.35 0 0 0 6 3v3.691l-2 1V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.191l-1.17.585A1.5 1.5 0 0 0 0 10.618V12a.5.5 0 0 0 .582.493l1.631-.272.313.937a.5.5 0 0 0 .948 0l.405-1.214 2.21-.369.375 2.253-1.318 1.318A.5.5 0 0 0 5.5 16h5a.5.5 0 0 0 .354-.854l-1.318-1.318.375-2.253 2.21.369.405 1.214a.5.5 0 0 0 .948 0l.313-.937 1.63.272A.5.5 0 0 0 16 12v-1.382a1.5 1.5 0 0 0-.83-1.342L14 8.691V7.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v.191l-2-1V3c0-.568-.14-1.271-.428-1.849C9.292.591 8.787 0 8 0"
      ]);    

    }

    svgContainer.appendChild(seasonSvg);
    svgContainer.appendChild(localSvg);

  } else {

    seasonSvg = createSVG({
      xmlns: "http://www.w3.org/2000/svg",
      width: "32",
      height: "32",
      fill: "currentColor",
      class: "bi bi-thermometer-snow rounded p-1 bg-primary-subtle bg-gradient text-info",
      viewBox: "0 0 16 16"
    }, [
      "M5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585A1.5 1.5 0 0 1 5 12.5",
      "M1 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM3.5 1A1.5 1.5 0 0 0 2 2.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0L5 10.486V2.5A1.5 1.5 0 0 0 3.5 1m5 1a.5.5 0 0 1 .5.5v1.293l.646-.647a.5.5 0 0 1 .708.708L9 5.207v1.927l1.669-.963.495-1.85a.5.5 0 1 1 .966.26l-.237.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.884.237a.5.5 0 1 1-.26.966l-1.848-.495L9.5 8l1.669.963 1.849-.495a.5.5 0 1 1 .258.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.237.883a.5.5 0 1 1-.966.258L10.67 9.83 9 8.866v1.927l1.354 1.353a.5.5 0 0 1-.708.708L9 12.207V13.5a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5"
    ]);

    let refrigerateSvg = "";

    if(fruit.refrigerate) {

      refrigerateSvg = createSVG({
          xmlns: "http://www.w3.org/2000/svg",
          width: "32",
          height: "32",
          fill: "currentColor",
          class: "bi bi-snow2 rounded p-1 ms-1 bg-primary bg-gradient",
          viewBox: "0 0 16 16"
      }, [
          "M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793v-1.086l-.646.647a.5.5 0 0 1-.707-.708L7.5 10.293V8.866l-1.236.713-.495 1.85a.5.5 0 1 1-.966-.26l.237-.882-.94.542-.496 1.85a.5.5 0 1 1-.966-.26l.237-.882-1.12.646a.5.5 0 0 1-.5-.866l1.12-.646-.884-.237a.5.5 0 1 1 .26-.966l1.848.495.94-.542-.882-.237a.5.5 0 1 1 .258-.966l1.85.495L7 8l-1.236-.713-1.849.495a.5.5 0 1 1-.258-.966l.883-.237-.94-.542-1.85.495a.5.5 0 0 1-.258-.966l.883-.237-1.12-.646a.5.5 0 1 1 .5-.866l1.12.646-.237-.883a.5.5 0 0 1 .966-.258l.495 1.849.94.542-.236-.883a.5.5 0 0 1 .966-.258l.495 1.849 1.236.713V5.707L6.147 4.354a.5.5 0 1 1 .707-.708l.646.647V3.207L6.147 1.854a.5.5 0 1 1 .707-.708l.646.647V.5a.5.5 0 0 1 1 0v1.293l.647-.647a.5.5 0 1 1 .707.708L8.5 3.207v1.086l.647-.647a.5.5 0 1 1 .707.708L8.5 5.707v1.427l1.236-.713.495-1.85a.5.5 0 1 1 .966.26l-.236.882.94-.542.495-1.85a.5.5 0 1 1 .966.26l-.236.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.883.237a.5.5 0 1 1-.26.966l-1.848-.495-.94.542.883.237a.5.5 0 1 1-.26.966l-1.848-.495L9 8l1.236.713 1.849-.495a.5.5 0 0 1 .259.966l-.883.237.94.542 1.849-.495a.5.5 0 0 1 .259.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.236.883a.5.5 0 1 1-.966.258l-.495-1.849-.94-.542.236.883a.5.5 0 0 1-.966.258L9.736 9.58 8.5 8.866v1.427l1.354 1.353a.5.5 0 0 1-.707.708l-.647-.647v1.086l1.354 1.353a.5.5 0 0 1-.707.708l-.647-.647V15.5a.5.5 0 0 1-.5.5"
      ]);

    } else {

      refrigerateSvg = createSVG({
        xmlns: "http://www.w3.org/2000/svg",
        width: "32",
        height: "32",
        fill: "currentColor",
        class: "bi bi-fire rounded p-1 ms-1 bg-danger bg-gradient",
        viewBox: "0 0 16 16"
      }, [
        "M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"
      ]);

    }

    svgContainer.appendChild(seasonSvg);
    svgContainer.appendChild(refrigerateSvg);

  }

}