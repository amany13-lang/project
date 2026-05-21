const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); 


public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => {
            return new Promise((resolve) => {
                setTimeout(() => resolve(books), 100);
            });
        };
        const allBooks = await getBooks();
        return res.status(200).json(allBooks);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});


public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    const findByIsbn = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: "Book not found with this ISBN" });
        }
    });

    findByIsbn
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});
  

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    
    const findByAuthor = new Promise((resolve, reject) => {
        let filteredBooks = {};
        const keys = Object.keys(books);
        
        keys.forEach(key => {
            if (books[key].author.toLowerCase() === author) {
                filteredBooks[key] = books[key];
            }
        });

        if (Object.keys(filteredBooks).length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ status: 404, message: "No books found for this author" });
        }
    });

    findByAuthor
        .then((booksList) => res.status(200).json(booksList))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});


public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();

    const findByTitle = new Promise((resolve, reject) => {
        let filteredBooks = {};
        const keys = Object.keys(books);

        keys.forEach(key => {
            if (books[key].title.toLowerCase() === title) {
                filteredBooks[key] = books[key];
            }
        });

        if (Object.keys(filteredBooks).length > 0) {
            resolve(filteredBooks);
        } else {
            reject({ status: 404, message: "No books found with this title" });
        }
    });

    findByTitle
        .then((booksList) => res.status(200).json(booksList))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});


public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username": username, "password": password});
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });    
        }
    } 
    return res.status(404).json({ message: "Unable to register user. Provide username and password." });
});

module.exports.general = public_users;
