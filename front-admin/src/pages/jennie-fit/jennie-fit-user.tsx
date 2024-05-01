import React, {ChangeEvent, useCallback, useContext, useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {JennieFitKanbanColumn} from "../../components/jennie-fit/jennie-fit-kanban-column";
import {jennieFitUserAssignmentApi} from "../../api/jennie-fit-user-assignment-api";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DataContext} from "../../contexts/data-context";
import {getDataContextValue} from "../../utils/data-convert";
import {CategoryDialog} from "../../components/dialog/category-dialog";
import {decode} from "../../utils/jwt";

interface Search {
    categoryId: number;
    categoryName: string;
    id: string;
    priorityType: string;
    registrationType: string;
    statusIn: string[];
    startDate: Date;
    endDate: Date;
    workerId?: string;
    size?: number;
    page?: number;
    userDressId: string;
    maskless: boolean;
    isAi: boolean;
    extraOption: string;
}

const defaultSearch = () => {
    return {
        categoryId: null,
        categoryName: '',
        id: '',
        priorityType: '',
        registrationType: '',
        statusIn: ['REQUESTED', 'ASSIGNED', 'REJECTED'],
        startDate: null,
        endDate: null,
        userDressId: '',
        maskless: null,
        isAi: null,
        extraOption: '',
        page: 0,
        size: 20
    }
}

