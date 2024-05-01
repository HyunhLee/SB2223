import {NextPage} from "next";
import {useRouter} from "next/router";
import React, {useState} from "react";
import {defaultFaqModel, FaqDetailModel} from "../../../types/b2b-partner-model/faq-model";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreateFaqDetail from "../../../components/b2b-partner/faq/create-faq-detail";
import toast from "react-hot-toast";
import {faqApi} from "../../../b2b-partner-api/faq-api";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import SaveIcon from "@mui/icons-material/Save";

const CreateFaq: NextPage = () => {
    const router = useRouter();
    const [faqModel, setFaqModel] = useState<FaqDetailModel>(defaultFaqModel);

    const handlePostFaq = async (): Promise<void> => {
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

        if(window.confirm('등록하시겠습니까?')) {
            await faqApi.postFaq(faqModel
            ).then(res => {
                console.log(res);
                toast.success('등록되었습니다.')
                router.push('/b2b-partner/faq/faq-list?storeSearch=true');
            }).catch(err => {
                console.log(err);
                toast.error('등록에 실패했습니다.');
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
                Create FAQ | Style Bot
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
                                    FAQ 추가
                                </Typography>
                            </Grid>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                size="small"
                                onClick={handlePostFaq}
                            >
                                등록
                            </Button>
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

CreateFaq.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default CreateFaq;