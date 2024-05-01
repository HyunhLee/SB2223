import {NextPage} from "next";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import React, {useEffect, useState} from "react";
import {B2bPartnerAccountModel, defaultAccountModel} from "../../types/b2b-partner-model/b2b-partner-account-model";
import toast from "react-hot-toast";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import B2bPartnerCreateAccountDetail from "../../components/b2b-partner/b2b-partner-create-account-detail";
import {b2bPartnerAccountApi} from "../../b2b-partner-api/b2b-partner-acount-api";
import SaveIcon from "@mui/icons-material/Save";

const B2bPartnerCreateAccount: NextPage = () => {
    const [accountModel, setAccountModel] = useState<B2bPartnerAccountModel>(defaultAccountModel());
    const [company, setCompany] = useState([]);
    const checkEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i

    useEffect(() => {
        b2bPartnerAccountApi.getPartnerMall().then(res => {setCompany(res)});
    },[])

    const handlePostAccount = async (): Promise<void> => {
        if(!accountModel.mallId) {
            toast.error('회사명을 선택해주세요.');
            return;
        }
        if(!accountModel.login) {
            toast.error('아이디를 입력해주세요.');
            return;
        }
        if(!checkEmail.test(accountModel.login)) {
            toast.error('아이디 형식이 올바르지 않습니다.')
            return;
        }
        if(!accountModel.password) {
            toast.error('비밀번호를 입력해주세요.');
            return;
        }
        if(!accountModel.email) {
            toast.error('이메일을 입력해주세요.');
            return;
        }
        if(!checkEmail.test(accountModel.email)) {
            toast.error('이메일 형식이 올바르지 않습니다.');
            return;
        }
        accountModel.name = accountModel.name.trim();

        if(window.confirm('생성하시겠습니까?')) {
            await b2bPartnerAccountApi.postPartnerAccount(accountModel
            ).then(res => {
                console.log(res);
                toast.success('생성되었습니다.')
                location.reload();
            }).catch(err => {
                console.log(err);
                toast.error('생성에 실패했습니다.');
            })
        }
    }

    return (
        <>
            <Head>
                Create Partner Account | Style Bot
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
                                    B2B 담당자 계정 추가
                                </Typography>
                            </Grid>
                            <Button
                                startIcon={<SaveIcon />}
                                variant="contained"
                                size='small'
                                onClick={handlePostAccount}
                            >
                                등록
                            </Button>
                        </Grid>
                    </Box>
                    <Card sx={{pt: 5, pb: 5}}>
                        <B2bPartnerCreateAccountDetail
                            accountModel={accountModel}
                            setAccountModel={setAccountModel}
                            company={company}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

B2bPartnerCreateAccount.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default B2bPartnerCreateAccount;
