import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import {Scrollbar} from "../scrollbar";
import {getDataContextValue, getDate, getNumberComma} from "../../utils/data-convert";
import {
  DataContext,
  JennieFitAiForthItems,
  JennieFitAiThirdItems,
  renderDescription
} from "../../contexts/data-context";
import {UserDressModel} from "../../types/user-dress-model";
import SearchIcon from "@mui/icons-material/Search";
import {CategoryDialog, ColorDialog, JennieFitAiDialog, PatternDialog} from "../dialog/category-dialog";
import _ from "lodash";
import toast from "react-hot-toast";
import {userDressApi} from "../../api/user-dress-api";
import {ImageInListWidget} from "../widgets/image-widget";

interface ListProps {
  lists: UserDressModel[];
  count: number;
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  refreshList?: () => void;
  selectedLists?: UserDressModel[],
  selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
  selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: UserDressModel) => void;
}

const PreConfirmDialog = (props) => {
  const {items, onClose, value: valueProp, open, ...other} = props;

  const dataContext = useContext(DataContext);

  const handleCancel = () => {
    onClose(false);
  };

  const handleSave = async () => {
    const body = items.map(item => {
      const categories = [];
      if (item.categoryId != null) {
        const categoryMap = dataContext.CATEGORY_MAP[item.categoryId];
        categoryMap.ids.split('/').forEach((id, index) => {
          categories.push({
            categoryId: id,
            categoryDepth: index + 1
          })
        })
      }
      return {
        id: item.id,
        categories: categories,
        categoryConcat: item.categoryConcat,
        colorType: item.colorType,
        patternType: item.patternType,
        inspectionStatus: 'PRE_COMPLETE'
      }
    })
    const result = await userDressApi.patchUserDress(body);
    if (result.length > 0) {
      toast.success('1차 검수 되었습니다.');
      onClose(true);
    }
  };

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {width: 600, maxHeight: 700}}}
          maxWidth="xs"
          open={open}
          {...other}
      >
        <DialogContent dividers>
          <Box>
            [{items.length}] 건에 대해 1차 검수 하시겠습니까?
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            취소
          </Button>
          <Button autoFocus
                  variant="contained"
                  onClick={handleSave}>
            1차 검수
          </Button>
        </DialogActions>
      </Dialog>
  );
}

