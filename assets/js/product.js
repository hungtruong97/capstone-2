class Product {
  constructor(name, price, screen, backCamera, frontCamera, img, desc, type) {
    this.name = name;
    this.price = price;
    this.screen = screen;
    this.backCamera = backCamera;
    this.frontCamera = frontCamera;
    this.img = img;
    this.desc = desc;
    this.type = type;
  }

  render() {
    return `
            <div class="card product pt-3" style="width: 18rem;">
                <img src="${this.img}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${this.name}</h5>
                    <p class="card-text">${this.desc}</p>
                    <p class="card-text">Màn hình:${this.screen}</p>
                    <p class="card-text">Camera trước:${this.frontCamera}</p>
                    <p class="card-text">Camera sau: ${this.backCamera}</p>
                      <div class="d-flex mb-3 align-items-center">
                        <button class="btn-qty btn-sub btn btn-primary me-2"><</i></button>
                        <p class="qty m-0" id="qty">1</p>
                        <button class="btn-qty btn-add btn btn-primary ms-2">></i></button>
                      </div>
                    <a href="#" class="btn btn-primary add-btn" id="btnAddToCart">Add to cart</a>
                </div>
            </div>
    `;
  }
}
