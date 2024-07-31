const BorrowedBook = require('../models/borrowedBook.model');
const Book = require('../models/book.model');
const Member = require('../models/member.model');
// const { Op } = require('sequelize');

// Function to borrow a book
exports.borrowBook = async (req, res) => {
    try {
        const { member_id, book_id } = req.body;

        // Check if the member exists and is not penalized
        const member = await Member.findByPk(member_id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        if (member.penalty_end_date && member.penalty_end_date > new Date()) {
            return res.status(403).json({ message: 'Member is penalized' });
        }

        // Check if the book is available
        const book = await Book.findByPk(book_id);
        if (!book || book.stock < 1) {
            return res.status(404).json({ message: 'Book not available' });
        }

        // Check if the member has already borrowed a book
        const borrowedCount = await BorrowedBook.count({
            where: {
                member_id,
                returned: false
            }
        });
        if (borrowedCount >= 1) {
            return res.status(403).json({ message: 'Member has already borrowed a book' });
        }

        // Borrow the book
        const borrowedBook = await BorrowedBook.create({
            member_id,
            book_id,
            borrow_date: new Date(),
        });

        // Decrease the stock of the book
        book.stock -= 1;
        await book.save();

        res.status(201).json(borrowedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 

// Function to return a book
exports.returnBook = async (req, res) => {
    try {
        const { borrowedBookId } = req.params;

        const borrowedBook = await BorrowedBook.findByPk(borrowedBookId);
        if (!borrowedBook || borrowedBook.returned) {
            return res.status(404).json({ message: 'Borrowed book record not found or already returned' });
        }

        // Mark the book as returned
        borrowedBook.returned = true;
        borrowedBook.returnDate = new Date();
        await borrowedBook.save();

        // Increase the stock of the book
        const book = await Book.findByPk(borrowedBook.book_id);
        book.stock += 1;
        await book.save();

        // Check if the book was returned late
        const borrowDuration = (new Date() - new Date(borrowedBook.borrow_date)) / (1000 * 60 * 60 * 24);
        if (borrowDuration > 7) {
            // Apply penalty
            const penalty_end_date = new Date();
            penalty_end_date.setDate(penalty_end_date.getDate() + 3);
            await Member.update({ penalty_end_date }, { where: { id: borrowedBook.member_id } });
            res.status(200).json({ message: 'Book returned late, penalty applied' });
        } else {
            res.status(200).json({ message: 'Book returned successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to get all borrowed books
exports.getAllBorrowedBooks = async (req, res) => {
    try {
        const borrowedBooks = await BorrowedBook.findAll({
            include: [Book, Member],
            where: { returned: false }
        });
        res.status(200).json(borrowedBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
