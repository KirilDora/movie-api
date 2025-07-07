require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const movieRoutes = require('./routes/movies.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/movies', movieRoutes);

const PORT = process.env.APP_PORT || 3000;

sequelize.sync().then(() => {
  console.log('DB synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
