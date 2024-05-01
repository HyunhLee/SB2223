
import React, {ChangeEvent, Fragment, MouseEvent, useContext, useEffect, useState} from 'react';
import {
    Box,
    Grid, MenuItem, Select, Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import {Scrollbar} from "../scrollbar";
import {getNumberComma} from "../../utils/data-convert";
import {ImageInListWidget} from "../widgets/image-widget";
import {useTranslation} from "react-i18next";


export const ProductDetailList = (props) => {

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

    const changeSort = (e) => {
        setSearch({...search, sort: e});
        setRequestList(true);
    }

    const getImage = (item) => {
        if(item.fitRefImageUrl == ''){
            return item.thumnailImage
        }else{
            return item.fitRefImageUrl
        }
    }

    return (
        <div {...other}>
            <Box>
                <Stack direction='row' justifyContent='space-between'>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="h6">{t("label_total", {number: getNumberComma(count)})}</Typography>
                    </Grid>
                    <Select
                        size={"small"}
                        sx={{m: 1, width: 150}}
                        value={search.sort}
                        onChange={e => {
                            changeSort(e.target.value)
                        }}
                    >
                        <MenuItem value={'desc'}>{t("components_marketing_productDetailList_menuItem_high")}</MenuItem>
                        <MenuItem value={'asc'}>{t("components_marketing_productDetailList_menuItem_row")}</MenuItem>
                    </Select>
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
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align={'center'}>
                                {t("label_product_image")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_productNo")}
                            </TableCell>
                            <TableCell align={'center'} width={'750px'}>
                                {t("label_nameKo")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_brand")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_category")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_click")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists && lists.length > 0 ? lists.map((item) => {
                                return (
                                    <Fragment key={item.id}>
                                        <TableRow
                                            hover
                                            key={item.id}
                                        >
                                            <TableCell align={'center'}>
                                                <Box
                                                    sx={{
                                                        alignItems: 'center',
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {
                                                    getImage(item)
                                                        ? (
                                                            <ImageInListWidget
                                                                imageName={item.productNameKo}
                                                                imageUrl={getImage(item)}/>
                                                        )
                                                        : (
                                                            <Box
                                                                sx={{
                                                                    alignItems: 'center',
                                                                    backgroundColor: 'background.default',
                                                                    borderRadius: 1,
                                                                    display: 'flex',
                                                                    height: 80,
                                                                    justifyContent: 'center',
                                                                    width: 80
                                                                }}
                                                            >
                                                            </Box>
                                                        )
                                                }
                                            </Box>
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.productNo}
                                        </TableCell>
                                        <TableCell align={'left'}>
                                            {item.productNameKo}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.brandName}
                                        </TableCell>
                                            <TableCell align={'center'}>
                                                {item.categories.join('/')}
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                {item.clickCount}
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })
                            :
                            <Fragment>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align={'center'}>
                                        {t("components_marketing_totalPurchaseInCartDetail_cartList")}
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </Fragment>
                        }
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
        </div>
    );
};
