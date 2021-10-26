<template>
   
    <form 

        @submit.prevent="Login"

        style="display:flex;flex-direction: column;align-items: center;"
    >
        <input
            type="text" 
            placeholder="Email" 
            v-model="email"
            style="border:none;padding:20px;margin:10px;background-color:rgb(240,240,240);"
        />
        <div
        ></div>
        <input 
            type="password" 
            placeholder="Password" 
            v-model="password"
            style="border:none;padding:20px;margin:10px;background-color:rgb(240,240,240);"
        />
        <input 
            type="submit" 
            class="login"
            value="Login"
        />

        <!-- <router-link 
            to="/register"
            style="
                border:none;padding:20px;margin:60px;background-color:rgb(250,250,250);color: black;
	            border-bottom: 1px solid#999;"
        >
            Register here
        </router-link> -->

    </form>
  
</template>

<script>
import { ref } from 'vue';
import firebase from 'firebase';

export default {
  name: 'Login',

  setup (){
		const email = ref("");
        const password = ref("");

        const Login = () => {

            firebase.auth().signInWithEmailAndPassword(email.value, password.value)
            .then(data => console.log(data))
            .catch(err => alert(err.message));
        }

        return{
            Login,
            email,
            password
        }
		
	},

  components: {
  }
}
</script>

<style scoped>

    .login {
       
        width:80px;
        border:none;
        padding:20px;
        margin:50px;
        background-color:white;
        color: #555;
        border-bottom: 1px solid #999;
    }

    .login:hover {
        color: #fdaf06e1;
        border-bottom: 1px solid #fdaf06e1;  
    }
</style>
