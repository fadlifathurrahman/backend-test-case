const Book = require("../models/book.model");

exports.getAllBooks = async () => {
    return await Book.findAll();
};