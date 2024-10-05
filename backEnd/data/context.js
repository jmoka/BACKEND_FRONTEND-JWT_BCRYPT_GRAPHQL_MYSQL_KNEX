module.exports = async ({ req }) => {
    await require('./simularUsuarioLogado')(req)
    const auth = req.headers.authorization
    return { req, auth }
};
