import {NextPage} from "next";
import {GuestGuard} from "../../components/authentication/guest-guard";
import Head from "next/head";
import {Box, Button, Card, Container, Divider, Grid, Tab, Tabs, Typography} from "@mui/material";
import React, {useState} from "react";
import {InputInformation} from "../../components/apply-store/input-information";
import {InputCompanyInformation} from "../../components/apply-store/input-company-information";
import {InputMallBrand} from "../../components/apply-store/input-mall-brand";
import {AgreePolicy} from "../../components/apply-store/agree-policy";
import {useRouter} from "next/router";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import {defaultApply, ApplyStoreModels} from "../../types/apply-store-model";
import toast from "react-hot-toast";
import {applyStoreApi} from "../../api/apply-store-api";
import {useTranslation} from "react-i18next";

const ApplyStore: NextPage = () => {
    const {t} = useTranslation();

    const tabs = [
        {label: `${t("pages_applyStore_applyStore_tabs_labelInfo")}`, value: 'info'},
        {label: `${t("pages_applyStore_applyStore_tabs_labelCompanyInfo")}`, value: 'companyInfo'},
        {label: `${t("pages_applyStore_applyStore_tabs_labelMallBrand")}`, value: 'mallBrand'},
        {label: `${t("pages_applyStore_applyStore_tabs_labelPolicyCheck")}`, value: 'policyCheck'}
    ];

    const [applyStoreModel, setApplyStoreModel] = useState<ApplyStoreModels>(defaultApply);
    const [currentTab, setCurrentTab] = useState<string>('info');

    const checkBoolean = () => {
        if (applyStoreModel.agreePolicy && applyStoreModel.agreeTerm && applyStoreModel.agreeTenor) {
            return true;
        }
        return false;
    }

    const handlePrevious = () => {
        if(currentTab == 'policyCheck') {
            setCurrentTab('mallBrand')
        }
        if(currentTab == 'mallBrand') {
            setCurrentTab('companyInfo')
        }
        if(currentTab == 'companyInfo') {
            setCurrentTab('info')
        }
    };

    const handleNext = () => {
        if(currentTab == 'info') {
            if (applyStoreModel.userId
                && applyStoreModel.password
                && applyStoreModel.passwordCheck
                && applyStoreModel.managerName
                && applyStoreModel.managerPhoneNumber
                && applyStoreModel.certificationNumber) {
                setCurrentTab('companyInfo')
            } else {
                setCurrentTab('companyInfo')
                toast.error(`${t("pages_applyStore_applyStore_button_errorMessage")}`)
            }
        }
        if(currentTab == 'companyInfo') {
            if (applyStoreModel.companyRegistrationNumber
                && applyStoreModel.companyName
                && applyStoreModel.representativeName
                && applyStoreModel.business[0].businessStatus
                && applyStoreModel.business[0].businessEvent
                && applyStoreModel.companyAddress
                && applyStoreModel.companyDetailAddress
                && applyStoreModel.businessRegistration.length > 0
                && applyStoreModel.mailOrderBusinessCertificate.length > 0
                && applyStoreModel.companyUrl) {
                setCurrentTab('mallBrand')
            } else {
                setCurrentTab('mallBrand')
                toast.error(`${t("pages_applyStore_applyStore_button_errorMessage")}`)
            }
        }
        if(currentTab == 'mallBrand') {
            if (applyStoreModel.brand[0].brandNameKo
                && applyStoreModel.brand[0].brandNameEn
                && applyStoreModel.brand[0].brandShopUrl
                && applyStoreModel.brand[0].brandIntroduce
                && applyStoreModel.brand[0].brandIntroduction.length > 0) {
                setCurrentTab('policyCheck')
            } else {
                setCurrentTab('policyCheck')
                toast.error(`${t("pages_applyStore_applyStore_button_errorMessage")}`)
            }
        }
    };

    const router = useRouter();
    const handlePost = async () => {
        // Api 호출 후 초기화면 이동
        await applyStoreApi.postStoreInfo(applyStoreModel
        ).then(res => {
            console.log(res);
            router.push("/apply-store/apply-success");
        }).catch(err => {
            console.log(err);
        })
    }

    const handleBack = () => {
        router.push("/authentication/login");
    }

    return (
        <>
            <Head>
                Style | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{mb: 4}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    {t("pages_applyStore_applyStore_typography_header")}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                sx={{m: -1}}>
                                <Tabs
                                    indicatorColor="primary"
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
                                            disabled={true}
                                        />
                                    )}
                                </Tabs>
                                <Divider sx={{ mb: 3 }} />
                            </Grid>
                        </Grid>
                    </Box>
                    <Card sx={{display: 'flex', justifyContent: 'center'}}>
                        {currentTab === 'info' &&
                            <InputInformation
                                applyStoreModel={applyStoreModel}
                                setApplyStoreModel={setApplyStoreModel}
                            />}
                        {currentTab === 'companyInfo' &&
                            <InputCompanyInformation
                                applyStoreModel={applyStoreModel}
                                setApplyStoreModel={setApplyStoreModel}
                            />}
                        {currentTab === 'mallBrand' &&
                            <InputMallBrand
                                applyStoreModel={applyStoreModel}
                                setApplyStoreModel={setApplyStoreModel}
                            />}
                        {currentTab === 'policyCheck' &&
                            <AgreePolicy
                                applyStoreModel={applyStoreModel}
                                setApplyStoreModel={setApplyStoreModel}
                            />}
                    </Card>
                    <Box sx={{textAlign: 'center', mt: 5}}>
                        {currentTab == 'info' ?
                            <Button variant="contained"
                                    onClick={handleBack}>{t("pages_applyStore_applyStore_button_back")}</Button>
                            :
                            <Button onClick={handlePrevious}>{t("pages_applyStore_applyStore_button_back")}</Button>
                        }
                        {currentTab == 'policyCheck' ?
                            <Button variant="contained" onClick={handlePost}
                                    disabled={!checkBoolean()}>{t("pages_applyStore_applyStore_button_apply")}</Button>
                            :
                            <Button onClick={handleNext}>{t("pages_applyStore_applyStore_button_next")}</Button>
                        }
                    </Box>
                </Container>
            </Box>
        </>
    );
};

ApplyStore.getLayout = (page) => (
    <GuestGuard>
        <Header />
        {page}
        <Footer />
    </GuestGuard>
);

export default ApplyStore;