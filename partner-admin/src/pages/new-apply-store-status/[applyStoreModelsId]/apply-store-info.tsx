import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Container, Grid, IconButton, Stack, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ApplyStoreInfoDetail from "../../../components/new-apply-store-status/apply-store-info-detail";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {RejectDialog} from "../../../components/dialog/reject-dialog";
import {newApplyStoreStatusApi} from "../../../api/new-apply-store-status-api";
import {ApplyStoreModels} from "../../../types/apply-store-model";
import {useTranslation} from "react-i18next";

const ApplyStoreInfo: NextPage = () => {
    const router = useRouter();
    const {t} = useTranslation();
    const {applyStoreModelsId} = router.query;
    const [open, setOpen] = useState<boolean>(false);
    const [storeModel, setStoreModel] = useState<ApplyStoreModels>()

    useEffect(() => {
        if (applyStoreModelsId && applyStoreModelsId !== '0') {
            (async () => {
                await getStore();
            })()
        }
    }, []);

    const getStore = useCallback(async () => {
        try {
            const result = await newApplyStoreStatusApi.getStatus(applyStoreModelsId);
            setStoreModel(result);
            console.log(result)
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleBack = (e) => {
        e.preventDefault();
        router.push(`/new-apply-store-status/new-apply-store-status?storeSearch=true`);
    }

    const handleReject = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleCompleteAply = async (id) => {
        if (window.confirm(`${t("pages_newApplyStoreStatus_applyStoreInfo_window_confirm")}`)) {
            await newApplyStoreStatusApi.patchApplyStatus(id, "APPLY_COMPLETED"
            ).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
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
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box>
                        <Box sx={{mb: 2}}>
                            <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                                <IconButton aria-label="add"
                                            onClick={handleBack}>
                                    <ArrowBackIcon
                                        fontSize="small"
                                        sx={{mr: 1}}
                                    />
                                    <Typography variant="subtitle2">
                                        {t("button_backNewApplyStoreStatus")}
                                    </Typography>
                                </IconButton>
                            </Grid>
                        </Box>
                        <Box sx={{mb: 4}}>
                            <Stack
                                sx={{m: 1, display: 'flex', justifyContent: 'space-between'}}
                                direction='row'>
                                <Box>
                                    <Typography variant="h4">
                                        {t("pages_newApplyStoreStatus_applyStoreInfo_typography_header")}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Stack direction='row'>
                                        <Button
                                            sx={{m: 1}}
                                            color="error"
                                            variant="contained"
                                            onClick={handleReject}
                                        >
                                            {t("button_reject")}
                                        </Button>
                                        <Button
                                            sx={{m: 1}}
                                            color="secondary"
                                            variant="contained"
                                            onClick={() => handleCompleteAply(1)}
                                        >
                                            {t("button_completeApply")}
                                        </Button>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                    <Box>
                        <ApplyStoreInfoDetail
                            data={storeModel}
                        />
                    </Box>
                </Container>
            </Box>
            <RejectDialog
                open={open}
                onClose={handleClose}
                storeModel={storeModel}
            />
        </>
    )
}

ApplyStoreInfo.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default ApplyStoreInfo;