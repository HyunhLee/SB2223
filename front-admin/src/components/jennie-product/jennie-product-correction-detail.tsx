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
    Menu,
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
import React, {useCallback, useContext, useEffect, useState} from "react";
import LaunchIcon from '@mui/icons-material/Launch';
import {getDataContextValue} from "../../utils/data-convert";
import {
    DataContext,
    JennieFitAiForthItems,
    JennieFitAiThirdItems,
    renderBrandKeyword,
    renderColor
} from "../../contexts/data-context";
import ImageFileBox from "./image-file-box";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {CategoryDialog, ColorDialog, JennieFitAiDialog, PatternDialog} from "../dialog/category-dialog";
import {BrandDialog} from "../dialog/brand-dialog";
import {ProductModel} from "../../types/product-model";
import {ImageInListWidget} from "../widgets/image-widget";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../style/dropzone";
import {X as XIcon} from "../../icons/x";
import _ from "lodash";
import {productApi} from "../../api/product-api";
import Tags from "@yaireo/tagify/dist/react.tagify"
import "@yaireo/tagify/dist/tagify.css"
import {BrandCategoryModel} from "../../types/brand-model";
import {brandApi} from "../../api/brand-api";
import DetailImageBox from "./detail-image-box";


const KeywordOptions = ['러블리', '레트로', '매니쉬', '모던', '섹시', '심플베이직', '스트릿', '스포티', '아방가르드', '유니섹스', '캐주얼', '컨템포러리', '클래식', '톰보이', '펑크', '페미닌', '포멀', '히피'];
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

