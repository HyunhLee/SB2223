import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack
} from "@mui/material";
import {X as XIcon} from "../../icons/x";
import React, {useContext,useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import ProductDetail from "../marketing/product-detail";
import DetailClickDetail from "../marketing/detail-click-detail";
import StyleDetail from "../marketing/style-detail";
import UserDetail from "../marketing/user-detail";
import _ from "lodash";
import {DataContext} from "../../contexts/data-context";

export const MarketingDialog = (props) => {
    const {check, onClose, open, startDate, endDate, brandId, ...other} = props;
    const {t} = useTranslation();
    const gender = localStorage.getItem('mallGender');
    const dataContext = useContext(DataContext);
    let femaleGroupCate
    let maleGroupCate;

    const [groupCate, setGroupCate] = useState([])

    const handleCancel = () => {
        onClose();
    };

    const title = () => {
        let tt = '';
        if (check == 'click') {
            tt = `${t('components_marketing_clickList_cardHeader_title')}`
        } else if (check == 'style') {
            tt = `${t("components_marketing_styleList_cardHeader_title")}`
        } else if (check == 'detail') {
            tt = `${t("components_marketing_detailList_cardHeader_title")}`
        } else if (check == 'user') {
            tt = `${t("components_marketing_userList_cardHeader_title")}`
        }
        return tt;
    }




    const handleGroupCategories = () => {
        femaleGroupCate = _.sortBy(dataContext.CATEGORY_GROUP, 'groupId').filter((v) => v.groupId < 1010);
        maleGroupCate = _.sortBy(dataContext.CATEGORY_GROUP, 'groupId').filter((v) => v.groupId > 1009);
        if(gender == 'F'){
            setGroupCate(femaleGroupCate)
        }else{
            setGroupCate(maleGroupCate)
        }
    }

    useEffect(() => {
        handleGroupCategories();
    }, [open])

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: check == 'user' ? 1000 :1400, maxHeight: 700}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
            {...other}
        >
            <Stack justifyContent='space-between' direction='row'>
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
                        brandId={brandId}
                        groupCate={groupCate}
                    />
                    :
                    check == 'detail' ?
                        <DetailClickDetail
                            open={open}
                            startDate={startDate}
                            endDate={endDate}
                            brandId={brandId}
                            groupCate={groupCate}
                        />
                        :
                        check == 'style' ?
                            <StyleDetail
                                open={open}
                                startDate={startDate}
                                endDate={endDate}
                                brandId={brandId}
                                groupCate={groupCate}
                            />
                            :
                            <UserDetail
                                open={open}
                                startDate={startDate}
                                endDate={endDate}
                            />
                }
            </DialogContent>
        </Dialog>
    );
}