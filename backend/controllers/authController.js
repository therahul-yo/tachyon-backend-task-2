const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({error:'username & password required'});
    const existing = await User.findOne({ where: { username }});
    if(existing) return res.status(400).json({error:'username taken'});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash: hash });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch(err){ return res.status(500).json({ error: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if(!username || !password) return res.status(400).json({error:'username & password required'});
    const user = await User.findOne({ where: { username }});
    if(!user) return res.status(400).json({error:'invalid credentials'});
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({error:'invalid credentials'});
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch(err){ return res.status(500).json({ error: err.message }); }
};
