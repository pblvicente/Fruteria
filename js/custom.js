let appleDataArray = { mask: "apple", name: "Manzana", price: 2.04 };
let bananaDataArray = { mask: "banana", name: "Plátano", price: 1.65 };
// let blackberryDataArray = {mask: "blackberry", name: "Mora", price: 17.52};
let blueberryDataArray = {
  mask: "blueberry",
  name: "Arándano",
  price: 14.49,
};
//let cherryDataArray = { mask: "cherry", name: "Cereza", price: 12.63};
// let grapeDataArray = {mask: "grape", name: "Uva", price: 4.03};
let lemonDataArray = { mask: "lemon", name: "Limón", price: 2.7 };
// let limeDataArray = {mask: "lime", name: "Lima", price: 4.07};
// let mangoDataArray = {mask: "mango", name: "Mango", price: 3.46};
let melonDataArray = { mask: "melon", name: "Melón", price: 0.92 };
let orangeDataArray = { mask: "orange", name: "Naranja", price: 2.4 };
// let papayaDataArray = {mask: "papaya", name: "Papaya", price: 5.05};
let pearDataArray = { mask: "pear", name: "Pera", price: 2.54 };
let pineappleDataArray = { mask: "pineapple", name: "Piña", price: 1.95 };
// let raspberryDataArray = {mask: "raspberry", name: "Frambuesa", price: 13.92};
let strawberryDataArray = { mask: "strawberry", name: "Fresa", price: 7.13 };
let watermelonDataArray = { mask: "watermelon", name: "Sandía", price: 0.85 };

let fruitArray = [
  appleDataArray,
  bananaDataArray,
  blueberryDataArray,
  lemonDataArray,
  melonDataArray,
  orangeDataArray,
  pearDataArray,
  pineappleDataArray,
  strawberryDataArray,
  watermelonDataArray,
];

let shoppingCartArray = [];

fruitArray.sort((a, b) =>
  a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase())
);

function createFruitElements(fruitArray) {
  let fruitContainer = document.getElementById("fruitContainer");

  fruitArray.forEach((fruit) => {
    let column = document.createElement("div");
    column.classList.add("col-12", "col-sm-4", "col-lg-3");

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

window.addEventListener("load", function (event) {
  
  createFruitElements(fruitArray);

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
});
