const { Movie, Actor } = require('../models');

exports.getAllMovies = async (req, res) => {
  const movies = await Movie.findAll({ include: Actor });
  res.json(movies);
};

exports.addMovie = async (req, res) => {
  const { title, year, format, actors } = req.body;

  const movie = await Movie.create({ title, year, format });

  if (Array.isArray(actors)) {
    const actorInstances = await Promise.all(
      actors.map(name => Actor.findOrCreate({ where: { name } }))
    );
    await movie.addActors(actorInstances.map(([actor]) => actor));
  }

  const fullMovie = await Movie.findByPk(movie.id, { include: Actor });
  res.status(201).json(fullMovie);
};
