import {NextPage} from "next";
import {GuestGuard} from "../../components/authentication/guest-guard";
import React from "react";
import Head from "next/head";
import {
    Box,
    Button, Card,
    Container
} from "@mui/material";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";

const ApplySuccess: NextPage = () => {
    const {t} = useTranslation();

    const router = useRouter();
    const handleMove = () => {
        router.push("/authentication/login");
    }

    return (
        <>
            <Head>
                ApplySuccess | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '86vh'
                }}
            >
                <Container maxWidth="sm"
                           sx={{
                               py: {
                                   xs: '60px',
                                   md: '120px'
                               }
                           }}>
                    <Card elevation={16}
                          sx={{p: 4}}>
                        <Box sx={{textAlign: 'center', fontSize: 30}}>
                            {t("pages_applyStore_applySuccess_textField_header")}
                        </Box>
                        <Box sx={{textAlign: 'center'}}>
                            {t("pages_applyStore_applySuccess_textField_body")}
                        </Box>
                        <Box sx={{mt: 2}}>
                            <Button
                                component="a"
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                onClick={handleMove}
                            >
                                {t("pages_applyStore_applySuccess_button_moveLoginPage")}
                            </Button>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

ApplySuccess.getLayout = (page) => (
    <GuestGuard>
        <Header />
            {page}
        <Footer />
    </GuestGuard>
);

export default ApplySuccess;