<!--

-->

<template>
	
    <div class="grid-container-inner">
        
        <div class="customer-form">
            <form
                @submit.prevent
                style="display:flex;flex-direction: row;align-items: center;"
            >
                <input
                    type="text" 
                    placeholder="Customer" 
                    v-model="customer"
                    style="border:none;padding:20px;margin:10px;width:100%;background-color:rgb(240,240,240);"
                />
            </form>
            <div 
                v-if="displayMessage"
                class="form-message"
            >{{message}}</div>
        </div>

        <ActionBar 
            :actions="actions"
            class="action-bar"
        />

        
    </div>
</template>


<script>
import { mapState } from "vuex";
import ActionBar from '../../components/ActionBar';
import DataTable from '../../components/DataTable';

export default {
    
	components: {
        DataTable,
        ActionBar
    },

    data() {
        return {
            actions:[
                { name: 'create', display: 'Create', type: 'action', callback: this.addCustomer},
                { name: 'cancel', display: 'Cancel', type: 'action', callback: this.cancel},
                
            ],
            customer: '',
            displayMessage: false,
            message: ''
        }
    },

	computed: {

		...mapState({
            
		}),
	},


    methods: {

        async addCustomer() {
            
            const result = await this.$store.dispatch(
                "addCustomer", 
                {
                    vm: this,
                    params: {
                        customerData: {
                            name: this.customer
                        }
                    },
                }
            );

            this.message = result.data;
            this.displayMessage = true;

            setTimeout( () => { 
                this.displayMessage = false;
                this.$router.go(-1);
            }, 1000);
        },


        cancel(){

            this.$router.go(-1);
        }
    },


	created() {

        // this.$store.dispatch(
        //     "fetchCustomers", 
        //     {
        //         vm: this,
        //         params: {
        //         },
        //     }
        // );
	}
};
</script>

<style scoped>
    .customer-form {
        display: inline-grid;
        margin-left: 30px;
	    grid-template-rows: 60px 60px;
        grid-row-start: 4;
        grid-column-start: 2;
        grid-column-end: 4;
    }

    .form-message {
        display: flex;
        margin-left: 30px;
        grid-row-start: 5;
    }

    .action-bar {
        grid-row-start: 4;
        grid-column-start: 5;
        grid-column-end: 5;
    }
    
    /* .add {
        width:160px;
        border:none;
        padding:20px;
        margin:50px;
        background-color:white;
        color: #555;
        border-bottom: 1px solid #999;
    }

    .add:hover {
        color: #fdaf06e1;
        border-bottom: 1px solid #fdaf06e1;  
    } */

</style>
