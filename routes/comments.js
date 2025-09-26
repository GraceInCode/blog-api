const express = require('express');
const passport = require('passport');
const { getAllComments, getCommentById, updateComment, deleteComment } = require('../controllers/commentsController');

const router = express.Router();

router.get('/', getAllComments); // Get all comments
router.get('/:id', getCommentById); // Get comment by ID

// Protected routes 
router.put('/:id', passport.authenticate('jwt', { session: false }), updateComment); // Update a comment
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteComment); // Delete a comment


module.exports = router;