const RejectDialog = (props) => {
  const {items, onClose, value: valueProp, open, ...other} = props;

  const [description, setDescription] = React.useState('');

  const handleCancel = () => {
    onClose(false);
  };

  const [desc, setDesc] = React.useState('해당 이미지는 작업이 불가능합니다. 촬영가이드를 참고해주세요.');

  const handleDescChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setDesc(event.target.value);
  }

  const handleSave = async () => {
    if (description === '') {
      toast.error('반려 사유를 선택해주세요.');
      return true;
    }
    if(description === 'RJCT07') {
      if(desc.trim() == '' || desc == '') {
        toast.error('반려 사유를 입력해주세요.');
        return;
      }
      const body = items.map(item => {
        return {
          id: item.id,
          description: desc,
          inspectionStatus: 'REJECTED'
        }
      })
      const result = await userDressApi.patchUserDress(body);
      if (result.length > 0) {
        toast.success('반려되었습니다.');
        onClose(true);
        console.log(result)
      }
    } else {
      const body = items.map(item => {
        return {
          id: item.id,
          description: description,
          inspectionStatus: 'REJECTED'
        }
      })
      const result = await userDressApi.patchUserDress(body);
      if (result.length > 0) {
        toast.success('반려되었습니다.');
        onClose(true);
      }
    }
  };

  const changeDescription = (value) => {
    setDescription(value);
  }

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {width: 600, maxHeight: 700}}}
          maxWidth="xs"
          open={open}
          {...other}
      >
        <DialogContent dividers>
          <Box>
            [{items.length}] 건에 대해 반려 하시겠습니까?
          </Box>
          <Box>
            <Stack direction="row"
                   sx={{mt: 2, mb: 1}}>
              <Stack justifyContent={"center"}
                     sx={{mr: 1, ml: 1}}>
                <FormLabel component="legend">반려 사유</FormLabel>
              </Stack>
              <Stack>
                <Select
                    size={"small"}
                    fullWidth={true}
                    value={description}
                    onChange={e=> {changeDescription(e.target.value)}}
                >
                  <MenuItem value={''}>-</MenuItem>
                  <MenuItem value={'RJCT01'}>옷걸이, 마네킹, 착용샷</MenuItem>
                  <MenuItem value={'RJCT03'}>접혀짐, 뒤틀려짐</MenuItem>
                  <MenuItem value={'RJCT11'}>잘린 이미지</MenuItem>
                  <MenuItem value={'RJCT12'}>흔들린 이미지</MenuItem>
                  <MenuItem value={'RJCT10'}>화면을 찍은 이미지</MenuItem>
                  <MenuItem value={'RJCT05'}>단추,지퍼</MenuItem>
                  <MenuItem value={'RJCT13'}>후드</MenuItem>
                  <MenuItem value={'RJCT14'}>소매 접힘</MenuItem>
                  <MenuItem value={'RJCT06'}>끈</MenuItem>
                  <MenuItem value={'RJCT04'}>택, 라벨</MenuItem>
                  <MenuItem value={'RJCT02'}>본판 훼손</MenuItem>
                  <MenuItem value={'RJCT09'}>옷의 앞면 재촬영</MenuItem>
                  <MenuItem value={'RJCT15'}>acc</MenuItem>
                  <MenuItem value={'RJCT08'}>중복</MenuItem>
                  <MenuItem value={'RJCT07'}>기타</MenuItem>
                </Select>
              </Stack>
            </Stack>
            {description == 'RJCT07' ? <Typography>
              <TextField
                  fullWidth
                  margin="normal"
                  id="answer"
                  multiline={true}
                  value={desc}
                  onChange={handleDescChange}
              />
            </Typography> : ''}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            취소
          </Button>
          <Button autoFocus
                  variant="contained"
                  onClick={handleSave}>
            반려
          </Button>
        </DialogActions>
      </Dialog>
  );
}

