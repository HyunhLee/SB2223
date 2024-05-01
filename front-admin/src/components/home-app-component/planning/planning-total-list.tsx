import React, {ChangeEvent, FC, Fragment, MouseEvent, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {
    Box,
    Button,
    Checkbox,
    Grid,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useRouter} from "next/router";
import _ from "lodash";
import toast from "react-hot-toast";
import {NewPlanningModel} from "../../../types/home-app-model/new-planning-model";
import {getDate, getNumberComma, stateDay} from "../../../utils/data-convert";
import {Scrollbar} from "../../scrollbar";
import {newPlanningApi} from "../../../api/new-planning-api";

interface ListProps {
    lists: NewPlanningModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    refreshList?: () => void;
    getLists?: () => void;
    selectedLists?: NewPlanningModel[],
    selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
    selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: NewPlanningModel) => void;
}

export const PlanningTotalList: FC<ListProps> = (props) => {
    const router = useRouter();

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
        event: ChangeEvent<HTMLInputElement>,
        listId: number
    ): void => {
        if (!selectedLists.includes(listId)) {
            if(selectedLists.length + 1 == count) {
                setSelectedLists((prevSelected) => [...prevSelected, listId]);
                setIdLists((prevSelected) => [...prevSelected, listId]);
                setSelectedAllLists(true);
            } else {
                setSelectedLists((prevSelected) => [...prevSelected, listId]);
                setIdLists((prevSelected) => [...prevSelected, listId]);
            }
        } else {
            if(selectedLists.length == 1) {
                setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
                setIdLists((prevSelected) => prevSelected.filter((id) => id !== listId));
                setSelectedAllLists(false);
            } else {
                setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
                setIdLists((prevSelected) => prevSelected.filter((id) => id !== listId));
            }
        }
    };

    const handleDelete = async (): Promise<void> => {
        if (_.isEmpty(selectedLists)) {
            toast.error('선택된 내역이 없습니다.');
        } else {
            if (window.confirm('삭제하시겠습니까?')) {
                for (const id of selectedLists) {
                    await newPlanningApi.deleteNewPlanning({
                        ids: idLists,
                        activated: false
                    })
                }
                toast.success('삭제되었습니다.');
                setSelectedLists([]);
                setIdLists([]);
                setSelectedAllLists(false);
                refreshList();
            }
        }
    }

    const handleClick = (id) => {
        router.push(`/home-app/planning/planning-correction?id=${id}`);
    }

    const getStatus = (start, end) => {
        const get = () => {
            return `${stateDay(start)}` < '0' ? '전시 중' : "전시 예정"
        }
        return `${stateDay(end)}` < '0' ? '전시 종료' :  get()
    }

    return (
        <div {...other}>
            <Box>
                <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant="h6">총 {getNumberComma(count)} 건</Typography>
                    <Box>
                        <Button sx={{mr:1}}
                                color="error"
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                size="small"
                                onClick={handleDelete}>
                            삭제
                        </Button>
                    </Box>
                </Grid>
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
                <Table sx={{ minWidth: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllLists}
                                    onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell>
                                ID
                            </TableCell>
                            <TableCell>
                                Title
                            </TableCell>
                            <TableCell>
                                게시기간
                            </TableCell>
                            <TableCell>
                                전시상태
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists.map((item) => {
                            const isListSelected = selectedLists.includes(item.id);
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            sx={{
                                                ...(open && {
                                                    position: 'relative',
                                                    '&:after': {
                                                        position: 'absolute',
                                                        content: '" "',
                                                        top: 0,
                                                        left: 0,
                                                        backgroundColor: 'primary.main',
                                                        width: 3,
                                                        height: 'calc(100% + 1px)'
                                                    }
                                                })
                                            }}
                                            width="25%"
                                        >
                                            <Checkbox
                                                checked={isListSelected}
                                                onChange={(event) => handleSelectOneList(
                                                    event,
                                                    item.id
                                                )}
                                                value={isListSelected}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.id}
                                        </TableCell>
                                        <TableCell
                                            sx={{cursor: 'pointer'}}
                                            onClick={() => handleClick(item.id)}
                                        >
                                            <Link sx={{cursor: 'pointer'}}>
                                                {item.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {`${getDate(item.startDate)} ~ ${getDate(item.expireDate)}`}
                                        </TableCell>
                                        <TableCell>
                                            {getStatus(item.startDate, item.expireDate)}
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
    )
}

PlanningTotalList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    refreshList: PropTypes.func,
}