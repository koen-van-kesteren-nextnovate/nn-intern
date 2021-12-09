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
			style="
				grid-row-start: 2;
				grid-column-start: 2;
				grid-column-end: 5;
				min-width: 0;
				"
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
}

.grid-container-inner {
	display: grid;
	grid-template-rows: 20px 20px 60px 60px 60px auto;
	grid-template-columns: 80px 200px;
	grid-gap: 20px;
}

.page-container {
	display: flex;
	flex-direction: row;
}

.page-header {
	/* grid-column-start: 2;
	grid-column-end: 6; */
	display: block;
	line-height: 100px;
	text-align: center;
	font-size: 180%;
	font-weight: 900;
	/* margin-left: 30px; */
	color: rgb(180, 180, 180);
	background: white;
}

.component-wrapper {
	position: relative;
	display: flex;
	flex-direction: row;
	/* 
		TODO:

			(dec 2021) 
		
			[ ] height is nu bepaald met absolute waardes
				- idee is dat de wrapper de overgebleven ruimte op het scherm vult
				- mogelijke oplossing: https://stackoverflow.com/questions/90178/make-a-div-fill-the-height-of-the-remaining-screen-space

	*/
	height: calc(100vh - 140px);
	width: 100% !important;
	overflow-x: scroll;
}

.component-wrapper-center {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: start;
	
	/* 
		TODO:

			(dec 2021) 
		
			[ ] height is nu bepaald met absolute waardes
				- idee is dat de wrapper de overgebleven ruimte op het scherm vult
				- mogelijke oplossing: https://stackoverflow.com/questions/90178/make-a-div-fill-the-height-of-the-remaining-screen-space

	*/
	height: calc(100vh - 140px);
	width: 100% !important;
}

.option-picker {
	display: inline-grid;
	/* margin-left: 30px; */
	grid-template-rows: 60px 60px;
}

.overlay-wrapper {
	overflow-y: hidden;
	overflow-x: hidden;
}

.grid-column {
	display: inline-grid;
	grid-template-rows: 60px 60px;
}

.action {
	display: block;
	line-height: 50px;
	min-width: 100px;
	text-align: center;
	font-weight: 900;
	color: #999;
	white-space:nowrap;
	cursor: pointer;
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
}

.loading-screen {
	position: absolute;
	top:0;
	z-index: 1000;
	white-space: pre;
	display: flex;
	justify-content: center;
	background: rgba(255, 255, 255, 0.6);
	width: 100%;
	height: 100%;
}
</style>
