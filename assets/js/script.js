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
  // can use map here
  return dataFromAPI.map((item) => {
    const { name, price, screen, backCamera, frontCamera, img, desc, type } =
      item;
    return new Product(name, price, screen, backCamera, frontCamera, img, desc, type)
  });
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
      // fix bug here: https://www.loom.com/share/9a392aa2dedf42abbe1bd53d0610cdd3
      // explanation:
      // when using `data = []`, you are reassigning variable `data` to point to a new array
      // the old data registered in callback is still pointing to the old array
      // so when you click clear cart, the old data is still there
      // when you add item again, it is added to the old array
      // solution => use `splice` to mutate directly the original array,
      // as you have done in do in `btnRemoveCartItems` above
      data.splice(0, data.length);
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

  // call reusable function at end of file
  registerClickEvents(products);
};

/*------------------------------
When Filter Products
--------------------------------*/
document.getElementById("selectBrand").onchange = async () => {
  let products = await loadProduct();

  // call reusable function at end of file
  registerClickEvents(products);
};


/*------------------------------
Reusable click event register functions
--------------------------------*/

// can simplify add & subtract click handler with this
/**
 * JSDoc syntax for documenting code and provide code suggestion (intellisense) when not using typescript
 * for example, if using vscode, try hover mouse over `btn` or `increment` in `onQuantityBtnClick(btn, increment)` and
 * the type of the variable will be shown
 * 
 * @param {HTMLButtonElement} btn 
 * @param {(-1 | 1)} increment
 */
function onQuantityBtnClick(btn, increment) {
  btn.disabled = false;
  const qtyElement = btn.parentElement.querySelector("#qty");
  let qty = parseInt(qtyElement.innerHTML);
  qty += increment;
  qtyElement.innerHTML = qty;

  const subBtn = btn.parentElement.querySelector(".btn-sub");
  subBtn.disabled = qty < 2;
}

function registerClickEventForQuantityBtns() {
  // add btns
  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", (e) => onQuantityBtnClick(btn, 1));
  });

  // subtract btns
  document.querySelectorAll(".btn-sub").forEach((btn) => {
    let qty = parseInt(btn.parentElement.querySelector("#qty").innerHTML);
    if (qty < 2) {
      btn.disabled = true;
    }
    btn.addEventListener("click", (e) => onQuantityBtnClick(btn, -1));
  });
}

/**
 * @param {Product[]} products 
 */
function registerClickEventForAddToCartBtns(products) {
  const btnAddToCarts = document.querySelectorAll("#btnAddToCart");
  btnAddToCarts.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      // use the btn element in `btnAddToCarts` instead of e.target here
      // because in some case if there are nested element within btn, e.target might not be the btn
      // e.target === the element that triggered the event 
      
      let qty = parseInt(
        btn.parentElement.querySelector("#qty").innerHTML
      );

      // can simplify code with this
      const existingItem = cart.find(item => item.product.name === products[index].name);
      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.push({ product: products[index], qty });
      }
      saveCart(cart);
      renderCart(cart);
    });
  });
}

/**
 * @param {Product[]} products 
 */
function registerClickEvents(products) {
  registerClickEventForQuantityBtns();
  registerClickEventForAddToCartBtns(products);
}