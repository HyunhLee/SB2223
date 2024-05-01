import React, {useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

export const ImageDialog = (props) => {
    const {imageName, imageUrl, open, onClose, bgColor, ...other} = props;

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
            <DialogContent dividers
sx={{backgroundColor: bgColor}}>
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
                <Button autoFocus
                        onClick={handleClose}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export const ImageInFormWidget = (props) => {
  const {imageName, imageUrl, title} = props;

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
                height={title? 340 : 150}
                loading="lazy"
                onClick={handleClickOpen}
              />
            )
            : (
              <Box
                                sx={{
                                    alignItems: 'center',
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
    const {imageName, imageUrl, bgColor, height, width, name} = props;
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <>
            <Box sx={{display: 'flex', justifyContent: name == 'avatar' ? 'center' : 'start'}}>
                {
                    imageUrl
                        ? (
                            <img
                                src={`${imageUrl}`}
                                style={{objectFit: 'contain', cursor: 'pointer',  display: 'flex', justifyContent: 'center',}}
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
                bgColor={bgColor}
            />
        </>
    );
};

export const ImagePreviewWidget = (props) => {
    const {imageName, imageUrl, bgColor } = props;
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const backgroundColor = () => {
        return imageName === 'preview' ? bgColor : ''
    }

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
                            <div style={{position: 'relative', height: '100%'}}>
                                <img
                                    src={`${imageUrl}`}
                                    style={{objectFit: 'contain', cursor: 'pointer', backgroundColor: backgroundColor()}}
                                    loading="lazy"
                                    width={'100%'}
                                    onClick={handleClickOpen}
                                />
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
                bgColor={bgColor}
            />
        </>
    );
};

