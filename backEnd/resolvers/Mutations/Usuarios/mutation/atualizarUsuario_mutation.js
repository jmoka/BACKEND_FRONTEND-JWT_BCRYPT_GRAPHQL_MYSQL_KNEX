const db = require("@data/db");

module.exports = {
    async alterarUsuario(user, filtro) {
        const { id } = filtro;
        console.log("filtro ID: " + id);

        const atualizacoes = {
            nome: user.nome,
            email: user.email,
            perfil: user.perfil,
            status: user.status,
        };

        try {
            if (id) {
                // Atualiza o usuário na tabela `usuarios`
                await db("usuarios")
                    .where({ id })
                    .update(atualizacoes);

                let usuarioEncontrado = await db("usuarios")
                    .where({ id }).first();

                if (!usuarioEncontrado) {
                    throw new Error("Usuário não encontrado.");
                }

                // Busca o perfil atualizado do usuário
                const perfil = await db("perfis").where({ id: usuarioEncontrado.perfil }).first();
                
                const retorno = {
                    id: usuarioEncontrado.id,
                    nome: usuarioEncontrado.nome,
                    email: usuarioEncontrado.email,
                    status: usuarioEncontrado.status,
                    dataCriacao: usuarioEncontrado.data_criacao,
                    perfil: {
                        id: perfil.id,
                        nome: perfil.nome,
                        rotulo: perfil.rotulo
                    }
                };

                console.log(`Usuário com ID: ${retorno.id} atualizado com sucesso!`);

                // Atualiza a associação específica do perfil na tabela `usuarioPerfis`
                await db("usuarioPerfis")
                    .where({ usuario_id: id })  // Adicione a condição para o ID do usuário
                    .update({
                        perfil_id: user.perfil
                    });

                console.log(`Tabela usuarioPerfis atualizada para o usuário com ID: ${id} e perfil ID: ${user.perfil}`);

                return retorno;
            } else {
                throw new Error("Nenhum critério válido foi fornecido para atualizar o usuário.");
            }
        } catch (error) {
            throw new Error(`Erro ao atualizar usuário: ${error.message}`);
        }
    }
};
