<template>
   

        <div 
            
            class="grid-container-inner"
        >
            <div class="page-header">
                Projects
            </div>

            <div 
                v-if="projects.length"
                class="project-overview"
            >
                
                    
                    <div v-for="project in projects" :key="project.name" style="text-align: left;">
                        <SingleProject :project="project" />
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
                // { name: 'AddCustomer', display: 'Add customer', type: 'route', route: 'AddCustomer' },
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
    }
}
</script>


<style scoped>

    .project-overview {
        display: inline-grid;
        margin-left: 30px;
	    grid-template-rows: 60px 60px;
        grid-row-start: 4;
        grid-column-start: 2;
        grid-column-end: 6;
    }

    .action-bar {
        grid-row-start: 4;
        grid-column-start: 7;
        grid-column-end: 7;
    }
</style>
