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
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {ChangeEvent, useCallback, useContext, useEffect, useRef, useState} from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DataContext} from "../../contexts/data-context";
import {styled} from "@mui/material/styles";
import {BtbAssignmentModel, defaultSearch, Search} from "../../types/b2b-partner-model/b2b-jennie-fit-assignment-model";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {CategoryDialog} from "../../components/dialog/category-dialog";
import {getDataContextValue} from "../../utils/data-convert";
import BtbFitKanbanColumn from "../../components/b2b-partner/b2b-fit-kanban-column";
import {NextPage} from "next";
import {btbJennieFitProductAssignmentApi} from "../../b2b-partner-api/b2b-jennie-fit-assignment-api";


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


const B2bFitProduct: NextPage = () => {
    const boxRef = useRef<HTMLElement>(null);
    const dataContext = useContext(DataContext);
    const [expanded, setExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [search, setSearch] = useState<Search>(defaultSearch());
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [openMaleCategoryDialog, setOpenMaleCategoryDialog] = useState(false);
    const [columns, setColumns] = useState({
        assign: [],
        inspection: [],
        reject: [],
        complete: [],
    });
    const [totalData, setTotalData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)


    const initColumns = () => {
        setSearch({...search, page: 0});
        search.page = 0
        columns.assign = []
        columns.inspection = []
        columns.reject = []
        columns.complete = []
        setColumns(columns)
        getData();
    }

    const setLoadingTrue = () => {
        setIsLoading(true);
        getData();
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
        return (count === search.page * 40)
    }

    const getArrangeList = useCallback( () => {
        const assign = [];
        const inspection = [];
        const reject = [];
        const complete = [];
        totalData.forEach((item: BtbAssignmentModel) => {
            switch (item.jennieFitAssignmentStatus) {
                case 'Assigned':
                    assign.push(item);
                    break;
                case 'Requested':
                    inspection.push(item);
                    break;
                case 'Rejected':
                    reject.push(item);
                    break;
                case 'Completed':
                    complete.push(item);
                    break;
            }
        })
        setColumns({
            assign,
            inspection,
            reject,
            complete,
        })
        setLoading(false)
    },[totalData])


    const getData = async () => {
        const query = {
            ...search,
            size: search.size,
            page: search.page,
            workerId: localStorage.getItem('userId'),
            sort: 'createdDate,desc'
        }

        const result = await btbJennieFitProductAssignmentApi.getJennieFitAssignmentWorkersWorkList(query)

        if (!getColumnsListCount()) {
            setIsLoading(false)
            return
        }
        setSearch({...search, page: search.page + 1})
        setTotalData(result);
        const assign = columns.assign;
        const inspection = columns.inspection;
        const reject = columns.reject;
        const complete = columns.complete;

        if(!loading){
            result.forEach((item: BtbAssignmentModel) => {
                switch (item.jennieFitAssignmentStatus) {
                    case 'Assigned':
                        assign.push(item);
                        break;
                    case 'Requested':
                        inspection.push(item);
                        break;
                    case 'Rejected':
                        reject.push(item);
                        break;
                    case 'Completed':
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
        }
        if( search.size > result.length){
            return;
        }
        await fetchMoreData();
    }

    const handleClickOpen = () => {
        setOpenCategoryDialog(true);
    }

    const handleClickOpenMale = () => {
        setOpenMaleCategoryDialog(true);
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleChange = (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value == 'All') {
            setSearch({...search, [prop]: ''})
        } else {
            setSearch({...search, [prop]: event. target.value})
        }
    }

    const handleChangeJennieFitStatus = (event: SelectChangeEvent<typeof search.assignmentMultiStatus>) => {
        const {
            target: {value},
        } = event;
        setSearch({...search, assignmentMultiStatus: typeof value === 'string' ? value.split(',') : value});

    };

    const getStatus = (status) => {
        return search[status] ? search[status] : 'All';
    }

    const renderType = (target) => {
        return Object.keys(dataContext[target]).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext[target][key]}</MenuItem>)
        });
    }

    const handleChangeDate = (prop: keyof Search) => (value) => {
        setSearch({...search, [prop]: value})
    }

    const handleClearCategory = () => {
        setSearch({...search, categoryIds: null, categoryName: ''})
    }

    const handleClearMaleCategory = () => {
        setSearch({...search, maleCategoryIds: null, maleCategoryName: ''})
    }

    const handleClickReset = () => {
        setSearch(defaultSearch());
    }

    const handleClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                categoryIds: value.id,
                categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpenCategoryDialog(false);
    };

    const handleCloseMale = (value) => {
        if (value) {
            setSearch({
                ...search,
                maleCategoryIds: value.id,
                maleCategoryName: getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpenMaleCategoryDialog(false);
    };

    const handleKeyUp = async (e) => {
        if (e.key === 'Enter') {
            await initColumns();
        }
    }

    useEffect(() => {
        getData();
        console.log('datadata', dataContext.MALE_CATEGORY)
    }, [])

    useEffect(() => {
        if(loading){
        getArrangeList();
        }
    },[loading])


    useEffect(() => {
        let client = boxRef.current
        client.addEventListener('scroll', _infiniteScroll, true);
        return () => client.removeEventListener('scroll', _infiniteScroll, true);
    }, [_infiniteScroll]);


    return (
        <>
            <Box
                ref={boxRef}
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 2,
                    maxHeight: 800,
                    overflowY: 'scroll',
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
                                    B2B Jennie Fit Product
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Card>
                        <CardContent>
                            <Stack direction="row">
                                <Stack>
                                    <TextField
                                        label="상품ID"
                                        variant="standard"
                                        value={search.productId || ''}
                                        onChange={handleChange('productId')}
                                        onKeyUp={handleKeyUp}
                                        sx={{m: 1, mr: 2}}
                                    />
                                </Stack>
                                <Stack direction={'row'}>
                                    <FormControl sx={{m: 1, width: '30ch'}}
                                                 variant="standard">
                                        <InputLabel htmlFor="standard-adornment-password">여성 카테고리</InputLabel>
                                        <Input
                                            type='text'
                                            value={search.categoryName || ''}
                                            readOnly={true}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        sx={{p: 0}}
                                                        disabled={search.maleCategoryName !== ""}
                                                        onClick={handleClearCategory}
                                                    >
                                                        <ClearIcon/>
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{p: 0}}
                                                        disabled={search.maleCategoryName !== ""}
                                                        onClick={handleClickOpen}
                                                    >
                                                        <SearchIcon/>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '30ch'}}
                                                 variant="standard">
                                        <InputLabel htmlFor="standard-adornment-password">남성 카테고리</InputLabel>
                                        <Input
                                            type='text'
                                            value={search.maleCategoryName || ''}
                                            readOnly={true}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        sx={{p: 0}}
                                                        disabled={search.categoryName !== ""}
                                                        onClick={handleClearMaleCategory}
                                                    >
                                                        <ClearIcon/>
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{p: 0}}
                                                        disabled={search.categoryName !== ""}
                                                        onClick={handleClickOpenMale}
                                                    >
                                                        <SearchIcon/>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Stack>
                            </Stack>
                            <Stack direction="row"
