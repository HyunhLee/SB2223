import {NextPage} from "next";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import JennieProductCorrectionDetail from "../../components/jennie-product/jennie-product-correction-detail";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {useRouter} from "next/router";
import {productApi} from "../../api/product-api";
import {ProductModel} from "../../types/product-model";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const JennieProductCorrection: NextPage = () => {

    const router = useRouter();
    const {id} = router.query;
    const [productModel, setProductModel] = React.useState<ProductModel>({
        id: null,
        type: "",
        nameKo: "",
        nameEn: "",
        detailSiteUrl: "",
        price: null,
        mainImageUrl: "",
        mainImage: [],
        putOnImageUrl: "",
        putOnImage: [],
        putOnPreviewImageUrl: "",
        ghostImageUrl: "",
        fitRefImageUrl: "",
        ghostImage: [],
        fitRefImage: [],
        imageUrlList: [],
        imageList: [],
        listImageUrl: "",
        searchWord: "",
        styleKeywords: "",
        styleKeywordsList: [],
        seasonTypes: "",
        colorType: "",
        patternType: "",
        necklineType: "",
        silhouetteType: "",
        sleeveType: "",
        lengthType: "",
        displayStatus: "",
        registrationType: "MANUAL",
        fitRequestStatus: "",
        inspectionStatus: "",
        verified: true,
        activated: true,
        createdBy: "",
        createdDate: "",
        lastModifiedBy: "",
        lastModifiedDate: "",
        brandId: null,
        categoryIds: [],
        jenniefitCategory: "",
        jenniefitCategoryId: null
    });

    const [search, setSearch] = useState('')

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


    const getProducts = useCallback(async (id) => {
        try {
            const result = await productApi.getProduct(id);
            setProductModel(result);
            setSearch(result.searchWord);
        } catch (err) {
            console.error(err);
        }
    }, []);


    useEffect(() => {
        if (id && id !== '0') {
            (async () => {
                await getProducts(id);
            })()
        }
    }, [id]);


    const changeSeasonHandler = (value: string, checked: boolean): void => {
        let season = []
        if (productModel.seasonTypes) {
            season = productModel.seasonTypes.split(',');
        }
        if (checked) {
            season.push(value);
        } else {
            _.remove(season, (data) => {
                return data == value;
            });
        }
        setProductModel(prevData => ({
            ...prevData,
            seasonTypes: season.join(',')
        }))
    }

    const addFileImageHandler = (imageFiles) => {
        imageFiles.forEach((file, index) => {
            file.key = `key${index}`;
        })
        setProductModel({...productModel, imageList: imageFiles})
    };

    const replaceUrl = (url) => {
        return url.replace("https://", "https://s3.ap-northeast-2.amazonaws.com/")
    }

    const convertURLtoFile = async (url: string) => {

        const response = await fetch(replaceUrl(url));
        const data = await response.blob();
        const ext = url.split(".").pop(); // url 구조에 맞게 수정할 것
        const filename = url.split("/").pop(); // url 구조에 맞게 수정할 것
        const metadata = {type: `image/${ext}`};
        return new File([data], filename!, metadata);
    };

    const handlePostProduct = async (id): Promise<void> => {
        productModel.imageUrlList = productModel.imageList;

        if(!productModel.type) {
            toast.error('리테일 정보를 입력해주세요.');
            return;
        } else if (productModel.type == "RETAIL") {
            if (productModel.fitRequestStatus !== 'COMPLETED' && productModel.displayStatus == 'DISPLAY_ON') {
                toast.error('fit 검수를 먼저 진행해 주세요.');
                return;
            }
            if (!productModel.nameKo) {
                toast.error('상품명을 입력해주세요.');
                return;
            }
            if (!productModel.nameEn) {
                toast.error('영문 상품명을 입력해주세요.');
                return;
            }
            if (!productModel.categoryIds) {
                toast.error('카테고리 정보를 입력해주세요.');
                return;
            }
            if(productModel.categoryIds[0] == 5) {
                productModel.jenniefitCategory = 'ACC_ETC_ETC_ETC';
                productModel.jenniefitCategoryId = 2043;
            }
            if (!productModel.brandId) {
                toast.error('브랜드를 입력해주세요.');
                return;
            }
            if (!productModel.price) {
                toast.error('판매가를 입력해주세요.');
                return;
            }
            if (!productModel.detailSiteUrl) {
                toast.error('쇼핑몰 URL을 입력해주세요.');
                return;
            }
            if (productModel.imageUrlList.length === 0 && productModel.imageList.length === 0) {
                toast.error('상품 이미지를 입력해주세요.');
                return;
            }
            if (!productModel.searchWord) {
                toast.error('검색어를 입력해주세요.');
                return;
            }
            if (!productModel.seasonTypes) {
                toast.error('시즌 정보를 입력해주세요.');
                return;
            }
            if (!productModel.colorType) {
                toast.error('색상 정보를 입력해주세요.');
                return;
            }
            if (!productModel.patternType) {
                toast.error('패턴 정보를 입력해주세요.');
                return;
            }
            if (productModel.styleKeywordsList.length > 2) {
                toast.error('키워드 선택은 2개만 가능합니다.');
                return;
            }
            if (!productModel.type) {
                toast.error('리테일 정보를 입력해주세요.');
                return;
            }
            // if(!productModel.jenniefitCategory) {
            //     toast.error('제니핏 카테고리를 입력해주세요.');
            //     return;
            // }
            productModel.styleKeywords = productModel.styleKeywordsList.join(',');
            productModel.searchWord = search

            const response = await convertURLtoFile(productModel.imageUrlList[0].imageUrl)

            let formData = new FormData();
            formData.append('uploadFile', response);

            const postImageResizing = await productApi.postImageResizing(formData
            ).then(res => {
                console.log(res.data.imageUrl);
                productModel.listImageUrl = res.data.imageUrl;
            }).catch(err => {
                console.log(err);
                toast.error("처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.")
                return;
            })
        }

        if (window.confirm('수정하시겠습니까?')) {
            await productApi.putProduct(productModel
            ).then(res => {
                console.log(res);
                toast.success('수정 되었습니다.');
            }).catch(err => {
                console.log(err);
                toast.error('수정에 실패했습니다.');
            })
        }
    };

    const handleChange =
        (prop: keyof ProductModel) => (event: ChangeEvent<HTMLInputElement>) => {
            setProductModel({ ...productModel, [prop]: event.target.value });
        };

    const handleBack = (e) => {
        e.preventDefault();
        router.push(`/jennie-product/jennie-product-total?storeSearch=true`);
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
                    <Box sx={{position: 'fixed', zIndex: '999'}}>
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
                                <Grid
                                    item
                                    sx={{m: -1}}>
                                    <Button
                                        component="a"
                                        startIcon={<SaveIcon fontSize="small"/>}
                                        sx={{ m: 1 }}
                                        variant="contained"
                                        onClick={() => handlePostProduct(productModel.id)}
                                    >
                                        수정
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                    <Card sx={{pt:10}}>
                        <JennieProductCorrectionDetail
                          addFileImage={addFileImageHandler}
                          data={productModel}
                          changeSeason={changeSeasonHandler}
                          imageUrlData={productModel.mainImageUrl}
                          imageUrlList={productModel.imageUrlList}
                          imageList={productModel.imageList}
                          handleChange={handleChange}
                          setData={setProductModel}
                          search={search}
                          setSearch={setSearch}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

JennieProductCorrection.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default JennieProductCorrection;