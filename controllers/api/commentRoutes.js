const router = require('express').Router();
const { Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.put('/:id', withAuth, async (req, res) => {
    try {
        const updateComment = await Comment.update(
            req.body,
            {
                where: {
                    id: req.params.id,
                    user_id: req.session.user_id,
                }
            },
        );
        if (!updateComment) {
            res.status(404).json({ message: 'No Blog found with this id!' });
            return;
        }
        res.status(200).json(updateComment);
    } catch (err) {
        res.status(400).json(err);
    }
});
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const updateComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!updateComment) {
            res.status(404).json({ message: 'No Blog found with this id!' });
            return;
        }

        res.status(200).json(updateComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
