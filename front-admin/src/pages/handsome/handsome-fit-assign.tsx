import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography
} from '@mui/material';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import ProductFitRequest from "../../components/handsome-components/handsome-product-fit-request";
import {decode} from "../../utils/jwt";
import {HandsomeFitStatusList} from "../../components/handsome-components/handsome-fit-status-list"
import moment from 'moment';
import {jennieFitProductAssignmentApi} from "../../handsome-api/jennie-fit-product-assignment-api";
import {jennieFitWorkerApi} from "../../handsome-api/jennie-fit-worker-api"
import ProductFitReassign from "../../components/handsome-components/handsome-product-fit-reassign";
import {HandsomeJennieFitStatus} from "../../types/handsome-model/handsome-jennie-fit-assignment-model";
import {HandsomeJennieFitWorkerModel} from "../../types/handsome-model/handsome-jennie-fit-worker-model";
import {handsomeAuthApi} from "../../handsome-api/auth-api";

const ProductAssignDialog = (props) => {
    const {onClose, open} = props;

    const handleCancel = () => {
        onClose();
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
            onClose={handleCancel}
            onBackdropClick={handleCancel}
        >
            <DialogTitle>Product</DialogTitle>
            <DialogContent dividers>
                <ProductFitRequest/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const ProductReassignDialog = (props) => {
    const {onClose, open} = props;

    const handleCancel = () => {
        onClose();
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
            onClose={handleCancel}
            onBackdropClick={handleCancel}
        >
            <DialogTitle>Product</DialogTitle>
            <DialogContent dividers>
                <ProductFitReassign/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}


interface Search {
    workDayFrom: Date,
    workDayTo: Date,
    userWorkerId: string,
    productWorkerId: string,
}

const defaultSearch = () => {
    return {
        workDayFrom: moment().add(-15, 'days').toDate(),
        workDayTo: new Date(),
        userWorkerId: '',
        productWorkerId: '',
    }
}

const HandsomeFitAssign: NextPage = () => {

    const [productStatusList, setProductStatusList] = useState<HandsomeJennieFitStatus[]>([]);
    const [productWorkerList, setProductWorkerList] = useState<HandsomeJennieFitWorkerModel[]>([]);

    const [openProductAssign, setOpenProductAssign] = React.useState(false);
    const [openProductReassign, setOpenProductReassign] = React.useState(false);

    useEffect(
        () => {
            (async () => {
                // if(!localStorage.getItem('handsomeAccessToken')) {
                //     handsomeAuthApi.login().then(res => {
                //         localStorage.setItem('handsomeAccessToken', res.accessToken);
                //         localStorage.setItem('handsomeRefreshToken', res.refreshToken);
                //         console.log('### handsomeAccessToken : ', res.accessToken);
                //         console.log('### handsomeRefreshToken : ', res.refreshToken);
                //     });
                // }
                await getLists();
                await getWorkerLists();
            })()
        },
        []
    );

    const getLists = async () => {
        try {

            const productStatusList = await jennieFitProductAssignmentApi.getJennieFitAssignmentsStatus();
            setProductStatusList(productStatusList);
        } catch (err) {
            console.error(err);
        }
    }

    const getWorkerLists = async () => {
        try {
            const result = await jennieFitWorkerApi.getJennieFitWorkers();
            // @ts-ignore
            setProductWorkerList(result);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClickProductAssign = () => {
        setOpenProductAssign(true);
    }

    const handleCloseProductAssign = () => {
        setOpenProductAssign(false);
    };

    const handleClickProductReassign = () => {
        setOpenProductReassign(true);
    }

    const handleCloseProductReassign = () => {
        setOpenProductReassign(false);
    };

    const jennieFitProductAssignDisplay = () => {
        return (decode(localStorage.getItem("accessToken")).auth.split(",").find(role => role === 'ROLE_ADMIN_PRODUCTFIT' || role === 'ROLE_ADMIN_MASTER'));
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
                    <Box sx={{mb: 1, py:2, ml: 3, mt: 2}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Typography variant="h4">
                                한섬 Fit Assign
                            </Typography>

                        </Grid>
                    </Box>
                    <Grid container >
                        {jennieFitProductAssignDisplay() ?
                            <Grid sx={{ width:"100%"}}>
                                <Card>
                                    <CardHeader
                                        action={
                                            <>
                                                <Button size='small'
                                                        variant="outlined"
                                                        sx={{mr: 1}}
                                                        onClick={handleClickProductAssign}>
                                                    상품 데이터 - 수동 배정
                                                </Button>
                                                <Button size='small'
                                                        variant="outlined"
                                                        onClick={handleClickProductReassign}>
                                                    작업 재배정
                                                </Button>
                                            </>
                                        }
                                    />
                                    <HandsomeFitStatusList
                                        lists={productStatusList}
                                        target={'PRODUCT'}
                                    />
                                </Card>
                            </Grid> : <></>
                        }
                    </Grid>
                </Container>
            </Box>
            <ProductAssignDialog
                open={openProductAssign}
                onClose={handleCloseProductAssign}
            />
            <ProductReassignDialog
                open={openProductReassign}
                onClose={handleCloseProductReassign}
            />
        </>
    )
}

HandsomeFitAssign.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default HandsomeFitAssign;