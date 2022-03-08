<template>

    <div class="page-container">

        <div class="component-wrapper-center">

            <div class="page-header">
                Projects
            </div>

            <div 
                v-if="projects.length"
                class="option-picker"
            >
                
                <div 
                    v-for="project in projects" 
                    :key="project.name" 
                    style="text-align: left;"
                >
                    <SingleProject :project="project" />
                </div>
                
            </div>
        </div>
        
        <ActionBar 
            :actions="actions"
            class="action-bar"
        />
        
    </div>

</template>



<script>
import ActionBar from '../components/ActionBar';
import SingleProject from '../components/SingleProject';

export default {

    name: 'Projects',


    components: {
        SingleProject,
        ActionBar
    },


    data() {

        return {

            actions: [
                { 
                    name: 'cancel', 
                    display: 'Return', 
                    type: 'action', 
                    callback: this.cancel
                },
            ],

            projects: [
                {
                    'display': 'DNS Resolver',
                    'name': 'DnsResolverOverview',
                    'route': 'dns-resolver/dns-resolver-overview',
                    'description': 'Check DNS records for domains \n - Upload domain names for periodic updates' 
                },
                {
                    'display': 'Test',
                    'name': 'TestLayout',
                    'route': 'test-layout',
                    'description': 'test test test'
                }
            ]
        }

    },


    methods: {

        cancel(){

            this.$router.go(-1);
        }
    }
}
</script>


<style scoped>

    .action-bar {
        /* grid-row-start: 4;
        grid-column-start: 7;
        grid-column-end: 7; */
    }
</style>
