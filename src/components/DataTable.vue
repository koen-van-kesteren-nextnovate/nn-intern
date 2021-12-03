<template>
    <div
        style="position:relative"
    >
    <table cellspacing="0" cellpadding="0">

        <!--
            add append button on top (if editable)
        -->
        <!-- <tr v-if="editable">
            <td 
                style="text-align:right; padding:6px; background:white;"
                :colspan="headerRecord.length"
            > 
                <!- - ...
                    class="fas fa-plus"
                    ...
                - ->
                <button
                    id="add-button"
                    @click="addRecord"
                >
                +
                </button>
            </td>
            <td>
            </td>
        </tr> -->

        <!-- 
            render headers
        -->
        <tr class="tr-headers">
            <td class="td-headers"
                v-for="(item, index) of headerRecord" 
                :key="index"
            >
                {{item}}
            </td>
        </tr>
        <tr><td> &nbsp; </td></tr>

        <!--
            if no data
        -->
        <!-- <template
            v-else-if="dataRecords.length==0"
        > -->
        <template
            v-if="dataRecords.length==0 && !isLoading"
        >
            <tr>
                <td 
                    :colspan="headerRecord.length" class="content-data"
                >
                    no data
                </td>
            </tr>
        </template>

        <!--
            display records
        -->
        <template
            v-else
            v-for="(record, index) in dataRecords.filter(property => {
                return ! property.hidden;
            })"
        >
            <!-- 
                render content panels 
            -->
            <tr v-if="record.type==='content-panel'">
                <td 
                    :colspan="headerRecord.length" class="content-data"
                >
                    <TabPanel :data="record.infoValues[record.showIndex]" />
                </td>
            </tr>
            <!-- 
                render main data records 
            -->
            <tr v-else class="tr-data">
                
                <template
                    v-for="(item, cellIndex) in record.values" 
                    :key="cellIndex"
                >
                    <td 
                        v-if="!item.action && !record.expanded" 
                    >
                        <input
                            v-if="editable==true"
                            type="text" 
                            placeholder="Enter domain name" 
                            v-model="item.value"
                            style="
                                background:white;
                                padding:12px; 
                                border:1px solid rgb(220, 220, 220);
                                margin-top:12px;
                            "
                        />
                        <div v-else>
                            <div>{{item.value}}</div>
                        </div>
                    </td>
                    <td
                        v-else-if="!item.action"
                        class="td-blurred"
                    >
                        <input
                            v-if="editable==true"
                            type="text" 
                            placeholder="Enter domain" 
                            v-model="item.value" 
                            style="
                                background:white;
                                border:1px solid rgb(220, 220, 220);
                                margin-top:12px;"
                        />
                        <div v-else>
                            <div> {{item.value}} </div>
                        </div>
                    </td>
                    
                    <!-- 
                        if field is an action
                    > -->
                    <td 
                        v-else-if="item.action === 'expand'"
                    >
                        <!-- ...
                            class="fas fa-caret-square-down"
                            ...
                        -->
                        <button 
                            v-if="!record.expanded"
                            id="expand-action" 
                            @click="unfold(record.rowIndex)"
                        >
                        ►
                        </button>
                        <!-- ...
                            class="fas fa-caret-square-up"
                            ...    
                        -->
                        <button 
                            v-else
                            id="expand-action"
                            @click="unfold(record.rowIndex)"
                        >
                        ▼
                        </button>
                    </td>
                    <td 
                        v-else-if="item.action === 'info'"
                    >
                        <div 
                            v-if="record.expanded && record.contentPanel.showIndex === cellIndex -1" 
                            class="tab-button"
                            @click="showInfo(record.rowIndex, cellIndex)"
                        >
                            <span 
                                v-if="item.value"
                                class="tab-text"
                            >
                                <label>{{headerRecord[cellIndex]}}</label>
                            </span>
                            <label  
                                v-if="item.value"
                                class="tab-action-selected"
                            >
                                &nbsp;&nbsp;&nbsp;&nbsp;
                            </label>
                            
                        </div>
                        <div 
                            v-else-if="record.expanded" 
                            class="tab-button"
                            @click="showInfo(record.rowIndex, cellIndex)"
                        >
                            <span 
                                v-if="item.value"
                                class="tab-text"
                            >
                                <label>{{headerRecord[cellIndex]}}</label>
                            </span>
                           
                            <label 
                                v-if="item.value"
                                class="tab-action" 
                            >
                                &nbsp;&nbsp;&nbsp;&nbsp;
                            </label>
                        </div>
                        <div v-else style="display: grid;">
                           
                            <span v-if="item.value">
                                <label style="color:green;">V</label>
                            </span>
                            <span v-else>
                                <label style="color:red;">X</label>
                            </span>
                        </div>
                        
                    </td>

                    <!-- 
                        if editable: add remove button
                    -->
                    <td 
                        v-if="editable"
                    >
                        <!-- ...
                            class="fas fa-trash"
                            ...  
                        -->
                        <button 
                            id="remove-button"
                            @click="removeRecord(index)"
                            style="background:white;margin-top:12px;"
                        >
                            ✖
                        </button> 
                        
                    </td>
                </template>
            </tr>
        </template>

        <!--
            if loading data
        -->
        <!-- <template
            v-if="isLoading"
        >
            <tr>
                <td 
                    :colspan="headerRecord.length" class="content-data"
                >
                    loading ...
                </td>
            </tr>
        </template> -->
        
        <!-- 
            if editable: add append button (to bottom)
        -->
        <template v-if="editable">
            <tr>
                <td 
                    style="text-align:center; padding:20px; background:white;"
                >
                    <button

                        id="add-button"
                        @click="addRecord"
                    >
                    +
                    </button>
                </td>
                <td>
                </td>
            </tr>
        </template>
    </table>

    <div 
        v-if="isLoading"
        class="loading-screen"
    >
        <div style="font-size: large;">
            loading ...
        </div>
    </div>

    </div>
