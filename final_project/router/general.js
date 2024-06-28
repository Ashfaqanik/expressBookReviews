const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const app = express();

app.use(express.json());

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// // Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books, null, 4));
// });

// Using Async-Await with Axios
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch books" });
  }
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
// });

// Using Async-Await with Axios
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).send({ error: "Book not found" });
  }
});

// // Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   // Finding book whose author matches the extracted author parameter
//   const keys = Object.keys(books);
//   const booksByAuthor = keys
//     .map((key) => books[key])
//     .filter((book) => book.author === author);
//   res.send(booksByAuthor);
// });

// Using Promise callbacks with Axios
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  let getBooksByAuthor = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const booksByAuthor = keys
      .map((key) => books[key])
      .filter((book) => book.author === author);

    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject({ error: "Books not found for author" });
    }
  });

  getBooksByAuthor
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

// // Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   //Write your code here
//   const title = req.params.title;

//   const keys = Object.keys(books);
//   const booksByTitle = keys
//     .map((key) => books[key])
//     .filter((book) => book.title === title);
//   res.send(booksByTitle);
// });

// Using Promise callbacks with Axios
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  let getBooksByTitle = new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    const booksByTitle = keys
      .map((key) => books[key])
      .filter((book) => book.title === title);

    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject({ error: "Books not found for title" });
    }
  });

  getBooksByTitle
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const reviews = books[isbn].reviews;
  res.send(reviews);
});

module.exports.general = public_users;
