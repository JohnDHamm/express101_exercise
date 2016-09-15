'use strict';

const mongoose = require('mongoose')

//every collection needs a model
module.exports = mongoose.model('Size', {
	name: String,
	inches: Number
});