</template>


<script>

import TabPanel from '../components/TabPanel';
 
export default {

    name: "DataTable",
    

    props:['headers', 'data', 'actions', 'editable'],


    components: {
        TabPanel
    },
 

    data() {
        return {
            isLoading: false
        }
    },
 

    computed: {
        dataRecords(){

            let processedRecords = [];
            this.data.forEach( (item, index) => {

                if (item.contentPanel) {

                    item.values = [{value: '', action: 'expand'}].concat(item.values);
                    item.contentPanel.type = 'content-panel';
                    item.contentPanel.hidden = true;
                    item.expanded = false;
                    processedRecords.push(item);
                    processedRecords.push(item.contentPanel);
                }
                else{
                    processedRecords.push(item);
                }

                item.rowIndex = index;
            });
            
            return processedRecords;
        },


        headerRecord(){

            let processedRecord = [];

            
            if(this.actions=='expand'){

                processedRecord = [''];
            }
            processedRecord = processedRecord.concat(this.headers);

            if(this.editable){

                processedRecord.push('');
            }

            return processedRecord;
        }
    },


    methods: {

        unfold(index){
             
            this.data[index].contentPanel.hidden = !this.data[index].contentPanel.hidden;
            this.data[index].expanded = !this.data[index].expanded;
            
            this.$forceUpdate();
        },


        showInfo(recordIndex,itemIndex){

            this.data[recordIndex].contentPanel.showIndex = itemIndex - 1;

            this.$forceUpdate();
        },


        addRecord(){

            this.data.push(
                    {            
                        values:[{value: ''}],
                        rowIndex: 0
                    }
                );
        },


        removeRecord(recordIndex){

            this.data.splice(recordIndex,1);
        },


        setIsLoading(flag){

            this.isLoading = flag; 
        }
    },


    created(){
        // console.log(this.dataRecords.length);
    },


    updated(){
        // console.log(this.dataRecords.length);
    }
   
};
</script>
 
<style scoped>

    input {
        border-top-style: hidden;
        border-right-style: hidden;
        border-left-style: hidden;
        border-bottom-style: hidden;
        background-color: #eee;
    }

    table {
        height: 110px;
        border-spacing: 0px 2px;
        margin-left: 30px;
        border: none;

        text-align: left;    
    }

    tr {
        /* ... */
    }

    td {
        
        height: inherit;
        white-space:pre;
        padding: 0px 0px;
        border-spacing: 0px;
        color: rgb(56, 56, 56);
        font-weight: 250;
    }

    .td-blurred {
        
        padding: 0px 0px;
        border-spacing: 0px;
        color: rgb(184, 182, 182);
        font-weight: 250;
    }
    

    .tr-headers{
        background: #999
    }

    .td-headers{
        /* color: white; */
        color: rgb(180, 180, 180);
        /* background: rgb(180, 180, 180); */
        background: white;
        height: 50px;
        font-weight: 900;
        border-bottom: 1px solid#999;
        padding: 10px;
    }

    .tr-data{
        /* background: rgb(230, 230, 230); */
        background: white;
        height: 50px;
    }

    .content-data{
        background: rgb(240, 240, 240);
        border: 3px solid white;
        padding: 6px 20px;
        text-align: left;
    }

    #expand-action {
        border: none;
        color: #999;
        /* background: rgb(220, 220, 220); */
        /* background: rgb(230, 230, 230); */
        background: white;
        font-weight: 900;
        cursor: pointer;
    }

    #expand-action:hover {
        color: #fdaf06e1;
    }

    .tab-button {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-content: center;
        cursor: pointer;
    }

    .tab-button:hover {
        color: #fdaf06e1;
    }

    .tab-text {
        margin-top: 12px;
    }


    #add-button {
        border:none;
        padding: 4px 4px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        color: #999;
        /* background: rgb(230, 230, 230); */
        background: white;
    }

    #add-button:hover {
        background-color: #fdaf06e1;
        color: white;
    }

    #remove-button {
        border:none;
        background-color: rgb(230, 230, 230);
        color: rgb(160, 160, 160);
        font-size: 16px;
    }

    #remove-button:hover {
        color: #fdaf06e1;
    }

    .loading-screen {
        
        white-space: pre;
        display: flex;
        justify-content: center;
        
        background:rgba(255, 255, 255, 0.6);
       
        width:100%;
        
        /* 
            [ ] harde waarde is lelijk, hoe oplossen?
            
                - 'height = 100%' werkt ook niet (want deze waarde beweegt niet mee met de parent container)
        */
        height: 1000vh;
        
        position:absolute;
        top:0;
        /* left: 0%; */
        z-index: 100;
    }

