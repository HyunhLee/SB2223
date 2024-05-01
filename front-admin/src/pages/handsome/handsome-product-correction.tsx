import {NextPage} from "next";
import Head from "next/head";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {Box, Card, Container, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, {useCallback, useEffect} from "react";
import {useRouter} from "next/router";
import {productApi} from "../../handsome-api/product-api";
import HandsomeProductCorrectionDetail
    from "../../components/handsome-components/handsome-product-correction-detail";
import {HandsomeProductDetailModel} from "../../types/handsome-model/handsome-product-model";

const HandsomeProductCorrection: NextPage = () => {
    const router = useRouter();
    const [productModel, setProductModel] = React.useState<HandsomeProductDetailModel>({
            id: null,
            number: "",
            name: "",
            categoryIds: [],
            categoryTypes: [],
            brand: "",
            priceNormal: null,
            priceDiscount: null,
            detailSiteUrl: "",
            thumbnailImageUrl: "",
            grade: null,
            jennieFitThumbnailImageUrl: "",
        }
    );

    const {id} = router.query

  const beforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
    console.log('##############refresh#############')

  };
    

  //새로고침시 경고 팝업창
  useEffect(() => {
    try {
      window.addEventListener('beforeunload', beforeUnload);
      return () => {
        window.removeEventListener('beforeunload', beforeUnload);
      };
    } catch (error) {
      console.log(error);
    }
  }, []);

    const handleBack = (e) => {
        e.preventDefault();
        router.push(`/handsome/handsome-product-total?storeSearch=true`);
    }

    //product data
    const getProducts = useCallback(async (id) => {
        try {
            const result = await productApi.getProduct(id);
            setProductModel(result);
            console.log(result)
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
      if(router.query){
        if (id && id !== '0') {
          (async () => {
            await getProducts(id);
          })()
        }
      }

    }, [router.query]);


    return (
        <>
            <Head>
                Style | Handsome
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4
                }}
            >
                <Container maxWidth="xl">
                    <Box>
                        <Box sx={{mb: 2}}>
                            <a onClick={handleBack}
                               style={{cursor: 'pointer'}}>
                                <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                                    <ArrowBackIcon
                                        fontSize="small"
                                        sx={{mr: 1}}
                                    />
                                    <Typography variant="subtitle2">
                                        전체 상품 리스트
                                    </Typography>
                                </Grid>
                            </a>
                        </Box>
                        <Box sx={{mb: 4}}>
                            <Grid
                                container
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Grid item>
                                    <Typography variant="h4">
                                        상품 등록 상세
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Card>
                        <HandsomeProductCorrectionDetail
                            data={productModel}
                        />
                    </Card>
                </Container>
            </Box>

        </>
    )
}

HandsomeProductCorrection.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
)

export default HandsomeProductCorrection;