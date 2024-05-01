import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {Fragment} from "@fullcalendar/react";
import {Scrollbar} from "../scrollbar";
import {getDate} from "../../utils/data-convert";

const ProductLinkageManagementList = () => {
    const lists = [{
        id: 1,
        category: "OUTER",
        count: 1,
        date: "2022-08-05"
    }];
    const count = 1;

    return (
        <>
            <div>
                <Scrollbar>
                    <Table sx={{minWidth: '100%'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    카테고리
                                </TableCell>
                                <TableCell align="center">
                                    연동 상품 개수
                                </TableCell>
                                <TableCell align="center">
                                    연동 등록일
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                lists?.map((item) => {
                                    return (
                                        <Fragment key={item.id}>
                                            <TableRow
                                                hover
                                                key={item.id}
                                            >
                                                <TableCell align="center">
                                                    {item.category}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {item.count}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {getDate(item.date)}
                                                </TableCell>
                                            </TableRow>
                                        </Fragment>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </Scrollbar>
            </div>
        </>
    )
}

export default ProductLinkageManagementList;