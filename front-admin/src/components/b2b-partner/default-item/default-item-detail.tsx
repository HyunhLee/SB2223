import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import {B2bDefaultItemDetailModel, B2bDefaultItemModel} from "../../../types/b2b-partner-model/b2b-default-item-model";
import {PropertyList} from "../../property-list";
import {PropertyListItem} from "../../property-list-item";
import {
    Box,
    Button,
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
import {getDataContextValue, renderKeyword} from "../../../utils/data-convert";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {CategoryDialog, ColorDialog, PatternDialog} from "../../dialog/category-dialog";
import {ImageInListWidget} from "../../widgets/image-widget";
import {X as XIcon} from "../../../icons/x";
import {DataContext} from "../../../contexts/data-context";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../../style/dropzone";
import _ from "lodash";
import {Plus as PlusIcon} from "../../../icons/plus";


const ImageUploadBox = (props) => {
    const {header, addFileImage, fileItem} = props;

    const [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    /**
     * fileItem을 받은 후 HandelDrop 함수에 Promise객체를 넘긴다.
     */
    useEffect(() => {
        if (fileItem) {
            fileItem.then(res => {
                handleDrop([res])
            })
        }

    }, [])

    const handleDrop = (newFiles: any): void => {
        newFiles.forEach((file) => {
            file.preview = URL.createObjectURL(file)
            file.key = `key${0}`;
        })
        setFiles([...newFiles]);
    };

    const handleClick = (event: MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleVisible = () => {
        setVisible(!visible);
    };

    const onDelete = (item) => {
        console.log('item', item)
        const newfile = [...files]
        newfile.splice(newfile.indexOf(item), 1)
        setFiles(newfile);
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
            sx={{border: 1, borderRadius: 1, width: 360}}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pr: 0.6,
                    pl: 2,
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
                    <Box sx={{p: 1, width: 180, ml:10}}
                         key={item.imageUrl}
                         style={{position: 'relative',}}>
                        <img
                            src={`${item.preview}`}
                            style={{width: '100%', objectFit: 'contain'}}
                            loading="lazy"
                        />
                        <div style={{position: 'absolute', right: -10, top: 5}}>
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


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 9 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const DefaultItemDetail = (props) => {
    const {
        itemModel,
        setItemModel,
        productDetail,
        setProductDetail,
        uploadImages,
        setUploadImages,
    } = props;

    const dataContext = useContext(DataContext)
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    const [open, setOpen] = useState(false);
    const [patternOpen, setPatternOpen] = useState(false);
    const [colorOpen, setColorOpen] = useState(false);
    const [indexForColorPattern, setIndexForColorPattern] = useState<number>(null)
    const [cate, setCate] = useState(null);


    //초기셋팅
    useEffect(() => {
        let tempItemInfo = itemModel
        if(dataContext.FEMALE_CATEGORY_MAP != {} && dataContext.MALE_CATEGORY_MAP != {} && tempItemInfo.categoryIds != []){
            console.log('loaded page')
            const categoryId = tempItemInfo.categoryIds[tempItemInfo.categoryIds.length - 1];
            console.log(categoryId, itemModel, dataContext.FEMALE_CATEGORY_MAP, 'loaded data')
            if(itemModel.gender === 'F'){
                setCate(getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', categoryId, 'path'))
            }else{
                setCate(getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', categoryId, 'path'))
            }

        }
    },[itemModel])

    const handleChange = (prop: keyof B2bDefaultItemDetailModel) => (event: ChangeEvent<HTMLInputElement>) => {
        if(prop == 'gender'){
            setItemModel({ ...itemModel, [prop]: event.target.value});
        }else{
            setItemModel({ ...itemModel, [prop]: event.target.value});
        }

    };

    const handleCategoryDialog = (value) => {
        if (open) {
                if(value) {
                    if (isNaN(value?.ids)) {
                        let categoryTemp = value?.ids.split('/')
                        if (categoryTemp.length > 2) {
                            setItemModel({
                                ...itemModel,
                                categoryIds: categoryTemp
                            })
                            setCate(categoryTemp)
                            setOpen(false);
                        } else {
                            if (value.id == 19) {
                                let categoryTemp = value?.ids.split('/')
                                setItemModel({
                                    ...itemModel,
                                    categoryIds: categoryTemp
                                })
                                setCate(categoryTemp)
                                setOpen(false);
                            } else {
                                window.confirm('최종 카테고리까지 모두 선택해주세요.');
                            }

                        }
                    }
                }else{
                    setOpen(false);
                }
        } else {
            if(itemModel.gender == ''){
                window.confirm('성별을 먼저 선택해주세요.')
            }else{
                setOpen(true);
            }

        }
    };

    const handlePatternDialog = (value) => {
        if (patternOpen) {
            if (value) {
                let addPatternArr = productDetail.map((v, index) => index == indexForColorPattern ? {...v, patternName: value.name} : v)
                setProductDetail(addPatternArr)
            }
            setPatternOpen(false);
        } else {
            setPatternOpen(true);
        }
    }

    const handleColorDialog = (value) => {
        if (colorOpen) {
            if (value) {
                let addColorArr = productDetail.map((v, index) => index == indexForColorPattern ? {...v, colorName: value.name, listOrder: index} : v)
                setProductDetail(addColorArr)
            }
                setColorOpen(false);
        } else {
                setColorOpen(true);
        }

    }

    const handleClickColorClear = (prop) => {
        if(prop == 'color'){
            let colorClearArr = productDetail.map((v, index) => index == indexForColorPattern ? {...v, colorName: ""} : v)
            setProductDetail(colorClearArr)
        }else{
            let patternClearArr = productDetail.map((v, index) => index == indexForColorPattern ? {...v, patternName: ""} : v)
            setProductDetail(patternClearArr)
        }

    }

    const handleClickClear = (prop: keyof B2bDefaultItemModel) => {
        setItemModel({...itemModel, [prop]: ''});
        setCate('')
    };

    const addImage = (num, image) => (imageFile) => {
        if(image === 'mainImage'){
            if(imageFile.length != 0 && num != null) {
                // console.log(num, image, imageFile, '사진 업로드 하기')
                setUploadImages(uploadImages.map((v, idx) => idx == num? {...uploadImages[idx], id: idx, mainImage: imageFile} : v))
                setProductDetail(productDetail.map((v, idx) => idx == num  ? {...productDetail[idx],  mainImage: imageFile} : v));
            }else{
                // console.log(num, image, imageFile, '사진 삭제하기')
                setUploadImages(uploadImages.map((v, idx) => idx == num? {...uploadImages[idx], id: idx, mainImage: []} : v))
                setProductDetail(productDetail.map((v, idx) => idx == num  ? {...productDetail[idx],  mainImage: []} : v));
            }
        }else if(image === 'putOnImage'){
            if(imageFile.length != 0 && num != null) {
                setUploadImages(uploadImages.map((v, idx) => idx == num? {...uploadImages[idx], id: idx, putOnImage: imageFile} : v))
                setProductDetail(productDetail.map((v, idx) => idx == num  ? {...productDetail[idx],   putOnImage: imageFile} : v));
            }else{
                setUploadImages(uploadImages.map((v, idx) => idx == num? {...uploadImages[idx], id: idx, putOnImage: []} : v))
                setProductDetail(productDetail.map((v, idx) => idx == num  ? {...productDetail[idx],   putOnImage: []} : v));

            }
        }

    };

    const onDeleteImage = (num, deleteImage) => {
        if (deleteImage === 'mainImageUrl') {
            setProductDetail(productDetail.map((v, idx) => idx == num  ? {...productDetail[idx],  mainImageUrl: '', mainImage: null} : v));
        } else if (deleteImage === 'putOnImageUrl') {
            setProductDetail(productDetail.map((v, idx) => idx == num  ? {...productDetail[idx], putOnImageUrl: '', putOnImage: null} : v));
        }

    }


    ///////////////////////
    const renderKeywords = () => {
        if(itemModel.gender == 'M') {
            return Object.keys(dataContext.B2BMALEKEYWORDS).map(key => {
                return (<MenuItem key={dataContext.B2BMALEKEYWORDS[key]}
                                  value={dataContext.B2BMALEKEYWORDS[key]}>
                    <Checkbox checked={itemModel.styleKeywords?.indexOf(dataContext.B2BKEYWORDS[key]) > -1}/>
                    <ListItemText primary={dataContext.B2BMALEKEYWORDS[key]}/>
                </MenuItem>)
            })
        } else {
            return Object.keys(dataContext.B2BKEYWORDS).map(key => {
                return (<MenuItem key={dataContext.B2BKEYWORDS[key]}
                                  value={dataContext.B2BKEYWORDS[key]}>
                    <Checkbox checked={itemModel.styleKeywords?.indexOf(dataContext.B2BKEYWORDS[key]) > -1}/>
                    <ListItemText primary={dataContext.B2BKEYWORDS[key]}/>
                </MenuItem>)
            })
        }
    }

    const handleChangeKeyword = (event: SelectChangeEvent<typeof itemModel.productStyleKeyWords>) => {
        const {
            target: {value},
        } = event;
        let keywords = [];
        if(value.length > 0) {
            keywords = [...value].map((name) => renderKeyword(name))
        }

        if(value.length > 2){
            window.confirm('스타일 키워드는 최대 2개까지 선택하실 수 있습니다');
            return
        }

        setItemModel({...itemModel, productStyleKeyWords: keywords, styleKeywords :value })


    };

    const renderKeywordsToEng = (item) => {
        if(item.id != null){
            const temp = item.productStyleKeyWords.map((v) => dataContext.B2BKEYWORDS[v])
            itemModel.styleKeywords = temp
            return itemModel.styleKeywords
        }else{
            return item.styleKeywords
        }
    }

    const checkedSeason = (season) => {
        if (itemModel.seasonTypes) {
            return itemModel.seasonTypes.includes(season)
        }
        return false;
    }


    const changeSeason = (value: string, checked: boolean): void => {
        let season = []
        if (itemModel.seasonTypes) {
            season = itemModel.seasonTypes.split(',');
        }
        if (checked) {
            season.push(value);
        } else {
            _.remove(season, (data) => {
                return data == value;
            });
        }
        setItemModel(prevData => ({
            ...prevData,
            seasonTypes: season.join(',')
        }))

    }



    const renderCheckBox = () => {
        return Object.keys(dataContext.BTB_DEFAULT_PRODUCT_SEASON).map((key) => {
            return (
              <>
                  <FormControlLabel
                    value={key}
                    label={dataContext.BTB_DEFAULT_PRODUCT_SEASON[key]}
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


    const addColorPattern = () => {
        setProductDetail(prv => [...prv, {
            id:null,
            listOrder: null,
            mainImageUrl: "",
            mainImage: [],
            putOnImageUrl: "",
            putOnImage: [],
            putOnPreviewImageUrl: "",
            colorName: "",
            patternName: "",
        }])
        setUploadImages((prv) => [...prv, {listOrder: null,  mainImage: [], putOnImage: [],}])
    }

    const deleteColorPatternLayer = (num) => {
       let temp = productDetail.filter((v, idx) =>  idx !== num)
        setProductDetail(temp)
    }


    return(
        <Card>
            <PropertyList>
                {!itemModel?.id ? <></> :
                    <PropertyListItem
                        align={align}
                        label="상품ID"
                    >
                        <TextField
                            id='id'
                            value={itemModel.id || ''}
                            disabled={true}
                        />
                    </PropertyListItem>
                }
                <Stack direction='row'
sx={{display: 'flex', alignItems: 'center', mt:2}}>
                <PropertyListItem
                    align={align}
                    label="*상품명"
                >
                    <TextField
                        id='nameKo'
                        sx={{width: 400}}
                        value={itemModel.nameKo || ''}
                        placeholder={'상품명을 입력하세요'}
                        onChange={handleChange('nameKo')}

                    />
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="*영문 상품명"
                >
                    <TextField
                        id='nameEn'
                        sx={{width: 400, }}
                        value={itemModel.nameEn || ''}
                        placeholder={'영문 상품명을 입력하세요'}
                        onChange={handleChange('nameEn')}
                    />
                </PropertyListItem>
                </Stack>
                <hr style={{border: '1px solid #efefef'}}/>
                <Stack direction='row'
sx={{display: 'flex', alignItems: 'center'}}>
                    <PropertyListItem
                      align={align}
                      label="*성별"
                    >
                        <Select
                          value={itemModel.gender || ''}
                          size={"small"}
                          sx={{minWidth: 80}}
                          onChange={handleChange('gender')}
                        >
                            <MenuItem value={'M'}>남성</MenuItem>
                            <MenuItem value={'F'}>여성</MenuItem>
                        </Select>
                    </PropertyListItem>
                    <PropertyListItem
                      align={align}
                      label="*카테고리"
                    >
                        <Stack
                          direction='row'
                        >
                            <Input
                              type='text'
                              style={{width: 350 , maxHeight: 40}}
                              value={cate}
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
                              category={itemModel?.gender == 'F' ? dataContext.FEMALE_CATEGORY : dataContext.MALE_CATEGORY}
                              value={cate}
                            //  value={itemModel.categoryIds[0]}
                            />
                        </Stack>
                    </PropertyListItem>
                </Stack>
                <Stack direction='row'
sx={{display: 'flex', alignItems: 'center', mt:2}}>
                <PropertyListItem
                  align={align}
                  label={"*스타일 키워드"}>
                    <Select
                      name="keyword"
                      onChange={handleChangeKeyword}
                      multiple={true}
                      sx={{minWidth: 240, maxHeight: 40,}}
                      value={renderKeywordsToEng(itemModel) || []}
                      renderValue={(selected) => selected.join(',')}
                      MenuProps={MenuProps}
                    >
                        {renderKeywords()}
                    </Select>
                </PropertyListItem>
                    <PropertyListItem
                      align={align}
                      label={"*시즌"}>
                        <Stack direction="row"
                               justifyContent={"space-between"}
sx={{width: 300}}>
                            {renderCheckBox()}
                        </Stack>
                    </PropertyListItem>
                </Stack>
                <hr style={{border: '1px solid #efefef'}}/>
                <Button
                  size='small'
                  variant="contained"
                  sx={{ml: 2, mt:2}}
                  startIcon={<PlusIcon fontSize="small" />}
                  onClick={() => addColorPattern()}
                >
                   컬러 및 패턴 추가
                </Button>
                {productDetail.map((item, idx) => {
                    return (
                      <>
                          <Stack direction='row'
sx={{display: 'flex', alignItems: 'center', mt:2,}}>
                              <PropertyListItem
                                align={align}
                                label="*컬러"
                              >
                                  <Stack
                                    direction='row'
                                  >
                                      <Input
                                        id="standard-adornment-password"
                                        type='text'
                                        value={(dataContext.COLOR_MAP[item.colorName]) ? dataContext.COLOR_MAP[item.colorName].name : item.colorName || ''}
                                        readOnly={true}
                                        disabled={true}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                  sx={{p: 0}}
                                                  onClick={() => {
                                                      handleClickColorClear('color')
                                                      setIndexForColorPattern(idx)
                                                  }}
                                                >
                                                    <ClearIcon/>
                                                </IconButton>
                                                <IconButton
                                                  sx={{p: 0}}
                                                  onClick={() => {
                                                      // @ts-ignore
                                                      handleColorDialog()
                                                      setIndexForColorPattern(idx)
                                                  }}
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
                                        value={item.colorName}
                                      />
                                  </Stack>
                              </PropertyListItem>
                              <PropertyListItem
                                align={align}
                                label="*패턴"
                              >
                                  <Stack
                                    direction='row'
                                  >
                                      <Input
                                        id="standard-adornment-password"
                                        type='text'
                                        value={(dataContext.PATTERN_MAP[item.patternName]) ? dataContext.PATTERN_MAP[item.patternName].name : item.patternName || ''}
                                        readOnly={true}
                                        disabled={true}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                  sx={{p: 0}}
                                                  onClick={() => {
                                                      handleClickColorClear('pattern')
                                                      setIndexForColorPattern(idx)
                                                  }}
                                                >
                                                    <ClearIcon/>
                                                </IconButton>
                                                <IconButton
                                                  sx={{p: 0}}
                                                  onClick={() => {
                                                      // @ts-ignore
                                                      handlePatternDialog()
                                                      setIndexForColorPattern(idx)
                                                  }}
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
                                        value={item.patternName}
                                      />
                                  </Stack>
                              </PropertyListItem>
                          </Stack>
                          <Stack
                            direction='row'
                          >
                              <PropertyListItem
                                align={align}
                                label="*메인 이미지"
                              >
                                  {item.mainImageUrl ?
                                    <ImageInListWidget imageName={item.mainImageUrl}
                                                       imageUrl={item.mainImageUrl}
                                                       height={250} />
                                    :
                                    <ImageUploadBox
                                      target={'Image'}
                                      addFileImage={addImage(idx, 'mainImage')}
                                    />
                                  }
                                  <div style={{
                                      position: 'absolute',
                                      right: 15,
                                      top: 10,
                                      width: '100%',
                                      display: (item.mainImageUrl ? 'block' : 'none')
                                  }}>
                                      <Stack
                                        direction='column'
                                      >
                                          <IconButton
                                            edge="end"
                                            onClick={() => onDeleteImage(idx,'mainImageUrl')}
                                          >
                                              <XIcon fontSize="small"/>
                                          </IconButton>
                                      </Stack>
                                  </div>
                              </PropertyListItem>
                              <PropertyListItem
                                align={align}
                                label="*피팅 이미지"
                              >
                                  {item.putOnImageUrl ?
                                    <ImageInListWidget imageName={item.putOnImageUrl}
                                                       imageUrl={item.putOnImageUrl}
                                                       height={200}
                                    />
                                    :
                                    <ImageUploadBox
                                      target={'Image'}
                                      addFileImage={addImage(idx, 'putOnImage')}
                                    />

                                  }
                                  <div style={{
                                      position: 'absolute',
                                      right: 15,
                                      top: 10,
                                      width: '100%',
                                      display: (item.putOnImageUrl ? 'block' : 'none')
                                  }}>
                                      <Stack
                                        direction='column'
                                      >
                                          <IconButton
                                            edge="end"
                                            onClick={() => onDeleteImage(idx,'putOnImageUrl')}
                                          >
                                              <XIcon fontSize="small"/>
                                          </IconButton>
                                      </Stack>
                                  </div>
                              </PropertyListItem>
                              {productDetail.length > 1 && item.id == null?
                                        <Box sx={{mt: 1.8, mr: 3, ml: -7}}>
                                            <Button
                                              size={'small'}
                                              variant="contained"
                                              color='error'
                                              onClick={() => deleteColorPatternLayer(idx)}
                                            > 삭제
                                            </Button>
                                        </Box>
                                : <></>}
                          </Stack>
                          <Stack sx={{height: 10}}/>
                          <Divider />
                      </>
                    )
                })}

            </PropertyList>
        </Card>
    )
};

export default DefaultItemDetail;