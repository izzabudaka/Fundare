module.exports = {
  showLogin: function(req, res, next) {
    res.render('login', {
      title: 'Sign in',
      user: req.user
    }, function(err, html) {
      if(err) console.log('Error rendering view: ', err);
      res.send(html);
    });
  },

  showRegister: function(req, res, next) {
    res.render('register', {
      title: 'Register',
      user:req.user
    }, function(err, html) {
      if(err) console.log('Error rendering view: ', err);
      res.send(html);
    });
  },

  register: function(req, res, next) {
    var username = req.params.username;
    var password = req.params.password;
    var email = req.params.email;

    req.db.User.build({
      username: username,
      password: password,
      email: email
    });

    user.save().success(function(user) {
      if(user) return res.send('success');
    });
  }
};
