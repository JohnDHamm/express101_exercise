'use strict';

const mongoose = require('mongoose')

//every collection needs a model
module.exports = mongoose.model('Contact', {
	name: String,
	email: String,
	phone: String,
	message: String
});
