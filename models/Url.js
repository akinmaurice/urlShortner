const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const autoIncrement = require('mongoose-auto-increment');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

//initialize autoincrement
autoIncrement.initialize(mongoose);

const urlSchema = new Schema({
   real_url: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    }
});

urlSchema.plugin(autoIncrement.plugin,{
    model: 'Url',
    field: 'urlId',
    startAt: 1000,
    incrementBy: 10
});
module.exports = mongoose.model('Url', urlSchema);