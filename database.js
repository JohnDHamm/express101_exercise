'use strict';

const mongoose = require('mongoose')
const MONGODB_URL = 'mongodb://localhost:27017/pizzabypug'

mongoose.Promise = Promise //tells mongoose to use global Promise vs. its' internal promise

//every collection needs a model
// mongoose.model('Contact', {
// 	name: String,
// 	email: String,
// 	phone: String,
// 	message: String
// });

module.exports.connect = () => mongoose.connect(MONGODB_URL)

