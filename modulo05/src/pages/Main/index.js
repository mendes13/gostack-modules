import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';
import { SubmitButton, Form, List } from './styles';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    found: true,
    error: '',
  };

  // Load data from localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // Save data to localStorage
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = event => {
    this.setState({ newRepo: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true });
    const { newRepo, repositories } = this.state;

    const duplicatedRepo = repositories.some(
      repo => repo.name.toLowerCase() === newRepo.toLowerCase()
    );

    try {
      if (duplicatedRepo) {
        throw new Error('Repositório duplicado!');
      }

      api.interceptors.response.use(null, err => {
        if (err) {
          throw new Error('Repositório Inexistente');
        }

        return Promise.reject(err);
      });

      const response = await api.get(`repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        newRepo: '',
        repositories: [...repositories, data],
        found: true,
        error: '',
      });
    } catch (err) {
      this.setState({ found: false, error: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { newRepo, loading, repositories, found, error } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} found={found}>
          <div>
            <input
              type="text"
              placeholder="Adicionar repositório"
              value={newRepo}
              onChange={this.handleInputChange}
            />

            <SubmitButton loading={loading}>
              {loading ? (
                <FaSpinner color="#fff" size={14} />
              ) : (
                <FaPlus color="#fff" size={14} />
              )}
            </SubmitButton>
          </div>

          {error.length > 0 && <span>{error}</span>}
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
