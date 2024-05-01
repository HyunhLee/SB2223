import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useContext} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
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
import {ImageInListWidget} from "../widgets/image-widget";
import {DetailClickModel, SearchDetailClick} from "../../types/marketing-model/marketing-detail-click-model";
import {DataContext} from "../../contexts/data-context";

interface ListProps {
    lists: DetailClickModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    brand: any[];
    search: SearchDetailClick;
    setSearch: (e) => void;
    setRequestList: (e) => void;
}

export const DetailClickDetailList: FC<ListProps> = (props) => {

    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        brand,
        search,
        setSearch,
        setRequestList,
        ...other
    } = props;

    const dataContext = useContext(DataContext);

    const changeSort = (e) => {
        setSearch({...search, sort: e});
        setRequestList(true);
    }

    const renderCategory = (categoryId) => {
        return (dataContext.CATEGORY_GROUP.find((item) => item.groupId === categoryId)) ? dataContext.CATEGORY_GROUP.find((item) => item.groupId === categoryId).groupName : '';
    }

    return (
        <div {...other}>
            <Box>
                <Stack direction='row'
justifyContent='space-between'>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="h6">총 {count} 건</Typography>
                    </Grid>
                    <Select
                        size={"small"}
                        sx={{m: 1, width: 150}}
                        value={search.sort}
                        onChange={e => {
                            changeSort(e.target.value)
                        }}
                    >
                        <MenuItem
                            value={'c'}>높은조회순</MenuItem>
                        <MenuItem
                            value={'clickCount'}>낮은조회순</MenuItem>
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
                                상품이미지
                            </TableCell>
                            <TableCell align={'center'}>
                                상품ID
                            </TableCell>
                            <TableCell align={'center'}>
                                상품번호
                            </TableCell>
                            <TableCell align={'center'}>
                                상품명
                            </TableCell>
                            <TableCell align={'center'}>
                                브랜드
                            </TableCell>
                            <TableCell align={'center'}>
                                카테고리
                            </TableCell>
                            <TableCell align={'center'}>
                                조회수
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists && lists.length > 0 ? lists.map((item) => {
                            return (
                                <Fragment key={item.product.id}>
                                    <TableRow
                                        hover
                                        key={item.product.id}
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
                                                    item.product.fitRefImageUrl
                                                        ? (
                                                            <ImageInListWidget
                                                                imageName={item.product.fitRefImageUrl}
                                                                imageUrl={item.product.fitRefImageUrl}/>
                                                        )
                                                        :
                                                        item.thumnailImage
                                                            ? (
                                                                <ImageInListWidget
                                                                    imageName={item.thumnailImage}
                                                                    imageUrl={item.thumnailImage}/>
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
                                            {item.product.id}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.product.productNo}
                                        </TableCell>
                                        <TableCell align={'left'}>
                                            {item.product.nameKo}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.product.brand.name}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {renderCategory(item.product.closetCategoryId)}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.clickCounts}
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
                                        현재 해당하는 자료가 없습니다.
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

DetailClickDetailList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};