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
        Or host it yourself with <a href="#">Bitbucket Enterprise</a>
            </p>
            <Grid centered container columns={1}>
                <Grid.Column computer={13} mobile={16}>
                    <Image src="https://wac-cdn.atlassian.com/dam/jcr:10218a75-9e62-445d-b14c-55c8e5ea7aeb/00_HeroImage.png?cdnVersion=494" />
                </Grid.Column>
            </Grid>
        </section>
        <section className={styles.advantage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 68" enableBackground="new 0 0 1440 68">
                <path
                    d="m1622.3 1937.7c0 0-410.7 169.1-913.4 75.5-502.7-93.6-977.7 56.3-977.7 56.3v440h1891.1v-571.8"
                    fill="#F4F5F7"
                    transform="translate(0-1977)"
                ></path>
            </svg>
        </section>
    </div>
);

export default MainPage;
