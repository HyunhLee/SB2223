import React, {ChangeEvent, useContext, useState, useEffect, MouseEvent, useCallback} from 'react';
import {
  Stack,
  Box,
  Button,
  FormLabel, Select, MenuItem, TextField, Grid, Typography
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import DownloadIcon from '@mui/icons-material/Download';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {DataContext} from "../../contexts/data-context";
import CartList from "./cart-list";
import {
  FittingRoomCartSearchModel,
  defaultFittingRoomCartSearchModel, AmountFittingRoomCartModel,
} from "../../types/marketing-fittingroom";
import {SearchProduct} from "../../types/btb-product-model";
import {marketingApi} from "../../api/marketing-api";
import moment from "moment";
import * as XLSX from "xlsx"
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";
import SearchIcon from "@mui/icons-material/Search";


const TotalAmountInCartDetail = (props) => {
  const {t} = useTranslation();
  const dataContext = useContext(DataContext);
  const { searchData } = props;
  const [search, setSearch] = useState<FittingRoomCartSearchModel>(searchData ? searchData : defaultFittingRoomCartSearchModel);
  const [priceValues, setPriceValues] = useState<number[]>([1000, 3000000]);
  const [items, setItems] = useState<AmountFittingRoomCartModel[]>([]);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [requestList, setRequestList] = useState<boolean>(false);
  const [download, setDownload] = useState<boolean>(false);
  let dataList = [];

  const gender = localStorage.getItem('mallGender');
  let femaleGroupCate
  let maleGroupCate;

  const [groupCate, setGroupCate] = useState([])

  const handleGroupCategories = () => {
    femaleGroupCate = _.sortBy(dataContext.CATEGORY_GROUP, 'groupId').filter((v) => v.groupId < 1010);
    maleGroupCate = _.sortBy(dataContext.CATEGORY_GROUP, 'groupId').filter((v) => v.groupId > 1009);
    if(gender == 'F'){
      setGroupCate(femaleGroupCate)
    }else{
      setGroupCate(maleGroupCate)
    }
  }

  const renderDate = ({inputRef, inputProps, InputProps}) => (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <input ref={inputRef}
             {...inputProps}
             readOnly={true}
             style={{
               paddingLeft: 5,
                 paddingRight: 5,
                 height: 40,
                 fontSize: 15,
                 border: 1,
                 outline: 'none'
             }}/>
        {InputProps?.endAdornment}
    </Box>
  )

    useEffect(() => {
      handleGroupCategories();
        if (searchData) {
            setRequestList(true);
        }
    }, [searchData])

    useEffect(() => {
        (async () => {
            if (requestList) {
                await getAmountData();
                setRequestList(false);
            }
        })()
    }, [requestList])


  const getAmountData = async () =>{
    if(!search.startDate && !search.endDate && !search.brandId) {
      window.confirm(`${t("components_marketing_totalPurchaseInCartDetail_getAmountData_both")}`);
      return;
    }else if(!search.startDate || !search.endDate ){
      window.confirm(`${t("components_marketing_totalPurchaseInCartDetail_getAmountData_date")}`);
      return;
    }else if(!search.brandId ){
      window.confirm(`${t("components_marketing_totalPurchaseInCartDetail_getAmountData_brand")}`);
      return;
    }
    const result = await marketingApi.getCartAmountData(search);
    // @ts-ignore
    setItemsCount(result.count)
    // @ts-ignore
      setItems(result.lists)
      setDownload(true);
  }
  const handleChange = (prop: keyof FittingRoomCartSearchModel)=> (event: ChangeEvent<HTMLInputElement>) => {
      if (prop == 'productNo' || prop == 'minPrice' || prop == 'maxPrice') {
          setSearch({...search, [prop]: Number(event.target.value)});
      }else{
          setSearch({...search, [prop]: event.target.value});
      }
  };

  const handleSearchDate =
    (prop: keyof SearchProduct) => (value) => {
      setSearch({...search, [prop]: value});
    };

  const handleSort = () =>{
    return Object.keys(dataContext['SORT_LIST']).map((sort, index) => {
      return (
        <MenuItem key={index}
                  value={sort}>{dataContext['SORT_LIST'][sort]}</MenuItem>
      )
    })
  }

  const handleChangeSort = (value) =>{
    setSearch({...search, sort: value})
    setRequestList(true)
  }
  const valueText = (v) => {
    return `${v}`
  }

  const handleClickSearch = () => {
    setRequestList(true);
    handlePageChange(null, 0)
  }
  const handleClickReset = () => {
    setSearch(defaultFittingRoomCartSearchModel)
    setPriceValues([0, 0]);
  }

  //pagination
  const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
    setSearch({
      ...search,
      page: newPage,
    });
    setRequestList(true);
  };

  const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    setSearch({
      ...search,
      size: parseInt(event.target.value, 10),
    });
    setRequestList(true);
  };

  const getCategory = (value) => {
    const result = dataContext.CATEGORY_GROUP.find((item) => item.groupId === value)
    return result.groupName
  }

  const originalResultsExcelDownload = useCallback(async() => {
    if(itemsCount > 200){
      window.confirm(`${t('toast_error_download')}`)
      return
    }else {
      let img = '';
      const response = await marketingApi.getCartAmountData({...search, size: itemsCount});
      // @ts-ignore
      response?.lists.forEach((value) => {
        if(value.product.fitRefImageUrl !== ''){
          img = value.product.fitRefImageUrl
        }else{
          img =value.thumnailImage;
        }
        dataList.push({
          thumbnailImageUrl: img,
          productId: value.product.productNo,
          product: value.product.nameKo,
          brand: value.product.brand.name,
          category: getCategory(value.product.closetCategoryId),
          priceNormal: value.product.priceNormal,
          containCount: value.containCounts,
        })
      })

      const excelHandler = {
        getExcelFileName: () => {
          return "피팅룸 기여 장바구니 총액_" + moment().format('YYYYMMDD') + '.xlsx';
        },

        getSheetName: () => {
          return '피팅룸 기여 장바구니 총액'
        },

        getExcelData: () => {
          return dataList
        },

        getWorksheet: () => {
          return XLSX.utils.json_to_sheet(excelHandler.getExcelData())
        }
      };

      const datas = excelHandler.getWorksheet();
      ['이미지', '상품번호', '상품명', '브랜드', '카테고리', '판매가', '담은 수'].forEach((x, idx) => {
          const cellAdd = XLSX.utils.encode_cell({c: idx, r: 0});
          datas[cellAdd].v = x;
      })
        datas['!cols'] = [];
        datas['!cols'][9] = {hidden: true};
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, datas, excelHandler.getSheetName());
        XLSX.writeFile(workbook, excelHandler.getExcelFileName());
        setDownload(false);
    }
  }, [dataList, itemsCount]);



  const helpText = `[데이터 조회 및 다운로드시, 기간 및 개수 제한]\n\n기간 : 최대 1년\n데이터 다운로드 개수 : 최대 200개\n`;

  return (
      <Box sx={{p: 1}}>
          <Stack direction="row">
              <Stack direction="row" justifyContent={"center"} sx={{mr: 1, ml: 1, mt:3, height: 20}}>
                  <FormLabel
                      component="legend">{t('label_date')}*</FormLabel>
                <CustomWidthTooltip title={helpText} sx={{whiteSpace: 'pre-wrap', mt:0.5}} placement="bottom" arrow>
                  <IconButton>
                    <HelpIcon color="primary" fontSize="small"/>
                  </IconButton>
                </CustomWidthTooltip>
              </Stack>
              <Stack justifyContent={"center"}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                          maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                          minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                          inputFormat={"yyyy-MM-dd"}
                          mask={"____-__-__"}
                          value={search.startDate}
                          onChange={handleSearchDate('startDate')}
                          renderInput={(params) => <TextField {...params}
                                                              variant="standard"
                                                              sx={{width: 150}}/>}
                      />
                  </LocalizationProvider>
              </Stack>
              <Stack sx={{mr: 2, ml: 2, mt: 3.5}}>
                  ~
              </Stack>
              <Stack justifyContent={"center"}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                          maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                          minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                          inputFormat={"yyyy-MM-dd"}
                          mask={"____-__-__"}
                          value={search.endDate}
                          onChange={handleSearchDate('endDate')}
                          renderInput={(params) => <TextField {...params}
                                                              variant="standard"
                                                              sx={{width: 150}}/>}
                      />
                  </LocalizationProvider>
              </Stack>
              <Stack direction='row'>
                  <Stack justifyContent={"center"}
                         sx={{m: 2}}>
                      <FormLabel
                          component="legend">{t('label_brand')}*</FormLabel>
                  </Stack>
                  <Select
                      sx={{m: 2, ml: -1, minWidth: 120}}
                      size={"small"}
                      value={search.brandId ? search.brandId : ''}
                      onChange={handleChange('brandId')}
                  >
                      {_.sortBy(dataContext.MALL_BRAND, 'nameKo').map((brand) => {
                          return (
                              <MenuItem key={brand.id}
                                        value={brand.id}>{brand.nameKo}</MenuItem>
                          )
                      })}
                  </Select>
              </Stack>
          </Stack>
          <Stack direction="row"
                 sx={{mt: -1}}
          >
              <Stack direction="row" sx={{mt: -1}}>
                  <Stack justifyContent={"center"}>
                      <TextField
                          value={search.productNo || ''}
                          sx={{m: 1, width: 200}}
                          label={`${t('label_productNo')}`}
                          variant="standard"
                          onChange={handleChange('productNo')}/>
                  </Stack>
                  <Stack justifyContent={"center"}>
                      <TextField
                          value={search.productName || ''}
                          sx={{m: 1, width: 200}}
                          label={`${t('label_nameKo')}`}
                          variant="standard"
                          onChange={handleChange('productName')}/>
                  </Stack>
              </Stack>
              <Stack direction='row'>
                  <Stack justifyContent={"center"}
                         sx={{m: 2, ml: 2}}>
                      <FormLabel
                          component="legend">{t('label_category')}</FormLabel>
                  </Stack>
                  <Select
                      sx={{m: 2, ml: -1, minWidth: 120}}
                      size={"small"}
                      value={search.categoryId ? search.categoryId : ''}
                      onChange={handleChange('categoryId')}
                  >
                      <MenuItem value={''}>{t('label_all')}</MenuItem>
                      {groupCate.map((cate) => {
                          return (
                              <MenuItem key={cate.groupId}
                                        value={cate.groupId}>{cate.groupName}</MenuItem>
                          )
                      })}
                  </Select>
              </Stack>
              <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                  <FormLabel
                      component="legend">{t('label_price')}</FormLabel>
              </Stack>
            <Stack direction={'row'}>
              <TextField
                id="outlined-size-small"
                value={search.minPrice ? search.minPrice : ''}
                size="small"
                sx={{m: 1, width: 150, mt: 2}}
                label={`${t('label_minPrice')}`}
                placeholder={`${t('placeholder_only_number')}`}
                onChange={handleChange('minPrice')}/>
              <Stack sx={{mt:2.5}}>~</Stack>
              <TextField
                  id="outlined-size-small"
                  value={search.maxPrice ? search.maxPrice : ''}
                  size="small"
                  sx={{m: 1, width: 150, mt: 2}}
                  label={`${t('label_maxPrice')}`}
                  placeholder={`${t('placeholder_only_number')}`}
                  onChange={handleChange('maxPrice')}/>
            </Stack>
          </Stack>
          <Stack direction="row"
                 justifyContent='flex-end'
                 sx={{mt: 1, mr: 1}}>
              <Button size='small'
                      variant="outlined"
                      sx={{mr: 1}}
                      onClick={handleClickReset}
              >
                  {t('button_clickClear')}
              </Button>
              <Button size='small'
                      color="primary"
                      variant="contained"
                      startIcon={<SearchIcon/>}
                      onClick={handleClickSearch}
              >
                  {t('button_search')}
              </Button>
          </Stack>
          <Stack sx={{mt: 4, display:'flex', justifyContent: 'flex-end', alignItems: 'end'}}>
            <Button sx={{mr: 1, width: 150, }}
                    color="primary"
                    variant="contained"
                    startIcon={<DownloadIcon/>}
                    size="small"
                    disabled={!download}
                    onClick={originalResultsExcelDownload}
                    >
              {t('label_download')}
            </Button>
          </Stack>
          <Box>
              <Grid sx={{
                  m: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 1,
                  marginBottom: 2
              }}>
                  <Typography variant="h6">{t("label_total", {number: itemsCount})}</Typography>
                  <Box>
                      <Stack direction='row'>
                          <Select
                              sx={{width: 150,}}
                              size={'small'}
                              value={!search.sort ? 'Popular' : search.sort}
                              onChange={(e) => handleChangeSort(e.target.value)}
                >
                  {handleSort()}
                </Select>
              </Stack>
            </Box>
          </Grid>
        </Box>
        <CartList
        count={itemsCount}
        items ={items}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={search.size}
        page={search.page}
        />
    </Box>
  );
}

export default TotalAmountInCartDetail;