const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth.middleware');
const movieController = require('../../../controllers/movies.controller');

router.get('/', auth, movieController.getAllMovies);
router.get('/:id', auth, movieController.getMovieById);
router.post('/', auth, movieController.addMovie);
router.delete('/:id', auth, movieController.deleteMovie);

module.exports = router;
