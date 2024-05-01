
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
import {DataContext} from "../../contexts/data-context";
import {ImageInListWidget} from "../widgets/image-widget";
import {SearchStyle, StyleModel} from "../../types/marketing-style-model";
import moment from "moment/moment";
import {useTranslation} from "react-i18next";
import {endPointConfig} from "../../config";

export const StyleDetailList = (props) => {

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

    const dataContext = useContext(DataContext);
    const {t} = useTranslation();

    const renderBrand = (brandId) => {
        return (dataContext.MALL_BRAND.find((item) => item.id === brandId)) ? dataContext.MALL_BRAND.find((item) => item.id === brandId).nameKo : '';
    }

    const renderCategory = (categoryId) => {
        return (dataContext.CATEGORY_GROUP.find((item) => item.groupId === categoryId)) ? dataContext.CATEGORY_GROUP.find((item) => item.groupId === categoryId).groupName : '';
    }

    const changeSort = (e) => {
        setSearch({...search, sort: e});
        setRequestList(true);
    }

    const textArea = (content) => {
        if (content.length > 40) {
            return content.substr(0, 35) + '...';
        }else{
            return content
        }
    }
    const renderItemImage = (items) => {
        const data = items.sort((a, b) => b.count - a.count);
        if (data) {
            return data.map((item, idx) => {
                if (data.length - 1 == idx) {
                    return (
                      <Stack key={item.id} sx={{alignItems: 'center', justifyContent: 'center', display: 'flex', padding: 2}}>
                          {
                              item.thumbnailImageUrl
                                ? (
                                  <ImageInListWidget
                                    imageName={item.thumbnailImageUrl}
                                    imageUrl={item.thumbnailImageUrl}
                                    height={35}
                                    width={35}
                                  />
                                )
                                : (
                                  <Box
                                    sx={{
                                        alignItems: 'center',
                                        backgroundColor: 'background.default',
                                        borderRadius: 1,
                                        display: 'flex',
                                        height: 35,
                                        justifyContent: 'center',
                                        width: 35
                                    }}
                                  >
                                  </Box>
                                )
                          }
                      </Stack>
                    )
                } else {
                    return (
                      <Stack key={item.id} sx={{alignItems: 'center', borderBottom: '1px solid #efefef', display: 'flex', justifyContent: 'center', padding: 2}}>
                          {
                              item.thumbnailImageUrl
                                ? (
                                  <ImageInListWidget
                                    imageName={item.thumbnailImageUrl}
                                    imageUrl={item.thumbnailImageUrl}
                                    height={35}
                                    width={35}
                                  />
                                )
                                : (
                                  <Box
                                    sx={{
                                        alignItems: 'center',
                                        backgroundColor: 'background.default',
                                        borderRadius: 1,
                                        display: 'flex',
                                        height: 35,
                                        justifyContent: 'center',
                                        width: 35
                                    }}
                                  >
                                  </Box>
                                )
                          }
                      </Stack>
                    )
                }
    });
        }
    }

    const renderItem = (items, info) => {
        const data = items.sort((a, b) => b.count - a.count);
        if (data) {
            if (info == 'id') {
                return data.map((item, idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack sx={{paddingTop:3, paddingBottom: 1, alignItems: 'center',display: 'flex', justifyContent: 'center',}}>
                          <Stack key={item.id} sx={{ height: 35}}>
                              {item.productNo}
                          </Stack>
                          </Stack>
                        )
                    }else{
                        return (
                          <Stack sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                          <Stack key={item.id} sx={{ height: 35,}}>
                              {item.productNo}
                          </Stack>
                          </Stack>
                        )
                    }

                });
            } else if (info == 'name') {
                return data.map((item, idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack sx={{paddingTop:3, paddingBottom: 1,display: 'flex', justifyContent: 'center',}}>
                          <Stack key={item.id} sx={{height: 35, paddingLeft: 2}}>
                              {textArea(item.nameKo)}
                          </Stack>
                          </Stack>
                        )
                    }else{
                    return (
                      <Stack sx={{paddingTop:3, paddingBottom: 1, display: 'flex', justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                        <Stack key={item.id}  sx={{height: 35,paddingLeft: 2}}>
                            {textArea(item.nameKo)}
                        </Stack>
                      </Stack>
                    )
                }});
            } else if (info == 'category') {
                return data.map((item, idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack sx={{paddingTop:3, paddingBottom: 1,display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                          <Stack key={item.id} sx={{display: 'flex', height: 35, justifyContent: 'center', alignItems: 'center'}}>
                              {renderCategory(item.closetCategoryId)}
                          </Stack>
                          </Stack>
                        )
                    }else {
                        return (
                          <Stack sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center',justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                          <Stack key={item.id} sx={{height: 35,}}>
                              {renderCategory(item.closetCategoryId)}
                          </Stack>
                          </Stack>
                        )
                    }
                });
            } else if (info == 'brand') {
                return data.map((item, idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center',justifyContent: 'center'}}>
                          <Stack key={item.id} sx={{ height: 35}}>
                              {renderBrand(item.brandId)}
                          </Stack>
                          </Stack>
                        )
                    }else {
                        return (
                          <Stack sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center',justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                          <Stack key={item.id} sx={{
                              height: 35
                          }}>
                              {renderBrand(item.brandId)}
                          </Stack>
                          </Stack>
                        )
                    } });
            } else if (info == 'count') {
                return data.map((item, idx) => {
                    if(data.length-1 == idx){
                        return (
                          <Stack sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center',justifyContent: 'center', }}>
                          <Stack key={item.id} sx={{height: 35}}>
                              {item.count}
                          </Stack>
                          </Stack>
                        )
                    }else {
                    return (
                      <Stack sx={{paddingTop:3, paddingBottom: 1, display: 'flex', alignItems: 'center',justifyContent: 'center', borderBottom: '1px solid #efefef',}}>
                        <Stack key={item.id} sx={{height: 35,}}>
                            {item.count}
                        </Stack>
                      </Stack>
                    )
                    }
                });
            }
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
                        <MenuItem value={'i'}>{t("components_marketing_styleDetailList_menuItem_new")}</MenuItem>
                        <MenuItem value={'id'}>{t("components_marketing_styleDetailList_menuItem_old")}</MenuItem>
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
                            <TableCell align={'center'} >
                                {t("label_image")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_styleId")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_product_image")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_productNo")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_nameKo")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_category")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_brand")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_add")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_userId")}
                            </TableCell>
                            <TableCell align={'center'}>
                                {t("label_registrationDate")}
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
                                        <TableCell align={'center'} sx={{borderBottom: '1px solid #efefef'}}>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {
                                                    item.styleAvatarImageUrl
                                                        ? (
                                                            <ImageInListWidget
                                                                imageName={`스타일ID ${item.id}`}
                                                                imageUrl={`${endPointConfig.styleBotMyStyleImage}user-style/${item.styleAvatarImageUrl}`}/>
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
                                        <TableCell align={'center'} sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef', borderLeft: '1px solid #efefef', borderBottom: '1px solid #efefef'}}>
                                            {item.id}
                                        </TableCell>
                                        <TableCell align={'center'} sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef',  justifyContent: 'center'}}>
                                            {renderItemImage(item.products)}
                                        </TableCell>
                                        <TableCell align={'center'} sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                            {renderItem(item.products, 'id')}
                                        </TableCell>
                                        <TableCell sx={{padding: 0, margin: 0 , borderRight: '1px solid #efefef'}} >
                                            {renderItem(item.products, 'name')}
                                        </TableCell>
                                        <TableCell align={'center'} sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                            {renderItem(item.products, 'category')}
                                        </TableCell>
                                        <TableCell align={'center'} sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                            {renderItem(item.products, 'brand')}
                                        </TableCell>
                                        <TableCell align={'center'} sx={{padding: 0, margin: 0, borderRight: '1px solid #efefef'}}>
                                            {renderItem(item.products, 'count')}
                                        </TableCell>
                                        <TableCell align={'center'} sx={{borderRight: '1px solid #efefef', borderBottom: '1px solid #efefef'}}>
                                            {item.userLogin}
                                        </TableCell>
                                        <TableCell align={'center'} sx={{ borderBottom: '1px solid #efefef'}}>
                                            {moment(item.createdDate).format('YYYY-MM-DD')}
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
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align={'center'}>
                                        {t("components_marketing_totalPurchaseInCartDetail_cartList")}
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
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
