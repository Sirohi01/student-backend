const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorHandler');

// Import Routes
const authRouter = require('./modules/auth/auth.route');
const aiRouter = require('./modules/ai/ai.route');
const subjectRouter = require('./modules/subjects/subject.route');
const taskRouter = require('./modules/tasks/task.route');
const sessionRouter = require('./modules/studySessions/studySession.route');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'focusScore',
        ],
    })
);

app.use(compression());
app.use(cors());

// 2) ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/subjects', subjectRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/sessions', sessionRouter);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
