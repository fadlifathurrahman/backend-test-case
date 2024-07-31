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
router.get('/', memberController.getAllMembers);


// Add member
/**
 * @swagger
 * /api/members/add-member:
 *   post:
 *     summary: Add a member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: A member has been added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 penalty_end_date:
 *                   type: string
 */
router.post('/add-member', memberController.addMember);

// Delete member
/**
 * @swagger
 * /api/members/{id}/delete-member:
 *   delete:
 *     summary: Delete a member by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The member ID
 *     responses:
 *       204:
 *         description: The member has been deleted.
 */
router.delete('/:id/delete-member', memberController.deleteMember);

// Update member
/**
 * @swagger
 * /api/members/{id}/update-member:
 *   put:
 *     summary: Update a member by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: The member has been updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 penalty_end_date:
 *                   type: string
 */
router.put('/:id/update-member', memberController.updateMember);

module.exports = router;
