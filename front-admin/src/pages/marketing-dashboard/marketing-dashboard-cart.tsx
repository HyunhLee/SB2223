import React, {FC, useEffect, useState} from "react";
import {DefModel, defSearch, SearchDef} from "../../types/marketing-model/marketing-model";
import {marketingApi} from "../../api/marketing-api";
import {toast} from "react-hot-toast";
import {Box, Button, Card, CardContent, Collapse, Container, FormLabel, Stack, TextField,} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import GraphAllList from "../../components/marketing/graph-all-list";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import moment from "moment/moment";
import SearchIcon from "@mui/icons-material/Search";

interface ListProps {
    setLabel: (e) => void;
    setName: (e) => void;
    setStart: (e) => void;
    setEnd: (e) => void;
}

const MarketingDashboardCart: FC<ListProps> = (props) => {
    const {setLabel, setName, setStart, setEnd} = props;
    const [search, setSearch] = useState<SearchDef>(defSearch);
    const [cart, setCart] = useState<DefModel[]>([]);
    const [requestList, setRequestList] = useState<boolean>(false);

    useEffect(() => {
        setRequestList(true);
    }, [])

    useEffect(() => {
        (async () => {
            if (requestList) {
                await getCartAllList();
                setRequestList(false);
            }
        })()
    }, [requestList])

    const getCartAllList = async () => {
        await marketingApi.getCartAll(search).then(res => {
            setCart([...res.lists].reverse());
            setStart(res.lists[0].aggregateDate);
            setEnd(res.lists[res.lists.length-1].aggregateDate);
            console.log('cart', res);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleClickReset = () => {
        setSearch({id: null,
            mallId: null,
            brandId: null,
            activated: null,
            startDate: null,
            endDate: null,
            page: 0,
            size: 10
        });
    }

    const handleClickSearch = () => {
        if (!search.startDate || !search.endDate) {
            toast.error('검색 기간을 입력해주세요.')
        } else {
            setSearch({...search});
            setRequestList(true);
        }
    }

    const handleSearchDate =
        (prop: keyof SearchDef) => (value) => {
            setSearch({...search, [prop]: value});
        };

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
                            <Stack
                                justifyContent='space-between'
                                direction="row">
                                <Stack direction='row'>
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
                                                value={search.startDate ? search.startDate: null}
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
                                                value={search.endDate ? search.endDate : null}
                                                onChange={handleSearchDate('endDate')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    size={'small'}
                                                                                    sx={{width: 200}}/>}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Stack>
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
                            <Stack
                                direction="row"
                                justifyContent='flex-end'
                                sx={{mt: 2}}>
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
                        <GraphAllList
                            graph={cart}
                            check={'cart'}
                            setLabel={setLabel}
                            setName={setName}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

export default MarketingDashboardCart;