import {Box, IconButton, Menu, Stack, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {X as XIcon} from "../../icons/x";
import Dropzone from "../style/dropzone";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import toast from "react-hot-toast";
import {ImageInFormWidget} from "../widgets/image-widget";
import {ListManager} from "react-beautiful-dnd-grid";

const ImageFileBoxProduct = (props) => {

    const {header, imageUrlList, imageList, addFileImage, data, setImageUrlList} = props;

    let [files, setFiles] = useState<any[]>(imageUrlList);
    const [visible, setVisible] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        setFiles(imageUrlList)
    }, [imageUrlList]);

    const handleDrop = (newFiles: any): void => {
        newFiles.forEach((file, index) => {
            setFiles((prevFiles) => [...prevFiles, {imageUrl:URL.createObjectURL(file), listOrder:0, size: file.size} ])
        })
        addFileImage(newFiles);
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
        setImageUrlList(newfile);
    }

    const handleDragImageEnd = async (source, destination): Promise<void> => {
        try {
            if (destination === source) {
                return;
            }

            setFiles(reorder( source, destination ))
            setImageUrlList(reorder( source, destination ));
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong!');
        }
    };

    useEffect(() => {
        for(const element of files) {
            element.listOrder = files.indexOf(element)+1;
        }
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
            sx={{ border: 1, borderRadius: 1, width: '100%' }}
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

export default ImageFileBoxProduct;