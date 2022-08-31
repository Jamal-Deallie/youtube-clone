import type { NextPage } from 'next';
import { ReactElement } from 'react';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import HomePageLayout from '../layout/Home';

const Home = () => {
  return <div className={styles.container}></div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <HomePageLayout>{page}</HomePageLayout>;
};

export default Home;
