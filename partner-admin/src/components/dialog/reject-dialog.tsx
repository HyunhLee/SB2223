import React, {ChangeEvent, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {X as XIcon} from "../../icons/x";
import {toast} from "react-hot-toast";
import {newApplyStoreStatusApi} from "../../api/new-apply-store-status-api";
import {useTranslation} from "react-i18next";

export const RejectDialog = (props) => {
    const {t} = useTranslation();
    const {open, onClose, storeModel, ...other} = props;
    const [reason, setReason] = useState<string>("");

    const handleCancel = () => {
        onClose();
    }

    const handleSave = async () => {
        if (reason !== "") {
            await newApplyStoreStatusApi.postReject(storeModel.id, reason
            ).then(res => {
                console.log(res);
                toast.success('입점 신청이 반려되었습니다.');
                onClose();
            }).catch(err => {
                console.log(err);
            })
        } else {
            toast.error(`${t("component_dialog_rejectDialog_toast_emptyError")}`)
        }
    }

    const handleReason = (event: ChangeEvent<HTMLInputElement>): void => {
        setReason(event.target.value);
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {minWidth: 600, minHeight: 337.5}}}
            open={open}
            onBackdropClick={handleCancel}
            {...other}
        >
            <DialogContent dividers>
                <Stack sx={{display: 'flex', justifyContent: 'space-between'}} direction='row'>
                    <Typography variant='h5'>
                        {t("component_dialog_rejectDialog_typography_header")}
                    </Typography>
                    <IconButton
                        edge="end"
                        onClick={handleCancel}
                    >
                        <XIcon fontSize="small"/>
                    </IconButton>
                </Stack>
                <Typography sx={{m: 2, textAlign: 'center'}}>
                    {t("component_dialog_rejectDialog_typography_body")}
                </Typography>
                <TextField
                    fullWidth
                    rows={7}
                    multiline={true}
                    onChange={handleReason}
                    placeholder={t("component_dialog_rejectDialog_textField_placeholder")}
                >
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button autoFocus
                        variant="contained"
                        onClick={handleSave}
                >
                    {t("button_confirm")}
                </Button>
                <Button onClick={handleCancel}>
                    {t("button_cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    )
};