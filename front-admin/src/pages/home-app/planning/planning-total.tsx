import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from '@mui/icons-material/Settings';
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import React, {ChangeEvent, MouseEvent, useEffect, useState} from "react";
import {NewPlanningModel} from "../../../types/home-app-model/new-planning-model";
import {PlanningTotalList} from "../../../components/home-app-component/planning/planning-total-list";
import {useRouter} from "next/router";
import {toast} from "react-hot-toast";
import {newPlanningApi} from "../../../api/new-planning-api";
import {Plus as PlusIcon} from "../../../icons/plus";

interface Search {
    size: number;
    page: number;
    id: number;
    title: string;
    startDate: Date;
    expireDate: Date;
    displayStatus:string;
    activated: boolean;
}

const defaultSearch = () => {
    return {
        page: 0,
        size: 10,
        id: null,
        title:'',
        startDate: null,
        expireDate: null,
        displayStatus:'',
        activated: true
    }
}

const PlanningTotal: NextPage = () => {
    const router = useRouter();
    const {storeSearch} = router.query;
    const [count, setCount] = useState<number>(0);
    const [list, setLists] = useState<NewPlanningModel[]>([]);
    const [search, setSearch] = useState<Search>(defaultSearch());
    const [requestList, setRequestList] = useState<boolean>(true);

    useEffect(() => {
        if (storeSearch === 'true') {
            const PlanningTotalSearch = sessionStorage.getItem('PlanningTotalSearch');
            setSearch(JSON.parse(PlanningTotalSearch));
        }
        setRequestList(true);
    },[]);

    useEffect(
        () => {
            sessionStorage.setItem('PlanningTotalSearch', JSON.stringify(search));
        },
        [search]
    );

    useEffect(
        () => {
            (async () => {
                if (requestList) {
                    await getLists()
                    setRequestList(false);
                }
            })()
        },
        [requestList]
    );

    const getLists = async () => {
        try {
            const query = {
                ...search
            }
            const result = await newPlanningApi.getExhibitionList(query);
            setLists(result.lists);
            setCount(result.count);
        } catch (err) {
            console.error(err);
            toast.error('데이터를 불러오는데 실패하였습니다.');
        }
    }

    const handleRefreshList = async (): Promise<void> => {
        setRequestList(true);
    };

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        console.log(newPage)
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

    const handleChange = (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({ ...search, [prop]: event.target.value });
    };

    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 0,
        });
        setRequestList(true);
    }

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };

    const handleKeyUp = (e) => {
        if(e.key === 'Enter') {
            handleClickSearch()
        }
    }

    const handleChangeDate = (prop: keyof Search) => (value) => {
        setSearch({ ...search, [prop]: value });
    };

    const getDisplayStatus = () => {
        return (search.displayStatus) ? search.displayStatus : '';
    }

    const changeDisplayStatus = (value) => {
        if(value === 'Display_On'){
            setSearch({...search, displayStatus: value})
        }else if(value === 'Display_End'){
            setSearch({...search, expireDate: new Date(), startDate: null, displayStatus: value})
        }else if(value === 'Display_Wait'){
            setSearch({...search, startDate: new Date(), expireDate : null, displayStatus: value})
        }else{
            setSearch({ ...search, startDate:null, expireDate: null, displayStatus: value});
        }
    }

    const handleDisplay = () => {
        router.push(`/home-app/planning/plan-management`);
    }

    const handleNewPlan = () => {
        router.push(`/home-app/planning/new-planning`);
    }

    return (
        <>
            <Head>
                Planning Total | Style Bot
            </Head>
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
                            <Stack direction={"row"}
justifyContent={'space-between'}>
                                <Stack direction={"row"}>
                                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Typography variant="h4">{"기획전 리스트"}</Typography>
                                    </Grid>
                                </Stack>
                                <Stack direction="row"
                                       justifyContent={"flex-end"}>
                                    <Button size='small'
                                            color="info"
                                            variant="contained"
                                            startIcon={<SettingsIcon />}
                                            sx={{height: 45, mt: 1, mr: 2, p: 1}}
                                            onClick={handleDisplay}>
                                        진열 관리
                                    </Button>
                                    <Button size='small'
                                            color="primary"
                                            variant="contained"
                                            startIcon={<PlusIcon />}
                                            sx={{height: 45, mt: 1, mr: 0.5, p: 1}}
                                            onClick={handleNewPlan}>
                                        신규 기획전 등록
                                    </Button>
                                </Stack>
                            </Stack>
                            <Stack direction="row">
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 4}}>
                                    <TextField
                                        label="Title"
                                        variant="standard"
                                        value={search.title==null?'':search.title}
                                        onChange={handleChange('title')}
                                        onKeyUp={handleKeyUp}
                                        sx={{ m: 1 }}
                                    />
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, ml: 1, mt: 2}}>
                                    <FormLabel component="legend">게시 기간</FormLabel>
                                </Stack>
                                <Stack sx={{mt: 3}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={search.startDate}
                                            inputFormat={"yyyy-MM-dd HH:mm"}
                                            mask={"____-__-__ __:__"}
                                            onChange={handleChangeDate('startDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                variant="standard"
                                                                                sx={{width: 200}} />}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack sx={{mr: 1, ml: 1, mt: 3}}>
                                    ~
                                </Stack>
                                <Stack sx={{mt: 3}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={search.expireDate}
                                            inputFormat={"yyyy-MM-dd HH:mm"}
                                            mask={"____-__-__ __:__"}
                                            onChange={handleChangeDate('expireDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                variant="standard"
                                                                                sx={{width: 200}} />}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                            </Stack>
                            <Stack direction="row"
                                   sx={{mb: 1, mt:2}}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 5, mt:1}}>
                                    <FormLabel component="legend">전시상태</FormLabel>
                                </Stack>
                                <Select
                                    size={"small"}
                                    sx={{mr: 5}}
                                    value={getDisplayStatus()}
                                    onChange={(e) => {changeDisplayStatus(e.target.value)}}
                                >
                                    <MenuItem value={''}>전체</MenuItem>
                                    <MenuItem value={'Display_On'}>전시중</MenuItem>
                                    <MenuItem value={'Display_Wait'}>전시예정</MenuItem>
                                    <MenuItem value={'Display_End'}>전시종료</MenuItem>
                                </Select>
                                <TextField
                                    label="ID"
                                    variant="standard"
                                    value={search.id==null?'':search.id}
                                    onChange={handleChange('id')}
                                    onKeyUp={handleKeyUp}
                                    sx={{ m: 1 }}
                                />
                            </Stack>
                            <Stack direction="row"
                                   justifyContent={"flex-end"}>
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
                        <PlanningTotalList
                            lists={list}
                            count={count}
                            refreshList={handleRefreshList}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPage={search.size}
                            page={search.page}
                            getLists={getLists}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

PlanningTotal.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default PlanningTotal;