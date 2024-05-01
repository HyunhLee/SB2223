import React, {ChangeEvent, useRef, useState} from "react";
import {NoticeDetailModel} from "../../../types/b2b-partner-model/notice-model";
import {Button, Checkbox, FormLabel, IconButton, Stack, TextField, Theme, useMediaQuery} from "@mui/material";
import {PropertyListItem} from "../../property-list-item";
import {PropertyList} from "../../property-list";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {format} from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import {fileName, formatBytes} from "../../../utils/data-convert";
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import {Plus as PlusIcon} from "../../../icons/plus";

const CreateNoticeDetail = (props) => {
  const {
        noticeModel,
        setNoticeModel,
        setDelImg,
        setFiles,
    files,
    } = props;

    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const inputRef = useRef(null);

    const [selectedImages, setSelectedImages] = useState([]);
    let arr = [...files]


    const handleCheck = (e) => {
        setNoticeModel({...noticeModel, topFix: e});
    }

    const handleChange = (prop: keyof NoticeDetailModel) => (event: ChangeEvent<HTMLInputElement>) => {
        setNoticeModel({...noticeModel, [prop]: event.target.value});
    };

    const handleChangeDate = (prop: keyof NoticeDetailModel) => (value) => {
        setNoticeModel({ ...noticeModel, [prop]: format(value, 'yyyy-MM-dd') });
    };


    const onSelectFile = (e: any) => {
        e.preventDefault();
        e.persist();

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

        if(selectedFile[0].size > 1000000){
            window.confirm('첨부파일은 10MB 이하여야합니다.');
            return
        }

      arr.push(selectedFile[0])
      //서버로 보내기 위한
      setFiles(arr);


      const fileUrlList = [selectedFile];
        for(const file of selectedFile) {
            const fileUrl = URL.createObjectURL(file);
            fileUrlList.push(fileUrl);
        }


        const selectedFileArray: any = Array.from(selectedFile);
        const imageArray = selectedFileArray.map((file: any) => {
            return {name: file.name, size: file.size};
        });

        // 첨부파일 삭제시
        setSelectedImages((previousImages: any) => previousImages.concat(imageArray));
        e.target.value = '';
    };


    const attachFile =
      selectedImages &&
      selectedImages.map((image: any, idx) => {
          return (
            <Stack key={idx}
                   direction="row"
                   sx={{width: '30%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 30, backgroundColor: '#efefef', border: '2px solid #fff'}}>
                <Button
                  sx={{"&:hover": {backgroundColor: "transparent", }}}>
                    {fileName(image.name)} ({formatBytes(image.size, 2)})
                </Button>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => setSelectedImages(selectedImages.filter((e) => e !== image))}
                ><CloseIcon sx={{ fontSize: 15 }} /></IconButton>
            </Stack>
          );
      });


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
          <Stack key={file?.id}
                 direction="row"
                 sx={{width: '30%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 30, backgroundColor: '#efefef', border: '2px solid #fff'}}>
              <Button
                sx={{"&:hover": {backgroundColor: "transparent",cursor: 'default' }}}>
                  {file.imageName}
              </Button>
              <Stack direction={'row'}>
                  {noticeModel?.id != null ?
                    <IconButton
                      onClick={() => handleDownload(file)}
                    ><DownloadIcon sx={{fontSize: 15}} /></IconButton>
                    :
                    <IconButton></IconButton>}
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setNoticeModel({...noticeModel, imageUrlList : noticeModel.imageUrlList.filter((e) => e !== file)})
                        noticeModel.imageUrlList.filter((e) => e == file ? setDelImg((prv) => [...prv, e.id]) : e)
                    }}
                  ><CloseIcon sx={{ fontSize: 15 }} /></IconButton>
              </Stack>

          </Stack>
        )
    })


    return (
        <>
            <PropertyList>
                <PropertyListItem
                    align={align}
                    label="상단 고정 여부"
                >
                    <Stack direction='row'>
                        <Stack direction='row'>
                            <Checkbox
                                sx={{mt: -1}}
                                checked={noticeModel.topFix}
                                name="direction"
                                onChange={(event): void => handleCheck(
                                    event.target.checked
                                )}
                            />
                        </Stack>
                        {noticeModel.topFix ?
                            <Stack direction='row'>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, ml: 2, mt: -1}}>
                                    <FormLabel component="legend">상단 고정일</FormLabel>
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, ml: 2, mt: -1}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={noticeModel.fixStartDate}
                                            inputFormat={"yyyy-MM-dd"}
                                            mask={"____-__-__"}
                                            onChange={handleChangeDate('fixStartDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                size={'small'}
                                                                                sx={{width: 200}}/>}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                                <Stack sx={{mr: 1, ml: 1}}>
                                    ~
                                </Stack>
                                <Stack justifyContent={"center"}
                                       sx={{mr: 2, ml: 2, mt: -1}}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={noticeModel.fixEndDate}
                                            inputFormat={"yyyy-MM-dd"}
                                            mask={"____-__-__"}
                                            onChange={handleChangeDate('fixEndDate')}
                                            renderInput={(params) => <TextField {...params}
                                                                                size={'small'}
                                                                                sx={{width: 200}}/>}
                                        />
                                    </LocalizationProvider>
                                </Stack>
                            </Stack>
                            :
                            <></>
                        }
                    </Stack>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="공지사항 제목"
                >
                        <TextField
                            fullWidth
                            id='title'
                            value={noticeModel.title}
                            placeholder={'제목을 입력해주세요'}
                            onChange={handleChange('title')}
                        />
                </PropertyListItem>
                <PropertyListItem
                  label={"첨부파일"}
                  align={align}>
                    <input
                      hidden
                      type="file"
                      ref={inputRef}
                      onChange={onSelectFile}
                    />
                    <Button
                      onClick={() => inputRef.current.click()}
                      size='small'
                      variant="contained"
                      startIcon={<PlusIcon fontSize="small" />}
                      sx={{minWidth: '120px', height: '40px', mr: 2, p: 1}}
                    >첨부파일 추가
                    </Button>
                </PropertyListItem>
                <Stack sx={{mt: 2, ml: 25, mb: 2}}>
                    {noticeModel?.imageUrlList.length !== 0 && getSavedFiles}
                    {attachFile}
                </Stack>
                <PropertyListItem
                    align={align}
                    label="공지사항 내용"
                >

                        <TextField
                            fullWidth
                            id='content'
                            value={noticeModel.contents}
                            multiline={true}
                            rows={15}
                            placeholder={'내용을 입력해주세요'}
                            onChange={handleChange('contents')}
                        />
                </PropertyListItem>
            </PropertyList>
        </>
    )
};

export default CreateNoticeDetail;