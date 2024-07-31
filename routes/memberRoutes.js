const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Retrieve a list of members
 *     responses:
 *       200:
 *         description: A list of members.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   penalty_end_date:
 *                     type: string
 */
router.get('/members', memberController.getAllMembers);

module.exports = router;