sx={{mt: 2}}>
                                <Stack direction="row"
sx={{mb: 1}}>
                                    <Stack justifyContent={"center"}
sx={{mr: 2, ml: 1, mt: 2.5}}>
                                        <FormLabel> 작업일 </FormLabel>
                                    </Stack>
                                    <Stack sx={{mt: 2.5,px: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={search.startDate}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleChangeDate('startDate')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    variant="standard"
                                                                                    sx={{height: 40, width: 200}}/>}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                    <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                                        ~
                                    </Stack>
                                    <Stack sx={{mt: 2.5, px: 1}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={search.endDate}
                                                inputFormat={"yyyy-MM-dd"}
                                                mask={"____-__-__"}
                                                onChange={handleChangeDate('endDate')}
                                                renderInput={(params) => <TextField {...params}
                                                                                    variant="standard"
                                                                                    sx={{height: 40, width: 200}}/>}
                                            />
                                        </LocalizationProvider>
                                    </Stack>
                                </Stack>
                                <Stack direction="row"
                                       sx={{mr: 1, ml: 3, mt: 0.5}}>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 2, mt: 1}}>
                                        <FormLabel component="legend">작업상태</FormLabel>
                                    </Stack>
                                    <Stack justifyContent={"center"}
                                           sx={{mt: 1, minWidth: 200}}>
                                        <Select
                                            size={"small"}
                                            value={search.assignmentMultiStatus || ''}
                                            onChange={handleChangeJennieFitStatus}
                                            multiple
                                        >
                                            {renderType('BTB_FIT_PRODUCT_STATUS')}
                                        </Select>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Collapse in={expanded}
                                      timeout="auto"
                                      unmountOnExit>
                                <Stack direction="row">
                                    <Stack direction="row"
                                           sx={{mr: 1, ml: 1, mt: 3}}>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, mt: 1}}>
                                            <FormLabel component="legend">생성타입</FormLabel>
                                        </Stack>
                                        <Stack justifyContent={"center"}
                                               sx={{mt: 1, width: 200}}>
                                            <Select
                                                size={"small"}
                                                value={getStatus('registrationType') || ''}
                                                onChange={handleChange('registrationType')}
                                            >
                                                {renderType('BTB_REGISTRATION_TYPE')}
                                            </Select>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row"
                                           sx={{mr: 1, ml: 3, mt: 3}}>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, mt: 1}}>
                                            <FormLabel component="legend">작업유형</FormLabel>
                                        </Stack>
                                        <Stack justifyContent={"center"}
                                               sx={{mt: 1, width: 200}}>
                                            <Select
                                                size={"small"}
                                                value={getStatus('priorityType') || ''}
                                                onChange={handleChange('priorityType')}
                                            >
                                                <MenuItem value={'All'}>전체</MenuItem>
                                                {renderType('BTB_ASSIGN_PRIORITY')}
                                            </Select>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Collapse>
                            <Stack direction="row"
                                   justifyContent={"flex-end"}
                                   sx={{mb: 2, mt: 4}}>
                                <ExpandMore expand={expanded}
                                            aria-expanded={expanded}
                                            sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                            onClick={handleExpandClick}>
                                    <ExpandMoreOutlinedIcon/>
                                </ExpandMore>
                                <Button size='small'
                                        variant="outlined"
                                        sx={{mr: 1}}
                                        onClick={handleClickReset}
                                >
                                    초기화
                                </Button>
                                <Button size='small'
                                        variant="contained"
                                        startIcon={<SearchIcon />}
                                        onClick={() => initColumns()}>
                                    검색
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                            flexShrink: 1,
                            overflowX: 'auto',
                            overflowY: 'none',
                        }}>
                        <BtbFitKanbanColumn items={columns.assign}
                                            status={dataContext.BTB_ASSIGN_STATUS['Assigned']}
setTotalData={setTotalData}
totalData={totalData}
setLoading={setLoading}/>
                        <BtbFitKanbanColumn items={columns.inspection}
                                            status={dataContext.BTB_ASSIGN_STATUS['Requested']}
setTotalData={setTotalData}
totalData={totalData}
setLoading={setLoading} />
                        <BtbFitKanbanColumn items={columns.reject}
                                            status={dataContext.BTB_ASSIGN_STATUS['Rejected']}
setTotalData={setTotalData}
totalData={totalData}
setLoading={setLoading}/>
                        <BtbFitKanbanColumn items={columns.complete}
                                            status={dataContext.BTB_ASSIGN_STATUS['Completed']}
setTotalData={setTotalData}
totalData={totalData}
setLoading={setLoading}/>
                    </Box>
                </Container>
            </Box>
            <CategoryDialog
                open={openCategoryDialog}
                onClose={handleClose}
                category={dataContext.CATEGORY}
                value={search.categoryIds}
            />
            <CategoryDialog
                open={openMaleCategoryDialog}
                onClose={handleCloseMale}
                category={dataContext.MALE_CATEGORY}
                value={search.maleCategoryIds}
            />
        </>
    )
}

B2bFitProduct.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default B2bFitProduct;