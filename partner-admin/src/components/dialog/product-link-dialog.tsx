import {Button, Card, Dialog, IconButton, Stack, Tab, Tabs, Typography} from "@mui/material";
import {X as XIcon} from "../../icons/x";
import React, {useContext, useEffect, useState} from "react";
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import {ChooseCategory} from "../product-linkage-management/choose-category";
import {ChooseProduct} from "../product-linkage-management/choose-product";
import {useTranslation} from "react-i18next";
import {cafe24CategoryApi} from "../../api/cafe24-category-api";
import {cafe24ProductApi} from "../../api/cafe24-product-api";
import {DataContext} from "../../contexts/data-context";
import {toast} from "react-hot-toast";


export const ProductLinkDialog = (props) => {
    const {onClose, open, ...other} = props;
    const {t} = useTranslation();
    const dataContext = useContext(DataContext);

    const [currentTab, setCurrentTab] = useState<string>('first');
    const [filteredList, setFilteredList] = useState<any[]>([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedSeasons, setSelectedSeasons] = useState([]);

    //선택된 컬러 담기
    const [selectedOptionColor, setSelectedOptionColor] = useState([])

    let mallId = '';

    if (typeof window != 'undefined') {
        mallId = localStorage.getItem('mallName');
    }
    let data = {};
    let temp = [];

    const handleCancel = () => {
        onClose();
        setFilteredList([]);
        setCurrentTab('first');
        setSelectedProduct([]);
        setSelectedCategory([]);
        setSelectedSeasons([]);
    }

    const handleNext = () => {
        setCurrentTab('second');
    }

    const handleBefore = () => {
        setCurrentTab('first');
        setSelectedProduct([]);
        setSelectedSeasons([]);
        setSelectedCategory([]);
    }

    const handleComplete = async () => {
        if(selectedProduct.length === 0){
            window.confirm(`선택된 상품이 없습니다.`)
            return;
        }

        const emptyImgArr = [];
        const properProducts = []
        for(const value of selectedProduct){
             const response = await cafe24ProductApi.getProductNo(value);
             if (response.detail_image === null) {
                 emptyImgArr.push(response)
             } else {
                 properProducts.push(response)
             }

        }

        if(emptyImgArr.length > 1 ){
                    window.confirm(`상품명: ${emptyImgArr[0].product_name} 외 ${emptyImgArr.length - 1} 개의 상품 이미지를 확인 할 수 없습니다. 이미지 등록 후 다시 시도해 주시기 바랍니다.`)
                    return;
                }else if(emptyImgArr.length == 1){
                    window.confirm(`상품명: ${emptyImgArr[0].product_name} 의 상품 이미지를 확인 할 수 없습니다. 이미지 등록 후 다시 시도해 주시기 바랍니다.`)
                    return;
                }else if(emptyImgArr.length == 0 && properProducts.length > 0){
                    for (const item of properProducts) {
                        const discount = await cafe24ProductApi.getDiscount(item.product_no).then(res => {
                            return Math.floor(Number(res.discountprice.mobile_discount_price));
                        });
                        let pickCategory = selectedCategory?.filter((v) => v.id == item.product_no)
                        let pickItem = selectedOptionColor?.filter((v) => v.product_no == item.product_no)
                        let pickSeason = selectedSeasons?.filter((v) => v.id == item.product_no)
                        if(!pickItem[0]?.productColors){
                            window.confirm('컬러 옵션이 셋팅되지 않은 상품은 연동을 할 수 없습니다.')
                            continue;
                        }else{
                            data = {
                                nameKo: item.product_name,
                                nameEn: item.eng_product_name ? item.eng_product_name : '',
                                productNo:item.product_no,
                                productCode: item.product_code,
                                priceNormal: Math.floor(Number(item.price)),
                                priceDiscount: discount,
                                fitRefImageUrl: item.detail_image,
                                detailSiteUrl: `http://${mallId}.cafe24.com/product/detail.html?product_no=${item.product_no}`,
                                categoryIds: pickCategory[0].category,
                                brandId: dataContext.MALL_BRAND[0].id,
                                productColors: pickItem[0].productColors,
                                seasonTypes:pickSeason[0].seasons,
                            }

                            const result = await cafe24CategoryApi.mappingCategories(data)
                            if (result === 201) {
                                toast.success('상품 연동이 완료되었습니다')
                                onClose();
                                setCurrentTab('first');
                                setFilteredList([]);
                                setSelectedProduct([]);
                                setSelectedSeasons([]);
                                setSelectedCategory([]);
                            }
                    }}
        }

    }

    const buttonDisabled = () => {
        return filteredList.length == 0;
    }

    const getCategory = async () => {
        const count = await cafe24CategoryApi.getCategoriesCount();
        await cafe24CategoryApi.getCategories(count)
            .then((res) => {
                res.lists.forEach(async (item) => {
                        await cafe24ProductApi.getProductCount(item.category_no).then((response) => {
                            temp.push({
                                categoryNo: item.category_no,
                                fullCategoryName: item.category_name,
                                count: response.data.count
                            })
                            setCategories(temp);
                        })

                    })

                }
            ).catch((err) => console.log(err))
    }

    useEffect(() => {
        getCategory();
    }, [open])

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {minWidth: 800,maxWidth: 1300, maxHeight: 700}}}
            open={open}
            onBackdropClick={handleCancel}
            {...other}
        >
            <Stack sx={{display: 'flex', justifyContent: 'space-between'}}
                   direction='row'>
                <Stack direction='row'>
                    {currentTab == 'first' ?
                        <>
                            <Typography
                                variant='h5'
                                sx={{m: 2}}>
                                {t("component_dialog_productLinkDialog_typography_shopCategory")}
                            </Typography>
                            <Typography variant='body2'
                                        sx={{m: 2, mt: 2.5}}>
                                {t("component_dialog_productLinkDialog_typography_shopCategoryBody")}
                            </Typography>
                        </>
                        :
                        <>
                            <Typography
                                variant='h5'
                                sx={{m: 2}}>
                                {t("component_dialog_productLinkDialog_typography_chooseItem")}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{m: 2, mt: 2.5}}>
                                {t("component_dialog_productLinkDialog_typography_chooseItemBody")}
                            </Typography>
                        </>
                    }
                </Stack>
                <Stack direction='row'>
                    <Tabs
                        indicatorColor="primary"
                        scrollButtons="auto"
                        textColor="primary"
                        value={currentTab}
                        variant="scrollable"
                        sx={{mt: 3}}
                    >
                        <Tab
                            icon={<Filter1Icon/>}
                            disabled={filteredList.length == 0}
                            value='first'
                            onClick={() => setCurrentTab('first')}
                        />
                        <Tab
                            icon={<Filter2Icon/>}
                            disabled={filteredList.length == 0}
                            value='second'
                            onClick={() => setCurrentTab('second')}

                        />
                    </Tabs>
                    <IconButton
                        sx={{ml: 2, mr: 2}}
                        onClick={handleCancel}
                    >
                        <XIcon fontSize="small"/>
                    </IconButton>
                </Stack>
            </Stack>
            <Card>
                {currentTab === 'first' &&
                    <ChooseCategory
                        categoryList={categories}
                        filteredList={filteredList}
                        setFilteredList={setFilteredList}/>
                }
                {currentTab === 'second' &&
                    <ChooseProduct
                        filteredList={filteredList}
                        setSelectedProduct={setSelectedProduct}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        setSelectedOptionColor={setSelectedOptionColor}
                        selectedOptionColor={selectedOptionColor}
                        selectedSeasons={selectedSeasons}
                        setSelectedSeasons={setSelectedSeasons}
                    />
                }
            </Card>
            {currentTab == 'first' ?
                <Stack sx={{display: 'flex', justifyContent: 'end', m: 2}}
                       direction='row'>
                    <Typography sx={{
                        mt: 1,
                        mr: 2
                    }}>{t("component_dialog_productLinkDialog_typography_clickButton")}</Typography>
                    <Button
                        disabled={buttonDisabled()}
                        sx={{width: 75, height: 45}}
                        onClick={handleNext}
                        variant='outlined'>
                        {t("button_next")}
                    </Button>
                </Stack>
                :
                <Stack sx={{display: 'flex', justifyContent: 'space-around', m: 1}}
                       direction='row'>
                    <Stack>
                        <Typography variant='body2' sx={{color: 'darkGrey', whiteSpace: 'pre-wrap', mt: 1, ml: -32}}>
                            {t("component_dialog_productLinkageManagement_chooseProduct_typography")}
                        </Typography>
                    </Stack>
                    <Stack direction='row' sx={{mr: -32, mt: 1}}>
                    <Button
                        sx={{mr: 2}}
                        onClick={handleBefore}
                        variant='outlined'>{t("button_back")}</Button>
                    <Button
                        onClick={handleComplete}
                        variant='contained'>{t("button_complete")}</Button>
                    </Stack>
                </Stack>
            }
        </Dialog>
    )
};