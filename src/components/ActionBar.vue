<template>
    <div class="action-layout">

        <div 
            v-for="action in actions" 
            :key="action.name"
        >

            <!-- execute callback -->
            <label 
                v-if="action.type=='action'"
                class="action" 
                @click="action.callback(action.params)"
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
            isLoading: false
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


        setIsLoading(flag){

            this.isLoading = flag;
        }

    }

};
</script>
 
 
<style>
    .action-layout{
        display: table;
        margin-top: 50px;
        margin-left: 20px;
    }
    /* 
    .action:disabled {
        background: #dddddd;
    } */
</style>