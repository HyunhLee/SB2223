import {NextPage} from "next";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import NextLink from "next/link";
import SaveIcon from '@mui/icons-material/Save';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {ChangeEvent, useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {useRouter} from "next/router";
import {productApi} from "../../api/product-api";
import {ProductModel} from "../../types/product-model";
import toast from "react-hot-toast";
import JennieProductCorrectionDetail from "../../components/jennie-product/jennie-product-correction-detail";

const JennieProduct: NextPage = () => {

    const router = useRouter();
    const {productModelId} = router.query;
    const [productModel, setProductModel] = useState<ProductModel>({
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
        displayStatus: "DISPLAY_END",
        registrationType: "MANUAL",
        fitRequestStatus: null,
        inspectionStatus: null,
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
    const [search, setSearch] = useState<string>('')


    const handleChange =
      (prop: keyof ProductModel) => (event: ChangeEvent<HTMLInputElement>) => {
        if(prop == 'price'){
            setProductModel({ ...productModel, [prop]: Number(event.target.value)});
        }else{
            setProductModel({ ...productModel, [prop]: event.target.value});
        }

      };


    const getProducts = useCallback(async () => {
        try {
            const result = await productApi.getProduct(productModelId);
            setProductModel(result);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        if (productModelId && productModelId !== '0') {
            (async () => {
                await getProducts();
            })()
        }
    }, []);

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
        setProductModel({...productModel, imageList: imageFiles, imageUrlList: imageFiles})
    };

    const addGhostFileImage = (imageFiles) => {
        imageFiles.forEach((file, index) => {
            file.key = `key${index}`;
        })
        if(imageFiles.length != 0) {
            productModel.ghostImageUrl = imageFiles[0].imageUrl
        }
    };

    const addfitRefFileImage = (imageFiles) => {
        imageFiles.forEach((file, index) => {
            file.key = `key${index}`;
        })
        if(imageFiles.length != 0) {
            productModel.fitRefImageUrl = imageFiles[0].imageUrl
        }
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

    const handlePostProduct = async (): Promise<void> => {
        if(!productModel.type) {
            toast.error('리테일 정보를 입력해주세요.');
            return;
        } else if (productModel.type == "RETAIL") {
            if (!productModel.nameKo) {
                toast.error('상품명을 입력해주세요.');
                return;
            }
            if (productModel.nameKo.length >= 50) {
                toast.error('상품명은 50자 이내여야합니다.');
                return;
            }
            if (!productModel.nameEn) {
                toast.error('영문 상품명을 입력해주세요.');
                return;
            }
            if (productModel.nameEn.length >= 50) {
                toast.error('상품명은 50자 이내여야합니다.');
                return;
            }
            if (!productModel.categoryIds) {
                toast.error('카테고리 정보를 입력해주세요.');
                return;
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
            if (productModel.imageList.length === 0) {
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

        console.log(productModel)

        if (window.confirm('저장하시겠습니까?')) {
            await productApi.postProduct(productModel
            ).then(res => {
                console.log(res);
                window.confirm(`ID: ${res.id}`);
                location.reload();
            }).catch(err => {
                console.log(err);
                toast.error('저장에 실패했습니다.');
            });
        }
    };

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
                    <Box sx={{mb: 4, position: 'fixed', zIndex: '999'}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    Jennie Product 수동 등록
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                sx={{m: -1}}>
                                <NextLink
                                    href="/jennie-product/jennie-product"
                                    passHref
                                >
                                    <Button
                                        component="a"
                                        startIcon={<SaveIcon fontSize="small"/>}
                                        sx={{ m: 1 }}
                                        variant="contained"
                                        onClick={handlePostProduct}
                                    >
                                        등록
                                    </Button>
                                </NextLink>
                            </Grid>
                        </Grid>
                    </Box>
                    <Card sx={{pt: 10}}>
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

JennieProduct.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default JennieProduct;