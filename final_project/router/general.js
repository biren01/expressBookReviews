const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Registering new user:Task 6
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const getBooks = new Promise((resolve, reject) => {
      if (books){
         resolve(books);
      } else {
         reject(new Error('No books available'));
      }  
     });

    getBooks.then((bookList) => {
        res.status(200).json(bookList);
    })
    .catch((error) => {
        res.status(404).json({ message: error.message });
    }); 
 
  /* this is task 1
  return res.status(200).json({
    message: "List of Books", 
    data: books
});  

*/
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //let book = books[isbn];
   const getBook = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject(new Error('Book not found'));
        }
    });
    getBook.then((book) => {
        res.status(200).json(book);
    })
    .catch((error) => {
        res.status(404).json({ message: error.message });
    });
 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  //let booksByAuthor = [];
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const booksByAuthor = [];
    // Iterate over the books object to find matching authors
    for (const isbn in books) {
        if (Object.prototype.hasOwnProperty.call(books, isbn)) {
            if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                booksByAuthor.push(books[isbn]);
            }
        }
    }
    if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
    } else {
        reject(new Error(`No books found for author: ${author}`));
    }
});
getBooksByAuthor.then((books) => {
    res.status(200).json(books);
})
.catch((error) => {
    res.status(404).json({ message: error.message });
});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksByTitle = [];
  for (let  pages in books) {
    if (books[pages].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[pages]);
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).json({
      message: "Books with title: " + title,
      data: booksByTitle
    });
  } else {
    return res.status(404).json({message: "No books found with title: " + title});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review: Task 5
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    // Check if the reviews object has any entries
    if (Object.keys(book.reviews).length > 0) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({message: "There is no review of this Book"});
    }
  }
  // Handle case where ISBN doesn't exist in the database
  return res.status(404).json({message: "Book not found"});
 // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
