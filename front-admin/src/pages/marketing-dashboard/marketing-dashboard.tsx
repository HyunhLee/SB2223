import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {NextPage} from "next";
import React, {ChangeEvent, useEffect, useState} from "react";
import Head from "next/head";
import {Box, Container, Divider, Tab, Tabs, Typography} from "@mui/material";
import MarketingDashboardCompany from "./marketing-dashboard-company";
import MarketingDashboardClick from "./marketing-dashboard-click";
import MarketingDashboardDetail from "./marketing-dashboard-detail";
import MarketingDashboardCart from "./marketing-dashboard-cart";
import MarketingDashboardUser from "./marketing-dashboard-user";
import MarketingDashboardStyle from "./marketing-dashboard-style";
// import MarketingDashboardSale from "./marketing-dashboard-sale";

const tabs = [
    { label: '[전체]상품 클릭 수', value: 'click' },
    { label: '[전체]MY 스타일 저장 수', value: 'style' },
    { label: '[전체]상품 상세 페이지 조회 수', value: 'detail' },
    { label: '[전체]피팅룸 기여 장바구니 총액', value: 'cart' },
    // { label: '[전체]피팅룸 기여 매출(장바구니 구매전환 총액)', value: 'sale' },
    { label: '[전체]회원 가입 수', value: 'user' },
    { label: '회사별', value: 'company' }
];

const MarketingDashboard: NextPage = () => {
    const [currentTab, setCurrentTab] = useState<string>('click');
    const [label, setLabel] = useState<string>('');
    const [name, setName] = useState<number>(null);
    const [start, setStart] = useState<string>('');
    const [end, setEnd] = useState<string>('');

    useEffect(() => {
        if(label !== '') {
            setCurrentTab('company');
            setLabel('');
        } else {
            setName(null);
            setStart('');
            setEnd('');
        }
    }, [label])

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
                        마케팅 대시보드
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
                    {currentTab === 'click' && <MarketingDashboardClick setLabel={setLabel}
                                                                        setName={setName}
                                                                        setStart={setStart}
                                                                        setEnd={setEnd} />}
                    {currentTab === 'style' && <MarketingDashboardStyle setLabel={setLabel}
                                                                        setName={setName}
                                                                        setStart={setStart}
                                                                        setEnd={setEnd} />}
                    {currentTab === 'detail' && <MarketingDashboardDetail setLabel={setLabel}
                                                                          setName={setName}
                                                                          setStart={setStart}
                                                                          setEnd={setEnd} />}
                    {currentTab === 'cart' && <MarketingDashboardCart setLabel={setLabel}
                                                                      setName={setName}
                                                                      setStart={setStart}
                                                                      setEnd={setEnd} />}
                    {/*{currentTab === 'sale' && <MarketingDashboardSale setLabel={setLabel}*/}
                    {/*                                                  setName={setName}*/}
                    {/*                                                  setStart={setStart}*/}
                    {/*                                                  setEnd={setEnd} />}*/}
                    {currentTab === 'user' && <MarketingDashboardUser setLabel={setLabel}
                                                                      setName={setName}
                                                                      setStart={setStart}
                                                                      setEnd={setEnd} />}
                    {currentTab === 'company' && <MarketingDashboardCompany name={name}
start={start}
end={end} />}
                </Container>
            </Box>
        </>
    )
};

MarketingDashboard.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default MarketingDashboard;