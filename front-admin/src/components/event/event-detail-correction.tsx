import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    FormLabel,
    IconButton,
    Input,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {EventAddImage} from "./event-add-image";
import React, {useContext, useEffect, useState} from "react";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import {v4 as uuidv4} from 'uuid';
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LaunchIcon from "@mui/icons-material/Launch";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {BrandDialog} from "../dialog/brand-dialog";
import {DataContext} from "../../contexts/data-context";
import {defaultEventModel, EventInfoModel} from "../../types/event";
import {adminAwsApi} from "../../api/aws-api";
import {toast} from "react-hot-toast";
import PreviewIcon from "@mui/icons-material/Preview";
import SaveIcon from "@mui/icons-material/Save";
import {eventPopupApi} from "../../api/event-api";
import {useRouter} from "next/router";
import _ from "lodash";
import {popupPreviewUrlConfig} from "../../config";

const ImagePreviewDialog = (props) => {
    const {imagePreview, imageUrl, open, onClose, ...other} = props;
    let url = popupPreviewUrlConfig.popupPreview

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxWidth: 500, height: 950}}}
            maxWidth="xs"
            open={open}
            onClose={handleClose}
            onBackdropClick={handleClose}
            {...other}
        >
            <DialogContent dividers
sx={{maxWidth: 500, height: 732}}>
                <Box sx={{ width: 375, height: 732, backgroundColor: '#555555', position: 'relative'}}>
                    <img
                        src={imagePreview ? `${url}${imageUrl}` : `${imageUrl}`}
                        style={{position:'absolute', bottom: 63, borderTopRightRadius: '10px', borderTopLeftRadius: '10px', }}
                        loading="lazy"
                        width={'100%'}
                        onClick={handleClose}
                    />
                    <Typography sx={{display: 'flex', position:'absolute', right: 0, bottom: -20, fontSize: 12}}>모바일 사이즈 : 375 x 732 기준</Typography>
                    <Box sx={{width: '100%', display: 'flex', height: 63, backgroundColor: 'lightgray', position:'absolute', bottom: 0}}>
                        <Button sx={{ width: '50%', backgroundColor: 'lightgray', color: 'darkGray'}}>오늘 그만 보기</Button>
                        <Button sx={{ width: '50%', backgroundColor: 'lightGray', color: 'black'}}>닫기</Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus
