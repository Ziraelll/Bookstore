function setBalance(balance = 9999) {
  let span = document.getElementById("balance");
  span.innerHTML = "Ваш баланс : " + balance + " рублей";
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
  let schema =
    `                <img class="img" src="${book.coverUrl} " alt=''> \n` +
    `                <div class="market-bord-item-info ">\n` +
    `                    <span>${book.name}</span>\n` +
    `                    <div class="market-bord-item-info-bottom">\n` +
    `                        <span>${book.price}руб.</span>\n` +
    `                       <button onclick="addBookToCart(${bookId})">В Корзину</button>\n` +
    `                    </div>\n` +
    `               </div>\n`;
  let table = document.getElementById("books");
  let bookDiv = document.createElement("div");
  bookDiv.className = "market-bord-item ";
  bookDiv.id = "book_" + bookId;
  bookDiv.innerHTML = schema;
  table.append(bookDiv);
}

function addBooks(books) {
  for (let book in books) {
    addBook(books[book], book);
  }
}

function addBookToCart(bookId) {
  if (document.getElementById("cart_book_" + bookId)) {
    modifyBookInCart(bookId);
    return;
  }
  let bookDiv = document.getElementById("book_" + bookId);
  let spans = bookDiv.getElementsByTagName("span");
  let name = spans[0].innerHTML;
  let price = spans[1].innerHTML;
  let schema = `
  <div class=" basket  ">
    <div class="market-bord-item-info  ">
      <span class="name">${name}</span>
      <span class="value">1шт.</span>
      <span class="price">${price}</span>
    </div>
    <button onclick="deleteBookFromCart(${bookId})"><img src="./src/Cross.png" alt="cross"></button>
  </div>`;

  let cart = document.getElementById("cart");
  let newBookDiv = document.createElement("div");
  newBookDiv.className = "market-bord-item ";
  newBookDiv.id = "cart_book_" + bookId;
  newBookDiv.innerHTML = schema;
  cart.append(newBookDiv);
}

function modifyBookInCart(bookId, diff = 1) {
  let book = document.getElementById("cart_book_" + bookId);
  let amount = book.getElementsByClassName("value")[0];
  let amountValue = amount.innerHTML.slice(0, -3);
  amountValue = Number(amountValue) + diff;
  if (amountValue < 1) {
    deleteBookFromCart(bookId);
    return;
  }
  amount.innerHTML = amountValue + "шт.";
}

function deleteBookFromCart(bookId) {
  let book = document.getElementById("cart_book_" + bookId);
  book.remove();
}

function main() {
  setBalance();
  getBooks("http://45.8.249.57/bookstore-api/books", {}, addBooks);
}

window.onload = main;

// <button><img src="src/Cross.png" alt="cross"></button>
// <div className=" basket  ">
//   <div className="market-bord-item-info  ">
//     <span id="name">Название книги</span>
//     <span id="value">1шт.</span>
//     <span id="price">1321руб.</span>
//   </div>
// </div>
