let iconCart = document.querySelector("#newPage");
let body = document.querySelector("body");
let closeCart = document.querySelector(".close");
let shopCart = document.querySelector(".shopCart");
let menuIcon = document.querySelector("#menuIcon");
let navItems = document.querySelector(".navItems1")

menuIcon.addEventListener('click',() => {
  navItems.classList.toggle("navItems2");
  navItems.classList.toggle("navItems3")
})

iconCart.addEventListener('click',() => {
  body.classList.toggle("showCart")
})

closeCart.addEventListener('click',() => {
  body.classList.toggle("showCart")
})

shopCart.addEventListener('click',() => {
  body.classList.toggle("showCart")
})

let btns = document.querySelectorAll(".addsToCart");
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", () => {
    btns[i].classList.remove("addToCart");
    btns[i].classList.add("addedToCart");
    btns[i].innerText = "Added";
    let productId = btns[i].getAttribute("id");
    addToCart(productId);
  })
}

let prev = document.querySelector(".prev");
prev.addEventListener("click", function () { plusSlides(-1) });
let next = document.querySelector(".next");
next.addEventListener("click", function () { plusSlides(1) });

let dots = document.querySelectorAll(".dot");
for (let i = 0; i < dots.length; i++) {
  dots[i].addEventListener("click", function () { currentSlide(i + 1) });
}

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

let cart = [];
let productList = [];
let itemContainer = document.querySelector(".itemContainer");
let itemCount = document.querySelector(".itemCount");
let totalPrice = document.querySelector(".totalPrice");

var initApp = () => {
  fetch("products.json")
    .then(response => response.json())
    .then(data => {
      productList = data;
    })
}

document.addEventListener("DOMContentLoaded", function() {
  initApp();
});

const addToCart = (productId) => {
  let positionInCart = cart.findIndex((value) => value.productId == productId)
  if (cart.length === 0) {
    cart = [{
      productId: productId,
      quantity: 1
    }]
  } else if (positionInCart < 0) {
    cart.push({
      productId: productId,
      quantity: 1
    })
  }
  else {
    cart[positionInCart].quantity += 1;
  }
  console.log(cart);
  addCartToHTML();
}

let addCartToHTML = () => {
  itemContainer.innerHTML = '';
  let totalQuantity = 0;
  let total = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity += item.quantity;
      let cartCard = document.createElement("div");
      cartCard.classList.add("itemCart")
      cartCard.dataset.id = item.productId;
      console.log(item.productId);
      let productPosition = productList.findIndex((value) => value.id == item.productId);
      let info = productList[productPosition]
      console.log(info);
      total += (info.price * item.quantity)
      console.log(total)
      cartCard.innerHTML = `
      <div>
      <div class="cartImage">
        <img src="${info.img}" alt="">
      </div>
      <div class="cartName">
      ${info.name}
      </div>
      </div>
      <div class="cartPrice">
      ${info.price}
      </div>
      <div class="quantity">
      <span class="minus">&lt</span>
      <span>${item.quantity}</span>
      <span class="plus">&gt</span>
      </div>
      <div class="subtotal">
      ${info.price * item.quantity}
      </div>
      <span class="material-symbols-outlined" id="delete">
        delete
      </span>`;
      itemContainer.append(cartCard);
    })
  }
  itemCount.innerHTML = `${totalQuantity}`
  totalPrice.innerHTML = `Total price : ${total}`
}

itemContainer.addEventListener('click',(event) => {
  let positionClick = event.target;
  let productId = positionClick.parentElement.dataset.id;
  if(positionClick.classList.contains('material-symbols-outlined')) {
    deleteItem(productId);
  }
})

let deleteItem = (productId) => {
  let positionItemInCart = cart.findIndex((value) => value.productId == productId);
  console.log(positionItemInCart)
  cart.splice(positionItemInCart,1);
  addCartToHTML();
}

itemContainer.addEventListener('click',(event) => {
  let positionClick = event.target;
  if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
    let productId = positionClick.parentElement.parentElement.dataset.id;
    console.log(productId)
    let type = 'minus';
    if(positionClick.classList.contains('plus')) {
      type = 'plus';
    }
    changeQuantity(productId,type);
  }
})

let changeQuantity = (productId,type) => {
  let positionItemInCart = cart.findIndex((value) => value.productId == productId);
  if(positionItemInCart >= 0) {
    switch (type) {
      case 'plus':
        cart[positionItemInCart].quantity += 1;
        break;

      default:
        let valueChange = cart[positionItemInCart].quantity - 1;
        if(valueChange > 0) {
          cart[positionItemInCart].quantity = valueChange;
        } else {
          cart.splice(positionItemInCart,1);
        }
        break;
    }
  }
  addCartToHTML();
}