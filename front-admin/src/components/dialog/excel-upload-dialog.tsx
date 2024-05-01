import {Box, Button, Dialog, IconButton, Stack} from "@mui/material";
import Dropzone from "../style/dropzone";
import React, {useState} from "react";
import {X as XIcon} from "../../icons/x";
import axiosHandsomeInstance from "../../plugins/axios-handsome-instance";
import toast from "react-hot-toast";

export const ExcelUploadDialog = (props) => {
    const {onClose, open, ...other} = props;

    const [excel, setExcel] = useState<any[]>([]);

    const handleDrop = (newFile: any): void => {
        setExcel(newFile);
    };

    const handleCancel = () => {
        setExcel([]);
        onClose();
    }

    const handleUpload = async () => {
        if(window.confirm('업로드 하시겠습니까?')) {
            let formData = new FormData();
            Object.keys(excel).forEach(key => {
                excel.forEach((file: any) => {
                    formData.append('file', file)
                })
            })
            return axiosHandsomeInstance.post('/api/products/excel', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then((res) => {
                console.log(res);
                setExcel([]);
                let prod = res.data.duplicatedNumbers.join(', ');
                let regist = res.data.registeredIds.join(', ');
                let duplicCnt = res.data.totalDuplicatedCount;
                let registCnt = res.data.totalRegisteredCount;
                window.confirm(
                    `중복상품 : ${prod}\n등록상품ID : ${regist}\n중복상품수 : ${duplicCnt}\n등록상품수 : ${registCnt}`
                )
                onClose();
            }).catch((err) => {
                console.log(err);
                toast.error('업로드에 실패했습니다.');
            });
        }
    }

    const onDelete = () => {
        setExcel([]);
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {minWidth: 600, minHeight: 250}}}
            open={open}
            onBackdropClick={handleCancel}
            {...other}
        >
            <Box sx={{m: 2, p: 2}}>
                {excel.length == 0 ?
                    <Dropzone
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        files={excel}
                        onDrop={handleDrop}
                        maxFiles={1}
                    />
                    :
                    <Box sx={{border: 1, borderRadius: 1, p: 1}}
                         style={{position: 'relative'}}>
                        <img
                            src={`/static/icons/excel_file_image.png`}
                            style={{objectFit: 'contain', width: '100%', height: 250, cursor: 'pointer'}}
                            loading="lazy"
                        />
                        <div style={{position: 'absolute', right: 15, top: 10}}>
                            <IconButton
                                edge="end"
                                onClick={onDelete}
                            >
                                <XIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Box>
                }
            </Box>
            <Stack direction='row'
                   sx={{justifyContent: 'right'}}>
                <Button
                    disabled={excel.length == 0}
                    sx={{mr: 1, ml: 2, mb: 2, width: 100}}
                    variant={'contained'}
                    color={'success'}
                    onClick={handleUpload}
                >
                    업로드
                </Button>
                <Button
                    sx={{mr: 4, ml: 1, mb: 2, width: 100}}
                    variant={'contained'}
                    color={'error'}
                    onClick={handleCancel}
                >
                    취소
                </Button>
            </Stack>
        </Dialog>
    );
};