import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Stack, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {defaultFaqModel, FaqDetailModel} from "../../../types/faq-model";
import {faqApi} from "../../../api/faq-api";
import {useTranslation} from "react-i18next";
import CreateFaqDetail from "../../../components/general/faq/create-faq-detail";

const CorrectionFaq: NextPage = () => {
    const router = useRouter();

    const {t} = useTranslation();
    const [faqModel, setFaqModel] = useState<FaqDetailModel>(defaultFaqModel);


    const beforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        //deprecated 된 내용이지만 chrome에서 beforeUnloadEvent를 동작시키기 위해 필요함
        e.returnValue = '';
        console.log('##############refresh#############')

    };

    //새로고침시 경고 팝업창
    useEffect(() => {
        try {
            window.addEventListener('beforeunload', beforeUnload);
            return () => {
                window.removeEventListener('beforeunload', beforeUnload);
            };
        } catch (error) {
            console.log(error);
        }
    }, []);


    useEffect(() => {
        if(router.query){
            const {id} = router.query;
            if (id && id !== '0') {
                getFaqDetail(id);
            }
        }

    }, [router.query])

    const getFaqDetail = async (faqId) => {
        await faqApi.getFaq(faqId).then((res) => {
            setFaqModel(res);
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleBack = (e) => {
        e.preventDefault();
        router.push('/general/faq/faq-list?storeSearch=true');
    }

    return (
        <>
            <Head>
                Correction FAQ | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box>
                        <Grid
                            container
                            justifyContent="start"
                            sx={{mb: 2}}
                        >
                            <Grid item
                                  sx={{display: 'flex', justifyContent: "flex-start"}}>
                                <ArrowBackIcon
                                    fontSize="medium"
                                    sx={{mr: 2, mt: 1, cursor: 'pointer'}}
                                    onClick={handleBack}
                                />
                                <Typography variant="h4">
                                    {t("pages_general_correctionFaq_typography_title")}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Card sx={{pt: 5, pb: 5}}>
                        <CreateFaqDetail
                            faqModel={faqModel}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

CorrectionFaq.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default CorrectionFaq;