import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Stack, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import React, {useEffect, useState} from "react";
import CreateFaqDetail from "../../../components/b2b-partner/faq/create-faq-detail";
import {useRouter} from "next/router";
import toast from "react-hot-toast";
import {defaultFaqModel, FaqDetailModel} from "../../../types/b2b-partner-model/faq-model";
import {faqApi} from "../../../b2b-partner-api/faq-api";
import DeleteIcon from "@mui/icons-material/Delete";

const CorrectionFaq: NextPage = () => {
    const router = useRouter();
    const {id} = router.query;
    const [faqModel, setFaqModel] = useState<FaqDetailModel>(defaultFaqModel);


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
            getFaqDetail(id);
        }
    }, [id])

    const getFaqDetail = async (id) => {
        await faqApi.getFaq(id).then((res) => {
            setFaqModel(res);
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleCorrectionFaq = async (): Promise<void> => {
        if(!faqModel.question) {
            toast.error('질문을 입력해주세요.');
            return;
        }
        if(!faqModel.answer) {
            toast.error('내용을 입력해주세요.');
            return;
        }
        if(!faqModel.faqType) {
            toast.error('카테고리를 입력해주세요.');
            return;
        }

        if(window.confirm('수정하시겠습니까?')) {
            await faqApi.putFaq(faqModel.id, faqModel
            ).then(res => {
                console.log(res);
                toast.success('수정되었습니다.')
                router.push('/b2b-partner/faq/faq-list?storeSearch=true');
            }).catch(err => {
                console.log(err);
                toast.error('수정에 실패했습니다.');
            })
        }
    }

    const handleDeleteFaq = async () => {
        if(window.confirm('삭제하시겠습니까?')) {
            await faqApi.deleteFaq(faqModel.id, {
                    id: faqModel.id
                }
            ).then(res => {
                console.log(res);
                toast.success('삭제되었습니다.')
                router.push('/b2b-partner/faq/faq-list?storeSearch=true');
            }).catch(err => {
                console.log(err);
                toast.error('삭제에 실패했습니다.');
            })
        }
    }

    const handleBack = (e) =>{
        e.preventDefault();
        router.push('/b2b-partner/faq/faq-list?storeSearch=true');
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
                                    FAQ 상세
                                </Typography>
                            </Grid>
                            <Stack direction='row'>
                                <Button
                                    sx={{mr: 2}}
                                    color='error'
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    size="small"
                                    onClick={handleDeleteFaq}
                                >
                                    삭제
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    size="small"
                                    onClick={handleCorrectionFaq}
                                >
                                    수정
                                </Button>
                            </Stack>
                        </Grid>
                    </Box>
                    <Card sx={{pt: 5, pb: 5}}>
                        <CreateFaqDetail
                            faqModel={faqModel}
                            setFaqModel={setFaqModel}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

CorrectionFaq.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default CorrectionFaq;