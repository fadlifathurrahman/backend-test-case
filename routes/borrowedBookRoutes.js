const express = require("express");
const router = express.Router();
const BorrowedBook = require("../models/borrowedBook.model");
const Book = require("../models/book.model");
const Member = require("../models/member.model");
const { Op } = require("sequelize");

/**
 * @swagger
 * /api/borrowedBooks:
 *   get:
 *     summary: Retrieve a list of borrowed books
 *     responses:
 *       200:
 *         description: A list of borrowed books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   member_id:
 *                     type: integer
 *                   book_id:
 *                     type: integer
 *                   borrowed_date:
 *                     type: string
 *                     format: date
 *                   return_date:
 *                     type: string
 *                     format: date
 *                   returnDate:
 *                     type: string
 *                     format: date
 */
router.get("/borrowedBooks", async (req, res) => {
  try {
    const borrowedBooks = await BorrowedBook.findAll({
      include: [{ model: Book }, { model: Member }],
    });
    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/borrowedBooks/{id}:
 *   get:
 *     summary: Retrieve a single borrowed book
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The borrowed book ID
 *     responses:
 *       200:
 *         description: A single borrowed book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 member_id:
 *                   type: integer
 *                 book_id:
 *                   type: integer
 *                 borrowed_date:
 *                   type: string
 *                   format: date
 *                 return_date:
 *                   type: string
 *                   format: date
 */
router.get("/borrowedBooks/:id", async (req, res) => {
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
});

/**
 * @swagger
 * /api/borrowedBooks:
 *   post:
 *     summary: Create a new borrowed book record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_id:
 *                 type: integer
 *               book_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: The created borrowed book record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 member_id:
 *                   type: integer
 *                 book_id:
 *                   type: integer
 */
router.post("/borrowedBooks", async (req, res) => {
  try {
    const { member_id, book_id } = req.body;

    // Check if the member exists
    const member = await Member.findByPk(member_id);
    if (!member) {
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

    res.status(201).json(borrowedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/borrowedBooks/{id}/return:
 *   put:
 *     summary: Return a borrowed book
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The borrowed book ID
 *     responses:
 *       200:
 *         description: The returned borrowed book record with penalty if any.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 member_id:
 *                   type: integer
 *                 book_id:
 *                   type: integer
 *                 borrowed_date:
 *                   type: string
 *                   format: date
 *                 return_date:
 *                   type: string
 *                   format: date
 *                 penalty:
 *                   type: number
 */
router.put("/borrowedBooks/:id/return", async (req, res) => {
  try {
    // // For pinalty test
    // const { return_date } = req.body;

    // // For actual implementation
    const return_date = new Date();
    const borrowedBook = await BorrowedBook.findByPk(req.params.id);

    if (borrowedBook.return_date) {
      return res.status(404).json({ error: "Book has been returned" });
    }

    if (!borrowedBook) {
      return res.status(404).json({ error: "Borrowed book not found" });
    }

    // Check if the book was returned late
    const borrowDate = new Date(borrowedBook.borrow_date);
    const actualReturnDate = new Date(return_date);
    let penalty = 0;

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

    res.json(borrowedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
