const urlShortner = require('../handlers/urlShortner');
const mongoose = require('mongoose');

const Url = mongoose.model('Url');


/* Middleware to validate If input is a valid URL */
exports.isUrlValid = (req, res, next) => {
  console.log(req.body.url);
  const pattern = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (!pattern.test(req.body.url)) {
    res.json({ status: 500, message: 'Invalid URL provided' });
    // STop fn from running
    return;
  }
  next();
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
  } else {
    //  Save the URL, GET THE ID AND
    // ENCODE THE ID ON THE NEXT FUNCTION
    const url = await (new Url(req.body)).save();
    req.body.urlId = url.urlId;
    next();
  }
};

/* MiddleWare to SHorten URL HERE and send json data */
exports.shortenUrl = (req, res) => {
  const { urlId } = req.body;
  req.body.shortenedUrl = urlShortner.encodeUrl(urlId);
  const shortenedUrl = `http://${req.headers.host}/${req.body.shortenedUrl}`;
  console.log(shortenedUrl);
  res.json({ status: 200, message: shortenedUrl });
};
