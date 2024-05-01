import type {ChangeEvent} from 'react';
import React, {useEffect, useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {Box, Container, Divider, Tab, Tabs, Typography} from '@mui/material';
import {AuthGuard} from '../../components/authentication/auth-guard';
import {DashboardLayout} from '../../components/dashboard/dashboard-layout';
import {gtm} from '../../lib/gtm';
import {CustomFaceList} from "../../components/avatar-custom-components/custom-face-list";
import {CustomHairList} from "../../components/avatar-custom-components/custom-hair-list";

const tabs = [
    { label: 'FACE', value: 'face' },
    { label: 'HAIR', value: 'hair' }
];

const AvatarCustom: NextPage = () => {
    const [currentTab, setCurrentTab] = useState<string>('face');

    useEffect(() => {
        gtm.push({ event: 'page_view' });
    }, []);

    const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
        setCurrentTab(value);
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
                        아바타 커스텀
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
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
                                <Tab
                                    key={tab.value}
                                    label={tab.label}
                                    value={tab.value}
                                />
                            )}
                        </Tabs>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    {currentTab === 'face' && <CustomFaceList />}
                    {currentTab === 'hair' && <CustomHairList />}
                </Container>
            </Box>
        </>
    );
};

AvatarCustom.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default AvatarCustom;