onClick={handleClose}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const EventDetailCorrection = (props) => {
    const {popupInfo, onClose} = props;
    const router = useRouter();
    const dataContext = useContext(DataContext);
    const brandUrl = '/brand/'
    let brandId;

    const [data, setData] = useState(popupInfo?.id ? popupInfo : defaultEventModel());
    const [anchorMainImg, setAnchorMainImg] = useState(null);
    const mainImgDialogOpen = Boolean(anchorMainImg);
    const [brandOpen, setBrandOpen] = useState<Boolean>(false);
    const [openImgDialog, setOpenImgDialog] = useState<boolean>(false);
    const [ready, setReady] = useState(!popupInfo?.imageUrl);
    const [disabled, setDisabled] = useState( false);
    const [detailUrl, setDetailUrl] = useState(data?.targetUrl.substr(0,4) == 'http' ? data?.targetUrl : '' )


    useEffect(() => {
        if (data?.targetUrl) {
            getTargetUrl(data.targetUrl)
            getBrandId(data.targetUrl)
            getBrandName(brandId)
            if(brandId){
                setDisabled(true)
            }
        }
    }, [brandOpen])


    const getTargetUrl = (value) => {
        let standard = value?.substr(0, 4);
        if (standard == 'http') {
           return setDetailUrl(value)
        }else{
            return setDetailUrl('')
        }
    }

    const getBrandName = (brandId) => {
        return _.sortBy(dataContext.BRAND, 'id').filter((brand, index) => {
            if(brand.id == brandId){
                setData({...data, brandName: brand.name, targetUrl : `${brandUrl}${brandId}`, popupType: 'BRAND'})
            }
        })}

    const getBrandId = (url) : any => {
        let standard = url?.substr(0, 4)
        if (standard !== 'http') {
            brandId = url?.substr(7)
            setData({...data, brandId: brandId, targetUrl : ''})
        }
    }

    const handleOnChange = (prop: keyof EventInfoModel) => (value) => {
        if (props == 'startDate') {
            setData({ ...data, startDate: value});
        }
        if (props == 'expireDate') {
            setData({ ...data, expireDate: value});
        }else{
            setData({...data, [prop]: value});
        }
    };

    const handleMainImgUploadClick = (e) => {
        setAnchorMainImg(e.currentTarget)
    };

    const handleClose = () => {
        setAnchorMainImg(null)
    };

    const handleClickBrandOpen = () => {
        setBrandOpen(true);
    };

    const handleBrandClose = (value) => {
        if (value) {
            setData({
                ...data,
                brandId: value.id,
                brandName: value.name,
                targetUrl: `${brandUrl}${value.id}`,
                popupType: 'BRAND'
            });
        }
        setBrandOpen(false);
    };

    const handleClickClearBrand = () => {
        setData({
            ...data,
            brandId: null,
            brandName: '',
            targetUrl: '',
            popupType: ''
        });
        setDetailUrl('')
        setDisabled(false)
    };

    const addPopUpImageHandler = async (file): Promise<void> => {
        if (file?.length > 1) {
            window.confirm('이미지 파일은 한 장만 업로드해주세요.');
            return;
        }
        if (file) {
            file.forEach((img) => {
                img.preview = URL.createObjectURL(img)
            })
            let fileName = uuidv4() + '.png';
            let awsType = {type: 'BUCKET_URL_POPUP', fileName: fileName}
            let result = await adminAwsApi.getPreSignedUrl(awsType, file[0]);
            if(result == 500){
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
                return;
            }
            setData({...data, image: file, imageUrl: fileName})
            setReady(false)
            data.image = file;
            data.imageUrl = fileName;

        } else {
            setData({...data, image: [], imageUrl: ''})
        }
    }

    const handleImgDialog = () => {
        setOpenImgDialog(!openImgDialog)
    }

    const saveEvent = async (): Promise<void> => {
        let saveData: any;
        if(!data.title) {
            toast.error('타이틀을 입력해주세요.');
            return;
        }
        if(!data.startDate || !data.expireDate) {
            toast.error('게시 기간을 정확히 입력해주세요.');
            return;
        }
        if(!data.imageUrl) {
            toast.error('팝업 광고 대표 이미지를 업로드해주세요.');
            return;
        }
        if(!data.brandId && !data.targetUrl){
            if(!window.confirm('상세페이지 경로를 입력하지 않으셨습니다. 계속 진행하시겠습니까?')){
                return;
            }
            saveData = {...data, popupType: 'NONE' };
        }else{
            saveData={...data}
        }

        if (window.confirm('저장하시겠습니까?')) {
           const result = await eventPopupApi.postEventPopup(saveData);
            if(result === 201){
                toast.success('저장이 완료되었습니다.')
                router.back();
            }

        }
    };

    const changeEvent = async () : Promise<void> => {
        let saveData: any;
        if(!data.title) {
            toast.error('타이틀을 입력해주세요.');
            return;
        }
        if(!data.startDate || !data.expireDate) {
            toast.error('게시 기간을 정확히 입력해주세요.');
            return;
        }
        if(!data.imageUrl) {
            toast.error('팝업 광고 대표 이미지를 업로드해주세요.');
            return;
        }
        if(!data.brandId && !data.targetUrl){
            if(!window.confirm('상세페이지 경로를 입력하지 않으셨습니다. 계속 진행하시겠습니까?')){
                return;
            }
            saveData = {...data, popupType: 'NONE' };
        }else{
            saveData={...data}
        }


        if (window.confirm('수정하시겠습니까?')) {
            const result = await eventPopupApi.patchEventPopup(saveData)
            if(result === 200){
                toast.success('수정 처리가 되었습니다.')
                onClose();
            }

        }

    }


    return (
        <>
            <Box>
                <Stack direction="row"
                       justifyContent='flex-end'
                       sx={{mt: 1, mb: 2}}>
                    <Button variant="outlined"
startIcon={<PreviewIcon />}
onClick={handleImgDialog}
sx={{mr: 2}}
disabled={ready}>
                        미리 보기
                    </Button>
                    {popupInfo?.id != null ?
                        <Button variant="contained"
startIcon={<SaveIcon />}
onClick={changeEvent}>
                            수정
                        </Button>
                        :   <Button variant="contained"
startIcon={<SaveIcon />}
onClick={saveEvent}>
                        저장
                    </Button>
                    }
                </Stack>
                <Card>
                    <CardContent>
                        <Stack component="main"
direction={'row'}
sx={{mt: 3, px: 6}}>
                            <Stack sx={{mr: 3}}>
                                <Box
                                    sx={{
                                        border: 1,
                                        borderRadius: 1,
                                        borderColor: "#e5e5e5",
                                        maxHeight: 400,
                                        height: 400,
                                        width: 400
                                    }}
                                >
                                    <EventAddImage data={data}
                                                   image={data?.image}
                                                   imageUrl={data?.imageUrl}
                                                   open={mainImgDialogOpen}
                                                   anchorEl={anchorMainImg}
                                                   handleClose={handleClose}
                                                   addImageHandler={addPopUpImageHandler}
                                                   setReady={setReady}
                                    />
                                </Box>
                                <Stack justifyContent={"center"}
alignItems={'center'}
                                       sx={{mt: 2, mb: 3, mr: 1, ml: 3}}>
                                    <Typography variant="subtitle2"
alignItems={'center'}>
                                        메인 팝업 이미지 규격 : 375pt x 467pt
                                    </Typography>
                                    <Button variant="outlined"
                                            startIcon={<AddBoxRoundedIcon/>}
                                            onClick={handleMainImgUploadClick}
                                            sx={{mt: 2, minWidth: 200}}
                                    >
                                        이미지 업로드
                                    </Button>
                                </Stack>
                            </Stack>
                            <Stack direction="column"
sx={{ mb: 2,}}>
                                <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
                                    <FormLabel component="legend">게시 기간 및 시간</FormLabel>
                                </Stack>
                                <Stack sx={{mt: 2, ml: 1 }}
direction="row">
                                    <Stack sx={{mb: 2.5}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={data?.startDate}
                                            inputFormat={"yyyy-MM-dd HH:mm"}
                                            mask={"____-__-__ __:__"}
                                            onChange={handleOnChange('startDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                size={'small'}
                                                                                sx={{height: 40, width: 200}}/>}
                                        />
                                    </LocalizationProvider>
                                    </Stack>
                                    <Stack sx={{mr: 2, ml: 2, mt:0.5}}>
                                        ~
                                    </Stack>
                                    <Stack sx={{mb: 2.5}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={data?.expireDate}
                                            inputFormat={"yyyy-MM-dd HH:mm"}
                                            mask={"____-__-__ __:__"}
                                            onChange={handleOnChange('expireDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                size={'small'}
                                                                                sx={{height: 40, width: 200}}/>}
                                        />
                                    </LocalizationProvider>
                                    </Stack>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mt: 2,mr: 1, ml: 1}}>
                                    <FormLabel component="legend">TITLE</FormLabel>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mt:2, mr: 1, ml: 1}}>
                                    <TextField
                                        id='title'
                                        defaultValue={data?.title || ''}
                                        onChange={(e) => setData({...data, title: e.target.value})}
                                    />
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mt: 4,mr: 1, ml: 1}}>
                                    <FormLabel component="legend">브랜드</FormLabel>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mt: 1.5, ml:1, height: 50, border: '1px solid #dfdfdf', borderRadius: 1, px: 1}}>
                                        <Input
                                            type='text'
                                            value={data?.brandName || ''}
                                            readOnly={true}
                                            disabled={true}
                                            disableUnderline={true}
                                            endAdornment={
                                                <InputAdornment position="end" >
                                                    <IconButton
                                                        sx={{p: 0}}
                                                        disabled={detailUrl?.length > 0}
                                                        onClick={handleClickClearBrand}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        sx={{p: 0}}
                                                        disabled={detailUrl?.length > 0}
                                                        onClick={handleClickBrandOpen}
                                                    >
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mt: 4, mr: 1, ml: 1}}>
                                    <FormLabel component="legend">상세페이지 경로</FormLabel>
                                </Stack>
                                <Stack
                                    direction='row'
                                    sx={{mt: 2, ml: 1}}
                                >
                                    <TextField
                                        sx={{
                                            display: 'flex',
                                            minWidth: 600
                                        }}
                                        disabled={disabled}
                                        id='shopUrl'
                                        defaultValue={detailUrl || ''}
                                        placeholder={'https://'}
                                        onChange={(e) => {
                                            setDetailUrl(e.target.value)
                                            setData({...data, targetUrl : e.target.value, popupType: 'NOTICE'})
                                        }}
                                    />
                                    <IconButton color="primary"
                                                component="span"
                                                sx={{ml: 1, p: 0.3, fontSize: 12}}
                                                disabled={disabled}
                                                onClick={() => window.open(data.targetUrl)}
                                    >
                                        <LaunchIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
            <BrandDialog
                open={brandOpen}
                onClose={handleBrandClose}
                items={dataContext.BRAND}
            />
            <ImagePreviewDialog open={openImgDialog}
                                onClose={handleImgDialog}
                                imagePreview={data?.image}
                                imageUrl={data.imageUrl}/>
        </>
    )
}

export default EventDetailCorrection;