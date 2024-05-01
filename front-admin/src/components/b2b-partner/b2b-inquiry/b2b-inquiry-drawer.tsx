import React, {FC, MutableRefObject, useContext} from "react";
import {InquiryModel} from "../../../types/inquiry";
import {styled} from "@mui/material/styles";
import {Box, Button, Drawer, IconButton, Stack, TextField, Typography} from "@mui/material";
import {toast} from "react-hot-toast";
import {X as XIcon} from "../../../icons/x";
import {PropertyList} from "../../property-list";
import {PropertyListItem} from "../../property-list-item";
import {getDate} from "../../../utils/data-convert";
import PropTypes from "prop-types";
import {b2bPartnerInquiryApi} from "../../../b2b-partner-api/b2b-partner-inquiry-api";
import {DataContext} from "../../../contexts/data-context";
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import SaveIcon from "@mui/icons-material/Save";


interface InquiryDrawerProps {
  containerRef?: MutableRefObject<HTMLDivElement>;
  open?: boolean;
  onClose?: () => void;
  inquiry?: InquiryModel;
  getLists?: () =>  void;
}

const InquiryDrawerMobile = styled(Drawer)({
  flexShrink: 0,
  maxWidth: '100%',
  height: 'calc(100% - 64px)',
  width: 500,
  '& .MuiDrawer-paper': {
    height: 'calc(100% - 64px)',
    maxWidth: '100%',
    top: 64,
    width: 800
  }
});
export const BtbInquiryDrawer : FC<InquiryDrawerProps> = (props) => {
  const { containerRef, onClose, open, inquiry, getLists, ...other } = props;
  const dataContext = useContext(DataContext);
  const handleAnswerChange = () => {
    const newAnswer = (document.getElementById('answer') as HTMLInputElement).value;
    inquiry.answer = newAnswer;
  }

  const getType = (type) => {
    return dataContext.BTB_INQUIRY_TYPE[type]
  }
  const onSave = async () => {
    if(inquiry.answer == '' || !inquiry.answer) {
      toast.error('답변을 입력해주세요.')
      return;
    } else if(inquiry.answer !== '') {
      console.log(inquiry)
      inquiry.status = 'CLOSE'

    const saveData = {...inquiry};
    if(inquiry.status === 'CLOSE') {
      if (window.confirm('저장하시겠습니까?')) {
        const result = await b2bPartnerInquiryApi.patchPartnersInquiries(saveData);
        if(result == 200){
          toast.success('저장되었습니다.');
          }
        }
      }
      onClose();
    }
  };

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


  const getSavedFiles = inquiry?.imageUrlList.map((file:any, idx) => {
    return (
      <Stack key={file.id}
             direction="row"
             sx={{
               width: '80%',
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               height: 30,
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



  const content = inquiry
    ? (
      <>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            px: 3,
            py: 2
          }}
        >
          <Typography
            color="inherit"
            variant="h6"
          >
            1:1 문의 상세내역
          </Typography>
          <IconButton
            color="inherit"
            onClick={onClose}
          >
            <XIcon fontSize="small" />
          </IconButton>
        </Box>
        <PropertyList>
          <Stack
            direction="row"
          >
            <PropertyListItem label="아이디"
                              sx={{width: 200}}
            />
            <TextField
              disabled
              fullWidth
              margin="normal"
              name="id"
              value={inquiry.id || ''}
            />
          </Stack>
          <Stack
            direction="row"
          >
            <PropertyListItem label="작성자"
                              sx={{width: 200}}
            />
            <TextField
              disabled
              fullWidth
              margin="normal"
              name="createdBy"
              value={inquiry.userName || ''}
            />
          </Stack>
          <Stack
            direction="row"
          >
            <PropertyListItem label="문의 유형"
                              sx={{width: 200}}
            />
            <TextField
              disabled
              fullWidth
              margin="normal"
              name="category"
              value={getType(inquiry.type) || ''}
            />
          </Stack>
          <Stack
            direction="row"
          >
            <PropertyListItem label="등록일자"
                              sx={{width: 200}}
            />
            <TextField
              disabled
              fullWidth
              margin="normal"
              name="createdDate"
              value={getDate(inquiry.createdDate) || ''}
            />
          </Stack>
          <Stack
            direction="row"
          >
            <PropertyListItem label="문의 내역"
                              sx={{width: 200}}
            />
            <TextField
              disabled
              fullWidth
              margin="normal"
              name="question"
              multiline={true}
              value={inquiry.contents || ''}
            />
          </Stack>
          {/*첨부파일*/}
          <Stack
            direction="row">
            <PropertyListItem label=""
                              sx={{width: 200}}
            />
            <Stack sx={{width: '90%'}}>
          {getSavedFiles}
            </Stack>
          </Stack>
          <Stack
            direction="row"
          >
            <PropertyListItem label="답변"
                              sx={{width: 200}}
            />
            <TextField
              fullWidth
              margin="normal"
              id="answer"
              multiline={true}
              defaultValue={inquiry.answer || ''}
              onChange={handleAnswerChange}
            />
          </Stack>
        </PropertyList>
        <Stack direction="row"
               justifyContent={"flex-end"}
               sx={{ mt: 2, mb:1 }}>
          <Button
            color="primary"
            startIcon={<SaveIcon />}
            onClick={onSave}
            size="small"
            variant="contained"
          >
            저장
          </Button>
        </Stack>
      </>
    ) : null;

  return (
    <InquiryDrawerMobile
      anchor="right"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </InquiryDrawerMobile>
  );
}

BtbInquiryDrawer.propTypes ={
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  // @ts-ignore
  inquiry: PropTypes.object
}


