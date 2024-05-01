import PropTypes from "prop-types";
import React, {ChangeEvent, FC, Fragment, MouseEvent} from "react";
import {SearchUser, UserModel} from "../../types/marketing-model/marketing-user-model";
import {
    Box,
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
import {Scrollbar} from "../scrollbar";
import moment from "moment/moment";

interface ListProps {
    lists: UserModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    search: SearchUser;
    setSearch: (e) => void;
    setRequestList: (e) => void;
}

export const UserDetailList: FC<ListProps> = (props) => {
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

    return (
        <div {...other}>
            <Stack sx={{justifyContent: 'space-between'}}
                   direction={'row'}>
                <Box>
                    <Stack direction='row'
    justifyContent='start'>
                        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant="h6">총 {count} 건</Typography>
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
            </Stack>
            <Scrollbar>
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align={'center'} width={'50%'}>
                                유저ID
                            </TableCell>
                            {/*<TableCell align={'center'}>*/}
                            {/*    이름*/}
                            {/*</TableCell>*/}
                            {/*<TableCell align={'center'}>*/}
                            {/*    전화번호*/}
                            {/*</TableCell>*/}
                            {/*<TableCell align={'center'}>*/}
                            {/*    이메일*/}
                            {/*</TableCell>*/}
                            {/*<TableCell align={'center'}>*/}
                            {/*    성별*/}
                            {/*</TableCell>*/}
                            <TableCell align={'center'} width={'50%'}>
                                등록일
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
            }}>현재 해당하는 자료가 없습니다.</Stack>}
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

UserDetailList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
}