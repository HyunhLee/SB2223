import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {
    Box,
    Stack,
    Typography,
    Container,
    Card,
    CardContent,
    Button,
    TextField,
    FormLabel,
    Select,
    FormControl,
    Input,
    InputLabel,
    IconButton,
    IconButtonProps,
    InputAdornment,
    MenuItem,
    Collapse,
    useMediaQuery,
    Theme
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {ChangeEvent, useContext, useEffect, useState, MouseEvent} from "react";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {ProductModel, SearchProduct, defaultSearchProduct} from "../../types/btb-product-model";
import ProductTotalList from "../../components/btb-product/product-total-list";
import {DataContext} from "../../contexts/data-context";
import {CategoryDialog} from "../../components/dialog/dialogs";
import {useTranslation} from "react-i18next";
import _, {indexOf} from "lodash";
import {b2bProductApi} from "../../api/btb-product-api";
import {getDataContextValue} from "../../utils/data-convert";
import {styled} from "@mui/material/styles";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const ProductTotal = () => {
    const [product, setProduct] = useState<ProductModel[]>([]);
    const [count, setCount] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(defaultSearchProduct)
    const [requestList, setRequestList] = useState<boolean>(false);
    const [expanded, setExpanded] = useState(false);
    const dataContext = useContext(DataContext);
    const {t} = useTranslation();
    const gender = localStorage.getItem('mallGender');
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const align = mdUp ? 'row' : 'column' ;


    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            setRequestList(true);
        }
    }, [])

    useEffect(() => {
        (async () => {
            if (requestList) {
                await getProductList();
                setRequestList(false);
            }
        })()
    }, [requestList])

    const getProductList = async () => {
        await b2bProductApi.getProduct(search).then(res => {
            setProduct(res.lists);
            setCount(res.count);
        }).catch(err => {
            console.log(err);
        })
    }

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

    const handleClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                categoryId: value.id,
            });
        }
        setOpen(false);
    }

    const handleDialog = (): void => {
        setOpen(!open);
    };

    const handleClickClearCategory = () => {
        setSearch({...search, categoryId: null})
    }

    const handleSearch = (prop: keyof SearchProduct) => (e: ChangeEvent<HTMLInputElement>) => {
        setSearch({...search, [prop]: e.target.value})
    }

    const handleSearchDate =
        (prop: keyof SearchProduct) => (value) => {
            setSearch({...search, [prop]: value});
        };

    const renderTypes = (prop) => {
        return Object.keys(dataContext[prop]).map((key, index) => {
            return <MenuItem key={index} value={key}>{dataContext[prop][key]}</MenuItem>
        })
    }

    const renderDate = ({inputRef, inputProps, InputProps}) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <input ref={inputRef}
                   {...inputProps}
                   readOnly={true}
                   style={{
                       height: 35,
                       fontSize: 15,
                       border: 1,
                       outline: 'none'
                   }}/>
            {InputProps?.endAdornment}
        </Box>
    )

    const handleClickReset = () => {
        setSearch(defaultSearchProduct);
    }

    const handleClickSearch = () => {
        setSearch({
            ...search,
            page: 0
        });
        setRequestList(true);
        handlePageChange(null,0)
    }

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleClickSearch()
            handlePageChange(null,0)
        }
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const switchGenderCategories = () => {
        if(gender == 'F'){
            return getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP',search.categoryId,'path')
        }else{
            return getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', search.categoryId, 'path')
        }
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
                            <Stack direction={align}>
                                <Stack direction={'row'}>
                                <Stack>
                                    <FormControl sx={{m: 1, minWidth: 150}} variant="standard">
                                        <InputLabel
                                            htmlFor="standard-adornment-password">{t('label_category')}</InputLabel>
                                        <Input
                                            id="standard-adornment-password"
                                            type='text'
                                            value={search.categoryId ? switchGenderCategories() : ''}
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
                                </Stack>
                                <Stack justifyContent={"center"} sx={{mr: 1}}>
                                    <TextField
                                        label={t('label_nameKo')}
                                        variant="standard"
                                        value={search.nameKo}
                                        onChange={handleSearch('nameKo')}
                                        onKeyUp={handleKeyUp}
                                        sx={{m: 1, maxWidth: 120, minWidth: 100}}
                                    />
                                </Stack>
                                <TextField
                                    label={t('label_productId')}
                                    variant="standard"
                                    value={search.id}
                                    onChange={handleSearch('id')}
                                    onKeyUp={handleKeyUp}
                                    sx={{m: 1, maxWidth: 120, minWidth: 100}}
                                />
                                </Stack>
                                <Stack direction={'row'}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: align == 'column' ? 1: 2, mt: 3}}>
                                    <FormLabel
                                      component="legend">{t('label_brand')}</FormLabel>
                                </Stack>
                                <Select
                                    sx={{minWidth: 150, height: 40, mt: 3}}
                                    size={"small"}
                                    value={search.brandId ? search.brandId : ''}
                                    onChange={handleSearch('brandId')}
                                >
                                    <MenuItem value={''}>전체</MenuItem>
                                    {_.sortBy(dataContext.MALL_BRAND, 'nameKo').map((brand) => {
                                        return (
                                            <MenuItem key={brand.id}
                                                      value={brand.id}>{brand.nameKo}</MenuItem>
                                        )
                                    })}
                                </Select>
                                </Stack>
                            </Stack>
                            <Collapse in={expanded}
                                      timeout="auto"
                                      unmountOnExit>
                                <Stack direction={"row"} sx={{mt: 2}}>
                                    <Stack justifyContent={"center"} sx={{ml: 1, mr: 1, mt: 1}}>
                                        <FormLabel
                                            component="legend">{t('label_status')}</FormLabel>
                                    </Stack>
                                    <Select
                                        sx={{width: 120, mt: 1, height: 40}}
                                        size={"small"}
                                        value={search.requestStatus}
                                        onChange={handleSearch('requestStatus')}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        {renderTypes('REQUEST_STATUS')}
                                    </Select>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5, mt: 1}}>
                                        <FormLabel
                                            component="legend">{t('label_displayStatus')}</FormLabel>
                                    </Stack>
                                    <Select
                                        sx={{width: 100, mt: 1, height: 40}}
                                        size={"small"}
                                        value={search.displayStatus}
                                        onChange={handleSearch('displayStatus')}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        {renderTypes('DISPLAY_STATUS')}
                                    </Select>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5, mt: 1}}>
                                        <FormLabel
                                            component="legend">{t('label_soldOutStatus')}</FormLabel>
                                    </Stack>
                                    <Select
                                        sx={{width: 100, mt: 1, height: 40}}
                                        size={"small"}
                                        value={search.isSoldOut}
                                        onChange={handleSearch('isSoldOut')}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        {renderTypes('SOLD_OUT')}
                                    </Select>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5, mt: 1}}>
                                        <FormLabel
                                            component="legend">{t('label_jennieFit')}</FormLabel>
                                    </Stack>
                                    <Select
                                        sx={{width: 140, mt: 1, height: 40}}
                                        size={"small"}
                                        value={search.jennieFitRequestType}
                                        onChange={handleSearch('jennieFitRequestType')}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        {renderTypes('JENNIE_FIT_REQUEST_TYPE')}
                                    </Select>
                                </Stack>
                                <Stack direction="row">
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 1, mt: 2}}>
                                        <FormLabel
                                          component="legend">{t('label_registrationType')}</FormLabel>
                                    </Stack>
                                    <Select
                                      sx={{minWidth: 180, mt: 2, height: 40}}
                                      size={"small"}
                                      value={search.registrationType}
                                      onChange={handleSearch('registrationType')}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        {renderTypes('REGISTRATION_TYPE')}
                                    </Select>
                                    <Stack direction="row">
                                        <Stack justifyContent={"center"} sx={{mr: 2, ml: 5, mt: 2}}>
                                            <FormLabel
                                                component="legend">{t('label_registrationDate')}</FormLabel>
                                        </Stack>
                                        <Stack sx={{mt: 2, border: '1px solid #dfdfdf', px: 1, borderRadius: 1,  height: 40}}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    inputFormat="yyyy-MM-dd"
                                                    value={search.startDate}
                                                    onChange={handleSearchDate('startDate')}
                                                    maxDate={new Date(new Date().setDate(new Date().getDate()))}
                                                    renderInput={renderDate}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                        <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                                            ~
                                        </Stack>
                                        <Stack sx={{mt: 2, border: '1px solid #dfdfdf', px: 1, borderRadius: 1, height: 40}}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    inputFormat="yyyy-MM-dd"
                                                    value={search.endDate}
                                                    onChange={handleSearchDate('endDate')}
                                                    maxDate={new Date(new Date().setDate(new Date().getDate()))}
                                                    renderInput={renderDate}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Collapse>
                            <Stack direction="row"
                                   justifyContent='flex-end'
                                   sx={{mt: 3}}>
                                <ExpandMore expand={expanded}
                                            aria-expanded={expanded}
                                            sx={{mr: 0.5, fontSize: 12}}
                                            onClick={handleExpandClick}>
                                    <ExpandMoreOutlinedIcon/>
                                </ExpandMore>
                                <Button size='small'
                                        variant="outlined"
                                        sx={{mr: 0.5, p: 1, fontSize: 12}}
                                        onClick={handleClickReset}
                                >
                                    {t('button_reset')}
                                </Button>
                                <Button size='small'
                                        color="primary"
                                        variant="contained"
                                        sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                        startIcon={<SearchIcon/>}
                                        onClick={handleClickSearch}
                                >
                                    {t('button_search')}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card sx={{mt: 1}}>
                        <ProductTotalList
                            data={product}
                            count={count}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPage={search.size}
                            page={search.page}
                            getProductList={getProductList}
                        />
                    </Card>
                </Container>
            </Box>
            <CategoryDialog
                keepMounted
                open={open}
                onClose={handleClose}
                category={gender == 'F' ? dataContext.FEMALE_CATEGORY : dataContext.MALE_CATEGORY}
                value={search.categoryId}
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