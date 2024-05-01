import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Container,
    FormLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from "@mui/material";
import _ from "lodash";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DataContext} from "../../contexts/data-context";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import GraphList from "../../components/marketing/graph-list";
import TotalAmountInCart from "../../components/marketing/total-amount-in-cart";
// import TotalPurchaseInCart from "../../components/marketing/total-purchase-in-cart";
import {DefModel, defSearch, SearchDef} from "../../types/marketing-model/marketing-model";
import {marketingApi} from "../../api/marketing-api";
import {brandApi} from "../../api/brand-api";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";

const MarketingDashboardCompany = (props) => {
    const {name, start, end} = props;
    const dataContext = useContext(DataContext);
    const [search, setSearch] = useState<SearchDef>(defSearch);
    const [click, setClick] = useState<DefModel[]>([]);
    const [style, setStyle] = useState<DefModel[]>([]);
    const [detail, setDetail] = useState<DefModel[]>([]);
    const [user, setUser] = useState<DefModel[]>([]);
    const [requestList, setRequestList] = useState<boolean>(false);
    const [brand, setBrand] = useState([]);
    const [first, setFirst] = useState<boolean>(true);
    const [second, setSecond] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            if(name !== null) {
                await brandApi.getMallBrands(name).then(res => {
                    setBrand(res.data);
                    setFirst(false);
                    setSearch({
                        ...search,
                        mallId: name,
                        brandId: res.data[0].id,
                        startDate: start,
                        endDate: end
                    });
                    setRequestList(true);
                });
            }
        })()
    }, [])

    useEffect(() => {
        if(brand.length > 0 && second && name == null && !first) {
            setSearch({
                ...search,
                mallId: name ? name : _.sortBy(dataContext.MALL, 'name')[0].mall.id,
                brandId: brand[0].id
            });
            setRequestList(true);
            setSecond(false);
        }
    }, [brand])

    useEffect(() => {
        (async () => {
            if(name !== null && start !== '' && end !== '' && brand.length > 0) {
                await getClickList();
                await getStyleList();
                await getDetailList();
                await getUserList();
                setRequestList(false);
            }
            if (requestList) {
                await getClickList();
                await getStyleList();
                await getDetailList();
                await getUserList();
                setRequestList(false);
            }
        })()
    }, [requestList])

    const getClickList = async () => {
        console.log(search)
        await marketingApi.getClick(search).then(res => {
            setClick(res.lists);
            console.log('click', res);
        }).catch(err => {
            console.log(err);
        })
    }

    const getStyleList = async () => {
        await marketingApi.getStyle(search).then(res => {
            setStyle(res.lists);
            console.log('style', res);
        }).catch(err => {
            console.log(err);
        })
    }

    const getDetailList = async () => {
        await marketingApi.getDetail(search).then(res => {
            setDetail(res.lists);
            console.log('detail', res);
        }).catch(err => {
            console.log(err);
        })
    }

    const getUserList = async () => {
        await marketingApi.getUser(search).then(res => {
            setUser(res.lists);
            console.log('user', res);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleClickReset = () => {
        setSearch({
            id: null,
          mallId: null,
          brandId: null,
          activated: null,
          startDate: null,
          endDate: null,
          page: 0,
          size: 10});
    }

    const handleClickSearch = () => {
        if (!search.mallId && !search.brandId && !search.startDate && !search.endDate) {
            toast.error('기간, 몰, 브랜드 모든 항목을 입력해주세요.')
        } else if (!search.startDate || !search.endDate) {
            toast.error('기간을 입력해주세요.')
        }else if (!search.mallId || !search.brandId) {
            toast.error('몰과 브랜드를 입력해주세요.')
        } else {
            setSearch({...search});
            setRequestList(true);
        }
    }

    const handleSearchDate =
        (prop: keyof SearchDef) => (value) => {
            setSearch({...search, [prop]: value});
        };

    const handleSearch = (prop: keyof SearchDef) => (e: ChangeEvent<HTMLInputElement>) => {
        if(prop == 'mallId') {
            brandApi.getMallBrands(e.target.value).then(res => {
                setBrand(res.data);
                setSearch({...search, mallId: Number(e.target.value), brandId: res.data[0].id})
            });
        } else {
            setSearch({...search, [prop]: e.target.value})
        }
    }

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

    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 2
                }}
            >
                <Container maxWidth="xl">
                    <Card sx={{py: 1}}>
                        <CardContent sx={{py: 1}}>
                            <Stack direction="row">
                                <Stack justifyContent={"center"}
sx={{mr: 2, ml: 1, mt: 2}}>
                                    <FormLabel
                                        component="legend">기간</FormLabel>
                                </Stack>
                                <Stack sx={{mt: 2}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                                            inputFormat="yyyy-MM-dd"
                                            value={search.startDate}
                                            onChange={handleSearchDate('startDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                size={'small'}
                                                                                sx={{width: 200}}/>}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                                    ~
                                </Stack>
                                <Stack sx={{mt: 2}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                                            inputFormat="yyyy-MM-dd"
                                            value={search.endDate}
                                            onChange={handleSearchDate('endDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                size={'small'}
                                                                                sx={{width: 200}}/>}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 5, mt: 3}}>
                                    <FormLabel sx={{mb:1}}
                                        component="legend">몰</FormLabel>
                                </Stack>
                                <Select
                                    sx={{width: 160, height: 40, mt: 2}}
                                    size={"small"}
                                    value={search.mallId ? search.mallId : ''}
                                    onChange={handleSearch('mallId')}
                                >
                                    {_.sortBy(dataContext.MALL, 'name').map((mall) => {
                                        return (
                                            <MenuItem key={mall.mall.id}
                                                      value={mall.mall.id}>{mall.mall.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                                {brand.length > 0 ?
                                    <>
                                        <Stack justifyContent={"center"}
                                                sx={{mr: 1, ml: 5, mt: 3}}>
                                            <FormLabel sx={{mb:1}}
                                                component="legend">브랜드</FormLabel>
                                        </Stack>
                                        <Select
                                        sx={{width: 160, height: 40, mt: 2}}
                                        size={"small"}
                                        value={search.brandId ? search.brandId : ''}
                                        onChange={handleSearch('brandId')}
                                        >
                                            {brand.map((brand) => {
                                                return (
                                                <MenuItem key={brand.id}
                                                value={brand.id}>{brand.nameKo}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </>
                                    : <></>
                                }
                            </Stack>
                            <Stack sx={{ml: 6}}>
                                <Stack direction="row"
justifyContent='flex-start'
sx={{width: 130,}}>
                                    {simplyCalendarOpen ?  <Button
                                        onClick={handleCalendarOpen}
                                        size="small"
                                        variant='text'
                                        endIcon={<ExpandLessIcon/>}
                                        sx={{ mr:1,}}
                                      >기간설정</Button>
                                      :
                                      <Button
                                        onClick={handleCalendarOpen}
                                        size="small"
                                        variant='text'
                                        endIcon={<ExpandMoreIcon/>}
                                        sx={{mr:1,}}
                                      >기간설정</Button> }
                                </Stack>
                                <Collapse in={simplyCalendarOpen}
                                          orientation="vertical"
                                          unmountOnExit>
                                    <Stack direction="row"
sx={{mt:-1}}>
                                        <Button
                                          variant='text'
                                          onClick={() => {
                                              // @ts-ignore
                                              setSearch({...search, startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'), endDate: moment().subtract(1, 'days').format('YYYY-MM-DD') })
                                          }}>어제</Button>
                                        <Button
                                          variant='text'
                                          onClick={() => { // @ts-ignore
                                              setSearch({...search,  startDate: moment().subtract(0, 'days').format('YYYY-MM-DD'), endDate: moment().subtract(0, 'days').format('YYYY-MM-DD')})}}>
                                            오늘</Button>
                                        <Button
                                          variant='text'
                                          onClick={() => { // @ts-ignore
                                              setSearch({...search,  startDate: moment().subtract(6 + lastSunday, 'days').format('YYYY-MM-DD'), endDate: moment().subtract(lastSunday, 'days').format('YYYY-MM-DD')})}}>
                                            지난 주</Button>
                                        <Button
                                          variant='text'
                                          onClick={() => { // @ts-ignore
                                              setSearch({...search,  startDate:  moment(lastMonth).startOf('month').format('YYYY-MM-DD'), endDate: moment(lastMonth).endOf('month').format('YYYY-MM-DD')})}}>
                                            지난 달</Button>
                                    </Stack>
                                </Collapse>
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
                                        startIcon={<SearchIcon/>}
                                        onClick={handleClickSearch}>
                                    검색
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
                        <TotalAmountInCart search={search}
requestList={requestList}/>
                    </Card>
{/*                    <Card sx={{mt: 1}}>*/}
{/*                        <TotalPurchaseInCart search={search}*/}
{/*requestList={requestList}/>*/}
{/*                    </Card>*/}
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
};

MarketingDashboardCompany.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default MarketingDashboardCompany;