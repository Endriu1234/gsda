const User = require('../../business/models/user');
const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const { authenticate } = require('ldap-authentication');

function getLdapOptions(username, password) {
    return {
        ldapOpts: {
            url: process.env.LDAP_URL,
            tlsOptions: { rejectUnauthorized: false }
        },
        userDn: process.env.LDAP_USER_DN.replace('{{username}}', username),
        userSearchBase: process.env.LDAP_SEARCH_BASE,
        usernameAttribute: process.env.LDAP_USERNAME_ATTRIBUTE,
        searchFilter: process.env.LDAP_SEARCH_FILTER,
        username: username,
        userPassword: password
    };
}

function findUser(id) {
    let user = User.findOne({ username: id });
    return user;
}

async function insertUser(ldapUser) {
    const username = ldapUser['sAMAccountName'];
    const mail = ldapUser.mail;
    const name = ldapUser.cn;
    const title = ldapUser.title;
    const lastname = ldapUser.sn;
    const firstname = ldapUser.givenName;
    const displayname = ldapUser.displayName;

    let user = await User.findOne({ username: username });

    if (user) {
        user.username = username;
        user.mail = mail;
        user.name = name;
        user.title = title;
        user.lastname = lastname;
        user.firstname = firstname;
        user.displayname = displayname;
    }
    else
        user = new User({ username, mail, name, title, lastname, firstname, displayname });

    const userSaveResult = await user.save();

    return user;
}

module.exports.loadConfiguaration = (app) => {

    passport.use('ldap', new CustomStrategy(
        async function (req, done) {
            try {
                if (!req.body.username || !req.body.password)
                    throw new Error('username and password are not provided')

                let options = getLdapOptions(req.body.username, req.body.password);
                let user = await authenticate(options)
                return done(null, user)
            } catch (error) {
                console.log(`LDAP Custom strategy failed with error ${error}`);
                return done(error, null)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        if (user[process.env.LDAP_USERNAME_ATTRIBUTE]) {
            done(null, user[process.env.LDAP_USERNAME_ATTRIBUTE])
        } else {
            done(
                'User from ldap server does not have field ' + process.env.LDAP_USERNAME_ATTRIBUTE
            )
        }
    })

    passport.deserializeUser((id, done) => {
        findUser(id).then((user) => {
            if (!user) {
                done(
                    new Error(`Deserialize user failed. ${id} is deleted from local DB`)
                )
            } else {
                done(null, user)
            }
        })
    })

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login', (req, res, next) => {
        passport.authenticate('ldap', (error, user) => {
            if (error) {
                const errorInfo = error.name === 'InvalidCredentialsError'
                    ? 'Wrong login or password' : 'Something went wrong during authentication';

                req.flash('error', errorInfo);
                return res.redirect('/login');
            }
            if (!user) {
                req.flash('error', 'User Not Found');
                return res.redirect('/login');
            } else {
                req.login(user, (loginErr) => {
                    if (loginErr) {
                        return next(loginErr)
                    }
                    insertUser(user).then((user) => {
                        req.flash('success', `User ${user.displayname} was logged`);
                        const redirectUrl = req.session.returnTo || '/';
                        delete req.session.returnTo;
                        return res.redirect(redirectUrl);
                    })
                })
            }
        })(req, res, next);
    });

    app.get('/logout', (req, res) => {
        req.logout();
        req.flash('success', 'User was logged out');
        res.redirect('/');
    });

    app.use((err, req, res, next) => {
        if (err)
            req.logout();

        next()
    })

    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        next();
    });
};

module.exports.isUserLogged = (req, res, next) => {
    console.log('isLoginInStarting');

    if (!req.isAuthenticated()) {
        console.log('isLoginIn Not Sutentincated');
        //console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    console.log('isLoginIn GOOD');
    next();
}