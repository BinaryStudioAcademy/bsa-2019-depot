import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Grid, Image, Form, Select } from 'semantic-ui-react';

import styles from './styles.module.scss';

const MainPage = () => {
  const [email, setEmail] = useState('');

  function handleChange({ target }) {
    setEmail(target.value);
  }

  function handleSubmit() {
    setEmail('');
  }
  const token = localStorage.getItem('token');

  return token
    ? <Redirect to="/login" />
    : (
      <div>
        <section className={styles.main}>
          <Grid centered container columns={1}>
            <Grid.Column computer={13} mobile={16}>
              <h1 className={styles.headerCentered}>Built for professional teams</h1>
              <p className={styles.mainText}>
              Depot is more than just Git code management. Depot gives teams one place to plan projects,
              collaborate on code, test, and deploy.
              </p>
            </Grid.Column>
          </Grid>
          <Button className={styles.button}>Get started for free</Button>
          <p className={styles.mainHost}>
          Or host it yourself with&nbsp;
            <a className={styles.link} href="/">
            Depot Enterprise
              <svg
                width="11px"
                height="8px"
                viewBox="0 0 11 8"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                  <g className="group-path" transform="translate(-138.000000, -586.000000)" fill="#0052CC">
                    <path
                      d="M145.2803,586.507862 L144.2193,587.568863 L145.9393,589.287862 L138.7503,589.287862 C138.3363,589.287862 138.0003,589.623862 138.0003,590.037862 C138.0003,590.451862 138.3363,590.787862 138.7503,590.787862 L145.9393,590.787862 L144.2193,592.507862 L145.2803,593.568863 L148.8103,590.037862 L145.2803,586.507862 Z"
                      id="Fill-1"
                    />
                  </g>
                </g>
              </svg>
            </a>
          </p>
          <Grid centered container columns={1}>
            <Grid.Column computer={13} mobile={16}>
              <Image src="https://wac-cdn.atlassian.com/dam/jcr:10218a75-9e62-445d-b14c-55c8e5ea7aeb/00_HeroImage.png?cdnVersion=494" />
            </Grid.Column>
          </Grid>
        </section>

        <section className={styles.advantage}>
          <svg
            className={styles.wave}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 68"
            enableBackground="new 0 0 1440 68"
          >
            <path
              d="m1622.3 1937.7c0 0-410.7 169.1-913.4 75.5-502.7-93.6-977.7 56.3-977.7 56.3v440h1891.1v-571.8"
              fill="#F4F5F7"
              transform="translate(0-1977)"
            ></path>
          </svg>
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
                    <svg
                      width="11px"
                      height="8px"
                      viewBox="0 0 11 8"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                        <g className="group-path" transform="translate(-138.000000, -586.000000)" fill="#0052CC">
                          <path
                            d="M145.2803,586.507862 L144.2193,587.568863 L145.9393,589.287862 L138.7503,589.287862 C138.3363,589.287862 138.0003,589.623862 138.0003,590.037862 C138.0003,590.451862 138.3363,590.787862 138.7503,590.787862 L145.9393,590.787862 L144.2193,592.507862 L145.2803,593.568863 L148.8103,590.037862 L145.2803,586.507862 Z"
                            id="Fill-1"
                          />
                        </g>
                      </g>
                    </svg>
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
                    <svg
                      width="11px"
                      height="8px"
                      viewBox="0 0 11 8"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                        <g className="group-path" transform="translate(-138.000000, -586.000000)" fill="#0052CC">
                          <path
                            d="M145.2803,586.507862 L144.2193,587.568863 L145.9393,589.287862 L138.7503,589.287862 C138.3363,589.287862 138.0003,589.623862 138.0003,590.037862 C138.0003,590.451862 138.3363,590.787862 138.7503,590.787862 L145.9393,590.787862 L144.2193,592.507862 L145.2803,593.568863 L148.8103,590.037862 L145.2803,586.507862 Z"
                            id="Fill-1"
                          />
                        </g>
                      </g>
                    </svg>
                  </a>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </section>

        <section className={styles.clients}>
          <svg
            className={styles.wave}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 68"
            enableBackground="new 0 0 1440 68"
          >
            <path
              d="m1622.3 1937.7c0 0-410.7 169.1-913.4 75.5-502.7-93.6-977.7 56.3-977.7 56.3v440h1891.1v-571.8"
              fill="#F4F5F7"
              transform="translate(0-1977)"
            ></path>
          </svg>
          <Grid centered container columns={1}>
            <Grid.Column computer={12} mobile={16}>
              <h2 className={styles.headerCentered}>
              More than 1 million teams and 10 million developers love Depot
              </h2>
            </Grid.Column>

            <Grid.Column>
              <Image
                className={styles.advantageTextShow}
                centered
                src="https://wac-cdn.atlassian.com/dam/jcr:8987dded-dcd1-4eff-abea-a592da1ec4c2/customers-image.png?cdnVersion=494"
              />
              <Image
                className={styles.advantageTextHide}
                centered
                src="https://wac-cdn.atlassian.com/dam/jcr:24d25d1b-61af-41c6-bf40-eb577896e926/Products.png?cdnVersion=494"
              />
            </Grid.Column>
          </Grid>
        </section>

        <Grid centered container columns={1}>
          <Grid.Column computer={15} mobile={16}>
            <hr />
          </Grid.Column>
        </Grid>

        <section className={styles.betterWay}>
          <Grid centered container columns={1}>
            <Grid.Column computer={13} mobile={16}>
              <h2 className={styles.headerCentered}>A better way to build software</h2>
            </Grid.Column>
            <Grid.Row computer={13} mobile={16}>
              <Button className={styles.button}>Get started for free</Button>
            </Grid.Row>
          </Grid>
        </section>

        <footer className={styles.footer}>
          <Grid container columns={1}>
            <Grid.Row>
              <Grid.Column mobile={16} computer={8}>
                <h4>Connect with us</h4>
                <p>Sign up for Git articles and resources:</p>
                <Form className={styles.form} onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Input placeholder="Email address" name="email" value={email} onChange={handleChange} />
                    <Form.Button content="Subscribe" />
                  </Form.Group>
                </Form>
                <Grid.Column className={styles.social} mobile={16}>
                  <p>Connect with Depot</p>
                  <ul>
                    <li>
                      <a className={styles.fb} href="https://www.facebook.com/">
                      fb
                      </a>
                    </li>
                    <li>
                      <a className={styles.tw} href="https://twitter.com/">
                      tw
                      </a>
                    </li>
                  </ul>
                </Grid.Column>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid className={styles.foterLine} container>
            <Grid.Row computer={13} mobile={16}>
              <ul>
                <li>
                  <a href="/">Privacy policy </a>
                </li>
                <li>
                  <a href="/">Terms of use</a>
                </li>
                <li>
                  <a href="/">Trust & security</a>
                </li>
                <li>
                  <p>Copyright © 2019</p>
                </li>
              </ul>
            </Grid.Row>
          </Grid>
        </footer>
      </div>
    );
};

export default MainPage;
