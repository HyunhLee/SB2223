import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Card, Container, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import {useRouter} from "next/router";
import BrandRegisterDetail from "../../components/brand/brand-register-detail";
import {NextPage} from "next";


const BrandRegister: NextPage = () => {
    const router = useRouter();

    const handleBack = (e) => {
        e.preventDefault();
        router.push(`/brand-management/brand-total`);
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
                    <Box sx={{mb: 0}}>
                        <Box sx={{mb: 2}}>
                            <a onClick={handleBack}
                               style={{cursor: 'pointer'}}>
                                <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                                    <ArrowBackIcon
                                        fontSize="small"
                                        sx={{mr: 2, mt: 1}}
                                    />
                                    <Typography variant="h4">
                                        브랜드 등록
                                    </Typography>
                                </Grid>
                            </a>
                        </Box>
                    </Box>
                    <Card sx={{pt: 5, pl: 5}}>
                        <BrandRegisterDetail/>
                    </Card>
                </Container>
            </Box>
        </>
    )
}


BrandRegister.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default BrandRegister;