# Tech-Blog
14 Challenge
## Decription


## User Story

```md
AS A developer who writes about tech
I WANT a CMS-style blog site
SO THAT I can publish articles, blog posts, and my thoughts and opinions
```

## Acceptance Criteria

```md
GIVEN a CMS-style blog site
WHEN I visit the site for the first time
THEN I am presented with the homepage, which includes existing blog posts if any have been posted; navigation links for the homepage and the dashboard; and the option to log in
WHEN I click on the homepage option
THEN I am taken to the homepage
WHEN I click on any other links in the navigation
THEN I am prompted to either sign up or sign in
WHEN I choose to sign up
THEN I am prompted to create a username and password
WHEN I click on the sign-up button
THEN my user credentials are saved and I am logged into the site
WHEN I revisit the site at a later time and choose to sign in
THEN I am prompted to enter my username and password
WHEN I am signed in to the site
THEN I see navigation links for the homepage, the dashboard, and the option to log out
WHEN I click on the homepage option in the navigation
THEN I am taken to the homepage and presented with existing blog posts that include the post title and the date created
WHEN I click on an existing blog post
THEN I am presented with the post title, contents, post creator’s username, and date created for that post and have the option to leave a comment
WHEN I enter a comment and click on the submit button while signed in
THEN the comment is saved and the post is updated to display the comment, the comment creator’s username, and the date created
WHEN I click on the dashboard option in the navigation
THEN I am taken to the dashboard and presented with any blog posts I have already created and the option to add a new blog post
WHEN I click on the button to add a new blog post
THEN I am prompted to enter both a title and contents for my blog post
WHEN I click on the button to create a new blog post
THEN the title and contents of my post are saved and I am taken back to an updated dashboard with my new blog post
WHEN I click on one of my existing posts in the dashboard
THEN I am able to delete or update my post and taken back to an updated dashboard
WHEN I click on the logout option in the navigation
THEN I am signed out of the site
WHEN I am idle on the site for more than a set time
THEN I am able to view posts and comments but I am prompted to log in again before I can add, update, or delete posts
```

## Usage

### Set up project

```
npm init -y
```

Install dependencies
```
npm i bcrypt connect-session-sequelize dotenv express express-handlebars express-session mysql2 nodemon sequelize
```

Or
```
npm i
```

Fill database with mock data (Optional)
```
npm run seed
```

Run the app
```
npm start
```

### Set up the Database
```
SOURCE ./db/schema.sql;
```

### Diagram
```
server.js
├─ public
│   ├─ CSS
│   │   ├─ style.css
│   │   |       └─ custom style for colors, size and format
│   │   └─ Bootstrap.css
│   └─ JS
│       ├─ homepage.js
|       |       └─ Adds Eventlistener to cards
│       ├─ login.js
|       |       └─ Handle the login and signup events
│       ├─ logout.js
|       |       └─ Sends the server a logout request
│       └─ myblog.js
|       |       ├─ Handle the Edit and Delete of a blog
|       |       ├─ This is only called when a blog is your only
|       |       └─ Sends the request to the server
│       └─ post.js
|              ├─ Handles the event to post a blog or comment
|              ├─ Script only called when logged in
|              └─ Sends the server a comment or blog post
├─ homeRoutes
│   ├─ route('/')
│   │   ├─ check if user logged in
│   │   ├─ Get list of all blogs and their comments
│   │   ├─ format data that will be passed to the view handlebars
│   │   └─ View main screen which shows a list of blogs
│   │           └─ if logged in a card form will appear to 
│   │              create new blog
│   ├─ route('/login')
│   │   ├─ check if user logged in
|   |   |      └─ if its logged in it redirects to path ('/')
│   │   └─ renders the log in view
│   ├─ route('/dashboard')
│   │   ├─ check if user logged in
|   |   |      ├─ not logged in user will be prompt to log in
|   |   |      └─ view only available to logged in users
│   │   ├─ Gets list of all blogs of the user
│   │   └─ Renders a list of the user blogs
│   │           └─ a card form will appear to create new blog
│   └─ route('/blog/:id')
│       ├─ Gets the blog info and their comments
│       ├─ check if user logged in
|       |      └─ not logged in user cannot comment the blog
│       ├─ check if user is the original poster
|       |      └─ if true the blog will display 
|       |         edit and delete buttons 
│       └─ Renders the blog and their comments
└─ apiRoutes
    ├─ blogRoutes
    |      ├─ POST - Create a new blog
    |      |    └─ only user with auth can create 
    |      ├─ PUT - Update a blog
    |      |    └─ only main user can update 
    |      └─ DELETE - Delete a blog
    |           └─ only main user can delete 
    ├─ commentRoutes
    |      └─ POST - Create a new comment
    |           └─ only user with auth can create   
    └─ userRoutes
           ├─ POST - Create a new user        
           └─ POST - login 
                ├─ will check the credentials
                ├─ return any error
                └─ save sesion information on cookies
```
### Web navigation
```
main screen
├─ Home
│   ├─ Create Blog Card if logged in
│   ├─ List of blogs 
│   └─ When Selected a blog
│       ├─ Blog main card
│       |   └─ Edit and Delete options if post is from OP
│       ├─ Create comment Card if logged in
│       └─ Comment list
├─ Dashboard
│   ├─ Login view if not logged in
│   ├─ Create Blog Card if logged in
│   ├─ List of the logged user blogs 
│   └─ When Selected a blog
│       ├─ Blog main card
│       |   └─ Edit and Delete options if post is from OP
│       ├─ Create comment Card
│       └─ Comment list
└─ Log In
    ├─ Login view
    └─ Sign in option
```

