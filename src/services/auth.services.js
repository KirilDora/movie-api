const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthService = {
  async register({ username, password }) {
    const existing = await User.findOne({ where: { username } });
    if (existing) throw new Error('User already exists');

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed });
    return { message: 'User created' };
  },

  async login({ username, password }) {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    return { token };
  }
};

module.exports = { AuthService };
