const itemCreatorsRoutes = require('../../routes/itemsCreatorsRoutes');
const setupRoutes = require('../../routes/setupRoutes');

const ExpressError = require('../../utils/ExpressError');

module.exports.loadRouting = (app) => {

    app.use('/itemscreators', itemCreatorsRoutes);
    app.use('/setup', setupRoutes);

    app.get('/', (req, res) => {
        res.render('home');
    });

    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.all('*', (req, res, next) => {
        next(new ExpressError('Page not found.', 404));
    })

    app.use((err, req, res, next) => {
        const { statusCode = 500 } = err;

        if (!err.message)
            err.message = 'Something went wrong! Ehh...';

        res.status(statusCode).render('error', { err });
    });
}