import React, {useContext, useState, useEffect, useRef} from 'react';
import {useTranslation} from "react-i18next";
import {FC, MutableRefObject} from "react";
import {styled} from "@mui/material/styles";
import {Box, Button, Drawer, IconButton, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {toast} from "react-hot-toast";
import {X as XIcon} from "../../../icons/x";
import {PropertyList} from "../../property-list";
import {PropertyListItem} from "../../property-list-item";
import {b2bInquiryApi} from "../../../api/b2b-inquiry-api";
import {InquiryModel} from "../../../types/inquiry";
import PropTypes from "prop-types";
import {getDate} from "../../../utils/data-convert";
import {DataContext} from "../../../contexts/data-context";
import HelpIcon from "@mui/icons-material/Help";
import {CustomWidthTooltip} from "../../widgets/custom-tooltip";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {Plus as PlusIcon} from "../../../icons/plus";

interface InquiryDrawerProps {
  containerRef?: MutableRefObject<HTMLDivElement>;
  open?: boolean;
  onClose?: () => void;
  inquiry?: InquiryModel;
  getLists?: () => void;
  setDrawer?: any;
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



export const InquiryDrawer :FC<InquiryDrawerProps> = (props) => {
  const {containerRef, onClose, open, inquiry, setDrawer} = props;
  const dataContext = useContext(DataContext);
  const {t} = useTranslation();
  const inputRef = useRef(null);

  const userEmail = localStorage.getItem('email');
  const userMallName = localStorage.getItem('mallName');


  const [data, setData] = useState({
    type: '',
    contents: '',
    status: 'OPEN',
    imageList: [],
  })

  //* 화면에 출력될 파일과 서버에 보내질 파일을 구분할 필요없다.
  //화면에 출력되는 파일
  const [selectedImages, setSelectedImages] = useState([]);

  //새로 첨부되어질 파일만 담아두기
  const [files, setFiles] = useState( []);

  //del img index
  const [delImg, setDelImg] = useState([]);

  useEffect(() => {
    if (inquiry?.id) {
      setData({...data, type: inquiry.type, imageList: inquiry.imageUrlList})
      setFiles([])
    }
  }, [inquiry])

  //파일 첨부 초기화 임시방편
  useEffect(() => {
    setSelectedImages([])
    setFiles([]);
    setDelImg([]);
    //임시로 넣어둔 파일
  }, [onClose])

  const renderType = (target) => {
    return Object.keys(dataContext[target]).map(key => {
      return (<MenuItem key={key}
                        value={key}>{dataContext[target][key]}</MenuItem>)
    });
  }

  const changeTypeHandler = (value, prop) => {
    setData(prevData => ({
      ...prevData,
      [prop]: value

    }))
  }

  const handleAnswerChange = () => {
    const newAnswer = (document.getElementById('answer') as HTMLInputElement).value;
    inquiry.answer = newAnswer;
  }

  const handleContentsChange = () => {
    const newContents = (document.getElementById('contents') as HTMLInputElement).value;
    setData({...data, contents: newContents})
  }

  const onSave = async () => {
    if (data.contents !== '' && data.type !== "") {
      let formData = new FormData();

      formData.append('type', data.type);
      formData.append('contents', data.contents);
      formData.append('status', data.status);
      formData.append('userName', userMallName);
      formData.append('userEmail', userEmail);
      // @ts-ignore
      files.forEach((f) => {
        formData.append('imageList', f);
      })


      if (window.confirm(`${t('components_general_inquiry_inquiryDrawer_toast_askSave')}`)) {
            const result = await b2bInquiryApi.postPartnersInquiries(formData);
            if(result == 200){
              toast.success(`{${t('components_general_inquiry_inquiryDrawer_toast_save')}}`);

            }
          }
        onClose();
        setData({type: '', contents: '', status: 'OPEN', imageList : []})
        setFiles([]);
      } else {
        toast.error(`${t('components_general_inquiry_inquiryDrawer_toast_question')}`)
      }
     };

    const onPatch = async () => {
      console.log(files, 'file###################')
      if (inquiry?.answer === null) {
        let modifiedFormData = new FormData();


        const modifiedData = {
          id: inquiry.id,
          type: data.type == "" ? inquiry?.type : data.type,
          contents: data.contents == "" ? inquiry?.contents : data.contents,
          status: data.status,
          userName: userMallName,
          userEmail: userEmail,
          imageList: data.imageList,
        };

        modifiedFormData.append('type', modifiedData.type);
        modifiedFormData.append('contents', modifiedData.contents);
        modifiedFormData.append('status', modifiedData.status);
        modifiedFormData.append('userName', modifiedData.userName);
        modifiedFormData.append('userEmail', modifiedData.userEmail);
        if(delImg.length > 0){
          // @ts-ignore
          modifiedFormData.append('delIdxs', delImg);
        }
        if(files.length > 0){
          files.forEach((f) => {
            console.log(f, '#################f')
            modifiedFormData.append('imageList', f);
          })
        }


        if (window.confirm(`${t('components_general_inquiry_inquiryDrawer_toast_askCorrection')}`)) {
          const response = await b2bInquiryApi.patchPartnersInquiries(modifiedFormData, inquiry.id);
          if (response == 200) {
            toast.success(`${t('components_general_inquiry_inquiryDrawer_toast_correction')}`);
          }
        }
        onClose();
        setData({type: '', contents: '', status: 'OPEN', imageList : []})
        setDelImg([]);
        setFiles([]);

      }
    }

    const onDelete = async (id): Promise<void> => {
      if (window.confirm(`${t('components_general_inquiry_inquiryDrawer_toast_askDelete')}`)) {
        const res = await b2bInquiryApi.deletePartnersInquiries(id)
        if (res == 200) {
          toast.success(`${t('components_general_inquiry_inquiryDrawer_toast_delete')}`);
          onClose();
          setData({type: '', contents: '', status: 'OPEN', imageList: []})
        }
      }
    }


    const formatBytes = (bytes, decimals = 2) => {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const fileName = (name) => {
      if (name.length > 30) {
        return [...name].slice(0, 30).join("") + '...'
      } else {
        return name
      }
    };


    let fileArr = [...files]

    const onSelectFile = (e: any) => {
      e.preventDefault();
      e.persist();
      //선택한 파일
      const selectedFile = e.target.files;

      if (
        selectedFile[0].type !== "application/pdf" &&
        selectedFile[0].type !== "image/png" &&
        selectedFile[0].type !== "image/jpg" &&
        selectedFile[0].type !== "image/jpeg"
      ) {
        window.confirm("해당 파일은 지원하지 않는 타입입니다. pdf 혹은 png, jpg 파일만 업로드해주세요.");
        return;
      }

      if (selectedFile[0].size > 1000000) {
        window.confirm('첨부파일은 10MB 이하여야합니다.');
        return
      }

      //서버로 보내기 위한
      fileArr.push(selectedFile[0])
      setFiles(fileArr);
      //선택한 파일들을 fileUrlList에 넣어준다.
      const fileUrlList = [selectedFile];

      //획득한 Blob URL Address를 브라우져에서 그대로 호출 시에 이미지는 표시가 되고 ,
      //일반 파일의 경우 다운로드를 할 수 있다.
      for (const file of selectedFile) {
        const fileUrl = URL.createObjectURL(file);
        fileUrlList.push(fileUrl);
       }


      //Array.from() 은 문자열 등 유사 배열(Array-like) 객체나 이터러블한 객체를 배열로 만들어주는 메서드이다.
      const selectedFileArray: any = Array.from(selectedFile);
      const imageArray = selectedFileArray.map((file: any) => {
        return {name: file.name, size: file.size};
      });

      // 첨부파일 삭제시
      setSelectedImages((previousImages: any) => previousImages.concat(imageArray));
      e.target.value = '';
    };

    //브라우저상에 보여질 첨부파일
    const attachFile =
      selectedImages &&
      selectedImages.map((image: any, idx) => {
        return (
          <Stack key={idx}
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
              sx={{"&:hover": {backgroundColor: "transparent"}}}
            >
              {fileName(image.name)} ({formatBytes(image.size, 2)})
            </Button>
            {inquiry?.status != 'CLOSE' ? <IconButton
              color="inherit"
              size="small"
              onClick={() => setSelectedImages(selectedImages.filter((e) => e !== image))}
            ><CloseIcon sx={{fontSize: 15}}/></IconButton> : <></>}
          </Stack>
        );
      });

    //서버에 올라간 file list
    const getSavedFiles = data?.imageList.map((file:any, idx) => {
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
          {inquiry?.id != null ?
            <IconButton
              onClick={() => handleDownload(file)}
            ><DownloadIcon sx={{fontSize: 15}} /></IconButton>
            :
            <IconButton></IconButton>}
          {inquiry?.status != 'CLOSE' ? <IconButton
            color="inherit"
            size="small"
            //기존에 더해져있던 파일을 삭제하기 때문에
            onClick={() => {
              setData({...data, imageList: data.imageList.filter((e) => e !== file)})
              data.imageList.filter((e) => e == file ? setDelImg((prv) => [...prv, e.id]) : e)
            }}
          ><CloseIcon sx={{fontSize: 15}}/></IconButton> : <></>}
          </Stack>
        </Stack>
      )
    })


    //download file
    const handleDownload = (image) => {
      if(inquiry.id == null){
        return;
      }
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

    // @ts-ignore
    return (
      <InquiryDrawerMobile
        anchor="right"
        ModalProps={{container: containerRef?.current}}
        onClose={onClose}
        open={open}
        SlideProps={{container: containerRef?.current}}
        variant="temporary"
      >
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
              {t('pages_general_InquiryDrawer_typography_title')}
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => {
                setDrawer(false)
              }}
            >
              <XIcon fontSize="small"/>
            </IconButton>
          </Box>
          <Box
            sx={{
              px: 3,
              py: 4
            }}
          >
            <PropertyList>
              {inquiry?.id ? <>
                <Stack
                  direction="row"
                >
                  <PropertyListItem label={`${t('label_id')}`}
                                    sx={{maxWidth: 140,}}
                  />
                  <TextField
                    disabled
                    fullWidth
                    margin="normal"
                    name="id"
                    value={inquiry?.userEmail}
                  />
                </Stack>
                <Stack
                  direction="row"
                >
                  <PropertyListItem label={`${t('label_inquiry_writer')}`}
                                    sx={{maxWidth: 140,}}
                  />
                  <TextField
                    disabled
                    fullWidth
                    margin="normal"
                    name="createdBy"
                    value={inquiry?.userName}
                  />
                </Stack>
              </> : <></>}

              <Stack
                direction="row"
              >
                <PropertyListItem label={`${t('label_inquiry_type')}`}
                                  sx={{minWidth: 100, maxWidth: 130, height: '50px', mt: 0.5}}
                />
                <CustomWidthTooltip title={`${t('pages_general_inquiry_inquiryList_popup')}`}
                                    sx={{whiteSpace: 'pre-wrap', mt: 0.5,}} placement="bottom" arrow>
                  <IconButton sx={{ml: -3}}>
                    <HelpIcon color="primary" fontSize="small"/>
                  </IconButton>
                </CustomWidthTooltip>

                <Select
                  disabled={inquiry?.answer != null ? true : false}
                  value={data.type == "" ? inquiry?.type : data.type}
                  size={"small"}
                  sx={{width: '100%', mt: 1}}
                  onChange={e => {
                    changeTypeHandler(e.target.value, 'type')
                  }}
                >
                  <MenuItem value={''}>-</MenuItem>
                  {renderType('INQUIRY_TYPE')}
                </Select>
              </Stack>

              {/*등록시 일자는 안보이게 자동으로 서버에 저장*/}
              {inquiry ? <>
                <Stack
                  direction="row"
                >
                  <PropertyListItem label={`${t('label_registrationDate')}`}
                                    sx={{maxWidth: 140,}}
                  />
                  <TextField
                    disabled
                    fullWidth
                    margin="normal"
                    name="createdDate"
                    value={getDate(inquiry?.createdDate) || ''}
                  />
                </Stack>
              </> : <></>}

              <Stack
                direction="row"
              >
                <PropertyListItem label={`${t('label_inquiry_inquiryDetails')}`}
                                  sx={{minWidth: 115, maxWidth: 140,}}
                />
                <TextField
                  disabled={inquiry?.answer ? true : false}
                  fullWidth
                  margin="normal"
                  name="question"
                  id="contents"
                  multiline={true}
                  onChange={handleContentsChange}
                  defaultValue={inquiry?.id ? inquiry?.contents : data.contents}
                />
              </Stack>
            </PropertyList>
            <Stack sx={{ml: 18, mt: 3, mb: 3}}>
              {data.imageList.length !== 0 && getSavedFiles}
              {attachFile}
            </Stack>
            <Stack>
            {inquiry?.answer != null ?
              <Stack
                direction="row"
              >
                <PropertyListItem label={`${t('label_inquiry_answer')}`}
                                  sx={{maxWidth: 140,}}
                />
                <TextField
                  disabled
                  fullWidth
                  margin="normal"
                  id="answer"
                  multiline={true}
                  defaultValue={inquiry?.answer || ''}
                  onChange={handleAnswerChange}
                />
              </Stack> : <></>}
            </Stack>
            <input
              hidden
              type="file"
              ref={inputRef}
              onChange={onSelectFile}
            />
            <Stack direction="row"
                   justifyContent={"flex-end"}
                   sx={{mt: 2, mb: 1}}>
              {inquiry?.answer != null ? <></> : <Button
                  onClick={() => inputRef.current.click()}
                  size='small'
                  variant="contained"
                  startIcon={<PlusIcon/>}
                  sx={{minWidth: '120px', height: '40px', mr: 2, p: 1}}>
                {t('button_add_file')}
              </Button>}
              {inquiry?.answer != null ? <></>
                : <>
                  {inquiry?.id ? <>
                    <Button
                        onClick={onPatch}
                        size='small'
                        color="primary"
                        variant="contained"
                        startIcon={<SaveIcon/>}
                        sx={{width: '100px', height: '40px', mr: 2, p: 0.3}}
                    >
                      {t('button_correction')}
                    </Button>
                  </> : <>
                    <Button
                        onClick={onSave}
                        size='small'
                        color="primary"
                        variant="contained"
                        startIcon={<SaveIcon/>}
                        sx={{width: '100px', height: '40px', mr: 2, p: 0.3}}
                    >
                      {t('button_save')}
                    </Button>
                  </>}
                </>}
              <Button
                  onClick={() => onDelete(inquiry?.id)}
                  size='small'
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon/>}
                  sx={{width: '100px', height: '40px', mr: 0.5, p: 0.3}}
              >
                {t("button_delete")}
              </Button>
            </Stack>
          </Box>
        </>
      </InquiryDrawerMobile>
    );
  }


InquiryDrawer.propTypes ={
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  // @ts-ignore
  inquiry: PropTypes.object
}