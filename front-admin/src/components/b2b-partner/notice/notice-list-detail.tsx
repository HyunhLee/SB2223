import {
    Box,
    Grid,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {Scrollbar} from "../../scrollbar";
import React, {Fragment} from "react";
import moment from "moment/moment";
import {useRouter} from "next/router";
import PushPinIcon from '@mui/icons-material/PushPin';

const NoticeListDetail = (props) => {
    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage
    } = props;
    const router = useRouter();

    const handleMoveToPage = (id) =>{
        router.push(`/b2b-partner/notice/correction-notice?id=${id}`);
    }

    return (
        <div>
            <Stack sx={{justifyContent: 'space-between'}}
                   direction={'row'}>
                <Box>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center'}}>
                        <Typography>총 {count} 건 </Typography>
                    </Grid>
                </Box>
                <TablePagination
                    component="div"
                    count={count}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10, 15, 25]}
                    showFirstButton
                    showLastButton
                />
            </Stack>
            <Scrollbar>
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                            </TableCell>
                            <TableCell align="center">
                                ID
                            </TableCell>
                            <TableCell align="center">
                                제목
                            </TableCell>
                            <TableCell align="center">
                                등록자
                            </TableCell>
                            <TableCell align="center">
                                등록일
                            </TableCell>
                            {/*<TableCell align="center">*/}
                            {/*    상단고정여부*/}
                            {/*</TableCell>*/}
                            <TableCell align="center">
                                상단고정일
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists?.map((item) => {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow sx={{backgroundColor: item.topFix == 1 && moment(new Date()).format('YYYY-MM-DD') <= moment(item.fixEndDate).format('YYYY-MM-DD') && moment(new Date()).format('YYYY-MM-DD') >= moment(item.fixStartDate).format('YYYY-MM-DD') ? '#FFFF8F' : ''}}
                                           hover>
                                        <TableCell align={'center'}>
                                            {item.topFix == 1 ?
                                                <PushPinIcon color={'error'}
fontSize={'small'}
sx={{mt:1}} />
                                                :
                                                <></>
                                            }
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.id}
                                        </TableCell>
                                        <TableCell sx={{width: '500px'}}
                                                   align={'center'}
                                                   onClick={() => handleMoveToPage(item.id)}>
                                            <Link sx={{cursor: 'pointer'}}>
                                                {item.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.createdBy}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {moment(item.createdDate).format('YYYY-MM-DD')}
                                        </TableCell>
                                        {/*<TableCell align={'center'}>*/}
                                        {/*    {item.topFix == 1 ? 'Y' : 'N'}*/}
                                        {/*</TableCell>*/}
                                        <TableCell align={'center'}>
                                            {item.fixStartDate ? `${moment(item.fixStartDate).format('YYYY-MM-DD')} ~ ${moment(item.fixEndDate).format('YYYY-MM-DD')}` : ''}
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
                rowsPerPageOptions={[10, 15, 25]}
                showFirstButton
                showLastButton
            />
        </div>
    )
};

export default NoticeListDetail;