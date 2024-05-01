import {
    Box,
    Button,
    IconButton,
    Menu,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../../style/dropzone";
import {X as XIcon} from "../../../icons/x";
import {ImageDialog} from "../../widgets/image-widget";
import {instagramFeedLinkApi} from "../../../home-app-api/instagram-feed-link-api";
import {toast} from "react-hot-toast";
import {v4 as uuidv4} from 'uuid';
import {DataContext} from "../../../contexts/data-context";
import LaunchIcon from "@mui/icons-material/Launch";

const ImageUploadBox = (props) => {

    /**
     * fileItem FILE객체
     */
    const {header, index, addFileImage} = props;


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
        setFiles( [...newFiles]);
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

    useEffect(() => {
        addFileImage(files, index);
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

const InstagramFeedLinkDetail = (props) => {
    const {linkData, setLinkData} = props;
    const dataContext = useContext(DataContext);
    const [openImg, setOpenImg] = useState(false);
    const [idx, setIdx] = useState<number>(null);
    let copyLinkData = [...linkData];

    const handleImageClick = (index) => {
        setIdx(index);
        setOpenImg(true);
    }

    const handleCloseImg = () => {
        setOpenImg(false);
    }

    const addMainPopUpImage = async (imageFiles, index) => {
        let image = null;
        if (imageFiles.length > 0) {
            image = imageFiles[0];
        }

        if(image !== null) {
            let response = null;
            let fileName = uuidv4() + '.png';
            let typeFit = "BUCKET_URL_MAGAZINE";
            response = await instagramFeedLinkApi.getPresignedUrl(fileName, typeFit, image);
            if (response !== 200) {
                toast.error('메인 팝업 이미지 업로드에 실패했습니다. 데이터를 확인해주세요.');
            } else {
                copyLinkData[index].imageUrl = `${dataContext.BUCKET_URL_MAGAZINE}/${fileName}`;
                setLinkData(copyLinkData);
            }
        }
    };

    const onDelete = (index) => {
        copyLinkData[index].imageUrl = "";
        setLinkData(copyLinkData);
    }

    const handleChangeUrl = (index) => (event: ChangeEvent<HTMLInputElement>) => {
        copyLinkData[index].targetUrl = event.target.value;
        setLinkData(copyLinkData);
    }

    const handleClickUrl = (url) => {
        return window.open(url, '_blank')
    };

    return (
        <>
            <Table sx={{ minWidth: '100%' }}>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            No.
                        </TableCell>
                        <TableCell>
                        </TableCell>
                        <TableCell>
                            인스타그램 URL
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {linkData.map((item, index) => {
                        return (
                            <>
                                <TableRow>
                                    <TableCell>
                                        {index+1}
                                    </TableCell>
                                    <TableCell sx={{width: 500}}>
                                        <Stack>
                                            <Box
                                                sx={{
                                                    border: 1,
                                                    borderRadius: 1,
                                                    borderColor: "#e5e5e5",
                                                    maxHeight: 200,
                                                    height: 200,
                                                    width: 200,
                                                    ml: 3
                                                }}
                                            >
                                                {item.imageUrl ?
                                                    <Box sx={{p: 1}}
                                                          key={item.key}
                                                          style={{position: 'relative'}}>
                                                        <img
                                                            src={`${item.imageUrl}`}
                                                            style={{objectFit: 'contain', width: '100%', height: 172, cursor: 'pointer'}}
                                                            loading="lazy"
                                                            onClick={() => handleImageClick(index)}
                                                        />
                                                        <div style={{position: 'absolute', right: 15, top: 3}}>
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => onDelete(index)}
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
                                                   sx={{mt: 2, mb: 3, mr: 1}}>
                                                <Typography variant="subtitle2"
sx={{ml: 1}}>
                                                    메인 팝업 이미지 규격 : 172pt x 172pt
                                                </Typography>
                                                <ImageUploadBox
                                                    index={index}
                                                    addFileImage={addMainPopUpImage}/>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack
                                            direction='row'
                                        >
                                            <TextField sx={{display: 'flex', minWidth: 800}}
                                                       id={`url${index}`}
                                                       value={item.targetUrl || ''}
                                                       onChange={handleChangeUrl(index)} />
                                            <IconButton color="primary"
                                                        component="span"
                                                        sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                                        onClick={() => handleClickUrl(item.targetUrl)}>
                                                <LaunchIcon/>
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            </>
                        );
                    })}
                </TableBody>
                <ImageDialog
                    open={openImg}
                    onClose={handleCloseImg}
                    imageUrl={idx != null ? linkData[idx].imageUrl : ''}
                />
            </Table>
        </>
    )
}

export default InstagramFeedLinkDetail;