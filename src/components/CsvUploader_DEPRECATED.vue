<!--

    TODO

    [/] add customer fixen
        - input veld zou na submit van nieuwe klant leeggemaakt moeten worden
        

-->


<template>

    <div class="grid-container-inner">
        
        <div class="grid-column">
            <div>
                <label 
                    class="action" 
                    @click="$router.go(-1)"
                >
                    <!-- &lt; -->
                    ⇦
                </label>
            </div>
            <div>
                <label class="action">
                    <input 
                        type="file" 
                        ref="myFile" 
                        @change="selectedFile"
                    >
                        Upload csv
                    <br/>
                </label>
            </div>
            
            <div>
                <label 
                    class="action" 
                    @click="processRecords"
                >
                    Submit
                </label>
            </div>
            
        </div>

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

        <DataTable 
            :headers="headers" 
            :data="records" 
            :editable="true"
            class="data-table"
        />

    </div>

</template>
 
<script>

import DataTable from '../components/DataTable';

export default {

    name: "CsvUploader",
    
    props:['submitCallback'],

    components: {
        DataTable
    },
 
    data() {
        return {
            headers: ["domain"],
            records:[{values:[{value: ''}]}],
            // customers: ['NextNovate', 'test'],
            newCustomer: '',
            selectedCustomer: '',
            test: ['one', 'two', 'three'],
            testVal: null,
            displayMessage: false,
            message: ''
        }
    },
 
 
    methods: {

        selectedFile(e) {
            
            let file = this.$refs.myFile.files[0];

            this.readFile(file, this.extractData);
        },


        readFile(file, callback){

            if(!file || file.type.substr(0,5) !== 'text/') return;
            
            let reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload =  evt => {
                this.text = evt.target.result;
                callback();
            }
            reader.onerror = evt => {
                console.error(evt);
            }
        },


        extractData(){

            this.records = [];
            let lines = this.text.split("\n");

            lines.forEach(line => {
                
                let record = {
                    values:[]
                };
                line.split(';').forEach( item => {
                    record.values.push({
                        value: item
                    });
                });

                this.records.push(record);
            });

            this.$forceUpdate();
        },


        async processRecords(){

            // extract dataTable records to array
            let recordData = [];
            this.records.forEach( record => {
                let arr = [];
                record.values.forEach( field => {
                    arr.push(field.value);
                })
                recordData.push(arr);
            })

            // execute callback
            let result = await this.submitCallback(recordData);

            this.displayMessage = true;
            this.message = result;
        },


        acceptResult(){

            this.message = null;
            this.displayMessage = false;
        }

    }
   
};
</script>
 
 
<style>

    input[type="file"] {
        display: none;
    }
    
    .customer-select {
        grid-row-start: 1;
        grid-column-start: 2;
        grid-column-end: 3;
    }

    .data-table {
        grid-row-start: 2;
        grid-column-start: 2;
        grid-column-end: 3;
    }

    .select-editable {
        position:relative;
        background-color:white;
        /* border:solid grey 1px; */
        border: none;
        margin: 30px;
        width:120px;
        height:50px;
    }
    .select-editable select {
        position:absolute;
        top:0px;
        left:0px;
        font-size: 15px;
        border:none;
        background: rgb(230, 230, 230);
        width:160px;
        height:50px;
        margin:0;
    }
    .select-editable input {
        position:absolute;
        top:0px;
        left:0px;
        width:140px;
        height:50px;
        padding:0px;
        font-size: 15px;
        border:none;
    }
    .select-editable select:focus, .select-editable input:focus {
        outline:none;
    }

    .result-dialog {
        white-space: pre;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color:#555;
        background:rgba(255, 255, 255, 0.9);
        border:4px solid rgb(230, 230, 230);
        box-shadow: 0 0 10px rgb(145, 144, 144);
        width:60%;
        position:fixed;
        top:30%;
        left: 20%;
        z-index: 100;
    }

    #accept-button {
        border:none;
        padding: 12px 16px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #999;
        /* background: rgb(220, 220, 220); */
        background: rgb(230, 230, 230);
        
    }
</style>
 

