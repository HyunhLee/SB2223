import {FC, useEffect, useState} from "react";
import {DefModel, defSearch, SearchDef} from "../../types/marketing-model/marketing-model";
import {marketingApi} from "../../api/marketing-api";
import {toast} from "react-hot-toast";
import {Box, Button, Card, CardContent, Collapse, Container, FormLabel, Stack,} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import GraphAllList from "../../components/marketing/graph-all-list";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import moment from "moment/moment";

interface ListProps {
    setLabel: (e) => void;
    setName: (e) => void;
    setStart: (e) => void;
    setEnd: (e) => void;
}

const MarketingDashboardSale: FC<ListProps> = (props) => {
    const {setLabel, setName, setStart, setEnd} = props;
    const [search, setSearch] = useState<SearchDef>(defSearch);
    const [sale, setSale] = useState<DefModel[]>([]);
    const [requestList, setRequestList] = useState<boolean>(false);

    useEffect(() => {
        setRequestList(true);
    }, [])

    useEffect(() => {
        (async () => {
            if (requestList) {
                await getSaleAllList();
                setRequestList(false);
            }
        })()
    }, [requestList])

    const getSaleAllList = async () => {
        await marketingApi.getSaleAll(search).then(res => {
            setSale(res.lists);
            setStart(res.lists[0].aggregateDate);
            setEnd(res.lists[res.lists.length-1].aggregateDate);
            console.log('sale', res);
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
                                    <Stack sx={{mt: 2, border: '1px solid #dfdfdf', px: 1, borderRadius: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                                                minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                                                inputFormat="yyyy-MM-dd"
                                                value={search.startDate ? search.startDate: null}
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
                                                value={search.endDate ? search.endDate : null}
                                                onChange={handleSearchDate('endDate')}
                                                renderInput={renderDate}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack sx={{ml: 6,}}>
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
                                sx={{mt: 2.5}}>
                                <Button size='small'
                                        variant="outlined"
                                        sx={{mr: 0.5, p: 1, fontSize: 12}}
                                        onClick={handleClickReset}
                                >
                                    초기화
                                </Button>
                                <Button size='small'
                                        color="primary"
                                        variant="contained"
                                        sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                        onClick={handleClickSearch}
                                >
                                    검색
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Card sx={{mt: 1}}>
                        <GraphAllList
                            graph={sale}
                            check={'sale'}
                            setLabel={setLabel}
                            setName={setName}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

export default MarketingDashboardSale;