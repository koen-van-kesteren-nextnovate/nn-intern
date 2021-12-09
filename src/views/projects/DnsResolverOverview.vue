<!--

    TODO

        [ ] rare bug: als je terug komt van AddCustomer pagina dan ziet de layout er helemaal anders uit!

-->

<template>
	<div>
    
        <!-- <div class="grid-container-inner"> -->
        <div class="page-container">

            <div class="component-wrapper-center">

                <div class="page-header">
                    customers
                </div>
                
                <div class="option-picker">
                    <div v-for="customer in customers" :key="customer" style="text-align: center;">
                        <label class="list-action" @click="goToPage('DnsResolver',{id:customer.id})"> {{ customer.customerName }} </label>
                    </div>
                </div>

            </div>

            <ActionBar 
                :actions="actions"
                class="action-bar"
            />

        </div>
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
            headers: ["customers"],
            actions: [ 
                { name: 'AddCustomer', display: 'Add customer', type: 'route', route: 'AddCustomer' },
                { name: 'cancel', display: 'Return', type: 'action', callback: this.cancel},
            ]
            // records:[{values:[{value: ''}]}],
            // customers: ['NextNovate', 'test 1', 'test 2']
        }
    },

	computed: {

		...mapState({

            customers: state => {
               
                let records = [];

                // let customers = JSON.parse(JSON.stringify(state.dnsRecords));

                return JSON.parse(JSON.stringify(state.customers));
            }
		}),

        customerRecords(){

            let records = [];

            this.customers.forEach( customer => {

                records.push({
                    values: [{value: customer}]
                });
            });

            return records;
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


        download(){

        },


        groupBy(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        },


        cancel(){

            this.$router.go(-1);
        }
    },


	created() {

        // this.$store.commit('setUserPath', ['test']);

        this.$store.dispatch(
            "fetchCustomers", 
            {
                vm: this,
                params: {
                    // domain: domain
                },
            }
        );
	}
};
</script>

<style scoped>

    /* .page-header {
        grid-column-start: 2;
        grid-column-end: 6;
        display: block;
        line-height: 100px;
        text-align: center;
        font-size: 180%;
        font-weight: 900;
        margin-left: 30px;
        color: rgb(180, 180, 180);
        background: white;
    } */

    /* .data-table {
        grid-row-start: 2;
        grid-column-start: 2;
        grid-column-end: 3;
    } */

    /* .customer-overview {
        display: inline-grid;
        margin-left: 30px;
	    grid-template-rows: 60px 60px;
        grid-row-start: 4;
        grid-column-start: 2;
        grid-column-end: 6;
    } */

    .action-bar {
        grid-row-start: 3;
        grid-column-start: 7;
        grid-column-end: 7;
    }
</style>
