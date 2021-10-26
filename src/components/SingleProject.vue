<template>
    <label class="list-action" @click="goToProject"> {{ project.display }} </label>
</template>


<script>

export default {

    props: ['project', 'params'],

    data() {
        return {
        }
    },

    methods: {

        goToProject() {
            
            this.$router.push({ 
                name: this.project.name, 
                params: this.params 
            });
        }
    }
}
</script>


<style>
</style>