const JennieFitUser: NextPage = () => {
    const dataContext = useContext(DataContext);
    const TARGET = 'USER';
    const boxRef = useRef<HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = useState<Search>(defaultSearch());
    const [requestList, setRequestList] = useState<boolean>(true);
    const [columns, setColumns] = useState({
        assign: [],
        inspection: [],
        reject: [],
        complete: [],
    });



    const [isLoading, setIsLoading] = useState<boolean>(true);


    const initColumns = () => {
        setSearch({...search, page: 0});
        search.page = 0
        columns.assign = []
        columns.inspection = []
        columns.reject = []
        columns.complete = []
        setColumns(columns)

        getFetchData();
    }
    const setLoadingTrue = () => {
        setIsLoading(true);
        getFetchData();
    }
    const fetchMoreData = () => {
        setIsLoading(true);
        setIsLoading(false);
    }

    const _infiniteScroll = useCallback(() => {
        let client = boxRef.current
        let scrollHeight = Math.max(client.scrollHeight, document.body.scrollHeight);
        let scrollTop = Math.max(client.scrollTop, document.body.scrollTop);
        let clientHeight = client.clientHeight;

        scrollHeight -= 80;
        if (scrollTop + clientHeight >= scrollHeight && isLoading === false) {
            setLoadingTrue();
        }
    }, [isLoading]);

    const getColumnsListCount = () => {
        let count = 0;
        count = columns.assign.length + columns.complete.length + columns.reject.length + columns.inspection.length;
        return (count === search.page * 20)
    }

    const getFetchData = async () => {
        const query = {
            ...search
        }
        if (isMaster() === undefined) {
            query.workerId = localStorage.getItem('userId');
        }
        const result = await jennieFitUserAssignmentApi.getJennieFitAssignmentsWithUserDress(query);
        if (!getColumnsListCount()) {
            setIsLoading(false)
            return
        }
        setSearch({...search, page: search.page + 1})

        const assign = columns.assign;
        const inspection = columns.inspection;
        const reject = columns.reject;
        const complete = columns.complete;
        result.lists.forEach(item => {
            // @ts-ignore
            switch (item.status) {
                case 'ASSIGNED':
                    assign.push(item);
                    break;
                case 'REQUESTED':
                    inspection.push(item);
                    break;
                case 'REJECTED':
                    reject.push(item);
                    break;
                case 'COMPLETED':
                    complete.push(item);
                    break;
            }
        });
        setColumns({
            assign,
            inspection,
            reject,
            complete,
        })
        if (search.size > result.lists.length) {
            return;
        }
        await fetchMoreData();
    }

    useEffect(() => {
        getFetchData();
    }, []);

    useEffect(() => {
        let client = boxRef.current
        client.addEventListener('scroll', _infiniteScroll, true);
        return () => client.removeEventListener('scroll', _infiniteScroll, true);
    }, [_infiniteScroll]);

    const handleChange =
        (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
            setSearch({...search, [prop]: event.target.value});
        };

    const handleStatusChange = (event: SelectChangeEvent<typeof search.statusIn>) => {
        const {
            target: {value},
        } = event;
        setSearch({...search, statusIn: typeof value === 'string' ? value.split(',') : value});
    };

    const handleChangeDate =
        (prop: keyof Search) => (value) => {
            setSearch({...search, [prop]: value});
        };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                categoryId: value.id,
                categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpen(false);
    };

    const handleClickClearCategory = () => {
        setSearch({
            ...search,
            categoryId: null,
            categoryName: ''
        });
    };

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };

    const handleRefreshList = async (): Promise<void> => {
        setRequestList(true);
    };

    const isMaster = () => {
        return (decode(localStorage.getItem("accessToken")).auth.split(",").find(role => role === 'ROLE_ADMIN_MASTER'));
    };

    const renderPriority = () => {
        return Object.keys(dataContext.ASSIGN_PRIORITY).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext.ASSIGN_PRIORITY[key]}</MenuItem>)
        });
    }

    const renderStatus = () => {
        return Object.keys(dataContext.ASSIGN_STATUS).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext.ASSIGN_STATUS[key]}</MenuItem>)
        });
    }

    const handleKeyUp = async (e) => {
        if (e.key === 'Enter') {
            await initColumns();
            await getFetchData();
        }
    }

    const handleChangeExtraOption = () => (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value == 'maskX') {
            setSearch({...search, maskless: true, isAi: false, extraOption: event.target.value});
        } else if (event.target.value == 'ai') {
            setSearch({...search, isAi: true, maskless: false, extraOption: event.target.value});
        } else {
            setSearch({...search, maskless: null, isAi: null, extraOption: ''});
        }
    };

    const renderRegistrationType = () => {
        return Object.keys(dataContext.USER_DRESS_REGISTRATION_TYPE).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext.USER_DRESS_REGISTRATION_TYPE[key]}</MenuItem>)
        });
    }


    return (
        <>
            <Head>
                Style | Style Bot
            </Head>
            <Box
                ref={boxRef}
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 2,
                    maxHeight: 880,
                    overflowY: 'scroll'
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{mb: 1}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    Jennie Fit User
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box>
                        <Stack direction="row"
sx={{mb: 3}}>
                            <Stack>
                                <FormControl sx={{m: 1, width: '30ch'}}
                                             variant="standard">
                                    <InputLabel htmlFor="standard-adornment-password">카테고리</InputLabel>
                                    <Input
                                        type='text'
                                        value={search.categoryName}
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
                                                    onClick={handleClickOpen}
                                                >
                                                    <SearchIcon/>
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Stack>
                            <Stack direction="row"
                                   sx={{mr: 2, ml: 1.5, mt: 1}}>
                                <Stack justifyContent={"center"}
sx={{mr: 2}}>
                                    <FormLabel component="legend">작업유형</FormLabel>
                                </Stack>
                                <Stack direction="row">
                                    <Select
                                        sx={{width: 100, height: 50, mt: 1}}
                                        size={"small"}
                                        value={search.priorityType}
                                        onChange={handleChange('priorityType')}
                                    >
                                        <MenuItem value={''}>-</MenuItem>
                                        {renderPriority()}
                                    </Select>
                                </Stack>
                            </Stack>
                            <Stack>
                                <TextField
                                    label="ID"
                                    variant="standard"
                                    value={search.userDressId}
                                    onChange={handleChange('userDressId')}
                                    onKeyUp={handleKeyUp}
                                    sx={{m: 1}}
                                />
                            </Stack>
                            <Stack direction="row"
                                   sx={{mr: 2, ml: 1.5, mt: 1}}>
                                <Stack justifyContent={"center"}
sx={{mr: 2}}>
                                    <FormLabel component="legend">추가옵션</FormLabel>
                                </Stack>
                                <Stack direction="row">
                                    <Select
                                        sx={{width: 100, height: 50, mt: 1}}
                                        size={"small"}
                                        value={search.extraOption}
                                        onChange={handleChangeExtraOption()}
                                    >
                                        <MenuItem value={''}>-</MenuItem>
                                        <MenuItem value={'maskX'}>MASK X</MenuItem>
                                        <MenuItem value={'ai'}>AI 처리</MenuItem>
                                    </Select>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction="row">
                            <Stack justifyContent={"center"}
                                   sx={{mr: 1, ml: 1}}>
                                <FormLabel component="legend">작업일</FormLabel>
                            </Stack>
                            <Stack sx ={{mt: 1}}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        inputFormat={"yyyy-MM-dd"}
                                        mask={"____-__-__"}
                                        value={search.startDate}
                                        onChange={handleChangeDate('startDate')}
                                        renderInput={(params) => <TextField {...params}
                                                                            variant="standard"
                                                                            sx={{width: 150}}/>}
                                    />
                                </LocalizationProvider>
                            </Stack>
                            <Stack sx={{mr: 1, ml: 1, mt: 1}}>
                                ~
                            </Stack>
                            <Stack sx ={{mt: 1}}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        inputFormat={"yyyy-MM-dd"}
                                        mask={"____-__-__"}
                                        value={search.endDate}
                                        onChange={handleChangeDate('endDate')}
                                        renderInput={(params) => <TextField {...params}
                                                                            variant="standard"
                                                                            sx={{width: 150}}/>}
                                    />
                                </LocalizationProvider>
                            </Stack>
                            <Stack direction="row"
                                   sx={{mr: 1, ml: 2.5}}>
                                <Stack justifyContent={"center"}
sx={{mr: 2}}>
                                    <FormLabel component="legend">작업상태</FormLabel>
                                </Stack>
                                <Stack direction="row">
                                    <Select
                                        size={"small"}
                                        value={search.statusIn}
                                        onChange={handleStatusChange}
                                        multiple
                                    >
                                        <MenuItem value={''}>-</MenuItem>
                                        {renderStatus()}
                                    </Select>
                                </Stack>
                            </Stack>
                            <Stack direction="row"
                                   sx={{mr: 1, ml: 1.5}}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 1}}>
                                    <FormLabel component="legend">등록자</FormLabel>
                                </Stack>
                                <Stack direction="row">
                                    <Select
                                        sx={{minWidth: 220, height: 50}}
                                        value={search.registrationType}
                                        size={"small"}
                                        onChange={handleChange('registrationType')}
                                    >
                                        <MenuItem value={''}>-</MenuItem>
                                        {renderRegistrationType()}
                                    </Select>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction="row"
                               justifyContent={"flex-end"}
                               sx={{mb: 1, mt:3}}>
                            <Button size='small'
                                    variant="outlined"
                                    sx={{mr: 1}}
                                    onClick={handleClickReset}>
                                초기화
                            </Button>
                            <Button size='small'
                                    variant="contained"
                                    startIcon={<SearchIcon />}
                                    onClick={() => {
                                        initColumns();
                                    }}>
                                검색
                            </Button>
                        </Stack>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                            flexShrink: 1,
                            overflowX: 'auto',
                            overflowY: 'hidden'
                        }}
                    >
                        <JennieFitKanbanColumn name={'배정됨'}
                                               items={columns.assign}
                                               target={TARGET}
                                               refreshList={handleRefreshList}/>
                        <JennieFitKanbanColumn name={'검수신청'}
                                               items={columns.inspection}
                                               target={TARGET}
                                               refreshList={handleRefreshList}/>
                        <JennieFitKanbanColumn name={'반려'}
                                               items={columns.reject}
                                               target={TARGET}
                                               refreshList={handleRefreshList}/>
                        <JennieFitKanbanColumn name={'승인'}
                                               items={columns.complete}
                                               target={TARGET}
                                               refreshList={handleRefreshList}/>
                    </Box>
                </Container>
                <CategoryDialog
                    open={open}
                    onClose={handleClose}
                    category={dataContext.CATEGORY}
                    value={search.categoryId}
                />
            </Box>
        </>
    )
}

JennieFitUser.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default JennieFitUser;
