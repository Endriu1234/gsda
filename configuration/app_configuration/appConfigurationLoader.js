const express = require('express');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

async function connectToMongo() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => { console.log("Database connected") });

    await mongoose.connect(process.env.MONGO_DB_ADRESS, {});
}

function setupViewsAndStatic(app, directory) {
    app.engine('ejs', ejsMate);
    app.set('view engine', 'ejs');
    app.set('views', path.join(directory, 'views'));
    app.use(express.static(path.join(directory, 'public')));
    app.use(express.static(path.join(directory, 'node_modules')));
}

function setupMiddleWares(app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(methodOverride('_method'));
    app.use(mongoSanitize(
        {
            replaceWith: '_' // 
        }
    ));

    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'"],
                scriptSrc: ["'unsafe-inline'", "'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                ],
                fontSrc: ["'self'"],
            },
        })
    )
}

function setupSession(app) {
    const store = MongoStore.create({
        mongoUrl: process.env.MONGO_DB_ADRESS,
        secret: process.env.SESSION_SECRET,
        touchAfter: 24 * 60 * 60
    });

    store.on('error', function (e) {
        console.log("Session Store Error", e);
    })

    const sessionConfig = {
        store,
        name: process.env.SESSION_NAME,
        secret: process.env.SESSION_SECRET,
        resave: false,
        //secure: true, only https
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }
    app.use(session(sessionConfig));
}

function setupFlashMessages(app) {
    app.use(flash());

    app.use((req, res, next) => {
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    });
}

function configurePATH() {
    process.env['PATH'] = `${process.env.ORACLE_CLIENT_PATH};` + process.env['PATH'];
}

module.exports.loadAppConfiguration = (app, directory) => {
    configurePATH();
    connectToMongo();
    setupViewsAndStatic(app, directory);
    setupMiddleWares(app);
    setupSession(app);
    setupFlashMessages(app);
}

