//Call APi to get Products data
getProducts();

//Function get Products
async function getProducts() {
  try {
    var res = await axios({
      url: "https://6340d40ad1fcddf69cbe2698.mockapi.io/data",
      method: "GET",
    });
    renderProducts(res.data);
  } catch (err) {
    console.log(err);
  }
}

//Function add Products
async function addProduct() {
  //validate form
  var isFormValid = await validateForm();
  if (!isFormValid) return;

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const screen = document.getElementById("screen").value;
  const backCamera = document.getElementById("backCamera").value;
  const frontCamera = document.getElementById("frontCamera").value;
  const img = document.getElementById("img").value;
  const desc = document.getElementById("desc").value;
  const type = document.getElementById("type").value;

  const newProduct = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );

  await axios({
    url: "https://6340d40ad1fcddf69cbe2698.mockapi.io/data",
    method: "POST",
    data: newProduct,
  });
  //Close modal
  document.querySelector(".close").click();

  //render
  getProducts();

  //reset the form
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("screen").value = "";
  document.getElementById("backCamera").value = "";
  document.getElementById("frontCamera").value = "";
  document.getElementById("img").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("type").value = "";
}

//Function delete products
async function deleteProduct(id) {
  await axios({
    url: "https://6340d40ad1fcddf69cbe2698.mockapi.io/data/" + id,
    method: "DELETE",
  });
  getProducts();
}

//Update Product
//Function get one product info
async function getProduct(productId) {
  const res = await axios({
    url: "https://6340d40ad1fcddf69cbe2698.mockapi.io/data/" + productId,
    method: "GET",
  });

  //open the form
  document.getElementById("btnThemSanPham").click();

  //put data out on form
  document.getElementById("Id").value = res.data.id;
  document.getElementById("name").value = res.data.name;
  document.getElementById("price").value = res.data.price;
  document.getElementById("screen").value = res.data.screen;
  document.getElementById("backCamera").value = res.data.backCamera;
  document.getElementById("frontCamera").value = res.data.frontCamera;
  document.getElementById("img").value = res.data.img;
  document.getElementById("desc").value = res.data.desc;
  document.getElementById("type").value = res.data.type;

  //Hide add Product button, show update Product button
  document.getElementById("addProductBtn").style.display = "none";
  document.getElementById("updateProductBtn").style.display = "block";
}

//Function update Product
async function updateProduct() {
  //validate form
  var isFormValid = await validateForm();
  if (!isFormValid) return;

  //take new data
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const screen = document.getElementById("screen").value;
  const backCamera = document.getElementById("backCamera").value;
  const frontCamera = document.getElementById("frontCamera").value;
  const img = document.getElementById("img").value;
  const desc = document.getElementById("desc").value;
  const type = document.getElementById("type").value;
  const id = document.getElementById("Id").value;

  //create new product
  var newProduct = {
    name: name,
    price: price,
    screen: screen,
    backCamera: backCamera,
    frontCamera: frontCamera,
    img: img,
    desc: desc,
    type: type,
  };

  //post product to server
  await axios({
    url: "https://6340d40ad1fcddf69cbe2698.mockapi.io/data/" + id,
    method: "PUT",
    data: newProduct,
  });

  //Close modal
  document.querySelector(".close").click();

  //render
  getProducts();

  //reset the form
  document.getElementById("Id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("screen").value = "";
  document.getElementById("backCamera").value = "";
  document.getElementById("frontCamera").value = "";
  document.getElementById("img").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("type").value = "";

  //Hide add product button, show update product button
  document.getElementById("addProductBtn").style.display = "block";
  document.getElementById("updateProductBtn").style.display = "none";
}

//Render Products on screen
function renderProducts(arr) {
  let html = "";
  arr.forEach((item) => {
    html += `
    <tr><td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td><img src="${item.img}" alt="" width="200px" height="200px" /></td>
        <td>${item.desc}</td>
        <td>
        <button id="deleteBtn" class="btn btn-danger" onclick="deleteProduct(${item.id})">Xoá</button>
        <button id="updateBtn" class="btn btn-primary" onclick="getProduct(${item.id})">Cập Nhật</button>
        </td></tr>`;
  });
  document.getElementById("tblDanhSachSanPham").innerHTML = html;
}

//Close button
document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("tbName").style.display = "none";
  document.getElementById("tbPrice").style.display = "none";
  document.getElementById("tbScreen").style.display = "none";
  document.getElementById("tbBackCamera").style.display = "none";
  document.getElementById("tbFrontCamera").style.display = "none";
  document.getElementById("tbImg").style.display = "none";
  document.getElementById("tbDesc").style.display = "none";
  document.getElementById("tbType").style.display = "none";
});

//Function valiation
function required(value, spanId) {
  if (value.length === 0) {
    document.getElementById(spanId).style.display = "inline-block";
    document.getElementById(spanId).style.color = "red";
    document.getElementById(spanId).innerText = "Trường này bắt buộc nhập";
    return false;
  }
  document.getElementById(spanId).value = "";
  return true;
}

//Function check if existed
async function checkExisted(value, spanId) {
  var res = await axios({
    url: "https://6340d40ad1fcddf69cbe2698.mockapi.io/data/",
    method: "GET",
  });
  var data = res.data;
  for (var i = 0; i < data.length; i++) {
    if (data[i].name === value) {
      document.getElementById(spanId).style.display = "inline-block";
      document.getElementById(spanId).style.color = "red";
      document.getElementById(spanId).innerHTML = "Sản phẩm này đã tồn tại";
      return false;
    }
  }
  document.getElementById(spanId).value = "";
  document.getElementById(spanId).style.display = "none";
  return true;
}

//Check number
const checkNumber = (val, spanId) => {
  const pattern = /^[0-9]+$/g;
  if (!pattern.test(val)) {
    document.getElementById(spanId).style.display = "inline-block";
    document.getElementById(spanId).style.color = "red";
    document.getElementById(spanId).innerHTML = "Trường này bắt buộc nhập số";
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
};

//Check selected
function checkSelected(val, spanId) {
  if (val === "0") {
    document.getElementById(spanId).innerHTML = "*Vui lòng chọn một option";
    document.getElementById(spanId).style.display = "block";
    document.getElementById(spanId).style.color = "red";
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
}

//check Mo ta
function checkDesc(val, spanId) {
  const pattern = /^.{1,60}$/s;
  if (!pattern.test(val)) {
    document.getElementById(spanId).style.display = "inline-block";
    document.getElementById(spanId).style.color = "red";
    document.getElementById(spanId).innerHTML = "Mô tả không vượt quá 60 ký tự";
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
}

//Validate form
async function validateForm() {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const screen = document.getElementById("screen").value.trim();
  const backCamera = document.getElementById("backCamera").value.trim();
  const frontCamera = document.getElementById("frontCamera").value.trim();
  const img = document.getElementById("img").value;
  const desc = document.getElementById("desc").value;
  const type = document.getElementById("type").value;

  let isValid = true;
  isValid &= required(name, "tbName") && (await checkExisted(name, "tbName"));
  isValid &= required(price, "tbPrice") && checkNumber(price, "tbPrice");
  isValid &= required(screen, "tbScreen");
  isValid &= required(backCamera, "tbBackCamera");
  isValid &= required(frontCamera, "tbFrontCamera");
  isValid &= required(img, "tbImg");
  isValid &= required(desc, "tbDesc") && checkDesc(desc, "tbDesc");
  isValid &= checkSelected(type, "tbType");
  return isValid;
}
