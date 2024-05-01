import type {ChangeEvent} from 'react';
import {useEffect, useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {Box, Container, Divider, Tab, Tabs, Typography} from '@mui/material';
import {AuthGuard} from '../../components/authentication/auth-guard';
import {DashboardLayout} from '../../components/dashboard/dashboard-layout';
import {JennieFitInspectionUser} from '../../components/inspection/jennie-fit-inspection-user';
import {JennieFitInspectionProduct} from '../../components/inspection/jennie-fit-inspection-product';
import {gtm} from '../../lib/gtm';
import {decode} from "../../utils/jwt";
import {JennieFitInspectionAiUser} from "../../components/inspection/jennie-fit-inspection-ai-user";

const tabs = [
    { label: 'Jennie FIT USER', value: 'user' },
    { label: 'Jennie FIT PRODUCT', value: 'product' },
    { label: 'Jennie FIT USER AI', value: 'user_ai'},
    { label: 'Jennie FIT PRODUCT AI', value: 'product_ai' }
];

const JennieFitInspection: NextPage = () => {
    const [currentTab, setCurrentTab] = useState<string>('user');
    const [aiTab, setAiTab] = useState<boolean>(true);

    useEffect(() => {
        gtm.push({ event: 'page_view' });
        setAiTab(true);
    }, []);

    const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
        event.preventDefault();
        setCurrentTab(value);
    };

    const inspectionTabsDisplay = (value) => {
        if(value === 'user') {
            return (decode(localStorage.getItem("accessToken")).auth.split(",").find(role => role === 'ROLE_ADMIN_USERFIT'|| role === 'ROLE_ADMIN_MASTER'));
        } else if(value === 'product') {
            return (decode(localStorage.getItem("accessToken")).auth.split(",").find(role => role ==='ROLE_ADMIN_PRODUCTFIT'|| role === 'ROLE_ADMIN_MASTER'));
        } else if(value === 'user_ai') {
            return (decode(localStorage.getItem("accessToken")).auth.split(",").find(role => role ==='ROLE_ADMIN_PRODUCTFIT'|| role === 'ROLE_ADMIN_MASTER'));
        } else if(value === 'product_ai') {
            return (decode(localStorage.getItem("accessToken")).auth.split(",").find(role => role ==='ROLE_ADMIN_PRODUCTFIT'|| role === 'ROLE_ADMIN_MASTER'));
        }
    };


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
                        Jennie FIT 검수
                    </Typography>
                    <Tabs
                        indicatorColor="primary"
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        textColor="primary"
                        value={currentTab}
                        variant="scrollable"
                        sx={{ mt: 3 }}
                    >
                        {tabs.map((tab) =>
                            inspectionTabsDisplay(tab.value)?
                            (
                            <Tab
                                key={tab.value}
                                label={tab.label}
                                value={tab.value}
                            />
                            ):''
                        )}
                    </Tabs>
                    <Divider sx={{ mb: 3 }} />
                    {currentTab === 'user' && inspectionTabsDisplay('user') && <JennieFitInspectionUser />}
                    {currentTab === 'product' && inspectionTabsDisplay('product')  && <JennieFitInspectionProduct />}
                    {currentTab === 'user_ai' && inspectionTabsDisplay('user_ai')  && <JennieFitInspectionAiUser />}
                    {currentTab === 'product_ai' && inspectionTabsDisplay('product_ai')  && <JennieFitInspectionProduct aiTab={aiTab}/>}
                </Container>
            </Box>
        </>
    );
};

JennieFitInspection.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default JennieFitInspection;