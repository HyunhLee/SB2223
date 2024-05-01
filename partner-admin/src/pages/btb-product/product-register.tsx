import {NextPage} from "next";
import React, {useContext, useState} from "react";
import {useTranslation} from "react-i18next";
import Head from "next/head";
import {Box, Button, Card, Container, FormControlLabel, Grid, Stack, Switch, Typography} from "@mui/material";
import {PropertyListItem} from "../../components/property-list-item";
import ProductRegisterDetail from "../../components/btb-product/product-register-detail";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {b2bProductApi} from "../../api/btb-product-api";
import {DataContext} from "../../contexts/data-context";
import {defaultProductColorModel, ProductColorModel} from "../../types/btb-product-color-model";
import {toast} from "react-hot-toast";
import SaveIcon from "@mui/icons-material/Save";


const ProductRegisterBtb: NextPage = () => {
    const dataContext = useContext(DataContext);
    const [product, setProduct] = useState<ProductColorModel>(defaultProductColorModel());
    const {t} = useTranslation();
    const state = 'reg';

    const handlePostProduct = async () => {
        if (product.productColors.length < 2 && !product.productColors[0].colorName) {
            toast.error(`${t('components_btbProduct_productRegister_productSave_color_error')}`);
            return;
        }
        if (product.productColors.length < 2 && !product.productColors[0].patternName) {
            toast.error(`${t('components_btbProduct_productRegister_productSave_pattern_error')}`);
            return;
        }
        for (let i = 0; i < product.productColors.length; i++) {
            if (!product.productColors[i].colorName) {
                toast.error(`${t("components_btbProduct_productRegister_productSave_color_null", {number: i + 1})}`);
                return;
            }
            if (!product.productColors[i].patternName) {
                toast.error(`${t("components_btbProduct_productRegister_productSave_pattern_null", {number: i + 1})}`);
                return;
            }
        }
        let confirm = window.confirm('저장하시겠습니까?');
        if (confirm) {
            product.priceNormal = Number(String(product.priceNormal).replace(",", ""));
            product.priceDiscount = Number(String(product.priceDiscount).replace(",", ""));
            console.log(product, '############### product ')

            await b2bProductApi.postProduct(product).then((res) => {
                if (res.status == 201) {
                    toast.success(`${t('components_btbProduct_productRegister_productSave_success')}`)
                    setProduct(defaultProductColorModel())
                }
            })
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
                                startIcon={<SaveIcon fontSize="small"/>}
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
                                        disabled={false}
                                        name="display"
                                        color="primary"
                                        sx={{mr: 2}}
                                    />
                                }
                                label={`${t('label_displayEnd')}`}
                            />
                        </Grid>
                        <Stack direction={'row'} sx={{mb: 2}}>
                            <Grid sx={{display: 'flex', mr: 10, width: 340}}>
                                <PropertyListItem
                                  label={`${t('label_jennieFit')}`}
                                  sx={{width: 130}}
                                />
                                <Typography
                                  sx={{mt: 3}}>제니FIT</Typography>
                            </Grid>
                            <Stack direction={'row'}>
                                <PropertyListItem
                                  label={`${t('label_status')}`}
                                  sx={{width: 130}}
                                />
                                <Typography
                                  sx={{mt: 3}}>{dataContext.REQUEST_STATUS['InputWait']}</Typography>
                            </Stack>
                        </Stack>
                    </Card>
                    <Card sx={{pt: 5}}>
                        <ProductRegisterDetail data={product} setData={setProduct} state={state} complete={false}
                                               correct={false}/>
                    </Card>
                </Container>
            </Box>
        </>
    )
}

ProductRegisterBtb.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default ProductRegisterBtb;