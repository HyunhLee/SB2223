import {
    Box,
    Card,
    Divider,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import React, {FC} from "react";
import {ApplyStoreModels} from "../../types/apply-store-model";
import {PropertyListItem} from "../property-list-item";
import {useTranslation} from "react-i18next";

const CardComponent = (props) => {
    const {t} = useTranslation();
    const {index, applyStoreModel} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    return (
        <Box sx={{mt: 2, mb: 2}}>
            <Stack direction="row">
                <PropertyListItem
                    align={align}
                    label={t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_propertyListItem_brandNameKo")}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            sx={{width: 300}}
                            id='brandNameKo'
                            value={applyStoreModel.brandNameKo || ""}
                            disabled={true}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_propertyListItem_brandNameEn")}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            sx={{width: 300}}
                            id='brandNameEn'
                            value={applyStoreModel.brandNameEn || ""}
                            disabled={true}
                        />
                    </Typography>
                </PropertyListItem>
            </Stack>
        </Box>
    );
};

interface ListProps {
    data: ApplyStoreModels;
}

const PartnerStoreInfoDetailB2B: FC<ListProps> = (props) => {
    const {data} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const {t} = useTranslation();

    const brand = [
        {
            brandNameKo: "스타일봇",
            brandNameEn: "Style Bot",
            brandShopUrl: "https://www.stylebot.co.kr",
            brandIntroduce: "안녕하세요",
            brandIntroduction: [],
            brandIntroductionUrl: ""
        }
    ];

    return (
        <>
            <Card>
                <Typography variant="h5" sx={{m: 2}}>
                    {t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_typography_businessHeader")}
                </Typography>
                <Box sx={{mt: 2, mb: 2}}>
                    <PropertyListItem
                        align={align}
                        label={t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_propertyListItem_companyName")}
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                sx={{width: 300}}
                                id='companyName'
                                disabled={true}
                                value={""}
                            />
                        </Typography>
                    </PropertyListItem>
                </Box>
            </Card>
            <Divider/>
            <Card>
                <Typography variant="h5" sx={{m: 2}}>
                    {t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_typography_brandHeader")}
                </Typography>
                {brand.map((value, index) => {
                    return (
                        <CardComponent
                            key={`key${index}`}
                            index={index}
                            applyStoreModel={value}
                        />
                    )
                })}
                {/*{data.brand.map((value, index) => {*/}
                {/*    return (*/}
                {/*        <CardComponent*/}
                {/*            key={`key${index}`}*/}
                {/*            index={index}*/}
                {/*            applyStoreModel={data}*/}
                {/*        />*/}
                {/*    )*/}
                {/*})}*/}
            </Card>
            <Divider />
            <Card>
                <Typography variant="h5" sx={{m: 2}}>
                    {t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_typography_managerHeader")}
                </Typography>
                <Box sx={{mt: 2, mb: 2}}>
                    <PropertyListItem
                        align={align}
                        label={t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_propertyListItem_id")}
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                sx={{width: 300}}
                                id='id'
                                value={"asd@mail.com"}
                                disabled={true}
                            />
                        </Typography>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label={t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_propertyListItem_managerName")}
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                sx={{width: 300}}
                                id='name'
                                value={"김영수 / 주임"}
                                disabled={true}
                            />
                        </Typography>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label={t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_propertyListItem_managerPhoneNumber")}
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                sx={{width: 300}}
                                id='phone'
                                value={"010-9999-9999"}
                                disabled={true}
                            />
                        </Typography>
                    </PropertyListItem>
                </Box>
            </Card>
        </>
    )
};

export default PartnerStoreInfoDetailB2B;