<template>
	
    <div class="grid-container-inner">
        
        <ActionBar 
            ref="actionBar"
            :actions="actions"
            class="action-bar"
        />
    
        <DataTable
            ref="dataTable"
            :headers="tableHeaders" 
            :data="dnsRecords"
            :actions="tableActions"
            class="data-table"
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
            actions: [ 
                { name: 'setToAll', display: 'View all scans', type: 'route', route: 'DnsResolver' },
                { name: 'DnsUploader', display: 'Upload domains', type: 'route', route: 'DnsUploader' },
                { name: 'runScan', display: 'Run scan', type: 'action', callback: this.runScan },
                { name: 'download', display: 'Download', type: 'action', callback: this.download },
            ],

            tableHeaders: ['domain','spf','dkim','dmarc' /* [ ] ,'scan date','last change'*/],
            tableActions: '',

            displayMessage: false,
            message: ''
        }
    },

	computed: {


        dnsRecords() {

            
            let records = [];
            let customer = this.$store.getters.customer(this.customerId);

            if(customer && customer.domains && customer.domains.data.length > 0){

                let domains = JSON.parse(JSON.stringify(customer.domains));

                // create table record for each domain
                domains.data.forEach( domainItem => {

                    if(domainItem.records && domainItem.records.length > 0){
                            
                        // console.log(domainItem.records[0]);

                        let lastChange = '';

                        // determine DNS content
                        let spfAvailable = false, dkimAvailable = false, dmarcAvailable = false;
                        let spfSnapshots = [], dkimSnapshots = [], dmarcSnapshots = [];
                        if(domainItem.records[0].spf && domainItem.records[0].spf.length > 0) spfAvailable = true;
                        if(domainItem.records[0].dkim && domainItem.records[0].dkim.length > 0) dkimAvailable = true;
                        if(domainItem.records[0].dmarc && domainItem.records[0].dmarc.length > 0) dmarcAvailable = true;

                        // contentPanel: extract snapshots for each dns type (ordered by date)
                        let sorted = domainItem.records.sort((a, b) => (a.scanDate > b.scanDate) ? 1 : -1);

                        let lastItem = sorted[sorted.length-1];
                        console.log(lastItem);

                        let spfString = '', dkimString = '', dmarcString = '';
                        if(lastItem.spf){
                            lastItem.spf.forEach( line => {
                                let newLines = line.match(/.{1,35}/g);
                                if(newLines) spfString += newLines.join('\n') + '\n\n';
                            });
                        }
                        if(lastItem.dkim){
                            lastItem.dkim.forEach( line => {
                                let newLines = line.match(/.{1,35}/g);
                                if(newLines) dkimString += newLines.join('\n') + '\n\n';
                            });
                        }
                        if(lastItem.dmarc){ 
                            lastItem.dmarc.forEach( line => {
                                let newLines = line.match(/.{1,35}/g);
                                if(newLines) dmarcString += newLines.join('\n') + '\n\n';
                            });
                        }
                       

                        // create the main data record
                        let mainRecord = {
                            values:[
                                {value: domainItem.domain},
                                
                                {value: spfString},
                                {value: dkimString},
                                {value: dmarcString},
                                // {value: sorted[sorted.length-1].scanDate.substr(0, 10)},
                                // {value: lastChange.substr(0, 10)},
                               
                            ]
                        };

                        records.push(mainRecord);
                    }
                });
            }
            
            return records;
        }
	},


    methods: {

        setView(type){

            console.log(' set view ', type);

            this.viewType = type;
        },


        async runScan(){

            try{
                // this.$refs.actionBar.setIsLoading(true);

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

                // this.$refs.actionBar.setIsLoading(false);
            }
            catch(e){
                this.message = 'Something went wrong, please contact your administrator';
                this.displayMessage = true;
            }

        },


        download(){

            if(this.$refs.dataTable.isLoading){

                this.message = 'The data is still loading. \nPlease wait';
                this.displayMessage = true;
                return;
            }

            let data = [];

            let customer = this.$store.getters.customer(this.customerId);
            
            if(customer && customer.domains && customer.domains.data.length > 0){

                let domains = JSON.parse(JSON.stringify(customer.domains));

                // create table record for each domain
                domains.data.forEach( item => {

                    if(item.records && item.records.length > 0){

                        let sorted = item.records.sort((a, b) => (a.scanDate < b.scanDate) ? 1 : -1);
                        let lastScan = sorted[0];
            
                        let spfString = '', dkimString = '', dmarcString = '';
                        if(lastScan.spf){
                            lastScan.spf.forEach( line => {
                                spfString += line;
                            });
                        }
                        if(lastScan.dkim){
                            lastScan.dkim.forEach( line => {
                                dkimString += line;
                            });
                        }
                        if(lastScan.dmarc){ 
                            lastScan.dmarc.forEach( line => {
                                dmarcString += line;
                            });
                        }

                        data.push([
                            this.customerId,
                            item.domain,
                            lastScan.scanDate.substr(0,10),
                            "\""+spfString+"\"", 
                            "\""+dkimString+"\"",
                            "\""+dmarcString+"\"",
                        ]);
                    }
                });
            }
            
            // create csv
            var lineArray = [];

            // add additional headers for some nested objects
            var headers = 'customer;domain;scan date;SPF;DKIM;DMARC';
            
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
            d.getFullYear() +
            "" +
            ("0" + d.getHours()).slice(-2) +
            ":" +
            ("0" + d.getMinutes()).slice(-2);

            saveAs(blob, "DNS_records_"+this.customerId+"_" + datestring + ".csv");
        },


        acceptResult(){

            this.message = null;
            this.displayMessage = false;
        }
    },


	async created() {

        this.customerId = this.$route.params.id;

        await storeHelpers.fetchCustomers(this);


        setTimeout(async () =>{ 

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
            }
            while(nextPageToken)

            this.$refs.dataTable.setIsLoading(false);

        }, 10);

	},


    mounted() {

        this.$refs.dataTable.setIsLoading(true);
    }
};
</script>


<style scoped>

    .data-table {
        grid-row-start: 2;
        grid-column-start: 1;
        grid-column-end: 5;
    }

    .action-bar {
        grid-row-start: 3;
        grid-column-start: 6;
        grid-column-end: 6;
    }


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
