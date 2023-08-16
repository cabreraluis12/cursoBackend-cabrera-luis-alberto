export function checkUser(req, res, next) {
    if (req.session && req.session.email) {
        return next();
    }
    return res.status(401).render('error-page', { msg: 'Please log in' });
}

export function checkAdmin(req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    } else if (req.session.user.admin) {
      return next();
    } else {
      return res.status(403).render('error-page', { msg: 'Acceso denegado. Solo los administradores pueden acceder a esta página.' });
    }
  }