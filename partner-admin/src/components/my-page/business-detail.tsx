import {Card, CardActions, Divider, useMediaQuery, Box, Grid, IconButton} from '@mui/material';
import type {Theme} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import {PropertyList} from '../property-list';
import {PropertyListItem} from '../property-list-item';
import {ImageInWidgetMypage} from "../widgets/image-widget";
import {useTranslation} from 'react-i18next';


export const BusinessDetails = (props) => {
    const {data} = props;
    const {i18n, t} = useTranslation();
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const align = mdUp ? 'horizontal' : 'vertical';

    const handleOpenUrl = (url) => {
        return window.open(url, '_blank')
    };

    // @ts-ignore
    return (
        <Card>
            <PropertyList>
                <PropertyListItem
                    align={align}
                    divider
                    label={t('component_myPage_businessDetail_label_businessNumber')}
                    value={data.companyCode}
                />
                <PropertyListItem
                    align={align}
                    divider
                    label={t('component_myPage_businessDetail_label_businessName')}
                    value={data.company}
                />
                <PropertyListItem
                    align={align}
                    divider
                    label={t('component_myPage_businessDetail_label_representName')}
                    value={data.representName}
                />
                <PropertyListItem
                    align={align}
                    divider
                    label={t('component_myPage_businessDetail_label_companyType')}
                    value={data.companyType}
                />
                <PropertyListItem
                    align={align}
                    divider
                    label={t('component_myPage_businessDetail_label_companyAddress')}
                    value={data.address}
                />
                <Grid item sx={{display: 'flex', justifyContent: 'start'}}>
                    <Box sx={{width: 400, display: 'flex', justifyContent: 'start', mr: 15}}>
                        <PropertyListItem
                            align={align}
                            label={t('component_myPage_businessDetail_label_businessLicense')}
                        />
                        <ImageInWidgetMypage imageName={`${t('component_myPage_businessDetail_label_businessLicense')}`}
                                             imageUrl={data.businessCodeDocs}/>
                    </Box>
                    <Box sx={{width: 400, display: 'flex', justifyContent: 'start'}}>
                        <PropertyListItem
                            align={align}
                            label={t('component_myPage_businessDetail_label_businessCodeDocs')}
                        />
                        <ImageInWidgetMypage
                            imageName={`${t('component_myPage_businessDetail_label_businessCodeDocs')}`}
                            imageUrl={data.businessCodeDocs}/>
                    </Box>
                </Grid>
                <Divider/>
                <Grid sx={{display: 'flex'}}>
                    <PropertyListItem
                        align={align}
                        label={t('component_myPage_businessDetail_label_companyUrl')}
                        value={data.companyUrl}
                    />
                    <IconButton color="primary"
                                component="span"
                                sx={{mr: 100, fontSize: 12}}
                                onClick={() => handleOpenUrl(data.companyUrl)}>
                        <LaunchIcon/>
                    </IconButton>
                </Grid>
            </PropertyList>
            <CardActions
                sx={{
                    flexWrap: 'wrap',
                    px: 3,
                    py: 2,
                    m: -1
                }}
            >
            </CardActions>
        </Card>
    );
};
