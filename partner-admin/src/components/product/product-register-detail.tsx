import React, {ChangeEvent, useCallback, useContext, useRef, useState} from "react";
import {
    Checkbox, FormControlLabel, MenuItem,
    IconButton, Input, InputAdornment, useMediaQuery,
    Select, Stack, TextField, Typography, Theme, Box,
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LaunchIcon from '@mui/icons-material/Launch';
import {DataContext} from "../../contexts/data-context";
import {getDataContextValue} from "../../utils/data-convert";
import {ProductModel} from "../../types/product-model";
import UploadProductImg from "./upload-product-img";
import {CategoryDialog, ColorDialog, PatternDialog} from "../dialog/dialogs";
import _ from "lodash";
import Tags from "@yaireo/tagify/dist/react.tagify"
import "@yaireo/tagify/dist/tagify.css"
import {ImageInFormWidget} from "../widgets/image-widget";


const ProductRegisterDetail = (props) => {
    const {data, setData} = props;
    const {t} = useTranslation();
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const align = mdUp ? 'horizontal' : 'vertical';

    const dataContext = useContext(DataContext);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState(null);
    const [openColorDialog, setOpenColorDialog] = useState(false);
    const [openPatternDialog, setOpenPatternDialog] = useState(false);

    const handleChange = (prop: keyof ProductModel) => (event: ChangeEvent<HTMLInputElement>) => {
        setData({...data, [prop]: event.target.value});
    };

    const handleChangeUrl = () => {
        const ShopUrl = (document.getElementById('shopUrl') as HTMLInputElement).value;
        return window.open(ShopUrl, '_blank')
    };

    const handleClickOpen = (value) => {
        if (value == 'category') {
            if (data.id) {
                window.confirm('카테고리는 정보는 수정할 수 없습니다');
                return;
            }
            setOpen(true);
            return;
        } else if (value == 'color') {
            setOpenColorDialog(true);
            return;
        } else if (value == 'pattern') {
            setOpenPatternDialog(true);
            return;
        }
    };


    const handleClickClear = (prop: keyof ProductModel) => {
        if (prop == 'categoryIds') {
            if (data.id) {
                window.confirm('카테고리는 정보는 수정할 수 없습니다');
                return;
            }
        }

        setData({...data, [prop]: ''});
    };

    const handleClose = (value) => {
        console.log(value)
        if (value) {
            setData({
                ...data,
                categoryIds: value.key.split('/')
            });
        }
        setOpen(false);

    };

    const handleColorClose = (value) => {
        if (value) {
            setData({...data, colorType: value.name})
        }
        setOpenColorDialog(false);
    };

    const handlePatternClose = (value) => {
        if (value) {
            setData({...data, patternType: value.name})
        }
        setOpenPatternDialog(false);
    }

    const [temp, setTemp] = useState([]);
    let arr;
    const handleChangeSeason = (value, checked) => {
        if (checked) {
            arr = value;
            setTemp(arr);
        } else {
            arr = '';
            setTemp(arr)
        }
        return temp
    }

    const renderSeason = () => {
        return (
            <>
                {Object.values(dataContext.PRODUCT_SEASON_TYPE).map((season) => {
                    return (
                        <>
                            <FormControlLabel
                                sx={{mr: 4}}
                                value={season}
                                label={season}
                                control={<Checkbox
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeSeason(e.target.value, e.target.checked)}
                                    checked={temp?.includes(season)}
                                />}
                            />
                        </>
                    )
                })}
            </>
        )
    }

    const tagifyRef = useRef();
    const onChange = useCallback((e) => {
        if (e.detail.value) {
            const obj = JSON.parse(e.detail.value);
            let keywordArr = [];
            for (let i = 0; i < obj.length; i++) {
                keywordArr.push(obj[i].value)
            }
            setData({...data, searchWord: keywordArr})
        } else {
            return '';
        }

    }, [])

    return (
        <>
            <PropertyList>
                {data.id ? <><PropertyListItem
                    align={align}
                    label={`${t('label_productId')}`}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            id='id'
                            value={data.id}
                            disabled={true}
                            placeholder={`${t('placeholder_id')}`}
                        />
                    </Typography>
                </PropertyListItem></> : <></>}

                <PropertyListItem
                    align={align}
                    label={`${t('label_nameKo')}`}

                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            id='nameKo'
                            value={data.nameKo}
                            placeholder={`${t('placeholder_nameKo')}`}
                            onChange={handleChange('nameKo')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_nameEn')}`}
                    sx={{mb: 1, ml: 1}}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            id='nameEn'
                            value={data.nameEn}
                            placeholder={`${t('placeholder_nameEn')}`}
                            onChange={handleChange('nameEn')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_category')}`}
                    sx={{mb: 1, ml: 1}}
                >
                    <Stack direction='row'
                           sx={{
                               width: 380,
                               borderRadius: 1,
                               border: '1px solid rgb(100 116 139 / 15%)',
                               px: 1,
                               py: 1.5
                           }}>
                        <Input
                            disableUnderline={true}
                            type='text'
                            style={{width: 380}}
                            value={data.categoryIds !== undefined ? getDataContextValue(dataContext, 'CATEGORY_MAP', data.categoryIds[data.categoryIds.length - 1], 'path') : null}
                            readOnly={true}
                            disabled={true}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        sx={{p: 0}}
                                        onClick={() => {
                                            handleClickClear('categoryIds');
                                        }}
                                    >
                                        <ClearIcon/>
                                    </IconButton>
                                    <IconButton
                                        sx={{p: 0}}
                                        onClick={() => handleClickOpen('category')}
                                    >
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <CategoryDialog
                            keepMounted
                            parent={'STYLE'}
                            open={open}
                            onClose={handleClose}
                            category={dataContext.CATEGORY}
                            value={data.categoryId}
                        />
                    </Stack>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_brand')}`}
                    sx={{mb: 3, ml: 1}}
                >
                    <Select
                        size={"medium"}
                        sx={{minWidth: 250}}
                        value={data.brandName}
                        onChange={(e) => setData({...data, brandName: e.target.value})}
                    >
                        <MenuItem value={''}>전체</MenuItem>
                        {_.sortBy(dataContext.BRAND, 'name').map((brand) => {
                            return (
                                <MenuItem key={brand.id}
                                          value={brand.name}>{brand.name}</MenuItem>
                            )
                        })}
                    </Select>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_price')}`}
                    sx={{mb: 3, ml: 1}}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{lineHeight: 4,}}
                    >
                        <TextField
                            id='price'
                            sx={{mr: 1}}
                            placeholder={`${t('placeholder_price')}`}
                            value={data.price.toLocaleString()}
                            onChange={handleChange('price')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_mallUrl')}`}
                    sx={{mt: 3, mb: 3, ml: 1}}
                >
                    <Stack
                        direction='row'
                    >
                        <TextField
                            sx={{
                                display: 'flex',
                                minWidth: 350
                            }}
                            id='shopUrl'
                            defaultValue='https://'
                            onChange={handleChange('detailSiteUrl')}
                        />
                        <IconButton color="primary"
                                    component="span"
                                    sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                    onClick={handleChangeUrl}
                        >
                            <LaunchIcon/>
                        </IconButton>
                    </Stack>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={`${t('label_keyword')}`}
                >
                    <Tags
                        className='tags'
                        tagifyRef={tagifyRef} // optional Ref object for the Tagify instance itself, to get access to  inner-methods
                        settings={{
                            placeholder: "최대 20개",
                            maxTags: 20,
                            editTags: {
                                clicks: 2,              // single click to edit a tag
                                keepInvalid: false,      // if after editing, tag is invalid, auto-revert
                            },
                            backspace: true,
                        }}  // tagify settings object
                        defaultValue={data.searchWord}
                        onChange={onChange}
                    />
                </PropertyListItem>

                <PropertyListItem
                    align={align}
                    label={`${t('label_season')}`}
                    sx={{mt: 2, mb: 3, ml: 1}}
                >
                    <Stack direction="row" sx={{mt: 1, width: 400}}
                           justifyContent={"space-between"}>
                        {renderSeason()}
                    </Stack>
                </PropertyListItem>
                <Stack
                    direction='row' sx={{mt: 3, mb: 3}}>
                    <PropertyListItem
                        align={align}
                        label={`${t('label_pattern')}`}
                    >
                        <Stack
                            direction='row'
                        >
                            <Input
                                id="standard-adornment-password"
                                type='text'
                                value={data.patternType}
                                readOnly={true}
                                disabled={true}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            sx={{p: 0}}
                                            onClick={() => handleClickClear('patternType')}
                                        >
                                            <ClearIcon/>
                                        </IconButton>
                                        <IconButton
                                            sx={{p: 0}}
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
                    <PropertyListItem
                        align={align}
                        label={`${t('label_color')}`}
                    >
                        <Stack
                            direction='row'
                        >
                            <Input
                                id="standard-adornment-password"
                                type='text'
                                value={data.colorType}
                                readOnly={true}
                                disabled={true}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            sx={{p: 0}}
                                            onClick={() => handleClickClear('colorType')}
                                        >
                                            <ClearIcon/>
                                        </IconButton>
                                        <IconButton
                                            sx={{p: 0}}
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
                </Stack>
                <PropertyListItem
                    sx={{mt: 4, mb: 2, ml: 1}}
                    align={align}
                    label={`${t('label_shopImageList')}`}
                >
                    <UploadProductImg
                        target={'Image'}
                        data={data}
                        // addFileImage={addFileImage}
                        //imageList={imageList}
                        setData={setData}
                    />
                </PropertyListItem>
                <Stack direction='row' sx={{mt: 5, mb: 8}}>
                    <PropertyListItem
                        align={align}
                        label={`${t('label_ghostImage')}`}
                    >
                        <UploadProductImg
                            target={'Image'}
                            data={data}
                            // addFileImage={addFileImage}
                            // imageList={imageList}
                            setData={setData}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label={`${t('label_fittingImage')}`}
                    >
                        <UploadProductImg
                            target={'Image'}
                            data={data}
                            // addFileImage={addFileImage}
                            // imageList={imageList}
                            setData={setData}
                        />
                    </PropertyListItem>
                </Stack>
                {data.id ?
                    <>
                        <Stack direction={'row'} sx={{mb: 10}}>
                            <PropertyListItem
                                align={align}
                                label={'메인 이미지'}
                            >
                                <Box sx={{width: 300}}>
                                    <ImageInFormWidget imageUrl={`${data.mainImageUrl}`}/>
                                </Box>
                            </PropertyListItem>
                            <PropertyListItem
                                align={align}
                                label={'피팅 이미지'}
                            >
                                <Box sx={{width: 300}}>
                                    <ImageInFormWidget imageUrl={`${data.fitRefImageUrl}`}/>
                                </Box>
                            </PropertyListItem>
                        </Stack>
                    </>
                    : <></>}
            </PropertyList>
        </>
    )
}

export default ProductRegisterDetail;