import React, {FC} from "react";
import {Stack,IconButton,Button, TextField, Theme, Typography, useMediaQuery} from "@mui/material";
import {PropertyListItem} from "../../property-list-item";
import {PropertyList} from "../../property-list";
import {NoticeDetailModel} from "../../../types/notice-model";
import {useTranslation} from "react-i18next";
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";

interface ListProps {
    noticeModel: NoticeDetailModel;
}

const CreateNoticeDetail: FC<ListProps> = (props) => {
    const {
        noticeModel,
    } = props;
    const {t} = useTranslation();
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';


    const handleDownload = (image) => {
        const guideUrl = image.imageUrl;
        axios({
            url: decodeURIComponent(guideUrl),
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data],))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', image.imageName)
            document.body.appendChild(link)
            link.click()
            // toast.success('다운로드 성공')
        })

    }


    const getSavedFiles = noticeModel?.imageUrlList.map((file:any, idx) => {
        return (
          <Stack key={file.id}
                 direction="row"
                 sx={{
                     width: '80%',
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     height: 30,
                     backgroundColor: '#efefef',
                     border: '2px solid #fff'
                 }}>
              <Button
                sx={{"&:hover": {backgroundColor: "transparent", cursor: 'default'}}}>
                  {file.imageName}
              </Button>
              <Stack direction={'row'}>
                  <IconButton
                    onClick={() => handleDownload(file)}
                  ><DownloadIcon sx={{fontSize: 15}} /></IconButton>
              </Stack>
          </Stack>
        )
    })



    return (
        <>
            <PropertyList>
                <PropertyListItem
                    align={align}
                    label={t("components_general_createNoticeDetail_typography_title")}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{width: '100%'}}
                    >
                        <TextField
                            disabled={true}
                            fullWidth
                            id='title'
                            value={noticeModel.title}
                        />
                    </Typography>
                </PropertyListItem>
              {noticeModel?.imageUrlList.length !== 0 ?  <PropertyListItem
                label={"첨부파일"}
                align={align}>
                <Stack sx={{width: '60%'}}>
                  {noticeModel?.imageUrlList.length !== 0 &&getSavedFiles}
                </Stack>
              </PropertyListItem> : <Stack></Stack>}
                <PropertyListItem
                    align={align}
                    label={t("components_general_createNoticeDetail_typography_contents")}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{width: '100%'}}
                    >
                        <TextField
                            disabled={true}
                            fullWidth
                            id='content'
                            value={noticeModel.contents}
                            multiline={true}
                            rows={15}
                        />
                    </Typography>
                </PropertyListItem>
            </PropertyList>
        </>
    )
};

export default CreateNoticeDetail;