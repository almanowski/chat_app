import React from 'react';
import {View, Text} from 'react-native';

export default class Chat extends React.Component {
  render() {

    // selected name from Start gets displayed
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({title: name});

    // selected color from Start
    const {bgColor} = this.props.route.params;

    return (
      <View style={{flex: 1, justifyContent: "flex-start", alignItems: "center", backgroundColor: bgColor}}>
        <Text style={{backgroundColor: '#fff'}}>Hello</Text>
      </View>
    )
  }
}