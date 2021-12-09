import { createStore } from 'vuex'

export default createStore({

    state: {

        customers: [],

        userPaths: {
            'AddCustomer': [
                {path: 'DnsResolverOverview', displayName: 'Customers'}
            ],
            'DnsResolverOverview': [
                {path: 'Projects', displayName: 'Projects'}
            ],
            'DnsResolver': [
                {path: 'Projects', displayName: 'Projects'},
                {path: 'DnsResolverOverview', displayName: 'Customers'}
            ],
            'DnsResolverView2': [
                {path: 'Projects', displayName: 'Projects'},
                {path: 'DnsResolverOverview', displayName: 'Customers'}
            ],
            'DnsUploader': [
                {path: 'Projects', displayName: 'Projects'},
                {path: 'DnsResolverOverview', displayName: 'Customers'},
                {path: 'DnsResolver', displayName: 'DNS records'},
            ],
            'Projects': [],
            'Home': [
                {path: 'Projects', displayName: 'Projects'}
            ]
        }
    },

    
    getters: {

        customers: state => {
            return state.customers;
        },


        customer: state => (customerId) => {
            return state.customers.find(x => x.id === customerId);
        },


        dnsRecords: state => {
            return state.dnsRecords;
        },


        userPath: state => {
            return state.userPath;
        }
    },


    mutations: {

        setCustomers(state, data) {

            state.customers = data;
        },


        setCustomerDomains(state, {customerId, data, nextPageToken}) {

            let customer = state.customers.find(x => x.id === customerId);
            if (customer) {

                if (!customer.domains) {
                    customer.domains = {
                        data: [],
                        nextPageToken: null
                    };
                }

                let updatedDomains = {
                    data: [],
                    nextPageToken: null
                };
                
                updatedDomains.data = customer.domains.data.concat(data);
                updatedDomains.nextPageToken = nextPageToken || null;

                customer.domains = updatedDomains;
            }
        },


        setDnsRecords(state, data) {

            state.dnsRecords = data;
        },


        addDnsRecord(state, data) {

            state.dnsRecords[data.index] = data.data;
        },
    },


    actions: {

        // [ ] nog testen
        async fetchCustomers(context, { vm, params }){

            var url = 'https://dns-resolver-knfeh53ddq-ey.a.run.app/customers';
            var response = await vm.axios.get(url);
            context.commit('setCustomers', response.data);
        },


        async addCustomer(context, { vm, params }){

            let customerData = params.customerData;

            var url = 'https://dns-resolver-knfeh53ddq-ey.a.run.app/customers';
            let response = await vm.axios.post(url, customerData);

            return response;
        },


        async insertDomain(context, { vm, params }){

            let domainData = params.domainData;
            
            var url = 'https://dns-resolver-knfeh53ddq-ey.a.run.app/domains';
            let response = await vm.axios.post(url, domainData);

            return response;
        },


        async fetchSpfRecords(context, { vm, params }){

            let domain = params.domain;
            
            var url = 'https://dns-resolver-dg25ahx4fq-ey.a.run.app/dmarc?domain='+domain;
            var response = await vm.axios.get(url);
            
            return response;
        },


        /*
        async fetchDomains(context, { vm, params }){
            var customerId = params.customerId;
            var url = 'https://dns-resolver-knfeh53ddq-ey.a.run.app/domains?customerId='+customerId;
            var response = await vm.axios.get(url);
            // response.data.forEach( (record, index) => {
            //     context.commit('addDnsRecord', {data: record, index: index});
            // });
            context.commit('setCustomerDomains', {customerId: customerId, data: response.data});
        },
        */


        async fetchDomainData(context, { vm, params }){

            let customerId = params.customerId;
            let customer = context.getters.customer(customerId);

            var url = 'https://dns-resolver-knfeh53ddq-ey.a.run.app/domain-data?customerId='+customerId;

            if(customer && customer.domains && customer.domains.nextPageToken){

                let nextPageToken = customer.domains.nextPageToken;
                url += '&nextPageToken='+nextPageToken;
            }
            
            var response = await vm.axios.get(url);

            context.commit(
                'setCustomerDomains', 
                {
                    customerId: customerId, 
                    data: response.data.data,
                    nextPageToken: response.data.nextPageToken
                }
            );

            return response.data.nextPageToken;
        },


        async runCustomerScan(context, { vm, params }){

            let customerId = params.customerId;

            var url = 'https://dns-resolver-knfeh53ddq-ey.a.run.app/execute-manual-check?customerId='+customerId;

            var response = await vm.axios.get(url);

            return response;
        },
    },

    modules: {

    }
})
