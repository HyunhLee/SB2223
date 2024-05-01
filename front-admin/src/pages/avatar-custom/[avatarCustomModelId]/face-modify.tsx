import Head from "next/head";
import React, {useCallback, useEffect, useState} from "react";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import {CustomFaceDetail} from "../../../components/avatar-custom-components/custom-face-detail";
import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import {AvatarCustomModel} from "../../../types/avatar-custom";
import {useRouter} from "next/router";
import {avatarApi} from "../../../api/avatar-api";
import toast from "react-hot-toast";
import {useMounted} from "../../../hooks/use-mounted";
import axiosInstance from "../../../plugins/axios-instance";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FaceModify: NextPage = () => {

    const router = useRouter();
    const {avatarCustomModelId} = router.query;
    const isMounted = useMounted();
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
        verified: null,
        activated: null,
        hairWithoutImageUrl: "",
        mainImageUrl: "",
        copyHairWithoutImageUrl: "",
        copyMainImageUrl: "",
        hairWithoutImage: [],
        mainImage: []
    });

    const [search, setSearch] = useState({
        id: avatarCustomModelId
    })

    const getFaces = useCallback(async () => {
        try {
            const query = {...search}
            const result = await avatarApi.getAvatars(query);
            setFaces(result.lists[0]);
            setCopy((result.lists[0]))
            console.log(result.lists[0])
        } catch (err) {
            console.error(err);
            toast.error('얼굴 데이터를 불러오는데 실패하였습니다.');
        }
    },[])

    useEffect(() => {
        console.log(avatarCustomModelId)
        if (avatarCustomModelId && avatarCustomModelId !== '0') {
            (async () => {
                await getFaces();
            })()
        }
    }, [isMounted]);

    const addFileImageHandler = (imageFiles) => {

    };

    const addMainFileImageHandler = (imageFiles) => {
        setFaces({...faces, mainImage: imageFiles})
    };

    const addhairWithoutFileImageHandler = (imageFiles) => {
        imageFiles.forEach((file, index) => {

        })
        setFaces({...faces, hairWithoutImage: imageFiles})
    };

    const handlePostFace = async (id): Promise<void> => {
        console.log(faces)
        if(!faces.avatarName) {
            toast.error('이름을 입력해주세요.');
            return;
        }
        if(!faces.mainImageUrl && faces.mainImage.length === 0) {
            toast.error('메인 이미지를 입력해주세요.');
            return;
        }
        if(!faces.hairWithoutImageUrl && faces.hairWithoutImage.length === 0) {
            toast.error('민머리 아바타 이미지를 입력해주세요.');
            return;
        }
        if(faces.avatarHair.length === 0) {
            toast.error('헤어 누끼 이미지를 입력해주세요.');
            return;
        }
        const postFace = {...faces};
        console.log(postFace)
        if(window.confirm('수정하시겠습니까?')) {
            let formData = new FormData();
            Object.keys(postFace).forEach(key => {
                const data = postFace[key]
                if (key === 'avatarHair') {
                    formData.append(`avatarHair.id`, data.id)
                } else if (key === 'mainImage' || key === 'hairWithoutImage') {
                    data.forEach((file: any) => {
                        formData.append(key, file)
                    })
                } else {
                    formData.append(key, String(postFace[key]));
                }
            })
            return axiosInstance.post(`/services/member/api/avatar-face/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).then(res => {
                console.log(res.data);
                toast.success('수정 되었습니다.')
            }).catch(err => {
                console.log(err);
                toast.error('수정에 실패했습니다.');
            })
        }
    }

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
                                    아바타 수정
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
                                    onClick={() => handlePostFace(faces.id)}
                                >
                                    수정
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
                            addMainFileImage={addMainFileImageHandler}
                            addhairWithoutFileImage={addhairWithoutFileImageHandler}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
}

FaceModify.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default FaceModify;