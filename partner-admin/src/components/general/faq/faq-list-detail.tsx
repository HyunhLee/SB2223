import {useRouter} from "next/router";
import React, {Fragment, useContext} from "react";
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
import moment from "moment";
import {useTranslation} from "react-i18next";
import {getNumberComma} from "../../../utils/data-convert";
import {DataContext} from "../../../contexts/data-context";

const FaqListDetail = (props) => {
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
    const dataContext = useContext(DataContext);

    const handleMoveToPage = (id) => {
        router.push(`/general/faq/correction-faq?id=${id}`);
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
              rowsPerPageOptions={[20, 25, 50]}
              showFirstButton
              showLastButton
            />
            <Scrollbar>
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" width={'5%'} >
                                {t('label_No')}
                            </TableCell>
                            <TableCell align="center" width={'5%'}>
                                {t("component_partnerStoreStatus_partnerStoreInfoDetailB2B_propertyListItem_id")}
                            </TableCell>
                            <TableCell align="center" width={'10%'}>
                                {t("label_question")}
                            </TableCell>
                            <TableCell align="center" width={'56%'}>
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
                        {lists?.map((item, index) => {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow hover>
                                        <TableCell align={'center'} >
                                            {(page * 20) + (index + 1)}
                                        </TableCell>
                                        <TableCell align={'center'} >
                                            {item.id}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {dataContext["FAQ_TYPE"][item.faqType]}
                                        </TableCell>
                                        <TableCell sx={{ cursor:'pointer'}}
                                                   align={'left'}
                                                   onClick={() => handleMoveToPage(item.id)}>
                                            {item.question}
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
            </Scrollbar>
            {lists?.length == 0 ? <Stack sx={{
                fontSize: '16px',
                textAlign:'center',
                mt: 5,
                mb:5,
            }}>{t( 'warning_empty_result')}</Stack> : <></> }
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[20, 25, 50]}
                showFirstButton
                showLastButton
            />
        </div>
    )
};

export default FaqListDetail;