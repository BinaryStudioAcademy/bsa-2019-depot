import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Input, Dropdown, Button } from 'semantic-ui-react';
import Octicon, { Repo } from '@primer/octicons-react';

import styles from './styles.module.scss';

export class RepositoriesFilters extends React.Component {
  render() {
    const repoTypes = [
      { key: 'rt_1', text: 'Type: All', value: 'All' },
      { key: 'rt_2', text: 'Type: Public', value: 'Public' },
      { key: 'rt_3', text: 'Type: Private', value: 'Private' }
    ];

    const languageTypes = [
      { key: 'lt_1', text: 'JavaScript', value: 'JavaScript' },
      { key: 'lt_2', text: 'HTML', value: 'HTML' },
      { key: 'lt_3', text: 'CSS', value: 'CSS' }
    ];

    const { orgPage, isOwner, isMember, orgName, getCurrentRepoFilter, filter } = this.props;

    return (
      <Container className={styles.repos_filters}>
        <Input placeholder="Find a repository…" className={styles.repos_search_input} />
        <div>
          <Dropdown fluid selection className={styles.repos_filters_dropdown} text={`Type: ${filter}`}>
            <Dropdown.Menu>
              {repoTypes.map(({ key, text, value }) => (
                <Dropdown.Item key={key} text={text} value={value} onClick={getCurrentRepoFilter} />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <Dropdown
            placeholder="Language"
            fluid
            selection
            options={languageTypes}
            className={styles.repos_filters_dropdown}
          />
        </div>
        {(orgPage ? isOwner || isMember : true) && (
          <div className={styles.new_repo_wrapper}>
            <Link to={orgPage ? `/organizations/${orgName}/repositories/new` : '/new'}>
              <Button primary className={styles.new_repo}>
                <Octicon icon={Repo} className={styles.new_repo_icon} />
                New
              </Button>
            </Link>
          </div>
        )}
      </Container>
    );
  }
}

RepositoriesFilters.propTypes = {
  actions: PropTypes.object,
  username: PropTypes.string,
  repositories: PropTypes.array,
  repo: PropTypes.object,
  orgPage: PropTypes.bool,
  isOwner: PropTypes.bool,
  orgName: PropTypes.string,
  filter: PropTypes.string,
  getCurrentRepoFilter: PropTypes.func
};

export default RepositoriesFilters;
