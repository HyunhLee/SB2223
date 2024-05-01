import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Container, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {
    B2bDefaultItemDetailModel,
    defaultB2bDefaultItemDetailModel,
    ProductColors
} from "../../../types/b2b-partner-model/b2b-default-item-model";
import DefaultItemDetail from "../../../components/b2b-partner/default-item/default-item-detail";
import {btbAwsApi} from "../../../b2b-partner-api/b2b-aws-api";
import toast from "react-hot-toast";
import {v4 as uuidv4} from 'uuid';
import {endPointConfig} from "../../../config";
import {b2bDefaultItemApi} from "../../../b2b-partner-api/b2b-default-item-api";


const B2bAddDefaultItem: NextPage = () => {
    const router = useRouter();
    const [itemModel, setItemModel] = useState<B2bDefaultItemDetailModel>(defaultB2bDefaultItemDetailModel);
    const [productDetail, setProductDetail] = useState<ProductColors[]>(itemModel ? itemModel.productColors : [])

  //img temp
  const [uploadImages, setUploadImages] = useState([])


  useEffect(() => {
        //컬러, 패턴 바로 반영을 위한
        setItemModel({...itemModel, productColors: productDetail})
    },[productDetail])


  const handleUploadImage = async (info) => {
    let productDetailInfo = [...productDetail];

    for (let idx = 0; idx < info.length; idx++) {
      const item = info[idx];
      if (item.mainImage) {
        let mainImageUrl;
        const mainImgFile = uuidv4() + '.png';
        const typeMain = 'DEFAULT_IMG_MAIN';
        mainImageUrl = await btbAwsApi.getPreSignedUrl(mainImgFile, typeMain, item?.mainImage[0]);
        if (mainImageUrl !== 200) {
          toast.error('메인 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
        }

        let img = `${endPointConfig.styleBotBtbImage}main/${mainImgFile}`;
        productDetailInfo[idx].mainImageUrl = img;
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
        productDetailInfo[idx].putOnImageUrl = img;
      }
    }

    const checkReSet = productDetailInfo.some((v) => v.mainImage.length === 0 || v.putOnImage.length === 0);
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
      if (
        details[i]['colorName'] === '' ||
        details[i]['patternName'] === '' ||
        details[i]['mainImage'].length === 0 ||
        details[i]['putOnImage'].length === 0
      ) {
        result.push(true);
      } else {
        result.push(false);
      }
    }
    return result
  }

  const handleAddItem = async (): Promise<void> => {
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
    }else {
      if(window.confirm('등록하시겠습니까?')) {
        try{
          const updateProduct = await handleUploadImage(productDInfo);
          if(updateProduct){
            setProductDetail(updateProduct)
            setItemModel({...itemModel, productColors: updateProduct})
            const filteredData = { ...itemModel, productColors: productDInfo};

            delete filteredData.id;
            const result = await b2bDefaultItemApi.addBtbDefaultItems(filteredData)
            if(result == 201){
              toast.success('등록이 완료되었습니다.')
              router.push('/b2b-partner/default-item/b2b-default-item/')
            }

          }
        }catch(err){
          console.log(err)
        }
      }

    }
  }

    const handleBack = (e) =>{
        e.preventDefault();
        if(window.confirm(`[입력 취소확인]\n 페이지 이동 시 입력한 내용이 저장되지 않습니다.`)){
            router.push('/b2b-partner/default-item/b2b-default-item?storeSearch=true');
        }else{
            return;
        }

    }

    return (
        <>
            <Head>
                Add Default Item | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{mb:4}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            sx={{mb: 2}}
                        >
                            <Grid item
                                  sx={{display: 'flex', justifyContent: "flex-start"}}>
                                <ArrowBackIcon
                                    fontSize="medium"
                                    sx={{mr: 2, mt:0.5, cursor: 'pointer'}}
                                    onClick={handleBack}
                                />
                                <Typography variant="h5">
                                    디폴트 상품 등록
                                </Typography>
                            </Grid>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                size="small"
                                onClick={handleAddItem}
                            >
                                등록
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

B2bAddDefaultItem.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default B2bAddDefaultItem;