## Code

### Functionality
The app has different modules that handle the Sequelize SQL connection, model relations, public documents, Handlebars views, Express sessions, Express routes, helpers, and controllers. Every part of these modules is necessary to keep the app running correctly. The server.js file keeps these modules working together correctly.

### server.js

The express server is initialized and starts all the required processes that make the app run, such as the view and its files, and the server routes that serve the user with information.

```js
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
    secret: 'Super secret secret',
    cookie: {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});
```
### Data Structure

Blog : 
* id : integer
* user_id : integer
* date_created : date
* title : String
* body : String

Comment:
* id : integer
* commenter : integer
* date_commented : date
* comment : String
* blog_id : integer

User:
* id : integer
* name : string
* email : string
* password : string

**Database Relations - Index.js**

The database structure dictates that a `User` may have many `Blogs` and many `Comments`. However, a `Blog` may belong to just one `User` and have many `Comments`. Similarly, a `Comment` can only belong to one `User` and one `Blog`.

```js
const User = require('./User');
const Blog = require('./Blog');
const Comment = require('./Comment');

User.hasMany(Blog, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

User.hasMany(Comment, {
  foreignKey: 'commenter',
  onDelete: 'CASCADE'
});

Blog.belongsTo(User, {
  foreignKey: 'user_id'
});

Blog.hasMany(Comment, {
  foreignKey: 'blog_id',
  onDelete: 'CASCADE'
});

Comment.belongsTo(Blog, {
  foreignKey: 'blog_id'
});

Comment.belongsTo(User, {
  foreignKey: 'commenter'
});
module.exports = { User, Blog, Comment };
```

### **Routes**

**homeRoute.js**

The main route `'/'` serves the view with the blog data, which includes all Blogs and their comments. It then formats the JSON, sets the array order in reverse so that the latest posts appear first, adds the main title (which will be displayed in the view's title), the `logged_in` variable (which indicates whether an actual user is viewing the page), and the `name` variable for the welcome text. If the user is logged in, the blogs made by the user will show as 'Posted by: You'. Finally, it renders the view to the page with the necessary data to display all the components.
```js
router.get('/', async (req, res) => {
  try {
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

    const blogs = blogData.map((blog) => blog.get({ plain: true }));
    const data = {
      blogs: [ ...blogs.reverse() ],
      maintitle: "The Tech Blog",
      logged_in: (req.session.logged_in) ? true : false,
      name: (req.session.user_name) ? req.session.user_name : 'none'
    };
    if (req.session.logged_in) {
        data.blogs.map(blog => {
            if (blog.user.id === req.session.user_id) {
                blog.user.name = 'You';
      }
      return blog;
    });
    }
    console.log(data);
    res.render('blog', data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
```

The `'/login'` route redirects the user to the login page if they are not already logged in. If the user is already logged in, it redirects them to the main screen.
```js
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  const data = {
    maintitle: "Log In"
  }
  res.render('login', data);
});
```
The `'/register'` route redirects the user to the register page if they are not already logged in. If the user is already logged in, it redirects them to the main screen.
```js
router.get('/register', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  const data = {
    maintitle: "Register"
  }
  res.render('register', data);
});
```

The `'/dashboard'` route is only accessible when the user is logged in. If the user has not logged in yet, they will be prompted to do so. Once logged in, it retrieves all the blogs from the logged user, formats the JSON, sets the array order in reverse so that the latest posts appear first, and adds the main title (which will be displayed in the view's title) and the `logged_in` variable. It then renders a 'Create blog' card to allow the user to add a new entry, along with a list of all the blogs made by the logged user.
```js
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
        maintitle: "Dashboard",
        logged_in: (req.session.logged_in) ? true : false,
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
```
The `'/blog/:id'` route is accessible from the home (`'/'`) or dashboard (`'/dashboard'`) by selecting a blog. Upon selecting a blog, the user is redirected to this route, where the blog post and its comments are displayed. If the blog post belongs to the logged user, two buttons, `edit` and `delete`, are displayed at the bottom. This allows the user to make changes to the post.
```js
router.get('/blog/:id', async (req, res) => {
  try {
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
      myblog: (req.session.user_id == blog.user_id)?true:false
    };
    console.log(data);

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
```
### **API Routes**

**BlogRoutes.js**

The `POST` route `'/'` is accessible when the user is authenticated (`withAuth`). When this route is triggered, a new entry is added to the blog table using the data from `req.body` (the request body) and the `user_id` from the current session.
```js
router.post('/', withAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newBlog);
  } catch (err) {
    res.status(400).json(err);
  }
});
```

The `PUT` route `'/:id'` is accessible when the user is authenticated (`withAuth`). When this route is triggered, a new entry is added to the blog table using the data from `req.body` (the request body) and the `user_id` from the current session.
```js
router.put('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No Blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});
```

```js
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogData) {
      res.status(404).json({ message: 'No Blog found with this id!' });
      return;
    }

    res.status(200).json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});
```

## Screenshots

## Video
