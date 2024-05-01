import {Card, CardContent, Divider, IconButton, Input, Stack, Theme, useMediaQuery} from "@mui/material";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import React from "react";
import LaunchIcon from '@mui/icons-material/Launch';
import {ImageInListWidget} from "./image-widget";


const HandsomeProductCorrectionDetail = (props) => {
    const {data} = props;

    let jennieFitAssignStatusCompleted = 'COMPLETED'

    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const handleChangeUrl = (url) => {
        return window.open(url, '_blank')
    };

    const align = smDown ? 'vertical' : 'horizontal';

    const handleCategory = (value) => {
       return value.join(" < ")

    }


    // @ts-ignore
    return (
        <Card>
            <CardContent>
                <PropertyList>
                    <PropertyListItem
                        align={align}
                        label="상품ID"
                    >
                        <Input
                            type='text'
                            style={{width: 350, height: 40}}
                            value={data.id}
                            readOnly={true}
                            disabled={true}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="상품 품번"
                    >
                        <Input
                            type='text'
                            style={{width: 350, height: 40}}
                            value={data.number}
                            readOnly={true}
                            disabled={true}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="스타일라이브 레벨"
                    >
                        <Input
                            type='text'
                            style={{width: 350, height: 40}}
                            value={data.grade}
                            readOnly={true}
                            disabled={true}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="상품명"
                    >
                        <Input
                            id='nameEn'
                            type='text'
                            style={{width: 350, height: 40}}
                            value={data.name}
                            readOnly={true}
                            disabled={true}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="카테고리"
                    >
                            <Input
                                type='text'
                                style={{width: 350, height: 40}}
                                value={handleCategory(data.categoryTypes)}
                                readOnly={true}
                                disabled={true}
                            />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="브랜드"
                    >
                        <Input
                            type='text'
                            style={{width: 350, height: 40}}
                            value={data.brand.nameEn}
                            readOnly={true}
                            disabled={true}
                        />
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="정상가"
                    >
                        <Input
                            id='price'
                            type='text'
                            style={{width: 350, height: 40}}
                            value={data.priceNormal}
                            readOnly={true}
                            disabled={true}
                        />
                        원
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="할인가"
                    >
                        <Input
                            id='price'
                            type='text'
                            style={{width: 350, height: 40}}
                            value={data.priceDiscount}
                            readOnly={true}
                            disabled={true}
                        />
                        원
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="쇼핑몰 URL"
                    >
                        <Stack
                            direction='row'
                        >
                            <Input
                                id='shopUrl'
                                type='text'
                                style={{minWidth: 550, height: 40}}
                                value={data.detailSiteUrl || ''}
                                readOnly={true}
                                disabled={true}
                            />
                            <IconButton color="primary"
                                        component="span"
                                        sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                        onClick={() => handleChangeUrl(data.detailSiteUrl)}>
                                <LaunchIcon/>
                            </IconButton>
                        </Stack>
                    </PropertyListItem>
                    <Divider sx={{m: 2}}/>
                            <PropertyListItem
                                align={align}
                                label="메인 이미지"
                            >
                                {data.jennieFitThumbnailImageUrl && data.jennieFitAssignStatus == jennieFitAssignStatusCompleted ?
                                    <ImageInListWidget imageName={data.name}
                                                       imageUrl={data.jennieFitThumbnailImageUrl}/>
                                    :
                                    <></>

                                }
                            </PropertyListItem>
                </PropertyList>
            </CardContent>
        </Card>
    )
};

export default HandsomeProductCorrectionDetail;