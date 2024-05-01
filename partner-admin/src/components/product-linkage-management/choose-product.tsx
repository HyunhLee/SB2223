import {
    Box, Button,
    Card,
    Checkbox, FormLabel, MenuItem, Select,
    Stack, IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    TextField, Input,
    FormControlLabel, InputAdornment,
} from "@mui/material";
import {Scrollbar} from "../scrollbar";
import React, {ChangeEvent, MouseEvent, Fragment, useContext, useEffect, useState, useRef} from "react";
import {cafe24ProductApi} from "../../api/cafe24-product-api";
import {ImagePreviewWidget} from "../widgets/image-widget";
import SearchIcon from "@mui/icons-material/Search";
import {
    Cafe24ProductModel,
    defaultOffset,
    defaultPage,
    defaultProductSearch,
    ProductSearch
} from "../../types/cafe24-product-model";
import {DataContext} from "../../contexts/data-context";
import {useTranslation} from "react-i18next";
import _ from "lodash";
import ClearIcon from '@mui/icons-material/Clear';
import {CategoryDialog, PatternDialog} from '../dialog/dialogs';
import {getDataContextValue} from "../../utils/data-convert";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import {endPointConfig} from "../../config";

export const ChooseProduct = (props) => {
    const {filteredList, setSelectedProduct, setSelectedCategory, setSelectedOptionColor, selectedOptionColor, selectedSeasons, setSelectedSeasons} = props;
    const dataContext = useContext(DataContext);
    const {t} = useTranslation();
    const gender = localStorage.getItem('mallGender');

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState<ProductSearch>(defaultProductSearch(filteredList[0]?.categoryNo));
    const [requestList, setRequestList] = useState<boolean>(true);
    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);
    const [product, setProduct] = useState<Cafe24ProductModel[]>([]);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState(defaultPage());
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [stylebotCategory, setStylebotCategory] = useState([]);
    const [season, setSeason] = useState("");
    const [pattern, setPattern] = useState([]);
    const [color, setColor] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [patternOpen, setPatternOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    let list = product;
    let selectedItemNum;
    let buttonRef = useRef(null);
    const [ready, setReady] = useState(false);

    //example -카페24에 등록되어있는 컬러 가져온 것
    const [optionColor, setOptionColor] = useState([]);
    const [selectedIdx, setSelectedIdx] = useState([]);
    const [idx, setIdx] = useState<number>()

    //temp 컬러랑 패턴 담아둘 그릇
    const [options, setOptions] = useState([])
    const [getColor, setGetColor] = useState(false);

    useEffect(() => {
        (async () => {
            if (requestList) {
                await getProducts();
                setRequestList(false);
                setSelectedProduct([])
                setSelectedIdx([])
                setSelectedLists([])
                setSelectedAllLists(false)
            }
        })()
    }, [requestList])


    const getProducts = async () => {
        if (search.category) {
            filteredList.filter((v) => {
                if (v.categoryNo == search.category) {
                    return setCount(v.count)
                }
            })
        }
        await cafe24ProductApi.getProduct(search).then(res => {
            setProduct(res.lists);
            let temp = [];
            if (res.lists) {
                if (res.lists.length > 0) {
                    res.lists.forEach((item) => {
                        temp.push(item.product_no)
                    })
                } else {
                    setSelectedAllLists(false)
                }

            } else {
                setSelectedAllLists(false)
            }

            setLoading(true);

        }).catch(err => {
            console.log('getProducts err ->', err);
        })
    }

    const handleSelectOneList = (
        id: number,
    ): void => {
        if (selectedLists.length > 50) {
            window.confirm(`${t("component_dialog_productLinkageManagement_chooseProduct_window")}`);
        } else {
            setSelectedAllLists(false)
            if (!selectedLists.includes(id)) {
                setSelectedLists((prevSelected) => [...prevSelected, id]);
                setSelectedProduct((prev) => [...prev, id]);
            } else {
                setSelectedLists((prevSelected) => prevSelected.filter((listId) => listId !== id));
                setSelectedProduct((prevProduct) => prevProduct.filter((v) => v !== id))
            }
        }
    };


    const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAllLists(event.target.checked);
        setSelectedLists(event.target.checked ? product.map((item) => item.product_no) : []);
        setSelectedProduct(event.target.checked ? product.map((item) => item.product_no) : []);
    };

    const handleClickSearch = async () => {
        setPage(defaultPage())
        setSearch({
            ...search
        });
        setRequestList(true);
    }

    const handleClickReset = () => {
        setSearch(defaultProductSearch(filteredList[0].categoryNo));
    };

    const handleChange = (prop: keyof ProductSearch) => (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({...search, [prop]: event.target.value});
    }

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleClickSearch().then(r => console.log(r));
        }
    }


    const switchGenderCategories = (item) => {
        if(gender == 'F'){
            return getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', item.category[item.category?.length - 1], 'path')
        }else{
            return getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.category[item.category?.length - 1],'path')
        }
    }

    const getStatus = (prop) => {
        return (search[prop]) ? search[prop] : 'ALL';
    }

    const changeStatus = (prop, value) => {
        if (value == 'ALL') {
            setSearch(prevData => ({
                ...prevData,
                [prop]: ''
            }))
        } else {
            setSearch(prevData => ({
                ...prevData,
                [prop]: value
            }))
        }

    }

    const changeSeasonHandler = (value: string, checked: boolean): void => {
        let seasonType = []
        if (season) {
            seasonType = season.split(',');
        }
        if (checked) {
            seasonType.push(value);
        } else {
            _.remove(seasonType, (data) => {
                return data == value;
            });
        }
        setSeason(seasonType.join(','))
        let temp = list.map((item, i) => i == selectedItemNum ? {...item, seasonTypes: seasonType.join(',')} : item );

    }

    const checkedSeason = (v) => {
        if (season) {
            return season.includes(v)
        }
        return false;
    }

    const saveSeason = () =>{
        if(selectedLists.length == 0){
            window.confirm('선택 된 상품이 없습니다.')
            return;
        }else{
            let temp = list.map((item, i) => selectedLists.includes(item.product_no) ? {...item, seasonTypes: season} : item );
            setProduct([...temp]);
            let arrrr = list.filter((value) => selectedLists.includes(value.product_no) ?  setSelectedSeasons(prv => [...prv, {id: value.product_no, seasons: season}]) : value );
            setSeason("")
        }
    }


    const saveCategory = () =>{
        if(selectedLists.length == 0){
            window.confirm('선택 된 상품이 없습니다.')
            return;
        }else{
            let temp = list.map((item, i) =>  selectedLists.includes(item.product_no)  ? {...item, category: stylebotCategory} : item );
            let cateTemp = list.filter((item, i) =>  selectedLists.includes(item.product_no)  ? setSelectedCategory( prv => [...prv,{id: item.product_no, category: stylebotCategory} ]) : item );
            setProduct([...temp]);
            setStylebotCategory([])
            //setSelectedCategory(stylebotCategory)
         }
    }

    const savePatternType = (idx, num) => {
        let settingPattern = pattern?.filter((v) => v.product_no == num)
        return (
          <>
              <Input
                id="standard-adornment-password"
                type='text'
                value={settingPattern.length > 0 ? settingPattern[0].pattern : ''}
                readOnly={true}
                disabled={optionColor.length > 0}
                endAdornment={
                    <InputAdornment position="end">
                        {/*<IconButton*/}
                        {/*  sx={{p: 0}}*/}
                        {/*  onClick={() => {*/}
                        {/*      handleClickClear('patternType')*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*    <ClearIcon/>*/}
                        {/*</IconButton>*/}
                        <IconButton
                          sx={{p: 0}}
                          onClick={() => {
                              handleClickPatternOpen(idx, num)

                          }}
                        >
                            <SearchIcon/>
                        </IconButton>
                    </InputAdornment>
                }
              />
          </>
        )
    }

    const [patternNum, setPatternNum] = useState()

    const handleClickPatternOpen = (idx, num) => {
        let selectedListWithColor = selectedOptionColor.filter((v) => v.product_no == num ? v : '')
        setPatternNum(num)

        if(selectedListWithColor.length == 0) {
            window.confirm('칼라옵션을 먼저 선택해주세요. 컬러옵션이 없으면 연동이 불가합니다.')
            return;
        }else{
            let temp = []
            selectedListWithColor.some((v) => {
                if(v.productColors?.length < 1 || !v.productColors){
                    temp.push(true)
                }

            })

            if(temp.includes(true)){
                window.confirm('컬러 옵션을 먼저 선택해주세요. 컬러옵션이 없으면 연동이 불가합니다.')
                return;
            }else{
                setPatternOpen(true)
                setPattern((prv) => [...prv, {product_no: num, id: idx, pattern: ''}])
            }

        }


        //그냥 멀티로 선택해서 진행할때
        // let selectedListWithColor = list.filter((v) => selectedLists.includes(v.product_no) ? v : '')
        // console.log(selectedListWithColor, '$$$$$$')
        // let temp = []
        // selectedListWithColor.some((v) => {
        //     if(v.productColors.length < 1){
        //         temp.push(true)
        //     }
        //
        // })
        //
        // if(temp.includes(true)){
        //     window.confirm('컬러 옵션을 먼저 선택해주세요.')
        //     return;
        // }else{
        //     setPatternOpen(true)
        // }

    }

    let arr = []
    const handlePatternClose = (value) =>{
        if (value) {
            pattern.map((v) =>
              v.product_no === patternNum ? arr.push({ ...v, pattern: value.name }) : arr.push(v)
            );
            setPattern([...arr]);


            for (const element of selectedOptionColor) {
                const prodNo = element.product_no
                const matchingItems = arr.filter(item => item.product_no == prodNo);

                if (matchingItems.length > 0) {
                    let newMatchingArr = []
                    element.productColors.map((v) => newMatchingArr.push({...v, patternName: matchingItems[0].pattern}))
                    element.productColors = newMatchingArr
                }
            }

        }
        setPatternOpen(false)
    }

    const handleCategoryOpen = () =>{
        setCategoryOpen(true)
    }

    const handleCategoryClose = (value) =>{
        if(value){
            if(isNaN(value?.ids)) {
                let categoryTemp = value?.ids.split('/')
                if (categoryTemp.length > 2) {
                    setStylebotCategory(categoryTemp)
                    setCategoryOpen(false)
                } else {
                    if(value.id == 19){
                        let categoryTemp = value?.ids.split('/')
                        setStylebotCategory(categoryTemp)
                        setCategoryOpen(false)
                    }else{
                        window.confirm('최종 카테고리까지 모두 선택해주세요.');
                    }

                }
            }
        }else{
            setCategoryOpen(false)
        }

    }

    const handleClickClear = (props) => {
        if(props == 'categoryType'){
            setStylebotCategory([])
        }
    }

    const getProductColorOptions = async (num, idx) => {
       const result = await cafe24ProductApi.getProductColorOptions(num);
       setOptionColor((prv) => [...prv, result.variants]);
    }

    const getOptionColors = (num, code, idx) => {
         if(optionColor.length > 0) {
             let selectedColorOptions = optionColor?.filter((v, index) => index == idx)

             let getProductCode = optionColor.filter((v) => [...v[0].variant_code].slice(0, 8).join('') == code ? v : null)
             if (selectedIdx.includes(idx) && getProductCode.length > 0) {

                 //카페24에서 넘어오는 중복 컬러 값 제외하고 variant code 값 찾는 코드
                 const uniqueColorVariants = {};
                 const valueArr = []

                 getProductCode[0].forEach(variant => {
                     if(variant.options != null){
                         const colorOption = variant.options.find(option => option.name === "Color" || option.name == "색상" || option.name == "컬러" || option.name == "color");
                         if (colorOption) {
                             if (!uniqueColorVariants[colorOption.value]) {
                                 uniqueColorVariants[colorOption.value] = {
                                     option: colorOption,
                                     variant: variant
                                 };
                             }
                         }
                     }
                 });

                 const uniqueColorVariantArray = Object.values(uniqueColorVariants);

                 uniqueColorVariantArray.map((v) => valueArr.push(v))


                    return (
                      <>
                          {valueArr.length < 1 ?
                            <Stack>컬러옵션이 없으면 연동이 불가합니다.</Stack> :
                            <>
                                {valueArr.map((item) => {
                                    return(
                                      <>
                                          <FormControlLabel
                                            key={item.variant.variant_code}
                                            value={item.option.value}
                                            sx={{textAlign: 'left'}}
                                            control={<Checkbox
                                              onChange={e => {
                                                  changeColorHandler(e.target.value, e.target.checked, num, item.variant.variant_code )
                                              }}
                                              checked={checkedColor(item.option.value, num)}
                                            />}
                                            label={item.option.value} />
                                      </>
                                    )
                                })}
                            </>
                          }
                      </>
                    )
            }
        }

    }

    function groupByProductNo(b) {
        const groupedObj = {};
        for (let i = 0; i < b.length; i++) {
            const item = b[i];
            const product_no = item.product_no;
            if (!groupedObj[product_no]) {
                groupedObj[product_no] = [];
            }
            groupedObj[product_no].push(item);
        }

        const groupedArray = [];
        for (const key in groupedObj) {
            if (groupedObj.hasOwnProperty(key)) {
                groupedArray.push(groupedObj[key]);
            }
        }
        return groupedArray;
    }

    const checkedColor = (v, num) => {
        if (color) {
             const checked = color.filter((colorName) => colorName.product_no == num && colorName.colorName == v)
           return checked.length == 1
        }
        return false;
    }

    const changeColorHandler = (value: string, checked: boolean, num:number, variant:string): void => {

        let selectedArr = [];
        let updatedColor = [...color]; // 새로운 배열을 생성하여 변경 사항을 반영

        if (checked) {
            updatedColor.push({product_no: num, colorName: value, colorHex: '', variantCode: variant});

        } else {
            _.remove(updatedColor, (data) => {
                return data.colorName == value && data.product_no == num;
            });
        }


        updatedColor.map((value, i) =>  selectedArr.push({...value, listOrder: i , patternName: ''}))
        setColor(updatedColor)

        //같은 프로덕트 넘버를 가진 아이들끼리 묶기
        const groupedB = groupByProductNo(selectedArr);

        const listArr = []
        for (const element of list) {
            listArr.push({...element, productColors: []})
        }
        for (const element of listArr) {
            const prodNo = element.product_no

            const matchingItems = groupedB.filter(item => item[0].product_no == prodNo);

            if (matchingItems.length > 0) {
                let newMatchingArr = []
                matchingItems[0]?.map((m,i) => newMatchingArr.push({colorName: m.colorName, colorHex: m.colorHex, variantCode: m.variantCode, listOrder: i, patternName: m.patternName}))
                element.productColors = newMatchingArr
                // console.log(element.productColors, 'colorporduct',newMatchingArr, matchingItems)
            }
        }

        setOptions([...selectedArr])
        setProduct([...listArr]);

        //데이터 등록을 위한 임시로 테스트
        setSelectedOptionColor([...listArr])

    }

    const downloadGuide = () => {
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
        })
    }

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        event.preventDefault();

        setReady(false);
        setSelectedIdx([]);
        setOptionColor([]);
        setIdx(null);

        setPage(newPage)
        setSearch({
            ...search,
            offset: newPage * 50,
            limit: 50,
        });
        setRequestList(true);
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(page)
        setSearch({
            ...search,
            limit: (parseInt(event.target.value, 10)),
        });
        setRequestList(true);
    };

    const renderTypes = (prop) => {
        return Object.keys(dataContext[prop]).map((key, index) => {
            return <MenuItem key={index} value={key}>{dataContext[prop][key]}</MenuItem>
        })
    }



    return (
        <>
            <Stack direction='column'>
                <Stack sx={{display: 'flex', justifyContent: 'space-around'}} direction='row'>
                    <Stack direction='column'>
                        <Card sx={{mt: 5, ml: 2, border: 2, width:130, height: 480}}>
                            <Scrollbar style={{height: '100%'}}>
                                <Table sx={{maxWidth: '100%'}}>
                                    <TableBody>
                                        {filteredList?.map((item) => {
                                            return (
                                                <Fragment key={item.categoryNo}>
                                                    <TableRow
                                                        sx={{cursor: 'pointer'}}
                                                        key={item.categoryNo}
                                                    >
                                                        <TableCell
                                                            sx={{backgroundColor: search.category == item.categoryNo ? 'lightskyblue' : ''}}
                                                            onClick={() => {
                                                                setSearch({
                                                                    ...search,
                                                                    offset: defaultOffset(),
                                                                    category: item.categoryNo
                                                                })
                                                                setPage(defaultPage())
                                                                setRequestList(true);
                                                            }}
                                                            align="left">
                                                            {item.fullCategoryName}({item.count})
                                                        </TableCell>
                                                    </TableRow>
                                                </Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </Card>
                    </Stack>
                    <Stack sx={{width: 10}}></Stack>
                    <Stack sx={{width: 1100, mr: 2}} direction='column'>
                        <Stack sx={{display: 'flex', justifyContent: 'space-between'}} direction='row'>
                            <Box sx={{mt: 1, mb: 1}}>
                                {t("component_dialog_productLinkageManagement_chooseProduct_box")}
                            </Box>
                            <Box sx={{mt: 1, mr: 1}}>
                                {selectedLists.length == 0 ? '' : `${selectedLists.length}${t("component_dialog_productLinkageManagement_chooseProduct_displayBox")}`}
                            </Box>
                        </Stack>
                        <Stack direction="column">
                            <Card sx={{border: 2, mb: 1}}>
                                <Stack direction="row" sx={{ml: 2}}>
                                    <TextField
                                        label={t("label_nameKo")}
                                        variant="standard"
                                        value={search.product_name == null ? '' : search.product_name || ''}
                                        onChange={handleChange('product_name')}
                                        onKeyUp={handleKeyUp}
                                        sx={{m: 1}}
                                    />
                                    <Stack justifyContent={"center"} sx={{mt: 2, ml: 2}}>
                                        <FormLabel component="legend">{t("label_linkedStatus")}</FormLabel>
                                    </Stack>
                                    <Select
                                      size={"small"}
                                      sx={{mt: 2, ml: 2, minWidth: 110}}
                                      value={getStatus('sortType')}
                                      onChange={e => {
                                          changeStatus('sortType', e.target.value)
                                      }}
                                    >
                                        <MenuItem value={'ALL'}>{t("label_all")}</MenuItem>
                                        {renderTypes('CAFE24_SORT_TYPE')}
                                    </Select>
                                    <Stack justifyContent={"center"} sx={{mt: 2, ml: 2}}>
                                        <FormLabel component="legend">{t("label_displayStatus")}</FormLabel>
                                    </Stack>
                                    <Select
                                        size={"small"}
                                        sx={{mt: 2, ml: 2, minWidth: 110}}
                                        value={getStatus('display')}
                                        onChange={e => {
                                            changeStatus('display', e.target.value)
                                        }}
                                    >
                                        <MenuItem value={'ALL'}>{t("label_all")}</MenuItem>
                                        {renderTypes('CAFE24_DISPLAY')}
                                    </Select>
                                    <Stack justifyContent={"center"}
                                           sx={{mt: 2, ml: 2,}}>
                                        <FormLabel component="legend">{t("label_sellingStatus")}</FormLabel>
                                    </Stack>
                                    <Select
                                        size={"small"}
                                        sx={{mt: 2, ml: 2, minWidth: 110}}
                                        value={getStatus('selling')}
                                        onChange={e => {
                                            changeStatus('selling', e.target.value)
                                        }}
                                    >
                                        <MenuItem value={'ALL'}>{t("label_all")}</MenuItem>
                                        {renderTypes('CAFE24_SELLING')}
                                    </Select>
                                </Stack>
                                <Stack direction="row"
                                       sx={{m: 1}}
                                       justifyContent={"flex-end"}>
                                    <Button size='small'
                                            variant="outlined"
                                            sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                            onClick={handleClickReset}>
                                        {t("button_clickClear")}
                                    </Button>
                                    <Button size='small'
                                            color="primary"
                                            variant="contained"
                                            sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                            startIcon={<SearchIcon/>}
                                            onClick={handleClickSearch}>
                                        {t("button_search")}
                                    </Button>
                                </Stack>
                            </Card>
                            <Card sx={{border: 2, width: '100%', height: 200}}>
                                <Scrollbar style={{height: '100%'}}>
                                    <Table sx={{maxWidth: '100%', minWidth: 1650}}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox" width="2%">
                                                    <Checkbox
                                                        checked={selectedAllLists || selectedLists.length == 50}
                                                        onChange={handleSelectAllLists}
                                                    />
                                                </TableCell>
                                                <TableCell align="center" width="6%">
                                                    {t("label_image")}
                                                </TableCell>
                                                <TableCell align="center" width="15%">
                                                    {t("label_nameKo")}
                                                </TableCell>
                                                <TableCell align="center" width="10%">
                                                    {t("label_category")}
                                                </TableCell>
                                                <TableCell align="center" width="12%">
                                                    {t("label_color")}
                                                </TableCell>
                                                <TableCell align="center" width="10%">
                                                    {t("label_pattern")}
                                                </TableCell>
                                                <TableCell align="center" width="8%">
                                                    {t("label_season")}
                                                </TableCell>
                                                <TableCell align="center" width="8%">
                                                    {t("label_price")}
                                                </TableCell>
                                                <TableCell align="center" width="10%">
                                                    {t("label_displayStatus")}
                                                </TableCell>
                                                <TableCell align="center" width="10%">
                                                    {t("label_sellingStatus")}
                                                </TableCell>
                                                <TableCell align="center" width="7%">
                                                    {t("label_soldOutStatus")}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                            {product?.length > 0 ?
                                              <TableBody>
                                                  {product.map((item, idx) => {
                                                      const isListSelected = selectedLists.includes(item.product_no);
                                                      return (
                                                        <Fragment key={item.product_no}>
                                                            <TableRow
                                                              key={item.product_no}
                                                            >
                                                                <TableCell
                                                                  padding="checkbox"
                                                                  width="25%"
                                                                >
                                                                    <Checkbox
                                                                      checked={isListSelected}
                                                                      onChange={() => {
                                                                          handleSelectOneList(item.product_no)
                                                                          setSelectedItem(idx)
                                                                          selectedItemNum = idx
                                                                      }}
                                                                      value={isListSelected}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <ImagePreviewWidget imageUrl={item.list_image}/>
                                                                </TableCell>
                                                                <TableCell align="left">
                                                                    {item.product_name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {item.category?.length > 0 ? switchGenderCategories(item) : '-'}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {selectedIdx?.includes(idx) ? <></> :
                                                                        <Button
                                                                            ref={buttonRef}
                                                                            variant="contained"
                                                                            onClick={() => {
                                                                                setGetColor(true);
                                                                                setReady(true);
                                                                                setSelectedIdx((prv) => [...prv, idx])
                                                                                setIdx(idx)
                                                                                getProductColorOptions(item.product_no, idx)
                                                                            }}
                                                                        >컬러 옵션 가져오기</Button>}
                                                                    {ready && selectedIdx.includes(idx) ? getOptionColors(item.product_no, item.product_code, idx) : <></>}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {savePatternType(idx, item.product_no)}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {item.seasonTypes}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {Math.floor(Number(item.price)).toLocaleString()}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {dataContext.CAFE24_DISPLAY[item.display]}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {dataContext.CAFE24_SELLING[item.selling]}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {dataContext.CAFE24_SOLD_OUT[item.sold_out]}
                                                                </TableCell>
                                                            </TableRow>
                                                        </Fragment>
                                                      );
                                                  })}
                                              </TableBody>
                                              : <></>}

                                    </Table>
                                </Scrollbar>
                                {!loading && <>
                                    <Stack sx={{position: 'absolute', top: 400, left: '50%'}}>해당 자료를 로딩 중입니다.</Stack>
                                </>}
                                        {loading && product?.length == 0 ? <Stack sx={{position: 'absolute', top: 400, left: '45%'}}>해당 카테고리에 미연동된 상품이
                                            없습니다</Stack> : <></>}
                            </Card>
                            <TablePagination
                                component="div"
                                count={count}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[50, 70, 100]}
                                showFirstButton
                                showLastButton
                            />
                            <PatternDialog
                              keepMounted
                              open={patternOpen}
                              onClose={handlePatternClose}
                              items={dataContext.PATTERN}
                            />
                            <Stack sx={{ml: 3, mt: 4}}>
                            <Stack direction={'row'} sx={{display:'flex', alignItems: 'center', mb:2,}}>
                                <FormLabel component="legend"
                                           sx={{mr: 2, width: 200}}>{t("label_stylebot_category")}</FormLabel>
                                <Stack sx={{mr: 2, width: 200}}>
                                    <Input
                                        type='text'
                                        value={gender == 'F' ? getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', stylebotCategory[stylebotCategory.length - 1], 'path') : getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', stylebotCategory[stylebotCategory.length - 1], 'path') || ''}
                                        readOnly={true}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{p: 0}}
                                                onClick={() => handleClickClear('categoryType')}
                                              >
                                                  <ClearIcon/>
                                              </IconButton>
                                              <IconButton
                                                sx={{p: 0}}
                                                onClick={handleCategoryOpen}
                                              >
                                                  <SearchIcon/>
                                              </IconButton>
                                          </InputAdornment>
                                      }
                                    />
                                </Stack>
                                <CategoryDialog
                                    open={categoryOpen}
                                    onClose={handleCategoryClose}
                                    category={gender == 'F' ? dataContext.FEMALE_CATEGORY : dataContext.MALE_CATEGORY}
                                    value={stylebotCategory}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={saveCategory}
                                    sx={{mr: 2, width: 140}}>{t("label_stylebot_category_save")}</Button>
                                <Button
                                    color='info'
                                    variant="contained"
                                    startIcon={<DownloadIcon/>}
                                    onClick={downloadGuide}
                                    sx={{mr: 2}}>{t("label_stylebot_category_download")}</Button>
                            </Stack>
                                <Stack direction={'row'} sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <FormLabel component="legend"
                                               sx={{mr: 2, width: 200}}>{t("label_stylebot_season")}</FormLabel>
                                    <Stack sx={{mr: 0}}>
                                        <Stack direction="row"
                                               justifyContent={"space-between"}>
                                            <FormControlLabel
                                                value={'SPRING'}
                                                control={<Checkbox
                                                    onChange={e => {
                                                        changeSeasonHandler(e.target.defaultValue, e.target.checked)
                                                    }}
                                                    checked={checkedSeason('SPRING')}
                                                />}
                                          label="봄"/>
                                        <FormControlLabel
                                          value={'SUMMER'}
                                          control={<Checkbox
                                            onChange={e => {
                                                changeSeasonHandler(e.target.defaultValue, e.target.checked)
                                            }}
                                            checked={checkedSeason('SUMMER')}
                                          />}
                                          label="여름"/>
                                        <FormControlLabel
                                          value={'FALL'}
                                          control={<Checkbox
                                            onChange={e => {
                                                changeSeasonHandler(e.target.defaultValue, e.target.checked)
                                            }}
                                            checked={checkedSeason('FALL')}
                                          />}
                                          label="가을"/>
                                        <FormControlLabel
                                          value={'WINTER'}
                                          control={<Checkbox
                                            onChange={e => {
                                                changeSeasonHandler(e.target.defaultValue, e.target.checked)
                                            }}
                                            checked={checkedSeason('WINTER')}
                                          />}
                                          label="겨울"/>
                                    </Stack>
                                </Stack>
                                <Button
                                  variant="outlined"
                                  sx={{mr: 2, width: 120, ml: -0.5}}
                                  onClick={saveSeason}
                                >{t("label_stylebot_season_save")}</Button>
                            </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>

            </Stack>
        </>
    )
};