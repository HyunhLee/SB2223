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
import {styled} from "@mui/material/styles";
import {inquiryApi} from "../../api/inquiry-api";
import {InquiryModel} from "../../types/inquiry";
import {InquiryList} from "../../components/inquiry-components/inquiry-list";
import {InquiryDrawer} from "../../components/inquiry-components/inquiry-drawer";

interface Search {
    id: number;
    userId: number;
    userName: string;
    type: string;
    contents: string;
    answer: string;
    status: string;
    startDate?: Date;
    endDate?: Date;
}

const InquiryListInner = styled(
    'div',
    { shouldForwardProp: (prop) => prop !== 'open' }
)<{ open?: boolean; }>(
    ({ theme, open }) => ({
        flexGrow: 1,
        overflow: 'hidden',
        paddingBottom: theme.spacing(8),
        paddingTop: theme.spacing(0),
        zIndex: 1,
        [theme.breakpoints.up('xl')]: {
            marginRight: 0
        },
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        ...(open && {
            [theme.breakpoints.up('xl')]: {
                marginRight: 0
            },
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            })
        })
    })
);

const Inquiry: NextPage = () => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState<number>(5);
    const [count, setCount] = useState<number>(0);
    const [lists, setLists] = useState<InquiryModel[]>([]);
    const [requestList, setRequestList] = useState<boolean>(false);
    const [search, setSearch] = useState<Search>({
        id: null,
        userName: '',
        userId: null,
        type: '',
        contents: '',
        answer: '',
        status: '',
        startDate: null,
        endDate: null
    });
    const [drawer, setDrawer] = useState<{ isOpen: boolean; inquiryId?: number; }>({
        isOpen: false,
        inquiryId: null
    });

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
            if (query.type) {
                query.type = search.type;
            }
            const result = await inquiryApi.getInquiries(query);
            setLists(result.lists);
            setCount(result.count);
            console.log(query)
        } catch (err) {
            console.error(err);
        }
    }

    const getType = (checkValues) => {
        if (search.type) {
            const findValue = checkValues.find(value => search.type.includes(value));
            return (findValue) ? findValue : '';
        }
        return '';
    }

    const changeTypeHandler = (value, checkValues): void => {
        setSearch(prevData => ({
            ...prevData,
            type: value

        }))
    }

    const handleChangeDate = (prop: keyof Search) => (value) => {
        setSearch({ ...search, [prop]: value });
    };

    const getStatus = (checkValues) => {
        if (search.status) {
            const findValue = checkValues.find(value => search.status.includes(value));
            return (findValue) ? findValue : '';
        }
        return '';
    }

    const changeStatusHandler = (value, checkValues): void => {
        setSearch(prevData => ({
            ...prevData,
            status: value
        }))
    }

    const handleClickReset = () => {
        setSearch({
            id: null,
            userName: '',
            userId: null,
            type: '',
            contents: '',
            answer: '',
            status: '',
            startDate: null,
            endDate: null
        });
    };

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

    const handleOpenDrawer = (inquiryId: number): void => {
        setDrawer({
            isOpen: true,
            inquiryId
        });
    };

    const handleCloseDrawer = () => {
        setDrawer({
            isOpen: false,
            inquiryId: null
        });
    };

    const handleSearch = (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({ ...search, [prop]: event.target.value });
    };

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
                Inquiry | Style Bot
            </Head>
            <Box
                component="main"
                ref={rootRef}
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <InquiryListInner
                    open={drawer.isOpen}
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
                                        1:1 문의 관리
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider />
                        <Card sx={{mb: 1, py: 1}}>
                            <CardContent sx={{py: 1}}>
                                <Stack direction="row"
                                       sx={{ mb: 2 }}>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 1}}>
                                        <FormLabel component="legend">카테고리</FormLabel>
                                    </Stack>
                                    <Stack direction="row">
                                        <Select
                                            value={getType(['USER_DRESS', 'CLOSET', 'SHOPPING', 'MEMBER_INFO', 'ETC'])}
                                            size={"small"}
                                            onChange={e=> {changeTypeHandler(e.target.value, ['USER_DRESS', 'CLOSET', 'SHOPPING', 'MEMBER_INFO', 'ETC'])}}
                                        >
                                            <MenuItem value={''}>-</MenuItem>
                                            <MenuItem value={'USER_DRESS'}>내옷등록</MenuItem>
                                            <MenuItem value={'CLOSET'}>옷장관리</MenuItem>
                                            <MenuItem value={'SHOPPING'}>쇼핑</MenuItem>
                                            <MenuItem value={'MEMBER_INFO'}>사용자 정보</MenuItem>
                                            <MenuItem value={'ETC'}>기타</MenuItem>
                                        </Select>
                                    </Stack>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 1}}>
                                        <FormLabel component="legend">등록일</FormLabel>
                                    </Stack>
                                    <Stack>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={search.startDate}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleChangeDate('startDate')}
                                                maxDate={new Date(new Date().setDate(new Date().getDate()))}
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
                                                value={search.endDate}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleChangeDate('endDate')}
                                                maxDate={new Date(new Date().setDate(new Date().getDate()))}
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
                                        <FormLabel component="legend">답변 상태</FormLabel>
                                    </Stack>
                                    <Stack direction="row">
                                        <Select
                                            value={getStatus(['CLOSE', 'OPEN'])}
                                            size={"small"}
                                            onChange={e=> {changeStatusHandler(e.target.value, ['CLOSE', 'OPEN'])}}
                                        >
                                            <MenuItem value={''}>-</MenuItem>
                                            <MenuItem value={'CLOSE'}>답변완료</MenuItem>
                                            <MenuItem value={'OPEN'}>답변대기</MenuItem>
                                        </Select>
                                    </Stack>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 1}}>
                                        <TextField
                                            label='질문 검색'
                                            variant='standard'
                                            value={search.contents == null ? '' : search.contents}
                                            onChange={handleSearch("contents")}
                                            onKeyUp={handleKeyUp}
                                            sx={{ mt: -1, ml: 1 }}
                                        />
                                    </Stack>
                                </Stack>
                                <Stack direction="row"
                                       justifyContent={"flex-end"}
                                       sx={{ mt: 2 }}>
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
                        <Divider />
                        <Card>
                            <CardContent>
                                <InquiryList
                                    onOpenDrawer={handleOpenDrawer}
                                    lists={lists}
                                    count={count}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                    rowsPerPage={size}
                                    page={page}
                                />
                            </CardContent>
                        </Card>
                    </Container>
                </InquiryListInner>
                <InquiryDrawer
                    containerRef={rootRef}
                    onClose={handleCloseDrawer}
                    open={drawer.isOpen}
                    getLists={getLists}
                    inquiry={lists.find((inquiry) => inquiry.id === drawer.inquiryId)}
                />
            </Box>
        </>
    )
};

Inquiry.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default Inquiry;