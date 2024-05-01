import React, {FC, useState} from "react";
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton,
} from "@mui/material";
import axios from "axios";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

export const ImageDialog = (props) => {
    const {imageName, imageUrl, open, onClose, ...other} = props;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxWidth: 600, maxHeight: 800}}}
            maxWidth="xs"
            open={open}
            onClose={handleClose}
            onBackdropClick={handleClose}
            {...other}
        >
            <DialogTitle>{imageName == null ? '' : imageName}</DialogTitle>
            <DialogContent dividers>
                <img
                    src={`${imageUrl}`}
                    style={{objectFit: 'contain', cursor: 'pointer'}}
                    loading="lazy"
                    height={600}
                    width={'100%'}
                    onClick={handleClose}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export const ImageInFormWidget = (props) => {
    const {imageName, imageUrl} = props;
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex'
                }}
            >
                {
                    imageUrl
                        ? (
                            <img
                                src={`${imageUrl}`}
                                style={{objectFit: 'contain', cursor: 'pointer'}}
                                width={'100%'}
                                height={150}
                                loading="lazy"
                                onClick={handleClickOpen}
                            />
                        )
                        : (
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    backgroundColor: 'background.default',
                                    borderRadius: 1,
                                    display: 'flex',
                                    height: 80,
                                    justifyContent: 'center',
                                    width: 80
                                }}
                            >
                            </Box>
                        )
                }
            </Box>
            <ImageDialog
                open={open}
                onClose={handleClose}
                imageName={imageName}
                imageUrl={imageUrl}
            />
        </>
    );
};

export const ImageInListWidget = (props) => {
    const {imageName, imageUrl, width, height} = props;
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Box>
                {
                    imageUrl
                        ? (
                            <img
                                src={`${imageUrl}`}
                                style={{objectFit: 'contain', cursor: 'pointer', display: 'flex', justifyContent: 'center',}}
                                loading="lazy"
                                height={height ? height : 80}
                                width={width ? width : 80}
                                onClick={handleClickOpen}
                            />
                        )
                        : (
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    backgroundColor: 'background.default',
                                    borderRadius: 1,
                                    display: 'flex',
                                    height: 80,
                                    justifyContent: 'center',
                                    width: 80
                                }}
                            >
                            </Box>
                        )
                }
            </Box>
            <ImageDialog
                open={open}
                onClose={handleClose}
                imageName={imageName}
                imageUrl={imageUrl}
            />
        </>
    );
};

export const ImagePreviewWidget = (props) => {
    const {imageName, imageUrl, downloaded = false} = props;
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const download = () => {
        axios({
            url: decodeURIComponent(imageUrl),
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${imageName}${imageUrl.substr(imageUrl.lastIndexOf('.'))}`)
            document.body.appendChild(link)
            link.click()
        })
    };

    return (
        <>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100%'
                }}
            >
                {
                    imageUrl
                        ? (
                            <div style={{position: 'relative', width: 80, height: 80}}>
                                <img
                                    src={`${imageUrl}`}
                                    style={{objectFit: 'contain', cursor: 'pointer',  width: 80, height: 80}}
                                    loading="lazy"
                                    width={'100%'}
                                    onClick={handleClickOpen}
                                />
                                {downloaded ? <IconButton aria-label="download" style={{position: 'absolute', top: 0, right: 0, color: 'black'}} onClick={download}>
                                    <DownloadForOfflineIcon />
                                </IconButton> : <></>}
                            </div>
                        )
                        : (
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    backgroundColor: 'background.default',
                                    borderRadius: 1,
                                    display: 'flex',
                                    height: 80,
                                    justifyContent: 'center',
                                    width: 80
                                }}
                            >
                            </Box>
                        )
                }
            </Box>
            <ImageDialog
                open={open}
                onClose={handleClose}
                imageName={imageName}
                imageUrl={imageUrl}
            />
        </>
    );
};

export const ImageInWidgetMypage = (props) => {
    const {imageName, imageUrl} = props;
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Box>
                {
                    imageUrl
                        ? (
                            <img
                                src={`${imageUrl}`}
                                style={{objectFit: 'contain', cursor: 'pointer'}}
                                loading="lazy"
                                height={300}
                                width={200}
                                onClick={handleClickOpen}
                            />
                        )
                        : (
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    backgroundColor: 'background.default',
                                    borderRadius: 1,
                                    display: 'flex',
                                    width: 200,
                                    height: 300,
                                    justifyContent: 'center',

                                }}
                            >
                            </Box>
                        )
                }
            </Box>
            <ImageDialog
                open={open}
                onClose={handleClose}
                imageName={imageName}
                imageUrl={imageUrl}
            />
        </>
    );
};