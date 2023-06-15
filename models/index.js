const User = require('./User');
const Blog = require('./Blog');
const Comment = require('./Comment');

User.hasMany(Blog, {
  foreignKey: 'author',
  onDelete: 'CASCADE'
});

User.hasMany(Comment, {
  foreignKey: 'commenter',
  onDelete: 'CASCADE'
});

Blog.belongsTo(User, {
  foreignKey: 'author'
});

Comment.belongsTo(Blog, {
  foreignKey: 'blog_id'
});

Blog.hasMany(Comment, {
  foreignKey: 'blog_id',
  onDelete: 'CASCADE'
});

module.exports = { User, Blog, Comment };
