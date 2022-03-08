<template>
    <div style="display: grid;">
        <div 
            id="container"
            style="display:flex;flex-direction:row;justify-content: flex-start;"
        >
            <div 
                v-for="(tab, index) of tabs" 
                :key="index" 
                id="left" 
                
                @click="selectTab(index)"
            >
                <div 
                    v-if="index==selectedTab && contentData[index]" 
                    class="tab-selected"
                >
                    <!-- {{contentData[index]}} -->
                    {{contentData[index].header.substr(0,10)}}
                    
                    <div 
                        v-if="contentData[index].alert"
                        style="color:red;font-weight:bold;"
                    >
                        !
                    </div>
                </div>
                <div 
                    v-else-if="contentData[index]" 
                    class="tab"
                >
                    <!-- {{contentData[index]}} -->
                    {{contentData[index].header.substr(0,10)}} 
                    
                    <div 
                        v-if="contentData[index].alert"
                        style="color:red;font-weight: bold;"
                    >
                        !
                    </div>
                </div>
            </div>
        </div>
        <div
            class="tab-content"
        >
            {{contentData[selectedTab].value}}
        </div>
    </div>
</template>

<script>

export default {

    name: 'TabPanel',


    props:['data'],


    components: {
    },


    data() {
        return {
            selectedTab: 0
        }
    },


    computed: {

        contentData(){

            return this.data;
        },


        tabs(){
            
            let tmpArray = Array.apply(null, Array(this.data.length)).map(function () {});
            return tmpArray;
        }
    },

    
    methods: {

        selectTab(index){

            this.selectedTab = index;
        }
    },
}
</script>

<style>
    #container{
        width:100%;
        margin-bottom: 20px;
    }
    #left{
        float:left;
        width:100px;
    }

    .tab {
        display:flex;
        margin-right: 10px;
        border-bottom: 3px solid#999;
        padding:2px;
        font-size: 14px;
    }

    .tab:hover {
        color: #fdaf06e1;
    }

    .tab-selected {
        display:flex;
        margin-right: 10px;
        border-bottom: 3px solid#fdaf06e1;
        padding:2px;
        font-size: 14px;
    }

    .tab-selected:hover {
        color: #fdaf06e1;
    }

    .tab-content {
        padding:6px;
        margin-left:10px;
        margin-top:4px;
        font-size: 12px;
    }
    
</style>