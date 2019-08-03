import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Loading,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author
} from './styles';

class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func
    }).isRequired
  };

  state = {
    stars: [],
    loading: true,
    page: 1,
    refreshing: false
  };

  async componentDidMount() {
    const response = await this.load();
    this.setState({ stars: response.data, loading: false });
  }

  load = async () => {
    const { page } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    return response;
  };

  loadMore = async () => {
    const { stars } = this.state;
    let { page } = this.state;

    page += 1;

    await this.setState({ page });
    const response = await this.load();

    this.setState({ stars: [...stars, ...response.data], page });
  };

  refreshList = async () => {
    await this.setState({ refreshing: true, page: 1 });
    const response = await this.load();
    this.setState({ stars: response.data, refreshing: false });
  };

  handleNavigate = star => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { uri: star.html_url, title: star.name });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading>
            <ActivityIndicator color="#7159c1" />
          </Loading>
        ) : (
          <Stars
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

export default User;
