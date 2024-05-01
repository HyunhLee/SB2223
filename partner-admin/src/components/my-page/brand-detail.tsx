import {
    Card, CardContent, Divider, Grid,
    IconButton, Theme, useMediaQuery,
} from "@mui/material";
import {useEffect, useState} from "react";
import {PropertyListItem} from "../property-list-item";
import {PropertyList} from "../property-list";
import LaunchIcon from "@mui/icons-material/Launch";
import {BrandDetailCorrection} from "./brand-detail-correction";
import {BrandDetail} from "../../types/account-model";
import {useTranslation} from "react-i18next";


export const BrandDetails = (props) => {
    const {data, setData} = props;
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const align = mdUp ? 'horizontal' : 'vertical';
    const {i18n, t} = useTranslation();
    const [info, setInfo] = useState<BrandDetail>(data);

    const handleOpenUrl = (url) => {
        console.log(url)
        return window.open(url, '_blank')
    };
    useEffect(() => {
        setInfo(data);
    }, [setData])


    return (
        <>
            <Card>
                <CardContent>
                    <PropertyList>
                        <Grid sx={{display: 'flex'}}>
                            <PropertyListItem
                                align={align}
                                label={t('component_myPage_brandDetail_label_brandNameKo')}
                                value={info.nameKo}
                            />
                            <PropertyListItem
                                align={align}
                                label={t('component_myPage_brandDetail_label_brandNameEn')}
                                value={info.nameEn}
                            />
                        </Grid>
                        <Divider sx={{mt: 2, mb: 2}}/>
                        <Grid sx={{display: 'flex'}}>
                            <PropertyListItem
                                align={align}
                                label={t('component_myPage_brandDetail_label_companyUrl')}
                                value={info.companyUrl}
                            />
                            <IconButton color="primary"
                                        component="span"
                                        sx={{mr: 100, fontSize: 12}}
                                        onClick={() => handleOpenUrl(info.companyUrl)}>
                                <LaunchIcon/>
                            </IconButton>
                        </Grid>
                    </PropertyList>
                </CardContent>
            </Card>
            <BrandDetailCorrection info={info} setInfo={setData}/>
        </>
    )
}


