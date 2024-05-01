import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {
    Box, Button,
    Card,
    CardContent,
    Container,
    FormLabel, MenuItem, Select,
    Stack,  Collapse,
    Typography
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {useTranslation} from "react-i18next";
import React, {ChangeEvent, useContext, useEffect, useState, useRef} from "react";
import {marketingApi} from "../../api/marketing-api";
import GraphList from "../../components/marketing/graph-list";
import {DefModel, defSearch, SearchDef} from "../../types/marketing-model";
import {toast} from "react-hot-toast";
import TotalAmountInCart from "../../components/marketing/total-amount-in-cart";
import TotalPurchaseInCart from "../../components/marketing/total-purchase-in-cart";
import {brandApi} from "../../api/brand-api";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import moment from "moment/moment";
import SearchIcon from "@mui/icons-material/Search";

const MarketingDashboard = () => {
    const {t} = useTranslation();
    const [search, setSearch] = useState<SearchDef>(defSearch);
    const [click, setClick] = useState<DefModel[]>([]);
    const [style, setStyle] = useState<DefModel[]>([]);
    const [detail, setDetail] = useState<DefModel[]>([]);
    const [user, setUser] = useState<DefModel[]>([]);
    const [requestList, setRequestList] = useState<boolean>(true);
    const [trigger, setTrigger] = useState(false);
    const [brandList, setBrandList] = useState([]);

    //dateRange
    const [simplyCalendarOpen, setSimplyCalendarOpen] = useState(false);
    const lastMonth = moment().subtract(1,'months');
    const lastSunday = moment().day();
    const handleCalendarOpen = () =>{
        if(simplyCalendarOpen){
            setSimplyCalendarOpen(false)
        }else{
            setSimplyCalendarOpen(true)
        }
    }


    let topBrandId;
    useEffect(() => {
        (async () => {
            const mallId = localStorage.getItem('mallId');
            const result = await brandApi.getMallBrands(mallId);
            topBrandId = result.data[0].id
            setBrandList(result.data);
            if(search.brandId == null){
                setSearch({...search, brandId: topBrandId})
                setTrigger(true)
            }else{
                setSearch({...search})
            }
        })()
    },[]);

    useEffect(() => {
        (async () => {
            if (requestList && trigger) {
                await getClickList();
                await getStyleList();
                await getDetailList();
                await getUserList();
                setRequestList(false);
            }
        })()
    }, [requestList, trigger])

    const getClickList = async () => {
        await marketingApi.getClick(search).then(res => {
            setClick(res.lists);
        }).catch(err => {
            console.log(err);
        })
    }

    const getStyleList = async () => {
        await marketingApi.getStyle(search).then(res => {
            setStyle(res.lists);
        }).catch(err => {
            console.log(err);
        })
    }

    const getDetailList = async () => {
        await marketingApi.getDetail(search).then(res => {
            setDetail(res.lists);
        }).catch(err => {
            console.log(err);
        })
    }

    const getUserList = async () => {
        await marketingApi.getUser(search).then(res => {
            setUser(res.lists);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleClickReset = () => {
        setSearch({
            id: null,
            mallId: Number(localStorage.getItem('mallId')),
            brandId: null,
            activated: null,
            startDate: null,
            endDate: null,
            page: 0,
            size: 10
        });
    }

    const handleClickSearch = () => {
        if (!search.mallId) {
            toast.error(`${t("pages_marketingDashboard_marketingDashboard_search_error")}`)
            return;
        }
        if (!search.startDate || !search.endDate) {
            window.confirm(`${t("components_marketing_totalPurchaseInCartDetail_getAmountData_date")}`);
            return;
        } else if(!search.brandId ){
            window.confirm(`${t("components_marketing_totalPurchaseInCartDetail_getAmountData_brand")}`);
            return;
        }else{
            setSearch({...search});
            setRequestList(true);
        }
    }

    const handleSearchDate =
        (prop: keyof SearchDef) => (value) => {
           setSearch({...search, [prop]: value});
        };

    const renderDate = ({inputRef, inputProps, InputProps}) => (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <input ref={inputRef}
                   {...inputProps}
                   readOnly={true}
                   style={{
                       height: 40,
                       fontSize: 15,
                       border: 1,
                       outline: 'none'
                   }}/>
            {InputProps?.endAdornment}
        </Box>
    )

    const handleSearch = (prop: keyof SearchDef) => (e: ChangeEvent<HTMLInputElement>) => {
        setSearch({...search, [prop]: e.target.value})
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
                    <Typography
                        variant="h5">{t("pages_marketingDashboard_marketingDashboard_typography_title")}</Typography>
                </Stack>
                <Container maxWidth="xl">
                    <Card sx={{py: 1,zIndex:5000}}>
                        <CardContent sx={{py: 1}}>
                            <Stack direction="row">
                                <Stack justifyContent={"center"} sx={{mr: 2, ml: 1, mt: 1.5}}>
                                    <FormLabel
                                        component="legend">{t('label_date')}</FormLabel>
                                </Stack>
                                <Stack sx={{mt: 2, border: '1px solid #dfdfdf', px: 1, borderRadius: 1}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                                            inputFormat="yyyy-MM-dd"
                                            value={search.startDate}
                                            onChange={handleSearchDate('startDate')}
                                            renderInput={renderDate}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                                    ~
                                </Stack>
                                <Stack sx={{mt: 2, border: '1px solid #dfdfdf', px: 1, borderRadius: 1}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                                            inputFormat="yyyy-MM-dd"
                                            value={search.endDate}
                                            onChange={handleSearchDate('endDate')}
                                            renderInput={renderDate}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 5, mt: 1.5}}>
                                    <FormLabel
                                        component="legend">{t('label_brand')}</FormLabel>
                                </Stack>
                                <Select
                                    sx={{width: 160, height: 40, mt: 2}}
                                    size={"small"}
                                    value={search.brandId ? search.brandId : " "}
                                    onChange={handleSearch('brandId')}
                                >
                                    {brandList.map((brand) => {
                                        return (
                                          <MenuItem key={brand.id}
                                                    value={brand.id}>{brand.nameKo}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </Stack>
                            <Stack sx={{ml: 6,}}>
                            <Stack direction="row" justifyContent='flex-start' sx={{width: 130,}}>
                                {simplyCalendarOpen ?  <Button
                                  onClick={handleCalendarOpen}
                                  size="small"
                                  variant='text'
                                  endIcon={<ExpandLessIcon/>}
                                  sx={{ mr:1,}}
                                >  {t('pages_marketingDashboard_marketingDashboard_button_dateRange')}</Button>
                             :
                                <Button
                                  onClick={handleCalendarOpen}
                                  size="small"
                                  variant='text'
                                  endIcon={<ExpandMoreIcon/>}
                                  sx={{mr:1,}}
                                > {t('pages_marketingDashboard_marketingDashboard_button_dateRange')}</Button> }
                            </Stack>
                            <Collapse in={simplyCalendarOpen}
                                      orientation="vertical"
                                      unmountOnExit>
                                <Stack direction="row" sx={{mt:-1}}>
                                    <Button
                                      variant='text'
                                      onClick={() => {
                                          setSearch({...search, startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'), endDate: moment().subtract(1, 'days').format('YYYY-MM-DD') })
                                      }}> {t('pages_marketingDashboard_marketingDashboard_button_yesterday')}</Button>
                                    <Button
                                      variant='text'
                                      onClick={() => {setSearch({...search,  startDate: moment().subtract(0, 'days').format('YYYY-MM-DD'), endDate: moment().subtract(0, 'days').format('YYYY-MM-DD')})}}>
                                        {t('pages_marketingDashboard_marketingDashboard_button_today')}</Button>
                                    <Button
                                      variant='text'
                                      onClick={() => {setSearch({...search,  startDate: moment().subtract(6 + lastSunday, 'days').format('YYYY-MM-DD'), endDate: moment().subtract(lastSunday, 'days').format('YYYY-MM-DD')})}}>
                                        {t('pages_marketingDashboard_marketingDashboard_button_lastWeek')}</Button>
                                    <Button
                                      variant='text'
                                      onClick={() => {setSearch({...search,  startDate:  moment(lastMonth).startOf('month').format('YYYY-MM-DD'), endDate: moment(lastMonth).endOf('month').format('YYYY-MM-DD')})}}>
                                        {t('pages_marketingDashboard_marketingDashboard_button_lastMonth')}</Button>
                                </Stack>
                            </Collapse>
                            </Stack>
                            <Stack direction="row"
                                   justifyContent='flex-end'
                                   sx={{mt: 3}}>
                                <Button size='small'
                                        variant="outlined"
                                        sx={{mr: 0.5, p: 1, fontSize: 12}}
                                        onClick={handleClickReset}
                                >
                                    {t('button_clickClear')}
                                </Button>
                                <Button size='small'
                                        color="primary"
                                        variant="contained"
                                        startIcon={<SearchIcon/>}
                                        sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                        onClick={handleClickSearch}
                                >
                                    {t('button_search')}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card sx={{mt: 1}}>
                        <GraphList
                            graph={click}
                            check={'click'}
                            search={search}
                        />
                    </Card>
                    <Card sx={{mt: 1}}>
                        <GraphList
                            graph={style}
                            check={'style'}
                            search={search}
                        />
                    </Card>
                    <Card sx={{mt: 1}}>
                        <GraphList
                            graph={detail}
                            check={'detail'}
                            search={search}
                        />
                    </Card>
                    <Card sx={{mt: 1}}>
                        <TotalAmountInCart search={search} requestList={requestList} setSearch={setSearch}/>
                    </Card>
                    {/*사용하지 않을거라고 해서 일단은 주석 처리로 숨김 (피팅룸 기여 매출)*/}
                    {/*<Card sx={{mt: 1}}>*/}
                    {/*    <TotalPurchaseInCart search={search} requestList={requestList} setSearch={setSearch}/>*/}
                    {/*</Card>*/}
                    <Card sx={{mt: 1}}>
                        <GraphList
                            graph={user}
                            check={'user'}
                            search={search}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
}

MarketingDashboard.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default MarketingDashboard;