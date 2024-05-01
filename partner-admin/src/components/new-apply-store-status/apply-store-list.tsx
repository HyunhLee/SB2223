import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Box, Button,
    Checkbox,
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

export const ApplyStoreList: FC<ListProps> = (props) => {

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

    const dataContext = useContext(DataContext);
    const {t} = useTranslation();
    const router = useRouter();

    const [idLists, setIdLists] = useState<number[]>([]);
    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

    useEffect(() => {
        setSelectedLists([]);
        setIdLists([]);
    }, [lists]);

    const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAllLists(event.target.checked);
        setSelectedLists(event.target.checked
            ? lists.map((list) => list.id)
            : []);
        setIdLists(event.target.checked
            ? lists.map((list) => list.id)
            : []);
    };

    const handleSelectOneList = (
        listId: number
    ): void => {
        if (!selectedLists.includes(listId)) {
            setSelectedLists((prevSelected) => [...prevSelected, listId]);
            setIdLists((prevSelected) => [...prevSelected, listId]);
        } else {
            setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
            setIdLists((prevSelected) => prevSelected.filter((id) => id !== listId));
        }
    };

    const handleClick = (id) => {
        router.push(`/new-apply-store-status/${id}/apply-store-info`);
    }

    const handleRejectReason = (item) => {
        window.confirm(`${item.companyName}`);
    }

    // 임시 더미 데이터
    const items = [{
        id: 1,
        companyName: 'Style Bot',
        applyStatus: 'APPLY',
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
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllLists}
                                    onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell align="center">
                                {t("component_newApplyStoreStatus_applyStoreList_tableCell_componyName")}
                            </TableCell>
                            <TableCell align="center">
                                {t("component_newApplyStoreStatus_applyStoreList_tableCell_status")}
                            </TableCell>
                            <TableCell align="center">
                                {t("component_newApplyStoreStatus_applyStoreList_tableCell_date")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => {
                            const isListSelected = selectedLists.includes(item.id);
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            width="25%"
                                        >
                                            <Checkbox
                                                checked={isListSelected}
                                                onChange={() => handleSelectOneList(item.id)}
                                                value={isListSelected}
                                            />
                                        </TableCell>
                                        <TableCell align="center" onClick={() => handleClick(item.id)}>
                                            <Link href={"#"}>
                                                {item.companyName}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.APPLY_STATUS[item.applyStatus]}
                                            {item.applyStatus == 'REJECTED' ?
                                                <Button onClick={() => handleRejectReason(item)}>반려사유</Button>
                                                :
                                                null
                                            }
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

ApplyStoreList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    refreshList: PropTypes.func,
};