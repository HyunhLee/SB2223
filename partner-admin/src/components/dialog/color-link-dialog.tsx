import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Stack,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Divider, TextField, Input, InputAdornment, IconButton, useMediaQuery, Theme
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {DataContext} from "../../contexts/data-context";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {ColorDialog} from "./dialogs";
import {Plus as PlusIcon} from '../../icons/plus';
import CloseIcon from "@mui/icons-material/Close";
import {typeApi} from "../../api/type-api";
import toast from "react-hot-toast";
import {getDataContextValue} from "../../utils/data-convert";
import {cafe24ProductApi} from "../../api/cafe24-product-api";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SaveIcon from "@mui/icons-material/Save";


const ColorSettingDetail = (props) =>{
  const {
    totalColorList,
    setTotalColorList,
    setAddMoreColor,
    colorListForSave,
    setColorListForSave,
  } =props;

  let colorList = colorListForSave;
  let totalColorListArr = totalColorList;
  const dataContext = useContext(DataContext);
  const width = 200;
  const {t} = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [openColorDialog, setOpenColorDialog] = useState(false)
  //해당 idx 번호를 얻기 위해사
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [modifiedBtnIndex, setModifiedBtnIndex] = useState([]);

  useEffect(() => {
   if(totalColorList.length > 0){
     setIsLoading(false)
   }else{
     setIsLoading(true)
   }
  },[totalColorList])

  const handleOnChange = (props, value, idx) => {
    if(props == 'colorName'){
      let changeArr = totalColorList.map(((v, i) => i == idx ? {...v,colorName:value
      } : v));
      setTotalColorList([...changeArr])
      setColorListForSave(changeArr.filter((v) => v.id == null));
    }else{
        let changeArr = totalColorList.map(((v, i) => i == idx ? {...v,colorHex:value
        } : v));
        setTotalColorList([...changeArr])
        setColorListForSave(changeArr.filter((v) => v.id == null));
     // }
    }
  }
  const handleColorClose = (value) => {
    if (value) {
      const temp = totalColorListArr.filter((v) => v.baseColorName === value.name)
        let changeArr = totalColorListArr.map(((v, i) => i == selectedIdx ? {...v, baseColorName:value.name} : v));
        setTotalColorList([...changeArr])
        setColorListForSave(changeArr.filter((v) => v.id == null));
    }
    setOpenColorDialog(false)
  }

  const handleClickClear = (idx) => {
    let changeArr = totalColorListArr.map(((item, i) => i == idx ? {...item, baseColorName: ""} : item));
    setTotalColorList([...changeArr])
    setColorListForSave(changeArr.filter((v) => v.id == null));
  };

  const handleDeleteBox = async (idx) =>{
    setAddMoreColor(false);
      let listArr = totalColorList
      let temp = listArr.filter((item, i) => i !== idx)
      setTotalColorList(temp)
      let forSave = temp.filter((value) => value.id == null);
      setColorListForSave([...forSave])
  }


  const handleDeleteColorData = async (id) => {
    if(window.confirm(`${t("components_dialog_colorLinkDialog_delete_confirm")}`)){
      const result = await typeApi.deleteColorType(id);
      if(result == 204){
        toast.success(`${t("components_dialog_colorLinkDialog_delete_success")}`);
        let listArr = totalColorList
        let temp = listArr.filter((item, i) => item.id !== id)
        setTotalColorList(temp)
      }
    }else{
      return;
    }

  }

  const handleModifyColorData = async (data, idx) => {
    if(data.id != null && data.baseColorName != '' && data.colorName != ''){
      let modifiedColor = modifiedBtnIndex.filter((item) => item != idx)
      let temp = totalColorList.map((v) => v.colorName.toLowerCase())
      let checkDuplicate = temp.filter((v) => v == data.colorName.toLowerCase())
      if(checkDuplicate.length > 1){
        window.confirm(`${t("components_dialog_colorLinkDialog_duplicate_warning")}`);
        return;
      }
      const response = await typeApi.modifyColorType(data);
      if(response == 200 ){
        setModifiedBtnIndex(modifiedColor)
        toast.success(`${t("components_dialog_colorLinkDialog_modify_success")}`);
      }
    }else{
      window.confirm(`${t("components_dialog_colorLinkDialog_warning")}`);
      return;
    }

  }

  return (
    <>
      <Stack>
        <Box sx={{display: 'flex', mb: 1.5}}>
          <Typography sx={{width:  width, mr: 3, ml: 5}}>{t("components_dialog_colorOrderDialog_colorName")}</Typography>
          {/*<Typography sx={{width: width, mr: 3, ml: 5}}>{t("components_dialog_colorOrderDialog_colorHex")}</Typography>*/}
          <Typography sx={{width: width, mr: 3, ml: 6}}>{t("components_dialog_colorOrderDialog_styleBotColor")}</Typography>
        </Box>
        <Divider sx={{border: '1px solid #000'}}/>
        <Stack sx={{overflow: 'auto', maxHeight: 600, paddingBottom: 15,}}>
          {isLoading ? <><Stack sx={{textAlign: 'center', mt: 3}}>{t('label_loading')}</Stack></>
          :
          <>
          {totalColorList.map((color, idx) => {
            return(
              <>
                <Box sx={{border: '1px solid #efefef', py: 1, height: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} key={color.id}>
                  <Stack direction={'row'} sx={{width: 680}}>
                    <TextField
                      id='shopColor'
                      value={color.colorName || ''}
                      placeholder={`${t("components_dialog_colorLinkDialog_colorName_placeholder")}`}
                      sx={{width: width + 50, mt:0.5, ml:3, mr: 3, "& input::placeholder": { fontSize: "13px"},}}
                      onChange={(e) => handleOnChange('colorName', e.target.value, idx)}
                    />
                    {/*<TextField*/}
                    {/*  value={color.colorHex || ''}*/}
                    {/*  placeholder={`${t("components_dialog_colorLinkDialog_colorHex_placeholder")}`}*/}
                    {/*  sx={{width: width + 50, mt:0.5, mr: 3}}*/}
                    {/*  onChange={(e) => handleOnChange('colorHex', e.target.value, idx)}*/}
                    {/*/>*/}
                    <Stack
                      direction='row'
                    >
                      <Input
                        id="standard"
                        type='text'
                        value={color.baseColorName || ''}
                        readOnly={true}
                        disabled={true}
                        sx={{height: 50}}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              sx={{p: 0}}
                              onClick={() => {
                                handleClickClear(idx)
                                setModifiedBtnIndex( prv => [...prv, idx])
                              }}
                            >
                              <ClearIcon/>
                            </IconButton>
                            <IconButton
                              sx={{p: 0}}
                              onClick={() => {
                                setOpenColorDialog(true)
                                setModifiedBtnIndex( prv => [...prv, idx])
                                setSelectedIdx(idx);
                              }}
                            >
                              <SearchIcon/>
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Stack>
                  </Stack>
                  <Stack>
                    {color.id != null ?
                      <Stack direction='row'>
                        <Button
                          variant={modifiedBtnIndex.includes(idx) ? 'contained' : 'outlined'}
                          onClick={() => { handleModifyColorData(color, idx)}}
                          sx={{mr: 1, fontSize: 12}}> {t("button_correction")}</Button>
                        <Button
                          color='error'
                          variant='outlined'
                          sx={{fontSize: 12, mr: 1}}
                          onClick={() => {
                            setSelectedIdx(idx);
                            handleDeleteColorData(color.id)}
                          }
                        >삭제</Button>
                      </Stack>
                      :
                      <IconButton
                        sx={{mt:1.5, mr: 1}}
                        onClick={() => {
                          setSelectedIdx(idx);
                          handleDeleteBox(idx)
                        }}
                      >
                        <ClearIcon/>
                      </IconButton>}
                  </Stack>
                  <ColorDialog
                    keepMounted
                    open={openColorDialog}
                    onClose={handleColorClose}
                    items={dataContext.COLOR}
                    value={color.baseColorName}
                  />
                </Box>
              </>
            )
          })}
          </>
          }

        </Stack>
      </Stack>
    </>
  )
};
const ColorLinkDialog = (props) => {
  const {open, onClose, setOpenColorSetting} = props;
  const {t} = useTranslation();
  const _mallId = localStorage.getItem('mallId');

  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const alignWidth = mdUp ? 1200 : 900 ;


  //저장된 컬러리스트 + 새로 더해질 컬러리스트
  const [totalColorList, setTotalColorList] = useState([]);
  //저장된 컬러리스트
  const [savedColorList, setSavedColorList] = useState([{colorName: '', colorHex: '', baseColorName: '', mallId: _mallId},])
  const [colorListForSave, setColorListForSave] = useState([])
  const [addMoreColor, setAddMoreColor] = useState(true);

  useEffect(() => {
    if(open){
      getColorData();
      setAddMoreColor(true);
    }
  },[open])

  const getColorData = async () => {
    const response = await typeApi.getColorType();
    if(response.length == 0){
      getCafe24ColorsList();
    }else{
      setSavedColorList(response);
      setTotalColorList(response);
    }

  }

  const getCafe24ColorsList = async () => {
    const response = await cafe24ProductApi.getCafe24Colors();
    const optionTextArray = [];
    response.forEach(color => {
        optionTextArray.push(color.value);
      });

    if(optionTextArray.length > 1){
      optionTextArray.map((value) => {
        setTotalColorList((prv) => [...prv, {colorName: value, colorHex: '', baseColorName: '', mallId: _mallId}])
      })
    }
    setAddMoreColor(false);
  }

  const close = () => {
    onClose();
    setColorListForSave([]);
    if(totalColorList.length > 1){
      setTotalColorList([])
    }
  }

  const handleComplete = async () =>{
    let savedList = savedColorList.map((v) => v.colorName.toLowerCase());

    let temp = colorListForSave.map((v) => v.colorName == '' ||v.baseColorName =='' ? true : false)
    if(temp.includes(true)){
      window.confirm(`${t("components_dialog_colorLinkDialog_checkBlank_warning")}`);
      return
    }else{
      let checkDuplicate = colorListForSave.filter((v) => savedList.includes(v.colorName.toLowerCase()));
      if(checkDuplicate.length != 0){
        window.confirm(`${t("components_dialog_colorLinkDialog_colorName_duplicate_warning")}`)
        return;
      }else{
        const result = await typeApi.postColorType(colorListForSave);
        if(result == 200){
          toast.success(`${t("components_dialog_colorLinkDialog_confirm")}`)
          setAddMoreColor(true);
          setColorListForSave([])
          onClose();
        }
      }
    }
  }

  const handleAddBtn = () => {
    const addColor = [{colorName: '', colorHex: '', baseColorName: '', mallId: _mallId}]
    setAddMoreColor(false);
    let newList = [...colorListForSave, ...addColor]
    setColorListForSave(newList)
    setTotalColorList((prev) => [...prev, ...addColor])
  }


  return (
    <>
      <Dialog sx={{'& .MuiDialog-paper': {minWidth: alignWidth, maxHeight: 700}}}
              open={open} onClose={close}>
        <DialogTitle>
          <Stack direction='row' sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
            <Typography variant={'h5'}>{t("components_dialog_colorLinkDialog_title")}</Typography>
            <IconButton
              component="span"
              sx={{mr: 0.7, p: 0.3, fontSize: 12}}
              onClick={close}
            >
              <CloseIcon/>
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{overflow: 'hidden'}}>
          <ColorSettingDetail
            savedColorList={savedColorList}
            getColorData={getColorData}
            totalColorList={totalColorList}
            setTotalColorList={setTotalColorList}
            setAddMoreColor={setAddMoreColor}
            colorListForSave={colorListForSave}
            setColorListForSave={setColorListForSave}
          />
        </DialogContent>
        <DialogActions>
          <Stack direction={'column'} sx={{width: '100%', ml:2, mr: 2 }}>
          <Stack sx={{ml:0, mt:3, width: '100%', display: 'flex', alignItems: 'center', padding: 0, margin:0}} direction='row'>
            <IconButton sx={{ml:-1, mr: -0.5}}>
              <ErrorOutlineOutlinedIcon color="primary" sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography sx={{fontSize: 12, color: 'gray'}}>{t('components_dialog_colorLinkDialog_tooltip_add_color')}</Typography>
          </Stack>
          <Stack sx={{width: '100%', display: 'flex', justifyContent: 'space-between', mt: -2, mb:1}} direction='row'>
          <Button
              onClick={handleAddBtn}
              startIcon={<PlusIcon fontSize="small"/>}
              sx={{mt: 2}}
              disabled={addMoreColor}
              variant='contained'>{t("button_add_color")}</Button>
          <Button
              onClick={handleComplete}
              disabled={addMoreColor || colorListForSave.length == 0}
              startIcon={<SaveIcon fontSize="small"/>}
              sx={{mt: 2}}
              variant='contained'>{t("button_toSave")}</Button>
          </Stack>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  )

}

export default ColorLinkDialog;