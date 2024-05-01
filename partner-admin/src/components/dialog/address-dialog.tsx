import {Dialog, DialogContent, DialogTitle, IconButton, Stack} from "@mui/material";
import {CSSProperties, useEffect, useState} from "react";
import DaumPostcode from "react-daum-postcode";
import {X as XIcon} from "../../icons/x";
import {useTranslation} from "react-i18next";

export const AddressDialog = (props) => {
    const {t} = useTranslation();
    const {items, onClose, value: valueProp, open, ...other} = props;

    const [value, setValue] = useState(valueProp);

    useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const handleCancel = () => {
        onClose();
    };

    const handleOpenAddress = (data: any) => {
        console.log(`
            주소: ${data.address},
            우편번호: ${data.zonecode}
        `)
        onClose(data.address);
    }

    const heightStyle: CSSProperties = {
        height: 500
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {minWidth: 500, minHeight: 600}}}
            open={open}
            onBackdropClick={handleCancel}
            {...other}
        >
            <Stack sx={{display: 'flex', justifyContent: 'space-between'}} direction='row'>
                <DialogTitle>{t("component_dialog_addressDialog_dialogTitle_title")}</DialogTitle>
                <IconButton
                    onClick={() => onClose()}
                >
                    <XIcon fontSize="small"/>
                </IconButton>
            </Stack>
            <DialogContent dividers>
                <DaumPostcode
                    style={heightStyle}
                    onComplete={handleOpenAddress}  // 값을 선택할 경우 실행되는 이벤트
                    autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                    // defaultQuery='판교역로 235' // 팝업을 열때 기본적으로 입력되는 검색어
                />
            </DialogContent>
        </Dialog>
    )
}