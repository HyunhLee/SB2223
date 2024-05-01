import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import NewPlanningDetail from "../../../components/home-app-component/planning/new-planning-detail";
import React, {useCallback, useEffect, useState} from "react";
import {defaultNewPlanningModel, NewPlanningModel} from "../../../types/home-app-model/new-planning-model";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, IconButton, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {useRouter} from "next/router";
import {toast} from "react-hot-toast";
import {newPlanningApi} from "../../../api/new-planning-api";

const NewPlanning: NextPage = () => {
    const router = useRouter();
    const [plan, setPlan] = useState<NewPlanningModel>(defaultNewPlanningModel())

    useEffect(() => {
        getPlanning();
    }, []);

    const getPlanning = useCallback(async () => {
        try {
            const data = {};
            const result = await newPlanningApi.getExhibitionList(data);
            setPlan({...plan, listOrder: result.count+1})
            console.log(result)
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
            await newPlanningApi.postNewPlanning(plan).then(res => {
                console.log(res);
                router.push('/home-app/planning/planning-total');
            }).catch(err => {
                console.log(err);
                toast.error('저장에 실패했습니다.')
            })
        }
    }

    return (
        <>
            <Head>
                New Planning | Style Bot
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
                                    신규 기획전 등록
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
                                    등록
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

NewPlanning.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
)

export default NewPlanning;
