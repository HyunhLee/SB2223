import React, {useEffect, useState} from "react";
import {X as XIcon} from "../../icons/x";
import Dropzone from "../style/dropzone";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import toast from "react-hot-toast";
import {ImageInFormWidget} from "../widgets/image-widget";
import {ListManager} from "react-beautiful-dnd-grid";
import {Box, IconButton, Menu, Stack, Typography} from "@mui/material";
import {productApi} from "../../api/product-api";

const ImageFileBox = (props) => {

    const {header, imageUrlList, imageList, addFileImage, data, setData} = props;

    let [files, setFiles] = useState<any[]>(imageUrlList);
    const [visible, setVisible] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null);
    const [up, setUp] = useState(false);
    const [imageUpload, setImageUpload] = useState<any>({
        uploadFile : []
    })

    useEffect(() => {
        setFiles(imageUrlList)
    },[imageUrlList])

    useEffect(() => {
        imageUploadHandler();
    }, [up]);

    const imageUploadHandler = async () => {
        for(let i = 0; i < imageUpload.uploadFile.length; i++) {
            const saveData = {...imageUpload};
            let formData = new FormData();
            Object.keys(saveData).forEach(key => {
                formData.append(key, saveData[key][i]);
            })
            await productApi.uploadImageList(formData
            ).then(res => {
                console.log(res);
                const image = {imageUrl : res.data.imageUrl, listOrder : files.length + i+1, size : imageUpload.uploadFile[i].size}
                setFiles((prevFiles) => [...prevFiles, image])
            }).catch(err => {
                console.log(err);
            })
        }
    }

    const handleDrop = (newFiles: any[]): void => {
        setImageUpload({...imageUpload, uploadFile: newFiles})
        setUp(!up)
        for(const element of newFiles) {
            if (element.size) {
                if (element.size > 1000000) {
                    toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                    return;
                }
            }
        }
    };

    const reorder = (startIndex, endIndex) => {
        const result = Array.from(files);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        result.forEach((item, index) => {item.listOrder = index + 1})

        return result;
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

    const onDelete = (item) => {
        const newfile = [...files]
        newfile.splice(newfile.indexOf(item), 1)
        setFiles(newfile);
        setData({ ...data, imageUrlList: newfile});
        setImageUpload({...imageUpload, uploadFile : newfile})
        const deleteImage = {imageUrl : item.imageUrl}
        productApi.deleteImage(deleteImage
        ).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleDragImageEnd = async (source, destination): Promise<void> => {
        try {
            if (destination === source) {
                return;
            }

            setFiles(reorder( source, destination ))
            setData({ ...data, imageUrlList: reorder( source, destination )});
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    useEffect(() => {
        for(const element of files) {
            element.listOrder = files.indexOf(element)+1;
        }
        addFileImage(files)
        handleClose();
        if (!visible) {
            handleVisible();
        }
    }, [files]);

    const ListElement = ({ item: { listOrder, size, imageUrl } }): any  => {
        return (
            <Box sx={{width :300}}>
                {size ? `${listOrder}. ${(size/1000000).toFixed(3)}MB` : `${listOrder}`}
                <ImageInFormWidget imageUrl={`${imageUrl}`} />
                <div style={{position: 'initial', right: 15, top: 10}}>
                    <Stack
                        direction='column'
                    >
                        <IconButton
                            edge="end"
                            onClick={() => onDelete(files.find((element) => element.imageUrl === imageUrl))}
                        >
                            <XIcon fontSize="small"/>
                        </IconButton>
                    </Stack>
                </div>
            </Box>
        );
    }

    return (
        <Box
            sx={{ border: 1, borderRadius: 1, width: '100%' }}>
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
                        maxFiles={20}
                    />
                </Box>
            </Menu>
            <ListManager
                items={files}
                direction="horizontal"
                maxItems={5}
                render={(item) => <ListElement item={item}/>}
                onDragEnd={handleDragImageEnd} />
        </Box>
    )
}

export default ImageFileBox;