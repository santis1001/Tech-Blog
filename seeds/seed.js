const sequelize = require('../config/connection');
const { User, Blog, Comment } = require('../models');

const userData = require('./UserData.json');
const blogData = require('./BlogData.json');
const commentData = require('./CommentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });


  for (const blog of blogData) {
    await Blog.create({
      ...blog,
      'user_id': users[Math.floor(Math.random() * users.length)].id,
    });

  }
  const comments = await Comment.bulkCreate(commentData);

  process.exit(0);
};

seedDatabase();
