import {
    Box,
    IconButton,
    ImageList,
    ImageListItem,
    Menu,
    Stack,
} from "@mui/material";
import Dropzone from "../style/dropzone";
import {ImageInFormWidget} from "../widgets/image-widget";
import {X as XIcon} from "../../icons/x";
import React, {useEffect, useState} from "react";


export const EventAddImage = (props) =>{
    const {anchorEl, imageUrl, image, addImageHandler, open, handleClose, setReady } = props
    const [imgUrl, setImgUrl]  = useState( imageUrl ? imageUrl : '');

    useEffect(() => {
        handleClose()
    },[image])


    const imgDel = () => {
        setImgUrl('');
        setReady(true);
        addImageHandler(null)
    }

    const handleDrop = (newFile: any): void => {
        setImgUrl('');
        addImageHandler(newFile)
    }

    return(
            <>
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
                            files={image}
                            onDrop={handleDrop}
                            maxFiles={2}
                        />
                    </Box>
                </Menu>
                {imgUrl ?(
                    <Box>
                        <ImageInFormWidget imageUrl={`${imgUrl}`} title={'popup'}/>
                        <Stack
                            direction='column'
                        >
                            <IconButton
                                edge="end"
                                onClick={imgDel}
                            >
                                <XIcon fontSize="small"/>
                            </IconButton>
                        </Stack>
                    </Box>
                ) : (
                    <>
                        {image?.map((item) => {
                            return (
                                <>
                                    <Box>
                                        <ImageList sx={{ width: 390, alignItems: 'center', display:'flex' , justifyContent: 'center'}}>
                                            <ImageListItem key={imgUrl} >
                                        <ImageInFormWidget imageUrl={`${item.preview}`} title={'popup'}/>
                                        <Stack
                                            direction='column'
                                        >
                                            <IconButton
                                                edge="end"
                                                onClick={imgDel}
                                            >
                                                <XIcon fontSize="small"/>
                                            </IconButton>
                                        </Stack>
                                            </ImageListItem>
                                        </ImageList>
                                    </Box>
                                </>
                            )
                            }
                        )}
                    </>
                )}
            </>
    )
}