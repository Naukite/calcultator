const express = require('express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
app.use(express.json());

// Ruta al archivo api.yml
const apiSpec = path.join(__dirname, 'api.yml');

// Configura Swagger
const swaggerDocument = YAML.load(apiSpec);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
    OpenApiValidator.middleware({
        apiSpec,
        validateRequests: true,
        validateResponses: true, // Habilita la validación de las respuestas
        ignorePaths: (path) => path.startsWith('/api-docs') // Ignora la validación para la ruta /api-docs

    }),
);

app.post('/ejecutar', (req, res) => {
    const { operando1, operando2, operador } = req.body;

    let resultado;
    switch (operador) {
        case '+':
            resultado = operando1 + operando2;
            break;
        case '-':
            resultado = operando1 - operando2;
            break;
        case '*':
            resultado = operando1 * operando2;
            break;
    }

    res.json({ resultado });
});

// Middleware de manejo de errores
// app.use((err, req, res, next) => {
//     // Formatea los errores de validación de OpenAPI
//     if (err.status === 400 && err.message.startsWith('request')) {
//         return res.status(err.status).json({ error: err.message });
//     }

//     // Manejo de errores genérico
//     res.status(500).json({ error: 'Error interno del servidor' });
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
