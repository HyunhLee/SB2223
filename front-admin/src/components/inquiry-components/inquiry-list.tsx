import {
    Box,
    Button,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import React, {ChangeEvent, FC, Fragment, MouseEvent} from "react";
import {getDate, getNumberComma} from "../../utils/data-convert";
import {Scrollbar} from "../scrollbar";
import PropTypes from "prop-types";
import {InquiryModel} from "../../types/inquiry";

interface ListProps {
    lists: InquiryModel[];
    count: number;
    onOpenDrawer?: (inquiryId: number) => void;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
}

export const InquiryList: FC<ListProps> = (props) => {

    const {
        lists,
        count,
        onOpenDrawer,
        onPageChange,
        onRowsPerPageChange,
        rowsPerPage,
        page,
        ...other
    } = props;

    return (
        <div {...other}>
            <Stack sx={{justifyContent: 'space-between'}}
                   direction={'row'}>
                <Box>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant='h6'>총 {getNumberComma(count)} 건</Typography>
                    </Grid>
                </Box>
                <TablePagination
                    component="div"
                    count={count}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    showFirstButton
                    showLastButton
                />
            </Stack>
            <Scrollbar>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ textAlign: 'center', width: 150 }}>
                                ID
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', width: 200 }}>
                                카테고리
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', width: 150 }}>
                                작성자
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', width: 250 }}>
                                작성일
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', width: 550 }}>
                                질문
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', width: 150 }}>
                                답변상태
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', width: 150 }}>
                                상세보기
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists.length > 0 ? (
                            lists.map((item) => {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {item.id}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {item.type}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {item.userId}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {getDate(item.createdDate)}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {item.contents}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            {item.status === 'OPEN' ? '답변대기' : '답변완료'}
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Button
                                                component="a"
                                                sx={{ m: 1, cursor: 'pointer', width: 70, height: 35, textAlign: 'center' }}
                                                variant="contained"
                                                onClick={() => onOpenDrawer(item.id)}
                                            >
                                                상세
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        })) : (
                            <Fragment>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        해당하는 문의가 존재하지 않습니다.
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        )}
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
                rowsPerPageOptions={[5, 10, 25]}
                showFirstButton
                showLastButton
            />
        </div>
    )
};

InquiryList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onOpenDrawer: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};