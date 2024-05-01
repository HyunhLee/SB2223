import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {Divider} from '@mui/material';
import {MainLayout} from '../components/main-layout';
import {HomeClients} from '../components/home/home-clients';
import {HomeHero} from '../components/home/home-hero';
import {HomeDevelopers} from '../components/home/home-developers';
import {HomeDesigners} from '../components/home/home-designers';
import {HomeFeatures} from '../components/home/home-features';
import {HomeTestimonials} from '../components/home/home-testimonials';
import {gtm} from '../lib/gtm';
import {DashboardLayout} from "../components/dashboard/dashboard-layout";
import Overview from "./dashboard";
import {AuthGuard} from "../components/authentication/auth-guard";

const Home: NextPage = () => {
  useEffect(() => {
    gtm.push({event: 'page_view'});
  }, []);

  return (
    <>
      <Head>
        <title>
          StyleBot
        </title>
      </Head>
      <main>
        <Overview/>
      </main>
    </>
  );
};

Home.getLayout = (page) => (
  <MainLayout>
    <AuthGuard>
      <DashboardLayout>
        {page}
      </DashboardLayout>
    </AuthGuard>
  </MainLayout>
);

export default Home;
