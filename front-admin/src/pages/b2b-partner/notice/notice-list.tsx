import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import {useRouter} from "next/router";
import React, {ChangeEvent, MouseEvent, useEffect, useState} from "react";
import {Box, Button, Card, Container, Divider, FormLabel, Grid, Stack, TextField, Typography} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NoticeListDetail from "../../../components/b2b-partner/notice/notice-list-detail";
import {defaultSearchNotice, NoticeListModel, SearchNotice} from "../../../types/b2b-partner-model/notice-model";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {noticeApi} from "../../../b2b-partner-api/notice-api";
import {Plus as PlusIcon} from "../../../icons/plus";

const NoticeList: NextPage = () => {
    const router = useRouter();
    const {storeSearch} = router.query;

    const [data, setData] = useState<NoticeListModel[]>([])
    const [count, setCount] = useState<number>(0);
    const [search, setSearch] = useState<SearchNotice>(defaultSearchNotice)
    const [requestList, setRequestList] = useState<boolean>(false);

    useEffect(() => {
        if (storeSearch === 'true') {
            const NoticeListSearch = sessionStorage.getItem('NoticeListSearch');
            setSearch(JSON.parse(NoticeListSearch));
        }
        setRequestList(true);
    },[]);

    useEffect(
        () => {
            sessionStorage.setItem('NoticeListSearch', JSON.stringify(search));
        },
        [search]
    );

    const moveToPage = () =>{
        router.push(`/b2b-partner/notice/create-notice`);
    }

    useEffect(() => {
        if(requestList) {
            getNotices();
            setRequestList(false);
        }
    }, [requestList])

    const getNotices = async () => {
        await noticeApi.getNoticeList(search).then((res) => {
            setData(res.lists);
            setCount(res.count);
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleSearch = (prop: keyof SearchNotice) => (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({...search, [prop] : event.target.value})
    };

    const handleKeyUp = async (e) => {
        if(e.key === 'Enter') {
            setRequestList(true);
        }
    }

    const handleClickReset = () => {
        setSearch(defaultSearchNotice);
    }

    const handleClickSearch = () => {
        setSearch({
            ...search,
            page: 0,
        });
        setRequestList(true);
    }

    //pagination
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

    const handleChangeDate = (prop: keyof SearchNotice) => (value) => {
        setSearch({ ...search, [prop]: value});
    };

    return (
        <>
            <div>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 2
                    }}>
                    <Container maxWidth="xl">
                        <Box sx={{mb: 1, py: 2, ml: 3, mt: 2}}>
                            <Grid
                                container
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Typography variant="h4">
                                    공지사항
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<PlusIcon />}
                                    onClick={moveToPage}>
                                    공지사항 추가
                                </Button>
                            </Grid>
                        </Box>
                        <Grid container>
                            <Grid sx={{width: "100%"}}>
                                <Card>
                                    <Stack direction="row"
                                           sx={{ml: 1, mt: 2}}>
                                        <Stack sx={{ml: 4}}>
                                            <TextField
                                                label='제목'
                                                variant='standard'
                                                sx={{width: 200}}
                                                value={search.title == null ? '' : search.title}
                                                onChange={handleSearch("title")}
                                                onKeyUp={handleKeyUp}
                                            />
                                        </Stack>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, ml: 2, mt: 2}}>
                                            <FormLabel component="legend">등록일</FormLabel>
                                        </Stack>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, ml: 2, mt: 2}}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    value={search.startDate}
                                                    inputFormat={"yyyy-MM-dd"}
                                                    mask={"____-__-__"}
                                                    onChange={handleChangeDate('startDate')}
                                                    maxDate={new Date(new Date().setDate(new Date().getDate()))}
                                                    renderInput={(params) => <TextField {...params}
                                                                                        variant="standard"
                                                                                        sx={{width: 150}}/>}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                        <Stack sx={{mr: 1, ml: 1, mt: 3}}>
                                            ~
                                        </Stack>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, ml: 2, mt: 2}}>
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    value={search.endDate}
                                                    inputFormat={"yyyy-MM-dd"}
                                                    mask={"____-__-__"}
                                                    onChange={handleChangeDate('endDate')}
                                                    maxDate={new Date(new Date().setDate(new Date().getDate()))}
                                                    renderInput={(params) => <TextField {...params}
                                                                                        variant="standard"
                                                                                        sx={{width: 150}}/>}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row"
                                           justifyContent={"flex-end"}
                                           sx={{mb: 3, mr: 2}}>
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
                                    <Divider/>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                    <Container maxWidth="xl">
                        <Box sx={{mb: 1, py: 2, ml: 3, mt: 2}}>
                            <NoticeListDetail
                                lists={data}
                                count={count}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPage={search.size}
                                page={search.page}
                            />
                        </Box>
                    </Container>
                </Box>
            </div>
        </>
    )
};

NoticeList.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default NoticeList;