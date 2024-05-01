import {
    Box,
    Button,
    Card,
    CardContent,
    FormLabel,
    IconButton,
    Input,
    InputAdornment,
    Menu,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import React, {useContext, useEffect, useState} from "react";
import {BrandDialog} from "../../dialog/brand-dialog";
import Dropzone from "../../style/dropzone";
import {X as XIcon} from "../../../icons/x";
import {DataContext} from "../../../contexts/data-context";
import {adminAwsApi} from "../../../api/aws-api";
import {toast} from "react-hot-toast";
import {v4 as uuidv4} from 'uuid';
import {NewPlanningModel} from "../../../types/home-app-model/new-planning-model";
import {brandApi} from "../../../api/brand-api";

const ImageUploadBox = (props) => {

    /**
     * fileItem FILE객체
     */
    const {header, addFileImage} = props;


    let [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(true)
    const [anchorEl, setAnchorEl] = useState(null);

    /**
     * FILE을 드래그 해서 놓으면 업로드 해서 FILE 객체 생성해서 useState 에 값 세팅.
     * @param newFiles
     */
    const handleDrop = (newFiles: any): void => {
        console.log('handleDrop  newFiles->',newFiles);
        newFiles.forEach((file) => {
            file.preview = URL.createObjectURL(file)
            file.key = `key${0}`;
        })
        setFiles([...newFiles]);
    };

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleVisible = () => {
        setVisible(!visible);
    };

    useEffect(() => {
        addFileImage(files);
        handleClose();
        if (!visible) {
            handleVisible();
        }
    }, [files]);

    return (
        <Box>
            <Box
                sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    ml: 3
                }}
            >
                <Typography>
                    {header}
                </Typography>
                <Button variant="outlined"
                        startIcon={<AddBoxRoundedIcon/>}
                        onClick={handleClick}
                        sx={{mt: 2, ml: 3, maxWidth: 200}}
                >
                    이미지 업로드
                </Button>
            </Box>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Box sx={{m: 2, p: 2}}>
                    <Dropzone
                        accept="image/*"
                        files={files}
                        onDrop={handleDrop}
                        maxFiles={1}
                    />
                </Box>
            </Menu>
        </Box>
    )
}

const NewPlanningDetail = (props) => {
    const {plan, setPlan} = props;
    const brandUrl = '/brand/';
    const dataContext = useContext(DataContext);
    const [brandOpen, setBrandOpen] = useState<Boolean>(false);
    const [lists, setLists] = useState<any>([]);

    const planDetail = plan;

    const getLists = async () => {
        const query = {
            page: 0,
            size: 1000,
        }
        const result = await brandApi.getBrandsList(query);
        setLists(result.lists)
    }

    useEffect(() =>{
        getLists();
    },[])

    const onDelete = () => {
        setPlan({...plan, imageUrl: ""});
    }

    const handleOnChange = (prop: keyof NewPlanningModel) => (value) => {
        if (props == 'startDate') {
            setPlan({ ...plan, startDate: value});
        }
        if (props == 'expireDate') {
            setPlan({ ...plan, expireDate: value});
        }else{
            setPlan({...plan, [prop]: value});
        }
    };

    const addImage = async (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
            setPlan({...plan, imageUrl: imageFiles[0].preview})
        }

        if(image !== null) {
            let fileName = uuidv4() + '.png';
            let type = "BUCKET_URL_EXHIBITION";
            let data = {fileName, type}
            await adminAwsApi.getPreSignedUrl(data, image).then(res => {
                console.log(res);
                setPlan({...plan, imageUrl: `${dataContext.BUCKET_URL_EXHIBITION}/${fileName}`});
            }).catch(err => {
                console.log(err);
                toast.error('메인 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
            });
        }
    };

    const handleClickBrandOpen = () => {
        setBrandOpen(true);
    };

    const handleBrandClose = (value) => {
        if (value) {
            setPlan({
                ...plan,
                targetUrl: `${brandUrl}${value.id}`
            });
        }
        setBrandOpen(false);
    };

    const handleClickClearBrand = () => {
        setPlan({
            ...plan,
            targetUrl: ''
        });
    };

    const renderBrand = (brandId) => {
        const idToNameMap = {};

        // 데이터 배열을 순회하면서 중복된 id를 처리
       [...lists].forEach((row) => {
                const { id, name } = row;
                // 이미 해당 id에 대한 name이 저장되어 있는 경우에만 처리
                if (idToNameMap[id]) {
                    // 중복된 id의 name이 현재 처리 중인 name과 다를 경우 '중복' 표시
                    if (idToNameMap[id] !== name) {
                        idToNameMap[id] = '중복';
                    }
                } else {
                    // 해당 id에 대한 name이 저장되어 있지 않은 경우 name을 저장
                    idToNameMap[id] = name;
                };
        });
        return (idToNameMap[brandId]) ? idToNameMap[brandId] : '';
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Stack component="main"
direction={'row'}
sx={{mt: 3, ml: 15, px: 6}}>
                        <Stack>
                            <Box
                                sx={{
                                    border: 1,
                                    borderRadius: 1,
                                    borderColor: "#e5e5e5",
                                    maxHeight: 400,
                                    height: 400,
                                    width: 400,
                                    ml: 3
                                }}
                            >
                                {plan.imageUrl ?
                                    <Box sx={{p: 1}}
                                         key={plan.key}
                                         style={{position: 'relative'}}>
                                        <img
                                            src={`${plan.imageUrl}`}
                                            style={{objectFit: 'contain', width: '100%', height: 375}}
                                            loading="lazy"
                                        />
                                        <div style={{position: 'absolute', right: 23, top: 10}}>
                                            <IconButton
                                                edge="end"
                                                onClick={() => onDelete()}
                                            >
                                                <XIcon fontSize="small"/>
                                            </IconButton>
                                        </div>
                                    </Box>
                                    :
                                    <></>
                                }
                            </Box>
                            <Stack justifyContent={"center"}
                                   sx={{mt: 2, mb: 3, mr: 1, ml: 12}}>
                                <Typography variant="subtitle2"
                                            sx={{ml: 1}}>
                                    메인 팝업 이미지 규격 : 375pt x 235pt
                                </Typography>
                                <ImageUploadBox
                                    addFileImage={addImage}/>
                            </Stack>
                        </Stack>
                        <Stack direction="column"
sx={{ml: 10}}>
                            <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
                                <FormLabel component="legend">게시 기간 및 시간</FormLabel>
                            </Stack>
                            <Stack sx={{mt: 2, ml: 1 }}
direction="row">
                                <Stack sx={{mb: 2.5}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={plan.startDate || ""}
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
                                            value={plan.expireDate || ""}
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
                                    value={plan.title || ''}
                                    onChange={(e) => setPlan({...plan, title: e.target.value})}
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
                                    value={renderBrand(planDetail?.targetUrl.split('/')[planDetail.targetUrl.split('/').length-1]) || ''}
                                    readOnly={true}
                                    disabled={true}
                                    disableUnderline={true}
                                    endAdornment={
                                        <InputAdornment position="end" >
                                            <IconButton
                                                sx={{p: 0}}
                                                onClick={handleClickClearBrand}
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                            <IconButton
                                                sx={{p: 0}}
                                                onClick={handleClickBrandOpen}
                                            >
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                    <BrandDialog
                        open={brandOpen}
                        onClose={handleBrandClose}
                        items={dataContext.BRAND}
                    />
                </CardContent>
            </Card>
        </>
    )
};

export default NewPlanningDetail;