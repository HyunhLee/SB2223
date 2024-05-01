import {
    Box,
    Card,
    Divider,
    IconButton,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import {FC} from "react";
import {ApplyStoreModels} from "../../types/apply-store-model";
import {PropertyListItem} from "../property-list-item";
import LaunchIcon from "@mui/icons-material/Launch";
import {useTranslation} from "react-i18next";
import {ImagePreviewWidget} from "../widgets/image-widget";

const BusinessComponent = (props) => {
    const {index, applyStoreModel} = props;

    return (
        <Stack direction='row'>
            <Typography
                color="primary"
                variant="body2"
                sx={{mb: 2}}
            >
                <TextField
                    sx={{width: 200}}
                    id='businessStatus'
                    disabled={true}
                    value={applyStoreModel.businessStatus || ""}
                />
                <TextField
                    sx={{width: 200, ml: 2}}
                    id='businessEvent'
                    disabled={true}
                    value={applyStoreModel.businessEvent || ""}
                />
            </Typography>
        </Stack>
    )
}

const CardComponent = (props) => {
    const {t} = useTranslation();
    const {index, applyStoreModel} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    const handleChangeUrl = () => {
        const ShopUrl = (document.getElementById('shopUrl') as HTMLInputElement).value;
        return window.open(ShopUrl, '_blank')
    };

    return (
        <Box>
            <Stack direction="row">
                <PropertyListItem
                    align={align}
                    label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_brandNameKo")}
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
                    label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_brandNameEn")}
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
            <PropertyListItem
                align={align}
                label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_brandShopUrl")}
            >
                <Stack
                    direction='row'
                >
                    <TextField
                        sx={{width: 300}}
                        id='shopUrl'
                        value={applyStoreModel.brandShopUrl || `${t("component_newApplyStoreStatus_applyStoreInfoDetail_textField_brandShopUrlValue")}`}
                        disabled={true}
                    />
                    <IconButton color="primary"
                                component="span"
                                sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                onClick={handleChangeUrl}
                    >
                        <LaunchIcon/>
                    </IconButton>
                </Stack>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_brandIntro")}
            >
                <Typography
                    color="primary"
                    variant="body2"
                >
                    <TextField
                        id='brandIntro'
                        fullWidth
                        multiline
                        rows={4}
                        value={applyStoreModel.brandIntroduce || ""}
                        disabled={true}
                    />
                </Typography>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label=""
            >
                <ImagePreviewWidget imageUrl={""}
                                    downloaded={true}/>
            </PropertyListItem>
        </Box>
    );
};

interface ListProps {
    data: ApplyStoreModels;
}

const ApplyStoreInfoDetail: FC<ListProps> = (props) => {
    const {data} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const {t} = useTranslation();

    const list = [
        {
            businessStatus: "소매",
            businessEvent: "바지"
        },
        {
            businessStatus: "퇴근",
            businessEvent: "칼"
        }
    ];

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
                    사업자 정보
                </Typography>
                <Box sx={{mt: 2, mb: 2}}>
                    <PropertyListItem
                        align={align}
                        label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_registrationNumber")}
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                sx={{width: 300}}
                                id='registrationNumber'
                                disabled={true}
                                value={""}
                            />
                        </Typography>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_companyName")}
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
                    <PropertyListItem
                        align={align}
                        label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_representativeName")}
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                sx={{width: 300}}
                                id='representativeName'
                                disabled={true}
                                value={""}
                            />
                        </Typography>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_statusAndEvent")}
                    >
                        {list.map((value, index) => {
                            return (
                                <BusinessComponent
                                    key={`key${index}`}
                                    index={index}
                                    applyStoreModel={value}
                                />
                            )
                        })}
                        {/*{data.business.map((value, index) => {*/}
                        {/*    return (*/}
                        {/*        <BusinessComponent*/}
                        {/*            key={`key${index}`}*/}
                        {/*            index={index}*/}
                        {/*            applyStoreModel={data}*/}
                        {/*        />*/}
                        {/*    )*/}
                        {/*})}*/}
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_address")}
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                sx={{width: 300}}
                                id='address'
                                disabled={true}
                                value={""}
                            />
                        </Typography>
                    </PropertyListItem>
                    <Stack direction="row">
                        <PropertyListItem
                            align={align}
                            label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_businessRegistration")}
                        >
                            <ImagePreviewWidget imageUrl={""}
                                                downloaded={true}/>
                            {/*<ImagePreviewWidget imageUrl={data.businessRegistrationUrl}*/}
                            {/*                    downloaded={true} />*/}
                        </PropertyListItem>
                        <PropertyListItem
                            align={align}
                            label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_mailOrderBusinessCertificate")}
                        >
                            <ImagePreviewWidget imageUrl={""}
                                                downloaded={true}/>
                            {/*<ImagePreviewWidget imageUrl={data.mailOrderBusinessCertificateUrl}*/}
                            {/*                    downloaded={true} />*/}
                        </PropertyListItem>
                    </Stack>
                    <PropertyListItem
                        align={align}
                        label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_companyUrl")}
                    >
                        <Stack
                            direction='row'
                        >
                            <TextField
                                sx={{width: 300}}
                                id='companyUrl'
                                disabled={true}
                                value={"" || `${t("component_newApplyStoreStatusDetail_applyStoreInfo_textField_companyUrlValue")}`}
                            />
                        </Stack>
                    </PropertyListItem>
                </Box>
            </Card>
            <Divider/>
            <Card>
                <Typography variant="h5" sx={{m: 2}}>
                    {t("component_newApplyStoreStatus_applyStoreInfoDetail_typography_brandHeader")}
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
            <Divider/>
            <Card>
                <Typography variant="h5" sx={{m: 2}}>
                    {t("component_newApplyStoreStatus_applyStoreInfoDetail_typography_managerHeader")}
                </Typography>
                <Box sx={{mt: 2, mb: 2}}>
                    <PropertyListItem
                        align={align}
                        label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_id")}
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
                        label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_managerName")}
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
                        label={t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_managerPhoneNumber")}
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

export default ApplyStoreInfoDetail;