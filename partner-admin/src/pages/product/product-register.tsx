import {NextPage} from "next";
import Head from "next/head";
import {
    Box, Button, Card, Container,
    Grid, Typography, Stack, FormControlLabel, Switch
} from "@mui/material";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {useRouter} from "next/router";
import {PropertyListItem} from "../../components/property-list-item";
import ProductRegisterDetail from "../../components/product/product-register-detail";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {defaultProductModel} from "../../types/product-model";


const ProductRegister: NextPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(defaultProductModel);
    const [requestJennieFit, setRequestJennieFit] = useState(false);
    const {t} = useTranslation();


    const requestJennieFitToggle = () => {
        if (product.fitRequestStatus) {
            setProduct({...product, fitRequestStatus: false});
        } else {
            setProduct({...product, fitRequestStatus: true});
        }

    }

    const handlePostProduct = () => {
        router.push(`product/product-total`);
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
                            <Typography variant="h5" sx={{mt: 2, mb: 2}}>
                                {t('pages_product_productRegister_title')}
                            </Typography>
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
                                {t('button_save')}
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
                                        checked={false}
                                        disabled={true}
                                        onChange={() => setProduct({...product, activated: false})}
                                        name="loading"
                                        color="primary"
                                        sx={{mr: 2}}
                                    />
                                }
                                label={product.activated ? `${t('label_displayOn')}` : `${t('label_displayEnd')}`}
                            />
                        </Grid>
                        <Stack direction={'row'} sx={{mb: 2}}>
                            <Grid sx={{display: 'flex', mr: 10}}>
                                <PropertyListItem
                                    label={`${t('label_jennieFit')}`}
                                    sx={{width: 130}}
                                />
                                <Button size="small"
                                        sx={{width: 80, height: 40, mt: 2.5, mr: 2}}
                                        variant={!product.fitRequestStatus ? "contained" : 'outlined'}
                                        onClick={requestJennieFitToggle}
                                >{t('button_unRequest')}</Button>
                                <Button size="small"
                                        sx={{height: 40, mt: 2.5}}
                                        variant={product.fitRequestStatus ? "contained" : 'outlined'}
                                        onClick={requestJennieFitToggle}
                                >{t('button_requestJennieFit')}</Button>
                            </Grid>
                        </Stack>
                    </Card>
                    <Card sx={{pt: 5}}>
                        <ProductRegisterDetail data={product} setData={setProduct}/>
                    </Card>
                </Container>
            </Box>
        </>
    )
}

ProductRegister.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default ProductRegister;