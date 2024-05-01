import {useRouter} from "next/router";
import {useContext, useState} from "react";
import {defaultProductModel} from "../../../types/product-model";
import {useTranslation} from "react-i18next";
import Head from "next/head";
import {Box, Button, Card, Container, FormControlLabel, Grid, Stack, Switch, Typography} from "@mui/material";
import {PropertyListItem} from "../../../components/property-list-item";
import ProductRegisterDetail from "../../../components/product/product-register-detail";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {DataContext} from "../../../contexts/data-context";


const ProductCorrection = () => {
    const router = useRouter();
    const dataContext = useContext(DataContext);
    const [product, setProduct] = useState(defaultProductModel);
    const {t} = useTranslation();

    const handleBack = (e) => {
        e.preventDefault();
        router.push(`/product/product-total?storeSearch=true`);
    }

    const requestJennieFitToggle = () => {
        if (product.fitRequestStatus) {
            setProduct({...product, fitRequestStatus: false});
        } else {
            setProduct({...product, fitRequestStatus: true});
        }

    }

    const displayStatusToggle = () => {
        if (product.activated) {
            setProduct({...product, activated: false});
        } else {
            setProduct({...product, activated: true});
        }

    }

    const handlePostProduct = () => {
        router.push(`/product/product-total`);
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
                    py: 2
                }}
            >
                <Container maxWidth="xl">
                    <Stack
                        justifyContent="space-between"
                        direction={'row'}
                    >
                        <Grid>
                            <a onClick={handleBack}
                               style={{cursor: 'pointer'}}>
                                <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                                    <ArrowBackIcon
                                        fontSize="small"
                                        sx={{mr: 2, mt: 2.5}}
                                    />
                                    <Typography variant="h5" sx={{mt: 2, mb: 2}}>
                                        {t('pages_product_productCorrection_title')}
                                    </Typography>
                                </Grid>
                            </a>
                        </Grid>
                        <Grid
                            item
                            sx={{mb: 2}}>
                            <Button
                                component="a"
                                sx={{m: 1}}
                                variant="contained"
                                onClick={handlePostProduct}
                            >
                                수정
                            </Button>
                        </Grid>
                    </Stack>
                    <Card sx={{p: 2, mb: 2}}>
                        <Grid sx={{display: 'flex', mt: 2}}>
                            <PropertyListItem
                                label={`${t('label_displayStatus')}`}
                                sx={{width: 130}}
                            />
                            <FormControlLabel
                                sx={{display: 'block', mt: 2.3}}
                                control={
                                    <Switch
                                        checked={product.activated}
                                        onChange={displayStatusToggle}
                                        name="loading"
                                        color="primary"
                                        sx={{mr: 2}}
                                    />
                                }
                                label={product.activated ? `${t('label_displayOn')}` : `${t('label_displayEnd')}`}
                            />
                        </Grid>
                        <Stack direction={'row'} sx={{mb: 2}}>
                            <Grid sx={{display: 'flex', mr: 10, width: 340}}>
                                <PropertyListItem
                                    label={`${t('label_jennieFit')}`}
                                    sx={{width: 130}}
                                />
                                <Button size="small"
                                        sx={{height: 40, mt: 2.5, mr: 2}}
                                        variant={!product.fitRequestStatus ? "contained" : 'outlined'}
                                        onClick={requestJennieFitToggle}
                                >{t('button_unRequest')}</Button>
                                <Button size="small"
                                        sx={{height: 40, mt: 2.5}}
                                        variant={product.fitRequestStatus ? "contained" : 'outlined'}
                                        onClick={requestJennieFitToggle}
                                >{t('button_requestJennieFit')}</Button>
                            </Grid>
                            <Stack direction={'row'}>
                                <PropertyListItem
                                    label={'상태'}
                                    sx={{width: 130}}
                                />
                                <Typography
                                    sx={{mt: 3}}>{dataContext.REGISTRATION_STATUS[product.registrationStatus]}</Typography>
                            </Stack>
                        </Stack>
                    </Card>
                    <Card sx={{pt: 5}}>
                        <ProductRegisterDetail data={product} setData={setProduct}/>
                    </Card>
                </Container>
            </Box>
        </>
    )
};

ProductCorrection.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default ProductCorrection;