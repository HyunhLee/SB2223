import {Box, IconButton, ImageList, ImageListItem, Menu, Stack} from "@mui/material";
import Dropzone from "../style/dropzone";
import {ImageInFormWidget} from "../widgets/image-widget";
import {X as XIcon} from "../../icons/x";
import React, {useState, useEffect} from "react";

const BrandImagePreview = (props) => {
    const {data, imageUrl,image, anchorEl, handleClose, open, addImageHandler } = props;
    // console.log('data!!!!!!!!!!!!!!!!!', data, image, imageUrl, image?.file)
    const [imgUrl, setImgUrl]  = useState( imageUrl ? imageUrl : '');

    useEffect(() => {
        handleClose()
    },[image])


    const imgDel = () => {
        setImgUrl('');
        addImageHandler(null)
    }

    const handleDrop = (newFile: any): void => {
        setImgUrl('');
        addImageHandler(newFile)
    }
    return (
        <>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
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
                        files={image}
                        onDrop={handleDrop}
                        maxFiles={20}
                    />
                </Box>
            </Menu>
            {imgUrl?.length ?(
            <Box>
                 <ImageList sx={{m: 0, mb: 0}}>
                    <ImageListItem key={imgUrl} sx={{pt: 1, pr: 1, pl: 1, height: 400}}>
                        <Box sx={{width: 300}}
                        >
                            <ImageInFormWidget imageUrl={`${imgUrl}`}/>
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
                    </ImageListItem>
                </ImageList>
            </Box>
            ) : (
                <>
                    {image?.map((item) => {
                        return (
                            <>
                                <Box>
                                    <ImageList sx={{m: 0, mb: 0}} >
                                        <ImageListItem key={imgUrl} sx={{pt: 1, pr: 1, pl: 1, height: 400}}>
                                            <Box sx={{width: 300}}
                                            >
                                                <ImageInFormWidget imageUrl={`${item.preview}`}/>
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
                                        </ImageListItem>
                                    </ImageList>
                                </Box>
                            </>
                        )}
                    )}
                </>
            )}
        </>
    )
}

export default BrandImagePreview;