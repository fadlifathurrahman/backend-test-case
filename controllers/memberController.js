const Member = require("../models/member.model");
const BorrowedBook = require("../models/borrowedBook.model");
const memberService = require("../services/memberService");
const { Op, Sequelize } = require("sequelize");

exports.getAllMembers = async (_req, res) => {
  try {
    const members = await memberService.getAllMembers();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { code, name } = req.body;

    // Check if the code is already taken
    const existingMemberCode = await Member.findOne({
      where: { code, deleted_at: null },
    });

    // Check if the code is already taken
    if (existingMemberCode) {
      return res.status(400).json({ message: "Code is already taken" });
    }

    // Create the new member
    const newMember = await Member.create({ code, name });
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByPk(id);

    // Check if the member is currently borrowing any books
    const borrowedBooks = await BorrowedBook.count({
      where: {
        member_id: id,
        returned: false,
      },
    });

    if (borrowedBooks > 0) {
      return res
        .status(403)
        .json({ message: "Member is currently borrowing books" });
    }

    // Check if the member exists and its deleted_at is null
    if (!member || member.deleted_at) {
      return res
        .status(404)
        .json({ message: "Member not found or already deleted" });
    }

    // Delete the member
    const [deletedMember] = await Member.update(
      {
        code: "deleted",
        name: "deleted",
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
    if (deletedMember) {
      return res.status(200).json({ message: "Member has been deleted" });
    } else {
      return res
        .status(500)
        .json({ message: "Member not found or already deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name } = req.body;

    // Check if the member exists and its deleted_at is null
    const member = await Member.findByPk(id);
    if (!member || member.deleted_at) {
      return res
        .status(404)
        .json({ message: "Member not found or already deleted" });
    }

    // Check if the code is already taken
    const existingMemberCode = await Member.findOne({
      where: { code, deleted_at: null },
    });

    // Check if the code is already taken
    if (existingMemberCode && existingMemberCode.id !== id) {
      return res.status(400).json({ message: "Code is already taken" });
    }

    // Update the member
    const [updated] = await Member.update(
      { code, name, updated_at: new Date() },
      { where: { id } }
    );

    if (updated) {
      const updatedMember = await Member.findByPk(id);
      return res
        .status(200)
        .json({ updatedMember, message: "Member has been updated" });
    } else {
      return res
        .status(500)
        .json({ message: "Member not found or already deleted" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
