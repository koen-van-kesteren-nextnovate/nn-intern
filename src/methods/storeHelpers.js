

export default {

    async fetchCustomers(context){

        await context.$store.dispatch(
            "fetchCustomers", 
            {
                vm: context,
                params: {
                    // domain: domain
                },
            }
        );
    }
}