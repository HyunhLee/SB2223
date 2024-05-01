import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack, TextField,
    Typography
} from "@mui/material";
import React, {ChangeEvent} from "react";
import {useTranslation} from "react-i18next";

export const ColorOrderDialog = (props) => {
    const {items, onClose, value: valueProp, open, ...other} = props;
    const {t} = useTranslation();

    let order = [{order: null}, {order: null}];

    const handleCancel = () => {
        onClose();
    };

    const handleOk = (value) => {
        onClose(value);
    };

    const handleChange = (index) => (event: ChangeEvent<HTMLInputElement>) => {
        order[index - 1].order = Number(event.target.value);
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: '20%', maxHeight: 800}}}
            maxWidth="lg"
            open={open}
            onClose={handleCancel}
            onBackdropClick={handleCancel}
            {...other}
        >
            <DialogTitle>{t("components_dialog_colorOrderDialog_title", {number: order.length})}</DialogTitle>
            <DialogContent dividers>
                <Box sx={{display: 'flex', direction: 'row'}}>
                    <Stack direction={'row'}>
                        <Box sx={{m: 3, width: 40, height: 40, backgroundColor: 'purple'}}/>
                        <Stack sx={{m: 2.5}} direction={'column'}>
                            <Typography>{'option_color : #800FF'}</Typography>
                            <Typography>{'option_text : PURPLE'}</Typography>
                        </Stack>
                        <TextField
                            id='order'
                            sx={{m: 2, width: 60}}
                            value={order[0].order}
                            onChange={handleChange(1)}
                        />
                    </Stack>
                </Box>
                <Divider/>
                <Box sx={{display: 'flex', direction: 'row'}}>
                    <Stack direction={'row'}>
                        <Box sx={{m: 3, width: 40, height: 40, backgroundColor: 'green'}}/>
                        <Stack sx={{m: 2.5}} direction={'column'}>
                            <Typography>{'option_color : #800FF'}</Typography>
                            <Typography>{'option_text : PURPLE'}</Typography>
                        </Stack>
                        <TextField
                            id='order'
                            sx={{m: 2, width: 60}}
                            value={order[1].order}
                            onChange={handleChange(2)}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant={'contained'}
                        onClick={handleOk}>
                    {t("button_save")}
                </Button>
                <Button onClick={handleCancel}>
                    {t("button_cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    )
};