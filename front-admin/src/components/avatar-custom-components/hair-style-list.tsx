import {Box, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import React, {FC, Fragment, useEffect} from "react";
import {getDate, getNumberComma} from "../../utils/data-convert";
import {Scrollbar} from "../scrollbar";
import PropTypes from "prop-types";
import {ImageInListWidget} from "../widgets/image-widget";
import {AvatarHair} from "../../types/avatar-custom";

interface ListProps {
    lists: AvatarHair[];
    count: number;
}

export const HairStyleList: FC<ListProps> = (props) => {

    useEffect(() => {
        console.log(lists)
    },[])

    const {
        lists,
        count,
        ...other
    } = props;

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
                                이미지
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                기장
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                앞머리
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                머리상태
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                등록일
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
                                                <ImageInListWidget imageName={item.mainImageUrl}
imageUrl={item.mainImageUrl}
name={'avatar'} />
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {item.hairLengthType}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {item.hasBangs == true ? 'O' : 'X'}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {item.hairType == 'STRAIGHT' ? '생머리' : '웨이브'}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {getDate(item.createdDate)}
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })) : (
                            <Fragment>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        해당하는 헤어스타일이 존재하지 않습니다.
                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        )}
                    </TableBody>
                </Table>
            </Scrollbar>
        </div>
    )
};

HairStyleList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
};