import React from 'react';
import {View, Platform, KeyboardAvoidingView} from 'react-native';
import {Bubble, GiftedChat} from 'react-native-gifted-chat';
import * as Font from 'expo-font';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      fontsLoaded: false,
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
    this.props.navigation.setOptions({title: name});

    this.loadFonts();

    // add first message
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hi ' + name + ' 👋😊',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: name + ' has entered the chat',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
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

  // user sends message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    // selected color from Start
    const {bgColor} = this.props.route.params;

    return (
      <View style={{flex: 1, backgroundColor: bgColor}}>

        <GiftedChat renderBubble={this.renderBubble.bind(this)} showUserAvatar 
          messages={this.state.messages} onSend={messages => this.onSend(messages)} user={{_id: 1, avatar: 'https://placeimg.com/140/140/people'}} 
        />

        {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}