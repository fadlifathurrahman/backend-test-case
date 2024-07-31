const bookService = require("../services/bookService");


exports.getAllBooks = async (_req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
