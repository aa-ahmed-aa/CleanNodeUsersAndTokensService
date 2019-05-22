const userRoutes = require('./usersService/UserRoutes');
const tokenRoutes = require('./tokensService/TokenRoutes');

module.exports = app => {
    userRoutes(app);
    tokenRoutes(app);

    app.use((req, res) => {
        res.status(404).send({ url: `${req.originalUrl} not found` });
    });
};
