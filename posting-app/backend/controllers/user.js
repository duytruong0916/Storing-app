const jwt = require('jsonwebtoken');
const User = require('../modules/user');
const bcrypt = require('bcryptjs');

exports.RegisterUser = (req, res) => {
  User.findOne({ email: req.body.email }, (err, email) => {
      if (err) res.send(err)
      if (email) {
          return res.json({
              success: false,
              msg: "This email address is already associated with an account"
          })
      }
      else {
          bcrypt.hash(req.body.password, 10).then(hash => {
              const newuser = new User({
                  lastname: req.body.lastname,
                  firstname: req.body.firstname,
                  password: hash,
                  email: req.body.email
              });
              newuser.save().then(result => {
                  return res.json({
                      success: true,
                      msg: "User Created"
                  });
              })
                  .catch(err => {
                      return res.json({ error: err });
                  });
          })
      }
  })
}

exports.AuthenticateUser = (req, res) => {
  User.findUser(req.body.email, (err, user) => {
      if (err) return res.send(err);
      if (!user) {
          return res.json({success: false, msg: "INVALID EMAIL" });
      }
      else {
          User.comparePassword(req.body.password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                  const token = jwt.sign({ email: user.email, userid: user._id }, "secret_should_last_longer", { expiresIn: "1h" });
                  return res.json({
                      msg: "Successfully Authenticated",
                      success: true,
                      expirationTime: 3600,
                      token:'Bearer '+ token,
                      user: {
                          lastname: user.lastname,
                          firstname: user.firstname,
                          userid: user._id
                      }
                  });
              } else
                  return res.json({ success: false, msg: "INVALID PASSWORD" });
          });
      }
  });
}
