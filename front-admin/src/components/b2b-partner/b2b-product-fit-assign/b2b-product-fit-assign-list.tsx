import {
    Box,
    Checkbox,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import React, {Fragment, useContext,} from "react";
import {ImageInListWidget} from "../../handsome-components/image-widget";
import {getDataContextValue, getDate} from "../../../utils/data-convert";
import {Scrollbar} from "../../scrollbar";
import {DataContext} from "../../../contexts/data-context";

const BtbProductFitAssignList = (props) => {
    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        selectedLists,
        selectedAllLists,
        selectOneList,
        selectAllList,
    } = props;

    const dataContext = useContext(DataContext);

    const renderCategory = (categoryIds) => {
        return categoryIds?.map((categoryId, i) => {
            if(i == categoryIds.length -1){
                return (
                  <span key={categoryId}>
          {getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId, 'name')}
        </span>
                )
            }else{
                return (
                  <span key={categoryId}>
          {getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId, 'name')}{" < "}
        </span>
                )
            }

        });
    }


    return (
        <>
            <Stack sx={{justifyContent: 'space-between'}}
                   direction={'row'}>
                <Box>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="h6">총 {count} 건</Typography>
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
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllLists || selectedLists.length == 20}
                                    onChange={selectAllList}
                                />
                            </TableCell>
                            <TableCell align="center">
                                이미지
                            </TableCell>
                            <TableCell align="center">
                                상품ID
                            </TableCell>
                            <TableCell align="center">
                                상품명
                            </TableCell>
                            <TableCell align="center">
                                컬러
                            </TableCell>
                            <TableCell align="center">
                                브랜드
                            </TableCell>
                            <TableCell align="center">
                                카테고리
                            </TableCell>
                            <TableCell align="center">
                                생성타입
                            </TableCell>
                            <TableCell align="center">
                                등록일
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists.map((item) => {
                            const isListSelected = selectedLists.includes(item);
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
                                                onChange={(event) => selectOneList(
                                                    event,
                                                    item
                                                )}
                                                value={isListSelected}
                                            />
                                        </TableCell>
                                        <TableCell sx={{width: 100}}>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                {
                                                    item.fitRefImageUrl
                                                        ? (
                                                            <ImageInListWidget imageName={item.nameKo}
                                                                               imageUrl={item.fitRefImageUrl}/>
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
                                        <TableCell align="center">
                                            {item.productId}
                                        </TableCell>
                                        <TableCell>
                                            {item.nameKo}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.productColor.colorName}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item?.brandName ? item.brandName : '-'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {renderCategory(item?.categoryIds)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.BTB_REGISTRATION_TYPE[item?.registrationType]}
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
            {lists.length == 0 && <Stack sx={{mt:5, mb: 5, textAlign: 'center'}}>배정 가능한 상품이 없습니다.</Stack>}
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
        </>
    )
}


export default BtbProductFitAssignList