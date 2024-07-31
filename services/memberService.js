const Member = require("../models/member.model");

exports.getAllMembers = async () => {
    return await Member.findAll();
}