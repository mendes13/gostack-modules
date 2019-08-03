import React from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

function Repository({ navigation }) {
  const uri = navigation.getParam('uri');
  return <WebView source={{ uri }} style={{ flex: 1 }} />;
}

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('title')
});

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func
  }).isRequired
};

export default Repository;
