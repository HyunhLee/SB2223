import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import {defaultLinkModel, InstagramFeedLinkModel} from "../../../types/home-app-model/instagram-feed-link-model";
import {instagramFeedLinkApi} from "../../../home-app-api/instagram-feed-link-api";
import InstagramFeedLinkDetail from "../../../components/home-app-component/instagram-feed/instagram-feed-link-detail";
import SaveIcon from "@mui/icons-material/Save";

const InstagramFeedLink: NextPage = () => {
    const [linkData, setLinkData] = useState<InstagramFeedLinkModel[]>([defaultLinkModel(), defaultLinkModel()]);

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        await instagramFeedLinkApi.getInstaLink(
        ).then(res => {
            setLinkData(res);
        })
    }

    const handlePostLink = async (): Promise<void> => {
        console.log('linkData ->', linkData)
        if(!linkData[0].imageUrl) {
            toast.error('첫번째 메인 팝업 이미지를 등록해주세요.');
            return;
        }
        if(!linkData[0].targetUrl) {
            toast.error('첫번째 URL을 입력해주세요.');
            return;
        }
        if(!linkData[1].imageUrl) {
            toast.error('두번째 메인 팝업 이미지를 등록해주세요.');
            return;
        }
        if(!linkData[1].targetUrl) {
            toast.error('두번째 URL을 입력해주세요.');
            return;
        }

        if(window.confirm('저장하시겠습니까?')) {
            await instagramFeedLinkApi.putInstaLink(linkData
            ).then(res => {
                console.log(res);
                toast.success('저장되었습니다.')
            }).catch(err => {
                console.log(err);
                toast.error('저장에 실패했습니다.');
            })
        }
    }

    return (
        <>
            <Head>
                Instagram Feed Link | Style Bot
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
                        <Grid
                            container
                            justifyContent="space-between"
                            sx={{mb: 2}}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    인스타 피드 링크
                                </Typography>
                            </Grid>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                size="small"
                                onClick={handlePostLink}
                            >
                                저장
                            </Button>
                        </Grid>
                    </Box>
                    <Card>
                        <InstagramFeedLinkDetail
                            linkData={linkData}
                            setLinkData={setLinkData}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

InstagramFeedLink.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
)


export default InstagramFeedLink;