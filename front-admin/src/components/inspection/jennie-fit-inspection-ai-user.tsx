import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
    Box,
    Button,
    Card,
    CardContent,
    Collapse,
    Container,
    FormControl,
    FormLabel,
    Grid,
    IconButton,
    IconButtonProps,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {DataContext} from "../../contexts/data-context";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {getDataContextValue} from "../../utils/data-convert";
import {CategoryDialog} from "../dialog/category-dialog";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {styled} from "@mui/material/styles";
import {JennieFitWorkerModel} from "../../types/jennie-fit-worker-model";
import {jennieFitUserAssignmentApi} from "../../api/jennie-fit-user-assignment-api";
import {JennieFitAssignmentModel} from "../../types/jennie-fit-assignment-model";
import {jennieFitWorkerApi} from "../../api/jennie-fit-worker-api";
import toast from 'react-hot-toast';
import {JennieFitInspectionAiUserList} from "./jennie-fit-inspection-ai-user-list";

interface Search {
    categoryKey: string;
    categoryName: string;
    categoryId: string;
    category1?: string;
    category2?: string;
    category3?: string;
    category4?: string;
    category5?: string;
    id: number;
    startDate: Date;
    endDate: Date;
    priorityType:string;
    status:string;
    workerId:number;
    userDressId:number;
    isAi: boolean;
}

