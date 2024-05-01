import {NextPage} from "next";
import {GuestGuard} from "../../components/authentication/guest-guard";
import Head from "next/head";
import {Box, Card, Container} from "@mui/material";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import {useTranslation} from "react-i18next";

const isLogIn = true;

const ApplyWaiting: NextPage = () => {
    const {t} = useTranslation();

    return (
        <>
            <Head>
                ApplyWaiting | Style Bot
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
                          sx={{ p: 4 }}>
                        <Box sx={{textAlign: 'center', fontSize: 30}}>
                            {t("pages_applyStore_applyWaiting_textField_header")}
                        </Box>
                        <Box sx={{textAlign: 'center'}}>
                            {t("pages_applyStore_applySuccess_textField_body")}
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

ApplyWaiting.getLayout = (page) => (
    <GuestGuard>
        <Header isLogIn={isLogIn}/>
            {page}
        <Footer />
    </GuestGuard>
);

export default ApplyWaiting;