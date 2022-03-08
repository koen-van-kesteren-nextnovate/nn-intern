<template>
	
    <div class="page-container">
        
        <div
            v-if="viewType=='complete'"
            v-bind:class="[ {'overlay-wrapper': isLoading}, 'component-wrapper' ]"
        >

            <DataTable
                ref="dataTable"
                :headers="tableHeaders1" 
                :data="dnsRecords1"
                :actions="tableActions1"
                class="data-table"
            />

            <div 
                v-if="isLoading"
                class="loading-screen"
            >
                <div style="font-size: large;">
                    loading {{customerDomains.length}} domains
                </div>
            </div>

        </div>

        <div
            v-else-if="viewType=='lastScan'"
            v-bind:class="[ {'overlay-wrapper': isLoading }, 'component-wrapper' ]"
        >

            <DataTable
                ref="dataTable"
                :headers="tableHeaders2" 
                :data="dnsRecords2"
                :actions="tableActions2"
                class="data-table"
            />

            <div 
                v-if="isLoading"
                class="loading-screen"
            >
                <div style="font-size: large;">
                    loading {{customerDomains.length}} domains
                </div>
            </div>

        </div>

        <ActionBar 
            ref="actionBar"
            :actions="actions"
            class="action-bar"
        />

        <div 
            v-if="displayMessage"
            class="result-dialog"
        >
            <label
                style="text-align:left;margin:20px;"
            >
                {{message}}
            </label>
            <button
                id="accept-button" 
                @click="acceptResult"
            >
                OK
            </button> 
        </div>
    </div>
</template>


<script>
import { mapState } from "vuex";
import ActionBar from '../../components/ActionBar';
import DataTable from '../../components/DataTable';
import { saveAs } from "file-saver";
import utilities from '@/methods/utilities';
import storeHelpers from '@/methods/storeHelpers';

