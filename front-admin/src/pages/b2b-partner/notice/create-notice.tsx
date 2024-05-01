import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import React, {useState} from "react";
import {useRouter} from "next/router";
import toast from "react-hot-toast";
import {noticeApi} from "../../../b2b-partner-api/notice-api";
import CreateNoticeDetail from "../../../components/b2b-partner/notice/create-notice-detail";
import {defaultNoticeModel, NoticeDetailModel} from "../../../types/b2b-partner-model/notice-model";

const CreateNotice: NextPage = () => {
    const router = useRouter();
    const [noticeModel, setNoticeModel] = useState<NoticeDetailModel>(defaultNoticeModel);

    //del img index
    const [delImg, setDelImg] = useState([]);
    //새로 첨부되어질 파일만 담아두기
    const [files, setFiles] = useState( []);

    const handlePostNotice = async (): Promise<void> => {
        if(!noticeModel.title) {
            toast.error('제목을 입력해주세요.');
            return;
        }
        if(!noticeModel.contents) {
            toast.error('내용을 입력해주세요.');
            return;
        }
        if(noticeModel.topFix) {
            if (!noticeModel.fixStartDate || !noticeModel.fixEndDate) {
                toast.error('상단 고정일을 입력해주세요.');
                return;
            }
        }

        let formData = new FormData();
        formData.append('title', noticeModel.title);
        formData.append('contents', noticeModel.contents);
        // @ts-ignore
        formData.append('topFix', noticeModel.topFix);
        if(noticeModel.topFix){
            // @ts-ignore
            formData.append('fixStartDate', noticeModel.fixStartDate);
            // @ts-ignore
            formData.append('fixEndDate', noticeModel.fixEndDate);
        }
        files.forEach((f) => {
            formData.append('imageList', f);
        })


        if(window.confirm('등록하시겠습니까?')) {
            await noticeApi.postNotice(formData
            ).then(res => {
                toast.success('등록되었습니다.')
                router.push('/b2b-partner/notice/notice-list?storeSearch=true');
            }).catch(err => {
                console.log(err);
                toast.error('등록에 실패했습니다.');
            })
        }
    }

    const handleBack = (e) =>{
        e.preventDefault();
        router.push('/b2b-partner/notice/notice-list?storeSearch=true');
    }

    return (
        <>
            <Head>
                Create Notice | Style Bot
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
                            <Grid item
                                  sx={{display: 'flex', justifyContent: "flex-start"}}>
                                <ArrowBackIcon
                                    fontSize="medium"
                                    sx={{mr: 2, mt:1, cursor: 'pointer'}}
                                    onClick={handleBack}
                                />
                                <Typography variant="h4">
                                    공지사항 추가
                                </Typography>
                            </Grid>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                size="small"
                                onClick={handlePostNotice}
                            >
                                등록
                            </Button>
                        </Grid>
                    </Box>
                    <Card sx={{pt: 5, pb: 5}}>
                        <CreateNoticeDetail
                            noticeModel={noticeModel}
                            setNoticeModel={setNoticeModel}
                            setDelImg={setDelImg}
                            setFiles={setFiles}
                            files={files}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

CreateNotice.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default CreateNotice;