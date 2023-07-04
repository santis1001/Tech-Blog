const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.logged_in) {
    const data = {
      maintitle: "Log In"
    }
    res.render('login', data);
  } else {
    next();
  }
};

module.exports = withAuth;
