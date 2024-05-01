import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Box,
  Container,
  Divider,
  Grid,
} from '@mui/material';
import { AuthGuard } from '../../components/authentication/auth-guard';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { gtm } from '../../lib/gtm';

const Overview: NextPage = () => {
  const [displayBanner, setDisplayBanner] = useState<boolean>(true);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  useEffect(() => {
    // Restore the persistent state from local/session storage
    const value = globalThis.sessionStorage.getItem('dismiss-banner');

    if (value === 'true') {
      // setDisplayBanner(false);
    }
  }, []);

  const handleDismissBanner = () => {
    // Update the persistent state
    // globalThis.sessionStorage.setItem('dismiss-banner', 'true');
    setDisplayBanner(false);
  };

  return (
    <>
      <Head>
        <title>
          Dashboard: Overview | StyleBot
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          height: '90vh'
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              {/*<OverviewCryptoWallet />*/}
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              {/*<OverviewPrivateWallet />*/}
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              {/*<OverviewTotalTransactions />*/}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Overview.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Overview;
