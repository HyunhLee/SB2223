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
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import {Scrollbar} from "../scrollbar";
import {getDataContextValue, getNumberComma} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import _ from "lodash";
import toast from "react-hot-toast";
import {jennieFitProductAssignmentApi} from "../../handsome-api/jennie-fit-product-assignment-api";
import {ImageInListWidget} from "./image-widget";
import moment from "moment";
import {HandsomeJennieFitAssignmentModel} from "../../types/handsome-model/handsome-jennie-fit-assignment-model";

interface ListProps {
  lists: HandsomeJennieFitAssignmentModel[];
  count: number;
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  refreshList?: () => void;
  selectedLists?: HandsomeJennieFitAssignmentModel[],
  selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
  selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: HandsomeJennieFitAssignmentModel) => void;
}

const RejectDialog = (props) => {
  const {items, onClose, value: valueProp, open, ...other} = props;

  const [changeMessage, setChangeMessage] = React.useState('');

  const handleCancel = () => {
    onClose(false);
  };

  const handleSave = async () => {
    if (changeMessage === '') {
      toast.error('반려 사유를 선택해주세요.');
      return true;
    }
    // API 개발시 주석 해제
    let ids = items.map(item => {
      return item.id
    })

    let body={ids}
    const result = await jennieFitProductAssignmentApi.putItemStatus(body);

    if (result === 200) {
      toast.success('반려되었습니다.');
    }
    onClose(true);
  };

  const changeDescription = (value) => {
    setChangeMessage(value);
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
                    value={changeMessage}
                    onChange={e=> {changeDescription(e.target.value)}}
                >
                  <MenuItem value={'avatar fit'}>아바타 피팅결과</MenuItem>
                  <MenuItem value={'image taken screen'}>화면을 찍은 이미지 불가</MenuItem>
                  <MenuItem value={'original mask'}>original mask</MenuItem>
                  <MenuItem value={'warp mask'}>warp mask</MenuItem>
                  {/*<MenuItem value={'main image'}>메인 이미지</MenuItem>*/}
                  {/*<MenuItem value={'fitting image'}>피팅 이미지</MenuItem>*/}
                </Select>
              </Stack>
            </Stack>
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

  const handleCancel = () => {
    onClose(false);
  };

  const handleSave = async () => {
    const ids=[]
    items.map(item => {
      ids.push(item.id)
    })

    let body={ids}

    const result = await jennieFitProductAssignmentApi.putItemStatusApproval(body);
    if (result === 200) {
      toast.success('승인되었습니다.');
    }
    onClose(true);
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

export const HandsomeFitInspectionProductList: FC<ListProps> = (props) => {

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

  const [selectedLists, setSelectedLists] = useState<HandsomeJennieFitAssignmentModel[]>([]);
  const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [openReject, setOpenReject] = React.useState(false);

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
      item: HandsomeJennieFitAssignmentModel
  ): void => {
    const findIndex = _.findIndex(selectedLists, (listItem) => listItem.id == item.id);
    if (findIndex === -1) {
      setSelectedLists((prevSelected) => [...prevSelected, item]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((listItem) => listItem.id !== item.id));
    }
  };

  const handleClickComplete = () => {
    if (selectedLists.length === 0) {
      toast.error('선택된 내역이 없습니다.');
      return;
    }

    setOpenConfirm(true);
  }

  const handleCloseConfirm = (refresh) => {
    if (refresh) {
      refreshList();
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
      setSelectedLists([]);
    }
    setOpenReject(false);
  };

  const handleUrl = (url) => {
    return window.open(url, '-blank');
  }

  return (
      <div {...other}>
        <Stack sx={{justifyContent: 'space-between'}}
               direction={'row'}>
          <Box>
            <Grid sx={{m: 1, display: 'flex', alignItems: 'center'}}>
              <Typography variant="h6">총 {getNumberComma(count)} 건</Typography>
              <Box>
                <Button variant="outlined"
                        size="small"
                        color="error"
                        sx={{mr: 0.5, ml: 1}}
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
          <Table sx={{ maxWidth: '100%' }}>
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
                  상품번호
                </TableCell>
                <TableCell align={'center'}>
                  이미지
                </TableCell>
                <TableCell align={'center'}>
                  상품명
                </TableCell>
                <TableCell align={'center'}>
                  브랜드
                </TableCell>
                <TableCell align={'center'}>
                  카테고리
                </TableCell>
                <TableCell sx={{maxWidth: 100}}>
                  상품URL
                </TableCell>
                <TableCell align={'center'}>
                  메인이미지
                </TableCell>
                <TableCell align={'center'}>
                  피팅이미지
                </TableCell>
                <TableCell align={'center'}>
                  아바타피팅
                </TableCell>
                <TableCell align={'center'}>
                  검수상태
                </TableCell>
                <TableCell align={'center'}>
                  작업자
                </TableCell>
                <TableCell align={'center'}>
                  작업일
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
                      >
                        <TableCell
                            padding="checkbox"
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
                          {item.product.id}
                        </TableCell>
                        <TableCell align={'center'}>
                          {item.product.number}
                        </TableCell>
                        <TableCell align={'center'}>
                          <ImageInListWidget imageName={item.product.thumbnailImageUrl}
                                             imageUrl={item.product.thumbnailImageUrl} />
                        </TableCell>
                        <TableCell align={'center'}>
                          {item.product.name}
                        </TableCell>
                        <TableCell align={'center'}>
                          {item.product.brandName}
                        </TableCell>
                        <TableCell>
                          {item.product.categoryId ? getDataContextValue(dataContext, 'HANDSOME_CATEGORY_MAP', item.product.categoryId, 'path'):''}
                        </TableCell>
                        <TableCell align={'center'}>
                          <Button variant='outlined'
                                  onClick={() => handleUrl(item.product.detailSiteUrl)}>URL</Button>
                        </TableCell>
                        <TableCell sx={{backgroundColor: '#ADA9A9'}}
align={'center'}>
                          <ImageInListWidget imageName={item.product.jennieFitThumbnailImageUrl}
                                             imageUrl={item.product.jennieFitThumbnailImageUrl}/>
                        </TableCell>
                        <TableCell align={'center'}>
                          <ImageInListWidget imageName={item.putOnImageUrl}
                                             imageUrl={item.putOnImageUrl}/>
                        </TableCell>
                        <TableCell align={'center'}
sx={{backgroundColor : '#ADA9A9'}}>
                          <ImageInListWidget imageName={item.product.putOnPreviewImageUrl}
                                             imageUrl={item.product.putOnPreviewImageUrl}
bgColor={'#ADA9A9'}/>
                        </TableCell>
                        <TableCell align={'center'}>
                          {dataContext.ASSIGN_STATUS[item.product.jennieFitAssignStatus]}
                        </TableCell>
                        <TableCell align={'center'}>
                          {item.workerName}
                        </TableCell>
                        <TableCell align={'center'}>
                          {moment(item.workStartDay).format('YYYY-MM-DD')}
                        </TableCell>
                      </TableRow>
                    </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
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
      </div>
  );
};

HandsomeFitInspectionProductList.propTypes = {
  lists: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  refreshList: PropTypes.func,
};