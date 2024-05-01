import PropTypes from "prop-types";
import React, {ChangeEvent, FC, Fragment, MouseEvent} from "react";
import {SearchUser, UserModel} from "../../types/marketing-user-model";
import {
    Box,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow,
    Typography
} from "@mui/material";

import {Scrollbar} from "../scrollbar";
import {useTranslation} from "react-i18next";
import moment from "moment/moment";
export const UserDetailList = (props) => {
    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        search,
        setSearch,
        setRequestList,
        ...other
    } = props;

    const {t} = useTranslation();

    return (
        <div {...other}>
            <Box>
                <Stack direction='row' justifyContent='start'>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="h6">{t("label_total", {number: count})}</Typography>
                    </Grid>
                </Stack>
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
            <Scrollbar>
                <Table sx={{width: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align={'center'} width={'50%'}>
                                {t("label_userId")}
                            </TableCell>
                            {/*<TableCell align={'center'}>*/}
                            {/*    {t("label_userName")}*/}
                            {/*</TableCell>*/}
                            {/*<TableCell align={'center'}>*/}
                            {/*    {t("label_phone")}*/}
                            {/*</TableCell>*/}
                            {/*<TableCell align={'center'}>*/}
                            {/*    {t("label_email")}*/}
                            {/*</TableCell>*/}
                            {/*<TableCell align={'center'}>*/}
                            {/*    {t("label_gender")}*/}
                            {/*</TableCell>*/}
                            <TableCell align={'center'} width={'50%'}>
                                {t("label_registrationDate")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists.length > 0 && lists.map((item) => {
                                return (
                                    <Fragment key={item.id}>
                                        <TableRow
                                            hover
                                            key={item.id}
                                        >
                                            <TableCell align={'center'}>
                                                {item.member_id}
                                            </TableCell>
                                            {/*<TableCell align={'center'}>*/}
                                            {/*    {item.name}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell align={'center'}>*/}
                                            {/*    {item.cellphone}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell align={'center'}>*/}
                                            {/*    {item.email}*/}
                                            {/*</TableCell>*/}
                                            {/*<TableCell align={'center'}>*/}
                                            {/*    {item.gender}*/}
                                            {/*</TableCell>*/}
                                            <TableCell align={'center'}>
                                                {moment(item.created_date).format('YYYY-MM-DD')}
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })}
                    </TableBody>
                </Table>
            </Scrollbar>
            {lists.length == 0 && <Stack sx={{
                  fontSize: '16px',
                  textAlign:'center',
                  mt: 5,
                  mb:5,
              }}>{t("components_marketing_totalPurchaseInCartDetail_cartList")}</Stack>}
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
        </div>
    )
}
