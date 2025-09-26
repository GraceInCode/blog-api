const express = require('express');
const passport = require('passport');
const { getAllPosts, getPostById, createPost, updatePost, deletePost, togglePublish, getAllPostsAdmin, getMyPosts } = require('../controllers/postsController'); // Removed createComment
const { createComment } = require('../controllers/commentsController'); // Added this

const router = express.Router();

// Optional auth middleware
const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    req.user = user || null; // Set user if valid token, else null
    next();
  })(req, res, next);
};

router.get('/', getAllPosts); // Get all posts
router.get('/all', passport.authenticate('jwt', { session: false }), getAllPostsAdmin); // Get all posts for admin
router.get('/my', passport.authenticate('jwt', { session: false }), getMyPosts); // Get my posts
router.get('/:id', getPostById); // Get post by ID
router.post('/:id/comments', optionalAuth, createComment); // Removed auth to allow anon; add back if needed: passport.authenticate('jwt', { session: false }),

// Protected routes
router.post('/', passport.authenticate('jwt', { session: false }), createPost); // Create a new post
router.put('/:id', passport.authenticate('jwt', { session: false }), updatePost); // Update a post
router.delete('/:id', passport.authenticate('jwt', { session: false }), deletePost); // Delete a post
router.put('/:id/publish', passport.authenticate('jwt', { session: false }), togglePublish); // Publish or unpublish a post

module.exports = router;