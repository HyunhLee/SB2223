import {
    Box,
    Card,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    Input,
    InputAdornment,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import React, {ChangeEvent, useCallback, useContext, useEffect, useRef, useState} from "react";
import LaunchIcon from '@mui/icons-material/Launch';
import {getDataContextValue} from "../../utils/data-convert";
import {
    DataContext,
    JennieFitAiForthItems,
    JennieFitAiThirdItems,
    renderBrandKeyword,
    renderColor
} from "../../contexts/data-context";
import DetailImageBox from "./detail-image-box";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {CategoryDialog, ColorDialog, JennieFitAiDialog, PatternDialog} from "../dialog/category-dialog";
import {ProductModel} from "../../types/product-model";
import _ from "lodash";
import {brandApi} from "../../api/brand-api";
import {BrandCategoryModel} from "../../types/brand-model";
import Tags from "@yaireo/tagify/dist/react.tagify";
import "@yaireo/tagify/dist/tagify.css"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const JennieProductDetail = (props) => {
    const {
        addFileImage,
        addGhostFileImage,
        addfitRefFileImage,
        ghostImage,
        fitRefImage,
        data,
        setData,
        imageList,
        changeSeason,
        setSearch,
        search,
      handleChange,
    } = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [open, setOpen] = React.useState(false);
    const [openJennieFit, setOpenJennieFit] = React.useState(false);
    const [patternOpen, setPatternOpen] = React.useState(false);
    const [colorOpen, setColorOpen] = React.useState(false);
    const dataContext = useContext(DataContext);
    const tagifyRef = useRef();


    const [brandCategory, setBrandCategory] = useState<BrandCategoryModel[]>([{
        id: null,
        brand: null,
        category: null,
    }]);

    const onChangeKeyword = (e) :void => {
        console.log('data########', data);
        console.log('detail#######', e.detail.value)
        if(e.detail.value){
            let keywordArr = [];
            const obj = JSON.parse(e.detail.value);
            for (const element of obj) {
                keywordArr.push(element.value)
            }
            setSearch(keywordArr.join(','))
        }else{
            setSearch('')
        }
    }

    const getBrandCategorys = useCallback(async () => {
        try {
            const result = await brandApi.getBrandCategory({size: 100, page: 0});
            setBrandCategory(result);
        } catch (err) {
            console.error(err);
        }
    }, [])

    useEffect(() => {
        getBrandCategorys();
    }, [])


    const handleChangeKeyword = (event: SelectChangeEvent<typeof data.styleKeywordsList>) => {
        const {
            target: {value},
        } = event;
        setData({...data, styleKeywordsList: value})
    };

    const checkedSeason = (season) => {
        if (data.seasonTypes) {
            return data.seasonTypes.includes(season)
        }
        return false;
    }

    const handleClose = (value) => {
        if (value) {
            if(value.key.split('/')[0] == 5) {
                setData({...data,
                    categoryIds: value.key.split('/'),
                    jenniefitCategory: 'ACC_ETC_ETC_ETC',
                    jenniefitCategoryId: 2043
                })
            } else {
                setData({...data,
                    categoryIds: value.key.split('/')
                })
            }
        }
        setOpen(false);
    };

    const handleJennieFitClose = (value) => {
        if (value) {
            setData({
                ...data,
                jenniefitCategory: value.name,
                jenniefitCategoryId: value.id
            });
        }
        setOpenJennieFit(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickJennieFitOpen = () => {
        setOpenJennieFit(true);
    };

    const handlePatternClose = (value) => {
        if (value) {
            setData({...data, patternType: value.name})
        }
        setPatternOpen(false);
    };

    const handleClickPatternOpen = () => {
        setPatternOpen(true);
    };

    const handleColorClose = (value) => {
        if (value) {
            setData({...data, colorType: value.name, searchWord: `${renderColor(value.name)}, ${data.searchWord}`})
        }
        setColorOpen(false);
    };

    const handleClickColorOpen = () => {
        setColorOpen(true);
    };

    const handleClickClear = (prop: keyof ProductModel) => {
        if(prop == 'categoryIds') {
            setData({...data, [prop]: '', jenniefitCategory: ''});
        } else {
            setData({...data, [prop]: ''});
        }
    };

    const handleTypeChange = (prop, value): void => {
        if(prop == 'brandId'){
            setData({...data, [prop]: value})
            setSearch(`${data.nameKo},${data.nameEn},${dataContext.BRAND_MAP[value].nameKo},${dataContext.BRAND_MAP[value].nameEn}`)
        }else{
            setData({...data, [prop]: value, searchWord: [...search].join(',')})
        }

    };
    const handleChangeUrl = () => {
        const ShopUrl = (document.getElementById('shopUrl') as HTMLInputElement).value;
        return window.open(ShopUrl, '_blank')
    };

    const handleChangeShopUrl = (event: ChangeEvent<HTMLInputElement>): void => {
        setData({...data, detailSiteUrl: decodeURI(event.target.value)});
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setData({...data, nameKo: event.target.value});
    }

    const handleEngNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setData({...data, nameEn: event.target.value});
    }

    const handlePriceChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setData({...data, price: Number(event.target.value)});
    }

    const renderType = () => {
        return Object.keys(dataContext.RETAIL).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext.RETAIL[key]}</MenuItem>)
        });
    }

    const renderKeywords = () => {
        return Object.keys(dataContext.KEYWORDS).map(key => {
            return (<MenuItem key={dataContext.KEYWORDS[key]}
                              value={dataContext.KEYWORDS[key]}>
                <Checkbox checked={data.styleKeywordsList.indexOf(dataContext.KEYWORDS[key]) > -1}/>
                <ListItemText primary={dataContext.KEYWORDS[key]}/>
            </MenuItem>)
        })
    }

    const renderCheckBox = () => {
        return Object.keys(dataContext.PRODUCT_SEASON_TYPE).map((key) => {
            return (
                <>
                    <FormControlLabel
                        value={key}
                        label={key}
                        control={<Checkbox
                            onChange={e => {
                                changeSeason(e.target.defaultValue, e.target.checked)
                            }}
                            checked={checkedSeason(key)}
                        />}
                    />
                </>)
        })
    }

    const align = smDown ? 'vertical' : 'horizontal';

    const getBrandId = () => {
        return (data.brandId) ? data.brandId : '';
    }

    const changeBrandNameHandler = (changeValues) => {
        let result = [];
        brandCategory.filter(brand => brand.brand.id === changeValues).forEach((name) => {
            if (name.category.name != null) {
                result.push(renderBrandKeyword(name.category.name))
            }
        })
        if (data.styleKeywordsList.length > 0) {
            data.styleKeywordsList = [];
            setData({
                ...data,
                brandId: changeValues,
                styleKeywordsList: data.styleKeywordsList.concat(result),
                //searchWord: `${data.nameKo.split(' ').join(', ')}, ${dataContext.BRAND_MAP[changeValues].nameKo}, ${dataContext.BRAND_MAP[changeValues].nameEn}, ${data.searchWord}`
            })
        } else {
            setData({
                ...data,
                brandId: changeValues,
                styleKeywordsList: result,
                //searchWord: `${data.nameKo.split(' ').join(', ')}, ${dataContext.BRAND_MAP[changeValues].nameKo}, ${dataContext.BRAND_MAP[changeValues].nameEn}, ${data.searchWord}`
            })
        }
    }

    const renderCategoryPath = (categoryId) => {
        if (categoryId) {
            return getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId, 'path')
        }
        return '';
    }

    const renderJenniefitCategory = (jenniefitCategory) => {
        if (jenniefitCategory != null) {
            return jenniefitCategory
        } else if(data.categoryIds[0] == '5') {
            setData({...data,
                jenniefitCategory: 'ACC_ETC_ETC_ETC',
                jenniefitCategoryId: 2043
            })
        }
        return '';
    }

    let category = (data && data.categoryIds) ? renderCategoryPath(data.categoryIds[1]).split('<') : null

    return (
        <Card>
            <PropertyList>
                <PropertyListItem
                    align={align}
                    label="* 상품명"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            id='nameKo'
                            placeholder={'상품명을 입력하세요'}
                            onChange={handleChange('nameKo')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="* 영문 상품명"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            id='nameEn'
                            placeholder={'영문 상품명을 입력하세요'}
                            onChange={handleEngNameChange}
                        />
                    </Typography>
                </PropertyListItem>
                <Stack direction='row'>
                    <PropertyListItem
                        align={align}
                        label="* 카테고리"
                    >
                        <Stack
                            direction='row'
                        >
                            <Input
                                type='text'
                                style={{width: 350}}
                                value={data.categoryIds !== undefined ? getDataContextValue(dataContext, 'CATEGORY_MAP', data.categoryIds[data.categoryIds.length - 1], 'path') || '' : null}
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
                                            onClick={handleClickOpen}
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
                    {data.categoryIds[0] && Number(data.categoryIds[0]) !== 5 ?
                        <PropertyListItem
                            align={align}
                            label="* 제니핏 카테고리"
                        >
                            <Stack
                                direction='row'
                            >
                                <Input
                                    type='text'
                                    style={{width: 350}}
                                    value={renderJenniefitCategory(data.jenniefitCategory)}
                                    readOnly={true}
                                    disabled={true}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                sx={{p: 0}}
                                                disabled={data.categoryIds[0] == '5'}
                                                onClick={() => {
                                                    handleClickClear('jenniefitCategory');
                                                }}
                                            >
                                                <ClearIcon/>
                                            </IconButton>
                                            <IconButton
                                                sx={{p: 0}}
                                                disabled={data.categoryIds[0] == '5'}
                                                onClick={handleClickJennieFitOpen}
                                            >
                                                <SearchIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                <JennieFitAiDialog
                                    open={openJennieFit}
                                    onClose={handleJennieFitClose}
                                    items={dataContext.JENNIEFIT_AI}
                                    thirdItems={JennieFitAiThirdItems(category)}
                                    fourthItems={JennieFitAiForthItems(category)}
                                    category={category}
                                />
                            </Stack>
                        </PropertyListItem>
                        :
                        null
                    }
                </Stack>
                <PropertyListItem
                    align={align}
                    label="* 브랜드"
                >
                    <Select
                        size={"small"}
                        sx={{width: 250}}
                        value={getBrandId()}
                        onChange={e => handleTypeChange('brandId', e.target.value)}
                    >
                        <MenuItem value={''}>전체</MenuItem>
                        {_.sortBy(dataContext.BRAND, 'name').map((brand) => {
                            return (
                                <MenuItem key={brand.id}
                                          value={brand.id}>{brand.name}</MenuItem>
                            )
                        })}
                    </Select>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="* 판매가"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{lineHeight: 4}}
                    >
                        <TextField
                            sx={{mr: 2}}
                            id='price'
                            placeholder={'판매가를 입력해주세요'}
                            value={data.price}
                            onChange={handlePriceChange}
                        />원
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="* 쇼핑몰 URL"
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
                            placeholder={'해당 상품의 쇼핑몰 URL을 입력해주세요'}
                            onChange={handleChangeShopUrl}
                        />
                        <IconButton color="primary"
                                    component="span"
                                    sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                    onClick={handleChangeUrl}>
                            <LaunchIcon/>
                        </IconButton>
                    </Stack>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="* 검색어"
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
                        value={data.searchWord ? data.searchWord : []}
                        onChange={onChangeKeyword}
                    />
                </PropertyListItem>
                <Stack
                    direction='row'
                >
                    <PropertyListItem
                        align={align}
                        label="* 시즌"
                    >
                        <Stack direction="row"
                               justifyContent={"space-between"}>
                            {renderCheckBox()}
                        </Stack>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="* 컬러"
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
                                            onClick={handleClickColorOpen}
                                        >
                                            <SearchIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <ColorDialog
                                keepMounted
                                open={colorOpen}
                                onClose={handleColorClose}
                                items={dataContext.COLOR}
                                value={data.color}
                            />
                        </Stack>
                    </PropertyListItem>
                </Stack>
                <Stack
                    direction='row'
                >
                    <PropertyListItem
                        align={align}
                        label="* 키워드 (최대 2가지)"
                    >

                        <Select
                            name="keyword"
                            onChange={handleChangeKeyword}
                            multiple={true}
                            sx={{minWidth: 200}}
                            value={data.styleKeywordsList}
                            renderValue={(selected) => selected.join(',')}
                            MenuProps={MenuProps}
                        >
                            {renderKeywords()}
                        </Select>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="* 패턴"
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
                                            onClick={handleClickPatternOpen}
                                        >
                                            <SearchIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <PatternDialog
                                keepMounted
                                open={patternOpen}
                                onClose={handlePatternClose}
                                items={dataContext.PATTERN}
                                value={data.patternType}
                            />
                        </Stack>
                    </PropertyListItem>
                </Stack>
                <PropertyListItem
                    align={align}
                    label="* 리테일 구분"
                >
                    <Select
                        value={data.type}
                        defaultValue=''
                        size={"small"}
                        sx={{minWidth: 200}}
                        onChange={e => {
                            handleTypeChange('type', e.target.value)
                        }}
                    >
                        <MenuItem value={''}>-</MenuItem>
                        {renderType()}
                    </Select>
                </PropertyListItem>
                <Divider/>
                <PropertyListItem
                    align={align}
                    label="* Shop 이미지 리스트"
                >
                    <DetailImageBox
                        target={'Image'}
                        data={data}
                        addFileImage={addFileImage}
                        imageList={imageList}
                        setData={setData}
                    />
                </PropertyListItem>
                <Stack
                    direction='row'
                >
                    <PropertyListItem
                        align={align}
                        label="고스트 이미지(선택사항)"
                    >
                        <DetailImageBox
                            target={'Image'}
                            data={data}
                            addFileImage={addGhostFileImage}
                            imageList={ghostImage}
                            setData={setData}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="피팅 참고 이미지(선택사항)"
                    >
                        <DetailImageBox
                            target={'Image'}
                            data={data}
                            addFileImage={addfitRefFileImage}
                            imageList={fitRefImage}
                            setData={setData}
                        />
                    </PropertyListItem>
                </Stack>
            </PropertyList>
        </Card>
    )
};

export default JennieProductDetail;