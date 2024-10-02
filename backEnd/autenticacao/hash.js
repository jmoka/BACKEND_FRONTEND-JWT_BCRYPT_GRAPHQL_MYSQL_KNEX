const bcrypt = require('bcrypt')

const AutenticarHash = {

    async Criarhash(senha) {
        try {
            const hash = await bcrypt.hash(senha, 10) // Gera o hash da senha a partir da variável de ambiente
            return hash
        } catch (error) {
            console.error(error)
            throw error
        }

    },

    async Autenticar(senha, hash) {
        const comparacao = bcrypt.compareSync(senha, hash)
        console.log(comparacao);

        try {
            if (comparacao) {
                console.log(`a Senha ${senha} coresponde ao hash informado ${hash}`);
                return "x"
            }
        } catch (error) {

        }
    }

}


module.exports = AutenticarHash
