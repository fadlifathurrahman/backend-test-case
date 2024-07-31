const express = require("express");
const router = express.Router();
const BorrowedBook = require("../models/borrowedBook.model");
const Book = require("../models/book.model");
const Member = require("../models/member.model");
const borrowedBookController = require("../controllers/borrowedBookController");
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
router.get("/borrowedBooks", borrowedBookController.getAllBorrowedBooks);

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
router.get("/borrowedBooks/:id", borrowedBookController.getBorrowebBookById);

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
router.post("/borrowedBooks", borrowedBookController.borrowBook);

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
router.put("/borrowedBooks/:id/return", borrowedBookController.returnBook);

module.exports = router;
