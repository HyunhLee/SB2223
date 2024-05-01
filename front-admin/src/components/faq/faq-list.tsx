import {
    Box, Button,
    Checkbox,
    FormControl,
    Grid, IconButton, Input, InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableHead, TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import NextLink from "next/link";
import React, {ChangeEvent, FC, Fragment, MouseEvent, useEffect, useState} from "react";
import {getDate, getNumberComma} from "../../utils/data-convert";
import {UserDressModel} from "../../types/user-dress-model";
import {FaqModel} from "../../types/faq";
import {Scrollbar} from "../scrollbar";
import {ImageInListWidget} from "../widgets/image-widget";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";
import SaveIcon from "@mui/icons-material/Save";
import {useRouter} from "next/router";

interface ListProps {
    lists: FaqModel[];
    count: number;
    onOpenDrawer?: (orderId: number) => void;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    refreshList?: () => void;
    selectedLists?: FaqModel[],
    selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
    selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: FaqModel) => void;
}

export const FaqList: FC<ListProps> = (props) => {

    const router = useRouter();

    const {
        lists,
        count,
        onOpenDrawer,
        refreshList,
        onPageChange,
        onRowsPerPageChange,
        rowsPerPage,
        page,
        ...other
    } = props;

    const [list, setList] = React.useState<FaqModel[]>([]);

    useEffect(() => {
        setList([]);
    }, [lists]);

    const handleClick = (id) => {
        router.push(`/faq/${id}/faq-popup`);
    }

    return (
        <div {...other}>
            <Box>
                <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant='h6'>총 {getNumberComma(count)} 건</Typography>
                </Grid>
            </Box>
            <Scrollbar>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ textAlign: 'center' }}>
                                ID
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                카테고리
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                제목
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                작성자
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                작성일
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                답변
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
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
                                        <TableCell>
                                            {item.id}
                                        </TableCell>
                                        <TableCell>
                                            {item.category}
                                        </TableCell>
                                        <TableCell>
                                            {item.question}
                                        </TableCell>
                                        <TableCell>
                                            {item.createdBy}
                                        </TableCell>
                                        <TableCell>
                                            {getDate(item.createdDate)}
                                        </TableCell>
                                        <TableCell>
                                            {item.answer}
                                        </TableCell>
                                        <TableCell>
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
            />
        </div>
    )
};

FaqList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onOpenDrawer: PropTypes.func,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    refreshList: PropTypes.func,
};