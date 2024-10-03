const bcrypt = require('bcrypt');

const AutenticarHash = {
    // Função para criar o hash da senha
    async criarHash(senha) {
        try {
            const saltRounds = 10; // Número de saltos para o bcrypt
            const hash = await bcrypt.hash(senha, saltRounds);
            return hash;
        } catch (error) {
            console.error('Erro ao criar hash:', error);
            throw new Error('Erro ao criar hash da senha.');
        }
    },

    // Função para autenticar a senha fornecida com o hash armazenado
    async autenticar(senha, hash) {
        try {
            const comparacao = await bcrypt.compare(senha, hash);
            if (comparacao) {
                //  console.log(`A senha fornecida corresponde ao hash armazenado.`);
                return true;
            } else {
                //  console.log(`A senha fornecida NÃO corresponde ao hash armazenado.`);
                return false;
            }
        } catch (error) {
            //  console.error('Erro ao autenticar senha:', error);
            throw new Error('Erro ao autenticar senha.');
        }
    }
}

module.exports = AutenticarHash;
