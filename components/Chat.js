import React from 'react';
import {View, Platform, KeyboardAvoidingView} from 'react-native';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import * as Font from 'expo-font';

// import firebase/firestore
const firebase = require('firebase');
require('firebase/firestore');

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC969NAkXMPDObohcwHsZdoTq439nMjYZw',
  authDomain: 'chatapp-d50da.firebaseapp.com',
  projectId: 'chatapp-d50da',
  storageBucket: 'chatapp-d50da.appspot.com',
  messagingSenderId: '720089962498',
  appId: '1:720089962498:web:d9d1b466f4355f1bd76f1b'
}


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      fontsLoaded: false,
      uid: 0,
      user:{
        _id: '',
        name: '',
        avatar: '',
      }
    }

    // initialize app 
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }
  }

  // load cutsom fonts from assets
  async loadFonts() {
    await Font.loadAsync({
      // load poppins regular/400
      'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    });
    this.setState({fontsLoaded: true});
  }
  

  componentDidMount() {
    // selected name from Start gets displayed
    let name = this.props.route.params.name;
    // adds the name to top of the screen
    this.props.navigation.setOptions({title: name});

    // loads font/poppins
    this.loadFonts();

    // get collection from firstore
    this.referenceChatMessages = firebase.firestore()
    .collection('messages');

    // check if user is signed in
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: 'https://placeimg.com/140/140/people'
        }
      });
      this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }


  onCollectionUpdate = (querySnapshot) => {
    // Whenever the collections updates, rewrites the new collection to state
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages: messages,
    });
  };


  // add a new message to the collection
  addMessage() {
    const message = this.state.messages[0];
    
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: this.state.user
    });
  }


  // user sends message
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
    })
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }
  
  // change textbubble colors
  renderBubble(props) {
    return (
      <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#f6d8ae',
          padding: 6,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 30,
          borderTopEndRadius: 30,
          borderTopLeftRadius: 30,
        },
        left: {
          padding: 6,
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 0,
          borderTopEndRadius: 30,
          borderTopLeftRadius: 30,
          lineHeight: 5
        }
      }}
      textStyle={{
        right: {
          color: '#000',
          fontFamily: 'Poppins-Regular',
          fontSize: 15,
        },
        left: {
          fontFamily: 'Poppins-Regular',
          fontSize: 15
        }
      }}
      timeTextStyle={{
        right: {
          color: '#6b6b6b',
        },
        left: {
          color: '#6b6b6b',
        }
      }}
      />
    )
  }

  render() {
    // selected color from Start
    const {bgColor} = this.props.route.params;

    return (
      <View style={{flex: 1, backgroundColor: bgColor}}>
        <GiftedChat renderBubble={this.renderBubble.bind(this)} showUserAvatar
          messages={this.state.messages} onSend={messages => this.onSend(messages)}
          user={{_id: this.state.user._id, name: this.state.name, avatar: this.state.user.avatar}} 
        />

        {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}
