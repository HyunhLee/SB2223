import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {Scrollbar} from "../scrollbar";
import React, {Fragment, useState} from "react";
import {getDate, stateDay} from "../../utils/data-convert";
import EventDetailCorrection from "./event-detail-correction";
import DeleteIcon from "@mui/icons-material/Delete";


const DetailCorrectionDialog = (props) => {
    const {open, item, onClose, getEventList} = props;

    const handleCancel = () => {
        onClose();
    };

    return (
        <>
        <Dialog open={open}
                sx={{'& .MuiDialog-paper': {maxHeight: 900}}}
                maxWidth="lg"
                fullWidth={true}>
            <DialogActions>
            </DialogActions>
            <DialogContent>
               <EventDetailCorrection popupInfo={item}
onClose={onClose}
getEventList={getEventList}/>
            </DialogContent>
            <DialogActions>
                <Button color="error"
                        variant="contained"
                        onClick={handleCancel}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export const EventList = (props) =>{
    const {
        lists,
        count,
        getEventList,
        handleSelectAllLists,
        selectedLists,
        selectedAllLists,
        handleSelectOneList,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        handleDelete,
    } = props;

    const [event, setEvent] = useState();
    const [openDetailDialog, setOpenDetailDialog] = useState(false)

    const handleClick = (item) => {
        setEvent(item)
        setOpenDetailDialog(true)
    }

    const handleClose = () => {
        setOpenDetailDialog(false);
        setEvent(null);
        getEventList();
    };

    const getStatus = (start, end) => {
        const get = () => {
            return `${stateDay(start)}` < '0' ? '전시 중' : "전시 예정"
        }
        return `${stateDay(end)}` < '0' ? '전시 종료' :  get()
    }

    return(
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant='h6'>총 {count} 건</Typography>
                </Grid>
                <Button sx={{mb: 3}}
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon/>}
                        size="small"
                        onClick={handleDelete}>
                    삭제
                </Button>
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
            <Scrollbar>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllLists}
                                    onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                ID
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                TITLE
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                게시 기간 및 시간
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center'}}>
                                전시상태
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists.map((item) => {
                            const isListSelected = selectedLists.includes(item.id);
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
                                                        item.id
                                                    )}
                                                    value={isListSelected}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {item.id}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }}
                                                onClick={() => handleClick(item)}
                                            >
                                                {item.title}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {`${getDate(item.startDate)} ~ ${getDate(item.expireDate)}`}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {getStatus(item.startDate, item.expireDate)}
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
                rowsPerPageOptions={[20, 40, 60]}
                showFirstButton
                showLastButton
            />
            <DetailCorrectionDialog open={openDetailDialog}
onClose={handleClose}
item={event}
getEventList={getEventList}/>
        </>
    )
}

