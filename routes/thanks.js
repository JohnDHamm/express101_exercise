'use strict';

const { Router } = require('express');

const router = Router();

router.get('/thanks', (req, res) => {
	res.render('thanks', {page: 'Thanks'})
});

module.exports = router;
