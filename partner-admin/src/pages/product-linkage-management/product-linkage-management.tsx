import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import Head from "next/head";
import React, {useContext, useEffect, useState} from "react";
import {Box, Button, Card, Container, Divider, Grid, Stack, Theme, Typography, useMediaQuery} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Star} from "../../icons/star";
import {ProductLinkDialog} from "../../components/dialog/product-link-dialog";
import {cafeClientIdConfig} from "../../config";
import {DataContext} from "../../contexts/data-context";
import ColorLinkDialog from "../../components/dialog/color-link-dialog";

const ProductLinkageManagement = () => {
    const token = localStorage.getItem('cafe24AccessToken');
    const dataContext = useContext(DataContext);
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const [openColorSetting, setOpenColorSetting] = useState(false);
    const [hasToken, setHasToken] = useState(false);
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const align = mdUp ? 'row' : 'column';


    useEffect(() => {
        console.log(token, 'cafe24token')
        // @ts-ignore
        if (!(token === 'undefined' || token === "" || token === null)) {
            setHasToken(true)
        } else {
            setHasToken(false)
        }
        data.mall_id = dataContext.MALL_NAME;
    }, [])


    const data = {
        client_id: cafeClientIdConfig.clientId,
        state: cafeClientIdConfig.state,
        redirect_uri: cafeClientIdConfig.redirectUri,
        scope: cafeClientIdConfig.scope,
        mall_id: dataContext.MALL_NAME
    }

    const handleClick = () => {
                    if(window.confirm(`컬러 연동 설정을 진행하셨나요? 컬러 연동 설정이 되어있지 않으면 피팅룸에 연동되지 않습니다.`)){
                        if (window.confirm(`${t('pages_productLinkageManagement_productLinkageManagement_appLink_confirm')}`)) {
                            setOpen(!open);
                        }
                    }
    }

    const handleOpenColorSettingClick = () => {
        if (window.confirm(`${t('pages_productLinkageManagement_productLinkageManagement_colorSetting_confirm')}`)) {
                setOpenColorSetting(!openColorSetting);
        }
    }


    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseColorSetting = () =>{
        setOpenColorSetting(false)
    }

    const handleDownload = () => {
        if (window.confirm(`${t('pages_productLinkageManagement_productLinkageManagement_appInstall_confirm')}`)) {
            let url = `https://${data.mall_id}.cafe24api.com/api/v2/oauth/authorize?response_type=code&client_id=${data.client_id}&state=${data.state}&redirect_uri=${data.redirect_uri}&scope=${data.scope}`;
            window.location.href = url;
        }


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
                        >
                            <Grid item>
                                <Typography variant="h3">
                                    {t("pages_productLinkageManagement_productLinkageManagement_typography_header")}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Card>
                        <Stack sx={{display: 'flex', justifyContent: 'space-between'}} direction='row'>
                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Star sx={{height: 100, width: 100, border: 3, borderRadius: 3, m: 3}}/>
                                <Stack direction='column'>
                                    <Typography variant="h5">
                                        {t("pages_productLinkageManagement_productLinkageManagement_h2_name")}
                                    </Typography>
                                    {hasToken ?
                                        <Typography variant="h6">
                                            {t("pages_productLinkageManagement_productLinkageManagement_h2_installed")}
                                        </Typography>
                                        :
                                        <Typography variant="h6">
                                            {t("pages_productLinkageManagement_productLinkageManagement_h2_uninstall")}
                                        </Typography>
                                    }
                                </Stack>
                            </Box>
                            {hasToken ?
                                <Box sx={{width: 50}}></Box>
                                :
                                <Box sx={{display: 'flex', alignItems: 'center', mr: 4}}>
                                    <Button onClick={handleDownload} sx={{height: 50}} variant='contained'>
                                        {t("button_install")}
                                    </Button>
                                </Box>
                            }
                        </Stack>
                    </Card>
                    <Divider/>
                    <Card>
                        <Stack sx={{display: 'flex', justifyContent: 'space-around', mb: 3}} direction={align}>
                            <Box sx={{width : '100%',}}>
                                <Typography sx={{ml: 3, mt: 3}} variant='h6'>
                                    {t("pages_productLinkageManagement_productLinkageManagement_h6_name")}
                                </Typography>
                                <Typography sx={{ml: 3, mt: 2, mr:2}} variant='body1'>
                                    {t("pages_productLinkageManagement_productLinkageManagement_body1_name")}
                                </Typography>
                            </Box>
                            {hasToken ?
                              <>
                                  <Stack sx={{
                                      width: align == 'column' ? '100%' : '20%',
                                      display: 'flex',
                                      flexFlow: 'row nowrap',
                                      justifyContent: 'flex-end',
                                      padding: 2
                                  }}>
                                <Stack direction={"column"} sx={{mt: 2, width : align == 'column' ? '150px' : '150px',}}>
                                    <Button
                                        sx={{height: 50, mb: 2}}
                                        variant='contained'
                                        onClick={handleClick}
                                    >
                                        {t("button_product_setting")}
                                    </Button>
                                  <Button
                                    sx={{height: 50}}
                                    variant='contained'
                                    onClick={handleOpenColorSettingClick}
                                  >
                                      {t("button_color_setting")}
                                  </Button>
                                </Stack>
                                  </Stack>
                              </>
                                :
                                <></>
                            }
                        </Stack>
                    </Card>
                </Container>
            </Box>
            <ProductLinkDialog
                onClose={handleClose}
                open={open}
            />
            <ColorLinkDialog
            open={openColorSetting}
            onClose={handleCloseColorSetting}
            />
        </>

    )
}

ProductLinkageManagement.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default ProductLinkageManagement;