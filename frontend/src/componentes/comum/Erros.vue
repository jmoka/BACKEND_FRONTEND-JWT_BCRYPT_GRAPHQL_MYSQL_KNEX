<template>
    <div v-if="itens">
        <v-alert v-for="(i,index) in itens" :key="index" :value="true" type="error">
            {{ i.msg }}
        </v-alert>
    </div>
</template>

<script>
export default {
    props: ['erros'],
    computed: {
    itens() {
        if (!this.erros) return null;

        const e = this.erros;
        const itens = [];

        if (e.graphQLErrors) {
            itens.push(...e.graphQLErrors);
        }

        if (e.networkError) {
            itens.push({ msg: e.networkError.message });
        }

        if (itens.length === 0) {
            itens.push({
                msg:  'Email já Cadastrado.',
            });
        }

        return itens;
    }
}

}
</script>

<style></style>
