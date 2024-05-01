import {Button, Dialog, DialogContent, DialogTitle, Stack} from "@mui/material";
import {X as XIcon} from "../../icons/x";
import React from "react";
import ProductDetail from "../marketing/product-detail";
import StyleDetail from "../marketing/style-detail";
import DetailClickDetail from "../marketing/detail-click-detail";
import UserDetail from "../marketing/user-detail";

export const MarketingDialog = (props) => {
    const {check, onClose, open, startDate, endDate, mallId, brandId, ...other} = props;

    const handleCancel = () => {
        onClose();
    };

    const title = () => {
        let t = '';
        if(check == 'click') {
            t = '상품 클릭 수'
        } else if(check == 'style') {
            t = 'MY 스타일 저장 수'
        } else if(check == 'detail') {
            t = '상품 상세 페이지 조회 수'
        } else if(check == 'user') {
            t = '회원 가입 수'
        }
        return t;
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: check== 'user' ? 1000 : 1400, maxHeight: 700}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
            {...other}
        >
            <Stack justifyContent='space-between'
direction='row'>
                <DialogTitle>{title()}</DialogTitle>
                <Button onClick={handleCancel}>
                    <XIcon/>
                </Button>
            </Stack>
            <DialogContent dividers>
                {check == 'click' ?
                    <ProductDetail
                        open={open}
                        startDate={startDate}
                        endDate={endDate}
                        mallId={mallId}
                        brandId={brandId}
                    />
                    :
                    check == 'detail' ?
                        <DetailClickDetail
                            open={open}
                            startDate={startDate}
                            endDate={endDate}
                            mallId={mallId}
                            brandId={brandId}
                        />
                        :
                        check == 'style' ?
                            <StyleDetail
                                open={open}
                                startDate={startDate}
                                endDate={endDate}
                                mallId={mallId}
                                brandId={brandId}
                            />
                            :
                            <UserDetail
                                open={open}
                                startDate={startDate}
                                endDate={endDate}
                                mallId={mallId}
                            />
                }
            </DialogContent>
        </Dialog>
    );
}