var controllers = {
  //index: require('../app/controllers/index.js'),
  users: require('../app/controllers/users.js')
}

module.exports = function(app, passport, db) {

  function loggedIn(req, res, next) {
    if(req.user) next();
    else res.redirect('/login');
  };

  function injectDb(req, res, next) {
    req.db = db;
    next();
  };

  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // Creates a challenge and adds it to the database
  app.post('/createChallenge', loggedIn, injectDb, function(req, res, next){
    var cName = req.body.name;
    var cExpiration = req.body.expirationDate;
    var wValue = req.body.value;
    var charityName = req.body.charity;

    //TODO: some magic to get charity code. For now, use the code supplied 
    //      by the barclays guy.... 
    //
    var charityCode = 'asdf';
  
    var challenge = req.db.Challenge.build({
      name : cName,
      started : false,
      committed: false,
      expirationDate: cExpiration,
      charityName: charityName,
      charityCode: charityCode
    })
    var initialWager = req.db.Wager.build({
      value: wValue
    })
    challenge.save().success(function(c){
      c.setWager(initialWager).success(function(){
        var cid = c.id
        c.addUser(req.user).success(function(){
          res.send({challengeId: cid});
        }).error(function(err) {
          console.log("KURWA: ", err);
          res.send(err);
        })
        //return next();
      }).error(function(err){
        console.log("KURWA: ", err)
        res.send(err);
        //return next();
      });
    }).error(function(err){
      console.log("KURWA: ", err)
      res.send('error');
      //return next();
    });
  });

  // Cancels a challenge and sends back message if successful
  app.post('/cancelChallenge', loggedIn, injectDb, function(req, res, next){
    req.db.Challenge.find({where: {id: req.body.cid}}).success(function(challenge){
      challenge.updateAttributes({
        cancelled : true
      }).success(function(){
        res.send("Challenge cancelled successfully");
        //return next();
      }).error(function(err){lobby
        console.log("KURWA: ", err);
        res.send("error");
        //return next();
      })
    }).error(function(err) {
        console.log("KURWA: ", err);
        res.send("error");
        //return next();    
    })
  });

  app.post('/acceptChallenge', loggedIn, injectDb, function(req, res, next) {
    var cid = req.body.cid;

    req.db.Challenge.find({where: {id: cid}}).success(function(c) {
      req.user.addChallenge(c, {score:0, updated:false}).success(function() {
        res.send('success');
      });
    });
  });

  app.post('/sendResult', injectDb, function(req, res, next) {
    var cid = req.body.cid;
    var score = req.body.score;
    //var userId = req.user.id;
    var userId = req.body.uid;

    req.db.Participating.find({where : ['userId =? and challengeId=?', userId, cid]}).success(function(p){
      if(!p) {
        console.log('participation not found');
        res.send('error');
        return;
      };
      p.updateAttributes({
        score: score,
        updated: true
      }).success(function(){
        res.send("Fuck yeah");
      }).error(function(err){
        console.log("KURWA: ", err);
        res.send(err);
      });
    }).error(function(){
        console.log("KURWA: ", err);
        res.send(err);   
    });
  });

  app.get('/lobby', loggedIn, injectDb, function(req, res, next) {
    res.send('gegegege');
  });
  

  app.post('/getChallenges', injectDb, function(req, res, next) {
    req.db.Challenge.findAll({include: [req.db.Wager]}).success(function(c) {
      res.send({challenges: c});
    }).error(function(err) {
      console.log('error getting challenges.. ', err);
      res.send({error: 'error getting challenges'});
    });
  });

  app.post('/getChallengeStatus', loggedIn, injectDb, function(req, res, next) {
    var cid = req.body.cid;
    
    req.db.Participating.findAll({where: {challengeId: cid}}).success(function(prows) {
      if(prows.length == 2) {
        if(prows[0].updated && prows[1].updated) {
          var winnerId = null;

          if(prows[0].score > prows[1].score) {
            winnerId = prows[0].userId;
          } else {
            winnerId = prows[1].userId;
          };

          req.db.User.find(winnerId).success(function(u) {
            var username = u.username;
            generatePayUrl(username);
          }).error(function(err) {
            console.log('error getting user: ', err);
            res.send({error: 'Error retrieving winner'});
          }); 
          
          var generatePayUrl = function(winnerName) {
            req.db.Challenge.find(cid).success(function(c) {
              req.db.Wager.find({where: {challengeId: cid}}).success(function(w){
                var payUrl = 'https://launch.secure.barclays.com/qr/qr.html?pingit://02/' + c.charityCode +"/"+ w.value +'/This+donation+is+on+behalf+of+' + winnerName;
                res.send({isWinner: (winnerId == req.user.id), payUrl: payUrl});
              }).error(function(err){
                console.log('error retrieving wager value: ', err);
                res.send({error: 'Error retrieving wager value'});               
              })
            }).error(function(err){
              console.log('error retrieving challenge: ', err);
              res.send({error: 'Error retrieving challenge'});
            });
          };

        } else {
          console.log('nope');
          res.send({error: 'Player completion mismatch'});
          return;
        };
      } else {
        console.log('nope');
        res.send({error: 'Player count mismatch'});
        return;
      };
    }).error(function(err) {
      console.log('nope ', err);
      res.send({error: 'Error retrieving status'});
    });
  });

  // User functions
  app.get('/login', function(req, res, next) {
    controllers.users.showLogin(req, res, next);
  });


  app.post('/users/login', 
    passport.authenticate('local', { failureRedirect:'/login' }),
    function(req, res, next) {
      res.redirect('/lobby');
  });

  app.post('/users/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  });

  app.get('/register', function(req, res, next) {
    controllers.user.showRegister(req, res, next);
  });

  app.post('/users/register', injectDb, function(req, res, next) {
    controllers.user.register(req, res, next);
  });

};
