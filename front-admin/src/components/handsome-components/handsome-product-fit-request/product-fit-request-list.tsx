import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useState} from 'react';
import PropTypes from 'prop-types';
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
    Typography
} from '@mui/material';
import {Scrollbar} from "../../scrollbar";
import {getDate} from "../../../utils/data-convert";
import {ImageInListWidget} from "../image-widget";
import {HandsomeJennieFitAssignmentProduct} from "../../../types/handsome-model/handsome-jennie-fit-assignment-model";

interface ListProps {
    lists: HandsomeJennieFitAssignmentProduct[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    selectedLists?: HandsomeJennieFitAssignmentProduct[],
    selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
    selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: HandsomeJennieFitAssignmentProduct) => void;
}

export const ProductFitRequestList: FC<ListProps> = (props) => {
    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        selectedLists,
        selectAllLists,
        selectOneList,
        ...other
    } = props;

    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

    const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAllLists(event.target.checked);
        selectAllLists(event);
    };

    return (
        <div {...other}>
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
                                    checked={selectedAllLists}
                                    onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell align="center"
sx={{width: 70}}>
                                상품ID
                            </TableCell>
                            <TableCell align="center"
sx={{width: 80}}>
                                썸네일 이미지
                            </TableCell>

                            <TableCell align="center">
                                상품 품번
                            </TableCell>
                            <TableCell align="center">
                                상품명
                            </TableCell>
                            <TableCell align="center">
                                브랜드
                            </TableCell>
                            <TableCell align="center">
                                카테고리
                            </TableCell>
                            <TableCell align="center">
                                등록일
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists?.map((item) => {
                            const isListSelected = selectedLists.includes(item);
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            // sx={{
                                            //     ...(open && {
                                            //         position: 'relative',
                                            //         '&:after': {
                                            //             position: 'absolute',
                                            //             content: '" "',
                                            //             top: 0,
                                            //             left: 0,
                                            //             backgroundColor: 'primary.main',
                                            //             width: 3,
                                            //             height: 'calc(100% + 1px)'
                                            //         }
                                            //     })
                                            // }}
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
                                        <TableCell align="center"
sx={{width: 70}}>
                                            <Typography
                                                color="textSecondary"
                                                variant="body2"
                                            >
                                                {item.id}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center"
sx={{width: 80}}>
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                {
                                                    item.thumbnailImageUrl
                                                        ? (
                                                            <ImageInListWidget imageName={item.name}
                                                                               imageUrl={item.thumbnailImageUrl}/>
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
                                            <Typography
                                                color="textSecondary"
                                                variant="body2"
                                            >
                                                {item.number}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                color="textSecondary"
                                                variant="body2"
                                            >
                                                {item.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                color="textSecondary"
                                                variant="body2"
                                            >
                                                {item.brand['nameEn']}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item.categoryTypes.join(' < ')}
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
        </div>
    );
};

ProductFitRequestList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};