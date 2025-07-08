const { MoviesModel } = require('../services/movies.service');

exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await MoviesModel.getAll();
    res.json(movies);
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
