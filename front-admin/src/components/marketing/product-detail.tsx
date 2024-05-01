import {Box, Button, FormLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import React, {ChangeEvent, MouseEvent, useCallback, useContext, useEffect, useState} from "react";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {ProductDetailList} from "./product-detail-list";
import {marketingApi} from "../../api/marketing-api";
import {defaultSearchProduct, ProductModel, SearchProduct} from "../../types/marketing-model/marketing-product-model";
import {toast} from "react-hot-toast";
import _ from "lodash";
import {DataContext} from "../../contexts/data-context";
import {brandApi} from "../../api/brand-api";
import DownloadIcon from "@mui/icons-material/Download";
import moment from "moment";
import * as XLSX from "xlsx";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";
import SearchIcon from "@mui/icons-material/Search";


const ProductDetail = (props) => {
    const {open, startDate, endDate, mallId, brandId} = props;

    const dataContext = useContext(DataContext);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [lists, setLists] = useState<ProductModel[]>([]);
    const [count, setCount] = useState<number>(0);
    const [brand, setBrand] = useState([]);
    const [download, setDownload] = useState<boolean>(false);
    const [gender, setGender] = useState<string>('F');

    const [search, setSearch] = useState<SearchProduct>(defaultSearchProduct);

    const [requestList, setRequestList] = useState<boolean>(false);

    const handleChange =
        (prop: keyof SearchProduct) => (event: ChangeEvent<HTMLInputElement>) => {
            if (prop == 'productId' || prop == 'productNo') {
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

    const handleChangeDate =
        (prop: keyof SearchProduct) => (value) => {
            setSearch({...search, [prop]: value});
        };

    useEffect(() => {
        if(open && startDate != null && endDate != null && mallId != null && brandId != null) {
            setSearch({
                ...search,
                startDate: startDate,
                endDate: endDate,
                mallId: mallId,
                brandId: brandId
            })
            if (mallId) {
                brandApi.getMallBrands(mallId).then(res => {
                    setBrand(res.data);
                });
            }
            setRequestList(true);
        }
        if(brandId) {
            if(dataContext.B2B_MALE_MALL_BRANDS.filter(v => {
                return v.id == brandId;
            }).length > 0) {
                setGender('M');
            } else if(dataContext.B2B_FEMALE_MALL_BRANDS.filter(v => {
                return v.id == brandId;
            }).length > 0) {
                setGender('F');
            }
        }
    }, [open])

    useEffect(() => {
        if (requestList && open) {
            getProduct();
        }
    }, [requestList, search.sort, open])

    const getProduct = async () => {
        const query = {
            ...search,
            size: size,
            page: page
        }
        await marketingApi.getProduct(query).then(res => {
            setLists(res.lists);
            setCount(res.count);
            setRequestList(false);
            setDownload(true);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleReset = () => {
            setSearch({
                id: null,
                mallId: null,
                productId: null,
                productNo: null,
                brandId: null,
                clicks: null,
                name: "",
                image: "",
                categoryId: null,
                activated: null,
                startDate: null,
                endDate: null,
                sort: 'desc',
                page: 0,
                size: 10
            })
    }

    const handleClickSearch = () => {
        if(search.startDate == null && search.endDate == null && search.mallId == null && !search.brandId) {
            toast.error('기간, 몰과 브랜드를 입력해주세요');
            return;
        }else if(!search.startDate || !search.endDate){
            toast.error('기간을 입력해주세요.')
            return;
        } else if (!search.mallId) {
            toast.error('몰을 입력해주세요.')
            return;
        }else if(!search.brandId){
            toast.error('브랜드를 입력해주세요.')
            return;
        }else{
            setPage(0);
            setRequestList(true);
        }
    }

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setSearch({...search, page: newPage})
        setPage(newPage);
        setRequestList(true);
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSearch({...search, size: Number(event.target.value)});
        setSize(parseInt(event.target.value, 10));
        setRequestList(true);
    };

    const getBrand = () => {
        return search.brandId ? search.brandId : '';
    }

    const getCategory = () => {
        return search.categoryId ? search.categoryId : '';
    }

    const excelDownload = useCallback(async () => {
        if(count > 200) {
            window.confirm('다운로드는 최대 200건 까지만 가능합니다.')
            return;
        }
        let test = [];
        const result = await marketingApi.getProduct({...search, size: count});
        result.lists.forEach((res) => {
            return test.push({
                thumbnailImageUrl: res.thumbnailImageUrl,
                id: res.productId,
                productNo : res.productNo,
                nameKo: res.productNameKo,
                brandName: res.brandName,
                category: res.categories.join('/'),
                clickCount: res.clickCount
            })
        });

        const excelHandler = {
            getExcelFileName:() => {
                return "상품_클릭_수_"+ moment().format('YYYYMMDD')+'.xlsx';
            },

            getSheetName: () => {
                return '클릭_수'
            },

            getExcelData: () =>{
                return test;
            },

            getWorksheet: () => {
                return XLSX.utils.json_to_sheet(excelHandler.getExcelData())
            }
        };

        const datas = excelHandler.getWorksheet();
        ['상품 이미지', '상품ID', '상품번호','상품명', '브랜드', '카테고리', '클릭수'].forEach((x, idx) => {
            const cellAdd = XLSX.utils.encode_cell({c:idx, r:0});
            datas[cellAdd].v = x;
        })
        datas['!cols'] = [];
        datas['!cols'][9] = { hidden: true };
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, datas, excelHandler.getSheetName());
        XLSX.writeFile(workbook, excelHandler.getExcelFileName());
        setDownload(false);
    }, [lists, count]);

    const helpText = `[데이터 조회 및 다운로드시, 기간 및 개수 제한]\n\n기간 : 최대 1년\n데이터 다운로드 개수 : 최대 200개\n`;
    return (
        <Box sx={{p: 1}}>
            <Stack direction="row">
                <Stack direction="row"
justifyContent={"center"}
                       sx={{mr: 1, ml: 1, mt:2.5, height: 20}}>
                    <FormLabel component="legend">기간*</FormLabel>
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
                            value={search.startDate ? search.startDate : null}
                            inputFormat={"yyyy-MM-dd"}
                            mask={"____-__-__"}
                            onChange={handleChangeDate('startDate')}
                            renderInput={(params) => <TextField {...params}
                                                                variant="standard"
                                                                sx={{width: 150}}/>}
                        />
                    </LocalizationProvider>
                </Stack>
                <Stack justifyContent={"center"}
                       sx={{mr: 1, ml: 1}}>
                    ~
                </Stack>
                <Stack justifyContent={"center"}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                            value={search.endDate ? search.endDate : null}
                            inputFormat={"yyyy-MM-dd"}
                            mask={"____-__-__"}
                            onChange={handleChangeDate('endDate')}
                            renderInput={(params) => <TextField {...params}
                                                                variant="standard"
                                                                sx={{width: 150}}/>}
                        />
                    </LocalizationProvider>
                </Stack>
                <Stack justifyContent={"center"}
                       sx={{m: 1, ml: 2}}>
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
sx={{m: 1}}>
                    <FormLabel
                        component="legend">브랜드*</FormLabel>
                </Stack>
                <Select
                    size={"small"}
                    sx={{m: 1, ml: 2}}
                    value={getBrand()}
                    onChange={e => {
                        setSearch({...search, brandId: Number(e.target.value)})
                    }}
                >
                    {brand.map((brand) => {
                        return (
                            <MenuItem key={brand.id}
                                      value={brand.id}>{brand.nameKo}</MenuItem>
                        )
                    })}
                </Select>
                <Stack justifyContent={"center"}
sx={{m: 1}}>
                    <FormLabel
                        component="legend">카테고리</FormLabel>
                </Stack>
                <Select
                    size={"small"}
                    sx={{m: 1}}
                    value={getCategory()}
                    onChange={e => {
                        setSearch({...search, categoryId: Number(e.target.value)})
                    }}
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
            <Stack direction="row">
                <Stack justifyContent={"center"}>
                    <TextField
                      label={'상품ID'}
                      variant="standard"
                      value={search.productId ? search.productId : ''}
                      onChange={handleChange('productId')}
                      sx={{m: 1}}
                    />
                </Stack>
                <Stack justifyContent={"center"}>
                    <TextField
                      label={'상품번호'}
                      variant="standard"
                      value={search.productNo ? search.productNo : ''}
                      onChange={handleChange('productNo')}
                      sx={{m: 1}}
                    />
                </Stack>
                <Stack justifyContent={"center"}>
                    <TextField
                      label={'상품명'}
                      variant="standard"
                      value={search.name ? search.name : ''}
                      onChange={handleChange('name')}
                      sx={{m: 1}}
                    />
                </Stack>
            </Stack>
            <Stack direction="row"
                   justifyContent={"flex-end"}
                   sx={{mb: 1}}>
                <Button size='small'
                        variant="outlined"
                        sx={{mr: 1}}
                        onClick={handleReset}>
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
            <Box sx={{display: 'flex', direction: 'row'}}>
                <Box sx={{flexGrow: 1}}>
                    <ProductDetailList
                        lists={lists}
                        count={count}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPage={size}
                        page={page}
                        search={search}
                        setSearch={setSearch}
                        setRequestList={setRequestList}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default ProductDetail;