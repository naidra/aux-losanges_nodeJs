const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const eventReportsController = require('../controllers/eventReportsController');
const { catchErrors } = require('../handlers/errorHandlers');

// // Do work here
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register',
    // authController.checkRole,
    userController.registerForm
);
router.post('/register',
    // authController.checkRole,
    userController.validateRegister,
    userController.register,
    authController.login
);

router.get('/logout', authController.logout);
router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', authController.isLoggedIn, catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update)
);

// router.get('/eventReports', authController.isLoggedIn, catchErrors(eventReportsController.eventReportsPage));
// router.get('/eventReports/create', authController.isLoggedIn, catchErrors(eventReportsController.roleCreate));
// router.post('/eventReports/create', authController.isLoggedIn, catchErrors(eventReportsController.roleCreatePost));
// router.get('/eventReports/edit/:id', authController.isLoggedIn, catchErrors(eventReportsController.roleEdit));
// router.post('/eventReports/edit/:id', authController.isLoggedIn, catchErrors(eventReportsController.roleEditPost));
// router.get('/eventReports/delete/:id', authController.isLoggedIn, catchErrors(eventReportsController.roleDelete));

router.get('/', catchErrors(eventReportsController.eventReportsPage));
router.get('/eventReports', catchErrors(eventReportsController.eventReportsPage));
router.get('/eventReports/create', catchErrors(eventReportsController.eventReportCreate));
router.post('/eventReports/create', catchErrors(eventReportsController.eventReportCreatePost));
router.get('/eventReports/edit/:id', catchErrors(eventReportsController.eventReportEdit));
router.post('/eventReports/edit/:id', catchErrors(eventReportsController.eventReportEditPost));
router.get('/eventReports/delete/:id', catchErrors(eventReportsController.eventReportDelete));

module.exports = router;