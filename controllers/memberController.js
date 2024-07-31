const memberService = require("../services/memberService");

exports.getAllMembers = async (_req, res) => {
  try {
    const members = await memberService.getAllMembers();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
