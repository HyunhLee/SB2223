import {
    Box,
    Button,
    FormLabel, MenuItem, Select,
    Stack,
    TextField
} from "@mui/material";
import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {ProductDetailList} from "./product-detail-list";
import {marketingApi} from "../../api/marketing-api";
import {ProductModel, SearchProduct, defaultSearchProduct} from "../../types/marketing-product-model";
import {useTranslation} from "react-i18next";
import {toast} from "react-hot-toast";
import _ from "lodash";
import {DataContext} from "../../contexts/data-context";
import moment from "moment";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";
import SearchIcon from "@mui/icons-material/Search";

const ProductDetail = (props) => {
    const {open, startDate, endDate, brandId, groupCate} = props;

    const {t} = useTranslation();
    const dataContext = useContext(DataContext);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [lists, setLists] = useState<ProductModel[]>([]);
    const [count, setCount] = useState<number>(0);
    const [download, setDownload] = useState<boolean>(false);

    const [search, setSearch] = useState<SearchProduct>(defaultSearchProduct);

    const [requestList, setRequestList] = useState<boolean>(false);

    let dataList = [];

    const handleChange =
        (prop: keyof SearchProduct) => (event: ChangeEvent<HTMLInputElement>) => {
            if (prop == 'productNo') {
                setSearch({...search, [prop]: Number(event.target.value)});
            } else {
                setSearch({...search, [prop]: event.target.value});
            }
        };

    const handleChangeDate =
        (prop: keyof SearchProduct) => (value) => {
            setSearch({...search, [prop]: value, page:0});
        };

    useEffect(() => {
        if (open) {
            setSearch({
                ...search,
                startDate: startDate,
                endDate: endDate,
                brandId: brandId
            })
            setRequestList(true);
        }
    }, [open])

    useEffect(() => {
        if (requestList && open) {
            getProduct();
        }
    }, [requestList, search.sort, open])

    const getProduct = async () => {
        await marketingApi.getProduct(search).then(res => {
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
                mallId: Number(localStorage.getItem('mallId')),
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
            });
    }

    const handleClickSearch = () => {
        if (!search.mallId) {
            toast.error(`${t("pages_marketingDashboard_marketingDashboard_search_error")}`)
            return;
        }
        if(!search.startDate && !search.endDate && !search.brandId) {
            window.confirm(`${t("components_marketing_totalPurchaseInCartDetail_getAmountData_both")}`);
            return;
        }else if(!search.startDate || !search.endDate ){
            window.confirm(`${t("components_marketing_totalPurchaseInCartDetail_getAmountData_date")}`);
            return;
        }else if(!search.brandId ){
            window.confirm(`${t("components_marketing_totalPurchaseInCartDetail_getAmountData_brand")}`);
            return;
        } else {
            setSearch({...search});
            setRequestList(true);
            handlePageChange(null, 0)
        }
    }

    const handlePageChange = async (event: Event, newPage: number): Promise<void> => {
        setSearch({...search, page: newPage})
        setPage(newPage);
        setRequestList(true);
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSearch({...search, size: Number(event.target.value)})
        setSize(parseInt(event.target.value, 10));
        setRequestList(true);
    };

    const getBrand = () => {
        return search.brandId ? search.brandId : '';
    }

    const getCategory = () => {
        return search.categoryId ? search.categoryId : '';
    }

    const originalResultsExcelDownload = useCallback(async() => {
        if(count > 200){
            window.confirm(`${t('toast_error_download')}`)
            return
        }else{
            let img = '';
            const response = await marketingApi.getProduct({...search, size: count});
            // @ts-ignore
            response?.lists.forEach((value) => {
                if(value.fitRefImageUrl !== ''){
                    img = value.fitRefImageUrl
                }else{
                    img =value.thumnailImage;
                }
                dataList.push({
                    thumbnailImageUrl : img,
                    productId: value.productNo,
                    product : value.productNameKo,
                    brand: value.brandName,
                    category: value.categories[0],
                    containCount: value.clickCount,
                })
            })

            const excelHandler = {
                getExcelFileName:() => {
                    return "상품 클릭 수_"+ moment().format('YYYYMMDD')+'.xlsx';
                },

                getSheetName: () => {
                    return '상품 클릭 수'
                },

                getExcelData: () =>{
                    return dataList
                },

                getWorksheet: () => {
                    return XLSX.utils.json_to_sheet(excelHandler.getExcelData())
                }
            };

            const datas = excelHandler.getWorksheet();
            ['상품 이미지', '상품번호', '상품명', '브랜드','카테고리', '클릭수'].forEach((x, idx) => {
                const cellAdd = XLSX.utils.encode_cell({c:idx, r:0});
                datas[cellAdd].v = x;
            })
            datas['!cols'] = [];
            datas['!cols'][9] = {hidden: true};
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, datas, excelHandler.getSheetName());
            XLSX.writeFile(workbook, excelHandler.getExcelFileName());
            setDownload(false);
        }

    }, [dataList, count]);



    const helpText = `[데이터 조회 및 다운로드시, 기간 및 개수 제한]\n\n기간 : 최대 1년\n데이터 다운로드 개수 : 최대 200개\n`;

    // @ts-ignore
    return (
        <Box sx={{p: 1}}>
            <Stack direction="row">
                <Stack  direction="row" justifyContent={"center"}
                        sx={{mr: 1, ml: 1, mt:2.5, height: 20}}>
                    <FormLabel component="legend">{t("label_date")}*</FormLabel>
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
                            value={search.startDate}
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
                            value={search.endDate}
                            inputFormat={"yyyy-MM-dd"}
                            mask={"____-__-__"}
                            onChange={handleChangeDate('endDate')}
                            renderInput={(params) => <TextField {...params}
                                                                variant="standard"
                                                                sx={{width: 150}}/>}
                        />
                    </LocalizationProvider>
                </Stack>
                <Stack justifyContent={"center"} sx={{m: 1, ml: 2}}>
                    <FormLabel
                        component="legend">{t("label_brand")}*</FormLabel>
                </Stack>
                <Select
                    size={"small"}
                    sx={{m: 1, minWidth: 120}}
                    value={getBrand()}
                    onChange={e => {
                        setSearch({...search, brandId: Number(e.target.value)})
                    }}
                >
                    {_.sortBy(dataContext.MALL_BRAND, 'nameKo').map((brand) => {
                        return (
                            <MenuItem key={brand.id}
                                      value={brand.id}>{brand.nameKo}</MenuItem>
                        )
                    })}
                </Select>
                <Stack justifyContent={"center"} sx={{m: 1}}>
                    <FormLabel
                        component="legend">{t("label_category")}</FormLabel>
                </Stack>
                <Select
                    size={"small"}
                    sx={{m: 1, minWidth: 120}}
                    value={getCategory()}
                    onChange={e => {
                        setSearch({...search, categoryId: Number(e.target.value)})
                    }}
                >
                    <MenuItem value={''}>{t("label_all")}</MenuItem>
                    {groupCate.map((cate) => {
                        return (
                              <MenuItem key={cate.groupId}
                                        value={cate.groupId}>{cate.groupName}</MenuItem>
                            )})
                    }
                </Select>
            </Stack>
            <Stack direction="row">
                <Stack justifyContent={"center"}>
                    <TextField
                      label={`${t('label_productNo')}`}
                      variant="standard"
                      value={search.productNo ? search.productNo : ''}
                      onChange={handleChange('productNo')}
                      sx={{m: 1}}
                    />
                </Stack>
                <Stack justifyContent={"center"}>
                    <TextField
                        label={`${t('label_nameKo')}`}
                        variant="standard"
                        value={search.name ? search.name : ''}
                        onChange={handleChange('name')}
                        sx={{m: 1}}
                    />
                </Stack>
            </Stack>
            <Stack direction="row"
                   justifyContent={"flex-end"}
                   sx={{mb: 1, mr: 1}}>
                <Button size='small'
                        variant="outlined"
                        sx={{mr: 1}}
                        onClick={handleReset}>
                    {t("button_clickClear")}
                </Button>
                <Button size='small'
                        color="primary"
                        variant="contained"
                        startIcon={<SearchIcon/>}
                        onClick={handleClickSearch}>
                    {t("button_clickSearch")}
                </Button>
            </Stack>
            <Stack sx={{mt: 4, display:'flex', justifyContent: 'flex-end', alignItems: 'end'}}>
                <Button sx={{mr: 1, width: 150 }}
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