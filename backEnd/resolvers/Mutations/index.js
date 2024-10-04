
const ResolverMutationUsuarios = require('./Usuarios/ResolverMutationUsuarios')
const ResolverMutationPerfis = require("./Perfis/ResolverMutationPerfis")

module.exports = {
    ...ResolverMutationUsuarios,
    ...ResolverMutationPerfis
}