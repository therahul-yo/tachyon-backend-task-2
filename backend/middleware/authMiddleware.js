const jwt = require('jsonwebtoken');
const db = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error: 'No token' });
  const parts = auth.split(' ');
  if(parts.length !== 2) return res.status(401).json({ error: 'Invalid token format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await db.User.findByPk(payload.id);
    if(!user) return res.status(401).json({ error: 'User not found' });
    req.user = { id: user.id, username: user.username };
    next();
  } catch(err){ return res.status(401).json({ error: 'Invalid token' }); }
};
