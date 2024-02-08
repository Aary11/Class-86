import React, { Component } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {getAuth} from 'firebase/auth';
import { ref,update,onValue } from 'firebase/database';
import db from '../config'

SplashScreen.preventAutoHideAsync();

let customFonts = {
	'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fontsLoaded: false,
			isEnabled:false,
			light_theme:true,
			name:""
		};
	}

	async _loadFontsAsync() {
		await Font.loadAsync(customFonts);
		this.setState({ fontsLoaded: true });
	}

	componentDidMount() {
		this._loadFontsAsync();

	}
	toggleSwitch(){
		const previous_state=this.state.isEnabled;
		const theme = !this.state.isEnabled? "dark" : "light"

		const auth = getAuth
		const user = auth.currentUser
		if (user){
			var updates ={}
			updates ['users'+ user.uid + '/current_theme'] = theme

			const dbref=ref(db,'/')
			update (dbref,updates)

			this.setState({isEnabled:!previous_state,light_theme:previous_state})
		}
}


	render() {
		if (this.state.fontsLoaded) {
			SplashScreen.hideAsync();
			return (
				<View style={styles.container}>
					<Text>DarkTheme</Text>
				<Switch 
				trackColor={{false:"black",true:'white'}}
				thumbColor={this.state.isEnabled?'blue':"red"}
				value={this.state.isEnabled}
				onValueChange={()=>{this.toggleSwitch()}}
				/>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
