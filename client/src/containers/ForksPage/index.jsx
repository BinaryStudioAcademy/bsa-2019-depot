import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Loader, Image, Popup, Header, Grid, Icon, Container} from 'semantic-ui-react';
import {getUserImgLink} from '../../helpers/imageHelper';
import {getForksList} from '../../services/repositoryService';
import Octicon, {getIconByName} from '@primer/octicons-react';

import './styles.module.scss';

class ForksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forks: {},
      loading: true
    };
  }

  componentDidMount() {
    this.getForksList();
  }

  getForksList() {
    const forks = {
      'original': {
        'id': 'f21268f5-6c3d-4ddb-b1a5-2d23a53a94a0',
        'name': 'new111',
        'description': '',
        'website': null,
        'isPublic': true,
        'createdAt': '2019-09-09T15:03:53.567Z',
        'updatedAt': '2019-09-09T15:03:53.567Z',
        'deletedAt': null,
        'userId': 'a930bcf7-ef16-462f-abf8-8d5c1bb6276b',
        'defaultBranchId': null,
        'forkedFromRepoId': null,
        'user': {
          'username': 'sunny',
          'imgUrl': null
        }
      },
      'forks': [
        {
          'id': 'c22cd880-cb04-46d2-8519-926d81164e74',
          'name': 'new111',
          'description': '',
          'website': null,
          'isPublic': true,
          'createdAt': '2019-09-09T15:25:37.345Z',
          'updatedAt': '2019-09-09T15:25:37.345Z',
          'deletedAt': null,
          'userId': '910a0104-f655-478a-b35c-3c9cd6e33579',
          'defaultBranchId': null,
          'forkedFromRepoId': 'f21268f5-6c3d-4ddb-b1a5-2d23a53a94a0',
          'user.username': 'testuser',
          'user.imgUrl': null,
          'user.bio': null,
          'user.location': null,
          'forks': [
            {}
          ]
        },
        {
          'id': '39516834-9228-4435-8d57-72ceea2ee20b',
          'name': 'new111',
          'description': '',
          'website': null,
          'isPublic': true,
          'createdAt': '2019-09-09T20:49:45.531Z',
          'updatedAt': '2019-09-09T20:49:45.531Z',
          'deletedAt': null,
          'userId': '9229dd12-7ebf-403e-baf9-f4a7c6f8a02b',
          'defaultBranchId': null,
          'forkedFromRepoId': 'f21268f5-6c3d-4ddb-b1a5-2d23a53a94a0',
          'user.username': 'wwwqqq',
          'user.imgUrl': null,
          'user.bio': null,
          'user.location': null,
          'forks': [
            {
              'id': '11116834-9228-4435-8d57-72ceea2ee20b',
              'name': 'new111',
              'description': '',
              'website': null,
              'isPublic': true,
              'createdAt': '2019-09-09T20:49:45.531Z',
              'updatedAt': '2019-09-09T20:49:45.531Z',
              'deletedAt': null,
              'userId': '9229dd12-7ebf-403e-baf9-f4a7c6f8a02b',
              'defaultBranchId': null,
              'forkedFromRepoId': '39516834-9228-4435-8d57-72ceea2ee20b',
              'user.username': 'rrrrrr',
              'user.imgUrl': null,
              'user.bio': null,
              'user.location': null,
              'forks': [
                {}
              ]
            }
          ]
        }
      ]
    };
    const {repositoryId} = this.props;
    //getForksList(repositoryId).then(forks => {
    this.setState({forks, loading: false});
    // });

  }

  goToPath = (history, url) => () => {
    history.push(url);
    window.location.reload();
  };

  render() {

    const {loading, forks: {original, forks}} = this.state;
    const {repositoryId, history} = this.props;
    console.warn(forks);
    //const forksListView = [];
    const showChildrenForks = forksList => {

      return (forksList.length > 0 && forksList[0] !== {} ?
        <li>
          <ul>
            {forksList.map(fork => (
              <>
              <li key={fork.id} className="forked-item">
                <Popup trigger={<Image src={getUserImgLink(fork['user.imgUrl'])} size="mini" spaced/>} flowing
                       on="hover">
                  <div className="popup-body">
                    <Grid columns="equal">
                      <Grid.Column>
                        <Image src={getUserImgLink(fork['user.imgUrl'])} size="small" spaced/>
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Header as="h4">{fork['user.username']}</Header>
                        {fork['user.bio'] ? <p>{fork['user.bio']}</p> : null}
                        {fork['user.location'] ? (
                          <p>
                            <Icon name="map marker"/>
                            {fork['user.location']}
                          </p>
                        ) : null}
                      </Grid.Column>
                    </Grid>
                  </div>
                </Popup>
                <span>
                    <Popup trigger={<Link to={`/${fork['user.username']}`}>{fork['user.username']}</Link>} flowing
                           on="hover">
                      <div className="popup-body">
                        <Grid columns="equal">
                          <Grid.Column>
                            <Image src={getUserImgLink(fork['user.imgUrl'])} size="small" spaced/>
                          </Grid.Column>
                          <Grid.Column width={12}>
                            <Header as="h4">{fork['user.username']}</Header>
                            {fork['user.bio'] ? <p>{fork['user.bio']}</p> : null}
                            {fork['user.location'] ? (
                              <p>
                                <Icon name="map marker"/>
                                {fork['user.location']}
                              </p>
                            ) : null}
                          </Grid.Column>
                        </Grid>
                      </div>
                    </Popup>
                    /
                    <Link to="" onClick={this.goToPath(history, `/${fork['user.username']}/${fork.name}`)}>
                      {fork.name}
                    </Link>
                  </span>
              </li>
              {showChildrenForks(fork.forks)}
              </>
            ))}
          </ul>
        </li> : null);
    };
    return (
      <div>
        {loading ? (
          <Loader active/>
        ) : forks.length > 0 ? (
          <ul>
            <li key={original.id} className="forked-item">
              <Popup trigger={<Image src={getUserImgLink(original.user.imgUrl)} size="mini" spaced/>} flowing
                     on="hover">
                <div className="popup-body">
                  <Grid columns="equal">
                    <Grid.Column>
                      <Image src={getUserImgLink(original.user.imgUrl)} size="small" spaced/>
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Header as="h4">{original.user.username}</Header>
                      <p>Owner</p>
                    </Grid.Column>
                  </Grid>
                </div>
              </Popup>
              <span>
                <Popup trigger={<Link to={`/${original.user.username}`}>{original.user.username}</Link>} flowing
                       on="hover">
                  <div className="popup-body">
                    <Grid columns="equal">
                      <Grid.Column>
                        <Image src={getUserImgLink(original.user.imgUrl)} size="small" spaced/>
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Header as="h4">{original.user.username}</Header>
                        <p>Owner</p>
                      </Grid.Column>
                    </Grid>
                  </div>
                </Popup>
                /<Link to={`/${original.user.username}/${original.name}`}>{original.name}</Link>
              </span>
            </li>
            {forks.map(fork => (
              <>
              <li key={fork.id} className="forked-item">
                <Popup trigger={<Image src={getUserImgLink(fork['user.imgUrl'])} size="mini" spaced/>} flowing
                       on="hover">
                  <div className="popup-body">
                    <Grid columns="equal">
                      <Grid.Column>
                        <Image src={getUserImgLink(fork['user.imgUrl'])} size="small" spaced/>
                      </Grid.Column>
                      <Grid.Column width={12}>
                        <Header as="h4">{fork['user.username']}</Header>
                        {fork['user.bio'] ? <p>{fork['user.bio']}</p> : null}
                        {fork['user.location'] ? (
                          <p>
                            <Icon name="map marker"/>
                            {fork['user.location']}
                          </p>
                        ) : null}
                      </Grid.Column>
                    </Grid>
                  </div>
                </Popup>
                <span>
                  <Popup trigger={<Link to={`/${fork['user.username']}`}>{fork['user.username']}</Link>} flowing
                         on="hover">
                    <div className="popup-body">
                      <Grid columns="equal">
                        <Grid.Column>
                          <Image src={getUserImgLink(fork['user.imgUrl'])} size="small" spaced/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                          <Header as="h4">{fork['user.username']}</Header>
                          {fork['user.bio'] ? <p>{fork['user.bio']}</p> : null}
                          {fork['user.location'] ? (
                            <p>
                              <Icon name="map marker"/>
                              {fork['user.location']}
                            </p>
                          ) : null}
                        </Grid.Column>
                      </Grid>
                    </div>
                  </Popup>
                  /
                  <Link to="" onClick={this.goToPath(history, `/${fork['user.username']}/${fork.name}`)}>
                    {fork.name}
                  </Link>
                </span>
              </li>
              {showChildrenForks(fork.forks)}
              </>
            ))}
          </ul>
        ) : (
          <Container text textAlign="center">
            <p>
              <Octicon icon={getIconByName('repo-forked')}/>
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
  history: PropTypes.object
};

const mapStateToProps = ({
                           currentRepo: {
                             repository: {
                               currentRepoInfo: {
                                 id
                               }
                             }
                           }
                         }) => ({repositoryId: id});

export default connect(mapStateToProps)(ForksPage);
