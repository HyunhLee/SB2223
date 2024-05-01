import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useContext} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Grid, Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
import {Scrollbar} from "../scrollbar";
import {getDate, getNumberComma} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import {ApplyStoreModels} from "../../types/apply-store-model";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";

interface ListProps {
    lists: ApplyStoreModels[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    refreshList?: () => void;
    getLists?: () => void;
    selectedLists?: ApplyStoreModels[],
    selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
    selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: ApplyStoreModels) => void;
}

export const PartnerStoreList: FC<ListProps> = (props) => {

    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        refreshList,
        getLists,
        ...other
    } = props;

    const {t} = useTranslation();
    const dataContext = useContext(DataContext);
    const router = useRouter();

    const handleClick = (id) => {
        router.push(`/partner-store-status/${id}/partner-store-info`);
    }

    // 임시 더미 데이터
    const items = [{
        id: 1,
        companyName: 'Style Bot',
        applyStatus: 'APPLY',
        brand: {
            brandNameEn: 'Style Bot'
        },
        serviceStatus: 'B2B',
        createdDate: '2022-08-10'
    }];

    return (
        <div {...other}>
            <Box>
                <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant="h6">총 {getNumberComma(count)} 건</Typography>
                </Grid>
            </Box>
            <Scrollbar>
                <Table sx={{minWidth: '100%'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">
                                {t("component_partnerStoreStatus_partnerStoreList_tableCell_componyName")}
                            </TableCell>
                            <TableCell align="center">
                                {t("component_partnerStoreStatus_partnerStoreList_tableCell_brand")}
                            </TableCell>
                            <TableCell align="center">
                                {t("component_partnerStoreStatus_partnerStoreList_tableCell_brandMap")}
                            </TableCell>
                            <TableCell align="center">
                                {t("component_partnerStoreStatus_partnerStoreList_tableCell_serviceStatus")}
                            </TableCell>
                            <TableCell align="center">
                                {t("component_partnerStoreStatus_partnerStoreList_tableCell_date")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell align="center" onClick={() => handleClick(item.id)}>
                                            <Link href={"#"}>
                                                {item.companyName}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.brand.brandNameEn}
                                        </TableCell>
                                        <TableCell align="center">
                                            -
                                        </TableCell>
                                        <TableCell align="center">
                                            {`${dataContext.SERVICE_STATUS[item.serviceStatus]}`}
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
                rowsPerPageOptions={[10, 25, 50]}
                showFirstButton
                showLastButton
            />
        </div>
    );
};

PartnerStoreList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    refreshList: PropTypes.func,
};