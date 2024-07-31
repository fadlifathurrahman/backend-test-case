const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require('../config/db.config');
const Book = require('./book.model');
const Member = require('./member.model');

const BorrowedBook = sequelize.define(
  'borrowed_books', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  member_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Member,
      key: 'id',
    },
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book,
      key: 'id',
    },
  },
  borrow_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  return_date: {
    type: DataTypes.DATE,
    setNullable: true,
    defaultValue: null,
  },
  returned:{
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  timestamps: false,
});

BorrowedBook.belongsTo(Member, { foreignKey: 'member_id' });
BorrowedBook.belongsTo(Book, { foreignKey: 'book_id' });

module.exports = BorrowedBook;