import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import Head from 'next/head';
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
import {JennieFitInspectionProductList} from "./jennie-fit-inspection-product-list";
import {jennieFitProductAssignmentApi} from "../../api/jennie-fit-product-assignment-api";
import {jennieFitWorkerApi} from "../../api/jennie-fit-worker-api";
import {JennieFitAssignmentModel} from "../../types/jennie-fit-assignment-model";
import {JennieFitInspectionProductAiList} from "./jennie-fit-inspection-product-ai-list";
import _ from "lodash";

interface Search {
    id?: number
    categoryKey: string
    categoryName: string
    categoryId: string;
    category1?: string
    category2?: string
    category3?: string
    category4?: string
    category5?: string
    priorityType:string
    startDate: Date
    endDate: Date
    createType:string
    status:string
    brandName:string
    brandId:number
    workerId:number
    productName:string
    registrationType:string
    productId:number
    isAi: boolean
}

const defaultSearch = () => {
    return {
        id: null,
        categoryKey: null,
        categoryName: '',
        categoryId: null,
        priorityType: '',
        startDate: null,
        endDate: null,
        createType:'',
        status: 'REQUESTED',
        brandName:'',
        brandId:null,
        workerId: null,
        productName: '',
        registrationType:'',
        productId:null,
        isAi: false
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

export const JennieFitInspectionProduct = (props) => {
    const {aiTab} = props;
    const [workType, setWorkType] = useState('FIT_PRODUCT');
    const [activated, setActivated] = useState(true);
    const [workerList, setWorkerList] = useState<JennieFitWorkerModel[]>([]);
    const [requestWorker, setRequestWorker] = useState<boolean>(false);


    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [pages, setPages] = useState(0);
    const [sizes, setSizes] = useState(10);
    const [sort, setSort] = useState('workStartDay,desc');
    const [expanded, setExpanded] = useState(true);

    const [assignProductUrgencylists, setUrgencyLists] = useState<JennieFitAssignmentModel[]>([]);
    const [urgnecyCount, setUrgencyCount] = useState<number>(0);
    const [assignProductNormallists, setNormalLists] = useState<JennieFitAssignmentModel[]>([]);
    const [normalCount, setNormalCount] = useState<number>(0);
    const [assignAiProductUrgencylists, setAiUrgencyLists] = useState<JennieFitAssignmentModel[]>([]);
    const [assignAiProductNormallists, setAiNormalLists] = useState<JennieFitAssignmentModel[]>([]);
    const [aiNormalCount, setAiNormalCount] = useState<number>(0);
    const [aiUrgnecyCount, setAiUrgencyCount] = useState<number>(0);

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
                    if(aiTab) {
                        await getAiLists()
                    } else {
                        await getLists()
                    }
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

    const handleChange =
        (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
            setSearch({ ...search, [prop]: event.target.value });
        };

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
            const urgencyResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(query);
            setUrgencyLists(urgencyResult.lists);
            setUrgencyCount(urgencyResult.count);

            const querys = {
                sort, sizes, pages, ...search
            }
            querys.priorityType = 'NORMAL';
            const normalResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(querys);
            setNormalLists(normalResult.lists);
            setNormalCount(normalResult.count);
        } catch (err) {
            console.error(err);
        }
    }

    const getAiLists = async () => {
        try {
            const query = {
                sort, size, page, ...search
            }
            query.isAi = true;
            query.priorityType = 'URGENCY';
            const urgencyResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(query);
            setAiUrgencyLists(urgencyResult.lists);
            setAiUrgencyCount(urgencyResult.count);

            const querys = {
                sort, sizes, pages, ...search
            }
            querys.isAi = true;
            querys.priorityType = 'NORMAL';
            const normalResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(querys);
            setAiNormalLists(normalResult.lists);
            setAiNormalCount(normalResult.count);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        setRequestList(true);
    },[]);

    const handleClickClearCategory = () => {
        setSearch({ ...search,
            categoryId: null,
            categoryKey: null,
            categoryName: ''
        });
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

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };

    const renderTpo = () => {
        return dataContext.TPO.map(item => {
            return (<MenuItem key={item.id}
                              value={item.name}>{item.name}</MenuItem>)
        })
    }

    const getCreateType = () => {
        return (search.createType) ? search.createType : '';
    }

    const changeRegistrationTypeHandler = (changeValues) => {
        setSearch(prevData => ({
            ...prevData,
            registrationType: changeValues
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

    const changeWorkerHandler = (changeValues) => {
        setSearch(prevData => ({
            ...prevData,
            workerId: changeValues
        }))
    }

    const changeBrandNameHandler = (changeValues) => {
        setSearch(prevData => ({
            ...prevData,
            brandId: changeValues
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
                                            <InputLabel htmlFor="standard-adornment-password">카테고리 X</InputLabel>
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
                                           sx={{mr: 2, ml: 3, mt:3}}>
                                        <FormLabel component="legend">작업일</FormLabel>
                                    </Stack>
                                    <Stack sx={{mr: 2, ml: 2, mt:3}}>
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
                                    <Stack sx={{mr: 2, ml: 1, mt:4}}>
                                        ~
                                    </Stack>
                                    <Stack sx={{mr: 2, ml: 1, mt:3}}>
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
                                           sx={{mr: 1, ml: 3}}>
                                        <TextField
                                            label="ID"
                                            variant="standard"
                                            value={search.productId==null?'':search.productId}
                                            onChange={handleChange('productId')}
                                            onKeyUp={handleKeyUp}
                                            sx={{ m: 1 }}
                                        />
                                    </Stack>
                                </Stack>
                                <Stack direction="row"
                                       sx={{mb: 1, mt:2}}>

                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 1}}>
                                        <FormLabel component="legend">생성 타입</FormLabel>
                                    </Stack>
                                    <Stack justifyContent={"center"}>
                                        <Select
                                            size={"small"}
                                            value={search.registrationType}
                                            onChange={e=> {changeRegistrationTypeHandler(e.target.value)}}
                                            // 전체, 파트너사 자동 연동, 파트너사 수동 등록, 스타일봇 수동 등록
                                        >
                                            <MenuItem value={''}>전체</MenuItem>
                                            <MenuItem value={'AUTOMATIC'}>파트너사 자동 연동</MenuItem>
                                            <MenuItem value={'MANUAL_PARTNER'}>파트너사 수동 등록</MenuItem>
                                            <MenuItem value={'MANUAL'}>스타일봇 수동 등록</MenuItem>
                                        </Select>
                                    </Stack>

                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5}}>
                                        <FormLabel component="legend">검수 상태</FormLabel>
                                    </Stack>
                                    <Stack justifyContent={"center"}>
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
                                    </Stack>


                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5}}>
                                        <FormLabel component="legend">작업자</FormLabel>
                                    </Stack>
                                    <Stack justifyContent={"center"}>
                                        <Select
                                            size={"small"}
                                            value={search.workerId}
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

                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5}}>
                                        <FormLabel component="legend">브랜드</FormLabel>
                                    </Stack>
                                    <Stack justifyContent={"center"}>
                                        <Select
                                            size={"small"}
                                            value={search.brandId}
                                            onChange={e=> {changeBrandNameHandler(e.target.value)}}
                                        >
                                            <MenuItem value={''}>전체</MenuItem>
                                            {_.sortBy(dataContext.BRAND, 'name').map((brand, index) => {
                                                return (
                                                    <MenuItem key={index}
                                                              value={brand.id}>{brand.name}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </Stack>

                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5, mb: 2}}>
                                        <TextField
                                            label="상품명 X"
                                            variant="standard"
                                            value={search.productName}
                                            onChange={handleChange('productName')}
                                            onKeyUp={handleKeyUp}
                                            sx={{ m: 1 }}
                                        />
                                    </Stack>
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
                    {aiTab ?
                        <>
                            <Card sx={{mt: 1}}>
                                <Grid
                                    sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Typography variant="h4">긴급 작업</Typography>
                                </Grid>
                                <JennieFitInspectionProductAiList lists={assignAiProductUrgencylists}
                                                                  count={aiUrgnecyCount}
                                                                  page={page}
                                                                  rowsPerPage={size}
                                                                  refreshList={handleRefreshList}
                                                                  onPageChange={handlePageChange}
                                                                  onRowsPerPageChange={handleRowsPerPageChange}/>
                            </Card>
                            <Card sx={{mt: 1}}>
                                <Grid
                                    sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Typography variant="h4">일반 작업</Typography>
                                </Grid>
                                <JennieFitInspectionProductAiList lists={assignAiProductNormallists}
                                                                  count={aiNormalCount}
                                                                  page={pages}
                                                                  rowsPerPage={sizes}
                                                                  refreshList={handleRefreshList}
                                                                  onPageChange={handlePageChanges}
                                                                  onRowsPerPageChange={handleRowsPerPageChanges}/>
                            </Card>
                        </>
                        :
                        <>
                            <Card sx={{mt: 1}}>
                                <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Typography variant="h4">긴급 작업</Typography>
                                </Grid>
                                <JennieFitInspectionProductList
                                    lists={assignProductUrgencylists.filter(urgency => urgency.workerName.length > 0)}
                                    count={urgnecyCount}
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
                                <JennieFitInspectionProductList
                                    lists={assignProductNormallists.filter(normal => normal.workerName.length > 0)}
                                    count={normalCount}
                                    refreshList={handleRefreshList}
                                    onPageChange={handlePageChanges}
                                    onRowsPerPageChange={handleRowsPerPageChanges}
                                    rowsPerPage={sizes}
                                    page={pages}
                                />
                            </Card></>}
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