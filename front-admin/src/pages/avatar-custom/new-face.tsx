import Head from "next/head";
import React, {useState} from "react";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import {CustomFaceDetail} from "../../components/avatar-custom-components/custom-face-detail";
import {NextPage} from "next";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {AvatarCustomModel} from "../../types/avatar-custom";
import toast from "react-hot-toast";
import axiosInstance from "../../plugins/axios-instance";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useRouter} from "next/router";

const NewFace: NextPage = () => {
    const router = useRouter();
    const [copy, setCopy] = useState<AvatarCustomModel>({
        id: null,
        avatarName: "",
        avatarHair: [],
        listOrder: null,
        verified: null,
        activated: null,
        hairWithoutImageUrl: "",
        mainImageUrl: "",
        copyHairWithoutImageUrl: "",
        copyMainImageUrl: "",
        hairWithoutImage: [],
        mainImage: []
    });
    const [faces, setFaces] = useState<AvatarCustomModel>({
        id: null,
        avatarName: "",
        avatarHair: [],
        listOrder: null,
        verified: true,
        activated: true,
        hairWithoutImageUrl: "",
        mainImageUrl: "",
        copyHairWithoutImageUrl: "",
        copyMainImageUrl: "",
        hairWithoutImage: [],
        mainImage: []
    });

    const handlePostFace = async (): Promise<void> => {
        if(!faces.avatarName) {
            toast.error('이름을 입력해주세요.');
            return;
        }
        if(faces.mainImage === []) {
            toast.error('메인 이미지를 입력해주세요.');
            return;
        }
        if(faces.hairWithoutImage === []) {
            toast.error('민머리 아바타 이미지를 입력해주세요.');
            return;
        }
        if(faces.avatarHair === []) {
            toast.error('헤어 누끼 이미지를 입력해주세요.');
            return;
        }
        const postFace = {...faces};
        console.log(postFace)
        if(window.confirm('저장하시겠습니까?')) {
            let formData = new FormData();
            Object.keys(postFace).forEach(key => {
                const data = postFace[key]
                if(key === 'id' || key === 'listOrder') {
                    console.log(data)
                } else if (key === 'avatarHair') {
                    formData.append(`avatarHair.id`, data.id)
                } else if (key === 'mainImage' || key === 'hairWithoutImage') {
                    data.forEach((file: any) => {
                        formData.append(key, file)
                    })
                } else {
                    formData.append(key, String(postFace[key]));
                }
            })
            return axiosInstance.post(`/services/member/api/avatar-face`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).then(res => {
                console.log(res.data);
                toast.success('저장 되었습니다.')
            }).catch(err => {
                console.log(err);
                toast.error('저장에 실패했습니다.');
            })
        }
    }

    const addFileImageHandler = (imageFiles) => {

    };

    const addMainFileImage = (imageFiles) => {
        setFaces({...faces, mainImage: imageFiles})
    };

    const addhairWithoutFileImage = (imageFiles) => {
        setFaces({...faces, hairWithoutImage: imageFiles})
    };

    const handleBack = (e) =>{
        e.preventDefault();
        router.push('/avatar-custom/avatar-custom');
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
                            <Grid item
                                  sx={{display: 'flex', justifyContent: "flex-start"}}>
                                <ArrowBackIcon
                                    fontSize="medium"
                                    sx={{mr: 2, mt:1, cursor: 'pointer'}}
                                    onClick={handleBack}
                                />
                                <Typography variant="h4">
                                    아바타 등록
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
                                    onClick={() => handlePostFace()}
                                >
                                    등록
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Card>
                        <CustomFaceDetail
                            data={faces}
                            setData={setFaces}
                            copy={copy}
                            setCopy={setCopy}
                            addFileImage={addFileImageHandler}
                            addMainFileImage={addMainFileImage}
                            addhairWithoutFileImage={addhairWithoutFileImage}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
}

NewFace.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default NewFace;