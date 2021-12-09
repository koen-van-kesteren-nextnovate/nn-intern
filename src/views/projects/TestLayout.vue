<template>
    <div>
	<!-- <div style="display: contents;"> -->
        <div class="test-container">
            <div class="table-wrapper">    
                <table>

                    <tr>
                        <td> {{text}} </td>
                        <td> {{text}} </td>
                        <td> {{text}} </td>
                        <td> {{text}} </td>
                    </tr>
                </table>
            </div>

            <div class="menu-bar">test test</div>
        </div>
    </div>
    <!-- </div> -->
</template>


<script>
import { mapState } from "vuex";
// import ActionBar from '../../components/ActionBar';
// import DataTable from '../../components/DataTable';
import storeHelpers from '@/methods/storeHelpers';

export default {
    
	components: {
        // DataTable,
        // ActionBar
    },

    data() {
        return {
            text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
        
        }
    },

	computed: {

	},


    methods: {

	},


    mounted() {

    }
};
</script>


<style scoped>

    .table-wrapper {


        display: flex;
        flex-direction: row;
        
        border: 1px solid red;

        height: calc(100vh - 200px);

        width: 100% !important;
        overflow-x: scroll; 

        /* border: 1px solid black; */
    }

    table {
        overflow-x: scroll;
    }

    th, td { min-width: 200px; }

    .test-container{
        
        display: flex;
        flex-direction: row;
        
        border: 1px solid red;
    }

    .menu-bar{

        text-align: top;
    }
</style>
