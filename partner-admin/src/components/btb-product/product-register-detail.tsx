import React, {ChangeEvent, FC, useContext, useEffect, useState} from "react";
import {
    MenuItem,
    IconButton,
    Input,
    InputAdornment,
    useMediaQuery,
    Select,
    Stack,
    TextField,
    Typography,
    Theme,
    Button,
    FormControlLabel,
    Checkbox,
    Divider, Box,
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LaunchIcon from '@mui/icons-material/Launch';
import {DataContext} from "../../contexts/data-context";
import {getDataContextValue} from "../../utils/data-convert";
import {CategoryDialog, ColorDialog, PatternDialog} from "../dialog/dialogs";
import _ from "lodash";
import {ImageInListWidget} from "../widgets/image-widget";
import {ColorOrderDialog} from "../dialog/color-order-dialog";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import {ProductColorModel, ProductColors} from "../../types/btb-product-color-model";
import {endPointConfig} from "../../config";
import {Plus as PlusIcon} from '../../icons/plus';
import {X as XIcon} from "../../icons/x";

const CardComponent = (props) => {
    const {index, data, setData, onDelete, correct, complete} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const dataContext = useContext(DataContext);
    const {t} = useTranslation();

    const [colorItem, setColorItem] = useState<ProductColors>({
        id: null,
        listOrder: null,
        colorName: "",
        colorHex: "",
        patternName: "",
        fitRequestStatus: ""
    });
    const [openColorDialog, setOpenColorDialog] = useState(false);
    const [openPatternDialog, setOpenPatternDialog] = useState(false);
    const colorArr = data.productColors.sort((a, b) => a.listOrder - b.listOrder);

    useEffect(() => {
        setColorItem(colorArr[index]);
        colorArr.listOrder = index + 1;
    }, [data])

    // const handleChange = (prop: keyof ProductColors) => (event: ChangeEvent<HTMLInputElement>) => {
    //     const newC = data.productColors;
    //     if(prop == 'colorName') {
    //         colorItem['colorName'] = event.target.value;
    //     } else if(prop == 'colorHex') {
    //         colorItem['colorHex'] = event.target.value;
    //     };
    //     newC[index] = colorItem;
    //     setData({...data, productColors: newC});
    // };
    //
    const clickDelete = (index) => {
        onDelete(index);
    }

    const handleClickOpen = (value) => {
        if (value == 'color') {
            setOpenColorDialog(true);
            return;
        } else if (value == 'pattern') {
            setOpenPatternDialog(true);
            return;
        }
    };

    const handleClickClear = (prop: keyof ProductColors) => {
        const newC = data.productColors;
        newC[index][prop] = '';
        setData({...data, productColors: newC});
    };

    const handleColorClose = (value) => {
        if (value) {
            const newC = data.productColors;
            newC[index]['colorName'] = value.name;
            newC[index].listOrder = index + 1;
            setData({...data, productColors: newC});
        }
        setOpenColorDialog(false);
    };

    const handlePatternClose = (value) => {
        if (value) {
            const newC = data.productColors;
            newC[index]['patternName'] = value.name;
            setData({...data, productColors: newC});
        }
        setOpenPatternDialog(false);
    }


    return (
        <>
            {/*<PropertyListItem*/}
            {/*    align={align}*/}
            {/*    label={`자사몰 컬러 Info*`}*/}
            {/*    sx={{ml: 1}}*/}
            {/*>*/}
            {/*    <Stack direction='row'>*/}
            {/*        <TextField*/}
            {/*            id='id'*/}
            {/*            placeholder={'option_color : #000000'}*/}
            {/*            value={data.productColors[index].colorHex}*/}
            {/*            sx={{mr: 2}}*/}
            {/*            onChange={handleChange('colorHex')}*/}
            {/*        />*/}
            {/*        <TextField*/}
            {/*            id='id2'*/}
            {/*            value={`option_text : ${data.productColors[index].colorName}`}*/}
            {/*            disabled={true}*/}
            {/*            onChange={handleChange('colorName')}*/}
            {/*        />*/}
            {/*    </Stack>*/}
            {/*</PropertyListItem>*/}
            <Stack
                direction='row' sx={{mt: 3, mb: 3}}>
                <PropertyListItem
                    align={align}
                    label={`${t('label_color')}${index + 1}*`}
                >
                    <Stack
                        direction='row'
                    >
                        <Input
                            id="standard-adornment-password"
                            type='text'
                            value={colorItem.colorName || ''}
                            readOnly={true}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        sx={{p: 0}}
                                        disabled={correct || complete}
                                        onClick={() => handleClickClear('colorName')}
                                    >
                                        <ClearIcon/>
                                    </IconButton>
                                    <IconButton
                                        sx={{p: 0}}
                                        disabled={correct || complete}
                                        onClick={() => handleClickOpen('color')}
                                    >
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <ColorDialog
                            keepMounted
                            open={openColorDialog}
                            onClose={handleColorClose}
                            items={dataContext.COLOR}
                            value={data.colorType}
                        />
                    </Stack>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_pattern')}*`}
                >
                    <Stack
                        direction='row'
                    >
                        <Input
                            id="standard-adornment-password"
                            type='text'
                            value={colorItem.patternName || ''}
                            readOnly={true}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        sx={{p: 0}}
                                        disabled={correct || complete}
                                        onClick={() => handleClickClear('patternName')}
                                    >
                                        <ClearIcon/>
                                    </IconButton>
                                    <IconButton
                                        sx={{p: 0}}
                                        disabled={correct || complete}
                                        onClick={() => handleClickOpen('pattern')}
                                    >
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <PatternDialog
                            keepMounted
                            open={openPatternDialog}
                            onClose={handlePatternClose}
                            items={dataContext.PATTERN}
                            value={data.patternType}
                        />
                    </Stack>
                </PropertyListItem>
                {data.productColors?.length > 1 && colorItem.id == null ?
                  <Box sx={{mt: 1.8, mr: 3, ml: -7}}>
                    <Button
                      size={'small'}
                      variant="contained"
                      color='error'
                      onClick={() => clickDelete(index)}
                    > {t('button_delete')}
                    </Button>
                </Box>  : <></>}

            </Stack>
        </>
    )
};

interface ListProps {
    data: ProductColorModel;
    setData: (data) => void;
    state: string;
    correct: boolean;
    complete: boolean;
}

const ProductRegisterDetail: FC<ListProps> = (props) => {
    const {data, setData, state, correct, complete} = props;
    const {t} = useTranslation();
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const align = mdUp ? 'horizontal' : 'vertical';
    const gender = localStorage.getItem('mallGender');


    const dataContext = useContext(DataContext);
    const [open, setOpen] = useState(false);
    const [openColorOrderDialog, setOpenColorOrderDialog] = useState(false);


    const switchGenderCategories = () => {
        if(gender == 'F'){
            return getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', data.categoryIds[data.categoryIds.length - 1], 'path')
        }else{
            return getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', data.categoryIds[data.categoryIds.length - 1], 'path')
        }
    }

    const handleChange = (prop: keyof ProductColorModel) => (event: ChangeEvent<HTMLInputElement>) => {
        setData({...data, [prop]: event.target.value});
    };

    const handleChangeUrl = (value) => {
        const url = (document.getElementById(`${value}`) as HTMLInputElement).value;
        return window.open(url, '_blank')
    };

    const handleClickOpen = (value) => {
        if (value == 'category') {
            setOpen(true);
            return;
        } else if (value == 'colorOrder') {
            setOpenColorOrderDialog(true);
            return;
        }
    };

    const handleClickClear = (prop: keyof ProductColorModel) => {
        if (prop == 'categoryIds') {
            setData({...data, [prop]: []});
        }
    };

    const handleClose = (value) => {
        if(value){
            if (isNaN(value?.ids)) {
                let cateTemp = value?.ids.split('/')
                if(cateTemp.length > 2){
                    setData({
                        ...data,
                        categoryIds: cateTemp
                    });
                    setOpen(false);
                }else{
                    if(value.id == 19){
                        let cateTemp = value?.ids.split('/')
                        setData({
                            ...data,
                            categoryIds: cateTemp
                        });
                        setOpen(false);
                    }else{
                        window.confirm('최종 카테고리까지 모두 선택해주세요.');
                        return;
                    }
                }
            }
        }else{
            setOpen(false);
        }
    };

    const handleDownload = () => {
        let guideUrl
        if(gender == 'F'){
            guideUrl = `${endPointConfig.styleBotImage}guide/category_guide_230503.pdf`;
        }else{
            guideUrl =`${endPointConfig.styleBotImage}guide/m_category_guide_230905.pdf`;
        }
            axios({
                url: decodeURIComponent(guideUrl),
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${guideUrl.substr(guideUrl.lastIndexOf('/'))}`)
                document.body.appendChild(link)
                link.click()
                // toast.success('다운로드 성공')
            })

    }

    const checkedSeason = (season) => {
        if (data.seasonTypes) {
            return data.seasonTypes.includes(season)
        }
        return false;
    }

    const changeSeason = (value: string, checked: boolean): void => {
        let season = []
        if (data.seasonTypes) {
            season = data.seasonTypes.split(',');
        }
        if (checked) {
            season.push(value);
        } else {
            _.remove(season, (data) => {
                return data == value;
            });
        }
        setData(prevData => ({
            ...prevData,
            seasonTypes: season.join(',')
        }))
    }

    const sortBySeason = (season) => {
            switch (season) {
                case 'SPRING':
                    return '봄';
                case 'SUMMER':
                    return '여름';
                case 'FALL':
                    return '가을';
                case 'WINTER':
                    return '겨울';
            }
        }
    const renderSeason = () => {
        return Object.keys(dataContext.PRODUCT_SEASON_TYPE).map(key => {
            return (
              <FormControlLabel
                  key={key}
                  value={key}
                  disabled={correct}
                  control={<Checkbox
                      onChange={e => {
                          changeSeason(e.target.defaultValue, e.target.checked)
                      }}
                      checked={checkedSeason(key)}
                  />}
                  label={sortBySeason(key)}/>
            )
        });
    }

    const handleColorPlus = () => {
        const addColor = [{
            id: null,
            listOrder: data.productColors.length + 1,
            colorName: "",
            colorHex: "",
            patternName: "",
            fitRequestStatus: "InputWait"
        }];
        let newColor = [...data.productColors, ...addColor];
        setData(prevData => ({...prevData, productColors: newColor}))
    };

    const onDelete = (index) => {
        if (data.productColors.length > 1) {
            const deleteColor = [...data.productColors]
            deleteColor.splice(index, 1)
            console.log(deleteColor)
            setData({...data, productColors: deleteColor});
        }
    }

    return (
        <>
            <PropertyList>
                {data.id ? <PropertyListItem
                    align={align}
                    label={`${t('label_productId')}`}
                    sx={{ml: 1}}
                >
                    <TextField
                            id='id'
                            value={data.id || ''}
                            disabled={true}
                            placeholder={`${t('placeholder_id')}`}
                    />
                </PropertyListItem> : <></>}
                <PropertyListItem
                    align={align}
                    label={`${t('label_productNo')}*`}
                    sx={{ml: 1}}
                >
                    <TextField
                        id='id'
                        sx={{minWidth: 400}}
                        value={data.productNo || ''}
                        disabled={data.registrationType == 'Automatic'}
                        placeholder={`${t('placeholder_productNo')}`}
                        onChange={handleChange('productNo')}
                    />
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_nameKo')}*`}
                >

                        <TextField
                            id='nameKo'
                            sx={{minWidth: 620}}
                            value={data.nameKo || ''}
                            disabled={correct}
                            placeholder={`${t('placeholder_nameKo')}`}
                            onChange={handleChange('nameKo')}
                        />
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_nameEn')}*`}
                    sx={{mb: 1, ml: 1}}
                >
                        <TextField
                            id='nameEn'
                            sx={{minWidth: 620}}
                            value={data.nameEn || ''}
                            disabled={correct}
                            placeholder={`${t('placeholder_nameEn')}`}
                            onChange={handleChange('nameEn')}
                        />
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_category')}*`}
                    sx={{mb: 1, ml: 1}}
                >
                    <Stack direction='row'>
                        <Stack direction='row'
                               sx={{
                                   width: 400,
                                   borderRadius: 1,
                                   border: '1px solid rgb(100 116 139 / 15%)',
                                   px: 1,
                                   py: 1.5
                               }}>
                            <Input
                                disableUnderline={true}
                                type='text'
                                style={{width: 380}}
                                value={data.categoryIds ? switchGenderCategories() : null || ''}
                                readOnly={true}
                                disabled={true}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            sx={{p: 0}}
                                            disabled={correct}
                                            onClick={() => {
                                                handleClickClear('categoryIds');
                                            }}
                                        >
                                            <ClearIcon/>
                                        </IconButton>
                                        <IconButton
                                            sx={{p: 0}}
                                            disabled={correct}
                                            onClick={() => handleClickOpen('category')}
                                        >
                                            <SearchIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <CategoryDialog
                                keepMounted
                                open={open}
                                onClose={handleClose}
                                category={gender == 'F' ? dataContext.FEMALE_CATEGORY : dataContext.MALE_CATEGORY} />
                        </Stack>
                        <Button
                            sx={{ml: 2}}
                            startIcon={<DownloadIcon/>}
                            variant={'outlined'}
                            onClick={handleDownload}
                        >
                            카테고리 가이드 다운로드
                        </Button>
                    </Stack>
                </PropertyListItem>
                <Divider/>
                <Box sx={{m: 2}}>
                    <Button variant={'outlined'}
                            disabled={correct || complete}
                            startIcon={<PlusIcon fontSize="small"/>}
                            onClick={handleColorPlus}>
                        {`${t('components_btbProduct_productRegisterDetail_button_addColorAndPattern')}`}
                    </Button>
                </Box>
                {data.productColors?.map((value, index) => {
                    return (
                        <>
                            <CardComponent key={`key${index}`}
                                           index={index}
                                           data={data}
                                           setData={setData}
                                           onDelete={onDelete}
                                           correct={correct}
                                           complete={complete}
                            />
                            <Divider/>
                        </>
                    )
                })}
                <PropertyListItem
                    align={align}
                    label={`${t('label_season')}*`}
                >
                    <Stack direction="row"
                           justifyContent={"start"}>
                        {renderSeason()}
                    </Stack>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_brand')}*`}
                    sx={{mb: 3, ml: 1}}
                >
                    <Select
                        size={"medium"}
                        sx={{minWidth: 250}}
                        disabled={correct}
                        value={data.brandId ? data.brandId : ''}
                        onChange={(e) => setData({...data, brandId: e.target.value})}
                    >
                        {_.sortBy(dataContext.MALL_BRAND, 'nameKo').map((brand) => {
                            return (
                                <MenuItem key={brand.id}
                                          value={brand.id}>{brand.nameKo}</MenuItem>
                            )
                        })}
                    </Select>
                </PropertyListItem>
                <Stack direction={'row'}>
                    <PropertyListItem
                      align={align}
                      label={`${t('label_price')}`}
                      sx={{mb: 3, ml: 1}}
                    >
                        <TextField
                            id='priceNormal'
                            sx={{mr: 1}}
                            disabled={correct}
                            placeholder={`${t('placeholder_price')}`}
                            value={data.priceNormal
                                ? data.priceNormal.toLocaleString() : null || ''}
                            onChange={handleChange('priceNormal')}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                      align={align}
                      label={`${t('label_priceDiscount')}`}
                      sx={{mb: 3, ml: 1}}
                    >

                        <TextField
                            id='priceDiscount'
                            sx={{mr: 1}}
                            disabled={state == 'cor'}
                            value={data.priceDiscount || data.priceDiscount == 0
                                ? data.priceDiscount.toLocaleString() : null || ''}
                            onChange={handleChange('priceDiscount')}
                        />
                    </PropertyListItem>
                </Stack>
                <PropertyListItem
                    align={align}
                    label={`${t('label_detailUrl')}`}
                    sx={{mt: 3, mb: 3, ml: 1}}
                >
                    <Stack
                        direction='row'
                    >
                        <TextField
                            sx={{
                                display: 'flex',
                                minWidth: 350,
                                width: 600,
                            }}
                            disabled={correct}
                            id='detailSiteUrl'
                            value={data.detailSiteUrl ? data.detailSiteUrl : 'https://'}
                            onChange={handleChange('detailSiteUrl')}
                        />
                        <IconButton color="primary"
                                    component="span"
                                    sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                    onClick={() => handleChangeUrl('detailSiteUrl')}
                        >
                            <LaunchIcon/>
                        </IconButton>
                    </Stack>
                </PropertyListItem>
            </PropertyList>
        </>
    )
}

export default ProductRegisterDetail;