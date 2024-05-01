import {
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
import {useTranslation} from "react-i18next";
import {getNumberComma} from "../../../utils/data-convert";
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
    const {t} = useTranslation();

    const handleMoveToPage = (id) => {
        router.push(`/general/notice/correction-notice?id=${id}`);
    }

    return (
        <div>
            <Stack sx={{mt: 3, mb: 3, px: 2}}>
                <Grid
                    container
                    justifyContent="space-between"
                    spacing={3}>
                    <Typography variant='h6'>{t("label_total", {number: getNumberComma(count)})}</Typography>
                    <></>
                </Grid>
            </Stack>
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
            <Scrollbar>
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" width={'2%'} >
                            </TableCell>
                            <TableCell align="center" width={'8%'}>
                                {t("component_newApplyStoreStatus_applyStoreInfoDetail_propertyListItem_id")}
                            </TableCell>
                            <TableCell align="center" width={'66%'}>
                                {t("pages_general_noticeList_formLabel_title")}
                            </TableCell>
                            <TableCell align="center" width={'12%'}>
                                {t("components_general_noticeListDetail_createdBy")}
                            </TableCell>
                            <TableCell align="center" width={'12%'}>
                                {t("pages_general_noticeList_formLabel_date")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists?.map((item) => {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        sx={{backgroundColor: item.topFix == 1 && moment(new Date()).format('YYYY-MM-DD') <= moment(item.fixEndDate).format('YYYY-MM-DD') && moment(new Date()).format('YYYY-MM-DD') >= moment(item.fixStartDate).format('YYYY-MM-DD') ? '#FFFF8F' : ''}}
                                        hover>
                                        <TableCell align={'center'}>
                                            {item.topFix == 1 ?
                                                <PushPinIcon color={'error'}
                                                             fontSize={'small'}
                                                             sx={{mt: 1}}/>
                                                :
                                                <></>
                                            }
                                        </TableCell>
                                        <TableCell align={'center'} >
                                            {item.id}
                                        </TableCell>
                                        <TableCell sx={{ cursor: 'pointer'}}
                                                   align={'left'}
                                                   onClick={() => handleMoveToPage(item.id)}>
                                            {item.title}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {`${t("label_manager")}`}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {moment(item.createdDate).format('YYYY-MM-DD')}
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
                {lists.length == 0 &&  <><Stack sx={{width: '100%', textAlign:'center', mt: 5, mb:5}}>{t('warning_empty_result')}</Stack></>}
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