import React, {MouseEvent, useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import moment from "moment";
import mergeImages from "merge-images";
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
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import axios from "axios";
import {getDataContextValue, getDate} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "./dropzone";
import {X as XIcon} from "../../icons/x";
import {ImagePreviewWidget} from "./image-widget";
import {jennieFitProductAssignmentApi} from "../../handsome-api/jennie-fit-product-assignment-api";
import {handsomeAwsApi} from "../../handsome-api/aws-api";
import {HandsomeJennieFitAssignmentModel} from "../../types/handsome-model/handsome-jennie-fit-assignment-model";
import {v4 as uuidv4} from 'uuid';
import Loading from "../jennie-fit/loading";
import Resizer from "react-image-file-resizer";
import LaunchIcon from "@mui/icons-material/Launch";

const ImageUploadBox = (props) => {

    /**
     * fileItem FILE객체
     */
    const {fileItem, header, addFileImage,} = props;

    let [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(true)
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

    const onDelete = (item) => {
        console.log('item', item)
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

const InspectionProductDialog = (props) => {
    const {onClose, open, item} = props;
    const dataContext = useContext(DataContext);

    const [items, setItems] = useState<HandsomeJennieFitAssignmentModel>(item)
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<any>(null)
    const [progress, setProgress] = React.useState('none');
    const [gender, setGender] = useState('')
    const [disabled, setDisabled] = useState(true);
    const [uploadImage, setUploadImage] = useState({
        mainImage: null,
        putOnImage: null
    })


    useEffect(() => {
        if(open){
            getItem();
            setProgress('none');
        }
    }, [open])


    const getItem = async () => {
        const result = await jennieFitProductAssignmentApi.getJennieFitAssignmentsItem(item.id);
        setItems(result);
        setGender(result.product.gender);
    }


    const handleClose = () => {
        onClose();
        setLoading(true)
    };

    // 메인 이미지 리사이징 함수
    const resizeMainFile = (file): Promise<any> =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                150,
                9000,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "blob",
                150,
                1
            );
        });

    // 피팅 이미지 리사이징 함수
    const resizeFile = (file): Promise<any> =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                900,
                1946.25,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "blob",
                900,
                1946.25
            );
        });

    // 아바타 착장 이미지 리사이징 함수
    const resizeFittingFile = (file): Promise<any> =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                1000,
                2162.5,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "blob",
                1000,
                2162.5
            );
        });

    const addMainImage = async (imageFiles: any) => {
        if (imageFiles && imageFiles.length > 0) {
            if (imageFiles[0].size > 204800) {
                toast.error("이미지 파일은 한 장당 200KB 이하여야합니다.");
                return;
            }

            const imageAfter = await resizeMainFile(imageFiles[0])
            let imageArr = [new File([imageAfter], imageFiles[0].name, {type: imageFiles[0].type})];

            setUploadImage({...uploadImage, mainImage: imageArr})
            if(uploadImage.putOnImage){
                setDisabled(false)
            }
        }else{
            setDisabled(true)
        }

    };

    const addPutOnImage = async (imageFiles: any) => {
        if (imageFiles && imageFiles.length > 0) {

            if (imageFiles[0].size > 1000000) {
                toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                return;
            }

            const imageAfter = await resizeFile(imageFiles[0]);
            const imageFItAfter = await resizeFittingFile(imageFiles[0]);
            let imageArr = [new File([imageAfter], imageFiles[0].name, {type: imageFiles[0].type})];

            setUploadImage({...uploadImage, putOnImage: imageArr})
            if(uploadImage.mainImage){
                setDisabled(false)
            }

            // 너비와 높이의 비율은 1 : 2.1625
            const options = {
                width: 1000,
                height: 2162.5,
                crossOrigin: "anonymous"
            };

            mergeImages([{
                src: gender === 'F' ? '/avatar1000.png' : item.product.categoryIds[1] == 89 ? '/avatar_mask.png' : '/avatar1.png',
                x: 0, y: 0
            }, {
                src: window.URL.createObjectURL(imageFItAfter),
                x: 0, y: 0
            }], options)
                .then((b64) => (setPreview(b64)));
        } else {
            setPreview(null)
            setDisabled(true)
        }
    };

    const dataURLtoFile = (dataurl, fileName) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = window.atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], fileName, {type: mime});
    }

    const handleInspectionRequest = async () => {
        if (items.workerId === Number(localStorage.getItem('userId'))) {
            if (!window.confirm('검수 신청 하시겠습니까?')) {
                return;
            }
            setLoading(true);

            let response;
            let responsePreviewImageUrl;
            let responseMainImageUrl;
            let fileName = uuidv4() + '.png';
            let typeFit = "JENNIE_FIT";
            response = await handsomeAwsApi.getPreSignedUrl(fileName, typeFit, uploadImage.putOnImage[0]);
            if (response !== 200) {
                setLoading(false);
                toast.error('피팅 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
            }

            let preFileName = uuidv4() + '.png';
            let typePre = "JENNIE_FIT_PREVIEW";
            responsePreviewImageUrl = await handsomeAwsApi.getPreSignedUrl(preFileName, typePre, dataURLtoFile(preview, fileName));
            if (responsePreviewImageUrl !== 200) {
                setLoading(false);
                toast.error('아바타 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
            }


            let mainFileName = uuidv4() + '.png';
            let typeMain = "PRODUCT";
            responseMainImageUrl = await handsomeAwsApi.getPreSignedUrl(mainFileName, typeMain, uploadImage.mainImage[0]);
            if (responseMainImageUrl !== 200) {
                setLoading(false);
                toast.error('메인 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
            }
            const data = {
                id: items.id,
                productId: items.product.id,
                thumbnailImageUrl: mainFileName,
                putOnImageUrl: fileName,
                putOnPreviewImageUrl: preFileName,
                workerId: localStorage.getItem('userId')
            };

            if (response === 200 && responsePreviewImageUrl === 200 && responseMainImageUrl === 200) {
                const status = await jennieFitProductAssignmentApi.postWorkStatusRequested(data);
                if (status === 200) {
                    setLoading(false);
                    toast.success('검수 신청 되었습니다.');
                    handleClose();
                } else {
                    setLoading(false);
                    toast.error('검수 신청에 실패 하였습니다.');
                }
            } else {
                setLoading(false);
                toast.error('이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
            }
        } else {
            toast.error('작업자가 일치하지 않습니다.')
        }
    }

    const handleUnworkable = async () => {
        if (items.workerId === Number(localStorage.getItem('userId'))) {
            if (!window.confirm('작업 불가 처리 하시겠습니까?')) {
                return;
            }
            const data = {
                id: items.id,
                productId: items.product.id,
                workerId: Number(localStorage.getItem('userId'))
            };
            const status = await jennieFitProductAssignmentApi.postWorkStatusUnworkable(data);
            if (status === 200) {
                toast.success('작업 불가 처리 되었습니다.');
                handleClose();
            }
        } else {
            toast.error('작업자가 일치하지 않습니다.')
        }
    }


    // 다운로드 파일 이름을 추출하는 함수
    const extractDownloadFilename = (response) => {
        console.log('response.headers["content-length"] : ', response.headers["content-length"])
        console.log('response.headers["content-type"] : ', response.headers["content-type"])

        const arraybuffer = new ArrayBuffer(response.headers["content-length"]);
        const view = new Uint8Array(arraybuffer);

        for (let i = 0; i < response.headers["content-length"]; i++) {
            view[i] = response.data.charCodeAt(i) & 0xff;
            // charCodeAt() 메서드는 주어진 인덱스에 대한 UTF-16 코드를 나타내는 0부터 65535 사이의 정수를 반환
            // 비트연산자 & 와 0xff(255) 값은 숫자를 양수로 표현하기 위한 설정
        }

        return new Blob([response.data], {type: response.headers["content-type"]});
    };

    const downloadThumbnailImage = async (): Promise<any> => {
        let res = await jennieFitProductAssignmentApi.downloadThumbnailImage(items.product.id)
    }


    const getTimeline = () => {
        return (items.jennieFitStatusHistory && items.jennieFitStatusHistory.length > 0) ? items.jennieFitStatusHistory.map(history => {
            const text = `${moment(history.createdDate).format('YY-MM-DD HH:mm')}. ${dataContext.ASSIGN_STATUS[history.beforeStatus]} → ${dataContext.ASSIGN_STATUS[history.afterStatus]}`;

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
        if (item.product.categoryIds && item.product.categoryIds.length > 0) {
            return getDataContextValue(dataContext, 'HANDSOME_CATEGORY_MAP', item.product.categoryIds[item.product.categoryIds.length - 1], 'path')
        }
        return '';
    }

    return (
      <>
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
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
                    {loading ? <Loading/> : null}
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
                <Box>
                    <Grid container
                          spacing={1.5}
                          justifyContent={'start'}
                          sx={{p: 2}}>
                        <Grid item
                              xs={7}>
                            <PropertyList>
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="작업유형"
                                    value={dataContext.ASSIGN_PRIORITY[items.priorityType]}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="작업상태"
                                    value={dataContext.ASSIGN_STATUS[items.status]}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="브랜드"
                                    value={items.product.brand.nameEn}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="상품명"
                                    value={items.product.name}
                                />
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="카테고리"
                                    value={renderCategory()}
                                />
                                <Stack direction='row'>
                                    <PropertyListItem
                                        align={'horizontal'}
                                        divider
                                        label="썸네일 이미지 URL"
                                        value={items.product.thumbnailImageUrl ? items.product.thumbnailImageUrl : ''}
                                    />
                                    <IconButton color="primary"
                                                component="span"
                                                sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                                onClick={downloadThumbnailImage}
                                    >
                                        <LaunchIcon/>
                                    </IconButton>
                                </Stack>
                                <PropertyListItem
                                    align={'horizontal'}
                                    divider
                                    label="URL"
                                    value={items.product.detailSiteUrl}
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
                    <Grid container
                          spacing={1.5}
                          justifyContent={'start'}
                          sx={{p: 2}}>
                        <Grid item
                              xs={4}>
                            <Box>
                                <Typography>메인 이미지</Typography>
                                {items.status === 'ASSIGNED' || items.status === 'REJECTED' ?
                                    <ImageUploadBox
                                        target={'Image'}
                                        addFileImage={addMainImage}
                                    /> :
                                    <ImagePreviewWidget imageUrl={items.thumbnailImageUrl}
                                                        downloaded={false}/>
                                }
                            </Box>
                        </Grid>
                        <Grid item
                              xs={4}>
                            <Typography>피팅 이미지</Typography>
                            {items.status === 'ASSIGNED' || items.status === 'REJECTED' ?
                                <ImageUploadBox
                                    target={'Image'}
                                    addFileImage={addPutOnImage}
                                /> :
                                <ImagePreviewWidget imageUrl={items.putOnImageUrl}
                                                    downloaded={false}/>
                            }
                        </Grid>
                        <Grid item
                              xs={4}>
                            <Typography>아바타 착장</Typography>
                            {items.status === 'ASSIGNED' || items.status === 'REJECTED' ?
                                <ImagePreviewWidget imageUrl={preview}
                                                    downloaded={true}
                                                    bgColor={'#ADA9A9'}/> :
                                <ImagePreviewWidget imageUrl={items.putOnPreviewImageUrl}
                                                    downloaded={true}
                                                    bgColor={'#ADA9A9'}/>
                            }
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
</>
    )
};

// interface CardProps {
//     target: string;
//     item: HandsomeJennieFitAssignmentModel;
//     readonly: boolean;
//     setRequest : boolean;
// }

// @ts-ignore
export const HandsomeFitKanbanCard = (props) => {
    const {item, readonly, target, setRequest} = props;

    const [openInspectionProduct, setOpenInspectionProduct] = React.useState(false);

    const handleInspectionDialog = () => {
        if (target === 'PRODUCT') {
            setOpenInspectionProduct(true);
        }
    };

    const handleCloseInspection = () => {
        if (target === 'PRODUCT') {
            setOpenInspectionProduct(false);
        }
        setRequest(true);

    };

    const download = () => {
        const imageUrl = item.product.thumbnailImageUrl;
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

    const headerColor = () => {
        if (item.priorityType === 'URGENCY') {
            return 'red';
        }
        return 'green';
    }

    return (
        <>
            <Grid item
                  xs={6}>
                <Card>
                    <CardHeader
                        sx={{maxHeight: 50, m: 0, p: 0.4, backgroundColor: headerColor()}}
                        title={target === 'PRODUCT' ?
                            <Typography sx={{ml: 1}}>{`${item.product.id}`}</Typography> :
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
                        image={`${item.product.thumbnailImageUrl}`}
                        style={{objectFit: 'contain', cursor: 'pointer'}}
                        onClick={handleInspectionDialog}
                    />
                </Card>
            </Grid>
            <InspectionProductDialog
                open={openInspectionProduct}
                onClose={handleCloseInspection}
                item={item}
                readonly={readonly}
            />
        </>
    );
};