const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all blogs and JOIN with user data
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment
        },
      ]
    });

    // Serialize data so the template can read it
    const blogs = blogData.map((blog) => blog.get({ plain: true }));
    // Pass serialized data and session flag into template
    const data = {
      blogs: { ...blogs },
      title: "The Tech Blog"
    };
    

    res.render('blog', data);
  } catch (err) {
    res.status(500).json(err);
  }
});



// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  const data = {
    title: "Log In"
  }
  res.render('login', data);
});

router.get('/register', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  const data = {
    title: "Register"
  }
  res.render('register', data);
});

router.get('/dashboard', async (req, res) => {
  try {

    const myData = await User.findByPk('3', {
      attributes: ['name'],
      include: [
        {
          model: Blog,
          include: [
            {
              model: Comment
            }
          ]
        },
      ]
    });

    const userData = myData.get({ plain: true });

    console.log(userData);
    const data = {
      userData: { ...userData },
      title: "Dashboard"
    };


    res.render('homepage', data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
