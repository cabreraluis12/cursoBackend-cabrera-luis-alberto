
import { loginService } from "../services/login.service.js";
import passport from 'passport';
import { createHash, isValidPassword } from "../../utils.js";

class LoginController {
  async register(req, res) {
    const { firstName, lastName, age, email, password } = req.body;

    if (!firstName || !lastName || !age || !email || !password) {
      return res.status(400).render('error-page', { msg: 'Faltan datos' });
    }

    try {
      const user = await loginService.registerUser({
        firstName,
        lastName,
        age,
        email,
        password: createHash(password),
        admin: false
      });

      req.session.user = {
        firstName: user.firstName,
        email: user.email,
        admin: user.admin
      };

      return res.redirect('/profile');
    } catch (e) {
      console.log(e);
      return res.status(400).render('error-page', { msg: 'Controla tu email e intenta más tarde' });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('error-page', { msg: 'Faltan datos' });
    }

    try {
      const foundUser = await loginService.findUserByEmail(email);

      if (foundUser && isValidPassword(password, foundUser.password)) {
        req.session.user = {
          firstName: foundUser.firstName,
          email: foundUser.email,
          admin: foundUser.admin
        };

        return res.redirect('/view/products');
      } else {
        return res.status(401).render('error-page', { msg: 'Email o contraseña incorrectos' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).render('error-page', { msg: 'Error inesperado en el servidor' });
    }
  }

  async getCurrentUser(req, res) {
    if (req.session.user) {
      return res.status(200).json({ user: req.session.user });
    } else {
      return res.status(401).json({ message: 'No se ha iniciado sesión.' });
    }
  }

  async authenticateWithGithub(req, res) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res);
  }

  async githubCallback(req, res) {
    passport.authenticate('github', { failureRedirect: '/login' }, (err, user) => {
      if (err) {
        console.log(err);
        return res.redirect('/login');
      }
      req.session.user = user;
      res.redirect('/view/products');
    })(req, res);
  }

  async showSession(req, res) {
    return res.send(JSON.stringify(req.session));
  }
}

export const loginController = new LoginController();
