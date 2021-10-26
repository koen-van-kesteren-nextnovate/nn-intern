<template>
	<div 
		class="app-container"
	>
		<div 
			class="app-bar" 
		>
			<div
				style="display:flex;padding:15px;margin-left:15px;"
			>
				<img 
					alt="Vue logo" src="./assets/icon-on-yellow.svg"
					style="height: 100%;"
				/> 
				<div style="height: 100%;margin-left:15px;vertical-align: middle;line-height:50px;font-weight:600;color:#999;">
					NextNovate
				</div>
			</div>
			
			<div 
				v-if="loggedIn === true"
				class="logout"
				@click="logout"
				style="display: flex; "
			>
				Logout
			</div>
		</div>

		<NavBar 
			v-if="loggedIn === true" 
		/>
		<router-view 
			style="grid-row-start: 2;grid-column-start: 2;grid-column-end: 5;"
		/>
	</div>
</template>

<script>
import { ref, onBeforeMount } from 'vue';
import NavBar from "./components/NavBar.vue";
import { useRouter, useRoute } from 'vue-router';
import firebase from 'firebase';


export default {

	setup (){
		const router = useRouter();
		const route = useRoute();
		
		onBeforeMount(() => {
			
			firebase.auth().onAuthStateChanged((user) => {
				
				if(!user){
					
					router.replace('/login');
				}
				else if(route.path == "/login" || route.path == "/register"){
					
					router.replace('/');
				}
			});
		});
	},


	components: {

		NavBar,
	},


	data() {
        return {

            loggedIn: false
        }
    },


    methods: {

		logout(){

			firebase.auth().signOut()
			.then(() => {
				console.log("signed out");
				this.loggedIn = false;
			})
			.catch(err => alert(err.message));
		}
    },


	created() {

		firebase.auth().onAuthStateChanged((user) => {
				
			if(user){
				this.loggedIn = true;
			}
		});
	}

};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

.app-bar {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	grid-row-start: 1;
	grid-column-start: 1;
	grid-column-end: 5;
	border-bottom: 1px solid#999;
}

.logout {
	display: block;
	padding: 15px;
	line-height: 50px;
	text-align: right;
	font-weight: 900;
	color: #999;
	border-bottom: 1px solid#999;
	cursor: pointer;
}

.logout:hover {
	color: #fdaf06e1;
	border-bottom: 1px solid #fdaf06e1;  
}

.app-container {
	display: grid;
	grid-template-columns: 200px 200px 200px auto 0px;
	grid-template-rows: 80px 10px 60px 60px auto;
	grid-gap: 20px;
	padding: 20px;
	/* margin: 20px; */
}

.grid-container-inner {
	display: grid;
	grid-template-rows: 20px 20px 60px 60px 60px auto;
	grid-template-columns: 80px 200px;
	grid-gap: 20px;
}

.grid-column {
	display: inline-grid;
	grid-template-rows: 60px 60px;
}

.action {
	display: block;
	line-height: 50px;
	text-align: center;
	font-weight: 900;
	color: #999;
	/* border-bottom: 1px solid#999; */
	cursor: pointer;
}

.list-action {
	display: block;
	line-height: 50px;
	text-align: center;
	font-weight: 600;
	color: #999;
	border-bottom: 1px solid rgb(220, 220, 220);
	cursor: pointer;
}

.action:hover {
	color: #fdaf06e1;
	border-bottom: 1px solid #fdaf06e1;  
}

.info-box {
	display: block;
	line-height: 50px;
	margin-left: 20px;
	text-align: left;
	font-weight: 500;
	color: #999;
	background: white;
	/* cursor: pointer; */
}

.page-header {
	grid-column-start: 2;
	grid-column-end: 6;

	display: block;
	line-height: 100px;
	text-align: center;
	font-size: 180%;
	font-weight: 900;
	margin-left: 30px;
	/* color: white; */
	color: rgb(180, 180, 180);
	/* background: rgb(180, 180, 180); */
	background: white;
	/* border-bottom: 1px solid#999; */
}

</style>
