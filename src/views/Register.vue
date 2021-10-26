<template>
  <div class="register">Register

      <form @submit.prevent="Register">
        <input type="text" placeholder="Email" v-model="email"/>
        <input type="password" placeholder="Password" v-model="password"/>
        <input type="submit" value="Register" />

        <router-link to="/login">Login</router-link>

    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import firebase from 'firebase';

export default {
  name: 'Register',

    setup (){
        const email = ref("");
        const password = ref("");

        const Register = () => {

            firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then(user => alert(user))
            .catch(err => alert(err.message));
        }

        return{
            Register,
            email,
            password
        }
        
    },


  components: {
  }
}
</script>

<style>

</style>