const ImageUploadBox = (props) => {

    const {header, addFileImage} = props;

    let [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState(true)
    const [image, setImage] = useState<string>(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [imageUpload, setImageUpload] = useState<any>({
        dirName: "product",
        uploadFile: []
    })

    useEffect(() => {
        imageUploadHandler();
    }, [imageUpload]);

    const imageUploadHandler = async () => {
        for (let i = 0; i < imageUpload.uploadFile.length; i++) {
            const saveData = {...imageUpload};
            let formData = new FormData();
            Object.keys(saveData).forEach(key => {
                if (key === 'uploadFile') {
                    formData.append(key, saveData[key][i]);
                } else {
                    formData.append(key, String(saveData[key]))
                }
            })
            await productApi.uploadImage(formData
            ).then(res => {
                console.log(res);
                const image = {imageUrl: res.data.imageUrl, listOrder: i + 1, size: imageUpload.uploadFile[i].size}
                setFiles((prevFiles) => [...prevFiles, image])
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const handleDrop = (newFiles: any): void => {
        setImageUpload({...imageUpload, uploadFile: newFiles})
    };

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleVisible = () => {
        setVisible(!visible);
    };

    const handleImageClick = (item) => {
        setImage(item.preview);
    }

    const onDelete = (item) => {
        const newfile = [...files]
        newfile.splice(newfile.indexOf(item), 1)
        setFiles(newfile);
        setImageUpload({...imageUpload, uploadFile: newfile})
        const deleteImage = {imageUrl: item.imageUrl}
        productApi.deleteImage(deleteImage
        ).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        addFileImage(files);
        handleClose();
        if (!visible) {
            handleVisible();
        }
    }, [files]);

    return (
        <Box
            sx={{border: 1, borderRadius: 1}}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pr: 0.6,
                    pl: 2
                }}
            >
                <Typography>
                    {header}
                </Typography>
                <IconButton aria-label="add"
                            onClick={handleClick}>
                    <AddBoxRoundedIcon/>
                </IconButton>
            </Box>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Box sx={{m: 2, p: 2}}>
                    <Dropzone
                        accept="image/*"
                        files={files}
                        onDrop={handleDrop}
                        maxFiles={1}
                    />
                </Box>
            </Menu>
            <Box>
                {files.map((item, index) => (
                    <Box sx={{p: 1}}
                         key={item.imageUrl}
                         style={{position: 'relative'}}>
                        <img
                            src={`${item.imageUrl}`}
                            style={{objectFit: 'contain', width: '100%', height: 150}}
                            loading="lazy"
                            onClick={() => handleImageClick(item)}
                        />
                        <div style={{position: 'absolute', right: 15, top: 10}}>
                            <IconButton
                                edge="end"
                                onClick={() => onDelete(item)}
                            >
                                <XIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

const JennieProductCorrectionDetail = (props) => {
    const {addFileImage, data, imageUrlList, imageList, changeSeason, imageUrlData, handleChange, setData, setSearch, search} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const [open, setOpen] = React.useState(false);
    const [openJennieFit, setOpenJennieFit] = React.useState(false);
    const [patternOpen, setPatternOpen] = React.useState(false);
    const [colorOpen, setColorOpen] = React.useState(false);
    const [brandOpen, setBrandOpen] = useState(false);

    const dataContext = useContext(DataContext);

    const [brandCategory, setBrandCategory] = useState<BrandCategoryModel[]>([{
        id: null,
        brand: null,
        category: null,
    }]);

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


    const onChangeKeyword = (e) :void => {
        console.log('detail#######', e.detail.value)
        if(e.detail.value){
            let keywordArr = [];
            const obj = JSON.parse(e.detail.value);
            for (const element of obj) {
                keywordArr.push(element.value)
            }
            setSearch(keywordArr.join())
        }else{
            setSearch('')
        }
    }

    const handleCategoryDialog = (value) => {
        if (open) {
            if (value) {
                if(value.key.split('/')[0] == '5') {
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
        } else {
            setOpen(true);
        }
    };

    const handlePatternDialog = (value) => {
        if (patternOpen) {
            if (value) {
                setData({...data, patternType: value.name})
            }
            setPatternOpen(false);
        } else {
            setPatternOpen(true);
        }
    }

    const handleColorDialog = (value) => {
        if(data.nameKo != '' && data.nameEn != '' && data.brandId != ''){
            if (colorOpen) {
                if (value) {
                    setData({...data, colorType: value.name})

                }
                if(data.brandId) {
                    setSearch(`${data.nameKo},${dataContext.BRAND_MAP[data.brandId].nameKo},${dataContext.BRAND_MAP[data.brandId].nameEn},${renderColor(value.name)},${value.name}`)
                }
                setColorOpen(false);
            } else {
                setColorOpen(true);
            }
        }else{
            window.confirm('상품명과 브랜드를 먼저 입력해주세요.')
        }

    }


    const handleClickClear = (prop: keyof ProductModel) => {
        setData({...data, [prop]: ''});
    };

    const handleBrandClose = (value) => {
        if (value) {
            setData({
                ...data,
                brandId: value.id,
            });
        }
        setBrandOpen(false);
    };


    const handleTypeChange = (prop, value): void => {
        if(prop == 'brandId'){
            let result = [];
            brandCategory.filter(brand => brand.brand.id === value).forEach((name) => {
                if (name.category.name != null) {
                    result.push(renderBrandKeyword(name.category.name))
                }
            })
            if (data.styleKeywordsList.length > 0) {
                data.styleKeywordsList = [];
                setData({
                    ...data,
                    brandId: value,
                    styleKeywordsList: data.styleKeywordsList.concat(result),
                })
                setSearch(`${data.nameKo},${dataContext.BRAND_MAP[value].nameKo},${dataContext.BRAND_MAP[value].nameEn}`)
            } else {
                setData({
                    ...data,
                    brandId: value,
                    styleKeywordsList: result,
                })
                setSearch(`${data.nameKo},${dataContext.BRAND_MAP[value].nameKo},${dataContext.BRAND_MAP[value].nameEn}`)
            }

        }else if(prop == 'type'){
            setData({...data, [prop]: value, searchWord: [...search].join(',')})
        }else{
            setData({...data, [prop]: value, searchWord: [...search].join(',')})
            setSearch(`${data.nameKo},${dataContext.BRAND_MAP[value].nameKo},${dataContext.BRAND_MAP[value].nameEn}`)
        }

    };

    const renderType = (type) => {
        return Object.keys(dataContext[type]).map((key, idx) => {
            return (<MenuItem key={idx}
                              value={key}>{dataContext[type][key]}</MenuItem>)
        });
    }

    const checkedSeason = (season) => {
        if (data.seasonTypes) {
            let seasonTemp = data.seasonTypes.split(',');
            return seasonTemp.includes(season)
        }
        return false;
    }




    const renderCheckBox = () => {
        return Object.keys(dataContext.PRODUCT_SEASON_TYPE).map((key, idx) => {
            return (
              <>
                  <FormControlLabel
                    key={idx}
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

    const renderKeywords = () => {
        return KeywordOptions.map((keyword, idx) => {
            return (<MenuItem key={idx}
                              value={keyword}>
                <Checkbox checked={data.styleKeywordsList.indexOf(keyword) > -1}/>
                <ListItemText primary={keyword}/>
            </MenuItem>)
        })
    };


    const renderImageUrl = (imageName) => {
        return imageName ?
          <ImageInListWidget imageName={imageName}
                             imageUrl={imageName}/>
          :
          <ImageUploadBox
            target={'Image'}
            addFileImage={addMainImage}
          />

    }



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

    const handleClickJennieFitOpen = () => {
        setOpenJennieFit(true);
    };


    const handleChangeUrl = (url) => {
        return window.open(url, '_blank')
    };


    const addPutOnImage = (imageFile) => {
        if(imageFile.length != 0) {
            setData({...data, putOnImageUrl: imageFile[0].imageUrl});
        }
    };

    const addMainImage = (imageFile) => {
        if(imageFile.length != 0) {
            setData({...data, mainImageUrl: imageFile[0].imageUrl});
        }
    };

    const addFitRefImage = (imageFile) => {
        if(imageFile.length != 0) {
            setData({...data, fitRefImageUrl: imageFile[0].imageUrl});
        }
    };

    const addGhostImage = (imageFile) => {
        if(imageFile.length != 0) {
            setData({...data, ghostImageUrl: imageFile[0].imageUrl});
        }
    };

    const onDeleteImage = (deleteImage) => {
        if (deleteImage === 'mainImageUrl') {
            setData({...data, mainImageUrl: '', mainImage: null});
        } else if (deleteImage === 'putOnImageUrl') {
            setData({...data, putOnImageUrl: '', putOnImage: null});
        } else if (deleteImage === 'ghostImageUrl') {
            setData({...data, ghostImageUrl: '', ghostImage: null});
        } else if (deleteImage === 'fitRefImageUrl') {
            setData({...data, fitRefImageUrl: '', fitRefImage: null});
        }

    }

    const align = smDown ? 'vertical' : 'horizontal';

    const getBrandId = () => {
        return (data.brandId) ? data.brandId : '';
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
        }
        return '';
    }

    let category = (data && data.categoryIds) ? renderCategoryPath(data.categoryIds[1]).split('<') : null

    // @ts-ignore
    return (
        <Card>
            <PropertyList>
                {!data.id ? <></> : <PropertyListItem
                  align={align}
                  label="진열상태"
                >

                        <Select
                          value={data.displayStatus || ''}
                          defaultValue=''
                          size={"small"}
                          sx={{minWidth: 150,}}
                          onChange={e => handleTypeChange('displayStatus', e.target.value)}
                        >
                            {renderType('DISPLAY_STATUS')}
                        </Select>
                </PropertyListItem> }
                {!data.id ? <></> :
                  <PropertyListItem
                    align={align}
                    label="상품ID"
                  >

                      <TextField
                        id='id'
                        value={data.id || ''}
                        disabled={true}
                      />
                  </PropertyListItem>
                }
                <PropertyListItem
                    align={align}
                    label="* 상품명"
                >
                        <TextField
                            id='nameKo'
                            value={data.nameKo || ''}
                            placeholder={'상품명을 입력하세요'}
                            onChange={handleChange('nameKo')}
                        />

                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="* 영문 상품명"
                >

                        <TextField
                            id='nameEn'
                            value={data.nameEn || ''}
                            placeholder={'영문 상품명을 입력하세요'}
                            onChange={handleChange('nameEn')}
                        />
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
                                value={getDataContextValue(dataContext, 'CATEGORY_MAP', data.categoryIds[data.categoryIds.length - 1], 'path') || ''}
                                readOnly={true}
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
                                            onClick={handleCategoryDialog}
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
                                onClose={handleCategoryDialog}
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
                                    value={renderJenniefitCategory(data.jenniefitCategory) ||''}
                                    readOnly={true}
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
                        onChange={e => {
                           handleTypeChange('brandId', e.target.value)
                        }}
                    >
                        <MenuItem value={''}>전체</MenuItem>
                        {_.sortBy(dataContext.BRAND, 'name').map((brand, index) => {
                            return (
                                <MenuItem key={brand.id}
                                          value={brand.id}>{brand.name}</MenuItem>
                            )
                        })}
                    </Select>
                    <BrandDialog
                        keepMounted
                        open={brandOpen}
                        onClose={handleBrandClose}
                        items={dataContext.BRAND}
                        value={data.brandId || ''}
                    />
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="* 판매가"
                >
                    <Stack direction={'row'}>
                        <TextField
                          sx={{mr: 2}}
                          id='price'
                          value={data.price || ''}
                            onChange={handleChange('price')}
                        />
                    <Typography
                        variant="body2"
                        sx={{lineHeight: 4}}
                    >원</Typography>
                    </Stack>
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
                            value={data.detailSiteUrl || ''}
                            placeholder={'https://'}
                            onChange={handleChange('detailSiteUrl')}
                        />
                        <IconButton color="primary"
                                    component="span"
                                    sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                    onClick={() => handleChangeUrl(data.detailSiteUrl)}>
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
                      settings={{
                          placeholder: "최대 20개",
                          maxTags: 20,
                          duplicates: false,
                          autoFocus: true,
                          editTags: {
                              clicks: 2,              // single click to edit a tag
                              keepInvalid: false,      // if after editing, tag is invalid, auto-revert
                          },
                          borderRadius: 20,
                          backspace: true,
                      }}  // tagify settings object
                      value={ search.length > 0 ? search : '' || ''}
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
                              value={(dataContext.COLOR_MAP[data.colorType]) ? dataContext.COLOR_MAP[data.colorType].name : data.colorType || ''}
                              readOnly={true}
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
                                        onClick={handleColorDialog}
                                      >
                                          <SearchIcon/>
                                      </IconButton>
                                  </InputAdornment>
                              }
                            />
                            <ColorDialog
                              keepMounted
                              open={colorOpen}
                              onClose={handleColorDialog}
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
                          value={data.styleKeywordsList || ''}
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
                                value={(dataContext.PATTERN_MAP[data.patternType]) ? dataContext.PATTERN_MAP[data.patternType].name : data.patternType || ''}
                                readOnly={true}
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
                                            onClick={handlePatternDialog}
                                        >
                                            <SearchIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <PatternDialog
                                keepMounted
                                open={patternOpen}
                                onClose={handlePatternDialog}
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
                      value={data.type || ''}
                      defaultValue=''
                      size={'small'}
                      sx={{minWidth: 200}}
                      onChange={e => {
                          handleTypeChange('type', e.target.value)
                      }}
                    >
                        <MenuItem value={''}>-</MenuItem>
                        {renderType('RETAIL')}
                    </Select>
                </PropertyListItem>
                <Divider/>
                <PropertyListItem
                    align={align}
                    label="* Shop 이미지 리스트"
                >
                    {!data.id ?
                      <DetailImageBox
                        target={'Image'}
                        data={data}
                        addFileImage={addFileImage}
                        imageList={imageList}
                        setData={setData}
                      />
                      :
                      <ImageFileBox
                        target={'Image'}
                        data={data}
                        addFileImage={addFileImage}
                        imageUrlList={imageUrlList}
                        imageList={imageList}
                        setData={setData}
                      />}

                </PropertyListItem>
                <Stack
                    direction='row'
                >
                    <PropertyListItem
                        align={align}
                        label="고스트 이미지(선택사항)"
                    >
                        {data.ghostImageUrl ?
                            <ImageInListWidget imageName={data.ghostImageUrl}
                                               imageUrl={data.ghostImageUrl}/>
                            :
                            <ImageUploadBox
                                target={'Image'}
                                addFileImage={addGhostImage}
                            />

                        }
                        <div style={{
                            position: 'absolute',
                            right: 15,
                            top: 10,
                            display: (data.ghostImageUrl ? 'block' : 'none')
                        }}>
                            <Stack
                                direction='column'
                            >
                                <IconButton
                                    edge="end"
                                    onClick={() => onDeleteImage('ghostImageUrl')}
                                >
                                    <XIcon fontSize="small"/>
                                </IconButton>
                            </Stack>
                        </div>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="피팅 참고 이미지(선택사항)"
                    >
                        {data.fitRefImageUrl ?
                            <ImageInListWidget imageName={data.fitRefImageUrl}
                                               imageUrl={data.fitRefImageUrl}/>
                            :
                            <ImageUploadBox
                                target={'Image'}
                                addFileImage={addFitRefImage}
                            />

                        }
                        <div style={{
                            position: 'absolute',
                            right: 15,
                            top: 10,
                            display: (data.fitRefImageUrl ? 'block' : 'none')
                        }}>
                            <Stack
                                direction='column'
                            >
                                <IconButton
                                    edge="end"
                                    onClick={() => onDeleteImage('fitRefImageUrl')}
                                >
                                    <XIcon fontSize="small"/>
                                </IconButton>
                            </Stack>
                        </div>
                    </PropertyListItem>
                </Stack>
                <Divider/>
                {data.fitRequestStatus == 'COMPLETED' ?
                    <Stack
                        direction='row'
                    >
                        <PropertyListItem
                            align={align}
                            label="메인 이미지"
                        >
                            {data.mainImageUrl ?
                                <ImageInListWidget imageName={data.mainImageUrl}
                                                   imageUrl={data.mainImageUrl}/>
                                :
                                <ImageUploadBox
                                    target={'Image'}
                                    addFileImage={addMainImage}
                                />

                            }
                            <div style={{
                                position: 'absolute',
                                right: 15,
                                top: 10,
                                display: (data.mainImageUrl ? 'block' : 'none')
                            }}>
                                <Stack
                                    direction='column'
                                >
                                    <IconButton
                                        edge="end"
                                        onClick={() => onDeleteImage('mainImageUrl')}
                                    >
                                        <XIcon fontSize="small"/>
                                    </IconButton>
                                </Stack>
                            </div>
                        </PropertyListItem>
                        <PropertyListItem
                            align={align}
                            label="피팅 이미지"
                        >
                            {data.putOnImageUrl ?
                                <ImageInListWidget imageName={data.putOnImageUrl}
                                                   imageUrl={data.putOnImageUrl}/>
                                :
                                <ImageUploadBox
                                    target={'Image'}
                                    addFileImage={addPutOnImage}
                                />

                            }
                            <div style={{
                                position: 'absolute',
                                right: 15,
                                top: 10,
                                display: (data.putOnImageUrl ? 'block' : 'none')
                            }}>
                                <Stack
                                    direction='column'
                                >
                                    <IconButton
                                        edge="end"
                                        onClick={() => onDeleteImage('putOnImageUrl')}
                                    >
                                        <XIcon fontSize="small"/>
                                    </IconButton>
                                </Stack>
                            </div>
                        </PropertyListItem>
                    </Stack>
                    :
                    <Divider/>
                }
            </PropertyList>
        </Card>
    )
};

export default JennieProductCorrectionDetail;