<!--


    WIP WIP WIP


    - wordt nog niet gebruikt (aug 2021)


-->


<template>
    <div 
            v-if="displayMessage"
            class="result-dialog"
        >
            <label
                style="text-align:left;margin:20px;"
            >{{message}}</label>
            <!-- <button 
                class="fas fa-check"
                id="accept-button" 
                @click="acceptResult"
            >
            </button>  -->
            <button
                id="accept-button" 
                @click="acceptResult"
            >
                OK
            </button> 
        </div>
</template>


<script>

export default {

    // props: ['project', 'params'],

    data() {
        return {
            message: '',
            displayMessage: false
        }
    },

    methods: {

        acceptResult(){

            this.message = null;
            this.displayMessage = false;
        }
    }
}
</script>


<style>
</style>
