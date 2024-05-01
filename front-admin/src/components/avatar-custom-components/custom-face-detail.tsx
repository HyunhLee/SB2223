import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Menu,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import {X as XIcon} from "../../icons/x";
import React, {ChangeEvent, useEffect, useState} from "react";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../style/dropzone";
import ProductSelect from "../product/product-select";
import {AvatarHair} from "../../types/avatar-custom";
import BackgroudRemoveHair from "./backgroud-remove-hair";
import toast from "react-hot-toast";
import {ImageDialog} from "../widgets/image-widget";

const HairDialog = (props) => {
    const {items, lookbookImage, onClose, open, categoryId = null, hairId, ...other} = props;
    const [lists, setLists] = useState<AvatarHair[]>([]);

    const handleCancel = () => {
        onClose();
    };

    const handleApply = () => {
        onClose(lists);
    };

    const changeSelectedList = (lists) => {
        if(lists.length > 2) {
            toast.error('이미지는 한장만 선택 가능합니다.')
            return;
        }
        setLists(lists);
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
            {...other}
        >
            <DialogTitle>헤어 누끼</DialogTitle>
            <DialogContent dividers>
                <BackgroudRemoveHair hairId={hairId}
onClickApply={handleApply}
changeSelectedList={changeSelectedList}
categoryId={categoryId}
lookbookImage={lookbookImage} />
            </DialogContent>
            <DialogActions>
                <Button autoFocus
color="success"
onClick={handleApply}>
                    적용
                </Button>
                <Button onClick={handleCancel}>
                    취소
                </Button>
                <ProductSelect lists={lists}
clickApply={handleApply}></ProductSelect>
            </DialogActions>
        </Dialog>
    );
}

const ImageUploadBox = (props) => {

    const {parent, header, addFileImage, imageUrl, imageFile, data, setData, copy, setCopy} = props;

    let [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState(true)
    const [image, setImage] = useState<string>(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [hairOpen, setHairOpen] = useState(false);

    useEffect(() => {
        console.log(imageUrl)
    }, []);

    const handleDrop = (newFiles: any): void => {
        newFiles.forEach((file, index) => {
            file.preview = URL.createObjectURL(file)
            file.key = `key${0}`;
        })
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        console.log(files)
    };

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        if(parent === 'HAIR') {
            setHairOpen(true);
        } else {
            setAnchorEl(event.currentTarget);
        }
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

    const onDelete = (deleteImage) => {
        if(parent == 'HAIR') {
            if(deleteImage === data.avatarHair.mainImageUrl) {
                setData({...data, avatarHair: []});
            }
        } else {
            if (deleteImage === copy.mainImageUrl) {
                setCopy({...copy, mainImageUrl: ''});
                setData({...data, mainImage: []});
            } else if (deleteImage === copy.hairWithoutImageUrl) {
                setCopy({...copy, hairWithoutImageUrl: ''});
                setData({...data, hairWithoutImage: []});
            } else if (deleteImage === files) {
                setFiles([]);
            }
        }
    }

    const handleProductClose = (items: any): void => {
        if (items) {
            setData({...data, avatarHair: items[0]});
        }
        setHairOpen(false);
    };

    useEffect(() => {
        addFileImage(files);
        handleClose();
        if (!visible) {
            handleVisible();
        }
    }, [files]);

    const [openImg, setOpenImg] = useState(false);

    const handleClickOpenImg = () => {
        setOpenImg(true);
    }

    const handleCloseImg = () => {
        setOpenImg(false);
    }

    return (
        <Box
            sx={{ border: 1, borderRadius: 1 }}
        >
            <ImageDialog
                open={openImg}
                onClose={handleCloseImg}
                imageName={imageUrl}
                imageUrl={imageUrl}
            />
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
onClick={handleClick} >
                    <AddBoxRoundedIcon />
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
                {imageUrl != '' && imageUrl != undefined ?
                    <Box sx={{p: 1}}
style={{position: 'relative'}}>
                        <img
                            src={`${imageUrl}`}
                            style={{objectFit: 'contain', width: '100%', height: 150, cursor: 'pointer'}}
                            loading="lazy"
                            onClick={handleClickOpenImg}
                        />
                        <div style={{position: 'absolute', right: 15, top: 10}}>
                            <IconButton
                                edge="end"
                                onClick={() => onDelete(imageUrl)}
                            >
                                <XIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Box>
                    : files.length > 0 ?
                        <Box sx={{p: 1}}
style={{position: 'relative'}}>
                            <img
                                src={`${files[0].preview}`}
                                style={{objectFit: 'contain', width: '100%', height: 150, cursor: 'pointer'}}
                                loading="lazy"
                                onClick={handleClickOpenImg}
                            />
                            <div style={{position: 'absolute', right: 15, top: 10}}>
                                <IconButton
                                    edge="end"
                                    onClick={() => onDelete(files)}
                                >
                                    <XIcon fontSize="small"/>
                                </IconButton>
                            </div>
                            <ImageDialog
                                open={openImg}
                                onClose={handleCloseImg}
                                imageName={files[0].preview}
                                imageUrl={files[0].preview}
                            />
                        </Box>
                        : ''
                }
            </Box>
            <HairDialog
                open={hairOpen}
                onClose={handleProductClose}
                hairId={data.id}
            />
        </Box>
    )
}

export const CustomFaceDetail = (props) => {

    const {data, setData, copy, setCopy, addFileImage, addMainFileImage, addhairWithoutFileImage} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    useEffect(() => {
        console.log(data)
    },[])

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setData({...data, avatarName: event.target.value});
    };

    return (
        <Card>
            <PropertyList>
                <PropertyListItem
                    align={align}
                    label="이름"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            id='name'
                            value={data.avatarName}
                            onChange={handleChange}
                        />
                    </Typography>
                </PropertyListItem>
                <Divider />
                <Stack
                    direction='row'
                >
                    <PropertyListItem
                        align={align}
                        label="메인 이미지"
                    >
                        <ImageUploadBox
                            target={'Image'}
                            addFileImage={addMainFileImage}
                            imageUrl={copy.mainImageUrl}
                            imageFile={data.mainImage}
                            data={data}
                            setData={setData}
                            copy={copy}
                            setCopy={setCopy}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="민머리 아바타"
                    >
                        <ImageUploadBox
                            target={'Image'}
                            addFileImage={addhairWithoutFileImage}
                            imageUrl={copy.hairWithoutImageUrl}
                            imageFile={data.hairWithoutImage}
                            data={data}
                            setData={setData}
                            copy={copy}
                            setCopy={setCopy}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="헤어 누끼"
                    >
                        <ImageUploadBox
                            parent={'HAIR'}
                            target={'Image'}
                            addFileImage={addFileImage}
                            imageUrl={data.avatarHair.mainImageUrl}
                            imageFile={data.avatarHair.mainImage}
                            data={data}
                            setData={setData}
                            copy={copy}
                            setCopy={setCopy}
                        />
                    </PropertyListItem>
                </Stack>
            </PropertyList>
        </Card>
    )
}
