const { Router } = require('express');

const authenticationMiddleware = require('../middlewares/authentication.middleware');
const { googleMiddleware, googleCallbackMiddleware } = require('../middlewares/google-authentication.middleware');
const registrationMiddleware = require('../middlewares/registration.middleware');
const {
  login, register, googleLogin, googleLoginMobile
} = require('../services/auth.service');
const { getUserById } = require('../services/user.service');
const { clientUrl } = require('../../config/common.config');

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
      res.redirect(`${clientUrl}/login/?user=${stringData}`);
    })
    .catch(next);
});

router.post('/google/mobile', (req, res, next) => {
  googleLoginMobile(req.body.email)
    .then((data) => {
      res.send(data);
    })
    .catch(next);
});

router.post('/register', registrationMiddleware, (req, res, next) => {
  const { imgUrl } = req.body;
  register({
    ...req.user,
    imgUrl
  })
    .then(data => res.send(data))
    .catch(next);
});

router.get('/user', (req, res, next) => {
  getUserById(req.user.id)
    .then(data => res.send(data))
    .catch(next);
});

module.exports = router;
