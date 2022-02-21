import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import firebase from 'firebase';
import 'firebase/firestore';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';


export default class CustomActions extends Component {
  constructor(props) {
    super(props);
  }
  

  // access camera roll
  pickImage = async () => {
    //ask permission
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // open camera roll
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      const imageUrl = await this.uploadImage(result.uri);
      this.props.onSend({image: imageUrl});
    }
  }


  // access camera
  takePhoto = async () => {
    //ask permission
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required!');
    }

    // open camera
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.cancelled) {
      const imageUrl = await this.uploadImage(result.uri);
      this.props.onSend({image: imageUrl});
    }
  }


  // uploading images to firebase storage
  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    // storing img inside image folder in firebase storage
    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };



  //access location
  getLocation = async () => {
    //ask permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    // get location
    let location = await Location.getCurrentPositionAsync({})

    const {longitude, latitude} = location.coords;
    
    location && this.props.onSend({
      location: {
        longitude,
        latitude,
      },
    });
  };



  // shows options
  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    
    this.context
      .actionSheet()
      .showActionSheetWithOptions(
        { options, cancelButtonIndex },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              return this.pickImage();
            case 1:
              return this.takePhoto();
            case 2:
              return this.getLocation();
            default:
          }
        }
      );
  };



  render() {
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}
        accessible={true} accessibilityLabel="More options"  
        accessibilityHint="Choose a picture from your camera roll, take a picture, send your location or cancel"
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};