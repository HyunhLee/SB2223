import {useRouter} from "next/router";
import React, {Fragment, useContext} from "react";
import {
    Box,
    Grid,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {Scrollbar} from "../../scrollbar";
import moment from "moment";
import {DataContext} from "../../../contexts/data-context";

const FaqListDetail = (props) => {
    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage
    } = props;
    const router = useRouter();
    const dataContext = useContext(DataContext);

    const handleMoveToPage = (id) =>{
        router.push(`/b2b-partner/faq/correction-faq?id=${id}`);
    }

    return (
        <div>
            <Stack sx={{justifyContent: 'space-between'}}
                   direction={'row'}>
                <Box>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center'}}>
                        <Typography>총 {count} 건 </Typography>
                    </Grid>
                </Box>
                <TablePagination
                    component="div"
                    count={count}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[20, 25, 50]}
                    showFirstButton
                    showLastButton
                />
            </Stack>
            <Scrollbar>
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                No.
                            </TableCell>
                            <TableCell align="center">
                                ID
                            </TableCell>
                            <TableCell align="center">
                                제목
                            </TableCell>
                            <TableCell align="center">
                                카테고리
                            </TableCell>
                            <TableCell align="center">
                                등록자
                            </TableCell>
                            <TableCell align="center">
                                등록일
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists?.map((item, index) => {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow hover>
                                        <TableCell align={'center'}>
                                            {(page*20)+(index+1)}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.id}
                                        </TableCell>
                                        <TableCell sx={{maxWidth: '350px'}}
                                                   align={'center'}
                                                   onClick={() => handleMoveToPage(item.id)}>
                                            <Link sx={{cursor: 'pointer'}}>
                                                {item.question}
                                            </Link>
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {dataContext["FAQ_TYPE"][item.faqType]}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.createdBy}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {moment(item.createdDate).format('YYYY-MM-DD')}
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
                rowsPerPageOptions={[20, 25, 50]}
                showFirstButton
                showLastButton
            />
        </div>
    )
};

export default FaqListDetail;