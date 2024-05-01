import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import React, {useContext, useState} from "react";
import {Box, Button, Card, CardContent, Grid, IconButton, Stack, Typography,} from "@mui/material";
import MdsPickRegisterDetail from "../../../components/home-app/mds-pick/mds-pick-register-detail";
import {defaultMdsPickModel, mdsPickModel} from "../../../types/home-app-model/mds-pick";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useRouter} from "next/router";
import {mdsPickApi} from "../../../api/mds-pickp-api";
import toast from "react-hot-toast";
import mergeImages from "merge-images";
import {v4 as uuidv4} from 'uuid';
import {adminAwsApi} from "../../../api/aws-api";
import {DataContext} from "../../../contexts/data-context";
import SaveIcon from "@mui/icons-material/Save";


const MdsPickRegister : NextPage = () => {
    const router = useRouter();
    const dataContext = useContext(DataContext)
    // @ts-ignore
    const [data, setData] = useState<mdsPickModel>(defaultMdsPickModel)

    //쌓인 데이터들
    const [firstStyleImg, setFirstStyleImg] = useState('');
    const [secondStyleImg, setSecondStyleImg] = useState('');
    const [thirdStyleImg, setThirdStyleImg] = useState('');
    const [ready, setReady] = useState(false);

    const mergeImage = async (imageFiles: any, type) => {
        if(imageFiles && imageFiles.length > 0){
            let temp = [];
            imageFiles.forEach((v) =>{
                temp.push({src: v.product.putOnImageUrl, x:0, y:0, crossOrigin : 'anonymous'})
            })

            //type별로 아바타 나눠서 저장
            if(type == 'one'){
                mergeImages([{src: '/mdpick_avatar1.png', x: 0, y:0, crossOrigin : 'anonymous'}, ...temp],{width: 400, height: 865, crossOrigin : 'anonymous'}).then((b64) => setFirstStyleImg(b64))
            }else if(type == 'two'){
                mergeImages([{src: '/mdpick_avatar2.png', x: 0, y:0, crossOrigin : 'anonymous'}, ...temp],{width: 400, height: 865, crossOrigin : 'anonymous'}).then((b64) => setSecondStyleImg(b64))
            }else if(type == 'three'){
                mergeImages([{src: '/mdpick_avatar3.png', x: 0, y:0, crossOrigin : 'anonymous'}, ...temp],{width: 400, height: 865, crossOrigin : 'anonymous'}).then((b64) => setThirdStyleImg(b64))
            }

        }
    }


    //url을 file로 바꾸는 것?
    const dataURLtoFile = (dataurl, fileName) => {
        console.log('dataurl', dataurl)
        let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = window.atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        console.log('mime', mime)
        return new File([u8arr], fileName, {type: mime});
    }


    let saveData;
    let responseOne;
    let responseSecond;
    let responseThird;

    const addPreSigned = async () => {
        let fileNameOne = uuidv4() + '.png';
        let typeOneStyle = {type: "BUCKET_URL_MDPICK", fileName: fileNameOne};
        responseOne = await adminAwsApi.getPreSignedUrl(typeOneStyle, dataURLtoFile(firstStyleImg, fileNameOne));
        const bucketUrl = dataContext.BUCKET_URL_MDPICK;
        let firstImageBucketUrl = `${bucketUrl}/${fileNameOne}`;
        //mdpickstyle안에 내용 setState 안되는 것들
        const firstStyleData = {...data.mdPickStyles[0], imageUrl: firstImageBucketUrl}
        // console.log(responseOne, 'aws response')



        let fileNameTwo = uuidv4() + '.png';
        let typeTwoStyle = {type: "BUCKET_URL_MDPICK", fileName: fileNameTwo};
        responseSecond = await adminAwsApi.getPreSignedUrl(typeTwoStyle, dataURLtoFile(secondStyleImg, fileNameTwo));
        let secondImageBucketUrl = `${bucketUrl}/${fileNameTwo}`;
        const secondStyleData = {...data.mdPickStyles[1], imageUrl: secondImageBucketUrl}
        // console.log(responseSecond, 'aws response')


        let fileNameThree = uuidv4() + '.png';
        let typeThreeStyle = {type: "BUCKET_URL_MDPICK", fileName: fileNameThree};
        responseThird = await adminAwsApi.getPreSignedUrl(typeThreeStyle, dataURLtoFile(thirdStyleImg, fileNameThree));
        let thirdImageBucketUrl = `${bucketUrl}/${fileNameThree}`;
        const thirdStyleData = {...data.mdPickStyles[2], imageUrl: thirdImageBucketUrl}
        // console.log(responseThird, 'aws response')


        setData({...data, mdPickStyles: [firstStyleData, secondStyleData, thirdStyleData]})
        saveData = {
            activated: true,
            titleKo: data.titleKo,
            titleEn: data.titleEn,
            mdPickStyles: [firstStyleData, secondStyleData, thirdStyleData],
            startDate: data.startDate,
            expireDate: data.expireDate,
        }
    }

    const saveFittingItems =async () => {

        await addPreSigned()
        console.log('save', saveData)

        if(data.titleKo == ''){
            window.confirm('한글 타이틀을 입력해주세요.')
            return;
        }
        if(data.titleEn == ''){
            window.confirm('영문 타이틀을 입력해주세요.')
            return;
        }
        if(data.startDate == '' || data.expireDate == '' ){
            window.confirm('게시기간을 입력해주세요.')
            return;
        }
        if(data.mdPickStyles[0].items.length < 1 || data.mdPickStyles[1].items.length < 1 ||data.mdPickStyles[2].items.length < 1 ){
            window.confirm('룩북 3가지를 모두 생성한 후 저장이 가능합니다.')
            return;
        }

        if(responseOne == 200 && responseSecond == 200 && responseThird == 200 && saveData != '') {
            const result = await mdsPickApi.postMdsPick(saveData);
            if (result == 201) {
                toast.success('저장이 완료되었습니다.');
                router.push('/home-app/mds-pick/mds-pick');
            }
        }
    }

    const handleBack = (e) => {
        e.preventDefault();
        router.back();
    }



    return (
        <>
            <Card>
            <CardContent>
                <Box sx={{ml: 3, mt:2}}>
                    <Grid sx={{display: 'flex', justifyContent: "flex-start"}}>
                        <IconButton
                            edge="end"
                            onClick={handleBack}
                        >
                            <ArrowBackIcon
                                fontSize="medium"
                                sx={{mr: 2, mt:0.5}}
                            />
                            <Typography variant="h5">
                                {`신규 MD's Pick 등록`}
                            </Typography>
                        </IconButton>
                    </Grid>
                </Box>
                <Stack direction="row"
                       justifyContent="flex-end"
                       alignItems="center">
                    <Button
                        component="a"
                        startIcon={<SaveIcon fontSize="small"/>}
                        variant="contained"
                        sx={{m: 1}}
                        onClick={saveFittingItems}
                    >
                        저장
                    </Button>
                </Stack>
                <MdsPickRegisterDetail data={data}
setData={setData}
mergeImage={mergeImage}/>
            </CardContent>
        </Card>
        </>
    )
}


MdsPickRegister.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default MdsPickRegister;