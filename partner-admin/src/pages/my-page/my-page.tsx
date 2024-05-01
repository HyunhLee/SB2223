import {
    Tab, Tabs, Box, Container, Divider, Typography,
} from '@mui/material';
import {NextPage} from "next";
import {useContext, useEffect, useState} from 'react';
import Head from 'next/head';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {AccountDetails} from "../../components/my-page/account-detail";
import {BusinessDetails} from "../../components/my-page/business-detail";
import {BrandDetails} from "../../components/my-page/brand-detail";
import {mypageApi} from "../../api/mypage-api";
import {AccountDetail, BrandBusinessDetail, BrandDetail} from "../../types/account-model";
import {DataContext} from "../../contexts/data-context";

const MyPage: NextPage = () => {
    const dataContext = useContext(DataContext);
    const tabs = Object.entries(dataContext.MY_PAGE_TABS)
    const [currentTab, setCurrentTab] = useState<string>(tabs[0][0]);
    const [brandData, setBrandData] = useState<BrandDetail>();
    const [accountData, setAccountData] = useState<AccountDetail>();
    const [businessData, setBusinessData] = useState<BrandBusinessDetail>();


    const handleTabsChange = (event, value): void => {
        event.preventDefault();
        setCurrentTab(value);
    };

    const getBrandInfo = async () => {
        let id = 1;
        const result = await mypageApi.getBrandInfo(id);
        setBrandData(result);
    }

    const getAccountInfo = async () => {
        const id = localStorage.getItem('userId');
        const result = await mypageApi.getAccountInfo(id);
        setAccountData(result)
    }

    const getBusinessInfo = async () => {
        let id = 1;
        const result = await mypageApi.getBusinessInfo(id);
        setBusinessData(result)

    }

    useEffect(() => {
        getAccountInfo();
        // await getBrandInfo();
        // await getBusinessInfo();
    }, [])


    return (
        <>
            <Head>
                <title>
                    STYLEBOT | 파트너 센터
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h4">
                        마이페이지
                    </Typography>
                    <Tabs
                        indicatorColor="primary"
                        onChange={handleTabsChange}
                        scrollButtons="auto"
                        sx={{mt: 3}}
                        textColor="primary"
                        value={currentTab}
                        variant="scrollable"
                    >
                        {/*{tabs.map((tab) => (*/}
                        {/*    <Tab*/}
                        {/*        key={tab[0]}*/}
                        {/*        label={tab[1]}*/}
                        {/*        value={tab[0]}*/}
                        {/*    />*/}
                        {/*))}*/}
                        <Tab
                            key={tabs[0][0]}
                            label={tabs[0][1]}
                            value={tabs[0][0]}
                        />
                    </Tabs>
                    <Divider/>
                    <Box sx={{mt: 3}}>
                        {currentTab === 'ACCOUNT_INFO' && <AccountDetails data={accountData}/>}
                        {currentTab === 'BUSINESS_INFO' && <BusinessDetails data={businessData}/>}
                        {currentTab === 'BRAND_INFO' && <BrandDetails data={brandData} setData={setBrandData}/>}
                    </Box>
                </Container>
            </Box>
        </>
    )
}

MyPage.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default MyPage;

