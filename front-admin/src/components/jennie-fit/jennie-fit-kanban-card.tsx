import type {FC} from 'react';
import React, {MouseEvent, useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {
    Box,
    Button,
    Card,
    CardHeader,
    CardMedia,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    ListItem,
    ListItemText,
    Menu,
    Stack,
    Typography
} from '@mui/material';
import {JennieFitAssigmentUserDressModel, JennieFitAssignmentModel} from "../../types/jennie-fit-assignment-model";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import axios from "axios";
import {getDataContextValue, getDate} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../style/dropzone";
import {X as XIcon} from "../../icons/x";
import {jennieFitUserAssignmentApi} from "../../api/jennie-fit-user-assignment-api";
import {userDressApi} from "../../api/user-dress-api";
import {ImagePreviewWidget} from "../widgets/image-widget";
import {productApi} from "../../api/product-api";
import {jennieFitProductAssignmentApi} from "../../api/jennie-fit-product-assignment-api";
import axiosInstance from "../../plugins/axios-instance";
import ImageFileBoxProduct from "./image-file-box-product";
import {adminAwsApi} from "../../api/aws-api";
import Loading from "../jennie-fit/loading";
import {vTonImageFileNameConfig} from "../../config";

const ImageUploadBox = (props) => {

    /**
     * fileItem FILE객체
     */
    const {fileItem, header, addFileImage} = props;


    let [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(true)
    const [image, setImage] = useState<string>(null);
    const [anchorEl, setAnchorEl] = useState(null);

    /**
     * fileItem을 받은 후 HandelDrop 함수에 Promise객체를 넘긴다.
     */
    useEffect(() => {
        if (fileItem) {
            fileItem.then(res => {
                handleDrop([res])
            })
        }

    }, [])

    /**
     * FILE을 드래그 해서 놓으면 업로드 해서 FILE 객체 생성해서 useState 에 값 세팅.
     * @param newFiles
     */
    const handleDrop = (newFiles: any): void => {
        newFiles.forEach((file) => {
            file.preview = URL.createObjectURL(file)
            file.key = `key${0}`;
        })
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleVisible = () => {
        setVisible(!visible);
    };

    const handleImageClick = (item) => {
        setImage(item.preview);
    }

    const onDelete = (item) => {
        const newfile = [...files]
        newfile.splice(newfile.indexOf(item), 1)
        setFiles(newfile);
    }

    useEffect(() => {
        addFileImage(files);
        handleClose();
        if (!visible) {
            handleVisible();
        }
    }, [files]);

    return (
        <Box
            sx={{border: 1, borderRadius: 1}}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pr: 0.6,
                    pl: 2
                }}
            >
                <Typography>
                    {header}
                </Typography>
                <IconButton aria-label="add"
                            onClick={handleClick}>
                    <AddBoxRoundedIcon/>
                </IconButton>
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
            <Box>
                {files.map((item) => (
                    <Box sx={{p: 1}}
                         key={item.key}
                         style={{position: 'relative'}}>
                        <img
                            src={`${item.preview}`}
                            style={{objectFit: 'contain', width: '100%', height: 150}}
                            loading="lazy"
                            onClick={() => handleImageClick(item)}
                        />
                        <div style={{position: 'absolute', right: 15, top: 10}}>
                            <IconButton
                                edge="end"
                                onClick={() => onDelete(item)}
                            >
                                <XIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

const AiImageUploadBox = (props) => {

    /**
     * fileItem FILE객체
     */
    const {fileItem, header, addFileImage, setBtnDisabled} = props;


    let [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(true)
    const [image, setImage] = useState<string>(null);
    const [anchorEl, setAnchorEl] = useState(null);

    /**
     * fileItem을 받은 후 HandelDrop 함수에 Promise객체를 넘긴다.
     */
    useEffect(() => {
        if (fileItem) {
            fileItem.then(res => {
                handleDrop([res])
            })
        }

    }, [])

    /**
     * FILE을 드래그 해서 놓으면 업로드 해서 FILE 객체 생성해서 useState 에 값 세팅.
     * @param newFiles
     */
    const handleDrop = (newFiles: any): void => {
        newFiles.forEach((file) => {
            file.preview = URL.createObjectURL(file)
            file.key = `key${0}`;
        })
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setBtnDisabled(false)
    };

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleVisible = () => {
        setVisible(!visible);
    };

    const handleImageClick = (item) => {
        setImage(item.preview);
    }

    const onDelete = (item) => {
        const newfile = [...files]
        newfile.splice(newfile.indexOf(item), 1)
        setFiles(newfile);
        setBtnDisabled(true);
    }

    useEffect(() => {
        addFileImage(files);
        handleClose();
        if (!visible) {
            handleVisible();
        }
    }, [files]);

    return (
        <Box
            sx={{border: 1, borderRadius: 1}}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pr: 0.6,
                    pl: 2
                }}
            >
                <Typography>
                    {header}
                </Typography>
                <IconButton aria-label="add"
                            onClick={handleClick}>
                    <AddBoxRoundedIcon/>
                </IconButton>
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
            <Box>
                {files.map((item) => (
                    <Box sx={{p: 1}}
                         key={item.key}
                         style={{position: 'relative'}}>
                        <img
                            src={`${item.preview}`}
                            style={{objectFit: 'contain', width: '100%', height: 150}}
                            loading="lazy"
                            onClick={() => handleImageClick(item)}
                        />
                        <div style={{position: 'absolute', right: 15, top: 10}}>
                            <IconButton
                                edge="end"
                                onClick={() => onDelete(item)}
                            >
                                <XIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

const InspectionUserDialog = (props) => {
    const {onClose, open, item, readonly} = props;

    const [uploadImage, setUploadImage] = React.useState({
        maskImage: null,
        warpImage: null,
        warpMaskImage: null,
        mainImage: null,
        putOnImage: null,
    })

    const [imageProcessing, setImageProcessing] = React.useState({
        mainImageUrl: null,
        maskLayeredImageUrl: null,
        putOnImageUrl: null,
        putOnPreviewImageUrl: null,
    });

    const [progress, setProgress] = React.useState('none');

    const [disabled, setDisabled] = React.useState(true);

    const [assignmentUserDress, setAssigmentUserDress] = React.useState<JennieFitAssigmentUserDressModel>(null);

    const dataContext = useContext(DataContext);

    const handleClose = (refresh) => {
        onClose(refresh);
    };

    useEffect(() => {
        if (open) {
            (async () => {
                const result = await jennieFitUserAssignmentApi.getJennieFitAssignment(item.id);
                setAssigmentUserDress(result);
            })()
        }
    }, [open])

    useEffect(() => {
        let requestImageProcessing = false;
        if (item.maskless) {
            if (uploadImage.mainImage != null && uploadImage.putOnImage != null) {
                requestImageProcessing = true;
            }
        } else {
            if (uploadImage.maskImage != null && uploadImage.warpImage != null && uploadImage.warpMaskImage != null) {
                requestImageProcessing = true;
            }
        }
        if (requestImageProcessing) {
            (async () => {
                await handleImageProcessing();
            })()
        }
    }, [uploadImage])

    const addSegFileImage = (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
        }
        setUploadImage(prevData => ({
            ...prevData,
            mainImage: image
        }))
    };

    const addWarpFileImage = (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
        }
        setUploadImage(prevData => ({
            ...prevData,
            putOnImage: image
        }))
    };

    const addOriginalMaskFileImage = (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
            if (image.size > 1000000) {
                toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                return;
            }
        }

        setUploadImage(prevData => ({
            ...prevData,
            maskImage: image
        }))
    };

    const addWarpAllFileImage = (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
            if (image.size > 1000000) {
                toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                return;
            }
        }

        setUploadImage(prevData => ({
            ...prevData,
            warpImage: image
        }))
    };

    const addWarpMaskFileImage = (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
            if (image.size > 1000000) {
                toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                return;
            }
        }

        setUploadImage(prevData => ({
            ...prevData,
            warpMaskImage: image
        }))
    };

    const handleImageProcessing = async () => {
        setProgress('inline')
        const formData = new FormData();
        let response = null;
        if (item.maskless) {
            formData.append("mainImage", uploadImage.mainImage);
            formData.append("putOnImage", uploadImage.putOnImage);
            response = await userDressApi.imageProcessingSimple(item.userDressId, formData);
        } else {
            formData.append("maskImage", uploadImage.maskImage);
            formData.append("warpImage", uploadImage.warpImage);
            formData.append("warpMaskImage", uploadImage.warpMaskImage);
            response = await userDressApi.imageProcessing(item.userDressId, formData);
        }
        setProgress('none')
        if (response.status === 201) {
            setImageProcessing({...response.data});
            setDisabled(false);
            toast.success('이미지 프로세싱이 완료되었습니다.');
        } else {
            toast.error('이미지 프로세싱에 실패했습니다. 데이터를 확인해주세요.');
        }
    }

    const handleInspectionRequest = async () => {
        if (item.workerId === Number(localStorage.getItem('userId'))) {
            if (!window.confirm('검수 신청 하시겠습니까?')) {
                return;
            }
            const data = {
                ids: [item.id],
                userDressIds: [item.userDressId]
            };
            const status = await jennieFitUserAssignmentApi.patchWorkStatus(data, 'REQUESTED');
            if (status === 204) {
                toast.success('검수 신청 되었습니다.');
                handleClose(true);
            }
        } else {
            toast.error('작업자가 일치하지 않습니다.')
        }
    }

    const handleUnworkable = async () => {
        if (item.workerId === Number(localStorage.getItem('userId'))) {
            if (!window.confirm('작업 불가 처리 하시겠습니까?')) {
                return;
            }
            const data = {
                ids: [item.id],
                userDressIds: [item.userDressId]
            };
            const status = await jennieFitUserAssignmentApi.patchWorkStatus(data, 'UNWORKABLE');
            if (status === 204) {
                toast.success('작업 불가 처리 되었습니다.');
                handleClose(true);
            }
        } else {
            toast.error('작업자가 일치하지 않습니다.')
        }
    }

    const getCategoryPath = (categoryId) => {
        return getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId, 'path');
    }

    const renderMasklessTrue = () => {
        return (
            <div>
                <Grid container
                      spacing={1.5}
                      justifyContent={'start'}
                      sx={{p: 2}}>
                    <Grid item
                          xs={4}>
                        <Typography>SEG</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImageUploadBox
                                target={'Image'}
                                addFileImage={addSegFileImage}
                            /> :
                            <ImagePreviewWidget imageUrl={item.mainImageUrl}
                                                downloaded={false}/>
                        }
                    </Grid>
                    <Grid item
                          xs={4}>
                        <Typography>WARP IMAGE</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImageUploadBox
                                target={'Image'}
                                addFileImage={addWarpFileImage}
                            /> :
                            <ImagePreviewWidget imageUrl={item.putOnImageUrl}
                                                downloaded={false}/>
                        }
                    </Grid>
                    <Grid item
                          xs={4}>
                        <Typography>아바타 착장</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImagePreviewWidget imageUrl={imageProcessing.putOnPreviewImageUrl}
                                                imageName={'preview'}
                                                downloaded={true}
bgColor={'#ADA9A9'}/> :
                            <ImagePreviewWidget imageUrl={item.putOnPreviewImageUrl}
                                                imageName={'preview'}
                                                downloaded={true}
bgColor={'#ADA9A9'}/>
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }

    const renderMasklessFalse = () => {
        return (
            <div>
                <Grid container
                      spacing={1.5}
                      justifyContent={'start'}
                      sx={{p: 2}}>
                    <Grid item
                          xs={3}>
                        <Typography>SEG</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImagePreviewWidget imageUrl={imageProcessing.mainImageUrl}
                                                downloaded={false}/> :
                            <ImagePreviewWidget imageUrl={item.mainImageUrl}
                                                downloaded={false}/>
                        }
                    </Grid>
                    <Grid item
                          xs={3}>
                        <Typography>ORIGINAL + MASK</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImagePreviewWidget imageUrl={imageProcessing.maskLayeredImageUrl}
                                                downloaded={false}/> :
                            <ImagePreviewWidget imageUrl={item.maskLayeredImageUrl}
                                                downloaded={false}/>
                        }
                    </Grid>
                    <Grid item
                          xs={3}>
                        <Typography>ORIGINAL MASK IMAGE</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImageUploadBox
                                target={'Image'}
                                addFileImage={addOriginalMaskFileImage}
                            /> :
                            <ImagePreviewWidget imageUrl={item.maskImageUrl}
                                                downloaded={false}/>
                        }
                    </Grid>
                </Grid>
                <Grid container
                      spacing={1.5}
                      justifyContent={'start'}
                      sx={{p: 2}}>
                    <Grid item
                          xs={3}>
                        <Typography>WARP ALL</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImageUploadBox
                                target={'Image'}
                                addFileImage={addWarpAllFileImage}
                            /> :
                            <ImagePreviewWidget imageUrl={item.warpImageUrl}
                                                downloaded={false}/>
                        }
                    </Grid>
                    <Grid item
                          xs={3}>
                        <Typography>WARP IMAGE</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImagePreviewWidget imageUrl={imageProcessing.putOnImageUrl}
                                                downloaded={false}/> :
                            <ImagePreviewWidget imageUrl={item.putOnImageUrl}
                                                downloaded={false}/>
                        }
                    </Grid>
                    <Grid item
                          xs={3}>
                        <Typography>WARP MASK IMAGE</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImageUploadBox
                                target={'Image'}
                                addFileImage={addWarpMaskFileImage}
                            /> :
                            <ImagePreviewWidget imageUrl={item.warpMaskImageUrl}
                                                downloaded={false}/>
                        }
                    </Grid>
                    <Grid item
                          xs={3}>
                        <Typography>아바타 착장</Typography>
                        {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                            <ImagePreviewWidget imageUrl={imageProcessing.putOnPreviewImageUrl}
                                                imageName={'preview'}
                                                downloaded={true}
bgColor={'#ADA9A9'}/> :
                            <ImagePreviewWidget imageUrl={item.putOnPreviewImageUrl}
                                                imageName={'preview'}
                                                downloaded={true}
bgColor={'#ADA9A9'}/>
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }

    const getTimeline = () => {
        return (assignmentUserDress != null) ? assignmentUserDress.statusHistories.map(history => {
            const text = `${getDate(history.createdDate)}. ${dataContext.ASSIGN_STATUS[history.beforeStatus]} → ${dataContext.ASSIGN_STATUS[history.afterStatus]}`;

            return (
                <ListItem key={history.id}
                          sx={{m: 0, p: 0}}
                          component={'div'}>
                    <ListItemText primary={text}
                                  secondary={history.changeMessage}/>
                </ListItem>
            )
        }) : <></>;
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 900}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
        >
            <DialogTitle>
                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Box>
                            <Button variant="contained"
                                    size="small"
                                    color="error"
                                    onClick={handleUnworkable}>
                                작업 불가
                            </Button>
                        </Box>
                        <Box>
                            <Button variant="contained"
                                    size="small"
                                    color="success"
                                    disabled={disabled}
                                    onClick={handleInspectionRequest}>
                                검수 신청
                            </Button>
                        </Box>
                    </Box> : <Typography>{item.id}</Typography>
                }
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{display: progress}}>
                    <CircularProgress sx={{position: 'absolute', top: '50%', left: '46%'}}/>
                </Box>
                <Box>
                    <Grid container
                          spacing={1.5}
                          justifyContent={'start'}
                          sx={{p: 2}}>
                        <Grid item
                              xs={4}>
                            <ImagePreviewWidget imageName={item.id}
                                                imageUrl={item.originalImageUrl}
                                                downloaded={true}/>
                        </Grid>
                        <Grid item
                              xs={8}>
                            <PropertyList>
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="작업유형"
                                    value={dataContext.ASSIGN_PRIORITY[item.priorityType]}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="작업상태"
                                    value={dataContext.ASSIGN_STATUS[item.status]}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="ID"
                                    value={String(item.userDressId)}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="제니핏 카테고리"
                                    value={item.categoryConcat}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="카테고리"
                                    value={getDataContextValue(dataContext, 'CATEGORY_MAP', item.categoryId, 'name')}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="옷정보"
                                >
                                    {assignmentUserDress ? (
                                        <>
                                            <Typography
                                                variant={'body1'}>실루엣: {assignmentUserDress.userDress.silhouetteType}</Typography>
                                            <Typography
                                                variant={'body1'}>소매기장: {assignmentUserDress.userDress.sleeveType}</Typography>
                                            <Typography
                                                variant={'body1'}>총기장: {assignmentUserDress.userDress.lengthType}</Typography>
                                        </>
                                    ) : <></>}
                                </PropertyListItem>
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="변경이력"
                                >
                                    {getTimeline()}
                                </PropertyListItem>
                            </PropertyList>
                        </Grid>
                    </Grid>
                    {
                        item.maskless ? renderMasklessTrue() : renderMasklessFalse()
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    handleClose(false)

                }}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const InspectionAiUserDialog = (props) => {
    const {onClose, open, item, readonly} = props;
    const [imageProcessing, setImageProcessing] = React.useState({
        mainImageUrl: null,
        maskLayeredImageUrl: null,
        putOnImageUrl: null,
        putOnPreviewImageUrl: null,
        maskImageUrl: null,
    });

    const [progress, setProgress] = React.useState('none');
    const [disabled, setDisabled] = React.useState(true);
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [loading, setLoading] = useState(true);
    const [assignmentUserDress, setAssigmentUserDress] = React.useState<JennieFitAssigmentUserDressModel>(null);

    const dataContext = useContext(DataContext);

    const handleClose = (refresh) => {
        onClose(refresh);
        setImageProcessing({
            mainImageUrl: null,
            maskImageUrl: null,
            maskLayeredImageUrl: null,
            putOnImageUrl: null,
            putOnPreviewImageUrl: null,
        })
    };

    useEffect(() => {
        if (open) {
            (async () => {
                const result = await jennieFitUserAssignmentApi.getJennieFitAssignment(item.id);
                setAssigmentUserDress(result);
            })()
        }
    }, [open])

    const addOriginalMaskFileImage = async (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
            if (image.size > 1000000) {
                toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                return;
            }
        }

        if(image !== null) {
            let url = vTonImageFileNameConfig.userDressFile
            const originalName = item.originalImageUrl.split(`${url}`)[item.originalImageUrl.split(`${url}`).length-1].split('.')[0];
            setProgress('inline')
            let response = null;
            let fileName = `${originalName}` + '.png';
            let typeFit = "BUCKET_URL_USER_MASK";
            setProgress('none')
            response = await adminAwsApi.getUserPreSignedUrl(fileName, typeFit, image);
            if (response !== 200) {
                toast.error('피팅 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
            }
            const userBucketUrl = dataContext.BUCKET_URL_USER_MASK;
            const bucketUrl = `${userBucketUrl}/${fileName}`;
            setImageProcessing({...imageProcessing, maskImageUrl: bucketUrl})
        }
    };


    const postSegRequest = async () => {
        setLoading(false)
        const data = {
            maskImageUrl: imageProcessing.maskImageUrl,
            originalImageUrl: item.originalImageUrl
        }
        await jennieFitProductAssignmentApi.postSeg(data).then(res => {
            if (res.status == 200) {
                setImageProcessing( prev => {
                    return { ...prev,   mainImageUrl: res.data.mainImageUrl,
                        maskLayeredImageUrl: res.data.maskLayeredImageUrl}
                })
            }
            setLoading(true)
        })

    }

    const getImagesUrl = async () => {
        setLoading(false)
        const category = item.categoryConcat.split('_')[1] != 'T-SHIRT' ? item.categoryConcat : item.categoryConcat.replace('T-SHIRT', 'TSHIRT');
        const data = {
            jennifitCagegory: category,
            originalImage: item.originalImageUrl,
            originalMaskImageUrl: imageProcessing.maskImageUrl,
        }
        await jennieFitProductAssignmentApi.postVton(data).then(res => {
            if (res.status  == 200) {
                setImageProcessing( prev => {
                    return { ...prev,  putOnImageUrl: res.data.warpImageUrl, putOnPreviewImageUrl: res.data.avatarFittingImageUrl}
                })
            }
            setLoading(true);
            setDisabled(false);
        }).catch(err => {
            console.log(err);
            setLoading(true);
            setDisabled(true);
        });


    }

    const handleOnClickImage = async () => {
        await postSegRequest();
        await getImagesUrl();
    }

    const handleInspectionRequest = async () => {
        if(item.workerId === Number(localStorage.getItem('userId'))) {
            if (!window.confirm('검수 신청 하시겠습니까?')) {
                return;
            }
            const data = {
                ids: [item.id],
                userDressIds: [item.userDressId]
            };
            const aiData = {
                id: item.userDressId,
                mainImageUrl: imageProcessing.mainImageUrl,
                maskLayeredImageUrl: imageProcessing.maskLayeredImageUrl,
                putOnImageUrl: imageProcessing.putOnImageUrl,
                putOnPreviewImageUrl: imageProcessing.putOnPreviewImageUrl
            }
            const result = await jennieFitUserAssignmentApi.patchUserDresses(aiData.id, aiData);
            if (result === 200) {
                const status = await jennieFitUserAssignmentApi.patchWorkStatus(data, 'REQUESTED');
                if (status === 204) {
                    toast.success('검수 신청 되었습니다.');
                    handleClose(true);
                } else {
                    toast.success('검수 신청에 실패했습니다.');
                }
            } else {
                toast.error("이미지 저장에 실패했습니다.")
            }
        } else {
            toast.error('작업자가 일치하지 않습니다.')
        }
    }

    const handleUnworkable = async () => {
        if (item.workerId === Number(localStorage.getItem('userId'))) {
            if (!window.confirm('작업 불가 처리 하시겠습니까?')) {
                return;
            }
            const data = {
                ids: [item.id],
                userDressIds: [item.userDressId]
            };
            const status = await jennieFitUserAssignmentApi.patchWorkStatus(data, 'UNWORKABLE');
            if (status === 204) {
                toast.success('작업 불가 처리 되었습니다.');
                handleClose(true);
            }
        } else {
            toast.error('작업자가 일치하지 않습니다.')
        }
    }

    const getTimeline = () => {
        return (assignmentUserDress != null) ? assignmentUserDress.statusHistories.map(history => {
            const text = `${getDate(history.createdDate)}. ${dataContext.ASSIGN_STATUS[history.beforeStatus]} → ${dataContext.ASSIGN_STATUS[history.afterStatus]}`;

            return (
                <ListItem key={history.id}
                          sx={{m: 0, p: 0}}
                          component={'div'}>
                    <ListItemText primary={text}
                                  secondary={history.changeMessage}/>
                </ListItem>
            )
        }) : <></>;
    }

   const handleDown = (value) => {
        const imgUrl = value;
        if (imgUrl !== null) {
            axios({
                url: decodeURIComponent(imgUrl),
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${item.id}${imgUrl.substr(imgUrl.lastIndexOf('.'))}`)
                document.body.appendChild(link)
                link.click()
            })
        }else{
            window.confirm('다운로드할 이미지가 없습니다');
        }
    };


    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 900}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
        >
            <DialogTitle>
                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <Box>
                            <Button variant="contained"
                                    size="small"
                                    color="error"
                                    onClick={handleUnworkable}>
                                작업 불가
                            </Button>
                        </Box>
                        <Box>
                            <Button variant="contained"
                                    size="small"
                                    color="success"
                                    disabled={disabled}
                                    onClick={handleInspectionRequest}>
                                검수 신청
                            </Button>
                        </Box>
                    </Box> : <Typography>{item.id}</Typography>
                }
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{display: progress}}>
                    <CircularProgress sx={{position: 'absolute', top: '50%', left: '46%'}}/>
                </Box>
                <Box>
                    <Grid container
                          spacing={1.5}
                          justifyContent={'start'}
                          sx={{p: 2}}>
                        <Grid item
                              xs={4}>
                            <ImagePreviewWidget imageName={item.id}
                                                imageUrl={item.originalImageUrl}
                                                downloaded={true}/>
                        </Grid>
                        <Grid item
                              xs={8}>
                            <PropertyList>
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="작업유형"
                                    value={dataContext.ASSIGN_PRIORITY[item.priorityType]}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="작업상태"
                                    value={dataContext.ASSIGN_STATUS[item.status]}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="ID"
                                    value={String(item.userDressId)}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="제니핏 카테고리"
                                    value={item.categoryConcat}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="카테고리"
                                    value={getDataContextValue(dataContext, 'CATEGORY_MAP', item.categoryId, 'name')}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="옷정보"
                                >
                                    {assignmentUserDress ? (
                                        <>
                                            <Typography
                                                variant={'body1'}>실루엣: {assignmentUserDress.userDress.silhouetteType}</Typography>
                                            <Typography
                                                variant={'body1'}>소매기장: {assignmentUserDress.userDress.sleeveType}</Typography>
                                            <Typography
                                                variant={'body1'}>총기장: {assignmentUserDress.userDress.lengthType}</Typography>
                                        </>
                                    ) : <></>}
                                </PropertyListItem>
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="변경이력"
                                >
                                    {getTimeline()}
                                </PropertyListItem>
                            </PropertyList>
                        </Grid>
                    </Grid>
                    <div>
                        {!loading ? <Loading/> : <></>}
                        <Grid container
                              spacing={1.5}
                              justifyContent={'start'}
                              sx={{p: 2}}>
                            <Grid item
                                  xs={3}>
                                <Typography>SEG</Typography>
                                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                                    <ImagePreviewWidget imageUrl={imageProcessing.mainImageUrl}
                                                        downloaded={false}/> :
                                    <ImagePreviewWidget imageUrl={item.mainImageUrl}
                                                        downloaded={false}/>
                                }
                            </Grid>
                            <Grid item
                                  xs={3}>
                                <Typography>ORIGINAL + MASK</Typography>
                                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                                    <ImagePreviewWidget imageUrl={imageProcessing.maskLayeredImageUrl}
                                                        downloaded={false}/> :
                                    <ImagePreviewWidget imageUrl={item.maskLayeredImageUrl}
                                                        downloaded={false}/>
                                }
                            </Grid>
                            <Grid item
                                  xs={3}>
                                <Typography>ORIGINAL MASK IMAGE</Typography>
                                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                                    <Stack direction='row'>
                                        <AiImageUploadBox
                                            target={'Image'}
                                            addFileImage={addOriginalMaskFileImage}
                                            setBtnDisabled={setBtnDisabled}
                                        />
                                        <Button variant={'outlined'}
                                                sx={{ml: 2, height: 50, width: 150}}
                                                disabled={btnDisabled}
                                                onClick={handleOnClickImage}>이미지 추출</Button>
                                    </Stack>
                                    :
                                    <Stack sx={{position:'relative'}}>
                                        <IconButton aria-label="download"
                                                    style={{color: 'white', position: 'absolute', right: 0, top: 0, zIndex: 5}}
                                                    onClick={() => handleDown(item.maskImageUrl)}>
                                            <DownloadForOfflineIcon fontSize={'medium'}/>
                                        </IconButton>
                                        <ImagePreviewWidget imageUrl={item.maskImageUrl}
                                                            downloaded={false}/>
                                    </Stack>

                                }
                            </Grid>
                        </Grid>
                        <Grid container
                              spacing={1.5}
                              justifyContent={'start'}
                              sx={{p: 2}}>
                            <Grid item
                                  xs={3}>
                                <Typography>WARP IMAGE</Typography>
                                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                                    <ImagePreviewWidget imageUrl={imageProcessing.putOnImageUrl}
                                                        downloaded={false}/> :
                                    <Stack sx={{position:'relative'}}>
                                        <IconButton aria-label="download"
                                                    style={{color: 'black', position: 'absolute', right: 0, top: 0, zIndex: 5}}
                                                    onClick={() => handleDown(item.putOnImageUrl)}>
                                            <DownloadForOfflineIcon fontSize={'medium'}/>
                                        </IconButton>
                                    <ImagePreviewWidget imageUrl={item.putOnImageUrl}
                                                        downloaded={false}/>
                                    </Stack>
                                }
                            </Grid>
                            <Grid item
                                  xs={3}>
                                <Typography>아바타 착장</Typography>
                                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                                    <ImagePreviewWidget imageUrl={imageProcessing.putOnPreviewImageUrl}
                                                        downloaded={true}/> :
                                    <ImagePreviewWidget imageUrl={item.putOnPreviewImageUrl}
                                                        downloaded={true}/>
                                }
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    handleClose(false)
                    setLoading(true)
                }}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const InspectionProductDialog = (props) => {
    const {onClose, open, item, readonly} = props;

    const dataContext = useContext(DataContext);


    const [uploadImageList, setUploadImageList] = useState<any[]>([]);
    //none ai
    const [uploadImage, setUploadImage] = useState({
        mainImage: null,
        putOnImage: null,
    })

    //ai
    const [imageProcessing, setImageProcessing] = useState({
        mainImageUrl: null,
        putOnImageUrl: null,
        putOnPreviewImageUrl: null,
        maskLayeredImageUrl: null,
        originalMaskImageUrl:null
    });

    const [progress, setProgress] = React.useState('none');
    const [disabled, setDisabled] = React.useState(true);
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [loading, setLoading] = useState(true);
    const [downUrl, setDownUrl] = useState('');

    const handleClose = (refresh) => {
        onClose(refresh);
        // 이미지 업로드후 검수신청 누르지 않고 닫기 눌렀을 때 reset
        setImageProcessing({
            mainImageUrl: null,
            putOnImageUrl: null,
            putOnPreviewImageUrl: null,
            maskLayeredImageUrl: null,
            originalMaskImageUrl: null
        })
        setLoading(true)
    };

    useEffect(() => {
        let requestImageProcessing = false;
        if (uploadImage.mainImage != null && uploadImage.putOnImage != null) {
            requestImageProcessing = true;
        }

        if (requestImageProcessing) {
            (async () => {
                await handleImageProcessing();
            })()
        }
    }, [uploadImage])


    /**
     * s3 image url 을 파일 객체로 변환
     * @param url
     */
    const convertURLtoFile = async (url: string) => {
        const response = await fetch(url);
        const data = await response.blob();
        const ext = url.split(".").pop(); // url 구조에 맞게 수정할 것
        const filename = url.split("/").pop(); // url 구조에 맞게 수정할 것
        const metadata = {type: `image/${ext}`};
        return new File([data], filename!, metadata);
    };


    const addMainImage = (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
            if (image.size > 1000000) {
                toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                return;
            }
        }


        setUploadImage(prevData => ({
            ...prevData,
            mainImage: image
        }))
    };

    //기존 등록 - 피팅사진
    const addPutOnImage = (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
            if (image.size > 1000000) {
                toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                return;
            }
        }
        setUploadImage(prevData => ({
            ...prevData,
            putOnImage: image
        }))
    };

    //이미지 리스트 수정작업시 더하기(preview)
    const setImageUrlList = async (imageUrlList) => {
        if (imageUrlList.length < 1) {
            return;
        }
        item.imageUrlList = imageUrlList;

        const data = {
            id: item.productId,
            imageUrlList: imageUrlList
        };

        const status = await productApi.patchProduct(item.productId, data);
        if (status !== 200) {
            toast.error('이미지 저장에 실패 하였습니다.');
        }
    };

    const handleImageProcessing = async () => {
        setProgress('inline')
        const formData = new FormData();
        let response = null;
        formData.append("mainImage", uploadImage.mainImage);
        formData.append("putOnImage", uploadImage.putOnImage);
        response = await productApi.imageProcessing(item.productId, formData);
        setProgress('none')
        if (response.status === 200) {
            setImageProcessing({...response.data});
            setDisabled(false);
            toast.success('이미지 프로세싱이 완료되었습니다.');
        } else {
            toast.error('이미지 프로세싱에 실패했습니다. 데이터를 확인해주세요.');
        }
    }


    //검수신청버튼
    const handleInspectionRequest = async () => {
        if (item.workerId === Number(localStorage.getItem('userId'))) {
            if (!window.confirm('검수 신청 하시겠습니까?')) {
                return;
            }

            if (loading) {
                let imgData = {
                    id: item.productId,
                    mainImageUrl: imageProcessing.mainImageUrl,
                    originalMaskImageUrl: imageProcessing.originalMaskImageUrl,
                    maskLayeredImageUrl: imageProcessing.maskLayeredImageUrl,
                    putOnImageUrl: imageProcessing.putOnImageUrl,
                    putOnPreviewImageUrl: imageProcessing.putOnPreviewImageUrl
                }
                const response = await productApi.patchProduct(item.productId, imgData);
                if (response == 200) {
                    setLoading(true)
                }
            }

            if (handleUpdateImageListOrder) {
                const data = {
                    ids: [item.id]
                };
                const status = await jennieFitProductAssignmentApi.postWorkStatus(data, 'REQUESTED');
                if (status === 200) {
                    toast.success('검수 신청 되었습니다.');
                } else {
                    toast.error('검수 신청에 실패 하였습니다.');
                }
            } else {
                toast.error('이미지 리스트 수정에 실패 하였습니다.');
            }
            handleClose(true);
        } else {
            toast.error('작업자가 일치하지 않습니다.')
        }
    }

    //검수버튼 작동 이후 사진 저장하기
    const handleUpdateImageListOrder = async () => {
        //이미지샵리스트
        const data = {
            imageUrlList: item.imageUrlList
        };
        const status = await productApi.patchProduct(item.productId, data);
        if (status === 200) {
            return true;
        }
        return false;
    }

    const addOriginalMaskFileImage = async (imageFiles) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
            if (image.size > 1000000) {
                toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                return;
            }
            let imgUrl = vTonImageFileNameConfig.productFile
            const fitGhostName = item.ghostImageUrl?.split(`${imgUrl}`)[item.ghostImageUrl.split(`${imgUrl}`).length-1].split('.')[0];
            let fileName = `${fitGhostName}` + '.png';
            const awsType = { type: 'BUCKET_URL_PRODUCT_MASK', fileName: fileName}
            let result = await adminAwsApi.getPreSignedUrl(awsType, image)
            const bucketUrl = dataContext.BUCKET_URL_PRODUCT_MASK;
            let imageBucketUrl = `${bucketUrl}/${fileName}`;
            setImageProcessing({...imageProcessing, originalMaskImageUrl: imageBucketUrl })
        }

    }

    const postSegRequest = async () => {
        setLoading(false)
        const data = {
            maskImageUrl: imageProcessing.originalMaskImageUrl,
            originalImageUrl: item.ghostImageUrl
        }
        await jennieFitProductAssignmentApi.postSeg(data).then(res => {
            if (res.status == 200) {
                setImageProcessing( prev => {
                    return { ...prev,   mainImageUrl: res.data.mainImageUrl,
                        maskLayeredImageUrl: res.data.maskLayeredImageUrl}
                })
                setLoading(true)
            }else{
                setLoading(true)
            }

        })

    }

    const getImagesUrl = async () => {
        setLoading(false)
        const data = {
            jennifitCagegory: item.jenniefitCategory,
            originalImage: item.ghostImageUrl,
            originalMaskImageUrl: imageProcessing.originalMaskImageUrl,
        }
        await jennieFitProductAssignmentApi.postVton(data).then(res => {
            if (res.status  == 200) {
                setImageProcessing( prev => {
                    return { ...prev,  putOnImageUrl: res.data.warpImageUrl, putOnPreviewImageUrl: res.data.avatarFittingImageUrl}
                })
            }
            setLoading(true);
            setDisabled(false);
        }).catch(err => {
            console.log(err);
            setLoading(true);
            setDisabled(true);
        });

    }


    const handleImgOnClick = async() => {
        await postSegRequest();
        await getImagesUrl();
        if(loading){
            setDisabled(false);
        }
    }

    const handleUnworkable = async () => {
        if (item.workerId === Number(localStorage.getItem('userId'))) {
            if (!window.confirm('작업 불가 처리 하시겠습니까?')) {
                return;
            }
            const data = {
                ids: [item.id]
            };
            const status = await jennieFitProductAssignmentApi.postWorkStatus(data, 'UNWORKABLE');
            if (status === 200) {
                toast.success('작업 불가 처리 되었습니다.');
                handleClose(true);
            }
        } else {
            toast.error('작업자가 일치하지 않습니다.')
        }
    }

    const handleUploadImageList = async () => {
        const data = {
            imageList: uploadImageList
        };
        const status = await jennieFitProductAssignmentApi.postWorkStatus(data, 'UNWORKABLE');
        if (status === 200) {
            toast.success('작업 불가 처리 되었습니다.');
            handleClose(true);
        }
    }

    const getTimeline = () => {
        return (item.statusHistories) ? item.statusHistories.map(history => {
            const text = `${getDate(history.createdDate)}. ${dataContext.ASSIGN_STATUS[history.beforeStatus]} → ${dataContext.ASSIGN_STATUS[history.afterStatus]}`;

            return (
                <ListItem key={history.id}
                          sx={{m: 0, p: 0}}
                          component={'div'}>
                    <ListItemText primary={text}
                                  secondary={history.changeMessage}/>
                </ListItem>
            )
        }) : <></>;
    }

    const renderCategory = () => {
        if (item.categoryIds && item.categoryIds.length > 0) {
            return getDataContextValue(dataContext, 'CATEGORY_MAP', item.categoryIds[item.categoryIds.length - 1], 'path')
        }
        return '';
    }


    const handleDownload = (value) => {
        const img = value;
        if (img !== null) {
            axios({
                url: decodeURIComponent(img),
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${item.id}${img.substr(img.lastIndexOf('.'))}`)
                document.body.appendChild(link)
                link.click()
            })
        }else{
            window.confirm('다운로드 할 이미지가 없습니다');
        }
    };


    const renderMaskImage = (value) => {
        return <ImagePreviewWidget imageUrl={value}
                                          downloaded={false}/>
    }

    const renderDownloadMaskImage = (value) => {
        return value.isAi ?
            <>
                <Stack sx={{display: 'flex', alignItems: 'end',}}>
                    <IconButton aria-label="download" style={{color: 'black'}} onClick={() => handleDownload(value.putOnImageUrl)}>
                        <DownloadForOfflineIcon fontSize={'medium'}/>
                    </IconButton>
                    <ImagePreviewWidget imageUrl={value.putOnImageUrl}
                                        downloaded={false}/>
                </Stack>
            </> :
            <>
                <ImagePreviewWidget imageUrl={value?.putOnImageUrl} downloaded={false}/>
            </>
    }


    //샾 이미지 리스트(preview)
    const addFileImageHandler = (imageFiles) => {
        imageFiles.forEach((file, index) => {
            if (file.size > 1000000) {
                toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                return;
            }
            if (file.listOrder > 0) {
                return;
            }

            file.key = `key${index}`;
            uploadImageList.push(file);
        })

        if (uploadImageList.length < 1) {
            return;
        }

        setUploadImageList(uploadImageList);

        let formData = new FormData();
        uploadImageList.forEach((file: any) => {
            formData.append('imageList', file)
        })

        return axiosInstance.post(`/services/product/api/products/${item.productId}/image-list`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then(res => {
            item.imageUrlList = res.data.imageUrlList;
            setUploadImageList([]);
            toast.success('업로드 되었습니다.');
        }).catch(err => {
            console.log(err);
            toast.error('수정에 실패했습니다.');
        });

    };


    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 900}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
        >
            <DialogTitle>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Box>
                        <Button variant="contained"
                                size="small"
                                color="error"
                                onClick={handleUnworkable}>
                            작업 불가
                        </Button>
                    </Box>
                    <Box>
                        <Button variant="contained"
                                size="small"
                                color="success"
                                disabled={disabled}
                                onClick={handleInspectionRequest}>
                            검수 신청
                        </Button>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{display: progress}}>
                    <CircularProgress sx={{position: 'absolute', top: '50%', left: '46%'}}/>
                </Box>
                <Grid>
                    <Grid container
                          spacing={1.5}
                          justifyContent={'start'}
                          sx={{p: 2}}>
                        <Grid item
                              xs={3}>
                            <Typography>고스트 이미지</Typography>
                            <ImagePreviewWidget imageUrl={item.ghostImageUrl}
                                                downloaded={true}/>
                        </Grid>
                        <Grid item
                              xs={2}>
                            <Typography>피팅 참고 이미지</Typography>
                            <ImagePreviewWidget imageUrl={item.fitRefImageUrl}
                                                downloaded={true}/>
                        </Grid>
                        <Grid item
                              xs={7}>
                            <PropertyList>
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="작업유형"
                                    value={dataContext.ASSIGN_PRIORITY[item.priorityType]}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="작업상태"
                                    value={dataContext.ASSIGN_STATUS[item.status]}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="생성타입"
                                    value={dataContext.REGISTRATION_TYPE[item.registrationType]}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="ID"
                                    value={item.productId}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="제니핏 카테고리"
                                    value={item.jenniefitCategory}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="카테고리"
                                    value={renderCategory()}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="브랜드"
                                    value={item.brandName}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="상품명"
                                    value={item.productName}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="URL"
                                    value={item.detailSiteUrl}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="변경이력"
                                >
                                    {getTimeline()}
                                </PropertyListItem>
                            </PropertyList>
                        </Grid>
                    </Grid>
                    {item.status === 'ASSIGNED' || item.status === 'REJECTED' ?
                        <Grid>
                            <PropertyListItem
                                label="Shop 이미지 리스트"
                            >
                                <ImageFileBoxProduct
                                    target={'Image'}
                                    data={item}
                                    addFileImage={addFileImageHandler}
                                    imageUrlList={item.imageUrlList}
                                    imageList={item.imageList}
                                    setImageUrlList={setImageUrlList}
                                />
                            </PropertyListItem>
                        </Grid>
                        : <></>
                    }
                    <Grid container
                          spacing={1.5}
                          justifyContent={'start'}
                          sx={{p: 2, ml: 0 }}>
                        {item.isAi ?
                            <>
                                {!loading ? <Loading /> : <></>}
                                <InspectionProductAiImage
                                    item={item}
                                    readonly={readonly}
                                    renderMaskImage={renderMaskImage}
                                    addOriginalMaskFileImage={addOriginalMaskFileImage}
                                    imageProcessing={imageProcessing}
                                    btnDisabled={btnDisabled}
                                    setBtnDisabled={setBtnDisabled}
                                    getImagesUrl={handleImgOnClick}
                                    handleDownload={handleDownload}
                                /></> :
                            <InspectionProductImage
                                item={item}
                                addMainImage={addMainImage}
                                addPutOnImage={addPutOnImage}
                            />}
                        {!loading ? <Loading /> : <></>}
                        <Grid container
                              spacing={1.5}
                              justifyContent={'start'}
                              sx={{p: 2}}>
                            <Grid item
                                  xs={3}>
                                <Typography>WARP IMAGE</Typography>
                                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                                    renderMaskImage(imageProcessing.putOnImageUrl) : renderDownloadMaskImage(item)
                                }
                            </Grid>
                            <Grid item
                                  xs={4}>
                                <Typography>아바타 착장</Typography>
                                {item.status === 'ASSIGNED' || item.status === 'REJECTED' ?
                                    <ImagePreviewWidget imageUrl={imageProcessing.putOnPreviewImageUrl}
                                                        downloaded={true}/> :
                                    <ImagePreviewWidget imageUrl={item.putOnPreviewImageUrl}
                                                        downloaded={true}/>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const InspectionProductAiImage = (props) => {
    const {renderMaskImage, item, addOriginalMaskFileImage, imageProcessing, btnDisabled, setBtnDisabled, getImagesUrl, handleDownload} = props;

    return (
        <>
            <Grid item
                  xs={3}>
                <Typography>SEG</Typography>
                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                    renderMaskImage(imageProcessing.mainImageUrl) : renderMaskImage(item.mainImageUrl)
                }
            </Grid>
            <Grid item
                  xs={3}>
                <Typography>ORIGINAL + MASK</Typography>
                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                    renderMaskImage(imageProcessing.maskLayeredImageUrl) : renderMaskImage(item.maskLayeredImageUrl)
                }
            </Grid>
            <Grid item
                  xs={3}>
                <Typography>ORIGINAL MASK IMAGE</Typography>
                {(item.status === 'ASSIGNED' || item.status === 'REJECTED') ?
                    <Stack direction='row'>
                        <AiImageUploadBox
                            target={'Image'}
                            addFileImage={addOriginalMaskFileImage}
                            setBtnDisabled={setBtnDisabled}/>
                        <Button variant={'outlined'}
                                sx={{ml: 2, height: 50, width: 150}}
                                disabled={btnDisabled}
                                onClick={getImagesUrl}>이미지 추출</Button>
                    </Stack> :
                    <Stack sx={{position:'relative'}}>
                        <IconButton aria-label="download"
                                    style={{color: 'white', position: 'absolute', right: 0, top: 0, zIndex: 5}}
                                    onClick={() => handleDownload(item.originalMaskImageUrl)}>
                            <DownloadForOfflineIcon fontSize={'medium'}/>
                        </IconButton>
                        <ImagePreviewWidget imageUrl={item.originalMaskImageUrl}
                                            downloaded={false}/>
                    </Stack>
                }
            </Grid>
        </>
    )
}

