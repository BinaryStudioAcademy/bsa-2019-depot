import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Input, Dropdown, Button } from 'semantic-ui-react';
import Octicon, { Repo } from '@primer/octicons-react';

import styles from './styles.module.scss';

const RepositoriesFilters = ({
  orgPage,
  isOwner,
  isMember,
  orgName,
  getCurrentRepoTypeFilter,
  filter,
  handleFindRepo
}) => {
  const repoTypes = [
    { key: 'rt_1', text: 'Type: All', value: 'All' },
    { key: 'rt_2', text: 'Type: Public', value: 'Public' },
    { key: 'rt_3', text: 'Type: Private', value: 'Private' }
  ];

  return (
    <Container className={styles.repos_filters}>
      <Input placeholder="Find a repository…" className={styles.repos_search_input} onChange={handleFindRepo} />
      <div>
        <Dropdown fluid selection className={styles.repos_filters_dropdown_repotype} text={`Type: ${filter}`}>
          <Dropdown.Menu>
            {repoTypes.map(({ key, text, value }) => (
              <Dropdown.Item key={key} text={text} value={value} onClick={getCurrentRepoTypeFilter} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
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
};

RepositoriesFilters.propTypes = {
  actions: PropTypes.object,
  username: PropTypes.string,
  repositories: PropTypes.array,
  repo: PropTypes.object,
  orgPage: PropTypes.bool,
  isOwner: PropTypes.bool,
  isMember: PropTypes.bool,
  orgName: PropTypes.string,
  filter: PropTypes.string,
  getCurrentRepoTypeFilter: PropTypes.func,
  handleFindRepo: PropTypes.func
};

export default RepositoriesFilters;
