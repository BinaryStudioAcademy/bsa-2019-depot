import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Loader, Image, Popup, Header, Grid, Icon, Container } from 'semantic-ui-react';
import { getUserImgLink } from '../../helpers/imageHelper';
import { getForksList } from '../../services/repositoryService';
import Octicon, { getIconByName } from '@primer/octicons-react';

import './styles.module.scss';

class ForksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forks: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getForksList();
  }

  getForksList() {
    const { repositoryId } = this.props;
    getForksList(repositoryId).then(forks => {
      this.setState({ forks, loading: false });
    });
  }

  render() {
    const { loading, forks } = this.state;
    const { repositoryId, name, username, imgUrl } = this.props;
    return (
      <div>
        {loading ? (
          <Loader active />
        ) : forks.length > 0 ? (
          <ul>
            <li key={repositoryId} className="forked-item">
              <Popup trigger={<Image src={getUserImgLink(imgUrl)} size="mini" spaced />} flowing on="hover">
                <div className="popup-body">
                  <Grid columns="equal">
                    <Grid.Column>
                      <Image src={getUserImgLink(imgUrl)} size="small" spaced />
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Header as="h4">{username}</Header>
                      <p>Owner</p>
                    </Grid.Column>
                  </Grid>
                </div>
              </Popup>
              <span>
                <Popup trigger={<Link to={`/${username}`}>{username}</Link>} flowing on="hover">
                  <div className="popup-body">
                    <Grid columns="equal">
                      <Grid.Column>
                        <Image src={getUserImgLink(imgUrl)} size="small" spaced />
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Header as="h4">{username}</Header>
                        <p>Owner</p>
                      </Grid.Column>
                    </Grid>
                  </div>
                </Popup>
                /<Link to={`/${username}/${name}`}>{name}</Link>
              </span>
            </li>
            {forks.map(({ id, name, user }) => (
              <li key={id} className="forked-item">
                <Popup trigger={<Image src={getUserImgLink(user.imgUrl)} size="mini" spaced />} flowing on="hover">
                  <div className="popup-body">
                    <Grid columns="equal">
                      <Grid.Column>
                        <Image src={getUserImgLink(user.imgUrl)} size="small" spaced />
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Header as="h4">{user.username}</Header>
                        {user.bio ? <p>{user.bio}</p> : null}
                        {user.location ? (
                          <p>
                            <Icon name="map marker" />
                            {user.location}
                          </p>
                        ) : null}
                      </Grid.Column>
                    </Grid>
                  </div>
                </Popup>
                <span>
                  <Popup trigger={<Link to={`/${user.username}`}>{user.username}</Link>} flowing on="hover">
                    <div className="popup-body">
                      <Grid columns="equal">
                        <Grid.Column>
                          <Image src={getUserImgLink(user.imgUrl)} size="small" spaced />
                        </Grid.Column>
                        <Grid.Column width={12}>
                          <Header as="h4">{user.username}</Header>
                          {user.bio ? <p>{user.bio}</p> : null}
                          {user.location ? (
                            <p>
                              <Icon name="map marker" />
                              {user.location}
                            </p>
                          ) : null}
                        </Grid.Column>
                      </Grid>
                    </div>
                  </Popup>
                  /<Link to={`/${user.username}/${name}`}>{name}</Link>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Container text textAlign="center">
            <p>
              <Octicon icon={getIconByName('repo-forked')} />
            </p>
            <Header as="h3">No one has forked this repository yet.</Header>
            <p>
              Forks are a great way to contribute to a repository. After forking a repository, you can send the original
              author a pull request.
            </p>
          </Container>
        )}
      </div>
    );
  }
}

ForksPage.propTypes = {
  repositoryId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  imgUrl: PropTypes.string
};

const mapStateToProps = ({
  currentRepo: {
    repository: {
      currentRepoInfo: {
        id,
        name,
        user: { username, imgUrl }
      }
    }
  }
}) => ({ repositoryId: id, name, username, imgUrl });

export default connect(mapStateToProps)(ForksPage);
