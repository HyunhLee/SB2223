import Head from "next/head";
import React, {useState} from "react";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import {CustomHairDetail} from "../../components/avatar-custom-components/custom-hair-detail";
import {NextPage} from "next";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {AvatarHair} from "../../types/avatar-custom";
import toast from "react-hot-toast";
import axiosInstance from "../../plugins/axios-instance";

const NewHair: NextPage = () => {
    const [hairs, setHairs] = useState<AvatarHair>({
        id: null,
        activated: true,
        avatarHairColors: [],
        hairLengthType: "",
        hairType: "",
        hasBangs: true,
        listOrder: null,
        mainImageUrl: "",
        mainImage:[]
    })

    const handlePostHair = async (): Promise<void> => {
        if(!hairs.mainImageUrl) {
            toast.error('메인 이미지를 입력해주세요.');
            return;
        }
        if(!hairs.hairLengthType) {
            toast.error('기장을 입력해주세요.');
            return;
        }
        if(!hairs.hasBangs) {
            toast.error('앞머리 유무를 입력해주세요.');
            return;
        }
        if(!hairs.hairType) {
            toast.error('웨이브 유무를 입력해주세요.');
            return;
        }
        if(hairs.avatarHairColors.length === 0) {
            toast.error('헤어 컬러를 입력해주세요.');
            return;
        }
        const saveData = {...hairs};
        if (window.confirm('저장하시겠습니까?')) {
            let formData = new FormData()
            Object.keys(saveData).forEach(key => {
                if(key === 'avatarHairColors' || key === 'lastModifiedDate') {
                    if(key === 'avatarHairColors') {
                        saveData[key].forEach((file: any) => {
                            formData.append('avatarHairColors', file)
                        })
                    }
                } else if(key === 'id') {
                    console.log(key)
                } else {
                    formData.append(key, String(saveData[key]));
                }
            })

            return axiosInstance.post(`/services/member/api/avatarHairs`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).then(res => {
                console.log(res.data);
                window.confirm(`ID: ${res.data.id}`);
                location.reload();
            }).catch(err => {
                console.log(err);
                toast.error('저장에 실패했습니다.');
            });
        }
    }

    return (
        <>
            <Head>
                Avatar Custom | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{mb: 4}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    헤어스타일 등록
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
                                    onClick={() => handlePostHair()}
                                >
                                    등록
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Card>
                        <CustomHairDetail
                            data={hairs}
                            setData={setHairs}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
}

NewHair.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default NewHair;