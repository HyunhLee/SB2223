import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import toast from 'react-hot-toast';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {HandsomeProductTotalList} from "../../components/handsome-components/handsome-product-total-list";
import {productApi} from "../../handsome-api/product-api"
import {HandsomeProductModel} from "../../types/handsome-model/handsome-product-model";
import {useRouter} from "next/router";
import {DataContext} from "../../contexts/data-context";

interface Search {
    size: number,
    page: number,
    id: number;
    jennieFitAssignStatus: string;
    number: string;
    displayStatus: string;
    isSoldOut: boolean;
    grade: number;
}

const defaultSearch = () => {
    return {
        size: 20,
        page: 1,
        id: null,
        jennieFitAssignStatus: '',
        number: null,
        displayStatus: '',
        isSoldOut: null,
        grade:  null,
    }
}


export const HandsomeProductTotal: NextPage = () => {
    const [list, setLists] = useState<HandsomeProductModel[]>([]);
    const [count, setCount] = useState<number>(0);
    const [requestList, setRequestList] = useState<boolean>(false);
    const [search, setSearch] = useState<Search>(defaultSearch());
    const dataContext = useContext(DataContext);
    const router = useRouter();
    const {storeSearch} = router.query;

    useEffect(() => {
        // if(!localStorage.getItem('handsomeAccessToken')) {
        //     handsomeAuthApi.login().then(res => {
        //         localStorage.setItem('handsomeAccessToken', res.accessToken);
        //         localStorage.setItem('handsomeRefreshToken', res.refreshToken);
        //         console.log('### handsomeAccessToken : ', res.accessToken);
        //         console.log('### handsomeRefreshToken : ', res.refreshToken);
        //     });
        // }
        if (storeSearch === 'true') {
            const totalSearch = sessionStorage.getItem('handsomeTotalSearch');
            setSearch(JSON.parse(totalSearch));
        }
        setRequestList(true);
    }, [])

    useEffect(() => {
        sessionStorage.setItem('handsomeTotalSearch', JSON.stringify(search));
    }, [search])


    const getLists = async () => {
        try {
            const query = {
                ...search
            }

            const result = await productApi.getProducts(query);
            setLists(result.lists);
            setCount(result.count);

        } catch (err) {
            console.error(err);
            toast.error('데이터를 불러오는데 실패하였습니다.');
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        (async () => {
            await getLists()
            setRequestList(false);

        })()

    }, [requestList]);


    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        event.preventDefault();
        setSearch({
            ...search,
            page: newPage + 1,
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

    const handleChange =
        (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {

            setSearch({...search, [prop]: event.target.value});
        };

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };


    const renderStatus = (value) =>{
        return Object.keys(dataContext[value]).map((key) => {
            return (
                <MenuItem key={key}
                          value={key}>{dataContext[value][key]}</MenuItem>
            )
        })
    }

    const getStatus = (status) => {
        return search[status] ? search[status] : 'ALL';
    }


    const changeStatus = (props, value): void => {
        if(value == 'ALL'){
            setSearch(prevData => ({
                ...prevData,
                [props]: ''
            }))
        }else{
            setSearch(prevData => ({
                ...prevData,
                [props]: value
            }))
        }

    }

    const changeGrade = (value) => {
        console.log(value)
        if(value == 'ONE'){
            setSearch({...search, grade: 1})
        }else if(value == 'TWO'){
            setSearch({...search, grade: 2})
        }else{
            setSearch({...search, grade: null})
        }
    }

    const getGrade = (value) => {
       if( getStatus(value) == 1 ){
           return 'ONE'
       }else if( getStatus(value) == 2){
           return 'TWO'
       }else {
           return 'ALL'
       }
    }

    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 1,
        });
        setRequestList(true);
    }

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleClickSearch()
        }
    }

    const handleRefreshList = async (): Promise<void> => {
        setRequestList(true);
    };

    return (
        <>
            <Head>
                Style | Handsome
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 2
                }}
            >
                <Stack direction={"row"}>
                    <Grid sx={{
                        ml: 3, mt: 2, mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Typography variant="h4">한섬 전체 상품 리스트</Typography>
                    </Grid>
                </Stack>
                <Container maxWidth="xl">
                    <Card sx={{py: 1}}>
                        <CardContent sx={{py: 1}}>
                            <Stack direction="row">
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1}}>
                                    <TextField
                                        label="상품ID"
                                        variant="standard"
                                        value={search.id == null ? '' : search.id}
                                        onChange={handleChange('id')}
                                        onKeyUp={handleKeyUp}
                                        sx={{m: 1}}
                                    />
                                </Stack>
                                <Stack justifyContent={"center"}>
                                    <TextField
                                        label="상품 품번"
                                        variant="standard"
                                        value={search.number == null ? '' : search.number}
                                        onChange={handleChange('number')}
                                        onKeyUp={handleKeyUp}
                                        sx={{m: 1}}
                                    />
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 2, mt: 1}}>
                                    <FormLabel component="legend">검수상태</FormLabel>
                                </Stack>
                                <Stack justifyContent={'center'}>
                                    <Select
                                        sx={{minWidth: 150, height: 40, mt: 1}}
                                        size={"small"}
                                        value={getStatus('jennieFitAssignStatus')}
                                        onChange={e => {
                                            changeStatus('jennieFitAssignStatus', e.target.value)
                                        }}
                                    >
                                        {renderStatus('JENNIE_FIT_ASSIGN')}
                                    </Select>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 3, mt: 1}}>
                                    <FormLabel component="legend">진열상태</FormLabel>
                                </Stack>
                                <Stack justifyContent={'center'}>
                                    <Select
                                        sx={{minWidth: 150, height: 40, mt: 1}}
                                        size={"small"}
                                        value={getStatus('displayStatus')}
                                        onChange={e => {
                                            changeStatus('displayStatus', e.target.value)
                                        }}
                                    >
                                        {renderStatus('HANDSOME_DISPLAY_STATUS')}
                                    </Select>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 1, ml: 3, mt: 1}}>
                                    <FormLabel component="legend">스타일라이브 레벨</FormLabel>
                                </Stack>
                                <Stack justifyContent={'center'}>
                                    <Select
                                        sx={{minWidth: 100, height: 40, mt: 1}}
                                        size={"small"}
                                        value={getGrade('grade')}
                                        onChange={e => {
                                            changeGrade(e.target.value)
                                        }}
                                    >
                                        {renderStatus('HANDSOME_STYLE_LIVE_LEVEL')}
                                    </Select>
                                </Stack>
                            </Stack>
                            <Stack direction="row"
                                   justifyContent={"flex-end"}
                                   sx={{mt: 3}}>
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
                        <HandsomeProductTotalList
                            lists={list}
                            count={count}
                            refreshList={handleRefreshList}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPage={search.size}
                            page={search.page - 1}
                            getLists={getLists}
                            search={search}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
}

HandsomeProductTotal.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default HandsomeProductTotal;