const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth.middleware');
const movieController = require('../../../controllers/movies.controller');

router.get('/', auth, movieController.getAllMovies);
router.post('/', auth, movieController.addMovie);

module.exports = router;
