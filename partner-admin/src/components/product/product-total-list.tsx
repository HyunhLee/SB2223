import {
    Box, Stack, Typography, Grid, Button, FormLabel, TablePagination,
    Table, TableHead, TableCell, TableRow, TableBody, Checkbox, Link
} from "@mui/material";
import React, {FC, Fragment, useContext, useState} from 'react';
import {Scrollbar} from "../scrollbar";
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {ImageInListWidget} from "../widgets/image-widget";
import {DataContext} from "../../contexts/data-context";
import {getDataContextValue, getDate} from "../../utils/data-convert";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";

const ProductTotalList = (props) => {
    const {data} = props;
    let items = [data];
    const router = useRouter();
    const {t} = useTranslation();
    const dataContext = useContext(DataContext);
    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

    const handleClick = (id) => {
        router.push(`/product/${id}/product-correction`);
    }

    const handleRequestJennieFit = () => {
        console.log('제니핏 신청')
        //validation 정리해서 적용하기
    }

    const handleDelete = () => {
        console.log('삭제버튼')
        //validation 정리해서 적용하기
    }

    return (
        <div>
            <Box>
                <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant="h6">총 {17} 건</Typography>
                    <Box>
                        <Stack direction='row'>
                            <Button sx={{mr: 1}}
                                    color="success"
                                    variant="outlined"
                                    startIcon={<AutorenewIcon/>}
                                    size="small"
                                    onClick={handleRequestJennieFit}
                            >
                                {t('button_requestJennieFit')}
                            </Button>
                            <Button sx={{mr: 1}}
                                    color="error"
                                    variant="outlined"
                                    startIcon={<DeleteIcon/>}
                                    size="small"
                                    onClick={handleDelete}
                            >
                                {t('button_delete')}
                            </Button>
                        </Stack>
                    </Box>
                </Grid>
            </Box>
            <Scrollbar>
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllLists}
                                    //onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell align="center">
                                {t('label_image')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_productId')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_nameKo')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_brand')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_category')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_jennieFit')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_soldOutStatus')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_displayStatus')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_registrationType')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_status')}
                            </TableCell>
                            <TableCell align="center">
                                {t('label_registrationDate')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item) => {
                            const isListSelected = selectedLists.includes(item.id);
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
                                                // onChange={(event) => handleSelectOneList(
                                                //     event,
                                                //     item.id
                                                // )}
                                                value={isListSelected}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link href={"#"}>
                                                {item.shopImageUrlList ?
                                                    <ImageInListWidget imageName={item.nameKo}
                                                                       imageUrl={item.shopImageUrlList[0]}/> :
                                                    ''}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={{cursor: 'pointer'}}
                                                   onClick={() => handleClick(item.id)}>
                                            {item.id}
                                        </TableCell>
                                        <TableCell align="center" sx={{maxWidth: 400}}>
                                            {item.nameKo}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.brandName}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.categoryIds ? getDataContextValue(dataContext, 'CATEGORY_MAP', item.categoryIds[item.categoryIds.length - 1], 'path') : ''}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.fitRequestStatus ? '신청' : '미신청'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.isSoldOut ? 'Y' : 'N'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.activated ? '진열중' : '진열중지'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.REGISTRATION_TYPE[item.registrationType]}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.REGISTRATION_STATUS[item.registrationStatus]}
                                        </TableCell>
                                        <TableCell align="center">
                                            {getDate(item.createdDate)}
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            {/*<TablePagination*/}
            {/*    component="div"*/}
            {/*    count={count}*/}
            {/*    onPageChange={onPageChange}*/}
            {/*    onRowsPerPageChange={onRowsPerPageChange}*/}
            {/*    page={page}*/}
            {/*    rowsPerPage={rowsPerPage}*/}
            {/*    rowsPerPageOptions={[20, 40, 60]}*/}
            {/*    showFirstButton*/}
            {/*    showLastButton*/}
            {/*/>*/}
        </div>
    );
}

export default ProductTotalList;