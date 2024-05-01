import {Box, IconButton, Menu, Stack, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import {ListManager} from "react-beautiful-dnd-grid";
import {ImageInFormWidget} from "../widgets/image-widget";
import Dropzone from "../dropzone";
import toast from "react-hot-toast";
import {X as XIcon} from "../../icons/x";

const UploadProductImg = (props) => {
    const {data, setData} = props;

    let [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null);
    const [up, setUp] = useState(false);
    const [imageUpload, setImageUpload] = useState<any>({
        uploadFile: []
    })
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrop = (newFiles: any[]): void => {
        setImageUpload({...imageUpload, uploadFile: newFiles})
        setUp(!up)
        for (const element of newFiles) {
            if (element.size) {
                if (element.size > 1000000) {
                    toast.error("이미지 파일은 한 장당 1MB 이하여야합니다.");
                    return;
                }
            }
        }
    };

    const onDelete = (item) => {
        console.log('item', item)
    }


    const ListElement = ({item: {listOrder, size, imageUrl}}): any => {
        return (
            <Box sx={{width: 300}}>
                {size ? `${listOrder}. ${(size / 1000000).toFixed(3)}MB` : `${listOrder}`}
                <ImageInFormWidget imageUrl={`${imageUrl}`}/>
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

    const handleDragEnd = async (source, destination): Promise<void> => {
    };

    return (
        <Box sx={{border: 0.5, borderRadius: 1, borderColor: 'grey.300', minHeight: 100}}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pr: 0.6,
                    pl: 2
                }}
            >
                <IconButton aria-label="add" onClick={handleClick} sx={{mt: 3.5}}>
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
                        maxFiles={20}
                    />
                </Box>
            </Menu>
            <ListManager
                items={files}
                direction="horizontal"
                maxItems={5}
                render={(item) => <ListElement item={item}/>}
                onDragEnd={handleDragEnd}/>
        </Box>
    )
}

export default UploadProductImg;