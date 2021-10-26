import { createApp } from 'vue'

import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import firebase from 'firebase';


const firebaseConfig = {
    apiKey: "AIzaSyC9_eDaGS3nBDnwGjkbOLh9UBRW9JsNqjI",
    authDomain: "nextnovate-services-dev.firebaseapp.com",
    projectId: "nextnovate-services-dev",
    storageBucket: "nextnovate-services-dev.appspot.com",
    messagingSenderId: "82149949543",
    appId: "1:82149949543:web:426718396e9d5036aad4c2"
};

firebase.initializeApp(firebaseConfig);

createApp(App)
.use(store)
.use(router)
.use(VueAxios, axios)
.mount('#app')
