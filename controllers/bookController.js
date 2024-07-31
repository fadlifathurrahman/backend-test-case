const Book = require("../models/book.model");
const { Op } = require("sequelize");

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: {
        deleted_at: null,
      },
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new book
exports.addBook = async (req, res) => {
  try {
    const { code, title, author } = req.body;

    // Check if the code is already taken
    const existingBookCode = await Book.findOne({
      where: {
        code,
        deleted_at: null,
      },
    });
    if (existingBookCode) {
      return res.status(400).json({ message: "Code is already taken" });
    }

    // Check if the title is already taken
    const existingBookTitle = await Book.findOne({
      where: {
        title,
        deleted_at: null,
      },
    });
    if (existingBookTitle) {
      return res.status(400).json({ message: "Title is already taken" });
    }

    // Create the new book
    const newBook = await Book.create({ code, title, author, stock: 1 });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, title, author, stock } = req.body;

    // Check if the book exists and its deleted_at is null
    const book = await Book.findByPk(id, { attributes: ["id", "deleted_at"] });
    if (!book || book.deleted_at) {
      return res
        .status(404)
        .json({ message: "Book not found or already deleted" });
    }

    // Check if the code is already taken
    const existingBookCode = await Book.findOne({
      where: {
        code,
        deleted_at: null,
      },
    });
    if (existingBookCode) {
      return res.status(400).json({ message: "Code is already taken" });
    }

    // Check if the title is already taken
    const existingBookTitle = await Book.findOne({
      where: {
        title,
        deleted_at: null,
      },
    });
    if (existingBookTitle) {
      return res.status(400).json({ message: "Title is already taken" });
    }

    // Update the book
    const [updated] = await Book.update(
      { code, title, author, stock, updated_at: new Date() },
      {
        where: { id },
      }
    );
    
    if (updated) {
      const updatedBook = await Book.findByPk(id);
      res.status(200).json({updatedBook, message: "Book has been updated"});
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the book exists
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const [deleted] = await Book.update(
      {
        title: "deleted",
        code: "deleted-book",
        author: "deleted",
        deleted_at: new Date(),
      },
      {
        where: {
          id,
          deleted_at: {
            [Op.is]: null,
          },
        },
      }
    );

    if (deleted) {
      res.status(200).json({ message: "Book has been marked as deleted" });
    } else {
      res.status(404).json({ message: "Book not found or already deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
