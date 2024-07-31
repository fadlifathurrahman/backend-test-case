const BorrowedBook = require("../models/borrowedBook.model");

exports.getAllBorrowedBooks = async () => {
    return await BorrowedBook.findAll();
}