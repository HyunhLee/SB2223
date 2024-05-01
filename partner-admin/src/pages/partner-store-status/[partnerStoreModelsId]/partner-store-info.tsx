import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {partnerStoreStatusApi} from "../../../api/partner-store-status-api";
import {ApplyStoreModels} from "../../../types/apply-store-model";
import Head from "next/head";
import {Box, Container, Grid, IconButton, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PartnerStoreInfoDetail from "../../../components/partner-store-status/partner-store-info-detail";
import PartnerStoreInfoDetailB2B from "../../../components/partner-store-status/partner-store-info-detail-b2b";
import {useTranslation} from "react-i18next";

const PartnerStoreInfo: NextPage = () => {
    const router = useRouter();
    const {t} = useTranslation();
    const {partnerStoreModelsId} = router.query;
    const [storeModel, setStoreModel] = useState<ApplyStoreModels>()

    useEffect(() => {
        if (partnerStoreModelsId && partnerStoreModelsId !== '0') {
            (async () => {
                await getStore();
            })()
        }
    }, [])

    const getStore = useCallback(async () => {
        try {
            const result = await partnerStoreStatusApi.getPartnerStore(partnerStoreModelsId);
            setStoreModel(result);
            console.log(result)
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handleBack = (e) => {
        e.preventDefault();
        router.push(`/partner-store-status/partner-store-status?storeSearch=true`);
    }

    let STATUS = 'B2B';

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
                                        {t("pages_partnerStoreStatus_partnerStoreInfo_typography_backPartnerStoreStatus")}
                                    </Typography>
                                </IconButton>
                            </Grid>
                        </Box>
                        <Box sx={{mb: 4}}>
                            <Box>
                                <Typography variant="h4">
                                    {t("pages_partnerStoreStatus_partnerStoreInfo_typography_partnerStoreInfo")}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    {STATUS == 'B2C' ?
                        <Box>
                            <PartnerStoreInfoDetail
                                data={storeModel}
                            />
                        </Box>
                        :
                        <Box>
                            <PartnerStoreInfoDetailB2B
                                data={storeModel}
                            />
                        </Box>
                    }
                    {/*{storeModel.serviceStatus == 'B2C' ?*/}
                    {/*    <Box>*/}
                    {/*        <PartnerStoreInfoDetail*/}
                    {/*            data={storeModel}*/}
                    {/*        />*/}
                    {/*    </Box>*/}
                    {/*    :*/}
                    {/*    <Box>*/}
                    {/*        <PartnerStoreInfoDetailB2b*/}
                    {/*            data={storeModel}*/}
                    {/*        />*/}
                    {/*    </Box>*/}
                    {/*}*/}
                </Container>
            </Box>
        </>
    )
}

PartnerStoreInfo.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default PartnerStoreInfo;