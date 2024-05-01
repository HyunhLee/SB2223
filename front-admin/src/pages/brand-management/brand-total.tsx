import Head from "next/head";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Container,
    FormControl,
    FormLabel,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {BrandTotalList} from "../../components/brand/brand-total-list";
import {NextPage} from "next";
import {BrandDialog} from "../../components/dialog/brand-dialog";
import {DataContext} from "../../contexts/data-context";
import {format} from "date-fns";
import {brandApi} from "../../api/brand-api";
import {useRouter} from "next/router";
import {toast} from "react-hot-toast";
import {Plus as PlusIcon} from "../../icons/plus";


interface Search {
    page: number,
    size: number,
    activated: boolean,
    brandId: number,
    brandName: string,
    startDate: string,
    endDate: string,
    keywords: [],
}

const defaultSearch = () => {
    return {
        page: 0,
        size: 20,
        activated: null,
        brandId: '',
        brandName: '',
        startDate: null,
        endDate: null,
        keywords: [],
    }
}

export const BrandTotal: NextPage = () => {
    const router = useRouter();
    const [search, setSearch] = useState(defaultSearch());
    const [brandOpen, setBrandOpen] = useState(false);
    const [keywordFilter, setKeywordFilter] = useState([]);
    const [requestList, setRequestList] = useState<boolean>(true);

    const dataContext = useContext(DataContext);

    const [lists, setLists] = useState<any>();
    const [counts, setCounts] = useState();

    const getBrandList = async () => {
        try {
            const query = {...search}
            const result = await brandApi.getBrandsList(query);
            // @ts-ignore
            setCounts(result.count)
            setLists(result.lists)
        } catch (err) {
            toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
        }

    }

    useEffect(() => {
        if (requestList) {
            getBrandList();
            setRequestList(false);
        }
    }, [requestList])

    const handleClickBrandOpen = () => {
        setBrandOpen(true);
    };

    const handleBrandClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                brandId: value.id,
                brandName: value.nameEn,
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


    const renderDisplayStatus = () => {
        return Object.keys(dataContext.BRAND_DISPLAY_STATUS).map((key, index) => {
            return <MenuItem key={index}
                             value={dataContext.BRAND_DISPLAY_STATUS[key]}>{dataContext.BRAND_DISPLAY_STATUS[key]}</MenuItem>
        });
    }


    const changeDisplayStatus = (value): void => {
        console.log(value)
        if (value == '진열중') {
            setSearch(prevData => ({
                ...prevData,
                activated: true
            }));

        } else if (value == '진열중지') {
            setSearch(prevData => ({
                ...prevData,
                activated: false
            }));
        }else if(value == '전체'){
            setSearch(prevData => ({
                ...prevData,
                activated: null
            }));
        }

    }

    const getDisplayStatus = () => {
        if (search.activated == null) {
            return '전체'
        } else if (search.activated) {
            return '진열중'
        } else {
            return '진열중지'
        }
    }

    const renderKeywords = () => {
        return Object.keys(dataContext.KEYWORDS).map(key => {
            return (<MenuItem key={dataContext.KEYWORDS[key]}
                              value={dataContext.KEYWORDS[key]}>
                <Checkbox checked={keywordFilter.indexOf(dataContext.KEYWORDS[key]) > -1}/>
                <ListItemText primary={dataContext.KEYWORDS[key]}/>
            </MenuItem>)
        })
    }


    const handleChangeKeyword = (event: SelectChangeEvent<typeof search.keywords>) => {
        const {
            target: {value},
        } = event;

        //value 를 사용해서 key(영문찾아냄)
        let arr: any[];
        let keywordsId: any[] = [];
        if (typeof value !== "string") {
            arr = value.map((v) => Object.keys(dataContext.KEYWORDS).find((key) => dataContext.KEYWORDS[key] == v));
        }

        //keyword ID찾기
        let temp = dataContext.STYLE.filter((item: any) => {
            if (arr.includes(item.name)) {
                keywordsId.push(item.id)
            }
        });
        console.log(temp);
        // @ts-ignore
        setKeywordFilter(value)
        setSearch({...search, keywords: keywordsId})

    };

    const handleChangeDate =
        (prop: keyof Search) => (value) => {
            setSearch({...search, [prop]: format(value, 'yyyy-MM-dd')});
        };


    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 0,
        });
        setRequestList(true);
    }

    const handleClickReset = () => {
        setKeywordFilter([]);
        setSearch(defaultSearch());
    };

    const handleClickRegisterBtn = () => {
        router.push('/brand-management/brand-register');
    }

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        event.preventDefault();
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
                        <CardContent sx={{py: 2}}>
                            <Stack direction={"row"}
