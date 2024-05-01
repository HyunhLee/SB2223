import React, {useCallback, useEffect, useRef, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {Box, Container, Grid, Typography} from '@mui/material';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {HandsomeFitKanbanColumn} from "../../components/handsome-components/handsome-fit-kanban-column";
import {jennieFitProductAssignmentApi} from "../../handsome-api/jennie-fit-product-assignment-api";
import {handsomeAuthApi} from "../../handsome-api/auth-api";


interface Search {
    statusIn: string[];
    size?: number;
    page?: number;
}

const defaultSearch = () => {
    return {
        statusIn: ['REQUESTED', 'ASSIGNED', 'REJECTED'],
        size: 20,
        page: 1,
    }
}


const HandsomeJennieFitProduct: NextPage = () => {
    const TARGET = 'PRODUCT';
    const boxRef = useRef<HTMLElement>(null);
    const [search, setSearch] = useState<Search>(defaultSearch());
    const [columns, setColumns] = useState({
        assign: [],
        inspection: [],
        reject: [],
        complete: [],
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [requestList, setRequestList] = useState<boolean>(true);


    const setLoadingTrue = () => {
        setIsLoading(true);
        getFetchData();
    }
    const fetchMoreData = () => {
        setIsLoading(true);
        setIsLoading(false);
    }

    const duplicateItemRemove = (items) => {
        const unique = [...new Map(items.map((m) => [m.id, m])).values()];
        return unique
    }

    const _infiniteScroll = useCallback(() => {
        console.log('scroll working################')
        let client = boxRef.current;
        let scrollHeight = Math.max(client.scrollHeight, document.body.scrollHeight);
        let scrollTop = Math.max(client.scrollTop, document.body.scrollTop);
        let clientHeight = client.clientHeight;

        scrollHeight -= 80;
        if (scrollTop + clientHeight >= scrollHeight && isLoading == false) {
            setLoadingTrue();
        }
    }, [isLoading]);


    const getFetchData = async () => {
        let data;
        if(requestList){
            data = [{
                page: search.page != 1 ? 1 : 1,
                size: search.size,
                workerId: localStorage.getItem('userId')
            }];

            columns.assign = []
            columns.inspection = []
            columns.reject = []
            columns.complete = []
            setColumns(columns)
            setSearch({...search, page: 1})
            setRequestList(false)
        }else{
            data = [{
                page: search.page - 1,
                size: search.size,
                workerId: localStorage.getItem('userId')
            }];
            console.log('2')
        }

        console.log('send date page ', data[0])
        const asFilter = {
            ...data[0],
            status: 'ASSIGNED'
        }
        const asResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(asFilter);

        const rqFilter = {
            ...data[0],
            status: 'REQUESTED'
        }
        const rqResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(rqFilter);

        const rjFilter = {
            ...data[0],
            status: 'REJECTED'
        }
        const rjResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(rjFilter);

        const cpFilter = {
            ...data[0],
            status: 'COMPLETED'
        }
        const cpResult = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(cpFilter);

        if (
            asResult.count == search.page -1 &&
            rqResult.count == search.page -1 &&
            rjResult.count == search.page -1 &&
            cpResult.count == search.page -1) {
            setIsLoading(false);
            return;
        }



        setSearch({...search, page: search.page + 1})

        const assignArr = columns.assign;
        const inspectionArr = columns.inspection;
        const rejectArr = columns.reject;
        const completeArr = columns.complete;

        assignArr.push(...asResult.lists);
        inspectionArr.push(...rqResult.lists);
        rejectArr.push(...rjResult.lists);
        completeArr.push(...cpResult.lists);

        //중복방지
        const assign = duplicateItemRemove(assignArr)
        const inspection = duplicateItemRemove(inspectionArr)
        const reject = duplicateItemRemove(rejectArr)
        const complete = duplicateItemRemove(completeArr)

        setColumns({
            assign,
            inspection,
            reject,
            complete,
        })
        if (search.size > asResult.lists.length + rqResult.lists.length + rjResult.lists.length + cpResult.lists.length) {
            setSearch({...search, page: 1})
            return;
        }
        await fetchMoreData();
    }


    useEffect(() => {
        // if(!localStorage.getItem('handsomeAccessToken')) {
        //     handsomeAuthApi.login().then(res => {
        //         localStorage.setItem('handsomeAccessToken', res.accessToken);
        //         localStorage.setItem('handsomeRefreshToken', res.refreshToken);
        //         console.log('### handsomeAccessToken : ', res.accessToken);
        //         console.log('### handsomeRefreshToken : ', res.refreshToken);
        //     });
        // }

    }, [requestList]);


    useEffect(() =>{
        if(requestList){
            getFetchData();
            setRequestList(false)
        }

    },[requestList])

    useEffect(() => {
        let client = boxRef.current
        client.addEventListener('scroll', _infiniteScroll, true);
        return () => client.removeEventListener('scroll', _infiniteScroll, true);
    }, [_infiniteScroll]);

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
                    maxHeight: 800,
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
                                    한섬 Jennie FIT Product
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                            flexShrink: 1,
                            overflowX: 'auto',
                            overflowY: 'none'
                        }}
                    >
                        <HandsomeFitKanbanColumn name={'배정'}
                                                 items={columns.assign}
                                                 target={TARGET}
                                                 setRequest={setRequestList}
                        />
                        <HandsomeFitKanbanColumn name={'검수중'}
                                                 items={columns.inspection}
                                                 target={TARGET}
                                                 setRequest={setRequestList}
                        />
                        <HandsomeFitKanbanColumn name={'반려'}
                                                 items={columns.reject}
                                                 target={TARGET}
                                                 setRequest={setRequestList}
                        />
                        <HandsomeFitKanbanColumn name={'승인'}
                                                 items={columns.complete}
                                                 target={TARGET}
                                                 setRequest={setRequestList}
                        />
                    </Box>
                </Container>
            </Box>
        </>
    )
}

HandsomeJennieFitProduct.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default HandsomeJennieFitProduct;