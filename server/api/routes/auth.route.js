const { Router } = require('express');

const authenticationMiddleware = require('../middlewares/authentication.middleware');
const { googleMiddleware, googleCallbackMiddleware } = require('../middlewares/google-authentication.middleware');
const registrationMiddleware = require('../middlewares/registration.middleware');
const { login, register, googleLogin } = require('../services/auth.service');

const router = Router();

router.post('/login', authenticationMiddleware, (req, res, next) => {
  login(req.user)
    .then(data => res.send(data))
    .catch(next);
});

router.get('/google', googleMiddleware);

router.get('/google/callback', googleCallbackMiddleware, (req, res, next) => {
  googleLogin(req.user)
    .then((data) => {
      const stringData = JSON.stringify(data);
      res.redirect(`${process.env.CLIENT_URL}/login/?user=${stringData}`);
    })
    .catch(next);
});

router.post('/register', registrationMiddleware, (req, res, next) => {
  register(req.user)
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
