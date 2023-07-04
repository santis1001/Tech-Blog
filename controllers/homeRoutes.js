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
          attributes: ['id','name'],
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
      blogs: [ ...blogs.reverse() ],
      maintitle: "The Tech Blog",
      logged_in: (req.session.logged_in) ? true : false,
      name: (req.session.user_name) ? req.session.user_name : 'none'
    };

    data.blogs.map(blog => {
      if (blog.user.id === req.session.user_id) {
        blog.user.name = 'You';
      }
      return blog;
    });
    
    
    console.log(data);

    res.render('blog', data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  const data = {
    maintitle: "Log In"
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
    maintitle: "Register"
  }
  res.render('register', data);
});

router.get('/dashboard', withAuth, async (req, res) => {
  try {
    let userid = req.session.user_id;
    if (userid) {
      const myData = await User.findByPk(userid, {
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

      const data = {
        userData: { ...userData },
        maintitle: "Dashboard"
      };
      console.log(userData);


      res.render('homepage', data);
    } else {
      const data = {
        maintitle: "Log In"
      }
      res.render('login', data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/blog/:id', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'name'],
            }
          ]
        },
      ]
    });

    const blog = blogData.get({ plain: true });
    const data = {
      ...blog,
      maintitle: "The Tech Blog",
      logged_in: (req.session.logged_in) ? true : false,
    };
    console.log(data.comments[0]);

    data.comments.map(comment => {
      if (comment.user.id === req.session.user_id) {
        comment.user.name = 'You';
      }
      return comment;
    });

    res.render('myblog', data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
