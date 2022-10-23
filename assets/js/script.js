let cart = [];

//function to load Product
async function loadProduct() {
  try {
    var res = await axios({
      url: "https://6340d40ad1fcddf69cbe2698.mockapi.io/data",
      method: "GET",
    });
    const productList = mapData(res.data);
    const filteredList = filterProducts(productList);
    renderProduct(filteredList);
    return filteredList;
  } catch (err) {
    console.log(err);
  }
}

//function render product
const renderProduct = (data) => {
  let productHTML = "";
  for (let item of data) {
    productHTML += item.render();
  }
  document.getElementById("productList").innerHTML = productHTML;
};

//Function filter products
const filterProducts = (data) => {
  const filteredProductList = [];
  const brand = document.getElementById("selectBrand").value;
  if (brand !== "0") {
    console.log(brand);
    for (let item of data) {
      if (item.type.toLowerCase() === brand.toLowerCase()) {
        filteredProductList.push(item);
      }
    }
    return filteredProductList;
  }
  return data;
};

//function map data
const mapData = (dataFromAPI) => {
  const result = [];
  dataFromAPI.forEach((item) => {
    const { name, price, screen, backCamera, frontCamera, img, desc, type } =
      item;
    result.push(
      new Product(name, price, screen, backCamera, frontCamera, img, desc, type)
    );
  });
  return result;
};

//function render cart
const renderCart = (data) => {
  let cartHTML = "";
  for (let i in data) {
    cartHTML += `
    <tr>
                          <td><img src="${data[i].product.img}" class="card-img-top"></td>
                          <td>${data[i].product.name}</td>
                          <td>${data[i].qty}</td>
                          <td>${data[i].product.price}</td>
                          <td><i class="btn fa-solid fa-trash" id="btnRemoveCartItem"></i></td>
                      </tr>
    `;
  }
  document.getElementById("cartItemList").innerHTML = cartHTML;
  checkCart(data);
};

//function calculate total price
const calculateTotalPrice = (data) => {
  let totalPrice = 0;
  for (let item of data) {
    totalPrice += item.product.price * item.qty;
  }
  document.getElementById("total").innerHTML = totalPrice;
  document.getElementById("totalModal").innerHTML = totalPrice;
};

//function to check if cart is empty
const checkCart = (data) => {
  if (data.length === 0) {
    document.getElementById("cartList").style.display = "none";
    document.getElementById("btn-groups").style.display = "none";
    document.getElementById("message").style.display = "block";
  } else {
    document.getElementById("cartList").style.display = "block";
    document.getElementById("btn-groups").style.display = "block";
    document.getElementById("message").style.display = "none";

    //remove items in cart
    const btnRemoveCartItems = document.querySelectorAll("#btnRemoveCartItem");
    btnRemoveCartItems.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        data.splice(index, 1);
        saveCart(data);
        renderCart(data);
      });
    });

    //calculate total price
    calculateTotalPrice(data);

    //clear cart
    const btnClearCart = document.getElementById("clearCart");
    btnClearCart.addEventListener("click", () => {
      data = [];
      saveCart(data);
      renderCart(data);
    });
  }
};

//function save cart to local storage
const saveCart = (data) => {
  //set local storage
  localStorage.setItem("cart", JSON.stringify(data));
};

//function get local storage
const getCart = (data) => {
  if (localStorage.getItem("cart")) {
    data = JSON.parse(localStorage.getItem("cart"));
    renderCart(data);
  }
};

/*------------------------------
When Reload Window
--------------------------------*/
window.onload = async () => {
  let products = await loadProduct();

  //get local storage
  getCart();

  //add item to cart
  const btnAddToCarts = document.querySelectorAll("#btnAddToCart");
  btnAddToCarts.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      const btnAddToCart = e.target;
      let qty = parseInt(
        btnAddToCart.parentElement.querySelector("#qty").innerHTML
      );

      //check if that item already exists
      for (let i in cart) {
        if (cart[i].product.name === products[index].name) {
          cart[i].qty += qty;
          saveCart(cart);
          renderCart(cart);
          return;
        }
      }
      const cartItem = { product: products[index], qty: qty };
      cart.push(cartItem);
      saveCart(cart);
      renderCart(cart);
    });
  });

  //add quantity button
  const addBtns = document.querySelectorAll(".btn-add");
  addBtns.forEach((item) => {
    item.addEventListener("click", (e) => {
      const addBtn = e.target;
      addBtn.parentElement.querySelector(".btn-sub").disabled = false;
      let qty = parseInt(addBtn.parentElement.querySelector("#qty").innerHTML);
      qty += 1;
      addBtn.parentElement.querySelector("#qty").innerHTML = qty;
    });
  });

  //subtract quantity button
  const subBtns = document.querySelectorAll(".btn-sub");
  subBtns.forEach((item) => {
    let qty = parseInt(item.parentElement.querySelector("#qty").innerHTML);
    if (qty < 2) {
      item.disabled = true;
    }
    item.addEventListener("click", (e) => {
      const subBtn = e.target;
      let qty = parseInt(subBtn.parentElement.querySelector("#qty").innerHTML);
      qty -= 1;
      if (qty < 2) {
        subBtn.disabled = true;
      }
      subBtn.parentElement.querySelector("#qty").innerHTML = qty;
    });
  });
};

/*------------------------------
When Filter Products
--------------------------------*/
document.getElementById("selectBrand").onchange = async () => {
  let products = await loadProduct();

  //add item to cart
  const btnAddToCarts = document.querySelectorAll("#btnAddToCart");
  btnAddToCarts.forEach((item, index) => {
    item.addEventListener("click", (e) => {
      const btnAddToCart = e.target;
      let qty = parseInt(
        btnAddToCart.parentElement.querySelector("#qty").innerHTML
      );

      //check if that item already exists
      for (let i in cart) {
        if (cart[i].product.name === products[index].name) {
          cart[i].qty += qty;
          saveCart(cart);
          renderCart(cart);
          return;
        }
      }
      const cartItem = { product: products[index], qty: qty };
      cart.push(cartItem);
      saveCart(cart);
      renderCart(cart);
    });
  });

  //add quantity button
  const addBtns = document.querySelectorAll(".btn-add");
  addBtns.forEach((item) => {
    item.addEventListener("click", (e) => {
      const addBtn = e.target;
      addBtn.parentElement.querySelector(".btn-sub").disabled = false;
      let qty = parseInt(addBtn.parentElement.querySelector("#qty").innerHTML);
      qty += 1;
      addBtn.parentElement.querySelector("#qty").innerHTML = qty;
    });
  });

  //subtract quantity button
  const subBtns = document.querySelectorAll(".btn-sub");
  subBtns.forEach((item) => {
    let qty = parseInt(item.parentElement.querySelector("#qty").innerHTML);
    if (qty < 2) {
      item.disabled = true;
    }
    item.addEventListener("click", (e) => {
      const subBtn = e.target;
      let qty = parseInt(subBtn.parentElement.querySelector("#qty").innerHTML);
      qty -= 1;
      if (qty < 2) {
        subBtn.disabled = true;
      }
      subBtn.parentElement.querySelector("#qty").innerHTML = qty;
    });
  });
};
