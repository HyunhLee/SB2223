import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {Box, Container, Divider, Typography} from '@mui/material';
import {AuthGuard} from '../../components/authentication/auth-guard';
import {DashboardLayout} from '../../components/dashboard/dashboard-layout';
import {HandsomeFitInspectionProduct} from "../../components/handsome-components/handsome-fit-inspection-product";
import {gtm} from '../../lib/gtm';
import {handsomeAuthApi} from "../../handsome-api/auth-api";

const HandsomeJennieFitInspection: NextPage = () => {

    useEffect(() => {
        // if(!localStorage.getItem('handsomeAccessToken')) {
        //     handsomeAuthApi.login().then(res => {
        //         localStorage.setItem('handsomeAccessToken', res.accessToken);
        //         localStorage.setItem('handsomeRefreshToken', res.refreshToken);
        //         console.log('### handsomeAccessToken : ', res.accessToken);
        //         console.log('### handsomeRefreshToken : ', res.refreshToken);
        //     });
        // }
        gtm.push({ event: 'page_view' });
    }, []);

    return (
        <>
            <Head>
                <title>
                    Dashboard: Assignment | Material Kit Pro
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 2,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Typography variant="h4">
                        한섬 Jennie FIT 검수
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <HandsomeFitInspectionProduct />
                </Container>
            </Box>
        </>
    );
};

HandsomeJennieFitInspection.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default HandsomeJennieFitInspection;