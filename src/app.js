require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const movieRoutes = require('./routes/api/v1/movies.routes');
const errorHandler = require('./utils/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use('/api/v1/movies', movieRoutes);

const PORT = process.env.APP_PORT || 3000;

sequelize.sync().then(() => {
  console.log('DB synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
