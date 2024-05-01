import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import {
    Box,
    Button,
    Card,
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
import SearchIcon from "@mui/icons-material/Search";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {DataContext} from "../../../contexts/data-context";
import {faqApi} from "../../../b2b-partner-api/faq-api";
import {defaultSearchFaq, FaqListModel, SearchFaq} from "../../../types/b2b-partner-model/faq-model";
import FaqListDetail from "../../../components/b2b-partner/faq/faq-list-detail";
import {Plus as PlusIcon} from "../../../icons/plus";

const FaqList: NextPage = () => {
    const router = useRouter();
    const {storeSearch} = router.query;
    const dataContext = useContext(DataContext);

    const [data, setData] = useState<FaqListModel[]>([])
    const [count, setCount] = useState<number>(0);
    const [search, setSearch] = useState<SearchFaq>(defaultSearchFaq)
    const [requestList, setRequestList] = useState<boolean>(false);

    useEffect(() => {
        if (storeSearch === 'true') {
            const FaqListSearch = sessionStorage.getItem('FaqListSearch');
            setSearch(JSON.parse(FaqListSearch));
        }
        setRequestList(true);
    },[]);


    useEffect(
        () => {
            sessionStorage.setItem('FaqListSearch', JSON.stringify(search));
        },
        [search]
    );

    const moveToPage = () =>{
        router.push(`/b2b-partner/faq/create-faq`);
    }

    useEffect(() => {
        if(requestList) {
            getFaqs();
            setRequestList(false);
        }
    }, [requestList])

    const getFaqs = async () => {
        await faqApi.getFaqList(search).then((res) => {
            setData(res.lists);
            setCount(res.count);
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    const renderType = (target) => {
        return Object.keys(dataContext[target]).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext[target][key]}</MenuItem>)
        });
    }

    const handleSearch = (prop: keyof SearchFaq) => (event: ChangeEvent<HTMLInputElement>) => {
        if(prop == 'id') {
            setSearch({...search, [prop]: Number(event.target.value)})
        } else {
            setSearch({...search, [prop]: event.target.value})
        }
    };

    const handleKeyUp = async (e) => {
        if(e.key === 'Enter') {
            setRequestList(true);
        }
    }

    const handleClickReset = () => {
        setSearch(defaultSearchFaq);
    }

    const handleClickSearch = () => {
        setSearch({
            ...search,
            page: 0,
        });
        setRequestList(true);
    }

    //pagination
    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setSearch({
            ...search,
            page: newPage,
        });
        setRequestList(!requestList)
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSearch({
            ...search,
            size: parseInt(event.target.value, 10),
        });
        setRequestList(!requestList)
    };

    return (
        <>
            <div>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 2
                    }}>
                    <Container maxWidth="xl">
                        <Box sx={{mb: 1, py: 2, ml: 3, mt: 2}}>
                            <Grid
                                container
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Typography variant="h4">
                                    FAQ
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<PlusIcon />}
                                    onClick={moveToPage}>
                                    FAQ 추가
                                </Button>
                            </Grid>
                        </Box>
                        <Grid container>
                            <Grid sx={{width: "100%"}}>
                                <Card>
                                    <Stack direction="row"
                                           sx={{ml: 1, mt: 2}}>
                                        <Stack sx={{ml: 4}}>
                                            <TextField
                                                label='ID'
                                                variant='standard'
                                                sx={{width: 200}}
                                                value={search.id ? search.id : ''}
                                                onChange={handleSearch("id")}
                                                onKeyUp={handleKeyUp}
                                            />
                                        </Stack>
                                        <Stack sx={{ml: 4}}>
                                            <TextField
                                                label='제목'
                                                variant='standard'
                                                sx={{width: 200}}
                                                value={search.question == null ? '' : search.question}
                                                onChange={handleSearch("question")}
                                                onKeyUp={handleKeyUp}
                                            />
                                        </Stack>
                                        <Stack direction="row"
                                               sx={{ml: 5, mt: 2}}>
                                            <FormLabel sx={{mt: 1}}>카테고리</FormLabel>
                                            <Select
                                                value={search.faqType || ''}
                                                size={"small"}
                                                sx={{minWidth: 200, ml: 2}}
                                                onChange={handleSearch('faqType')}
                                            >
                                                <MenuItem value={''}>전체</MenuItem>
                                                {renderType('FAQ_TYPE')}
                                            </Select>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row"
                                           justifyContent={"flex-end"}
                                           sx={{mb: 3, mr: 2}}>
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
                                    <Divider/>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                    <Container maxWidth="xl">
                        <Box sx={{mb: 1, py: 2, ml: 3, mt: 2}}>
                            <FaqListDetail
                                lists={data}
                                count={count}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPage={search.size}
                                page={search.page}
                            />
                        </Box>
                    </Container>
                </Box>
            </div>
        </>
    )
};

FaqList.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default FaqList;