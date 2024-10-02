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

    }




}


module.exports = AutenticarHash;
