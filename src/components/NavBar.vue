<template>
    <div
        class="unfolded" 
    >    
        <div>   

            <!-- top buttons -->
            <div
                v-if="currentPage !== 'Home'"
            >
                 <router-link 
                    class="action" 
                    :to="{ name: 'Home' }"
                >
                    Home
                </router-link>
            </div>
            
            <!-- dynamic buttons -->
            <div 
                v-if="moduleLinks && moduleLinks.length > 0"
                v-for="link in moduleLinks" :key="link"
            >
                <router-link 
                    class="action" 
                    :to="{ name: link.path }"
                >
                    <!-- {{getDisplayName(link)}} -->
                    {{link.displayName}}
                </router-link>
            </div>

            <!-- bottom buttons -->
            <div>
                <router-link 
                    class="action" 
                    :to="{ name: 'About' }"
                >
                    About
                </router-link>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState } from "vuex";

export default {

    name: 'NavBar',

    components: {

    },

    data() {
        return {
            atHome: true,
            activeId: null,
            moduleLinks: []
        }
    },

    computed: {

        currentPage: function () {
            
            return this.$route.name;
        },

        ...mapState({

            userPaths: state => {
               
                return JSON.parse(JSON.stringify(state.userPaths));
            },
		}),
    },

    watch: {

        currentPage: function (val) {

            this.setModuleLinks();
        },
    },

    methods: {

        setModuleLinks(){
            
            this.moduleLinks = this.userPaths[this.currentPage];
        },


        getDisplayName(name){
            
            let result = name.replace(/([A-Z])/g, " $1");
            let displayName = result.charAt(0).toUpperCase() + result.slice(1);
            return displayName;
        }
    },

    
	created() {

        this.setModuleLinks();
	}
}
</script>

<style>

    .unfolded {
        display: grid;
        grid-row-start: 3;
        grid-column-start: 1;
        grid-column-end: 2;
        padding: 20px;
    }

    .folded {
        display: inline-block;
        grid-row-start: 2;
        grid-column-start: 1;
        grid-column-end: 1;
    }

</style>