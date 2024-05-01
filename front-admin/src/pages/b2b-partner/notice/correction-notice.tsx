import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Stack, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import toast from "react-hot-toast";
import {noticeApi} from "../../../b2b-partner-api/notice-api";
import {defaultNoticeModel, NoticeDetailModel} from "../../../types/b2b-partner-model/notice-model";
import CreateNoticeDetail from "../../../components/b2b-partner/notice/create-notice-detail";
import DeleteIcon from "@mui/icons-material/Delete";

const CorrectionNotice: NextPage = () => {
    const router = useRouter();
    const {id} = router.query;
    const [noticeModel, setNoticeModel] = useState<NoticeDetailModel>(defaultNoticeModel);

    //del img index
    const [delImg, setDelImg] = useState([]);

    //새로 첨부되어질 파일만 담아두기
    const [files, setFiles] = useState( []);

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
        if(id && id !== '0') {
            getNoticeDetail(id);
        }
    }, [id])


    const getNoticeDetail = async (id) => {
        await noticeApi.getNotice(id).then((res) => {
            setNoticeModel(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleCorrectionNotice = async (): Promise<void> => {
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
        // @ts-ignore
        formData.append('id', noticeModel.id);
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
        if(delImg.length > 0){
            // @ts-ignore
            formData.append('delIdxs', delImg);
        }
        if(files.length >0){
            files.forEach((f) => {
                formData.append('imageList', f);
            })
        }

        if(window.confirm('수정하시겠습니까?')) {
            await noticeApi.patchNotice(formData
            ).then(res => {
                toast.success('수정되었습니다.')
                router.push('/b2b-partner/notice/notice-list?storeSearch=true');
            }).catch(err => {
                console.log(err);
                toast.error('수정에 실패했습니다.');
            })
        }
    }

    const handleDeleteNotice = async () => {
        if(window.confirm('삭제하시겠습니까?')) {
            await noticeApi.deleteNotice(noticeModel.id, {
                    id: noticeModel.id
                }
            ).then(res => {
                console.log(res);
                toast.success('삭제되었습니다.')
                router.push('/b2b-partner/notice/notice-list?storeSearch=true');
            }).catch(err => {
                console.log(err);
                toast.error('삭제에 실패했습니다.');
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
                Correction Partner Account | Style Bot
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
                                    공지사항 상세
                                </Typography>
                            </Grid>
                            <Stack direction='row'>
                                <Button
                                    sx={{mr: 2}}
                                    color='error'
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    size="small"
                                    onClick={handleDeleteNotice}
                                >
                                    삭제
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    size="small"
                                    onClick={handleCorrectionNotice}
                                >
                                    수정
                                </Button>
                            </Stack>
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

CorrectionNotice.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default CorrectionNotice;