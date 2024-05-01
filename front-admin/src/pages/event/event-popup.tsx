import React, {ChangeEvent, MouseEvent, useEffect, useState,} from 'react';
import type {NextPage} from 'next';
import Head from "next/head";
import {AuthGuard} from '../../components/authentication/auth-guard';
import {DashboardLayout} from '../../components/dashboard/dashboard-layout';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {Plus as PlusIcon} from "../../icons/plus";
import {useRouter} from "next/router";
import {eventPopupApi} from "../../api/event-api";
import {defaultSearchEventModel, EventInfoModel, EventSearchModel} from "../../types/event";
import {EventList} from "../../components/event/event-list";
import _ from "lodash";
import toast from "react-hot-toast";


const EventPopup: NextPage = () => {
    const router = useRouter();
    const eventStatus = ['전시예정', '전시중', '전시종료']
    const [lists, setLists] = useState<EventInfoModel[]>([]);
    const [count, setCount] = useState<number>(0);
    const [search, setSearch] = useState<EventSearchModel>(defaultSearchEventModel());
    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);
    const [requestList, setRequestList] = useState<boolean>(false);

    const getEventList = async () =>{
        try{
            const query = {
                ...search
            }
            const result = await eventPopupApi.getEventPopup(query);
            setLists(result.lists);
            setCount(result.count);
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleClick = () =>{
        router.push('/event/event-popup-registration')
    }

    const handleChangeDate = (prop: keyof EventSearchModel) => (value) => {
        setSearch({ ...search, [prop]: value });
    };

    const handleSearch = (prop: keyof EventSearchModel) => (event: ChangeEvent<HTMLInputElement>) => {
       if(event.target.value === '전시중'){
            setSearch({...search, [prop]: event.target.value})
        }else if(event.target.value === '전시종료'){
            setSearch({...search, expireDate: new Date(), startDate: null, [prop]: event.target.value})
        }else if(event.target.value === '전시예정'){
            setSearch({...search, startDate: new Date(), expireDate : null,[prop]: event.target.value})
        }else{
            setSearch({ ...search,  startDate:null, expireDate: null, [prop]: event.target.value });
        }

    };

    const renderTypes = () => {
        return eventStatus.map((key, index) => {
            return <MenuItem key={index}
value={key}>{key}</MenuItem>
        })
    }

    const handleKeyUp = async (e) => {
        if(e.key === 'Enter') {
            await getEventList();
        }
    }

    const handleClickReset = () => {
        setSearch(defaultSearchEventModel())
    };

    const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAllLists(event.target.checked);
        setSelectedLists(event.target.checked
            ? lists.map((list) => list.id)
            : []);
    };

    const handleSelectOneList = (
        event: ChangeEvent<HTMLInputElement>,
        listId: number
    ): void => {
        setSelectedAllLists(false)
        if (!selectedLists.includes(listId)) {
            setSelectedLists((prevSelected) => [...prevSelected, listId]);
        } else {
            setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
        }
    };

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setSearch({
            ...search,
            page: newPage,
        });
        setRequestList(!requestList)
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSearch({
            ...search,
            size: parseInt(event.target.value, 10),
        });
        setRequestList(!requestList)
    };

    const handleDelete = async (): Promise<void> => {
        if (_.isEmpty(selectedLists)) {
            toast.error('선택된 내역이 없습니다.');
        } else {
            if (window.confirm('삭제하시겠습니까?')) {
                console.log('delete', selectedLists)
                const result = await eventPopupApi.deleteEventPopup(selectedLists)
                if(result === 204){
                    toast.success('삭제되었습니다.');
                    setSelectedLists([]);
                    setRequestList(true)
                }
            }
        }
    }


    useEffect(() => {
        (async () => {
            await getEventList();
            setRequestList(false)
        })()
    }, [requestList]);

    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 0,
        });
        setRequestList(true);
    }

    return (
        <>
            <Head>
                Event Popup | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{mb: 4}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    팝업 광고 리스트
                                </Typography>
                            </Grid>
                            <Grid>
                                <Button variant="contained"
                                        startIcon={<PlusIcon />}
                                        size="small"
                                        onClick={handleClick}
                                >
                                    팝업 광고 등록
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Card sx={{mb: 1, py: 1}}>
                        <CardContent sx={{py: 1}}>
                            <Stack direction="row">
                                <TextField
                                    label="ID"
                                    variant='standard'
                                    sx={{width: 150,mr: 5}}
                                    value={search.id == null ? '' : search.id}
                                    onChange={handleSearch("id")}
                                    onKeyUp={handleKeyUp}
                                />

                                <TextField
                                    label='광고 Title'
                                    variant='standard'
                                    sx={{width: 300}}
                                    value={search.title == null ? '' : search.title}
                                    onChange={handleSearch("title")}
                                    onKeyUp={handleKeyUp}
                                />
                                <Stack justifyContent={"center"}
                                       sx={{mt: 2, mr: 2, ml: 3}}>
                                    <FormLabel component="legend">게시 기간 및 시간</FormLabel>
                                </Stack>
                                <Stack sx={{mt: 2, ml: 1 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={search.startDate}
                                            inputFormat={"yyyy-MM-dd HH:mm"}
                                            mask={"____-__-__ __:__"}
                                            minDate={search.displayStatus === '전시예정' ? new Date() : null}
                                            readOnly={search.displayStatus === '전시중' || search.displayStatus === '전시예정' }
                                            onChange={handleChangeDate('startDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                variant="standard"
                                                                                sx={{width: 200}} />}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack sx={{mt: 2,mr: 2, ml: 2}}>
                                    ~
                                </Stack>
                                <Stack sx={{mt: 2 }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={search.expireDate}
                                            inputFormat={"yyyy-MM-dd HH:mm"}
                                            mask={"____-__-__ __:__"}
                                            readOnly={search.displayStatus === '전시중' || search.displayStatus === '전시예정'}
                                            onChange={handleChangeDate('expireDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                variant="standard"
                                                                                sx={{width: 200}} />}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, ml: 5, mt: 1.5}}>
                                    <FormLabel
                                        component="legend">전시 상태</FormLabel>
                                </Stack>
                                <Select
                                    sx={{width: 160, mt: 1.5}}
                                    size={"small"}
                                    value={search.displayStatus}
                                    onChange={handleSearch('displayStatus')}
                                >
                                    <MenuItem value={'all'}>전체</MenuItem>
                                    {renderTypes()}
                                </Select>
                            </Stack>
                            <Stack direction="row"
                                   justifyContent={"flex-end"}
                                   sx={{ mt: 2}}>
                                <Button size='small'
                                        variant="outlined"
                                        sx={{mr: 0.5}}
                                        onClick={handleClickReset}
                                >
                                    초기화
                                </Button>
                                <Button size='small'
                                        color="primary"
                                        variant="contained"
                                        sx={{mr: 0.5}}
                                        startIcon={<SearchIcon />}
                                        onClick={handleClickSearch}
                                >
                                    검색
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Divider />
                    <Card>
                        <CardContent>
                            <EventList
                                lists={lists}
                                count={count}
                                getEventList={getEventList}
                                handleSelectAllLists={handleSelectAllLists}
                                selectedLists={selectedLists}
                                selectedAllLists={selectedAllLists}
                                handleSelectOneList={handleSelectOneList}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPage={search.size}
                                page={search.page}
                                handleDelete={handleDelete}
                            />
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    )
}

EventPopup.getLayout = (page ) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default EventPopup;