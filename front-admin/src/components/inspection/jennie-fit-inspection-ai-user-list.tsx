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
import {ImageInListWidget} from "../widgets/image-widget";
import {JennieFitAssignmentModel} from "../../types/jennie-fit-assignment-model";
import {jennieFitUserAssignmentApi} from "../../api/jennie-fit-user-assignment-api"

interface ListProps {
    lists: JennieFitAssignmentModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    refreshList?: () => void;
    selectedLists?: JennieFitAssignmentModel[],
    selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
    selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: JennieFitAssignmentModel) => void;
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
        let userDressIds = items.map(item => {
            return item.userDressId
        })

        let body={ids,userDressIds, changeMessage}
        const result = await jennieFitUserAssignmentApi.patchWorkStatus(body, 'REJECTED' );

        if (result === 204) {
            toast.success('반려되었습니다.');
        }
        onClose(true);
    };

    const changeChangeMessage = (value) => {
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
                                onChange={e=> {changeChangeMessage(e.target.value)}}
                            >
                                <MenuItem value={'avatar fit'}>아바타 피팅결과</MenuItem>
                                <MenuItem value={'image taken screen'}>화면을 찍은 이미지 불가</MenuItem>
                                <MenuItem value={'original mask'}>original mask</MenuItem>
                                <MenuItem value={'warp mask'}>warp mask</MenuItem>
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
        const userDressIds=[]
        const changeMessage = 'COMPLETED'
        items.map(item => {
            ids.push(item.id)
        })

        items.map(item => {
            ids.push(item.id)
            userDressIds.push(item.userDressId)
        })

        let body={ids,userDressIds, changeMessage}

        const result = await jennieFitUserAssignmentApi.patchWorkStatus(body, 'COMPLETED' );
        if (result === 204) {
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

export const JennieFitInspectionAiUserList: FC<ListProps> = (props) => {

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

    const [selectedLists, setSelectedLists] = useState<JennieFitAssignmentModel[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

    const [open, setOpen] = React.useState(false);
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
        item: JennieFitAssignmentModel
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
        } else {
            if(selectedLists.filter(v => {
                return v.status == 'REJECTED';
            }).length > 0) {
                toast.error('반려 상품은 승인할 수 없습니다.')
                return;
            }
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
                <Table sx={{ minWidth: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllLists}
                                    onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell align={'center'}>
                                이미지
                            </TableCell>
                            <TableCell align={'center'}>
                                Dress ID
                            </TableCell>
                            <TableCell align={'center'}>
                                옷정보
                            </TableCell>
                            <TableCell align={'center'}>
                                제니핏 카테고리
                            </TableCell>
                            <TableCell align={'center'}>
                                카테고리
                            </TableCell>
                            <TableCell align={'center'}>
                                SEG.IMAGE
                            </TableCell>
                            <TableCell align={'center'}>
                                ORIGINAL + MASK
                            </TableCell>
                            <TableCell align={'center'}>
                                ORIGINAL MASK IMAGE
                            </TableCell>
                            <TableCell align={'center'}>
                                WARP IAMGE
                            </TableCell>
                            <TableCell align={'center'}>
                                아바타 피팅
                            </TableCell>
                            <TableCell align={'center'}>
                                검수 상태
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
                            console.log(item);
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
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
                                        <TableCell>
                                            <ImageInListWidget imageName={item.userDressId}
                                                               imageUrl={item.originalImageUrl} />
                                        </TableCell>
                                        <TableCell>
                                            {item.userDressId}
                                        </TableCell>
                                        <TableCell>
                                            <Typography >실루엣: {item.silhouetteType}</Typography>
                                            <Typography >소매기장: {item.sleeveType}</Typography>
                                            <Typography >총기장: {item.lengthType}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item.categoryConcat}
                                        </TableCell>
                                        <TableCell>
                                            {getDataContextValue(dataContext, 'CATEGORY_MAP', item.categoryId, 'path')}
                                        </TableCell>
                                        <TableCell>
                                            <ImageInListWidget imageName={item.userDressId}
                                                               imageUrl={item.mainImageUrl} />
                                        </TableCell>
                                        <TableCell>
                                            <ImageInListWidget imageName={item.userDressId}
                                                               imageUrl={item.maskLayeredImageUrl} />
                                        </TableCell>
                                        <TableCell>
                                            <ImageInListWidget imageName={item.userDressId}
                                                               imageUrl={item.maskImageUrl} />
                                        </TableCell>
                                        <TableCell>
                                            <ImageInListWidget imageName={item.userDressId}
                                                               imageUrl={item.putOnImageUrl} />
                                        </TableCell>
                                        <TableCell sx={{backgroundColor : '#ADA9A9' }}>
                                            <ImageInListWidget imageName={item.userDressId}
                                                               imageUrl={item.putOnPreviewImageUrl}
bgColor={'#ADA9A9'} />
                                        </TableCell>
                                        <TableCell>
                                            {dataContext.ASSIGN_STATUS[item.status]}
                                        </TableCell>
                                        <TableCell>
                                            {item.workerName}
                                        </TableCell>
                                        <TableCell>
                                            {item.workStartDay}
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

JennieFitInspectionAiUserList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    refreshList: PropTypes.func,
};