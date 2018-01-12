const urlShortner = require('../handlers/urlShortner');
const mongoose = require('mongoose');

const Url = mongoose.model('Url');
/* Controller to get the login page */
exports.getIndex = (req, res) => {
  res.render('index', { title: 'UrlShortner' });
};

/* Middleware to check if iput is not empty */
exports.validateInput = (req, res, next) => {
  // Check if field is not empty
  req.checkBody('url', 'Please Provide a Valid Url').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    req.flash('warning', errors.map(err => err.msg));
    res.redirect('/');
    // STop fn from running
    return;
  }
  next();
};

/* Middleware to validate If input is a valid URL */
exports.isUrlValid = (req, res, next) => {
  const pattern = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (!pattern.test(req.body.url)) {
    req.flash('warning', 'Invalid URL Provided!');
    res.redirect('/');
    // STop fn from running
    return;
  }

  next();
};

/* MiddleWare to SHorten URL HERE */
exports.shortenUrl = (req, res) => {
  const { urlId } = req.body;
  req.body.shortenedUrl = urlShortner.encodeUrl(urlId);
  const shortenedUrl = `http://${req.headers.host}/${req.body.shortenedUrl}`;
  res.render('index', { title: 'Url Shortner', shortenedUrl });
};

/* Middleware to save the url and get the id to the next controller to shirnk the id
*/
exports.newUrl = async (req, res, next) => {
  req.body.real_url = req.body.url;
  const checkUrl = await Url.findOne({ real_url: req.body.real_url });
  // If URl exists
  if (checkUrl) {
    req.body.urlId = checkUrl.urlId;
    next();
  } else /* URL DOES NOT EXIST */ {
    const url = await (new Url(req.body)).save();
    req.body.urlId = url.urlId;
    next();
  }
};

/* Get Back actual URL */
exports.getUrl = async (req, res) => {
  // Decode the Url Base then fetch from the DB
  const realUrlId = urlShortner.decodeUrl(req.params.shortUrl);
  // FIND THE REAL URL OF THE ID
  const url = await Url.findOne({ urlId: realUrlId });
  if (!url) {
    // Url does not exist
    req.flash('warning', 'Invalid URL Provided!');
    res.redirect('/');
  } else {
    const realUrl = url.real_url;
    res.redirect(301, `http://${realUrl}`);
  }
};


exports.getAll = async (req, res) => {
  console.log('hfhfhf');
  const posts = await Url.find();
  res.json(posts);
};

