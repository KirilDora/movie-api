const { MoviesModel } = require('../services/movies.service');

exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await MoviesModel.getAll();
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await MoviesModel.getById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    next(error);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    const result = await MoviesModel.add(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const result = await MoviesModel.deleteById(req.params.id);
    if (!result) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    next(error);
  }
};
