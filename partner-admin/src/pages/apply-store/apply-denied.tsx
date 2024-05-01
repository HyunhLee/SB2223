import {NextPage} from "next";
import {GuestGuard} from "../../components/authentication/guest-guard";
import React, {useEffect, useState} from "react";
import Head from "next/head";
import {
    Box,
    Button, Card,
    Container,
    TextField
} from "@mui/material";
import Header from "../../components/layout/header";
import Footer from "../../components/layout/footer";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";
import {applyStoreApi} from "../../api/apply-store-api";

const isLogIn = true;

const ApplyDenied: NextPage = () => {
    const {t} = useTranslation();
    const [reason, setReason] = useState<string>("")

    useEffect(() => {
        // Api 호출 후 거절사유 받아오고 setReason(res.data)
        getReason();
    }, [])

    const userId = 'owen';
    const getReason = async () => {
        await applyStoreApi.getDeniedReason(userId
        ).then(res => {
            setReason(res);
        }).catch(err => {
            console.log(err);
        })
    }

    const router = useRouter();
    const handleApply = () => {
        router.push("/apply-store/apply-store");
    }

    return (
        <>
            <Head>
                ApplyDenied | Style Bot
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
                            {t("pages_applyStore_applyDenied_textField_header")}
                        </Box>
                        <TextField
                            id="standard-multiline-static"
                            fullWidth
                            label={t("pages_applyStore_applyDenied_textField_label")}
                            defaultValue={`${reason}`}
                            multiline
                            rows={6}
                            disabled={true}
                        />
                        <Box sx={{mt: 2}}>
                            <Button
                                component="a"
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                onClick={handleApply}
                            >
                                {t("pages_applyStore_applyDenied_button_reapply")}
                            </Button>
                        </Box>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

ApplyDenied.getLayout = (page) => (
    <GuestGuard>
        <Header isLogIn={isLogIn}/>
        {page}
        <Footer />
    </GuestGuard>
);

export default ApplyDenied;