/********************************

    bold style table

*********************************


    input {
        border-top-style: hidden;
        border-right-style: hidden;
        border-left-style: hidden;
        border-bottom-style: hidden;
        background-color: #eee;
    }

    table {
        height: 110px;
        border-spacing: 0px 2px;
        margin-left: 30px;
        border: none;
    }

    tr {
    }

    td {
        height: inherit;
        white-space:pre;
        padding: 0px 0px;
        border-spacing: 0px;
        color: rgb(56, 56, 56);
        font-weight: 250;
    }

    .td-blurred {
        
        padding: 0px 0px;
        border-spacing: 0px;
        color: rgb(184, 182, 182);
        font-weight: 250;
    }
    

    .tr-headers{
        background: #999
    }

    .td-headers{
        color: white;
        background: rgb(180, 180, 180);
        height: 50px;
        font-weight: 900;
    }

    .tr-data{
        background: rgb(230, 230, 230);
        height: 50px;
    }

    .content-data{
        background: rgb(240, 240, 240);
        border: 3px solid white;
        padding: 6px 20px;
        text-align: left;
    }

    #expand-action {
        border: none;
        color: #999;
        background: rgb(230, 230, 230);
        font-weight: 900;
        cursor: pointer;
    }

    #expand-action:hover {
        color: #fdaf06e1;
    }

    .tab-button {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-content: center;
        cursor: pointer;
    }

    .tab-button:hover {
        color: #fdaf06e1;
    }

    .tab-text {
        margin-top: 12px;
    }

    .tab-action {
        margin-top: auto;
        line-height: 4px;
        margin-left: 4px;
        margin-right: 4px;
        font-weight: 900;
        color: white;
        background: rgb(183, 183, 183);
        cursor: pointer;
    }

    .tab-action-selected{
        margin-top: auto;
        line-height: 4px;
        margin-left: 4px;
        margin-right: 4px;
        font-weight: 900;
        color: white;
        background: #fdaf06e1;
        cursor: pointer;
    }

    #add-button {
        border:none;
        padding: 4px 4px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #999;
        background: rgb(230, 230, 230);
    }

    #add-button:hover {
        background-color: #fdaf06e1;
        color: white;
    }

    #remove-button {
        border:none;
        background-color: rgb(230, 230, 230);
        color: rgb(160, 160, 160);
    }

    #remove-button:hover {
        color: #fdaf06e1;
    }

/*******************************
    
    flying blocks style table
    
********************************    

    table {

        height: 110px;
        border-spacing: 10px 10px;
        margin: -10px 0
    }
    td {
        
        white-space:pre;
        padding: 0px 0px;
        border-spacing: 0px;
        height: 50px;
        color: rgb(56, 56, 56);
        font-weight: 250;
    }
    tr {
        background: #999
    }

    .tr-headers{
        background: #999
    }

    .td-headers{
        color: white;
        background: #999
    }

    .tr-data{
        background: rgb(209, 209, 209);
        
    }

    .content-data{
        background: rgb(228, 228, 228);
        border: 3px solid white;
        padding: 6px 20px;
        text-align: left;
    }

    .expand-action {
        line-height: 36px;
        text-align: center;

        font-weight: 900;
        color: white;
        background: rgb(209, 209, 209);
        
        cursor: pointer;
    }

    .tab-button {
        display: grid;
        grid-template-rows: 40px auto;
        cursor: pointer;
    }

    .tab-action {
        
        line-height: 10px;
        text-align: center;

        font-weight: 900;
        color: white;
        background: rgb(184, 183, 183);
        
        cursor: pointer;
    }

    .tab-action-selected{
        
        line-height: 10px;
        text-align: center;

        font-weight: 900;
        color: white;
        background: #fdaf06e1;
        
        cursor: pointer;
    }

**********************************/

</style>
 

