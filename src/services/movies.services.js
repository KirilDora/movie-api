const { Movie, Actor } = require('../models');

const MoviesModel = {
  async getAll() {
    return await Movie.findAll({ include: Actor });
  },

  async add({ title, year, format, actors }) {
    if (!title || !year || !format) {
      throw new Error('Missing required fields');
    }

    const movie = await Movie.create({ title, year, format });

    if (Array.isArray(actors)) {
      const actorInstances = await Promise.all(
        actors.map(({ firstName, lastName }) =>
          Actor.findOrCreate({
            where: { firstName, lastName }
          })
        )
      );
      await movie.addActors(actorInstances.map(([actor]) => actor));
    }

    return await Movie.findByPk(movie.id, { include: Actor });
  }
};

module.exports = { MoviesModel };
