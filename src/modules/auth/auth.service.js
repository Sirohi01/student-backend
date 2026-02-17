const jwt = require('jsonwebtoken');
const User = require('./auth.model');
const AppError = require('../../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    });
};

exports.register = async (userData) => {
    const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
    });

    const token = signToken(newUser._id);
    return { user: newUser, token };
};

exports.login = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Incorrect email or password', 401);
    }

    const token = signToken(user._id);
    return { user, token };
};
