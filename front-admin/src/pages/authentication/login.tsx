import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import {Box, Card, Container, Typography} from '@mui/material';
import {GuestGuard} from '../../components/authentication/guest-guard';
import {JWTLogin} from '../../components/authentication/jwt-login';
import {Logo} from '../../components/logo';
import {useAuth} from '../../hooks/use-auth';
import {gtm} from '../../lib/gtm';

const platformIcons = {
    Amplify: '/static/icons/amplify.svg',
    Auth0: '/static/icons/auth0.svg',
    Firebase: '/static/icons/firebase.svg',
    JWT: '/static/icons/jwt.svg'
};

const Login: NextPage = () => {
    const router = useRouter();
    const { platform } = useAuth() as any;
    const { disableGuard } = router.query;

    useEffect(() => {
        gtm.push({ event: 'page_view' });
    }, []);

    return (
        <>
            <Head>
                <title>
                    Login | StyleBot
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh'
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
                            <NextLink
                                href="/"
                                passHref
                            >
                                <a>
                                    <Logo
                                        sx={{
                                            height: 40,
                                            width: 40
                                        }}
                                    />
                                </a>
                            </NextLink>
                            <Typography variant="h4">
                                StyleBot Internal Platform
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                flexGrow: 1,
                                mt: 3
                            }}
                        >
                            {platform === 'JWT' && <JWTLogin />}
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

Login.getLayout = (page) => (
    <GuestGuard>
        {page}
    </GuestGuard>
);

export default Login;
