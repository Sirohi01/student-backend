const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/responseHandler');
const { register: registerSchema, login: loginSchema } = require('./auth.validation');
const AppError = require('../../utils/AppError');

exports.register = asyncHandler(async (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }

    const { user, token } = await authService.register(req.body);

    sendResponse(res, 201, true, 'User registered successfully', {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

exports.login = asyncHandler(async (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }

    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    sendResponse(res, 200, true, 'Logged in successfully', {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

exports.getMe = asyncHandler(async (req, res, next) => {
    // req.user is populated by protect middleware
    const user = req.user;

    sendResponse(res, 200, true, 'Current user data', {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
