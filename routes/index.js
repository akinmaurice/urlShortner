var express = require('express');
var router = express.Router();
const appController = require('../controllers/appController');
const { catchErrors } = require('../handlers/errorHandlers');

/* GET home page. */
router.get('/', appController.getIndex);

/* Router to Shorten URL */
router.post('/',
    appController.validateInput,
    appController.isUrlValid,
    catchErrors(appController.newUrl),
    appController.shortenUrl
);

/* GET Real Link. */
router.get('/:shortUrl', catchErrors(appController.getUrl));

module.exports = router;
