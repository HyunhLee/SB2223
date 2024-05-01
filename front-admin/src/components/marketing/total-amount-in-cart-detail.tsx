import React, {ChangeEvent, MouseEvent, useCallback, useContext, useEffect, useState} from 'react';
import {Box, Button, FormLabel, Grid, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import _ from "lodash";
import {DataContext} from "../../contexts/data-context";
import CartList from "./cart-list";
import {
  AmountFittingRoomCartModel,
  defaultFittingRoomCartSearchModel,
  FittingRoomCartSearchModel,
} from "../../types/marketing-model/marketing-fittingroom";
import {SearchProduct} from "../../types/b2b-partner-model/btb-product-model";
import {marketingApi} from "../../api/marketing-api";
import {brandApi} from "../../api/brand-api";
import DownloadIcon from '@mui/icons-material/Download';
import moment from "moment/moment";
import * as XLSX from "xlsx";
import {toast} from "react-hot-toast";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import SearchIcon from "@mui/icons-material/Search";


const TotalAmountInCartDetail = (props) => {
  const dataContext = useContext(DataContext);
  const { searchData } = props;

  const [search, setSearch] = useState<FittingRoomCartSearchModel>(searchData ? searchData : defaultFittingRoomCartSearchModel);
  const [items, setItems] = useState<AmountFittingRoomCartModel[]>([]);
  const [itemsCount, setItemsCount] = useState<number>(0);
  const [requestList, setRequestList] = useState<boolean>(false);
  const [brand, setBrand] = useState([]);
  const [download, setDownload] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('F');

  useEffect(() => {
    if(searchData.mallId != null) {
      brandApi.getMallBrands(search.mallId).then(res => {
        setBrand(res.data);
        setSearch({...search, brandId: res.data[0].id});
      });
      if(searchData.brandId) {
        if(dataContext.B2B_MALE_MALL_BRANDS.filter(v => {
          return v.id == searchData.brandId;
        }).length > 0) {
          setGender('M');
        } else if(dataContext.B2B_FEMALE_MALL_BRANDS.filter(v => {
          return v.id == searchData.brandId;
        }).length > 0) {
          setGender('F');
        }
      }
      setRequestList(true);
    }
  }, [searchData])

  useEffect(() => {
    (async () => {
        if(requestList && searchData.mallId != null){
          await getAmountData();
          setRequestList(false);
        }else if(requestList){
          await getAmountData();
          setRequestList(false);
        }
    })()
  },[requestList])


  const getAmountData = async () =>{
    if(search.startDate == null && search.endDate == null && search.mallId == null) {
      toast.error('기간과 몰을 입력해주세요');
      return;
    }else if(search.startDate == null || search.endDate == null){
      toast.error('검색할 기간을 입력해주세요');
      return;
    }else if(search.mallId == null) {
      toast.error('몰을 입력해주세요');
      return;
    }
    const result = await marketingApi.getCartAmountData(search);
    setItemsCount(result.count)
    setItems(result.lists)
    setDownload(true);
  }
  const handleChange = (prop: keyof FittingRoomCartSearchModel)=> (event: ChangeEvent<HTMLInputElement>) => {
    if (prop == 'productId' || prop == 'minPrice' || prop == 'maxPrice' || prop == 'productNo') {
      setSearch({...search, [prop]: Number(event.target.value)});
    } else if(prop == 'mallId') {
      brandApi.getMallBrands(event.target.value).then(res => {
        setBrand(res.data);
        setSearch({...search, [prop]: Number(event.target.value), brandId: res.data[0].id})
      });
      if(dataContext.B2B_MALE_MALL_BRANDS.filter(v => {
        return v.mallId == Number(event.target.value);
      }).length > 0) {
        setGender('M');
      } else if(dataContext.B2B_FEMALE_MALL_BRANDS.filter(v => {
        return v.mallId == Number(event.target.value);
      }).length > 0) {
        setGender('F');
      }
    } else {
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
    setSearch({
      ...search,
      page: 0,
    });
    setRequestList(true);
  }
  const handleClickReset = () => {
    setSearch(defaultFittingRoomCartSearchModel)
  }

  const getCategory = (value) => {
    const result = dataContext.CATEGORY_GROUP.find((item) => item.groupId === value)
    return result.groupName
  }

  const excelDownload = useCallback(async () => {
    if(itemsCount > 200) {
      window.confirm('다운로드는 최대 200건 까지만 가능합니다.')
      return;
    }
    let test = [];
    await marketingApi.getCartAmountData({...search, size: itemsCount}
    ).then(res => {
      res.lists.forEach((res) => {
        return test.push({
          thumbnailImageUrl: res.product.thumbnailImageUrl,
          id: res.product.id,
          productNo: res.product.productNo,
          nameKo: res.product.nameKo,
          brandName: res.product.brand.name,
          category: getCategory(res.product.closetCategoryId),
          priceNormal: res.product.priceNormal,
          containCounts: res.containCounts
        })
      });
    });

    const excelHandler = {
      getExcelFileName:() => {
        return "피팅룸_기여_장바구니_총액_"+ moment().format('YYYYMMDD')+'.xlsx';
      },

      getSheetName: () => {
        return '장바구니_총액'
      },

      getExcelData: () =>{
        return test;
      },

      getWorksheet: () => {
        return XLSX.utils.json_to_sheet(excelHandler.getExcelData())
      }
    };

    const datas = excelHandler.getWorksheet();
    ['이미지', '상품ID', '상품번호', '상품명', '브랜드','카테고리', '가격', '담은수'].forEach((x, idx) => {
      const cellAdd = XLSX.utils.encode_cell({c:idx, r:0});
      datas[cellAdd].v = x;
    })
    datas['!cols'] = [];
    datas['!cols'][9] = { hidden: true };
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, datas, excelHandler.getSheetName());
    XLSX.writeFile(workbook, excelHandler.getExcelFileName());
    setDownload(false);
  }, [items, itemsCount]);

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

  const helpText = `[데이터 조회 및 다운로드시, 기간 및 개수 제한]\n\n기간 : 최대 1년\n데이터 다운로드 개수 : 최대 200개\n`;
  return (
      <Box sx={{p: 1}}>
        <Stack direction="row">
          <Stack direction="row"
justifyContent={"center"}
sx={{mr: 1, ml: 1, mt:2.1}}>
            <FormLabel
              component="legend">기간*</FormLabel>
            <CustomWidthTooltip title={helpText}
sx={{whiteSpace: 'pre-wrap', mt:0.5}}
placement="bottom"
arrow>
              <IconButton sx={{height: 20}}>
                <HelpIcon color="primary"
fontSize="small"/>
              </IconButton>
            </CustomWidthTooltip>
          </Stack>
          <Stack justifyContent={"center"}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                inputFormat="yyyy-MM-dd"
                value={search.startDate ? search.startDate: null}
                onChange={handleSearchDate('startDate')}
                renderInput={(params) => <TextField {...params}
                                                    variant="standard"
                                                    sx={{width: 150}}/>}
              />
            </LocalizationProvider>
          </Stack>
          <Stack sx={{mr: 2, ml: 2, mt: 2}}>
            ~
          </Stack>
          <Stack justifyContent={"center"}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                inputFormat="yyyy-MM-dd"
                value={search.endDate ? search.endDate: null}
                onChange={handleSearchDate('endDate')}
                renderInput={(params) => <TextField {...params}
                                                    variant="standard"
                                                    sx={{width: 150}}/>}
              />
            </LocalizationProvider>
          </Stack>
          <Stack direction='row'>
            <Stack justifyContent={"center"}
                   sx={{m: 2, ml: 2}}>
              <FormLabel
                  component="legend">몰*</FormLabel>
            </Stack>
            <Select
                sx={{m: 1}}
                size={"small"}
                value={search.mallId ? search.mallId : ''}
                onChange={handleChange('mallId')}
            >
              {_.sortBy(dataContext.MALL, 'name').map((mall) => {
                return (
                    <MenuItem key={mall.mall.id}
                              value={mall.mall.id}>{mall.mall.name}</MenuItem>
                )
              })}
            </Select>
            <Stack justifyContent={"center"}
                   sx={{mr: 1, ml: 2}}>
              <FormLabel
                component="legend">브랜드*</FormLabel>
            </Stack>
            <Select
              sx={{ m: 1, ml: 2}}
              size={"small"}
              value={search.brandId ? search.brandId : ''}
              onChange={handleChange('brandId')}
            >
              {brand.map((brand) => {
                return (
                  <MenuItem key={brand.id}
                            value={brand.id}>{brand.nameKo}</MenuItem>
                )
              })}
            </Select>
          </Stack>
        </Stack>
        <Stack direction="row"
sx={{mb: 2}}>
          <Stack direction="row">
            <Stack justifyContent={"center"}>
              <TextField
                  value={search.productId || ''}
                  sx={{ml: 1, mr: 1, width: 150}}
                  label={'상품ID'}
                  variant="standard"
                  onChange={handleChange('productId')}/>
            </Stack>
            <Stack justifyContent={"center"}>
              <TextField
                value={search.productNo || ''}
                sx={{ml: 1, mr: 1, width: 150}}
                label={'상품번호'}
                variant="standard"
                onChange={handleChange('productNo')}/>
            </Stack>
            <Stack justifyContent={"center"}>
              <TextField
                  value={search.productName || ''}
                  sx={{ml: 1, mr: 1, width: 180}}
                  label={'상품명'}
                  variant="standard"
                  onChange={handleChange('productName')}/>
            </Stack>
          </Stack>
          <Stack direction='row'>
            <Stack justifyContent={"center"}
                   sx={{mr: 1, ml: 2, mt: 2}}>
              <FormLabel
                component="legend">카테고리</FormLabel>
            </Stack>
            <Select
              sx={{height:40, mt: 3.5, ml: 2}}
              size={"small"}
              value={search.categoryId ? search.categoryId : ''}
              onChange={handleChange('categoryId')}
            >
              <MenuItem value={''}>전체</MenuItem>
              {_.sortBy(dataContext.CATEGORY_GROUP, 'groupId').map((cate) => {
                return gender == 'F' ?
                    cate.groupId < 1010 && (
                        <MenuItem key={cate.groupId}
                                  value={cate.groupId}>{cate.groupName}</MenuItem>
                    )
                    :
                    cate.groupId > 1009 && (
                        <MenuItem key={cate.groupId}
                                  value={cate.groupId}>{cate.groupName}</MenuItem>
                    )
              })}
            </Select>
          </Stack>
          <Stack sx={{mr: 2, ml: 4, mt: 3.5,}}>
            <FormLabel sx={{mt:1}}
              component="legend">판매가</FormLabel>
          </Stack>
          <Stack direction={'row'}
sx={{mt:1.5}}>
            <TextField
              id="outlined-size-small"
              value={search.minPrice || null}
              size="small"
              sx={{m: 1, width: 110, mt: 2}}
              label='최저가격'
              placeholder='숫자만 기입해주세요.'
              onChange={handleChange('minPrice')}/>
            <Stack sx={{mt:2.5}}>~</Stack>
            <TextField
              id="outlined-size-small"
              value={search.maxPrice || null}
              size="small"
              sx={{m: 1, width: 110, mt: 2}}
              label='최고가격'
              placeholder='숫자만 기입해주세요.'
              onChange={handleChange('maxPrice')}/>
          </Stack>
        </Stack>
        <Stack direction="row"
               justifyContent='flex-end'
               sx={{mt: 1}}>
          <Button size='small'
                  variant="outlined"
                  sx={{mr: 1}}
                  onClick={handleClickReset}>
            초기화
          </Button>
          <Button size='small'
                  color="primary"
                  variant="contained"
                  sx={{mr: 1}}
                  startIcon={<SearchIcon/>}
                  onClick={handleClickSearch}>
            검색
          </Button>
        </Stack>
          <Stack sx={{mt: 2, display:'flex', justifyContent: 'flex-end', alignItems: 'end'}}>
            <Button sx={{mr: 1, width: 150, }}
                    color="primary"
                    variant="contained"
                    startIcon={<DownloadIcon/>}
                    size="small"
                    disabled={!download}
                    onClick={excelDownload}
            >
              엑셀 다운로드
            </Button>
          </Stack>
        <Box>
          <Grid sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, ml: 1, mr: 1}}>
            <Typography variant="h6">총 {itemsCount} 건</Typography>
            <Box>
              <Stack direction='row'>
                <Select
                 sx={{width: 150 }}
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