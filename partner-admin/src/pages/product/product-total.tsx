import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {
    Box, Stack, Typography, Container, Card, CardContent, Button, TextField, FormLabel, Select,
    FormControl, Input, InputLabel, IconButton, InputAdornment, MenuItem
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {ProductModel, defaultProductModel, SearchProduct, defaultSearchProduct} from "../../types/product-model";
import ProductTotalList from "../../components/product/product-total-list";
import {DataContext} from "../../contexts/data-context";
import {CategoryDialog} from "../../components/dialog/dialogs";
import {useTranslation} from "react-i18next";
import {b2bProductApi} from "../../api/btb-product-api";


const ProductTotal = () => {
    let data;
    const [product, setProduct] = useState<ProductModel>(data ? data : defaultProductModel);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(defaultSearchProduct)
    const [requestList, setRequestList] = useState<boolean>(false);
    const dataContext = useContext(DataContext);
    const tempBrandList = ['나이키', '발렌시아가', '구찌', '아디다스'];
    const {t} = useTranslation();

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            setRequestList(true);
        }
    }, [])

    useEffect(() => {
        (async () => {
            if (requestList) {
                await getProductList();
            }
        })()
    }, [requestList])

    const getProductList = async () => {
        await b2bProductApi.getProduct(search).then(res => {
            // setProduct(res.lists);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleDialog = (): void => {
        setOpen(!open);
    };

    const handleClickClearCategory = () => {
        setSearch({...search, categoryIds: []})
    }

    const renderBrand = () => {
        return tempBrandList.map((value, index) => {
            return <MenuItem key={index} value={value}>{value}</MenuItem>
        })

    }

    const handleSearch = (prop: keyof SearchProduct) => (e: ChangeEvent<HTMLInputElement>) => {
        setSearch({...search, [prop]: e.target.value})

    }

    const handleSearchDate =
        (prop: keyof SearchProduct) => (value) => {
            setSearch({...search, [prop]: value});
        };


    const renderTypes = (props) => {
        return Object.keys(dataContext[props]).map((key, index) => {
            return <MenuItem key={index}
                             value={key}>{dataContext[props][key]}</MenuItem>
        });
    }


    const renderDatePicker = ({inputRef, inputProps, InputProps}) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <input ref={inputRef}
                   {...inputProps}
                   readOnly={true}
                   style={{
                       height: 40,
                       border: 1,
                       fontSize: 15,
                       outline: 'none'
                   }}/>
            {InputProps?.endAdornment}
        </Box>
    )

    const handleClickReset = () => {
        // @ts-ignore
        setSearch(defaultSearchProduct);
    }

    const handleClickSearch = () => {
        setRequestList(true);
    }


    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 2
                }}
            >
                <Stack sx={{ml: 3, mt: 2, mb: 2}}>
                    <Typography variant="h5">{t("pages_product_productTotal_title")}</Typography>
                </Stack>
                <Container maxWidth="xl">
                    <Card sx={{py: 1}}>
                        <CardContent sx={{py: 1}}>
                            <Stack direction="row">
                                <FormControl sx={{m: 1, width: '30ch'}}
                                             variant="standard">
                                    <InputLabel
                                        htmlFor="standard-adornment-password">{t('label_category')}</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        type='text'
                                        value={search.categoryIds}
                                        readOnly={true}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={handleClickClearCategory}
                                                >
                                                    <ClearIcon/>
                                                </IconButton>
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={handleDialog}
                                                >
                                                    <SearchIcon/>
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <TextField
                                    label={t('label_nameKo')}
                                    variant="standard"
                                    value={search.nameKo}
                                    onChange={handleSearch('nameKo')}
                                    sx={{m: 1, ml: 3}}
                                />
                                <TextField
                                    label={t('label_productId')}
                                    variant="standard"
                                    value={search.id}
                                    onChange={handleSearch('id')}
                                    sx={{m: 1, ml: 3}}
                                />
                                <Stack justifyContent={"center"} sx={{ml: 3, mr: 1, mt: 2}}>
                                    <FormLabel
                                        component="legend">{t('label_soldOutStatus')}</FormLabel>
                                </Stack>
                                <Select
                                    sx={{width: 160, height: 40, mt: 2.5}}
                                    size={"small"}
                                    value={search.isSoldOut}
                                    onChange={handleSearch('isSoldOut')}
                                >
                                    {renderTypes('SOLD_OUT')}
                                </Select>
                            </Stack>
                            <Stack direction={"row"} sx={{mt: 2}}>
                                <Stack justifyContent={"center"} sx={{ml: 1, mr: 1, mt: 1}}>
                                    <FormLabel
                                        component="legend">{t('label_status')}</FormLabel>
                                </Stack>
                                <Select
                                    sx={{width: 160, mt: 1}}
                                    size={"small"}
                                    value={search.registrationStatus}
                                    onChange={handleSearch('registrationStatus')}
                                >
                                    {renderTypes('REGISTRATION_STATUS')}
                                </Select>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 5, mt: 1}}>
                                    <FormLabel
                                        component="legend">{t('label_displayStatus')}</FormLabel>
                                </Stack>
                                <Select
                                    sx={{width: 160, mt: 1}}
                                    size={"small"}
                                    value={search.activated}
                                    onChange={handleSearch('activated')}
                                >
                                    {renderTypes('DISPLAY_STATUS')}
                                </Select>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 5, mt: 1}}>
                                    <FormLabel
                                        component="legend">{t('label_jennieFit')}</FormLabel>
                                </Stack>
                                <Select
                                    sx={{width: 160, mt: 1}}
                                    size={"small"}
                                    value={search.fitRequestStatus}
                                    onChange={handleSearch('fitRequestStatus')}
                                >
                                    {renderTypes('JENNIE_FIT_REQUESTED_STATUS')}
                                </Select>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 5, mt: 1}}>
                                    <FormLabel
                                        component="legend">{t('label_brand')}</FormLabel>
                                </Stack>
                                <Select
                                    sx={{width: 160, mt: 1}}
                                    size={"small"}
                                    value={search.brandName}
                                    onChange={handleSearch('brandName')}
                                >
                                    {renderBrand()}
                                </Select>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 5, mt: 1}}>
                                    <FormLabel
                                        component="legend">{t('label_registrationType')}</FormLabel>
                                </Stack>
                                <Select
                                    sx={{minWidth: 200, mt: 1}}
                                    size={"small"}
                                    value={search.registrationType}
                                    onChange={handleSearch('registrationType')}
                                >
                                    {renderTypes('REGISTRATION_TYPE')}
                                </Select>
                            </Stack>
                            <Stack direction="row"
                                   display={'flex'}
                                   justifyContent='space-between'
                                   sx={{mt: 3}}>
                                <Stack direction="row">
                                    <Stack justifyContent={"center"} sx={{mr: 2, ml: 1, mt: 2}}>
                                        <FormLabel
                                            component="legend">{t('label_registrationDate')}</FormLabel>
                                    </Stack>
                                    <Stack sx={{mt: 2, border: '1px solid #dfdfdf', borderRadius: 1, px: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={search.startDate}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleSearchDate('startDate')}
                                                renderInput={renderDatePicker}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                    <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                                        ~
                                    </Stack>
                                    <Stack sx={{mt: 2, border: '1px solid #dfdfdf', borderRadius: 1, px: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={search.endDate}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleSearchDate('endDate')}
                                                renderInput={renderDatePicker}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Stack>
                                <Stack direction={'row'}>
                                    <Button size='small'
                                            variant="outlined"
                                            sx={{mr: 0.5, mt: 2, p: 1, height: 40, fontSize: 12}}
                                            onClick={handleClickReset}
                                    >
                                        {t('button_reset')}
                                    </Button>
                                    <Button size='small'
                                            color="primary"
                                            variant="contained"
                                            sx={{mr: 0.5, p: 1, mt: 2, height: 40, fontSize: 12}}
                                            onClick={handleClickSearch}
                                    >
                                        {t('button_search')}
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card sx={{mt: 1}}>
                        <ProductTotalList data={product} setData={setProduct}/>
                    </Card>
                </Container>
            </Box>
            <CategoryDialog
                keepMounted
                open={open}
                onClose={handleDialog}
                category={dataContext.CATEGORY}
                value={product.categoryIds}
            />
        </>
    )
}


ProductTotal.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default ProductTotal;