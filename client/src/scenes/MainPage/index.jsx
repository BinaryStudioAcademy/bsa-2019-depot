import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Button, Grid, Image } from 'semantic-ui-react';

import styles from './styles.module.scss';
import { ReactComponent as SecondSVG } from '../../styles/assets/landing-images/second-pic.svg';
import { ReactComponent as ThirdSVG } from '../../styles/assets/landing-images/third-pic.svg';
import { ReactComponent as FourthSVG } from '../../styles/assets/landing-images/fourth-pic.svg';
import { ReactComponent as LogoSVG } from '../../styles/assets/landing-images/logo.svg';

const MainPage = ({ history }) => {
  function handleGetStarted() {
    history.push('/login');
  }

  return (
    <div>
      <section className={styles.main}>
        <Grid centered container columns={1}>
          <Grid.Column computer={13} mobile={16}>
            <h1 className={styles.headerCentered}>Built for professional teams</h1>
            <p className={styles.mainText}>
              Depot is more than just Git code management. Depot gives teams one place to plan projects, collaborate on
              code, test, and deploy.
            </p>
          </Grid.Column>
        </Grid>
        <Button className={styles.button} onClick={handleGetStarted}>
          Get started for free
        </Button>
        <Grid centered container columns={1}>
          <Grid.Column computer={13} mobile={16}>
            <Image src="https://wac-cdn.atlassian.com/dam/jcr:10218a75-9e62-445d-b14c-55c8e5ea7aeb/00_HeroImage.png?cdnVersion=494" />
          </Grid.Column>
        </Grid>
      </section>

      <section className={styles.advantage}>
        <SecondSVG className={styles.wave} />
        <Grid centered container>
          <Grid.Row>
            <Grid.Column computer={10} tablet={16}>
              <div className={styles.advantageImg}>
                <Image src="https://wac-cdn.atlassian.com/dam/jcr:2ed4ef04-d2b2-4e33-b5eb-bf439d1bdcc9/01_CodeCollaboration.png?cdnVersion=494" />
              </div>
            </Grid.Column>
            <Grid.Column computer={6} tablet={16}>
              <div className={styles.advantageText}>
                <h5>Code Collaboration</h5>
                <h2>Build quality software with code review</h2>
                <p>
                  Approve code review more efficiently with pull requests. Create a merge checklist with designated
                  approvers and hold discussions right in the source code with inline comments.
                </p>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>

      <section className={styles.new}>
        <Grid centered container columns={1}>
          <Grid.Column computer={13} mobile={16}>
            <h2 className={styles.headerCentered}>New to Git?</h2>
            <p className={styles.mainText}>No problem. We have resources to get you up to speed, quickly.</p>
          </Grid.Column>
        </Grid>
        <Grid centered container>
          <Grid.Row>
            <Grid.Column computer={7} tablet={16}>
              <div className={styles.newCard}>
                <Image src="https://wac-cdn.atlassian.com/dam/jcr:8da54c66-2109-41df-af77-b575b30e2edc/Git@2x.png?cdnVersion=494" />
                <h3>Learn Git with interactive tutorials</h3>
                <p>
                  Make Depot your Git sandbox with tutorials that bring you up to speed with Git and help you build
                  effective workflows.
                </p>
                <a className={styles.link} href="https://git-scm.com/">
                  Learn more
                  <ThirdSVG />
                </a>
              </div>
            </Grid.Column>
            <Grid.Column computer={7} tablet={16}>
              <div className={styles.newCard}>
                <Image src="https://wac-cdn.atlassian.com/dam/jcr:81b15cde-be2e-4f4a-8af7-9436f4a1b431/Sourcetree-icon-blue.svg?cdnVersion=494" />
                <h3>Download Sourcetree</h3>
                <p>
                  Say goodbye to the command line - Sourcetree simplifies how you interact with your Git repositories so
                  you can focus on coding.
                </p>
                <a className={styles.link} href="https://www.sourcetreeapp.com/">
                  Learn more
                  <FourthSVG />
                </a>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>

      <section className={styles.betterWay}>
        <Grid centered container columns={1}>
          <Grid.Row computer={13} mobile={16}>
            <h2 className={styles.headerCentered}>A better way to build software</h2>
          </Grid.Row>
          <Grid.Row computer={13} mobile={16}>
            <Button className={styles.button} onClick={handleGetStarted}>
              Get started for free
            </Button>
          </Grid.Row>
          <Grid.Row>
            <LogoSVG className={styles.logo} />
          </Grid.Row>
        </Grid>
      </section>

      <footer className={styles.footer}>
        <Grid className={styles.foterLine} container>
          <Grid.Row computer={13} mobile={16}>
            <p>Copyright © 2019</p>
          </Grid.Row>
        </Grid>
      </footer>
    </div>
  );
};

MainPage.propTypes = {
  history: PropTypes.object.isRequired
};

export default withRouter(MainPage);