export default {
    
	components: {
        DataTable,
        ActionBar
    },

    data() {
        return {

            customerId: '',
            viewType: 'complete',
            // viewType: 'lastScan',
            actions: [ 
                { name: 'setView', display: 'change view', type: 'action', callback: this.toggleView },
                { name: 'DnsUploader', display: 'Upload domains', type: 'route', route: 'DnsUploader' },
                { name: 'runScan', display: 'Run scan', type: 'action', callback: this.runScan },
                { name: 'download', display: 'Download', type: 'action', callback: this.download },
            ],

            // view complete
            tableHeaders1: ['domain','spf','dkim','dmarc','mx','scan date','last change'],
            tableActions1: 'expand',

            // view lastScan
            tableHeaders2: ['domain','spf','dkim','dmarc','scan date','last change'],
            tableActions2: '',

            displayMessage: false,
            message: '',
            isLoading: true
        }
    },

	computed: {

        customerDomains(){
            
            let domains = [];

            let customer = this.$store.getters.customer(this.customerId);
            if(customer && customer.domains && customer.domains.data.length > 0){

                domains = JSON.parse(JSON.stringify(customer.domains)).data;
            }

            return domains;
        },


        dnsRecords1() {

            let records = [];

            // create table record for each domain
            this.customerDomains.forEach( domainItem => {

                if(domainItem.records && domainItem.records.length > 0){
                        
                    let lastChange = '';

                    // contentPanel: extract snapshots for each dns type (ordered by date)
                    let sorted = domainItem.records.sort((a, b) => (a.scanDate < b.scanDate) ? 1 : -1);

                    // determine DNS content
                    let spfAvailable = false, dkimAvailable = false, dmarcAvailable = false, mxAvailable = false;
                    let spfSnapshots = [], dkimSnapshots = [], dmarcSnapshots = [], mxSnapshots = [];
                    
                    if(sorted[0].spf && sorted[0].spf.length > 0)         spfAvailable = true;
                    if(sorted[0].dkim && sorted[0].dkim.length > 0)       dkimAvailable = true;
                    if(sorted[0].dmarc && sorted[0].dmarc.length > 0)     dmarcAvailable = true;
                    if(sorted[0].mx && sorted[0].mx.length > 0)           mxAvailable = true;

                    const sortedSliced = sorted.slice(0, 4);

                    sortedSliced.forEach( item => {

                        // contentPanel-tab: create the snapshot content per type and date
                        let spfString = '', dkimString = '', dmarcString = '', mxString = '';
                        if(item.spf){
                            item.spf.forEach( line => {
                                let newLines = line.match(/.{1,100}/g);
                                if(newLines) spfString += newLines.join('\n\t') + '\n\n';
                            });
                        }
                        if(item.dkim){
                            item.dkim.forEach( line => {
                                let newLines = line.match(/.{1,100}/g);
                                if(newLines) dkimString += newLines.join('\n\t') + '\n\n';
                            });
                        }
                        if(item.dmarc){ 
                            item.dmarc.forEach( line => {
                                let newLines = line.match(/.{1,100}/g);
                                if(newLines) dmarcString += newLines.join('\n\t') + '\n\n';
                            });
                        }
                        if(item.mx){
                            mxString = item.mx.join('\n');
                        }
                        // add snapshot
                        spfSnapshots.push({
                            header: item.scanDate,
                            value: spfString
                        });
                        dkimSnapshots.push({
                            header: item.scanDate,
                            value: dkimString
                        });
                        dmarcSnapshots.push({
                            header: item.scanDate,
                            value: dmarcString
                        });
                        mxSnapshots.push({
                            header: item.scanDate,
                            value: mxString
                        });
                    });

                    // check for mutations in snapshots
                    spfSnapshots.forEach( (snapshot, index) => {
                        if( index > 0 && snapshot.value != spfSnapshots[index-1].value ){
                            snapshot.alert = true;
                            if(lastChange === '' || snapshot.header > lastChange){
                                lastChange = snapshot.header
                            }
                        }
                    });

                    dkimSnapshots.forEach( (snapshot, index) => {
                        if( index > 0 && snapshot.value != dkimSnapshots[index-1].value ){
                            snapshot.alert = true;
                            if(lastChange === '' || snapshot.header > lastChange){
                                lastChange = snapshot.header
                            }
                        }
                    });

                    dmarcSnapshots.forEach( (snapshot, index) => {
                        if( index > 0 && snapshot.value != dmarcSnapshots[index-1].value ){
                            snapshot.alert = true;
                            if(lastChange === '' || snapshot.header > lastChange){
                                lastChange = snapshot.header
                            }
                        }
                    });

                    mxSnapshots.forEach( (snapshot, index) => {
                        if( index > 0 && snapshot.value != mxSnapshots[index-1].value ){
                            snapshot.alert = true;
                            if(lastChange === '' || snapshot.header > lastChange){
                                lastChange = snapshot.header
                            }
                        }
                    });

                    // create the main data record
                    let mainRecord = {
                        values:[
                            {value: '', action: 'expand'},
                            {value: domainItem.domain},
                            {value: spfAvailable, action: 'info'},
                            {value: dkimAvailable, action: 'info'},
                            {value: dmarcAvailable, action: 'info'},
                            {value: mxAvailable, action: 'info'},
                            {value: sortedSliced[0].scanDate.substr(0, 10)},
                            {value: lastChange.substr(0, 10)},
                        ]
                    };

                    // create the contentPanel
                    mainRecord.contentPanel = {
                        infoValues: [null, spfSnapshots, dkimSnapshots, dmarcSnapshots, mxSnapshots ],
                        showIndex: 1
                    };

                    records.push(mainRecord);
                }
            });

            return records;
        },


        dnsRecords2() {
 
            let records = [];
           
            // create table record for each domain
            this.customerDomains.forEach( domainItem => {
                if(domainItem.records && domainItem.records.length > 0){

                    let lastChange = '';
                    // contentPanel: extract snapshots for each dns type (ordered by date)
                    let sorted = domainItem.records.sort((a, b) => (a.scanDate > b.scanDate) ? 1 : -1);

                    // determine DNS content
                    let spfAvailable = false, dkimAvailable = false, dmarcAvailable = false, mxAvailable = false;
                    let spfSnapshots = [], dkimSnapshots = [], dmarcSnapshots = [], mxSnapshots = [];

                    let numOfScans = sorted.length;

                    if(sorted[numOfScans-1].spf && sorted[numOfScans-1].spf.length > 0)         spfAvailable = true;

                    if(sorted[numOfScans-1].dkim && sorted[numOfScans-1].dkim.length > 0)       dkimAvailable = true;

                    if(sorted[numOfScans-1].dmarc && sorted[numOfScans-1].dmarc.length > 0)     dmarcAvailable = true;

                    if(sorted[numOfScans-1].mx && sorted[numOfScans-1].mx.length > 0)           mxAvailable = true;

                    // check for mutations
                    let spfLastChange = '-', dkimLastChange='-', dmarcLastChange='-', mxLastChange='-';
                    sorted.forEach( (item, index) => {
                        
                        if(index > 0){

                            if(this.checkRecordChange(sorted[index-1], item, 'spf') ){
                                spfLastChange = item.scanDate.substr(0, 10);
                            }

                            if(this.checkRecordChange(sorted[index-1], item, 'dkim') ){
                                dkimLastChange = item.scanDate.substr(0, 10);
                            }

                            if(this.checkRecordChange(sorted[index-1], item, 'dmarc') ){
                                dmarcLastChange = item.scanDate.substr(0, 10);
                            }

                            if(this.checkRecordChange(sorted[index-1], item, 'mx') ){
                                mxLastChange = item.scanDate.substr(0, 10);
                            }
                        }
                    });

                    let lastItem = sorted[sorted.length-1];

                    let spfString = '', dkimString = '', dmarcString = '', mxString = '';

                    if(lastItem.spf){
                        lastItem.spf.forEach( line => {
                            let newLines = line.match(/.{1,25}/g);
                            if(newLines) spfString += newLines.join('\n') + '\n\n';
                        });
                    }

                    if(lastItem.dkim){
                        lastItem.dkim.forEach( line => {
                            let newLines = line.match(/.{1,25}/g);
                            if(newLines) dkimString += newLines.join('\n') + '\n\n';
                        });
                    }

                    if(lastItem.dmarc){ 
                        lastItem.dmarc.forEach( line => {
                            let newLines = line.match(/.{1,25}/g);
                            if(newLines) dmarcString += newLines.join('\n') + '\n\n';
                        });
                    }

                    if(lastItem.mx){ 
                        mxString = lastItem.mx.join('\n');
                    }

                    // create the main data record
                    let mainRecord = {
                        values:[
                            {value: domainItem.domain},
                            {value: spfString},
                            {value: dkimString},
                            {value: dmarcString},
                            {value: mxString},
                            {value: lastItem.scanDate.substr(0, 10)},
                            {value: "spf: \t\t"+spfLastChange+"\ndkim: \t"+dkimLastChange+"\ndmarc: \t"+dmarcLastChange+"\nmx: \t"+mxLastChange},
                            
                        ]
                    };

                    records.push(mainRecord);
                }
            });

            return records;
        }
	},


    methods: {

        toggleView(){
            
            if(this.viewType == 'complete'){
                this.viewType = 'lastScan';
            }
            else{
                this.viewType = 'complete';
            }
        },


        checkRecordChange(scan1, scan2, type){

            if(
                (scan1[type] && scan2[type] && scan1[type][0] != scan2[type][0]) 
                || (scan1[type] && !scan2[type]) 
                || (scan2[type] && !scan1[type])
            ){
                return true;
            }
        },


        async runScan(){

            try{

                this.isLoading = true;

                this.message = 'DNS scan in progress, please check back in a couple of minutes and refresh this page';
                this.displayMessage = true;

                let response = await this.$store.dispatch(
                    "runCustomerScan",
                    {
                        vm: this,
                        params: {
                            customerId: this.customerId
                        },
                    }
                );

                this.isLoading = false;
            }
            catch(e){
                this.message = 'Something went wrong, please contact your administrator';
                this.displayMessage = true;
            }
        },


        download(){

            if(this.isLoading){

                this.message = 'The data is still loading. \nPlease wait';
                this.displayMessage = true;
                return;
            }

            let data = [];
            
            this.dnsRecords2.forEach( record => {
                
                /***
                    (jan 2022)
                
                    [ ] waarom werken escaped linebreaks in de string voor mx records anders dan bij de andere records?
                        - als ik alles escape ziet het er precies hetzelfde uit
                        - maar toch worden de linebreaks in de mx record doorgevoerd in de uiteindelijke csv en 
                        - bij de andere records niet!
                */
                let values = record.values;

                data.push([
                        this.customerId,
                        
                        "\""+values[0].value+"\"",
                        "\""+values[1].value+"\"",
                        "\""+values[2].value+"\"",
                        "\""+values[3].value+"\"",
                        "\""+values[4].value.replace(/(\r\n|\n|\r)/gm, ",")+"\"",
                        "\""+values[5].value+"\"",
                        "\""+values[6].value.replace(/(\t)/gm, "")+"\""
                    ]);
            });

            // create csv
            var lineArray = [];

            // add additional headers for some nested objects
            var headers = 'customer;domain;spf;dkim;dmarc;mx;scan date;last change';
            
            lineArray.push(headers);

            // add records
            data.forEach(function(item, index) {
                var line = item.join(";");
                lineArray.push(line);
            });

            var csvContent = lineArray.join("\n");

            // save file
            var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
            var d = new Date();
            var datestring =
            ("0" + d.getDate()).slice(-2) +
            "-" +
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "-" +
            d.getFullYear();
            // "" +
            // ("0" + d.getHours()).slice(-2) +
            // ":" +
            // ("0" + d.getMinutes()).slice(-2);

            saveAs(blob, "DNS_records_"+this.customerId+"_" + datestring + ".csv");
        },


        acceptResult(){

            this.message = null;
            this.displayMessage = false;
        }
    },


	async created() {

        let numOfBatches = Number.MAX_VALUE;
        // if(process.env.VUE_APP_NUM_OF_BATCHES){
        //     numOfBatches = process.env.VUE_APP_NUM_OF_BATCHES;
        // }

        this.customerId = this.$route.params.id;

        await storeHelpers.fetchCustomers(this);

        setTimeout(async () =>{ 

            let batchNum = 0;
            let nextPageToken = null;
            do{
                
                nextPageToken = await this.$store.dispatch(
                    "fetchDomainData",
                    {
                        vm: this,
                        params: {
                            customerId: this.customerId
                        },
                    }
                );

                batchNum++;
            }
            while(nextPageToken && batchNum < numOfBatches)

            this.isLoading = false;

        }, 10);
	},


    mounted() {
        
        this.isLoading = true;
    }
};
</script>


<style scoped>

    /* .data-table {
        grid-row-start: 2;
        grid-column-start: 1;
        grid-column-end: 5;
    } */

    /* .action-bar {
        grid-row-start: 3;
        grid-column-start: 6;
        grid-column-end: 6;
    } */


    .result-dialog {
        white-space: pre;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color:#555;
        background:rgba(255, 255, 255, 0.9);
        border:4px solid rgb(230, 230, 230);
        box-shadow: 0 0 15px rgb(145, 144, 144);
        width:60%;
        position:fixed;
        top:20%;
        left: 20%;
        z-index: 100;
    }
</style>
