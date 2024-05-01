import React, {FC} from 'react';
import {DropzoneOptions, useDropzone} from 'react-dropzone';
import {
    Box,
    Typography
} from '@mui/material';

interface DropzoneProps extends DropzoneOptions {
    files?: any[];
    onRemove?: (file: any) => void;
    onRemoveAll?: () => void;
    onUpload?: () => void;
}



const Dropzone: FC<DropzoneProps> = (props) => {
    const {
        accept,
        disabled,
        files,
        getFilesFromEvent,
        maxFiles,
        maxSize,
        minSize,
        noClick,
        noDrag,
        noDragEventsBubbling,
        noKeyboard,
        onDrop,
        onDropAccepted,
        onDropRejected,
        onFileDialogCancel,
        onRemove,
        onRemoveAll,
        onUpload,
        preventDropOnDocument,
        ...other
    } = props;

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept,
        maxFiles,
        maxSize,
        minSize,
        onDrop
    });


    return (
        <Box sx={{m: 0}}>
            <Box
                sx={{
                    alignItems: 'center',
                    border: 1,
                    borderRadius: 1,
                    borderStyle: 'dashed',
                    borderColor: 'divider',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    outline: 'none',
                    p: 6,
                    ...(
                        isDragActive && {
                            backgroundColor: 'action.active',
                            opacity: 0.5
                        }
                    ),
                    '&:hover': {
                        backgroundColor: 'action.hover',
                        cursor: 'pointer',
                        opacity: 0.5
                    }
                }}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <Typography>이곳에 사진을 끌어다 놓거나 눌러주세요</Typography>
            </Box>
        </Box>
    );
}

export default Dropzone;