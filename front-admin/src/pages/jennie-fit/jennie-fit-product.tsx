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
import {getDataContextValue} from "../../utils/data-convert";
import {jennieFitProductAssignmentApi} from "../../api/jennie-fit-product-assignment-api";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DataContext} from "../../contexts/data-context";
import {BrandDialog} from "../../components/dialog/brand-dialog";
import {CategoryDialog} from "../../components/dialog/category-dialog";

interface Search {
    categoryId: number;
    categoryName: string;
    brandId: number;
    brandName: string;
    registrationType: string;
    startDate: Date;
    endDate: Date;
    workerId: number;
    priorityType: string;
    productName: string;
    statusIn: string[];
    size?: number;
    page?: number;
    productId : number;
    isAi : boolean;
    jenniefitCategory: string;
}

const defaultSearch = () => {
    return {
        categoryId: null,
        categoryName: '',
        brandId: null,
        brandName: '',
        productName: '',
        registrationType: '',
        startDate: null,
        endDate: null,
        statusIn: ['REQUESTED', 'ASSIGNED', 'REJECTED'],
        workerId: null,
        priorityType: '',
        size: 20,
        page: 0,
        productId: null,
        isAi : null,
        jenniefitCategory: ''
    }
}


const JennieFitProduct: NextPage = () => {
    const dataContext = useContext(DataContext);
    const TARGET = 'PRODUCT';
    const boxRef = useRef<HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const [brandOpen, setBrandOpen] = React.useState(false);
    const [search, setSearch] = useState<Search>(defaultSearch());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [requestList, setRequestList] = useState<boolean>(true);
    const [checked, setChecked] = useState(false);

    const [columns, setColumns] = useState({
        assign: [],
        inspection: [],
        reject: [],
        complete: [],
    });

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
            ...search,
            workerId: localStorage.getItem('userId'),
            sort: 'createdDate,desc'
        }
        const result = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(query);
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

        if( search.size > result.lists.length){
            return;
        }

        await fetchMoreData();
    }

    useEffect(() => {
        getFetchData();
    }, []);

    useEffect(() => {
        let client=boxRef.current
        client.addEventListener('scroll', _infiniteScroll, true);
        return () => client.removeEventListener('scroll', _infiniteScroll, true);
    }, [_infiniteScroll]);


    const handleRefreshList = async (): Promise<void> => {
        setRequestList(true);
    };

    const getFittingOptions = () => {
        if (search.isAi == null) {
            return ''
        } else if (search.isAi) {
            return 'AI'
        } else {
            return 'NORMAL'
        }
    }

    const handleChange =
        (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
            if(prop == 'isAi') {
                console.log(event.target.value)
                if(event.target.value == 'NORMAL' ){
                    setSearch({...search, isAi: false});
                }else if(event.target.value  == 'AI' ){
                    setSearch({...search, isAi: true});
                }else{
                    setSearch({...search, isAi: null});
                }
            }else{
                setSearch({...search, [prop]: event.target.value});
            }
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

    const handleClickClearCategory = (prop) => {
        setSearch({
            ...search,
            categoryId: null,
            categoryName: ''
        });
    };

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };

    const handleClickBrandOpen = () => {
        setBrandOpen(true);
    };

    const handleBrandClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                brandId: value.id,
                brandName: value.name,
            });
        }
        setBrandOpen(false);
    };

    const handleClickClearBrand = () => {
        setSearch({
            ...search,
            brandId: null,
            brandName: ''
        });
    };

    const renderRegistrationType = () => {
        return Object.keys(dataContext.REGISTRATION_TYPE).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext.REGISTRATION_TYPE[key]}</MenuItem>)
        });
    }

    const renderPriority = () => {
        return Object.keys(dataContext.ASSIGN_PRIORITY).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext.ASSIGN_PRIORITY[key]}</MenuItem>)
        });
    }

    const renderType = (props) => {
        return Object.keys(dataContext[props]).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext[props][key]}</MenuItem>)
        });
    }

    const handleKeyUp = async (e) => {
        if (e.key === 'Enter') {
            await initColumns();
        }
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
                                    Jennie Fit Product
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box>
                        <Stack direction="row">
                            <Stack>
                                <FormControl sx={{mt: 1 , mr: 3, ml: 1, width: '30ch'}}
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
                                   sx={{mr: 3, mt: 2}}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2}}>
                                    <FormLabel component="legend">작업유형</FormLabel>
                                </Stack>
                                <Stack direction="row">
                                    <Select
                                        sx={{width: 100}}
                                        size={"small"}
                                        value={search.priorityType}
                                        onChange={handleChange('priorityType')}
                                    >
                                        <MenuItem value={''}>-</MenuItem>
                                        {renderType('ASSIGN_PRIORITY')}
                                    </Select>
                                </Stack>
                            </Stack>
                            <Stack direction="row"
                                   sx={{mr: 3, mt: 2}}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2}}>
                                    <FormLabel component="legend">추가옵션</FormLabel>
                                </Stack>
                                <Stack direction="row">
                                    <Select
                                        sx={{width:150}}
                                        size={"small"}
                                        value={getFittingOptions()
                                        }
                                        onChange={handleChange('isAi')}
                                    >
                                        <MenuItem value={''}>-</MenuItem>
                                        {renderType('FITTING_OPTIONS')}
                                    </Select>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction="row"
                               sx={{mt: 3}}>
                            <Stack justifyContent={"center"}
                                   sx={{mr: 2, ml: 1, mt: 1.5}}>
                                <FormLabel
                                    component="legend">작업일</FormLabel>
                            </Stack>
                            <Stack sx={{mt: 2}}>
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
                            <Stack sx={{mr: 2, ml: 2, mt:3}}>
                                ~
                            </Stack>
                            <Stack sx={{mt: 2, mr: 3}}>
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
                                   sx={{mr: 1, ml: 1.5}}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, mt:1}}>
                                    <FormLabel component="legend"> 작업상태</FormLabel>
                                </Stack>
                                <Stack direction="row"
                                       sx={{mt: 2}}>
                                    <Select
                                        sx={{minWidth: 200, height: 40}}
                                        size={"small"}
                                        value={search.statusIn}
                                        onChange={handleStatusChange}
                                        multiple
                                    >
                                        <MenuItem value={''}>-</MenuItem>
                                        {renderType('AI_ASSIGN_STATUS')}
                                    </Select>
                                </Stack>
                            </Stack>
                            <Stack direction="row"
                                   sx={{mr: 3, mt: 2}}>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, ml: 2}}>
                                    <FormLabel component="legend">생성타입</FormLabel>
                                </Stack>
                                <Stack justifyContent={"center"}>
                                    <Select
                                        sx={{width: 200}}
                                        size={"small"}
                                        value={search.registrationType}
                                        onChange={handleChange('registrationType')}
                                    >
                                        <MenuItem value={''}>-</MenuItem>
                                        {renderType('REGISTRATION_TYPE')}
                                    </Select>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction="row">
                            <Stack>
                                <TextField
                                    label="상품ID"
                                    variant="standard"
                                    value={search.productId == null ? '' : search.productId }
                                    onChange={handleChange('productId')}
                                    onKeyUp={handleKeyUp}
                                    sx={{m: 1}}
                                />
                            </Stack>
                            <Stack>
                                <FormControl sx={{m: 1,width: '25ch'}}
                                             variant="standard">
                                    <InputLabel htmlFor="standard-adornment-brand"
                                                sx={{px: 1}}>브랜드</InputLabel>
                                    <Input
                                        type='text'
                                        value={search.brandName}
                                        readOnly={true}
                                        sx={{m: 1}}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={handleClickClearBrand}
                                                >
                                                    <ClearIcon/>
                                                </IconButton>
                                                <IconButton
                                                    sx={{p: 0}}
                                                    onClick={handleClickBrandOpen}
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
                               justifyContent={"flex-end"}
                               sx={{mb: 1}}>
                            <Button size='small'
                                    variant="outlined"
                                    sx={{mr: 1}}
                                    onClick={handleClickReset}>
                                초기화
                            </Button>
                            <Button size='small'
                                    variant="contained"
                                    startIcon={<SearchIcon />}
                                    onClick={async () => {
                                        await initColumns();
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
                        <JennieFitKanbanColumn name={'배정'}
                                               items={columns.assign}
                                               target={TARGET}
                                               refreshList={handleRefreshList}/>
                        <JennieFitKanbanColumn name={'검수중'}
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
            </Box>
            <CategoryDialog
                open={open}
                onClose={handleClose}
                category={dataContext.CATEGORY}
                value={search.categoryId}
            />
            <BrandDialog
                open={brandOpen}
                onClose={handleBrandClose}
                items={dataContext.BRAND}
                value={search.brandId}
            />
        </>
    )
}

JennieFitProduct.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default JennieFitProduct;