const ConfirmDialog = (props) => {
  const {items, onClose, value: valueProp, open, ...other} = props;

  const dataContext = useContext(DataContext);

  const handleCancel = () => {
    onClose(false);
  };

  const handleSave = async () => {
    const body = items.map(item => {
      const categories = [];
      const categoryMap = dataContext.CATEGORY_MAP[item.categoryId];
      categoryMap.ids.split('/').forEach((id, index) => {
        categories.push({
          categoryId: id,
          categoryDepth: index + 1
        })
      })

      return {
        id: item.id,
        categories: categories,
        categoryConcat: item.categoryConcat,
        colorType: item.colorType,
        patternType: item.patternType,
        inspectionStatus: 'COMPLETED'
      }
    })
    const result = await userDressApi.patchUserDress(body);
    if (result.length > 0) {
      toast.success('승인되었습니다.');
      onClose(true);
    }
  };

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {width: 600, maxHeight: 700}}}
          maxWidth="xs"
          open={open}
          {...other}
      >
        <DialogContent dividers>
          [{items.length}] 건에 대해 승인 하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            취소
          </Button>
          <Button autoFocus
                  variant="contained"
                  onClick={handleSave}>
            승인
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export const UserDressList: FC<ListProps> = (props) => {

  const {
    lists,
    count,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    refreshList,
    ...other
  } = props;

  const dataContext = useContext(DataContext);

  const [selectedLists, setSelectedLists] = useState<UserDressModel[]>([]);
  const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = React.useState<UserDressModel>(null);
  const [open, setOpen] = React.useState(false);
  const [openJennieFit, setOpenJennieFit] = React.useState(false);
  const [openColor, setOpenColor] = React.useState(false);
  const [openPattern, setOpenPattern] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);
  const [openPreConfirm, setOpenPreConfirm] = React.useState(false);

  useEffect(() => {
    setSelectedLists([]);
  }, [lists]);

  const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedAllLists(event.target.checked);
    setSelectedLists(event.target.checked
        ? lists.map((list) => list)
        : []);
  };

  const handleSelectOneList = (
      event: ChangeEvent<HTMLInputElement>,
      item: UserDressModel
  ): void => {
    const findIndex = _.findIndex(selectedLists, (listItem) => listItem.id == item.id);
    if (findIndex === -1) {
      setSelectedLists((prevSelected) => [...prevSelected, item]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((listItem) => listItem.id !== item.id));
    }
  };

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = (value) => {
    if (value) {
      checkModifyActionColor();
      selectedItem.categoryId = value.id;
    }
    setOpen(false);
  };

  const handleClickOpenJennieFit = (item) => {
    setSelectedItem(item);
    setOpenJennieFit(true);
  };

  const handleCloseJennieFit = (value) => {
    if (value) {
      checkModifyActionColor();
      selectedItem.categoryConcat = value.name;
    }
    setOpenJennieFit(false);
  };

  const handleClickOpenColor = (item) => {
    setSelectedItem(item);
    setOpenColor(true);
  };

  const handleCloseColor = (value) => {
    if (value) {
      checkModifyActionColor();
      selectedItem.colorType = value.name;
    }
    setOpenColor(false);
  };

  const handleClickOpenPattern = (item) => {
    setSelectedItem(item);
    setOpenPattern(true);
  };

  const handleClosePattern = (value) => {
    if (value) {
      checkModifyActionColor();
      selectedItem.patternType = value.name;
    }
    setOpenPattern(false);
  };

  const checkModifyActionColor = () => {
    lists.forEach(item => {
      if (item.modifyActionColor && item.modifyActionColor === '#7199f4') {
        item.modifyActionColor = '#aeaeae';
      }
    })
    selectedItem.modifyActionColor = '#7199f4';
  }

  const handleClickComplete = () => {
    if (selectedLists.length === 0) {
      toast.error('선택된 내역이 없습니다.');
      return;
    }

    let checkEmptyCategory = false;
    let checkEmptyCategoryConcat = false;
    let checkEmptyColor = false;
    let checkEmptyPattern = false;
    let checkEmptyId = -1;

    selectedLists.forEach(item => {
      console.log(item.id, item.categoryId);
      if (!checkEmptyCategory && checkEmptyId === -1 && item.categoryId == null) {
        checkEmptyCategory = true;
        checkEmptyId = item.id;
      }
      if (!checkEmptyCategoryConcat && checkEmptyId === -1 && _.isEmpty(item.categoryConcat)) {
        checkEmptyCategoryConcat = true;
        checkEmptyId = item.id;
      }
      if (!checkEmptyPattern && checkEmptyId === -1 && _.isEmpty(item.patternType)) {
        checkEmptyPattern = true;
        checkEmptyId = item.id;
      }
      if (!checkEmptyColor && checkEmptyId === -1 && _.isEmpty(item.colorType)) {
        checkEmptyColor = true;
        checkEmptyId = item.id;
      }
    })

    if (checkEmptyCategory) {
      toast.error(`ID: ${checkEmptyId}, 카테고리를 선택해주세요.`);
      return;
    }
    if (checkEmptyCategoryConcat) {
      toast.error(`ID: ${checkEmptyId}, 제니핏 카테고리를 선택해주세요.`);
      return;
    }
    if (checkEmptyColor) {
      toast.error(`ID: ${checkEmptyId},  색상을 선택해주세요.`);
      return;
    }
    if (checkEmptyPattern) {
      toast.error(`ID: ${checkEmptyId},  패턴울 선택해주세요.`);
      return;
    }
    setOpenConfirm(true);
  }

  const handleCloseConfirm = (refresh) => {
    if (refresh) {
      refreshList();
      setSelectedAllLists(false);
      setSelectedLists([]);
    }
    setOpenConfirm(false);
  };

  const handleClickReject = () => {
    if (selectedLists.length === 0) {
      toast.error('선택된 내역이 없습니다.');
      return;
    }
    setOpenReject(true);
  };

  const handleCloseReject = (refresh) => {
    if (refresh) {
      refreshList();
      setSelectedAllLists(false);
      setSelectedLists([]);
    }
    setOpenReject(false);
  };

  const handleClickPreConfirm = () => {
    if (selectedLists.length === 0) {
      toast.error('선택된 내역이 없습니다.');
      return;
    }
    setOpenPreConfirm(true);
  };

  const handleClosePreConfirm = (refresh) => {
    if (refresh) {
      refreshList();
      setSelectedAllLists(false);
      setSelectedLists([]);
    }
    setOpenPreConfirm(false);
  };

  const getBackgroundColor = (colorType) => {
    if (dataContext.COLOR_MAP[colorType]) {
      return dataContext.COLOR_MAP[colorType].rgb;
    }
  }

  const getColor = (colorType) => {
    if (colorType === 'BLACK' || colorType === 'BLUE' || colorType === 'NAVY' || colorType === 'BROWN' || colorType === 'WINE') {
      return 'rgb(255, 255, 255)'
    }
    return 'rgb(0, 0, 0)'
  }

  const getColorByPattern = (patternType) => {
    if (patternType === 'SOLID') {
      return 'rgb(0, 0, 0)'
    }
    return 'rgb(255, 255, 255)'
  }

  const renderCategoryPath = (categoryId) => {
    if (categoryId) {
      return getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId, 'path')
    }
    return '';
  }

  const renderCategoryConcat = (categoryConcat) => {
    if (categoryConcat != null) {
      return categoryConcat
    }
    return '';
  }

  let category = (selectedItem && selectedItem.categoryId) ? renderCategoryPath(selectedItem.categoryId).split('<') : null

  return (
      <div {...other}>
        <Stack sx={{justifyContent: 'space-between'}}
direction={'row'}>
          <Box>
            <Grid sx={{m: 1, display: 'flex', alignItems: 'center'}}>
              <Typography variant="h6">총 {getNumberComma(count)} 건</Typography>
              <Box sx={{ml: 1}}>
                <Button variant="outlined"
                        size="small"
                        sx={{mr: 0.5}}
                        onClick={handleClickPreConfirm}>
                  1차 검수
                </Button>
                <Button variant="outlined"
                        size="small"
                        color="error"
                        sx={{mr: 0.5}}
                        onClick={handleClickReject}>
                  반려
                </Button>
                <Button variant="contained"
                        size="small"
                        color="success"
                        onClick={handleClickComplete}>
                  승인
                </Button>
              </Box>
            </Grid>
          </Box>
          <TablePagination
              component="div"
              count={count}
              onPageChange={onPageChange}
              onRowsPerPageChange={onRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              showFirstButton
              showLastButton
          />
        </Stack>
        <Scrollbar>
          <TableContainer sx ={{minWidth: '1005'}}>
          <Table sx={{width: '1800px'}}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                      checked={selectedAllLists}
                      onChange={handleSelectAllLists}
                  />
                </TableCell>
                <TableCell align={'center'}>
                  ID
                </TableCell>
                <TableCell align={'center'}>
                  유저ID
                </TableCell>
                <TableCell align={'center'}>
                  오리지널 이미지
                </TableCell>
                <TableCell align={'center'}>
                  seg 이미지
                </TableCell>
                <TableCell align={'center'}>
                  피팅 이미지
                </TableCell>
                <TableCell align={'center'}>
                  아바타 피팅
                </TableCell>
                <TableCell align={'center'}>
                  카테고리
                </TableCell>
                <TableCell align={'center'}>
                  컬러
                </TableCell>
                <TableCell align={'center'}>
                  패턴
                </TableCell>
                <TableCell align={'center'}>
                  검수상태
                </TableCell>
                <TableCell align={'center'}>
                  등록자
                </TableCell>
                <TableCell align={'center'}>
                  등록일
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lists.map((item) => {
                const isListSelected = selectedLists.includes(item);
                return (
                    <Fragment key={item.id}>
                      <TableRow
                          hover
                          key={item.id}
                          style={{
                            backgroundColor: (item.modifyActionColor) ? item.modifyActionColor : 'inherit',
                          }}
                      >
                        <TableCell
                            padding="checkbox"
                            sx={{
                              ...(open && {
                                position: 'relative',
                                '&:after': {
                                  position: 'absolute',
                                  content: '" "',
                                  top: 0,
                                  left: 0,
                                  backgroundColor: 'primary.main',
                                  width: 3,
                                  height: 'calc(100% + 1px)'
                                }
                              })
                            }}
                            width="25%"
                        >
                          <Checkbox
                              checked={isListSelected}
                              onChange={(event) => handleSelectOneList(
                                  event,
                                  item
                              )}
                              value={isListSelected}
                          />
                        </TableCell>
                        <TableCell align={'center'}>
                          {item.id}
                        </TableCell>
                        <TableCell align={'center'}>
                          {item.userId}
                        </TableCell>
                        <TableCell align={'center'}>
                          <ImageInListWidget imageName={item.id}
                                             imageUrl={item.originalImageUrl} />
                        </TableCell>
                        <TableCell align={'center'}>
                          <ImageInListWidget imageName={item.id}
                                             imageUrl={item.mainImageUrl} />
                        </TableCell>
                        <TableCell align={'center'}>
                          <ImageInListWidget imageName={item.id}
                                             imageUrl={item.putOnImageUrl} />
                        </TableCell>
                        <TableCell align={'center'}>
                          <ImageInListWidget imageName={item.id}
                                             imageUrl={item.putOnPreviewImageUrl} />
                        </TableCell>
                        <TableCell align={'center'}>
                          <Box>
                            <Box>
                              <FormControl sx={{ m: 1, width: '35ch' }}
                                           variant="standard">
                                <Input
                                    type='text'
                                    value={renderCategoryPath(item.categoryId)}
                                    readOnly={true}
                                    onClick={(event) => { handleClickOpen(item) }}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <IconButton
                                            sx={{p: 0}}
                                            onClick={() => { handleClickOpen(item) }}
                                        >
                                          <SearchIcon />
                                        </IconButton>
                                      </InputAdornment>
                                    }
                                />
                              </FormControl>
                            </Box>
                            <Box>
                              <FormControl sx={{ m: 1, width: '35ch' }}
                                           variant="standard">
                                <Input
                                    type='text'
                                    value={renderCategoryConcat(item.categoryConcat)}
                                    readOnly={true}
                                    onClick={(event) => { handleClickOpenJennieFit(item) }}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <IconButton
                                            sx={{p: 0}}
                                            onClick={() => { handleClickOpenJennieFit(item) }}
                                        >
                                          <SearchIcon />
                                        </IconButton>
                                      </InputAdornment>
                                    }
                                />
                              </FormControl>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align={'center'}>
                          <FormControl sx={{ m: 1, width: '15ch' }}
                                       variant="standard">
                            <Input
                                type='text'
                                value={(item.colorType) ? item.colorType : ''}
                                readOnly={true}
                                onClick={(event) => { handleClickOpenColor(item) }}
                                sx={{
                                  background : getBackgroundColor(item.colorType),
                                  WebkitTextFillColor: getColor(item.colorType),
                                  '.Mui-disabled': {
                                    WebkitTextFillColor: getColor(item.colorType),
                                  }
                                }}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                        sx={{p: 0}}
                                        onClick={() => { handleClickOpenColor(item) }}
                                    >
                                      <SearchIcon />
                                    </IconButton>
                                  </InputAdornment>
                                }
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell align={'center'}>
                          <FormControl sx={{ m: 1, width: '15ch' }}
                                       variant="standard">
                            <Input
                                type='text'
                                value={(item.patternType) ? item.patternType : ''}
                                readOnly={true}
                                onClick={(event) => { handleClickOpenPattern(item) }}
                                sx={{
                                  '.Mui-disabled': {
                                    WebkitTextFillColor: getColorByPattern(item.patternType),
                                    backgroundImage : "url('/static/pattern/" + item.patternType + ".png')",
                                  }
                                }}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                        sx={{p: 0}}
                                        onClick={() => { handleClickOpenPattern(item) }}
                                    >
                                      <SearchIcon />
                                    </IconButton>
                                  </InputAdornment>
                                }
                            />
                          </FormControl>
                        </TableCell>
                        {item.inspectionStatus == 'REJECTED' && item.description != null ?
                            <TableCell align={'center'} >
                              {`${getDataContextValue(dataContext, 'INSPECTION_STATUS', item.inspectionStatus, null)} (${renderDescription(item.description)})`}
                            </TableCell> :
                            <TableCell>
                              {getDataContextValue(dataContext, 'INSPECTION_STATUS', item.inspectionStatus, null)}
                            </TableCell>
                        }
                        <TableCell align={'center'} >
                          {getDataContextValue(dataContext, 'USER_DRESS_REGISTRATION_TYPE', item.registrationType, null)}
                        </TableCell>
                        <TableCell align={'center'}>
                          {getDate(item.createdDate)}
                        </TableCell>
                      </TableRow>
                    </Fragment>
                );
              })}
            </TableBody>
            <TableHead>
              {/*<TableRow>*/}
              {/*  <TableCell padding="checkbox"*/}
              {/*             colSpan={10}>*/}
              {/*    <Checkbox*/}
              {/*        checked={selectedAllLists}*/}
              {/*        onChange={handleSelectAllLists}*/}
              {/*    />*/}
              {/*  </TableCell>*/}
              {/*</TableRow>*/}
            </TableHead>
          </Table>
          </TableContainer>
        </Scrollbar>

        <Box>
          <Grid
              container
              justifyContent="space-between"
          >
            <Grid sx={{m: 1, display: 'flex', alignItems: 'center'}}>
              <Typography variant="h6">총 {getNumberComma(count)} 건</Typography>
              <Box sx={{ml: 1}}>
                <Button variant="outlined"
                        size="small"
                        sx={{mr: 0.5}}
                        onClick={handleClickPreConfirm}>
                  1차 검수
                </Button>
                <Button variant="outlined"
                        size="small"
                        color="error"
                        sx={{mr: 0.5}}
                        onClick={handleClickReject}>
                  반려
                </Button>
                <Button variant="contained"
                        size="small"
                        color="success"
                        onClick={handleClickComplete}>
                  승인
                </Button>
              </Box>
            </Grid>
            <Grid>
              <TablePagination
                  component="div"
                  count={count}
                  onPageChange={onPageChange}
                  onRowsPerPageChange={onRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[10, 25, 50]}
                  showFirstButton
                  showLastButton
              />
              <CategoryDialog
                  parent={'STYLE'}
                  selectedLastDepth={true}
                  imageUrl={(selectedItem) ? selectedItem.originalImageUrl : null}
                  open={open}
                  onClose={handleClose}
                  category={dataContext.CATEGORY}
              />
              <JennieFitAiDialog
                  open={openJennieFit}
                  onClose={handleCloseJennieFit}
                  items={dataContext.JENNIEFIT_AI}
                  thirdItems={JennieFitAiThirdItems(category)}
                  fourthItems={JennieFitAiForthItems(category)}
                  category={category}
              />
              <ColorDialog
                  open={openColor}
                  onClose={handleCloseColor}
                  imageUrl={(selectedItem) ? selectedItem.originalImageUrl : null}
                  items={dataContext.COLOR}
              />
              <PatternDialog
                  open={openPattern}
                  onClose={handleClosePattern}
                  imageUrl={(selectedItem) ? selectedItem.originalImageUrl : null}
                  items={dataContext.PATTERN}
              />
              <ConfirmDialog
                  open={openConfirm}
                  onClose={handleCloseConfirm}
                  items={selectedLists}
              />
              <RejectDialog
                  open={openReject}
                  onClose={handleCloseReject}
                  items={selectedLists}
              />
              <PreConfirmDialog
                  open={openPreConfirm}
                  onClose={handleClosePreConfirm}
                  items={selectedLists}
              />
            </Grid>
          </Grid>
        </Box>

      </div>
  );
};

UserDressList.propTypes = {
  lists: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  refreshList: PropTypes.func,
};