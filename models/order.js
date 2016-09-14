'use strict';

const mongoose = require('mongoose')

//every collection needs a model
module.exports = mongoose.model('Order', {
	name: String,
	email: String,
	phone: String,
	size: Number,
	toppings: [String]
});
