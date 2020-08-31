const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./openApiDocumentation');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

require("./routes").deelRoute(app);

module.exports = app;
