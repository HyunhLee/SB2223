import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Container, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import React, {useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import toast from "react-hot-toast";
import {defaultB2bDefaultItemDetailModel, ProductColors} from "../../../types/b2b-partner-model/b2b-default-item-model";
import DefaultItemDetail from "../../../components/b2b-partner/default-item/default-item-detail";
import {b2bDefaultItemApi} from "../../../b2b-partner-api/b2b-default-item-api";
import {btbAwsApi} from "../../../b2b-partner-api/b2b-aws-api";
import {endPointConfig} from "../../../config";
import {v4 as uuidv4} from 'uuid';

const B2bCorrectionDefaultItem: NextPage = () => {
    const router = useRouter();

    const [itemModel, setItemModel] = useState(defaultB2bDefaultItemDetailModel);
    const [productDetail, setProductDetail] = useState<ProductColors[]>(itemModel ? itemModel.productColors : [])


    //img temp
    const [uploadImages, setUploadImages] = useState([])

    const beforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        //deprecated 된 내용이지만 chrome에서 beforeUnloadEvent를 동작시키기 위해 필요함
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


    useEffect(() => {
        if(router.query){
            const {id} = router.query;
            if (id === undefined) {
                return
            }
            if(id && id !== '0') {
                (async () => {
                    setTimeout(async() => {
                        await getProducts(id);
                    }, 500)
                })()
            }
        }

    }, [router.query])


    const getProducts = useCallback(async (id) => {
        try {
            const result = await b2bDefaultItemApi.getBtbDefaultItemsDetailData(id)
            setItemModel(result);
            setProductDetail(result.productColors)
            setUploadImages(result.productColors)
        } catch (err) {
            console.error(err);
        }
    }, []);


    const handleUploadImage = async (info) => {
        let productDetailInfo = [...productDetail];

        for (let idx = 0; idx < info.length; idx++) {
            const item = info[idx];
            for (let i = 0; i < productDetailInfo.length; i++) {
                if (item.id === i) {
                    if (item.mainImage) {
                        let mainImageUrl;
                        const mainImgFile = uuidv4() + '.png';
                        const typeMain = 'DEFAULT_IMG_MAIN';
                        mainImageUrl = await btbAwsApi.getPreSignedUrl(mainImgFile, typeMain, item?.mainImage[0]);
                        if (mainImageUrl !== 200) {
                            toast.error('메인 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
                        }

                        let img = `${endPointConfig.styleBotBtbImage}main/${mainImgFile}`;
                        productDetailInfo[i].mainImageUrl = img;
                    }

                    if (item.putOnImage) {
                        let putOnImageUrl;
                        const putOnImgFile = uuidv4() + '.png';
                        const typePutOn = 'DEFAULT_IMG_PUT_ON';
                        putOnImageUrl = await btbAwsApi.getPreSignedUrl(putOnImgFile, typePutOn, item?.putOnImage[0]);
                        if (putOnImageUrl !== 200) {
                            toast.error('피팅 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
                        }

                        let img = `${endPointConfig.styleBotBtbImage}put-on/${putOnImgFile}`;
                        productDetailInfo[i].putOnImageUrl = img;
                    }
                }
            }
        }


        const checkReSet = uploadImages.some((v) => v.mainImage !== [] || v.putOnImage !== []);
        if (checkReSet) {
            // 업로드 작업이 완료된 후 productDetailInfo를 반환합니다.
            return productDetailInfo;
        } else {
            return [];
        }

    }


    const checkEmpty = (details) => {
        let result = []
        for(let i=0; i < details.length; i++) {
            if(details[i]['mainImageUrl'] === ''){
                if(
                  details[i]['colorName'] === '' ||
                  details[i]['patternName'] === '' ||
                  details[i]['mainImage'].length === 0
                ) {
                    result.push(true)
                }
            }

            if(details[i]['putOnImageUrl'] === ''){
                if(
                  details[i]['colorName'] === '' ||
                  details[i]['patternName'] === '' ||
                  details[i]['putOnImage'].length === 0
                ) {
                    result.push(true)
                }
            }

        }
        return result
    }


    const handleCorrectionItem = async (): Promise<void> => {
        let productDInfo = [...productDetail];
        let product = itemModel;
        let checkEmptyArr = checkEmpty(productDInfo)

        if (
          product['nameKo'] == '' ||
          product['nameEn'] == '' ||
          product['categoryIds'].length == 0 ||
          product['productStyleKeyWords'].length === 0 ||
          product['seasonTypes'] == '') {
            window.confirm(`입력되지 않은 값이 존재합니다.\n확인 후 모든 값을 입력해주시기 바랍니다.`)
        } else if(checkEmptyArr.includes(true)){
            window.confirm(`입력되지 않은 값이 존재합니다.\n확인 후 모든 값을 입력해주시기 바랍니다.`)
        }else if (window.confirm('수정하시겠습니까?')) {
            try {
                const updatedProductDetail = await handleUploadImage(uploadImages);
                if (updatedProductDetail) {
                    setProductDetail(updatedProductDetail); // 모든 업로드 작업이 완료된 데이터로 업데이트
                    setItemModel({ ...itemModel, productColors: updatedProductDetail })
                    const filteredData = { ...itemModel, productColors: productDInfo }
                    const res = await b2bDefaultItemApi.putBtbDefaultItems(filteredData);
                    toast.success('수정에 성공했습니다.');
                    router.push('/b2b-partner/default-item/b2b-default-item?storeSearch=true');
                }
            } catch (err) {
                console.log(err)
                toast.error('수정에 실패했습니다.');
            }
        }
    }

    const handleBack = (e) =>{
        e.preventDefault();
        router.push('/b2b-partner/default-item/b2b-default-item?storeSearch=true');
    }

    return (
        <>
            <Head>
                Correction Default Item | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box>
                        <Grid
                            container
                            justifyContent="space-between"
                            sx={{mb: 2}}
                        >
                            <Grid item
                                  sx={{display: 'flex', justifyContent: "flex-start"}}>
                                <ArrowBackIcon
                                    fontSize="medium"
                                    sx={{mr: 2, mt:1, cursor: 'pointer'}}
                                    onClick={handleBack}
                                />
                                <Typography variant="h4">
                                    디폴트 상품 상세 정보
                                </Typography>
                            </Grid>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                size="small"
                                onClick={handleCorrectionItem}
                            >
                                수정
                            </Button>
                        </Grid>
                    </Box>
                    <DefaultItemDetail
                        itemModel={itemModel}
                        setItemModel={setItemModel}
                        productDetail={productDetail}
                        setProductDetail={setProductDetail}
                        uploadImages = {uploadImages}
                        setUploadImages = {setUploadImages}
                    />
                </Container>
            </Box>
        </>
    )
};

B2bCorrectionDefaultItem.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default B2bCorrectionDefaultItem;