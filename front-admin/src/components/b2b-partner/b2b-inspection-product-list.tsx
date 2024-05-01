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
} from "@mui/material";
import {getDataContextValue} from "../../utils/data-convert";
import React, {ChangeEvent, Fragment, useContext, useState} from "react";
import toast from "react-hot-toast";
import {Scrollbar} from "../scrollbar";
import {ImageInListWidget} from "../widgets/image-widget";
import {DataContext} from "../../contexts/data-context";
import moment from "moment";
import {btbJennieFitProductAssignmentApi} from "../../b2b-partner-api/b2b-jennie-fit-assignment-api";


const RejectDialog = (props) => {
    const {items, onClose, open, cancelDialog} = props;
    let reason: string[] = ['메인이미지 부적합', '아바타 피팅이미지 부적합']

    const [changeMessage, setChangeMessage] = useState<string>('메인이미지 부적합');


    const handleCancel = () => {
        cancelDialog(true);
        onClose(false);
    };


    const handleSave = async () => {
        let data = {
            ids: [],
            changeMessage: changeMessage,
            jennieFitAssignmentStatus: 'Rejected'
        }

        if (changeMessage === '') {
            toast.error('반려 사유를 선택해주세요.');
            return true;
        }

        items.map(item => {
            return data.ids.push(item.id)
        })

        console.log(data, 'data')
        const result = await btbJennieFitProductAssignmentApi.patchJennieFitInspectionStatus(data)
        if (result === 200) {
            toast.success('반려되었습니다.');
        }
        cancelDialog(false);
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
                                sx={{minWidth: 300}}
                                fullWidth={true}
                                value={changeMessage}
                                onChange={e => {
                                    changeDescription(e.target.value)
                                }}
                            >
                                {reason.map(text => {
                                    return (<MenuItem value={text}
                                                      key={text}>{text}</MenuItem>)
                                })}
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
    const {items, onClose, open, cancelDialog} = props;

    const handleCancel = () => {
        cancelDialog(true);
        onClose(false);
    };

    const handleSave = async () => {
        let data = {
            ids: [],
            jennieFitAssignmentStatus: 'Completed',
            changeMessage: 'Completed',
        }

        items.map(item => {
            return data.ids.push(item.id);
        })

        const result = await btbJennieFitProductAssignmentApi.patchJennieFitInspectionStatus(data)
        if (result === 200) {
            toast.success('승인되었습니다.');
        }
        cancelDialog(false);
        onClose(true);
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {width: 600, maxHeight: 700}}}
            maxWidth="xs"
            open={open}
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

const B2bInspectionProductList = (props) => {
    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        reload,
    } = props;

    const dataContext = useContext(DataContext);
    const [openReject, setOpenReject] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedLists, setSelectedLists] = useState<any[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);
    const [cancelDialog, setCancelDialog] = useState<boolean>(false);

    const handleSelectAllLists = () => {
        if (selectedAllLists) {
            setSelectedAllLists(false);
            setSelectedLists([]);
        } else {
            setSelectedAllLists(true);
            setSelectedLists(lists);
        }
    };

    const handleSelectOneList = (
        _event: ChangeEvent<HTMLInputElement>,
        item: any
    ): void => {
        setSelectedAllLists(false)
        if (!selectedLists.includes(item)) {
            setSelectedLists((prevSelected) => [...prevSelected, item]);
        } else {
            setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== item));
        }
    };

    const handleClickReject = () => {
        if (selectedLists.length === 0) {
            toast.error('선택된 내역이 없습니다.');
            return;
        }
        setOpenReject(true);
    };

    const handleClickComplete = async () => {
        if (selectedLists.length < 1) {
            toast.error('선택된 내역이 없습니다.');
            return;
        } else {
            if(selectedLists.filter(v => {
                return v.jennieFitAssignmentStatus == 'Rejected';
            }).length > 0) {
                toast.error('반려 상품은 승인할 수 없습니다.')
                return;
            }
        }
        setOpenConfirm(true);
    }

    const handleUrl = (url) => {
        return window.open(url, '-blank');
    }

    const handleCloseConfirm = () => {
        reload();
        if (cancelDialog) {
            setSelectedLists([]);
            setSelectedAllLists(false);
        }
        setOpenConfirm(false);
    };

    const handleCloseReject = () => {
        reload();
        if (cancelDialog) {
            setSelectedLists([]);
            setSelectedAllLists(false);
        }
        setOpenReject(false);
    };


    return (
        <>
            <Stack sx={{justifyContent: 'space-between'}}
                   direction={'row'}>
                <Box>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center'}}>
                        <Typography variant="h6"> 총 {count} 건</Typography>
                        <Stack direction='row'
                               sx={{ml: 2}}>
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
                        </Stack>
                    </Grid>
                </Box>
                <TablePagination
                    component="div"
                    count={count}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[20, 40, 60]}
                    showFirstButton
                    showLastButton
                />
            </Stack>
            <Scrollbar>
                <Table sx={{maxWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllLists || selectedLists.length == 20}
                                    onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell align={'center'}>
                                제니FIT ID
                            </TableCell>
                            <TableCell align={'center'}>
                               상품ID
                            </TableCell>
                            <TableCell align={'center'}>
                                이미지
                            </TableCell>
                            <TableCell sx={{width: 200}}
                                       align={'center'}>
                                상품명
                            </TableCell>
                            <TableCell align={'center'}>
                                브랜드
                            </TableCell>
                            <TableCell align={'center'}>
                                카테고리
                            </TableCell>
                            <TableCell align={'center'}>
                                컬러
                            </TableCell>
                            <TableCell sx={{maxWidth: 100}}
                                       align={'center'}>
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
                                생성타입
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
                                    <TableRow hover
                                              key={item.id}>
                                        <TableCell>
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
                                            {item.productId}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            <ImageInListWidget imageName={item.id}
                                                               imageUrl={item.fitRefImageUrl}/>
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.nameKo}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item?.brandName}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.categoryIds ? getDataContextValue(dataContext, 'CATEGORY_MAP', item.categoryIds[item.categoryIds.length - 1], 'path') : ''}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.productColor.colorName}
                                        </TableCell>
                                        <TableCell sx={{maxWidth: 100}}
                                                   align={'center'}>
                                            <Button variant='outlined'
                                                    onClick={() => handleUrl(item.detailSiteUrl)}>URL</Button>
                                        </TableCell>
                                        <TableCell sx={{backgroundColor: '#ADA9A9'}}
                                                   align={'center'}>
                                            <ImageInListWidget imageName={item.id}
                                                               imageUrl={item.productColor.mainImageUrl}/>
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            <ImageInListWidget imageName={item.id}
                                                               imageUrl={item.productColor.putOnImageUrl}/>
                                        </TableCell>
                                        <TableCell sx={{backgroundColor: '#ADA9A9'}}
                                                   align={'center'}>
                                            <ImageInListWidget imageName={item.id}
                                                               imageUrl={item.productColor.putOnPreviewImageUrl}
                                                               bgColor={'#ADA9A9'}/>
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {dataContext.BTB_ASSIGN_STATUS[item?.jennieFitAssignmentStatus]}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.workerName}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {dataContext.BTB_REGISTRATION_TYPE[item?.registrationType]}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {moment(item.workStartDay).format('YYYY-MM-DD')}
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            )
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
                rowsPerPageOptions={[20, 40, 60]}
                showFirstButton
                showLastButton
            />
            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                items={selectedLists}
                cancelDialog={setCancelDialog}
            />
            <RejectDialog
                open={openReject}
                onClose={handleCloseReject}
                items={selectedLists}
                cancelDialog={setCancelDialog}
            />
        </>
    )
}

export default B2bInspectionProductList;