import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {NewPlanningModel} from "../../../types/home-app-model/new-planning-model";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {PlanManagementDetail} from "../../../components/home-app-component/planning/plan-management-detail";
import {newPlanningApi} from "../../../api/new-planning-api";
import {toast} from "react-hot-toast";

const PlanManagement: NextPage = () => {
    const router = useRouter();
    const [plan, setPlan] = useState<NewPlanningModel[]>([]);

    useEffect(() => {
        getPlan();
    }, [])

    const getPlan = async () => {
        const data = {displayStatus: 'Display_On'}
        await newPlanningApi.getExhibitionList(data).then(res => {
            let result = res.lists.sort((a, b) => {return a.listOrder - b.listOrder})
            setPlan(result);
        })
    }

    const handleBack = (e) => {
        e.preventDefault();
        router.push('/home-app/planning/planning-total?storeSearch=true');
    }

    const handlePatch = async () => {
        const data = [];
        if(window.confirm('수정하시겠습니까?')) {
            plan.forEach(item => {
                data.push({id: item.id, listOrder: plan.indexOf(item)+1})
            })
            await newPlanningApi.patchNewPlanning(data).then(res => {
                console.log(res);
                router.push('/home-app/planning/planning-total');
            }).catch(err => {
                console.log(err);
                toast.error('수정에 실패했습니다.')
            })
        }
    }

    return (
        <>
            <Head>
                Plan Management | Style Bot
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
                        <Box sx={{maxWidth: 130, mb: 2}}>
                            <a onClick={handleBack}
                               style={{cursor: 'pointer'}}>
                                <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                                    <ArrowBackIcon
                                        fontSize="small"
                                        sx={{mr: 1}}
                                    />
                                    <Typography variant="subtitle2">
                                        기획전 리스트
                                    </Typography>
                                </Grid>
                            </a>
                        </Box>
                        <Grid
                            container
                            justifyContent="space-between"
                            sx={{mb: 2}}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    기획전 진열 관리
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
                                    onClick={() => handlePatch()}
                                >
                                    수정
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Card>
                        <PlanManagementDetail
                            plan={plan}
                            setPlan={setPlan}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

PlanManagement.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default PlanManagement;