sx={{mb: 2, display: 'flex', justifyContent: 'space-between'}}>
                                <Grid sx={{
                                    m: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant="h4">브랜드 관리</Typography>

                                </Grid>
                                <Grid
                                    item
                                    sx={{m: -1}}>
                                    <Button
                                        component="a"
                                        startIcon={<PlusIcon fontSize="small"/>}
                                        sx={{m: 1}}
                                        variant="contained"
                                        onClick={handleClickRegisterBtn}
                                    >
                                        브랜드 신규 등록
                                    </Button>
                                </Grid>
                            </Stack>
                            <Stack direction="row">
                                <Stack>
                                    <FormControl sx={{ml: 1, width: '25ch'}}
                                                 variant="standard">
                                        <InputLabel htmlFor="standard-adornment-brand">브랜드</InputLabel>
                                        <Input
                                            type='text'
                                            value={search.brandName}
                                            readOnly={true}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleClickClearBrand}
                                                    >
                                                        <ClearIcon/>
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={handleClickBrandOpen}
                                                    >
                                                        <SearchIcon/>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 5}}>
                                    <FormLabel component="legend">진열상태</FormLabel>
                                </Stack>
                                <Select
                                    sx={{width: 200, height: 40, mt: 1.5, mr: 3}}
                                    size={"small"}
                                    value={getDisplayStatus()}
                                    onChange={e => {
                                        changeDisplayStatus(e.target.value)
                                    }}
                                >
                                    {renderDisplayStatus()}
                                </Select>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, ml: 1}}>
                                    <FormLabel component="legend">등록일</FormLabel>
                                </Stack>
                                <Stack sx={{mt: 1.5}}>
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
                                <Stack sx={{mr: 1, ml: 1, mt: 2}}>
                                    ~
                                </Stack>
                                <Stack sx={{mt: 1.5}}>
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
                                       sx={{mr: 1, ml: 5}}>
                                    <FormLabel component="legend">키워드</FormLabel>
                                </Stack>
                                <Box
                                    sx={{
                                        alignItems: {
                                            sm: 'center'
                                        },
                                        display: 'flex',
                                        flexDirection: {
                                            xs: 'column',
                                            sm: 'row'
                                        },
                                        mx: -1
                                    }}
                                >
                                    <Select
                                        name="keyword"
                                        onChange={handleChangeKeyword}
                                        multiple={true}
                                        sx={{
                                            m: 1,
                                            width: 200,
                                            height: 40
                                        }}
                                        value={keywordFilter}
                                        renderValue={(selected) => selected.join(',')}
                                    >
                                        {renderKeywords()}
                                    </Select>
                                </Box>
                            </Stack>
                            <Stack direction="row"
                                   sx={{mt: 5, p: 0.3, fontSize: 12}}
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
                        <BrandTotalList
                            lists={lists}
                            count={counts}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPage={search.size}
                            page={search.page}
                            getBrandLists={getBrandList}
                            //@ts-ignore
                            setLists={setLists}
                            //@ts-ignore
                            setRequestList={setRequestList}
                        />
                    </Card>
                </Container>
            </Box>
            <BrandDialog
                open={brandOpen}
                onClose={handleBrandClose}
                items={dataContext.BRAND}
                value={search.brandName}
            />
        </>
    )
}


BrandTotal.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default BrandTotal;