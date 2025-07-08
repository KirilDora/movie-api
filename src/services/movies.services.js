const { Movie, Actor } = require('../models');

const MoviesModel = {
  async getAll({ sort, order, limit, offset }) {
    const validFields = ['title', 'year', 'format'];
  const sortField = validFields.includes(sort) ? sort : 'title';

  return await Movie.findAll({
    include: Actor,
    order: [[sortField, order]],
    limit,
    offset
  });
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
  },

  async getById(id) {
    const movie = await Movie.findByPk(id, { include: Actor });
    return movie;
  },

  async deleteById(id) {
  const movie = await Movie.findByPk(id);
  if (!movie) return null;

  await movie.setActors([]); // delete dependencies many-to-many
  await movie.destroy();
  return true;
}
};

module.exports = { MoviesModel };
