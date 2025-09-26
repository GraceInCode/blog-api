const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            include: { user: { select: { username: true } }, post: true  }
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCommentById = async (req, res) => {
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: Number(req.params.id) }
        });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
  try {
    if (!req.body.content) return res.status(400).json({ error: 'Content is required' });
    const data = {
      content: req.body.content,
      post: { connect: { id: Number(req.params.id) } }, 
      username: req.body.username || null, 
      email: req.body.email || null
    };
    if (req.user && req.user.id) data.user = { connect: { id: req.user.id } }; 
    const comment = await prisma.comment.create({ data });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateComment = async (req, res) => {
    try {
        if (!req.body.content) return res.status(400).json({ error: 'Content is required' });
        const existingComment = await prisma.comment.findUnique({ where: { id: Number(req.params.id) } });
        if (!existingComment) return res.status(404).json({ error: 'Comment not found' });
        if (req.user.role !== 'admin' && (existingComment.userId && existingComment.userId !== req.user.id)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const comment = await prisma.comment.update({
            where: { id: Number(req.params.id) },
            data: { content: req.body.content }
        });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }    
};


exports.deleteComment = async (req, res) => {
    try {
        const existingComment = await prisma.comment.findUnique({ where: { id: Number(req.params.id) } });
        if (!existingComment) return res.status(404).json({ error: 'Comment not found' });
        if (req.user.role !== 'admin' && (existingComment.userId && existingComment.userId !== req.user.id)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const comment = await prisma.comment.delete({ where: { id: Number(req.params.id) } });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
