
import { loginService } from "../services/login.service.js";
import passport from 'passport';
import { createHash, isValidPassword } from "../../utils.js";
import { UserDTO } from "../Dto/UserDTO.js";
import EErrors from "../services/errors/enums.js";
import CustomError from "../services/errors/custom-error.js";
import { developmentLogger, productionLogger } from "../../config/logger.js";

class LoginController {
  async register(req, res) {
    const { firstName, lastName, age, email, password } = req.body;

    if (!firstName || !lastName || !age || !email || !password) {
      const errorMessage = 'Faltan datos';
      developmentLogger.error(errorMessage);
      productionLogger.error(errorMessage);
      return res.status(400).render('error-page', { msg: errorMessage });
    }

    try {
      const user = await loginService.registerUser({
        firstName,
        lastName,
        age,
        email,
        password: createHash(password),
        admin: false,
      });

      req.session.user = {
        firstName: user.firstName,
        email: user.email,
        admin: user.role,
      };

      return res.redirect('/view/products');
    } catch (error) {
      developmentLogger.error(error.message);
      productionLogger.error(error.message);

      const customError = CustomError.createError({
        name: 'User creation error',
        cause: 'Controla tu email e intenta más tarde',
        message: 'Error trying to create user',
        code: EErrors.INTERNAL_SERVER_ERROR,
      });

      return res.status(customError.code).render('error-page', { msg: customError.cause });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      const errorMessage = 'Faltan datos';
      developmentLogger.error(errorMessage);
      productionLogger.error(errorMessage);
      return res.status(400).render('error-page', { msg: errorMessage });
    }

    try {
      const foundUser = await loginService.findUserByEmail(email);

      if (foundUser && isValidPassword(password, foundUser.password)) {
        req.session.user = {
          firstName: foundUser.firstName,
          email: foundUser.email,
          admin: foundUser.admin,
        };

        return res.redirect('/view/products');
      } else {
        throw CustomError.createError({
          name: 'Invalid credentials error',
          cause: 'Email o contraseña incorrectos',
          code: EErrors.INVALID_CREDENTIALS,
        });
      }
    } catch (error) {
      developmentLogger.error(error.message);
      productionLogger.error(error.message);

      if (error.name === 'Invalid credentials error') {
        return res.status(error.code).render('error-page', { msg: error.cause });
      } else {
        const customError = CustomError.createError({
          name: 'Internal server error',
          cause: 'Error inesperado en el servidor',
          code: EErrors.INTERNAL_SERVER_ERROR,
        });

        return res.status(customError.code).render('error-page', { msg: customError.cause });
      }
    }
  }

  async renderProfileView(req, res) {
    if (req.session.user) {
      return res.render('profile', { user: req.session.user });
    } else {
      return res.status(401).render('error-page', { msg: 'No se ha iniciado sesión.' });
    }
  }

  async getCurrentUser(req, res) {
    if (req.session.user) {
      const userDTO = new UserDTO(req.session.user.firstName, req.session.user.email, req.session.user.admin);
      return res.status(200).json({ user: userDTO });
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
    try {
      developmentLogger.debug('Mostrando sesión');
      productionLogger.debug('Mostrando sesión');
      return res.send(JSON.stringify(req.session));
    } catch (error) {
      developmentLogger.error(error.message);
      productionLogger.error(error.message);

      const customError = CustomError.createError({
        name: 'Internal server error',
        cause: 'Error inesperado en el servidor',
        code: EErrors.INTERNAL_SERVER_ERROR,
      });

      return res.status(customError.code).render('error-page', { msg: customError.cause });
    }
  }
}


export const loginController = new LoginController();
