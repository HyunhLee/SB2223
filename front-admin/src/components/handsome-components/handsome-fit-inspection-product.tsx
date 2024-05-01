import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
    Box,
    Button,
    Card,
    Container,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {HandsomeFitInspectionProductList} from "./handsome-fit-inspection-product-list";
import {jennieFitProductAssignmentApi} from "../../handsome-api/jennie-fit-product-assignment-api";
import {HandsomeJennieFitAssignmentModel} from "../../types/handsome-model/handsome-jennie-fit-assignment-model";
import {DataContext} from "../../contexts/data-context";
import SearchIcon from "@mui/icons-material/Search";

export const HandsomeFitInspectionProduct: NextPage = () => {
    const dataContext = useContext(DataContext);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [pages, setPages] = useState(0);
    const [sizes, setSizes] = useState(10);
    const [search, setSearch] = useState({status:'REQUESTED', id: null, number: ''})

    const [assignProductUrgencylists, setUrgencyLists] = useState<HandsomeJennieFitAssignmentModel[]>([]);
    const [urgnecyCount, setUrgencyCount] = useState<number>(0);
    const [assignProductNormallists, setNormalLists] = useState<HandsomeJennieFitAssignmentModel[]>([]);
    const [normalCount, setNormalCount] = useState<number>(0);

    const [requestList, setRequestList] = useState<boolean>(false);

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

    const handleRefreshList = async (): Promise<void> => {
        setRequestList(true);
    };

    const getLists = async () => {
        try {
            const filter = {
                size: size, page: page+1, jennieFitAssignStatus: search.status, id:search.id, number:search.number
            }
            const urgencyResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsUrgency(filter);
            setUrgencyLists(urgencyResult.lists);
            setUrgencyCount(urgencyResult.count);

            const filters = {
                size: sizes, page: pages+1, jennieFitAssignStatus: search.status, id:search.id, number:search.number
            }
            const normalResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsNormal(filters);
            setNormalLists(normalResult.lists);
            setNormalCount(normalResult.count);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        setRequestList(true);
    },[]);

    const renderStatus = (value) =>{
        return Object.keys(dataContext[value]).map((key) => {
            return (
              <MenuItem key={key}
                        value={key}>{dataContext[value][key]}</MenuItem>
            )
        })
    }
    const getStatus = () => {
        return (search.status) ? search.status : 'all';
    }

    const changeStatusHandler = (changeValues) => {
        if(changeValues == 'all'){
            setSearch({...search, status: ''})
        }else{
            setSearch({...search, status: changeValues})
        }

    }

    const handleChange = (value) => {
        setSearch({...search, id: value})
    }

    const handleNumberChange = (value) => {
        setSearch({...search, number: value})
    }

    const handleClickReset = () => {
        setSearch({id: null, status: 'REQUESTED', number: ''})
        setPage(0)
        setPages(0)
        setSize(10)
        setSizes(10)
    };

    const handleClickSearch = async () => {
        setPage(0)
        setPages(0)
        setRequestList(true);
    }
    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            handleClickSearch()
        }
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
                    <Card sx={{py: 2}}>
                        <Stack direction='row'>
                            <Stack justifyContent={"center"}
                                   sx={{mr: 2, ml: 2, mb:1}}>
                                <TextField
                                  label="ID"
                                  variant="standard"
                                  value={search.id == null ? '' : search.id}
                                  onChange={e => handleChange(e.target.value)}
                                  onKeyUp={handleKeyUp}
                                  sx={{m: 1}}
                                />
                            </Stack>
                            <Stack justifyContent={"center"}
                                   sx={{mr: 2, ml: 2, mb:1}}>
                                <TextField
                                  label="상품번호"
                                  variant="standard"
                                  value={search.number ? search.number : ''}
                                  onChange={e => handleNumberChange(e.target.value)}
                                  onKeyUp={handleKeyUp}
                                  sx={{m: 1}}
                                />
                            </Stack>
                        <Stack justifyContent={"center"}
                               sx={{mr: 2, ml: 2,}}>
                            <FormLabel component="legend">검수 상태</FormLabel>
                        </Stack>
                        <Select
                          size={"small"}
                          sx={{minWidth: 150, height: 40, mt:2}}
                          value={getStatus()}
                          onChange={e=> {changeStatusHandler(e.target.value)}}
                        >
                            <MenuItem value={'all'}>전체</MenuItem>
                            {renderStatus('ASSIGN_STATUS')}
                        </Select>
                        </Stack>

                        <Stack direction="row"
                               justifyContent={"flex-end"}
                               sx={{mt: 3, mr: 2}}>
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
                    </Card>
                    <Card sx={{mt: 1}}>
                        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant="h4">긴급 작업</Typography>
                        </Grid>
                        <HandsomeFitInspectionProductList
                            lists={assignProductUrgencylists}
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
                        <HandsomeFitInspectionProductList
                            lists={assignProductNormallists}
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
        </>
    )
}