import {
    Tab, Tabs, Box, Container, Divider, Typography,
} from '@mui/material';
import {NextPage} from "next";
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import Head from 'next/head';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {AccountDetails} from "../../components/my-page/account-detail";
import {mypageApi} from "../../api/mypage-api";
import {AccountDetail, BrandBusinessDetail, PlanDetailModel} from "../../types/account-model";
import {DataContext} from "../../contexts/data-context";
import BrandDetail from 'src/components/btb-my-page/brand-detail';
import {PlanDetail} from "../../components/btb-my-page/plan-detail";

interface brandList {
    id: number,
    brandNameKo: string,
    brandNameEn: string,
    brandShopUrl: string,
    registrationDate: string,
}

const defaultBrandList = [
    {
        id: 1,
        brandNameKo: '구찌',
        brandNameEn: 'GUCCI',
        brandShopUrl: 'https://www.naver.com',
        registrationDate: '2022-08-22'
    },
    {
        id: 2,
        brandNameKo: '프라다',
        brandNameEn: 'PRADA',
        brandShopUrl: 'https://www.naver.com',
        registrationDate: '2022-08-10'
    },
    {
        id: 3,
        brandNameKo: '토즈',
        brandNameEn: 'TODS',
        brandShopUrl: 'https://www.naver.com',
        registrationDate: '2022-08-03'
    },
];

const MyPage: NextPage = () => {
    const tabs = [{label: '계정정보', value: 'ACCOUNT_INFO'}, {label: '요금제 정보', value: 'PLAN_INFO'},]

    const [currentTab, setCurrentTab] = useState<string>('ACCOUNT_INFO');
    const [brandData, setBrandData] = useState(defaultBrandList);
    const [accountData, setAccountData] = useState<AccountDetail>();
    const [brandPlanData, setBrandPlanData] = useState<PlanDetailModel>();
    const mallId = localStorage.getItem('mallId')

    const handleTabsChange = (event, value): void => {
        event.preventDefault();
        setCurrentTab(value);
    };

    const getAccountInfo = async () => {
        const result = await mypageApi.getAccountInfo(mallId);
        setAccountData(result)
    }

    const getPlanInfo = async () => {
       const response = await mypageApi.getB2bPlanInfo(mallId);
        setBrandPlanData(response)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // @ts-ignore
    useEffect(async () => {
        await getAccountInfo();
        await getPlanInfo();
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
                      {tabs.map((tab) => (
                        <Tab
                          key={tab.value}
                          label={tab.label}
                          value={tab.value}
                        />
                      ))}
                  </Tabs>
                  <Divider/>
                  <Box sx={{mt: 3}}>
                      {currentTab === 'ACCOUNT_INFO' && <AccountDetails data={accountData}/>}
                      {currentTab === 'PLAN_INFO' && <PlanDetail data={brandPlanData}/>}
                      {/*{currentTab === 'BRAND_INFO' && <BrandDetail data={brandData}/>}*/}
                  </Box>
              </Container>
          </Box>
      </>
    );
}

MyPage.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default MyPage;

