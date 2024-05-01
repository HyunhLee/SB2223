import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Box, Card, Container, Typography } from '@mui/material';
import { GuestGuard } from '../../components/authentication/guest-guard';
import { useAuth } from '../../hooks/use-auth';
import { gtm } from '../../lib/gtm';
import {JWTTemporaryPassword} from "../../components/authentication/jwt-temporary-password";
import {useTranslation} from "react-i18next";

const platformIcons = {
    Amplify: '/static/icons/amplify.svg',
    Auth0: '/static/icons/auth0.svg',
    Firebase: '/static/icons/firebase.svg',
    JWT: '/static/icons/jwt.svg'
};

const TemporaryPassword: NextPage = () => {
    const {platform} = useAuth() as any;
    const {t} = useTranslation();

    useEffect(() => {
        gtm.push({ event: 'page_view' });
    }, []);

    return (
        <>
            <Head>
                <title>
                    TemporaryPassword | StyleBot
                </title>
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
                <Container
                    maxWidth="sm"
                    sx={{
                        py: {
                            xs: '60px',
                            md: '120px'
                        }
                    }}
                >
                    <Card
                        elevation={16}
                        sx={{ p: 4 }}
                    >
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <Typography variant="h4">
                                {t("pages_authentication_login_typography_header")}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                flexGrow: 1,
                                mt: 3
                            }}
                        >
                            {platform === 'JWT' && <JWTTemporaryPassword />}
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

TemporaryPassword.getLayout = (page) => (
    <GuestGuard>
        {page}
    </GuestGuard>
);

export default TemporaryPassword;