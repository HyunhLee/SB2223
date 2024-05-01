import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Collapse,
    Container,
    FormControl,
    FormControlLabel,
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
import {Plus as PlusIcon} from "../../icons/plus";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {getDataContextValue} from "../../utils/data-convert";
import {CategoryDialog, ColorDialog, PatternDialog} from "../../components/dialog/category-dialog";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {styled} from "@mui/material/styles";
import {JennieFitWorkerModel} from "../../types/jennie-fit-worker-model";
import {jennieFitWorkerApi} from "../../api/jennie-fit-worker-api";
import toast from 'react-hot-toast';
import _ from "lodash";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {ProductTotalList} from "../../components/product/product-total-list";
import {productApi} from "../../api/product-api";
import {ProductModel} from "../../types/product-model";
import {useRouter} from "next/router";
import {format} from "date-fns";

interface Search {
    size: number,
    page: number,
    categoryId: string;
    categoryName: string;
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
    nameKo:string;
    brandId:number;
    colorTypes: string;
    patternTypes: string;
    fitRequestStatus:string;
    displayStatus:string;
    registrationType:string;
    seasonTypes:string;
}

const defaultSearch = () => {
    return {
        page: 0,
        size: 10,
        categoryId: null,
        categoryName: '',
        id: null,
        startDate: null,
        endDate: null,
        priorityType:'',
        status:'',
        workerId:null,
        brandId:null,
        nameKo:'',
        colorTypes: '',
        patternTypes: '',
        fitRequestStatus:'',
        displayStatus:'',
        registrationType:'',
        seasonTypes:''
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

export const JennieProductTotal: NextPage = () => {
    const [workType, setWorkType] = useState('FIT_USER');
    const [activated, setActivated] = useState(true);
    const [workerList, setWorkerList] = useState<JennieFitWorkerModel[]>([]);
    const [requestWorker, setRequestWorker] = useState<boolean>(false);

    const [expanded, setExpanded] = useState(true);

    const [list, setLists] = useState<ProductModel[]>([]);
    const [count, setCount] = useState<number>(0);

    const [requestList, setRequestList] = useState<boolean>(false);

    const [open, setOpen] = React.useState(false);

    const dataContext = useContext(DataContext);

    const [search, setSearch] = useState<Search>(defaultSearch());

    const [openColor, setOpenColor] = React.useState(false);
    const [openPattern, setOpenPattern] = React.useState(false);

    const brandList = _.sortBy(dataContext.BRAND, 'name').sort((a, b) => a.name.localeCompare(b.name, 'en-US'))

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
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

    const router = useRouter();
    const {storeSearch} = router.query;

    useEffect(() => {
        if (storeSearch === 'true') {
            const JennieProductTotalSearch = sessionStorage.getItem('JennieProductTotalSearch');
            setSearch(JSON.parse(JennieProductTotalSearch));
        }
        setRequestList(true);
    },[]);

    useEffect(
        () => {
            sessionStorage.setItem('JennieProductTotalSearch', JSON.stringify(search));
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
                // size, page,
                ...search
            }
            let array = [];
            if(query.seasonTypes != "") {
                if(query.seasonTypes.includes('SPRING')) {
                    array.push('SPRING')
                }
                if(query.seasonTypes.includes('SUMMER')) {
                    array.push('SUMMER')
                }
                if(query.seasonTypes.includes('FALL')) {
                    array.push('FALL')
                }
                if(query.seasonTypes.includes('WINTER')) {
                    array.push('WINTER')
                }
                query.seasonTypes = array.join(',');
            }

            const result = await productApi.getProducts(query);
            setLists(result.lists);
            setCount(result.count);

        } catch (err) {
            console.error(err);
            toast.error('데이터를 불러오는데 실패하였습니다.');
        }
    }

    const handleChange =
        (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
            setSearch({ ...search, [prop]: event.target.value });
        };

    const changeDisplayStatus = (value): void => {
        setSearch(prevData => ({
            ...prevData,
            displayStatus: value
        }))
    }

    const changeRegistrationType = (value): void => {
        setSearch(prevData => ({
            ...prevData,
            registrationType: value
        }))
    }

    const changeFitRequestStatus = (value): void => {
        setSearch(prevData => ({
            ...prevData,
            fitRequestStatus: value
        }))
    }

    const handleChangeDate =
        (prop: keyof Search) => (value) => {
            setSearch({ ...search, [prop]: format(value, 'yyyy-MM-dd') });
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
        setSearch({ ...search,
            categoryId: '',
            categoryName: ''
        });
    };

    const getBrandId = () => {
        return (search.brandId) ? search.brandId : '';
    }

    const changeBrandNameHandler = (changeValues) => {
        setSearch(prevData => ({
            ...prevData,
            brandId: changeValues
        }))
    }

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };

    const getFitRequestStatus = () => {
        return (search.fitRequestStatus) ? search.fitRequestStatus : '';
    }

    const getDisplayStatus = () => {
        return (search.displayStatus) ? search.displayStatus : '';
    }

    const getRegistrationType = () => {
        return (search.registrationType) ? search.registrationType : '';
    }

    const renderRegistrationType = () => {
        return Object.keys(dataContext.REGISTRATION_TYPE).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext.REGISTRATION_TYPE[key]}</MenuItem>)
        });
    }

    const renderSeason = () => {
        return Object.keys(dataContext.PRODUCT_SEASON_TYPE).map(key => {
            return (
                <Grid key={key}
                      item
                      xs={6}>
                    <FormControlLabel
                        value={key}
                        control={<Checkbox
                            onChange={e=> {changeSeason(e.target.defaultValue, e.target.checked)}}
                            checked={checkedSeason(key)}
                        />}
                        label={dataContext.PRODUCT_SEASON_TYPE[key]} />
                </Grid>
            )
        });
    }

    const checkedSeason = (season) => {
        if (search.seasonTypes) {
            return search.seasonTypes.includes(season)
        }
        return false;
    }

    const changeSeason = (value: string, checked: boolean): void => {
        let season = []
        if (search.seasonTypes) {
            season = search.seasonTypes.split(',');
        }
        if (checked) {
            season.push(value);
        }
        else {
            _.remove(season, (data) => {
                return data == value;
            });
        }
        setSearch(prevData => ({
            ...prevData,
            seasonTypes: season.join(',')
        }))
    }

    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 0,
        });
        setRequestList(true);
    }

    const handleKeyUp = (e) => {
        if(e.key === 'Enter') {
            handleClickSearch()
        }
    }

    const handleClickClear = (prop: keyof Search) => {
        setSearch({ ...search, [prop]: '' });
    };

    const handleClickOpenColor = () => {
        setOpenColor(true);
    };

    const handleClickOpenPattern = () => {
        setOpenPattern(true);
    };

    const handleCloseColor = (values) => {
        if (values) {
            console.log(values);
            setSearch({
                ...search,
                colorTypes: values.map(item => {
                    return item.name;
                }).join(',')
            });
        }
        setOpenColor(false);
    };

    const handleClosePattern = (values) => {
        if (values) {
            console.log(values);
            setSearch({
                ...search,
                patternTypes: values.map(item => {
                    return item.name;
                }).join(',')
            });
        }
        setOpenPattern(false);
    };

    const handleMove = () => {
        router.push(`/jennie-product/jennie-product/`);
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
                                <Stack direction={"row"}
sx={{justifyContent: 'space-between'}}>
                                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Typography variant="h4">전체 상품 리스트</Typography>
                                    </Grid>
                                    <Button color="primary"
                                            variant="contained"
                                            startIcon={<PlusIcon />}
                                            sx={{height: 50, mr: 0.5, mt: 1, p: 1}}
                                            onClick={handleMove}>
                                        수동 등록하기
                                    </Button>
                                </Stack>
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
                                            label="상품명"
                                            variant="standard"
                                            value={search.nameKo==null?'':search.nameKo}
                                            onChange={handleChange('nameKo')}
                                            onKeyUp={handleKeyUp}
                                            sx={{ m: 1 }}
                                        />
                                    </Stack>

                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 3}}>
                                        <TextField
                                            label="상품ID"
                                            variant="standard"
                                            value={search.id==null?'':search.id}
                                            onChange={handleChange('id')}
                                            onKeyUp={handleKeyUp}
                                            sx={{ m: 1 }}
                                        />
                                    </Stack>
                                </Stack>
                                <Stack direction="row">
                                    <Stack>
                                        <FormControl sx={{ m: 1, width: '30ch' }}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">컬러</InputLabel>
                                            <Input
                                                id="standard-adornment-password"
                                                type='text'
                                                value={search.colorTypes}
                                                onChange={handleChange('colorTypes')}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={() => handleClickClear('colorTypes')}
                                                        >
                                                            <ClearIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={handleClickOpenColor}
                                                        >
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Stack>
                                    <Stack>
                                        <FormControl sx={{ m: 1, width: '30ch' }}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">패턴</InputLabel>
                                            <Input
                                                id="standard-adornment-password"
                                                type='text'
                                                value={search.patternTypes}
                                                onChange={handleChange('patternTypes')}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={() => handleClickClear('patternTypes')}
                                                        >
                                                            <ClearIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            onClick={handleClickOpenPattern}
                                                        >
                                                            <SearchIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Stack>
                                </Stack>
                                <Stack direction="row"
                                       sx={{mb: 1, mt:2}}>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 2, ml: 1}}>
                                        <FormLabel component="legend">등록일</FormLabel>
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
                                                                                    sx={{width: 150}}/>}
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
                                                                                    sx={{width: 150}}/>}
                                            />
                                        </LocalizationProvider>
                                    </Stack>

                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 5, mt:1}}>
                                        <FormLabel component="legend">제니FIT</FormLabel>
                                    </Stack>
                                    <Select
                                        size={"small"}
                                        value={getFitRequestStatus()}
                                        onChange={e=> {changeFitRequestStatus(e.target.value)}}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        <MenuItem value={'REQUESTED'}>작업요청</MenuItem>
                                        <MenuItem value={'REJECTED'}>반려</MenuItem>
                                        <MenuItem value={'COMPLETED'}>작업완료</MenuItem>
                                        <MenuItem value={'NOT_APPLIED'}>작업불가</MenuItem>
                                        <MenuItem value={'IN_PROGRESS'}>작업중</MenuItem>
                                    </Select>


                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 3, mt:1}}>
                                        <FormLabel component="legend">생성타입</FormLabel>
                                    </Stack>
                                    <Select
                                        size={"small"}
                                        value={getRegistrationType()}
                                        onChange={e=> {changeRegistrationType(e.target.value)}}
                                    >
                                        <MenuItem value={''}>-</MenuItem>
                                        {renderRegistrationType()}
                                    </Select>
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 3, mt:1}}>
                                        <FormLabel component="legend">진열상태</FormLabel>
                                    </Stack>
                                    <Select
                                        size={"small"}
                                        value={getDisplayStatus()}
                                        onChange={e=> {changeDisplayStatus(e.target.value)}}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        <MenuItem value={'DISPLAY_END'}>진열 중지</MenuItem>
                                        <MenuItem value={'DISPLAY_ON'}>진열중</MenuItem>
                                        <MenuItem value={'SOLD_OUT'}>품절</MenuItem>
                                    </Select>


                                    <Stack justifyContent={"center"}
                                           sx={{mr: 1, ml: 3, mt:1}}>
                                        <FormLabel component="legend">브랜드</FormLabel>
                                    </Stack>
                                    <Select
                                        size={"small"}
                                        value={getBrandId()}
                                        onChange={e=> {changeBrandNameHandler(e.target.value)}}
                                    >
                                        <MenuItem value={''}>전체</MenuItem>
                                        {brandList.map((brand) => {
                                            return (
                                                <MenuItem key={brand.id}
                                                          value={brand.id}>{brand.name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </Stack>
                                <Stack direction="row">
                                    <Stack justifyContent={"center"}
                                           sx={{mr: 2, ml: 1}}>
                                        <FormLabel component="legend">시즌</FormLabel>
                                    </Stack>
                                    <Stack direction="row"
                                           justifyContent={"space-between"}>
                                        {renderSeason()}
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
                    <Card sx={{mt: 1}}>
                        <ProductTotalList
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
            <CategoryDialog
                keepMounted
                open={open}
                onClose={handleClose}
                category={dataContext.CATEGORY}
                value={search.categoryId}
            />
            <ColorDialog
                keepMounted
                open={openColor}
                onClose={handleCloseColor}
                items={dataContext.COLOR}
                value={search.colorTypes}
                multiple={true}
            />
            <PatternDialog
                keepMounted
                open={openPattern}
                onClose={handleClosePattern}
                items={dataContext.PATTERN}
                value={search.patternTypes}
                multiple={true}
            />
        </>
    )
}

JennieProductTotal.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default JennieProductTotal;