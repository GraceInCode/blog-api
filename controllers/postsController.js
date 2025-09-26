const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllPosts = async (req, res) => {
    const { search } = req.query;
    const where = { published: true };
    if (search) where.title = { contains: search, mode: 'insensitive' };
    try {
        const posts = await prisma.post.findMany({
            where,
            include: { author: { select: { username: true } },  comments: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
};

exports.getPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        
        // Validate that the ID is a valid number
        if (isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: { author: { select: { username: true } }, comments: true }
        });
        
        if (!post || (!post.published && (!req.user || post.authorId !== req.user.id))) {
            return res.status(404).json({ error: 'Post not found' }); // Hide existence of unpublished posts
        }
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        if (!['user', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions to create posts' });
        }
        if (!req.body.title || !req.body.content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }
        const post = await prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                author: { connect: { id: req.user.id } },
                published: false
            }
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        if (!req.body.title && !req.body.content) {
            return res.status(400).json({ error: 'At least title or content is required' });
        }
        const existingPost = await prisma.post.findUnique({ where: { id: Number(req.params.id) } });
        if (!existingPost) return res.status(404).json({ error: 'Post not found' });
        if (existingPost.authorId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const post = await prisma.post.update({
            where: { id: Number(req.params.id) },
            data: {
                title: req.body.title || existingPost.title,
                content: req.body.content || existingPost.content
            }
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const existingPost = await prisma.post.findUnique({ where: { id: Number(req.params.id) } });
        if (!existingPost) return res.status(404).json({ error: 'Post not found' });
        if (existingPost.authorId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
        const post = await prisma.post.delete({
            where: { id: Number(req.params.id) } });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

exports.getAllPostsAdmin = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        // Get ALL posts (published and unpublished) - no where clause
        const posts = await prisma.post.findMany({
            include: { author: { select: { username: true } }, comments: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { authorId: req.user.id },
            include: { author: { select: { username: true } }, comments: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.togglePublish = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({ where: { id: Number(req.params.id) } });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (post.authorId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
        const updated = await prisma.post.update({
            where: { id: post.id },
            data: { published: !post.published }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};