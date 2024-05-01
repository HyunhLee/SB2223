import {NextPage} from "next";
import {useRouter} from "next/router";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, IconButton, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import NewPlanningDetail from "../../../components/home-app-component/planning/new-planning-detail";
import React, {useCallback, useEffect, useState} from "react";
import {defaultNewPlanningModel, NewPlanningModel} from "../../../types/home-app-model/new-planning-model";
import {toast} from "react-hot-toast";
import {newPlanningApi} from "../../../api/new-planning-api";

const PlanningCorrection: NextPage = () => {
    const router = useRouter();
    const {id} = router.query;
    const [plan, setPlan] = useState<NewPlanningModel>(defaultNewPlanningModel());

    const beforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
        console.log('##############refresh#############')

    };

    //새로고침시 경고 팝업창
    useEffect(() => {
        try {
            window.addEventListener('beforeunload', beforeUnload);
            return () => {
                window.removeEventListener('beforeunload', beforeUnload);
            };
        } catch (error) {
            console.log(error);
        }
    }, []);


    useEffect(() => {
        if (id && id !== '0') {
            (async () => {
                await getPlanning(id);
            })()
        }
    }, [router.query]);

    const getPlanning = useCallback(async (id) => {
        try {
            const data = {id: id}
            const result = await newPlanningApi.getExhibitionList(data);
            setPlan(result.lists[0]);
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleBack = (e) => {
        e.preventDefault();
        router.push('/home-app/planning/planning-total');
    }

    const handlePost = async () => {
        if(!plan.imageUrl) {
            toast.error('이미지를 업로드해주세요.')
            return;
        }
        if(!plan.startDate || !plan.expireDate) {
            toast.error('게시 기간을 입력해주세요.')
            return;
        }
        if(!plan.title) {
            toast.error('타이틀을 입력해주세요.')
            return;
        }
        if(!plan.targetUrl) {
            toast.error('브랜드를 선택해주세요.')
            return;
        }

        if(window.confirm('저장하시겠습니까?')) {
            await newPlanningApi.putNewPlanning(plan).then(res => {
                console.log(res);
                router.push('/home-app/planning/planning-total?storeSearch=true');
            }).catch(err => {
                console.log(err);
                toast.error('저장에 실패했습니다.')
            })
        }
    }

    return (
        <>
            <Head>
                Planning Correction | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box>
                        <Box sx={{mb: 2}}>
                            <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                                <IconButton
                                    edge="end"
                                    onClick={handleBack}
                                >
                                    <ArrowBackIcon
                                        fontSize="small"
                                        sx={{mr: 1}}
                                    />
                                    <Typography variant="subtitle2">
                                        기획전 리스트
                                    </Typography>
                                </IconButton>
                            </Grid>
                        </Box>
                        <Grid
                            container
                            justifyContent="space-between"
                            sx={{mb: 2}}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    기획전 수정
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                sx={{m: -1}}>
                                <Button
                                    component="a"
                                    startIcon={<SaveIcon fontSize="small"/>}
                                    sx={{ m: 1 }}
                                    variant="contained"
                                    onClick={() => handlePost()}
                                >
                                    수정
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Card sx={{pt:10}}>
                        <NewPlanningDetail
                            plan={plan}
                            setPlan={setPlan}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

PlanningCorrection.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default PlanningCorrection;