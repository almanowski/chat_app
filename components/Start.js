import React from 'react';
import {View, Text, Pressable, TextInput, StyleSheet, ImageBackground, Image, TouchableOpacity} from 'react-native';
import * as Font from 'expo-font';

// importing img and icon
import image from '../assets/background-img.png';
import icon from '../assets/icon.png';

export default class Start extends React.Component {
  constructor(props) {
    super(props);

    // the state will be update with whatever values change for the specific state
    this.state = {
      name: '',
      bgColor: '',
      fontsLoaded: false,
      active: null
    };
  }

  // load cutsom fonts from assets
  async loadFonts() {
    await Font.loadAsync({
      // load poppins light/300
      'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),

      //load poppins semi-bold/600
      'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    });
    this.setState({fontsLoaded: true});
  }

  componentDidMount() {
    this.loadFonts();
  }

  // function to update the state with the new bgColor for the Chat
  changeBgColor = (newColor) => {
    this.setState({bgColor: newColor});
  };

  // bgColors selection
  color = {
    black: '#090c08',
    purple: '#474056',
    gray: '#8a95a5',
    green: '#b9c6ae'
  };

  render() {
    if (this.state.fontsLoaded) {
    return (
        <View style={styles.container}>

          <ImageBackground source={image} resizeMode="cover" style={styles.image}>

          <Text style={styles.title}>Chat App</Text>

            <View style={styles.inputView}>

              <View style={styles.nameView}>
                <Image source={icon} style={styles.imageStyle} />
                <TextInput style={styles.name}
                  onChangeText={(name) => this.setState({name})} value={this.state.name}
                  placeholder="Your Name"
                />
              </View>

              <View style={styles.colorView}>
                <Text style={styles.colorText}>Choose Background Color:</Text>
                <View style={styles.colorButtons}>
                  <TouchableOpacity style={this.state.active === 0 ? styles.blackActive : styles.black} 
                    onPress={() => {this.changeBgColor(this.color.black); this.setState({active: 0})}}>
                  </TouchableOpacity>
                  <TouchableOpacity style={this.state.active === 1 ? styles.purpleActive : styles.purple} 
                    onPress={() => {this.changeBgColor(this.color.purple); this.setState({active: 1})}}>
                  </TouchableOpacity>
                  <TouchableOpacity style={this.state.active === 2 ? styles.grayActive : styles.gray} 
                    onPress={() => {this.changeBgColor(this.color.gray); this.setState({active: 2})}}>
                  </TouchableOpacity>
                  <TouchableOpacity style={this.state.active === 3 ? styles.greenActive : styles.green} 
                    onPress={() => {this.changeBgColor(this.color.green); this.setState({active: 3})}}>
                  </TouchableOpacity>
                </View>
              </View>

              <Pressable style={styles.button} onPress={() => 
                this.props.navigation.navigate("Chat", {name: this.state.name, bgColor: this.state.bgColor})}>
                  <Text style={styles.buttonTxt}>Start Chatting</Text>
              </Pressable>
              
            </View>
          </ImageBackground>

        </View>
    )
  } else {
    return null;
  }
  }
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginTop: '30%'
  },

  inputView: {
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    minHeight: 245,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: '6%',
  },

  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#757083',
    borderWidth: 1,
    height: 50,
    borderRadius: 2,
    width: '88%',
    paddingLeft: 15,
  },
  name: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    color: '#757083',
    opacity: 1,
    paddingLeft: 10,
    paddingTop: 3,
    width: '80%'
  },

  colorView: {
    justifyContent: 'space-evenly',
    width: '88%'
  },
  colorText: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    color: '#757083',
    opacity: 1,
    paddingBottom: 5
  },
  colorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  black: {
    backgroundColor: '#090c08',
    borderRadius: 100,
    padding: 10,
    width: 40,
    height: 40
  },
  blackActive: {
    backgroundColor: '#090c08',
    borderRadius: 100,
    padding: 10,
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#d62727',
  },
  purple: {
    backgroundColor: '#474056',
    borderRadius: 100,
    padding: 10,
    width: 40,
    height: 40
  },
  purpleActive: {
    backgroundColor: '#474056',
    borderRadius: 100,
    padding: 10,
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#d62727'
  },
  gray: {
    backgroundColor: '#8a95a5',
    borderRadius: 100,
    padding: 10,
    width: 40,
    height: 40
  },
  grayActive: {
    backgroundColor: '#8a95a5',
    borderRadius: 100,
    padding: 10,
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#d62727'
  },
  green: {
    backgroundColor: '#b9c6ae',
    borderRadius: 100,
    padding: 10,
    width: 40,
    height: 40
  },
  greenActive: {
    backgroundColor: '#b9c6ae',
    borderRadius: 100,
    padding: 10,
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#d62727'
  },

  button: {
    backgroundColor: '#757083',
    width: '88%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTxt: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#fff',

  }

})