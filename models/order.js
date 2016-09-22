'use strict';

const mongoose = require('mongoose')

const HTML5_EMAIL_VALIDATION = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

//every collection needs a model
module.exports = mongoose.model('Order', {
	name: { type: String, required: [true, "What's your name?"] },
	email: { type: String, required: true, lowercase: true, match: [HTML5_EMAIL_VALIDATION, "That's not a real email, jerk!" ] }, //changes upper to lowercase
	phone: { type: String, required: [true, "Can't call you if you don't give a phone number!"] },
	size: { type: Number, required: [true, "No size? No pizza!"] },
	toppings: { type: [String], default: ['Cheese'] }
});
