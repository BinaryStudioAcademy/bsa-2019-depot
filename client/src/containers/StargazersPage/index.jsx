import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as repositoryService from '../../services/repositoryService';


import Octicon, { getIconByName } from '@primer/octicons-react';
import { Container, Header, Image, Loader } from 'semantic-ui-react';
import styles from './styles.module.scss';

class StargazersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stargazers: null,
      loading: false
    };
  }

  componentDidMount() {
    const { repoId } = this.props;
    repositoryService.getStargazers(repoId)
      .then(stargazers => this.setState({ stargazers }));
  }

  render() {
    // const { stargazers, loading } = this.state;
    // console.log(stargazers);
    return loading 
      ? (
        <div>
          <Loader />
        </div>
      ) : (
        <Container>
          <Header as='h2' className={styles.stargazerHeader}>Stargazers</Header>
          <div className={styles.stargazersGrid}>
            <div className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </div>
            <div className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </div>
            <div className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </div>
            <div className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </div>
            <div className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </div>
          </div>
          {/* <Grid columns={3}>
            <Grid.Column className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </Grid.Column>
            <Grid.Column className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </Grid.Column>
            <Grid.Column className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </Grid.Column>
            <Grid.Column className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </Grid.Column>
            <Grid.Column className={styles.stargazerBox}>
              <Image src="https://avatars1.githubusercontent.com/u/43038168?s=60&v=4" width="75" height="75" className={styles.stargazerImage} />
              <div className={styles.stargazerInfo}>
                <Link className={styles.profileLink} to="">PashaNaumencko</Link>
                <Octicon className={styles.icon} icon={getIconByName('clock')} />
                <span className={styles.stargazerDate}>Joined on July 11, 2019</span>
              </div>
            </Grid.Column> 
          </Grid> */}
        </Container>
      );
  }
}

StargazersPage.propTypes = {
  repoId: PropTypes.string.isRequired
};

const mapStateToProps = ({ currentRepo : { repository: { currentRepoInfo: { id } } } }) => ({
  repoId: id
});

export default connect(
  mapStateToProps
)(StargazersPage);