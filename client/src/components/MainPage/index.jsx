import React from 'react';
import { Button, Grid, Image } from 'semantic-ui-react';

import styles from './styles.module.scss';

const MainPage = () => (
    <div>
        <section className={styles.main}>
            <Grid centered container columns={1}>
                <Grid.Column computer={13} mobile={16}>
                    <h1 className={styles.header}>Built for professional teams</h1>
                    <p className={styles.mainText}>
            Bitbucket is more than just Git code management. Bitbucket gives teams one place to plan projects,
            collaborate on code, test, and deploy.
                    </p>
                </Grid.Column>
            </Grid>
            <Button className={styles.button}>Get started for free</Button>
            <p className={styles.mainHost}>
        Or host it yourself with <a href="/">Bitbucket Enterprise</a>
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
                            <p>Keep your projects organized by creating Bitbucket branches right from Jira issues or Trello cards.</p>
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
                Bitbucket Pipelines with Deployments lets you build, test and deploy with integrated CI/CD. Benefit from
                configuration as code and fast feedback loops.
                            </p>
                            <div>
                                <a href="/">Learn more</a>
                            </div>
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
                Bitbucket Pipelines with Deployments lets you build, test and deploy with integrated CI/CD. Benefit from
                configuration as code and fast feedback loops.
                            </p>
                            <div>
                                <a href="/">Learn more</a>
                            </div>
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
                access to certain users, and control their actions with branch permissions and merge checks for quality
                code.
                            </p>
                            <div>
                                <a href="/">Learn more</a>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </section>

        <section className={styles.new}>
            <Grid centered container columns={1}>
                <Grid.Column computer={13} mobile={16}>
                    <h2 className={styles.header}>New to Git?</h2>
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
                            <div>
                                <a href="/">Learn more</a>
                            </div>
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
                            <div>
                                <a href="/">Learn more</a>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </section>

        <section className={styles.integrations}>
            <Grid centered container columns={1}>
                <Grid.Column computer={13} mobile={16}>
                    <h2 className={styles.header}>Integrations: Bitbucket, but better</h2>
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
                            <p>Keep your projects organized by creating Bitbucket branches right from Jira issues or Trello cards.</p>
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
                        <div>
                            <a href="/">See all integrations</a>
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
                    <h2 className={styles.header}>More than 1 million teams and 10 million developers love Bitbucket</h2>
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
            <Grid.Column computer={13} mobile={16}>
                <hr />
            </Grid.Column>
        </Grid>

        <section className={styles.plans}>
            <Grid centered container columns={1}>
                <Grid.Column computer={10} mobile={16}>
                    <h2 className={styles.header}>Simple plans hosted in the cloud. Priced to scale.</h2>
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
    </div>
);

export default MainPage;
