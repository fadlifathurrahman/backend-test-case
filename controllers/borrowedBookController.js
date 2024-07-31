const BorrowedBook = require("../models/borrowedBook.model");
const Book = require("../models/book.model");
const Member = require("../models/member.model");
// const { Op } = require('sequelize');

// Function to borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { member_id, book_id } = req.body;

    // Check if the member exists or is deleted
    const member = await Member.findByPk(member_id);
    if (!member || member.deleted_at) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Check if the member is currently penalized
    if (member.penalty_end_date && member.penalty_end_date > new Date()) {
      return res.status(403).json({ message: "Member is currently penalized" });
    }

    // Check if the member has already borrowed 2 books
    const borrowedCount = await BorrowedBook.count({
      where: {
        member_id,
        returned: false,
      },
    });
    if (borrowedCount >= 2) {
      return res
        .status(403)
        .json({ message: "Member has already borrowed 2 books" });
    }

    // Check if the book is available
    const book = await Book.findByPk(book_id);
    if (!book || book.stock < 1) {
      return res.status(404).json({ message: "Book not available" });
    }

    // Create a new borrowed book record
    const borrowedBook = await BorrowedBook.create({
      member_id,
      book_id,
      borrow_date: new Date(),
    });

    // Decrease the book stock
    await book.update({ stock: book.stock - 1 });

    // Update the loan_book_amount of the member if the book is successfully borrowed
    await member.update(
      { loan_book_amount: (member.loan_book_amount += 1) },
      { where: { id: member_id } }
    );

    res.status(201).json(borrowedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to get all borrowed books
exports.getAllBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.findAll({
      include: [Book, Member],
      where: { returned: false },
    });
    res.status(200).json(borrowedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBorrowebBookById = async (req, res) => {
  try {
    const borrowedBook = await BorrowedBook.findByPk(req.params.id, {
      include: [{ model: Book }, { model: Member }],
    });
    if (borrowedBook) {
      res.json(borrowedBook);
    } else {
      res.status(404).json({ error: "Borrowed book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to return a borrowed book
exports.returnBook = async (req, res) => {
  try {
    // // For pinalty test
    // const { return_date } = req.body;

    // // For actual implementation
    const return_date = new Date();
    const borrowedBook = await BorrowedBook.findByPk(req.params.id);
    const member = await Member.findByPk(borrowedBook.member_id);

    // Check if the book is already returned
    if (borrowedBook.returned) {
      return res.status(400).json({ error: "Book already returned" });
    }

    // Check if the book exists
    if (!borrowedBook) {
      return res.status(404).json({ error: "Borrowed book not found" });
    }

    // Check if the book was returned late
    const borrowDate = new Date(borrowedBook.borrow_date);
    const actualReturnDate = new Date(return_date);
    console.log(actualReturnDate - borrowDate);

    // Check if the book was returned after more than 7 days
    const borrowDuration = Math.ceil(
      (actualReturnDate - borrowDate) / (1000 * 60 * 60 * 24)
    );
    if (borrowDuration > 7) {
      // Update penalty_end_date for 3 days after the return date
      const penaltyEndDate = new Date(actualReturnDate);
      penaltyEndDate.setDate(penaltyEndDate.getDate() + 3);
      await Member.update(
        { penalty_end_date: penaltyEndDate },
        { where: { id: borrowedBook.member_id } }
      );
    }

    // Update the borrowed book record
    await borrowedBook.update({
      return_date: actualReturnDate,
      returned: true,
    });

    // Increase the book stock
    const book = await Book.findByPk(borrowedBook.book_id);
    await book.update({ stock: book.stock + 1 });

    // Update the loan_book_amount of the member if the book is successfully borrowed
    await member.update(
      { loan_book_amount: (member.loan_book_amount -= 1) },
      { where: { id: member.member_id } }
    );

    res.status(200).json(borrowedBook);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
