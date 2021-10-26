<template>
    <div class="grid-column">

        <div v-for="action in actions" :key="action.name" style="text-align: left;">

            <!-- execute callback -->
            <label 
                v-if="action.type=='action'"
                class="action" 
                @click="action.callback"
            >
                {{action.display}}
            </label>

            <!-- go to page -->
            <label 
                v-else-if="action.type=='route'"
                class="action" 
                @click="goToPage(action.route)"
            >
                {{action.display}}
            </label>
        </div>
    </div>
</template>



<script>

export default {

    name: "ActionBar",
    
    props:['actions'],

    components: {
        
    },
 
    data() {
        return {
            
        }
    },
 
 
    methods: {

        goToPage(page, params){

            params = params || {};
            this.$router.push({ 
                name: page, 
                params: params
            });
        },

    }

};
</script>
 
 
<style>
    .grid-column{

        margin-right: 20px;
    }
</style>