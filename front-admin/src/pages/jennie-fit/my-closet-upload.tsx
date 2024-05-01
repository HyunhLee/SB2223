import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import React, {useEffect, useState} from "react";
import {NextPage} from "../../../next";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import MyClosetUploadComponent from "../../components/jennie-fit/my-closet-upload-component";
import toast from "react-hot-toast";
import axiosInstance from "../../plugins/axios-instance";
import _ from "lodash";
import {EmailListModel, MyClosetUploadModel} from "../../types/my-closet-upload-model";
import {myClosetUploadApi} from "../../api/my-closet-upload-api";
import {GetClosetCategoryId} from "../../contexts/data-context";
import Loading from "../../components/jennie-fit/loading";

const MyClosetUpload: NextPage = () => {
    const [loading, setLoading] = useState(true);
    const [requestEmail, setRequestEmail] = useState<boolean>(false);
    const [emailList, setEmailList] = useState<EmailListModel[]>([]);
    const [myclosetModel, setMyclosetModel] = useState<MyClosetUploadModel>({
        adjusted: true,
        brandName: "",
        categoryConcat: "",
        categoryId: null,
        closetCategoryId: null,
        colorType: "",
        description: "",
        id: null,
        inspectionStatus: "REQUESTED",
        label: "",
        lengthType: "",
        mainImageUrl: "",
        maskImageUrl: "",
        necklineType: "",
        originalImageUrl: "",
        originalImage: [],
        patternType: "",
        putOnImageUrl: "",
        seasonTypes: "",
        silhouetteType: "",
        sleeveType: "",
        userDressCategory: [],
        verified: true,
        registrationType: "AUTOMATIC_CLOSET",
        email: "",
        userId: null,
        categoryIds: []
    });

    useEffect(() => {
        setLoading(false);
    },[])

    useEffect(
        () => {
            (async () => {
                if (!requestEmail) {
                    await getEmailLists()
                }
            })()
        },
        [requestEmail]
    );

    const handleRefreshList = async (): Promise<void> => {
        setRequestEmail(true);
    };

    const getEmailLists = async () => {
        try {
            const result = await myClosetUploadApi.getEmail();
            console.log('email result: ', result);
            setEmailList(result);
        } catch (err) {
            console.error(err);
        }
    }

    const handlePostProduct = async (): Promise<void> => {
        if(myclosetModel.closetCategoryId == null) {
            myclosetModel.closetCategoryId = GetClosetCategoryId(myclosetModel.categoryIds)
            myclosetModel.categoryId = myclosetModel.closetCategoryId
        }
        if(!myclosetModel.registrationType) {
            toast.error('등록자를 입력해주세요.');
            return;
        }
        if(myclosetModel.originalImage.length < 1) {
            toast.error('메인 이미지를 입력해주세요.');
            return;
        }
        if(!myclosetModel.categoryIds) {
            toast.error('카테고리를 입력해주세요.');
            return;
        }
        if(!myclosetModel.colorType) {
            toast.error('컬러를 입력해주세요.');
            return;
        }
        if(!myclosetModel.patternType) {
            toast.error('패턴을 입력해주세요.');
            return;
        }
        if(!myclosetModel.seasonTypes) {
            toast.error('시즌을 입력해주세요.');
            return;
        }
        const saveData = {...myclosetModel};
        console.log(myclosetModel)
        if (window.confirm('저장하시겠습니까?')) {
            setLoading(true)
            let formData = new FormData()
            Object.keys(saveData).forEach(key => {
                if(key === 'originalImage') {
                    saveData[key].forEach((file: any) => {
                        formData.append(key, file)
                    })
                } else if(key === 'id') {
                    console.log(key)
                } else {
                    formData.append(key, String(saveData[key]));
                }
            })
            if(myclosetModel.registrationType == "AUTOMATIC_CLOSET") {
                return axiosInstance.post(`/services/member/api/user-dresses/collector/${myclosetModel.registrationType}/${myclosetModel.userId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then(res => {
                    setLoading(false);
                    console.log(res.data);
                    toast.success('저장에 성공했습니다.');
                    location.reload();
                }).catch(err => {
                    setLoading(false);
                    console.log(err);
                    toast.error('저장에 실패했습니다.');
                });
            } else if(myclosetModel.registrationType == "AUTOMATIC_LEARNING") {
                return axiosInstance.post(`/services/member/api/user-dresses/collector/${myclosetModel.registrationType}/0`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then(res => {
                    setLoading(false);
                    console.log(res.data);
                    toast.success('저장에 성공했습니다.');
                    location.reload();
                }).catch(err => {
                    setLoading(false);
                    console.log(err);
                    toast.error('저장에 실패했습니다.');
                });
            }
        }
    };

    const changeSeasonHandler = (value: string, checked: boolean): void => {
        let season = []
        if (myclosetModel.seasonTypes) {
            season = myclosetModel.seasonTypes.split(',');
        }
        if (checked) {
            season.push(value);
        } else {
            _.remove(season, (data) => {
                return data == value;
            });
        }
        setMyclosetModel(prevData => ({
            ...prevData,
            seasonTypes: season.join(',')
        }))
    }

    const addFileImageHandler = (imageFiles) => {
        imageFiles.forEach((file, index) => {
            file.key = `key${index}`;
        })
        myclosetModel.originalImage = imageFiles
    };

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
                    <Box sx={{mb: 4}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    내 옷 수동 등록
                                </Typography>
                            </Grid>
                            {console.log('hotfix production')}
                            <Grid
                                item
                                sx={{m: -1}}>
                                {loading ? <Loading /> : <Button
                                    component="a"
                                    startIcon={<SaveIcon fontSize="small"/>}
                                    sx={{m: 1}}
                                    variant="contained"
                                    onClick={handlePostProduct}
                                >
                                    등록
                                </Button>}
                            </Grid>
                        </Grid>
                    </Box>
                    <Card>
                        <MyClosetUploadComponent
                            addFileImage={addFileImageHandler}
                            data={myclosetModel}
                            changeSeason={changeSeasonHandler}
                            setData={setMyclosetModel}
                            emailList={emailList}
                            setEmailList={setEmailList}
                            refreshList={handleRefreshList}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
};

MyClosetUpload.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default MyClosetUpload;