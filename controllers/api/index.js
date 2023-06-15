const router = require('express').Router();

const userRoutes = require('./userRoutes');
const blogtRoutes = require('./blogRoutes');

router.use('/users', userRoutes);
router.use('/blog', blogtRoutes);

module.exports = router;
