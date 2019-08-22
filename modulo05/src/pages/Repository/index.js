import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

import propTypes from 'prop-types';

import api from '../../services/api';

import Container from '../../components/Container';
import {
  Loading,
  LoadingIssues,
  Owner,
  IssueList,
  IssueFilter,
  IssuePages,
} from './styles';

class Repository extends Component {
  static propTypes = {
    match: propTypes.shape({
      params: propTypes.shape({
        repository: propTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loadingRepository: true,
    loadingIssues: true,
    filters: [
      { value: 'all', content: 'Todas', disabled: true },
      { value: 'open', content: 'Abertas', disabled: false },
      { value: 'closed', content: 'Finalizadas', disabled: false },
    ],
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [...filters] = this.state.filters;

    const issuesFilter = filters.find(filter => filter.disabled === true).value;

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: issuesFilter,
          per_page: 5,
          page,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loadingRepository: false,
      loadingIssues: false,
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    const filters = [...this.state.filters];

    filters.forEach(filter => {
      filter.disabled = false;
    });

    filters.find(filter => filter.value === event.target.value).disabled = true;

    this.setState({ filters, page: 1 });

    this.loadIssues();
  };

  handlePageChange = async event => {
    event.preventDefault();
    let { page } = this.state;

    if ((await event.target.value) === 'nextPage') {
      page++;
    } else {
      page--;
    }
    this.setState({ page });

    this.loadIssues();
  };

  loadIssues = async () => {
    this.setState({ loadingIssues: true });
    const { page } = this.state;
    const { match } = this.props;

    const filters = [...this.state.filters];

    const issuesFilter = filters.find(filter => filter.disabled === true).value;

    const repoName = decodeURIComponent(match.params.repository);

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: issuesFilter,
        per_page: 5,
        page,
      },
    });

    this.setState({ issues: issues.data, loadingIssues: false });
  };

  render() {
    const {
      repository,
      issues,
      loadingRepository,
      loadingIssues,
      filters,
      page,
    } = this.state;

    if (loadingRepository) {
      return (
        <Loading>
          <FaSpinner color="#fff" size={30} />
        </Loading>
      );
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          <IssueFilter>
            {filters.map(filter => (
              <button
                type="submit"
                value={filter.value}
                onClick={event => this.handleSubmit(event)}
                disabled={filter.disabled}
                key={filter.value}
              >
                {filter.content}
              </button>
            ))}
          </IssueFilter>

          {loadingIssues ? (
            <LoadingIssues>
              <FaSpinner color="#7159c1" size={14} />
            </LoadingIssues>
          ) : (
            issues.map(issue => (
              <li key={String(issue.id)}>
                <img src={issue.user.avatar_url} alt={issue.user.login} />
                <div>
                  <strong>
                    <a href={issue.html_url}>{issue.title}</a>
                    {issue.labels.map(label => (
                      <span key={String(label.id)}>{label.name}</span>
                    ))}
                  </strong>
                  <p>{issue.user.login}</p>
                </div>
              </li>
            ))
          )}

          {}

          <IssuePages>
            <button
              type="submit"
              onClick={this.handlePageChange}
              disabled={page === 1}
              value="prevPage"
            >
              Página Anterior
            </button>
            <button
              type="submit"
              onClick={this.handlePageChange}
              value="nextPage"
            >
              Próxima Página
            </button>
          </IssuePages>
        </IssueList>
      </Container>
    );
  }
}

export default Repository;
