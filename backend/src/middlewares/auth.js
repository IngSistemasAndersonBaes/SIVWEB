const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: 'JWT_SECRET no configurado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
}

module.exports = authMiddleware;
