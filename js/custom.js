var host = "http://localhost:3000";
let shoppingCartArray = [];
var fruitArray = [];

window.addEventListener("load", startApplication());

function startApplication() {

  getFruitsArrayFromAPI().then(fruits => {
    fruitArray = fruits;

    fruitArray.sort((a, b) =>
      a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())
    );
    createFruitElements(fruitArray);
    giveShoppingCartButton();
  });

}

function getFruitsArrayFromAPI() {
  return fetch(host + "/fruits")
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.error("Error HTTP:", response.status, "(", response.statusText, ")");
        return [];
      }
    })
    .catch(error => {
      console.error(error);
      return [];
    });
}

function createFruitElements(fruitArray) {
  let fruitContainer = document.getElementById("fruitContainer");

  fruitArray.forEach((fruit) => {
    let column = document.createElement("div");
    column.classList.add("col-12", "col-sm-4", "col-lg-2");

    let card = document.createElement("div");
    card.classList.add("card");

    let img = document.createElement("img");
    img.classList.add(
      "card-img-top",
      "ratio",
      "ratio-1x1",
      "bg-secondary-subtle"
    );
    img.src = "./media/fruits/" + fruit.mask + ".jpg";
    img.alt = fruit.mask;
    img.addEventListener("error", (event) => {
      img.src = null;
      img.src = "./media/default/image.jpg";
    });

    img.addEventListener("click", (event) => {
      if (shoppingCartArray.length <= 0) {
        document.getElementById("shoppingCartMessage").innerHTML = "Vacío";
      }

      let target = shoppingCartArray.findIndex(
        (element) => element.mask == img.alt
      );

      if (target == -1) {
        shoppingCartArray.push({
          mask: fruit.mask,
          name: fruit.name,
          price: fruit.price,
          quantity: 1,
        });
      } else {
        shoppingCartArray[target].quantity =
          shoppingCartArray[target].quantity + 1;
      }
    });

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let rowFruitInfo = document.createElement("div");
    rowFruitInfo.classList.add("row", "justify-content-between", "card-text");

    let colFruitName = document.createElement("div");
    colFruitName.classList.add("col", "text-truncate");
    colFruitName.innerHTML = fruit.name;

    let colFruitPrice = document.createElement("div");
    colFruitPrice.classList.add("col-12", "col-md-auto");
    colFruitPrice.innerHTML = fruit.price + "&#8364";

    fruitContainer.appendChild(column);
    column.appendChild(card);
    card.appendChild(img);
    card.appendChild(cardBody);
    cardBody.appendChild(rowFruitInfo);
    rowFruitInfo.appendChild(colFruitName);
    rowFruitInfo.appendChild(colFruitPrice);
  });
}

function giveShoppingCartButton() {
  let shoppingCartButton = document.getElementById("shoppingCartButton");
  let shoppingCartMessage = document.getElementById("shoppingCartMessage");

  shoppingCartButton.addEventListener("click", (e) => {
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
