const mongoose = require('mongoose');
const { body, check, validationResult } = require('express-validator');
const User = mongoose.model('User');
const { promisify } = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.registerForm = async (req, res) => {
    res.render('register', { title: 'Register' });
};

exports.registerClientForm = async (req, res) => {
    res.render('users/register_client', { title: 'Registe Client', packages: [], devices: [], roles: [] });
};

exports.validateRegister = async (req, res, next) => {
    await body('name').run(req);
    await check('name', 'You must supply a name!').notEmpty().run(req);
    await check('email', 'That Email is not valid!').isEmail().run(req);
    await body('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    }).run(req);
    await check('password', 'Password Cannot Be Blank').notEmpty().run(req);
    await check('password-confirm', 'Confirmed Password Cannot Not Be Blank').notEmpty().run(req);
    await check('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password).run(req);

    const { errors } = validationResult(req);
    if (errors && errors.length) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};

exports.register = async (req, res, next) => {
    const user = new User({ email: req.body.email, name: req.body.name });
    const register = promisify(User.register).bind(User);
    await register(user, req.body.password);
    next();
};

exports.account = async (req, res) => {
    res.render('account', { title: 'Edit Your Account' });
};

exports.updateAccount = async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updates },
        { new: true, runValidators: true, context: 'query' }
    );

    req.flash('success', 'Updated the profile!');
    res.redirect('back');
};
