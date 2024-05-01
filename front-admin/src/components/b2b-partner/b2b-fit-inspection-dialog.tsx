import React, {MouseEvent, useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
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
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {ImagePreviewWidget} from "../widgets/image-widget";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {DataContext} from "../../contexts/data-context";
import {getDataContextValue, getDate} from "../../utils/data-convert";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../style/dropzone";
import {X as XIcon} from "../../icons/x";
import toast from "react-hot-toast";
import {btbJennieFitProductAssignmentApi} from "../../b2b-partner-api/b2b-jennie-fit-assignment-api";
import {v4 as uuidv4} from 'uuid';
import {btbAwsApi} from "../../b2b-partner-api/b2b-aws-api";
import Resizer from "react-image-file-resizer";
import mergeImages from "merge-images";


export interface Images {
    mainImage : string
    putOnImage: string
}

const ImageUploadBox = (props) => {
    const {fileItem, header, addFileImage} = props;

    let [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState<boolean>(true)
    const [image, setImage] = useState<string>(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (fileItem) {
            fileItem.then(res => {
                handleDropImg([res])
            })
        }

    }, [])


    const handleDropImg = (newFiles: any): void => {
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
                        onDrop={handleDropImg}
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


const UnworkableDialog = (props) => {
    const { onClose, open, product,setLoading, setOpenInspection, ...other}  = props;

    const dataContext = useContext(DataContext);

    const [reason, setReason] = useState("");
    const [unWorkableReason, setUnworkableReason] = useState("");
    const [typeReason, setTypeReason] = useState("");

    const getUnworkableReason = () => {
        return Object.keys(dataContext.BTB_UNWORKABLE_REASON).map((key) => {
            return (
              <MenuItem key={key}
value={key}
onClick={() => {
                  Object.keys(dataContext.BTB_UNWORKABLE_REASON_DETAIL).map((v) => {
                      setUnworkableReason(dataContext.BTB_UNWORKABLE_REASON_DETAIL[key])
                      setTypeReason('')
                  })
              }}>{dataContext.BTB_UNWORKABLE_REASON[key]}</MenuItem>
            )
        })
    };

    const changeReason = (value) => {
        setReason(value)
    }

    const handleTypingReason = (value) => {
        setTypeReason(value)
        setUnworkableReason('')
    }

    const getUnworkableDetail = (reason) => {
        return Object.keys(dataContext.BTB_UNWORKABLE_REASON_DETAIL).map((key) => {
            if(reason == key){
                return(
                  <Typography sx={{mt:0}}>
                          <TextField
                            sx={{mt:1}}
                            fullWidth
                            margin="normal"
                            id="answer"
                            multiline={true}
                            placeholder={`${dataContext.BTB_UNWORKABLE_REASON_DETAIL[key]}`}
                            value={unWorkableReason}
                            onChange={(e) => handleTypingReason(e.target.value)}
                          />
                  </Typography>
                )
            }

        })
    }


    const handleCancel = () => {
        setReason("")
        setTypeReason("")
        setUnworkableReason("")
        onClose(false);
    };

    const handleUnworkable = async () => {
        if(unWorkableReason != '' || typeReason != ''){
            const data = {
                id: product.id,
                productId: product.productId,
                productColorId: product.productColor.id,
                workerId: product.workerId,
                jennieFitAssignmentStatus: 'Unworkable',
                unworkableReason : typeReason ? typeReason : unWorkableReason,
            };

            const status = await btbJennieFitProductAssignmentApi.putJennieFitAssignmentUnWorkable(data);
            if (status === 200) {
                toast.success('작업 불가 처리 되었습니다.');
                onClose(false);
                setLoading(true)
                setOpenInspection(false)

            }
        }else{
            toast.error('작업불가 사유를 입력해주세요.');
        }


    }

    return (
      <Dialog
        sx={{'& .MuiDialog-paper': {width: 500, maxHeight: 600}}}
        maxWidth="xs"
        open={open}
        {...other}
      >
          <DialogContent dividers>
              <Box>
                  <Stack sx={{mt: 1, mb: 1}}>
                      <Stack justifyContent={"center"}
                             sx={{mr: 1, ml: 1, mb:2, fontSize:'17px', fontWeight: 700}}>
                          작업 불가 사유를 입력해주세요.
                      </Stack>
                      <Stack>
                          <Select
                            sx={{maxWidth: 260, width: 230}}
                            fullWidth={true}
                            value={reason}
                            onChange={ (e) => {changeReason(e.target.value)}}
                          >
                              {getUnworkableReason()}
                          </Select>
                      </Stack>
                  </Stack>
                  {reason == '' ? <></> :
                  <Typography sx={{mt:0}}>
                      <TextField
                        sx={{mt:1}}
                        fullWidth
                        margin="normal"
                        id="answer"
                        multiline={true}
                        placeholder={unWorkableReason}
                        value={typeReason ? typeReason : ""}
                        onChange={(e) => handleTypingReason(e.target.value)}
                      />
                  </Typography>}
              </Box>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCancel}>
                  취소
              </Button>
              <Button autoFocus
                      variant="contained"
                      disabled={unWorkableReason == '' && typeReason == ''}
                      onClick={handleUnworkable}>
                  확인
              </Button>
          </DialogActions>
      </Dialog>
    )
}

const InspectionProductDialog = (props) => {
    const {open, item, onClose, setTotalData, totalData, setLoading, setOpenInspection} = props;
    const dataContext = useContext(DataContext);
    let type;

    const [product, setProduct] = useState(item);
    const [progress, setProgress] = useState('none');
    const [disabled, setDisabled] = useState(true);
    const [preview, setPreview] = useState(null);

    const [openUnworkable, setOpenUnworkable] = useState(false);

    const [uploadImage, setUploadImage] = useState({
        mainImage: null,
        putOnImage: null,
    })


    const handleClose = (refresh) => {
        onClose(refresh);
    };

    const getHistories = () => {
        return (product.statusHistories) ? product.statusHistories.map(history => {
            const text = `${getDate(history.createdDate)} ${dataContext.BTB_ASSIGN_STATUS[history.beforeStatus]} → ${dataContext.BTB_ASSIGN_STATUS[history.afterStatus]}`;

            return (
                <ListItem key={history.id}
                          sx={{mt: -1, p: 0}}
                          component={'div'}>
                    <ListItemText primary={text}
                                  secondary={history.changeMessage}/>
                </ListItem>
            )
        }) : <></>;
    }

    const renderCategory = () => {
        if (product.categoryIds && product.categoryIds.length > 0 && product.mallGender == 'F') {
            return getDataContextValue(dataContext, 'CATEGORY_MAP', product.categoryIds[product.categoryIds.length - 1], 'path')
        } else if(product.categoryIds && product.categoryIds.length > 0 && product.mallGender == 'M') {
            return getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', product.categoryIds[product.categoryIds.length - 1], 'path')
        }
        return '';
    }

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                400,
                865,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "blob"
            );
        });


    const addImage = (props: keyof Images) => async (imageFiles) => {
        let image = null;
        if (props === 'mainImage') {
            if (imageFiles && imageFiles.length > 0) {
                if (imageFiles.size > 204800) {
                    toast.error("이미지 파일은 한 장당 200KB 이하여야합니다.");
                    return;
                }
                setUploadImage({...uploadImage, mainImage: imageFiles})
                if (uploadImage.putOnImage) {
                    setDisabled(false)
                }
            } else {
                setDisabled(true)
            }
        } else {
            if (props == 'putOnImage' && imageFiles.length > 0) {
                image = imageFiles[0];

                const resizeImg = await resizeFile(image)
                if (image.size > 1000000) {
                    toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                    return;
                }

                setUploadImage({...uploadImage, putOnImage: imageFiles})
                if (uploadImage.mainImage) {
                    setDisabled(false)
                }

                const options = {
                    width: 400,
                    height: 865,
                    crossOrigin: 'anonymous'
                };

                let avatar = '';
                if(item.mallGender == 'M') {
                    avatar = '/avatar01.png'
                } else {
                    avatar = '/avatar0.png'
                }

                mergeImages([{
                    src: avatar,
                    x: 0, y: 0
                }, {
                    src: window.URL.createObjectURL(resizeImg),
                    x: 0, y: 0
                }], options).then((b64) => (setPreview(b64)));
            } else {
                setPreview(null)
                setDisabled(true)
            }
        }

    };

    const dataURLtoFile = (dataurl, fileName) => {

        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = window.atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], fileName, {type: mime});
    }


    const handleInspectionRequest = async () => {
        if (product.workerId === Number(localStorage.getItem('userId'))) {
         if (!window.confirm('검수 신청을 진행하시겠습니까?')) {
             return;
        } else {

        let mainImageUrl;
        const mainImgFile = uuidv4() + '.png';
        const typeMain = 'THUMBNAIL_IMG';
        mainImageUrl = await btbAwsApi.getPreSignedUrl(mainImgFile, typeMain, uploadImage.mainImage[0])
             if (mainImageUrl !== 200) {
                     toast.error('메인 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
             }

        let putOnImageUrl;
        const putOnImgFile = uuidv4() + '.png';
        const typePutOn = 'PUT_ON_IMG';
        putOnImageUrl = await btbAwsApi.getPreSignedUrl(putOnImgFile, typePutOn, uploadImage.putOnImage[0])
             if(putOnImageUrl !== 200){
                 toast.error('피팅 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.')
             }

        let previewImageUrl;
        const previewImgFile = uuidv4() + '.png';
        const typePreview = 'PUT_ON_PREVIEW_IMG';
        previewImageUrl = await btbAwsApi.getPreSignedUrl(previewImgFile, typePreview, dataURLtoFile(preview, previewImgFile))
             if(previewImageUrl !== 200){
                 toast.error('아바타 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.')
             }

             const data = {
            id: product.id,
            jennieFitAssignmentStatus: "Requested",
            productId: product.productId,
                 productColorId: product.productColor.id,
            mainImageUrl: mainImgFile,
            putOnImageUrl: putOnImgFile,
            putOnPreviewImageUrl: previewImgFile,

        }

       if(mainImageUrl === 200 && putOnImageUrl === 200 && previewImageUrl === 200){
          const result = await btbJennieFitProductAssignmentApi.putJennieFitAssignmentRequest(data)
           if (result.status === 200) {
               toast.success('검수 신청이 완료되었습니다.');
               setProduct(result.data)
               if(totalData != null){
                   let tempTotal = totalData.filter((v) => v.id !== result.data.id )
                   setTotalData([...tempTotal, result.data])
               }
               setLoading(true)
               handleClose(true);


           } else {
               toast.error('검수 신청에 실패 하였습니다.');
           }
       }
         }
        } else {
             toast.error('작업자가 일치하지 않습니다.')
        }
    }

    useEffect(() => {
        setProduct(item);
    },[open])


    return (
        <>
            <Dialog
                open={open}
                sx={{'& .MuiDialog-paper': {minHeight: 800}}}
                maxWidth="xl"
                fullWidth={true}
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
                                    disabled={product.jennieFitAssignmentStatus == 'Completed'}
                                    onClick={() => {
                                        if (product.workerId === Number(localStorage.getItem('userId'))) {
                                                if (!window.confirm('작업 불가 처리를 진행하시겠습니까?')) {
                                                    return;
                                                }else{
                                                    setOpenUnworkable(true)
                                                }
                                            }else {
                                            toast.error('작업자가 일치하지 않습니다.')
                                            }
                                    }}
                            >
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
                    <Box>
                        <Grid container
                              spacing={1.5}
                              justifyContent={'start'}
                              sx={{p: 2}}>
                            <Grid item
                                  xs={2}>
                                <Typography>피팅 참고 이미지</Typography>
                                <ImagePreviewWidget imageUrl={product?.fitRefImageUrl}/>
                            </Grid>
                            <Grid item
                                  xs={7}>
                                <PropertyList>
                                    <PropertyListItem
                                        align={'horizontal'}
                                        divider
                                        label="상품ID"
                                        value={product.productId}
                                    />
                                    <PropertyListItem
                                      align={'horizontal'}
                                      divider
                                      label="제니FIT ID"
                                      value={product.id}
                                    />
                                    <PropertyListItem
                                        align={'horizontal'}
                                        divider
                                        label="작업유형"
                                        value={dataContext.BTB_ASSIGN_PRIORITY[product.priorityType]}
                                    />
                                    <PropertyListItem
                                        align={'horizontal'}
                                        divider
                                        label="작업상태"
                                        value={dataContext.BTB_ASSIGN_STATUS[product.jennieFitAssignmentStatus]}
                                    />
                                    <PropertyListItem
                                        align={'horizontal'}
                                        divider
                                        label="생성타입"
                                        value={dataContext.BTB_REGISTRATION_TYPE[product.registrationType]}
                                    />
                                    <PropertyListItem
                                        align={'horizontal'}
                                        divider
                                        label="브랜드"
                                        value={product.brandName}
                                    />
                                    <PropertyListItem
                                        align={'horizontal'}
                                        divider
                                        label="상품명"
                                        value={product.nameKo}
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
                                      label="자사몰 컬러info"
                                      value={`Color: ${product.productColor.colorName}`}
                                    />
                                    <PropertyListItem
                                        align={'horizontal'}
                                        divider
                                        label="URL"
                                        value={product.detailSiteUrl}
                                    />
                                    <PropertyListItem
                                        align={'horizontal'}
                                        divider
                                        label="변경이력"
                                    >
                                        {getHistories()}
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
                                    {product.jennieFitAssignmentStatus === 'Assigned' || product.jennieFitAssignmentStatus === 'Rejected' ?
                                        <ImageUploadBox
                                            target={'Image'}
                                            addFileImage={addImage('mainImage')}
                                        /> :
                                        <ImagePreviewWidget imageUrl={product.productColor.mainImageUrl}/>
                                    }
                                </Box>
                            </Grid>
                            <Grid item
                                  xs={4}>
                                <Typography>피팅 이미지</Typography>
                                {product.jennieFitAssignmentStatus === 'Assigned' || product.jennieFitAssignmentStatus === 'Rejected' ?
                                    <ImageUploadBox
                                        target={'Image'}
                                        addFileImage={addImage('putOnImage')}
                                    /> :
                                    <ImagePreviewWidget imageUrl={product.productColor.putOnImageUrl}/>
                                }
                            </Grid>
                            <Grid item
                                  xs={4}>
                                <Typography>아바타 착장</Typography>
                                {product.jennieFitAssignmentStatus === 'Assigned' ||product.jennieFitAssignmentStatus === 'Rejected' ?
                                    <ImagePreviewWidget imageUrl={preview}
                                                        imageName='preview'
bgColor={'#ADA9A9'}/> :
                                    <ImagePreviewWidget imageUrl={product.productColor.putOnPreviewImageUrl}
                                                        imageName='preview'
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
            <UnworkableDialog
              open={openUnworkable}
              onClose={setOpenUnworkable}
              product={product}
              setOpenInspection={setOpenInspection}
              setLoading={setLoading}
            />
        </>
    )
}

export default InspectionProductDialog