import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {NextPage} from "next";
import Head from "next/head";
import React from "react";
import {
    Box, Grid, Typography, Container, Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useRouter} from "next/router";
import {defaultEventModel } from "../../types/event"
import EventDetailCorrection from "../../components/event/event-detail-correction";


const EventPopupRegistration : NextPage =() => {
    const router = useRouter();

    const handleBack = (e) => {
        e.preventDefault();
        router.back();
    }

    return (
        <>
            <Head>
                Style | StyleBot
            </Head>
            <Stack
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box>
                        <a onClick={handleBack} style={{cursor: 'pointer'}}>
                            <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                                <ArrowBackIcon
                                    fontSize="medium"
                                    sx={{mr: 2}}
                                />
                                <Typography variant="h6">
                                    팝업 광고 등록
                                </Typography>
                            </Grid>
                        </a>
                    </Box>
                    <EventDetailCorrection popupInfo={defaultEventModel()} />
                </Container>
            </Stack>
        </>
    )
}

EventPopupRegistration.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default EventPopupRegistration;