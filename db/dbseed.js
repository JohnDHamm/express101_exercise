'use strict';

const { connect, disconnect } = require('./database')

const Size = require('../models/size')
const Topping = require('../models/toppings')

connect()
	.then(() => Size.remove())
	.then(() =>
		Size.insertMany([{
			name: 'Small',
			inches: 10
		},{
			name: 'Medium',
			inches: 12
		},{
			name: 'Large',
			inches: 16
		},{
			name: 'Murica',
			inches: 1776
		},{
			name: 'Fun',
			inches: 4
		},{
			name: 'Personal',
			inches: 8
		}])
	)
	.then(() => Topping.remove())
	.then(() =>
		Topping.insertMany([{
			name: 'Pepperoni',
			type: 'meat'
		}, {
			name: 'Sausage',
			type: 'meat'
		}, {
			name: 'Bacon',
			type: 'meat'
		}, {
			name: 'Ham',
			type: 'meat'
		}, {
			name: 'Mushrooms',
			type: 'veggie'
		}, {
			name: 'Green Peppers',
			type: 'veggie'
		}, {
			name: 'Onions',
			type: 'veggie'
		}, {
			name: 'Banana Peppers',
			type: 'veggie'
		}, {
			name: 'Black Olives',
			type: 'veggie'
		}, {
			name: 'Green Olives',
			type: 'veggie'
		}, {
			name: 'Jalapenos',
			type: 'veggie'
		}, {
			name: 'Sundried Tomatoes',
			type: 'veggie'
		}, {
			name: 'Pineapple',
			type: 'veggie'
		}])
	)
	.then(disconnect)
	.catch(console.error)


