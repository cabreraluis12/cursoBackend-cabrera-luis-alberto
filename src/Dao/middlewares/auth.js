export function checkUser(req, res, next) {
    if (req.session && req.session.email) {
        return next();
    }
    return res.status(401).render('error-page', { msg: 'Please log in' });
}

export function checkAdmin(req, res, next) {
    if (req.session.user && req.session.user.admin) {

    next();
    } else {
        return res.status(403).render('error-page', { msg: 'Acceso denegado. Por favor, inicia sesión como administrador.' });
    }
}