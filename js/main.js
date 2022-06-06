const NOBOOK = "Нету книг в корзине";
WAY = "ASC";
CATEGORYID = 0;
SEARCH = "";

function setBalance(balance = 9999) {
  let span = document.getElementById("balance");
  span.innerHTML = "Ваш баланс : " + balance + " рублей";
}

function getBalance() {
  let span = document.getElementById("balance");
  return Number(span.innerHTML.split(" ").at(-2));
}

function getBooks(url, filters, callable = console.log) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ filters: filters }),
  })
    .then((response) => response.json())
    .then((data) => callable(data));
}

function addBook(book, bookId) {
  let schema = `                <img class="img" src="${book.coverUrl} " alt=''> \n
                    <div class="market-bord-item-info ">\n
                        <span>${book.name}</span>\n
                        <div class="market-bord-item-info-bottom">\n
                            <span>${book.price}руб.</span>\n
                           <button onclick="addBookToCart(${bookId})">В Корзину</button>\n
                        </div>\n
                   </div>\n`;
  let table = document.getElementById("books");
  let bookDiv = document.createElement("div");
  bookDiv.className = "market-bord-item ";
  bookDiv.id = "book_" + bookId;
  bookDiv.innerHTML = schema;
  table.append(bookDiv);
}

function addBooks(books) {
  if (books.length === 0) {
    addEmptyLabel();
  }
  for (let book in books) {
    addBook(books[book], book);
  }
}

function placeBooks() {
  clearBooks();
  getBooks("http://45.8.249.57/bookstore-api/books", getFilters(), addBooks);
}

function addEmptyLabel() {
  let table = document.getElementById("books");
  table.innerHTML = "<p>Нет подходящих книг</p>";
}

function addBookToCart(bookId) {
  changeCartBackCaption();
  if (document.getElementById("cart_book_" + bookId)) {
    modifyBookInCart(bookId);
    return;
  }
  let bookDiv = document.getElementById("book_" + bookId);
  let spans = bookDiv.getElementsByTagName("span");
  let name = spans[0].innerHTML;
  let price = spans[1].innerHTML;
  let schema = `

  <div class="basket">
    <div class="market-bord-item-info  ">
      <span class="name">${name}</span>
      <div class="counter">
      <span class="value">1 шт.</span>
      <div class="bute">
      <button onclick="modifyBookInCart(${bookId},-1)" > - </button >
      <button onclick="modifyBookInCart(${bookId})"> + </button>
      </div>
      </div>
      <span class="price price_cart">${price}</span>
    </div>
    <button onclick="deleteBookFromCart(${bookId})"><img src="./src/Cross.png" alt="cross"></button>
  </div>
`;

  let cart = document.getElementById("scroll");
  let newBookDiv = document.createElement("div");
  newBookDiv.className = "market-bord-item-right cart";
  newBookDiv.id = "cart_book_" + bookId;
  newBookDiv.innerHTML = schema;
  cart.append(newBookDiv);
  sumBooks();
}

function modifyBookInCart(bookId, diff = 1) {
  diff = Number(diff);
  let book = document.getElementById("cart_book_" + bookId);
  let amount = book.getElementsByClassName("value")[0];
  let amountValue = Number(amount.innerHTML.slice(0, -3));
  let price = book.getElementsByClassName("price")[0];
  let priceValue = Number(price.innerHTML.slice(0, -4));
  priceValue = (priceValue / amountValue) * (amountValue + diff);
  amountValue = amountValue + diff;
  if (amountValue < 1) {
    deleteBookFromCart(bookId);
    return;
  }
  price.innerHTML = priceValue + " руб.";
  amount.innerHTML = amountValue + " шт.";
  sumBooks();
}

function deleteBookFromCart(bookId) {
  let book = document.getElementById("cart_book_" + bookId);
  book.remove();
  if (document.getElementsByClassName("cart").length === 0) {
    changeCartBackCaption(NOBOOK);
  }
  sumBooks();
}

function changeCartBackCaption(caption = "") {
  let captionP = document.getElementById("noBook");
  captionP.innerHTML = caption;
}

function sumBooks() {
  let sumPrice = 0;
  let books = document.getElementsByClassName("basket");
  for (let book of books) {
    let price = book.getElementsByClassName("price")[0];
    sumPrice += Number(price.innerHTML.slice(0, -4));
  }
  let totalPrice = document.getElementById("totalPrice");
  let buySection = document.getElementsByClassName("buy")[0];
  if (sumPrice === 0) {
    buySection.style.visibility = "hidden";
  } else {
    buySection.style.visibility = "visible";
  }
  totalPrice.innerHTML = sumPrice + " руб.";
}

function buy() {
  let balance = getBalance();
  let totalPrice = document.getElementById("totalPrice");
  totalPrice = Number(totalPrice.innerHTML.slice(0, -4));
  let diff = balance - totalPrice;
  if (diff < 0) {
    alert("На счету не достаточно средств");
    return;
  }
  let cart = document.getElementById("scroll");
  cart.innerHTML = "";
  setBalance(diff);
  sumBooks();
}

function clearBooks() {
  let table = document.getElementById("books");
  table.innerHTML = "";
}

function sortByPrice() {
  if (window.WAY === "ASC") {
    window.WAY = "DESC";
  } else {
    window.WAY = "ASC";
  }
  placeBooks();
}

function getBooksByCategory(value) {
  if (value > 0) {
    window.CATEGORYID = value;
  } else {
    window.CATEGORYID = 0;
  }
  placeBooks();
}

function searchText(value) {
  window.SEARCH = value;
  placeBooks();
}

function getFilters() {
  let filters = {};
  filters.sortPrice = WAY;
  if (CATEGORYID > 0) {
    filters.categoryId = CATEGORYID;
  }
  if (SEARCH.length > 0) {
    filters.search = SEARCH;
  }
  return filters;
}

function getCategories() {
  let url = "http://45.8.249.57/bookstore-api/books/categories";
  fetch(url, {
    method: "GET",
  })
    .then((response) => response.text())
    .then((text) => addCategories(text));
}

function addCategories(categories) {
  categories = JSON.parse(categories);
  let catSelect = document.getElementById("category");
  for (let category of categories) {
    catSelect.options[catSelect.options.length] = new Option(
      category.name,
      category.id
    );
  }
}

function main() {
  setBalance();
  getCategories();
  placeBooks();
}

window.onload = main;
