const mongoose = require('mongoose');

exports.loginPage = async (req, res) => {
    res.render('login', { title: 'Hyrje' });
};

exports.registerPage = async (req, res) => {
    res.render('register', { title: 'Regjistrimi' });
};

exports.dashboardPage = async (req, res) => {
    return res.render('home/dashboard', { title: 'Dashboard page', termins: [] });
};

exports.homePage = async (req, res) => {
    return res.render('home/homePage', { title: 'Home page' });
};

exports.veranstaltungenPage = async (req, res) => {
    return res.render('home/veranstaltungen', { title: 'Veranstaltungen' });
};