const defaultSearch = () => {
    return {
        categoryKey: null,
        categoryName: '',
        categoryId: null,
        id: null,
        startDate: null,
        endDate: null,
        priorityType:'',
        status:'REQUESTED',
        workerId:null,
        userDressId:null,
        isAi: true
    }
}

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export const JennieFitInspectionAiUser: NextPage = () => {
    const [workType, setWorkType] = useState('FIT_USER');
    const [activated, setActivated] = useState(true);
    const [workerList, setWorkerList] = useState<JennieFitWorkerModel[]>([]);
    const [requestWorker, setRequestWorker] = useState<boolean>(false);



    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [pages, setPages] = useState(0);
    const [sizes, setSizes] = useState(10);
    const [sort, setSort] = useState('workStartDay,desc');
    const [expanded, setExpanded] = useState(true);

    const [assignUserUrgencylists, setUrgencyLists] = useState<JennieFitAssignmentModel[]>([]);
    const [urgencyCount, setUrgencyCount] = useState<number>(0);
    const [assignUserNormallists, setNormalLists] = useState<JennieFitAssignmentModel[]>([]);
    const [normalCount, setNormalCount] = useState<number>(0);

    const [requestList, setRequestList] = useState<boolean>(false);

    const [open, setOpen] = React.useState(false);

    const dataContext = useContext(DataContext);

    const [search, setSearch] = useState<Search>(defaultSearch());

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setPage(newPage);
        setRequestList(true);
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSize(parseInt(event.target.value, 10));
        setRequestList(true);
    };

    const handlePageChanges = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setPages(newPage);
        setRequestList(true);
    };

    const handleRowsPerPageChanges = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSizes(parseInt(event.target.value, 10));
        setRequestList(true);
    };

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
    useEffect(
        () => {
            (async () => {
                if (!requestWorker) {
                    await getWorkerLists()
                    setRequestList(false);
                }
            })()
        },
        [requestWorker]
    );

    const handleRefreshList = async (): Promise<void> => {
        setRequestList(true);
        setRequestWorker(true);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const getWorkerLists = async () => {
        try {

            const query = {
                activated, workType
            }

            const result = await jennieFitWorkerApi.getJennieFitWorkers(query);
            setWorkerList(result.lists);
        } catch (err) {
            console.error(err);
        }
    }

    const getLists = async () => {
        try {
            const query = {
                sort, size, page, ...search
            }
            query.priorityType = 'URGENCY';
            const urgencyResult = await jennieFitUserAssignmentApi.getJennieFitAssignmentsWithUserDress(query);
            setUrgencyLists(urgencyResult.lists);
            setUrgencyCount(urgencyResult.count);

            const querys = {
                sort, sizes, pages, ...search
            }
            querys.priorityType = 'NORMAL';
            const normalResult = await jennieFitUserAssignmentApi.getJennieFitAssignmentsWithUserDress(querys);
            setNormalLists(normalResult.lists);
            setNormalCount(normalResult.count);
        } catch (err) {
            console.error(err);
            toast.error('데이터를 불러오는데 실패하였습니다.');
        }
    }

    useEffect(() => {
        setRequestList(true);
    },[]);

    const handleChange =
        (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
            setSearch({ ...search, [prop]: event.target.value });
        };

    const handleChangeDate =
        (prop: keyof Search) => (value) => {
            setSearch({ ...search, [prop]: value });
        };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                categoryId: value.id,
                categoryKey: value.key,
                categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpen(false);
    };

    useEffect(() => {
        console.log(search);
    },[search]);

    const handleClickClearCategory = () => {
        setSearch({ ...search,
            categoryId: null,
            categoryKey: null,
            categoryName: ''
        });
    };

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };

    const getWorkerId = () => {
        return (search.workerId) ? search.workerId : null;
    }

    const changeWorkerHandler = (changeValues) => {
        setSearch(prevData => ({
            ...prevData,
            workerId: changeValues
        }))
    }

    const getStatus = () => {
        return (search.status) ? search.status : '';
    }

    const changeStatusHandler = (changeValues) => {
        setSearch(prevData => ({
            ...prevData,
            status: changeValues
        }))
    }

    const handleKeyUp = async (e) => {
        if(e.key === 'Enter') {
            setPage(0);
            setPages(0);
            await getLists();
        }
    }

    const handleClickSearch = async () => {
        setPage(0);
        setPages(0);
        setRequestList(true);
    }

    return (
        <>
            <Head>
                Style | Style Bot
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
                            <Collapse in={expanded}
                                      timeout="auto"
                                      unmountOnExit>
                                <Stack direction="row">
                                    <Stack>
                                        <FormControl sx={{ m: 1, width: '30ch' }}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">카테고리</InputLabel>
                                            <Input
                                                id="standard-adornment-password"
                                                type='text'
                                                value={search.categoryName}
                                                readOnly={true}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={handleClickClearCategory}
                                                        >
                                                            <ClearIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={handleClickOpen}
                                                        >
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Stack>

                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 3}}>
                                        <TextField
                                            label="ID"
                                            variant="standard"
                                            value={search.userDressId==null?'':search.userDressId}
                                            onChange={handleChange('userDressId')}
                                            onKeyUp={handleKeyUp}
                                            sx={{ m: 1 }}
                                        />
                                    </Stack>
                                </Stack>
                                <Stack direction="row"
                                       sx={{mb: 1, mt:2}}>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 2, ml: 1}}>
                                        <FormLabel component="legend">작업일</FormLabel>
                                    </Stack>
                                    <Stack>
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
                                                value={search.endDate}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleChangeDate('endDate')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    variant="standard"
                                                                                    sx={{width: 150}} />}
                                            />
                                        </LocalizationProvider>
                                    </Stack>

                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5}}>
                                        <FormLabel component="legend">검수 상태</FormLabel>
                                    </Stack>
                                    <Select
                                        size={"small"}
                                        value={getStatus()}
                                        onChange={e=> {changeStatusHandler(e.target.value)}}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        <MenuItem value={'REQUESTED'}>검수 신청</MenuItem>
                                        <MenuItem value={'COMPLETED'}>승인</MenuItem>
                                        <MenuItem value={'REJECTED'}>반려</MenuItem>
                                    </Select>


                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5}}>
                                        <FormLabel component="legend">작업자</FormLabel>
                                    </Stack>
                                    <Select
                                        size={"small"}
                                        value={getWorkerId()}
                                        onChange={e=> {changeWorkerHandler(e.target.value)}}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        {workerList.map((worker, index) => {
                                            return (
                                                <MenuItem key={index}
                                                          value={worker.workerId}>{worker.workerName}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </Stack>

                            </Collapse>
                            <Stack direction="row"
                                   justifyContent={"flex-end"}>
                                <ExpandMore expand={expanded}
                                            aria-expanded={expanded}
                                            sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                            onClick={handleExpandClick}>
                                    <ExpandMoreOutlinedIcon />
                                </ExpandMore >
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
                        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant="h4">긴급 작업</Typography>
                        </Grid>
                        <JennieFitInspectionAiUserList
                            lists={assignUserUrgencylists}
                            count={urgencyCount}
                            refreshList={handleRefreshList}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPage={size}
                            page={page}

                        />
                    </Card>
                    <Card sx={{mt: 1}}>
                        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant="h4">일반 작업</Typography>
                        </Grid>
                        <JennieFitInspectionAiUserList
                            lists={assignUserNormallists}
                            count={normalCount}
                            refreshList={handleRefreshList}
                            onPageChange={handlePageChanges}
                            onRowsPerPageChange={handleRowsPerPageChanges}
                            rowsPerPage={sizes}
                            page={pages}
                        />
                    </Card>
                </Container>
            </Box>
            <CategoryDialog
                keepMounted
                open={open}
                onClose={handleClose}
                category={dataContext.CATEGORY}
                value={search.categoryKey}
            />
        </>
    )
}