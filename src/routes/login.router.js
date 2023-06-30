import express from "express";
import { UserModel } from "../Dao/models/login.models.js";

export const loginRouter = express.Router();

loginRouter.post('/register', async (req, res) => {
    const { firstName, lastName, age, email, password } = req.body;
    if (!firstName || !lastName || !age || !email || !password) {
        return res.status(400).render('error-page', { msg: 'faltan datos' });
    }
    try {
        const user = await UserModel.create({ firstName, lastName, age, email, password, admin: false });
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
        if (foundUser && foundUser.password === password) {
          req.session.user = {
            firstName: foundUser.firstName,
            email: foundUser.email,
            admin: foundUser.admin
          };
          return res.redirect('/view/products');
        } else {
          return res.status(400).render('error-page', { msg: 'email o contraseña incorrectos' });
        }
      })
      .catch(error => {
        console.log(error);
        return res.status(500).render('error-page', { msg: 'error inesperado en el servidor' });
      });
  });
  