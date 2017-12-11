const express = require('express');

const router = express.Router();
const appController = require('../controllers/appController');
const apiController = require('../controllers/api');
const { catchErrors } = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', appController.getIndex);

/* Router to Shorten URL */
router.post(
  '/',
  appController.validateInput,
  appController.isUrlValid,
  catchErrors(appController.newUrl),
  appController.shortenUrl,
);

/* GET Real Link. */
router.get('/:shortUrl', catchErrors(appController.getUrl));


router.post(
  '/api',
  apiController.isUrlValid,
  catchErrors(apiController.newUrl),
  apiController.shortenUrl,
);

module.exports = router;