const InspectionProductImage = (props) => {
    const {item, addMainImage, addPutOnImage} = props;
    return (
        <>
            <Grid item
                  xs={4}>
                <Box>
                    <Typography>메인 이미지</Typography>
                    {item.status === 'ASSIGNED' || item.status === 'REJECTED' ?
                        <ImageUploadBox
                            target={'Image'}
                            addFileImage={addMainImage}
                        /> :
                        <ImagePreviewWidget imageUrl={item.mainImageUrl}
                                            downloaded={false}/>
                    }
                </Box>
            </Grid>
            <Grid item
                  xs={4}>
                <Typography>피팅 이미지</Typography>
                {item.status === 'ASSIGNED' || item.status === 'REJECTED' ?
                    <ImageUploadBox
                        target={'Image'}
                        addFileImage={addPutOnImage}
                    /> :
                    <ImagePreviewWidget imageUrl={item.putOnImageUrl}
                                        downloaded={false}/>
                }
            </Grid>
        </>
    )
}

interface CardProps {
    target: string;
    item: JennieFitAssignmentModel;
    refreshList: () => void;
    readonly: boolean;
}

export const JennieFitKanbanCard: FC<CardProps> = ({item, readonly, refreshList, target}) => {

    const [openInspectionProduct, setOpenInspectionProduct] = React.useState(false);
    const [openInspectionUser, setOpenInspectionUser] = React.useState(false);
    const [openInspectionAiUser, setOpenInspectionAiUser] = React.useState(false);

    const handleInspectionDialog = () => {
        if (target === 'PRODUCT') {
            setOpenInspectionProduct(true);
        }
        if (target === 'USER' && !item.isAi) {
            setOpenInspectionUser(true);
        }
        if (target === 'USER' && item.isAi) {
            setOpenInspectionAiUser(true);
        }
    };

    const handleCloseInspection = (refresh) => {
        if (target === 'PRODUCT') {
            setOpenInspectionProduct(false);
        }
        if (target === 'USER') {
            setOpenInspectionUser(false);
        }
        if (item.isAi) {
            setOpenInspectionAiUser(false);
        }
        if (refresh) {
            refreshList;
        }
    };

    const download = () => {
        const imageUrl = renderImage();
        if (imageUrl !== '') {
            axios({
                url: decodeURIComponent(imageUrl),
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${item.id}${imageUrl.substr(imageUrl.lastIndexOf('.'))}`)
                document.body.appendChild(link)
                link.click()
            })
        }
    };

    const renderImage = () => {
        if (target === 'PRODUCT') {
            if (item.imageUrlList && item.imageUrlList.length > 0) {
                const firstImage = item.imageUrlList.filter(image => {
                    return image.listOrder === 1
                })
                if (firstImage.length > 0) {
                    return firstImage[0].imageUrl;
                }
            }
        }
        if (target === 'USER') {
            return item.originalImageUrl
        }
        if (target === 'AI_USER') {
            return item.originalImageUrl
        }
        return '';
    }

    const headerColor = () => {
        if (item.priorityType === 'URGENCY') {
            return 'red';
        }
        return 'green';
    }

    const renderAiImage = (value) => {
        if(value) {
            return (<div style={{textAlign: 'center', marginTop: 1, marginBottom: 1}}>
                <Typography variant="body2">
                    AI
                </Typography>
            </div>)
        }
    }

    return (
        <>
            <Grid item
                  xs={6}>
                <Card>
                    <CardHeader
                        sx={{maxHeight: 50, m: 0, p: 0.4, backgroundColor: headerColor()}}
                        title={target === 'USER' ?
                            <Typography sx={{ml: 1}}>{`${item.userDressId}`}</Typography> : target === 'PRODUCT' ?
                                <Typography sx={{ml: 1}}>{`${item.productId}`}</Typography> :
                                <Typography sx={{ml: 1}}>{item.id}</Typography>}
                        action={
                            <IconButton aria-label="download"
                                        style={{color: 'black'}}
                                        onClick={download}>
                                <DownloadForOfflineIcon/>
                            </IconButton>
                        }
                    />
                    <CardMedia
                        component="img"
                        height="150"
                        image={`${renderImage()}`}
                        style={{objectFit: 'contain', cursor: 'pointer'}}
                        onClick={handleInspectionDialog}
                    />
                    {target === 'USER' ?
                        <>
                            <div style={{textAlign: 'center', marginTop: 1, marginBottom: 1}}
                                 hidden={!item.maskless}>
                                <Typography variant="body2">
                                    Mask X
                                </Typography>
                            </div>
                            <div style={{textAlign: 'center', marginTop: 1, marginBottom: 1}}
                                 hidden={!item.isAi}>
                                <Typography variant="body2">
                                    AI
                                </Typography>
                            </div>
                        </>
                        : <></>}
                    {target === 'PRODUCT' ?  renderAiImage(item.isAi) : <></> }
                </Card>
            </Grid>
            <InspectionProductDialog
                open={openInspectionProduct}
                onClose={handleCloseInspection}
                item={item}
                readonly={readonly}
            />
            <InspectionUserDialog
                open={openInspectionUser}
                onClose={handleCloseInspection}
                item={item}
                readonly={readonly}
            />
            <InspectionAiUserDialog
                open={openInspectionAiUser}
                onClose={handleCloseInspection}
                item={item}
                readonly={readonly}
            />
        </>
    );
};
