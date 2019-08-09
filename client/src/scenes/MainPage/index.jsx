import React, { useState } from 'react';
import { Button, Grid, Image, Form, Select } from 'semantic-ui-react';

import styles from './styles.module.scss';
import Header from '../../containers/Header';

const MainPage = () => {
    const [email, setEmail] = useState('');

    function handleChange({ target }) {
        setEmail(target.value);
    }

    function handleSubmit() {
    // console.log(email);
        setEmail('');
    }

    const options = [{ text: 'English', value: 'english' }, { text: 'Deutsch', value: 'deutsch' }];

    return (
        <div>
            <Header />
            <section className={styles.main}>
                <Grid centered container columns={1}>
                    <Grid.Column computer={13} mobile={16}>
                        <h1 className={styles.headerCentered}>Built for professional teams</h1>
                        <p className={styles.mainText}>
              Bitbucket is more than just Git code management. Bitbucket gives teams one place to plan projects,
              collaborate on code, test, and deploy.
                        </p>
                    </Grid.Column>
                </Grid>
                <Button className={styles.button}>Get started for free</Button>
                <p className={styles.mainHost}>
          Or host it yourself with&nbsp;
                    <a className={styles.link} href="/">
            Bitbucket Enterprise
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
                    <Grid.Row columns={3}>
                        <Grid.Column computer={5} tablet={16}>
                            <div className={styles.advantageSmall}>
                                <Image src="https://wac-cdn.atlassian.com/dam/jcr:bc1f15f9-3b2e-4c30-9313-0ebd6175f18c/File%20Cabinet@2x.png?cdnVersion=494" />
                                <h3>Free unlimited private repositories</h3>
                                <p>
                  Free for small teams under 5 and priced to scale with Standard ($2/user/mo) or Premium ($5/user/mo)
                  plans.
                                </p>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={5} tablet={16}>
                            <div className={styles.advantageSmall}>
                                <Image src="https://wac-cdn.atlassian.com/dam/jcr:cd3efc7d-0600-45f3-b24f-575114db5ce2/integration.png?cdnVersion=494" />
                                <h3>Best-in-class Jira & Trello integration</h3>
                                <p>
                  Keep your projects organized by creating Bitbucket branches right from Jira issues or Trello cards.
                                </p>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={5} tablet={16}>
                            <div className={styles.advantageSmall}>
                                <Image src="https://wac-cdn.atlassian.com/dam/jcr:2d6be396-6b47-47b3-b66f-258d933e9df3/continuous-delivery.png?cdnVersion=494" />
                                <h3>Built-in Continuous Delivery</h3>
                                <p>
                  Build, test and deploy with integrated CI/CD. Benefit from configuration as code and fast feedback
                  loops.
                                </p>
                            </div>
                        </Grid.Column>
                    </Grid.Row>

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
                        <Grid.Column className={styles.advantageTextShow} computer={6} tablet={16}>
                            <div className={styles.advantageText}>
                                <h5>Continuous Delivery</h5>
                                <h2>Deploy often with built-in continuous delivery</h2>
                                <p>
                  Bitbucket Pipelines with Deployments lets you build, test and deploy with integrated CI/CD. Benefit
                  from configuration as code and fast feedback loops.
                                </p>
                                <a className={styles.link} href="/">
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
                        <Grid.Column computer={10} tablet={16}>
                            <div className={styles.advantageImg}>
                                <Image src="https://wac-cdn.atlassian.com/dam/jcr:bb78c98b-6690-42d1-8bfd-bfc4069ead3b/02_ContinuousDelivery.png?cdnVersion=494" />
                            </div>
                        </Grid.Column>
                        <Grid.Column className={styles.advantageTextHide} computer={6} tablet={16}>
                            <div className={styles.advantageText}>
                                <h5>Continuous Delivery</h5>
                                <h2>Deploy often with built-in continuous delivery</h2>
                                <p>
                  Bitbucket Pipelines with Deployments lets you build, test and deploy with integrated CI/CD. Benefit
                  from configuration as code and fast feedback loops.
                                </p>
                                <a className={styles.link} href="/">
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
                        <Grid.Column computer={10} tablet={16}>
                            <div className={styles.advantageImg}>
                                <Image src="https://wac-cdn.atlassian.com/dam/jcr:45c6a731-7f0d-4d21-b1c2-81445edbd9ca/03_Security.png?cdnVersion=494" />
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={6} tablet={16}>
                            <div className={styles.advantageText}>
                                <h5>Security</h5>
                                <h2>Secure your workflow</h2>
                                <p>
                  Know your code is secure in the Cloud with IP whitelisting and required 2-step verification. Restrict
                  access to certain users, and control their actions with branch permissions and merge checks for
                  quality code.
                                </p>
                                <a className={styles.link} href="/">
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
                  Make Bitbucket your Git sandbox with tutorials that bring you up to speed with Git and help you build
                  effective workflows.
                                </p>
                                <a className={styles.link} href="/">
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
                                <h3>Download Sourcetree, our free Git GUI.</h3>
                                <p>
                  Say goodbye to the command line - Sourcetree simplifies how you interact with your Git repositories so
                  you can focus on coding.
                                </p>
                                <a className={styles.link} href="/">
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

            <section className={styles.integrations}>
                <Grid centered container columns={1}>
                    <Grid.Column computer={13} mobile={16}>
                        <h2 className={styles.headerCentered}>Integrations: Bitbucket, but better</h2>
                        <p className={styles.mainText}>
              Start with Bitbucket, then bring in the tools you already use to build better software
                        </p>
                    </Grid.Column>

                    <Grid.Row columns={3}>
                        <Grid.Column computer={5} tablet={16}>
                            <div className={styles.integrationsBlock}>
                                <Image src="https://wac-cdn.atlassian.com/dam/jcr:cd3efc7d-0600-45f3-b24f-575114db5ce2/integration.png?cdnVersion=494" />
                                <h3>Free unlimited private repositories</h3>
                                <p>
                  Free for small teams under 5 and priced to scale with Standard ($2/user/mo) or Premium ($5/user/mo)
                  plans.
                                </p>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={5} tablet={16}>
                            <div className={styles.integrationsBlock}>
                                <Image src="https://wac-cdn.atlassian.com/dam/jcr:de9d5bd9-938b-4be9-a9d8-ab38bb104600/Integration%20Puzzle@2x.png?cdnVersion=494" />
                                <h3>Best-in-class Jira & Trello integration</h3>
                                <p>
                  Keep your projects organized by creating Bitbucket branches right from Jira issues or Trello cards.
                                </p>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={5} tablet={16}>
                            <div className={styles.integrationsBlock}>
                                <Image src="https://wac-cdn.atlassian.com/dam/jcr:dc2b41b1-bf13-42c7-a085-cab4ea8f84f2/Webhooks@2x.png?cdnVersion=494" />
                                <h3>Built-in Continuous Delivery</h3>
                                <p>
                  Build, test and deploy with integrated CI/CD. Benefit from configuration as code and fast feedback
                  loops.
                                </p>
                            </div>
                        </Grid.Column>
                        <Grid.Column tablet={15}>
                            <a className={styles.link} href="/">
                See all integrations
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
              More than 1 million teams and 10 million developers love Bitbucket
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

            <section className={styles.plans}>
                <Grid centered container columns={1}>
                    <Grid.Column computer={10} mobile={16}>
                        <h2 className={styles.headerCentered}>Simple plans hosted in the cloud. Priced to scale.</h2>
                    </Grid.Column>

                    <Grid.Row>
                        <Grid.Column computer={5} mobile={16}>
                            <div className={styles.plan}>
                                <div className={styles.planHeader}>
                                    <h4>Free</h4>
                                    <p>for small teams</p>
                                    <h2>$0</h2>
                                    <p>/ user / month</p>
                                    <p>Free for up to 5 users</p>
                                </div>
                                <div className={styles.planBody}>
                                    <ul>
                                        <li className={styles.featured}>Unlimited private repos</li>
                                        <li className={styles.featured}>Jira Software integration</li>
                                        <li className={styles.featured}>Projects</li>
                                        <li className={styles.featured}>Pipelines</li>
                                        <li className={styles.deemphasized}>Unlimited users</li>
                                        <li className={styles.deemphasized}>Merge checks</li>
                                        <li className={styles.deemphasized}>Deployment permissions</li>
                                        <li className={styles.deemphasized}>IP Whitelisting</li>
                                        <li className={styles.deemphasized}>Required two-step verification</li>
                                        <li className={styles.deemphasized}>Smart Mirroring</li>
                                    </ul>
                                </div>
                                <hr />
                                <div className={styles.planFooter}>
                                    <ul>
                                        <li>
                                            <i>Included with your account:</i>
                                        </li>
                                        <li>*Build minutes: 50 mins/mo</li>
                                        <li>*File storage: 1GB/mo</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.btnWrapper}>
                                <Button className={styles.button}>Get started for free</Button>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={5} mobile={16}>
                            <div className={styles.plan}>
                                <div className={styles.planHeader}>
                                    <h4>Standard</h4>
                                    <p>for growing teams</p>
                                    <h2>$2</h2>
                                    <p>/ user / month</p>
                                    <p>Starts at $10 /month</p>
                                </div>
                                <div className={styles.planBody}>
                                    <ul>
                                        <li className={styles.featured}>Unlimited private repos</li>
                                        <li className={styles.featured}>Jira Software integration</li>
                                        <li className={styles.featured}>Projects</li>
                                        <li className={styles.featured}>Pipelines</li>
                                        <li className={styles.featured}>Unlimited users</li>
                                        <li className={styles.featured}>Merge checks</li>
                                        <li className={styles.deemphasized}>Deployment permissions</li>
                                        <li className={styles.deemphasized}>IP Whitelisting</li>
                                        <li className={styles.deemphasized}>Required two-step verification</li>
                                        <li className={styles.deemphasized}>Smart Mirroring</li>
                                    </ul>
                                </div>
                                <hr />
                                <div className={styles.planFooter}>
                                    <ul>
                                        <li>
                                            <i>Included with your account:</i>
                                        </li>
                                        <li>*Build minutes: 500 mins/mo</li>
                                        <li>*File storage: 5GB/mo</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.btnWrapper}>
                                <Button className={styles.button}>Try it</Button>
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={5} mobile={16}>
                            <div className={styles.plan}>
                                <div className={styles.planHeader}>
                                    <h4>Premium</h4>
                                    <p>for large teams</p>
                                    <h2>$5</h2>
                                    <p>/ user / month</p>
                                    <p>Starts at $25 /month</p>
                                </div>
                                <div className={styles.planBody}>
                                    <ul>
                                        <li className={styles.featured}>Unlimited private repos</li>
                                        <li className={styles.featured}>Jira Software integration</li>
                                        <li className={styles.featured}>Projects</li>
                                        <li className={styles.featured}>Pipelines</li>
                                        <li className={styles.featured}>Unlimited users</li>
                                        <li className={styles.featured}>Merge checks</li>
                                        <li className={styles.featured}>Deployment permissions</li>
                                        <li className={styles.featured}>IP Whitelisting</li>
                                        <li className={styles.featured}>Required two-step verification</li>
                                        <li className={styles.featured}>Smart Mirroring</li>
                                    </ul>
                                </div>
                                <hr />
                                <div className={styles.planFooter}>
                                    <ul>
                                        <li>
                                            <i>Included with your account:</i>
                                        </li>
                                        <li>*Build minutes: 1000 mins/mo</li>
                                        <li>*File storage: 10GB/mo</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.btnWrapper}>
                                <Button className={styles.button}>Try it</Button>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid centered container columns={1}>
                    <Grid.Column computer={8} mobile={16}>
                        <p>
              *Build minutes are for <a href="/">Bitbucket Pipelines</a> and File storage is for{' '}
                            <a href="/">Git Large File Storage (LFS)</a>. Build minutes and file storage are shared among all users on
              an account.{' '}
                        </p>
                    </Grid.Column>
                </Grid>
            </section>

            <section className={styles.cloud}>
                <Grid centered container columns={1}>
                    <Grid.Column computer={14} mobile={16}>
                        <div className={styles.block}>
                            <Grid centered container columns={1}>
                                <Grid.Row>
                                    <Grid.Column computer={3} mobile={16}>
                                        <Image src="https://wac-cdn.atlassian.com/dam/jcr:4a1b934f-38b4-456e-b807-29e93935e00f/Server%20Cluster@2x.png?cdnVersion=494" />
                                    </Grid.Column>
                                    <Grid.Column computer={13} mobile={16}>
                                        <h2 className={styles.header}>Want to host on your own server?</h2>
                                        <p>
                      Get full control of your source code with Bitbucket Server. As your
                                            <br /> team and workflow matures, graduate from a single server
                                            <br /> deployment to a highly available, active-cluster with Bitbucket Data
                                            <br /> Center.
                                        </p>
                                        <a className={styles.link} href="/">
                      Bitbucket Server
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
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column computer={3} mobile={16}>
                                        <Image src="https://wac-cdn.atlassian.com/dam/jcr:97c2284e-2b25-438a-9c61-1832aa75111e/Cloud@2x.png?cdnVersion=494" />
                                    </Grid.Column>
                                    <Grid.Column computer={13} mobile={16}>
                                        <h2 className={styles.header}>See a demo of Bitbucket Cloud</h2>
                                        <p>
                      Want to see Bitbucket Cloud in action? Watch a recorded demo and get the facts from one of our
                      experts so you can get started yourself.
                                        </p>
                                        <a className={styles.link} href="/">
                      Watch the demo
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
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Grid.Column>
                </Grid>
            </section>

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
                <Grid centered container columns={1}>
                    <Grid.Row>
                        <Grid.Column computer={4} mobile={16}>
                            <h4>Bitbucket</h4>
                            <ul>
                                <li>
                                    <a href="/">Blog</a>
                                </li>
                                <li>
                                    <a href="/">Bitbucket writing program</a>
                                </li>
                                <li>
                                    <a href="/">API</a>
                                </li>
                                <li>
                                    <a href="/">Site status</a>
                                </li>
                            </ul>
                        </Grid.Column>
                        <Grid.Column computer={4} mobile={16}>
                            <h4>Resources</h4>
                            <ul>
                                <li>
                                    <a href="/">Technical support</a>
                                </li>
                                <li>
                                    <a href="/">Documentation</a>
                                </li>
                                <li>
                                    <a href="/">Plans & pricing</a>
                                </li>
                                <li>
                                    <a href="/">What is Version Control?</a>
                                </li>
                            </ul>
                        </Grid.Column>
                        <Grid.Column computer={8} mobile={16}>
                            <h4>Connect with us</h4>
                            <p>Sign up for Git articles and resources:</p>
                            <Form className={styles.form} onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Input placeholder="Email address" name="email" value={email} onChange={handleChange} />
                                    <Form.Button content="Subscribe" />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid container>
                    <Grid.Column className={styles.social} mobile={16}>
                        <p>Connect with Bitbucket</p>
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
                </Grid>
                <Grid className={styles.foterLine} container>
                    <Grid.Row computer={13} mobile={16}>
                        <ul>
                            <li>
                                <a href="/">
                                    <Image src="https://wac-cdn.atlassian.com/dam/jcr:bec8148d-b7dc-493f-bbba-7519b0637581/logos-atlassian-logo-gradient-horizontal-neutral.svg?cdnVersion=494" />
                                </a>
                            </li>
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
                        <a className={styles.link} href="/">
              View all Atlassian products
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
                    </Grid.Row>
                    <Grid.Row>
                        <Form>
                            <Form.Group widths="equal">
                                <Form.Field className={styles.selectLeng} control={Select} options={options} placeholder="Languages" />
                            </Form.Group>
                        </Form>
                    </Grid.Row>
                </Grid>
            </footer>
        </div>
    );
};

export default MainPage;
