import express from "express";
import { UserModel } from "../Dao/models/login.models.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from 'passport';

export const loginRouter = express.Router();

loginRouter.post('/register', async (req, res) => {
    const { firstName, lastName, age, email, password } = req.body;
    if (!firstName || !lastName || !age || !email || !password) {
        return res.status(400).render('error-page', { msg: 'faltan datos' });
    }
    try {
        const user = await UserModel.create({ firstName, lastName, age, email, password : createHash(password), admin: false });
        req.session.user = {
            firstName: user.firstName,
            email: user.email,
            admin: user.admin
        };
        return res.redirect('/profile');
    } catch (e) {
        console.log(e);
        return res.status(400).render('error-page', { msg: 'controla tu email y intenta más tarde' });
    }
});

loginRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render('error-page', { msg: 'faltan datos' });
    }
  
    UserModel.findOne({ email })
      .then(foundUser => {
        if (foundUser && isValidPassword(password, foundUser.password)) {
          req.session.user = {
            firstName: foundUser.firstName,
            email: foundUser.email,
            admin: foundUser.admin
          };
          return res.redirect('/view/products');
        } else {
          return res.status(401).render('error-page', { msg: 'email o contraseña incorrectos' });
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).render('error-page', { msg: 'error inesperado en el servidor' });
      });
  });

  loginRouter.get('/current', (req, res) => {
    if (req.session.user) {
      return res.status(200).json({ user: req.session.user });
    } else {
      return res.status(401).json({ message: 'No se ha iniciado sesión.' });
    }
  });
  
  loginRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

  loginRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/view/products');
  });

  loginRouter.get('/show', (req, res) => {
    return res.send(JSON.stringify(req.session));
  });