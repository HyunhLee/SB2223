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
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import Head from "next/head";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import React, {ChangeEvent, MouseEvent, useEffect, useRef, useState} from "react";
import {NextPage} from "next";
import {SearchWordsList} from "../../components/popular-search-words-component/search-words-list";
import {popularSearchWordsApi} from "../../api/popular-search-words-api";
import {PopularSearchWordsModel} from "../../types/popular-search-words";
import {useRouter} from "next/router";
import {Plus as PlusIcon} from "../../icons/plus";

interface Search {
    id: number;
    description: string;
    activated: boolean;
    displayStatus: string;
    keywordItems: [];
    keywordItemKeyword: string;
    createdBy: string;
    createdDate: Date;
    lastModifiedBy: string
    lastModifiedDate?: Date;
    startDate: Date;
    expireDate: Date;
}

const PopularSearchWords: NextPage = () => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const {storeSearch} = router.query;
    const [page, setPage] = useState(0);
    const [size, setSize] = useState<number>(5);
    const [count, setCount] = useState<number>(0);
    const [lists, setLists] = useState<PopularSearchWordsModel[]>([]);
    const [requestList, setRequestList] = useState<boolean>(false);
    const [search, setSearch] = useState<Search>({
        id: null,
        description: "",
        activated: true,
        displayStatus: "",
        keywordItems: [],
        keywordItemKeyword: "",
        createdBy: "",
        createdDate: null,
        lastModifiedBy: "",
        lastModifiedDate: null,
        startDate: null,
        expireDate: null
    });

    useEffect(() => {
        if (storeSearch === 'true') {
            const popularWordsSearch = sessionStorage.getItem('PopularWordsSearch');
            let style = JSON.parse(popularWordsSearch)
            setSearch(style);
        }
        setRequestList(true);
    },[]);

    useEffect(
        () => {
            sessionStorage.setItem('PopularWordsSearch', JSON.stringify(search));
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
                size, page, ...search
            }
            const result = await popularSearchWordsApi.getPopularSearchWords(query);
            setLists(result.lists);
            setCount(result.count);
            console.log(result)
        } catch (err) {
            console.error(err);
        }
    }

    const handleChangeDate = (prop: keyof Search) => (value) => {
        setSearch({ ...search, [prop]: value });
    };

    const handleClickReset = () => {
        setSearch({
            id: null,
            description: "",
            activated: true,
            displayStatus: "",
            keywordItems: [],
            keywordItemKeyword: "",
            createdBy: "",
            createdDate: null,
            lastModifiedBy: "",
            lastModifiedDate: null,
            startDate: null,
            expireDate: null
        });
    };

    const getStatus = () => {
        return (search.displayStatus) ? search.displayStatus : '';
    }

    const changeStatusHandler = (value): void => {
        setSearch(prevData => ({
            ...prevData,
            displayStatus: value
        }))
    }

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        console.log('newPage', newPage);
        setPage(newPage);
        setRequestList(true);
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSize(parseInt(event.target.value, 10));
        setRequestList(true);
    };

    useEffect(() => {
        setRequestList(true);
    },[]);

    const handleSearch = (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({ ...search, [prop]: event.target.value });
    };

    const handleClick = () => {
        router.push(`/popular-search-words/search-words-registration`);
    }

    const handleKeyUp = async (e) => {
        if(e.key === 'Enter') {
            setPage(0);
            await getLists();
        }
    }

    const handleClickSearch = async () => {
        setPage(0);
        setRequestList(true);
    }

    return (
        <>
            <Head>
                Popular Search Words | Style Bot
            </Head>
            <Box
                component="main"
                ref={rootRef}
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{mb: 4}}>
                        <Stack direction={'row'}
sx={{justifyContent: "space-between"}}>
                            <Grid item>
                                <Typography variant="h4">
                                    인기 키워드 리스트
                                </Typography>
                            </Grid>
                            <Grid>
                                <Button variant="contained"
                                        sx={{mt: 0.5}}
                                        startIcon={<PlusIcon />}
                                        size="small"
                                        onClick={handleClick}>
                                    인기 키워드 등록
                                </Button>
                            </Grid>
                        </Stack>
                    </Box>
                    <Divider />
                    <Card sx={{mb: 1, py: 1}}>
                        <CardContent sx={{py: 1}}>
                            <Stack direction="row"
                                   sx={{ mb: 2 }}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 1}}>
                                    <FormLabel component="legend">게시 기간</FormLabel>
                                </Stack>
                                <Stack sx={{ml: 1}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={search.startDate}
                                            inputFormat={"yyyy-MM-dd"}
                                            mask={"____-__-__"}
                                            onChange={handleChangeDate('startDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                variant="standard"
                                                                                sx={{width: 150}} />}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack sx={{mr: 1, ml: 1}}>
                                    ~
                                </Stack>
                                <Stack>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={search.expireDate}
                                            inputFormat={"yyyy-MM-dd"}
                                            mask={"____-__-__"}
                                            onChange={handleChangeDate('expireDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                variant="standard"
                                                                                sx={{width: 150}} />}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                            </Stack>
                            <Stack direction='row'
                                   sx={{ mt: 2, mb: 2 }}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 1}}>
                                    <FormLabel component="legend">전시 상태</FormLabel>
                                </Stack>
                                <Select
                                    value={getStatus()}
                                    size={"small"}
                                    onChange={e=> {changeStatusHandler(e.target.value)}}
                                >
                                    <MenuItem value={''}>전체</MenuItem>
                                    <MenuItem value={'DISPLAY_ON'}>전시중</MenuItem>
                                    <MenuItem value={'DISPLAY_END'}>전시 중지</MenuItem>
                                    <MenuItem value={'DISPLAY_WAIT'}>전시 예정</MenuItem>
                                </Select>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 1}}>
                                    <TextField
                                        label='TITLE 검색'
                                        variant='standard'
                                        value={search.description == null ? '' : search.description}
                                        onChange={handleSearch("description")}
                                        onKeyUp={handleKeyUp}
                                    />
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 1}}>
                                    <TextField
                                        label='인기 키워드 검색'
                                        variant='standard'
                                        value={search.keywordItemKeyword == null ? '' : search.keywordItemKeyword}
                                        onChange={handleSearch("keywordItemKeyword")}
                                        onKeyUp={handleKeyUp}
                                    />
                                </Stack>
                            </Stack>
                            <Stack direction="row"
                                   justifyContent={"flex-end"}
                                   sx={{ mt: 2 }}>
                                <Button size='small'
                                        variant="outlined"
                                        sx={{mr: 0.5}}
                                        onClick={handleClickReset}>
                                    초기화
                                </Button>
                                <Button size='small'
                                        color="primary"
                                        variant="contained"
                                        sx={{mr: 0.5}}
                                        startIcon={<SearchIcon />}
                                        onClick={handleClickSearch}>
                                    검색
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Divider />
                    <Card>
                        <CardContent>
                            <SearchWordsList
                                lists={lists}
                                count={count}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPage={size}
                                page={page}
                                getLists={getLists}
                            />
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    )
};

PopularSearchWords.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default PopularSearchWords;