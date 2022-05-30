function setBalance() {
  let balance = "9999";
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

function addBook(book) {
  let schema =
    `                <img class="img" src="${book.coverUrl} " alt=''> \n` +
    `                <div class="market-bord-item-info ">\n` +
    `                    <span>${book.name}</span>\n` +
    `                    <div class="market-bord-item-info-bottom">\n` +
    `                        <span>${book.price}руб.</span>\n` +
    `                       <button>В Корзину</button>\n` +
    `                    </div>\n` +
    `               </div>\n`;
  let table = document.getElementById("books");
  let bookDiv = document.createElement("div");
  bookDiv.className = "market-bord-item ";
  bookDiv.innerHTML = schema;
  table.append(bookDiv);
}

function addBooks(books) {
  let book;
  for (book of books) {
    addBook(book);
  }
}

function main() {
  setBalance();
  getBooks("http://45.8.249.57/bookstore-api/books", {}, addBooks);
}

window.onload = main;
