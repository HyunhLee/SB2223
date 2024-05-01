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
    Tooltip,
    Typography
} from "@mui/material";
import React, {ChangeEvent, FC, Fragment, MouseEvent, useEffect, useState} from "react";
import {getDate, getNumberComma} from "../../utils/data-convert";
import {Scrollbar} from "../scrollbar";
import PropTypes from "prop-types";
import _ from "lodash";
import {PopularSearchWordsModel} from "../../types/popular-search-words";
import {useRouter} from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import {popularSearchWordsApi} from "../../api/popular-search-words-api";

interface ListProps {
    lists: PopularSearchWordsModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    getLists?: () =>  void;
}

export const SearchWordsList: FC<ListProps> = (props) => {

    const router = useRouter();

    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        rowsPerPage,
        page,
        getLists,
        ...other
    } = props;

    useEffect(
        () => {
            if (selectedLists.length) {
                setSelectedLists([]);
            }
        },
        [lists]
    );

    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

    const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAllLists(event.target.checked);
        setSelectedLists(event.target.checked
            ? lists.map((list) => list.id)
            : []);
    };

    const handleSelectOneList = (
        event: ChangeEvent<HTMLInputElement>,
        listId: number
    ): void => {
        if (!selectedLists.includes(listId)) {
            setSelectedLists((prevSelected) => [...prevSelected, listId]);
        } else {
            setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
        }
    };

    const handleClick = (id) => {
        router.push(`/popular-search-words/popular-search-words-detail?id=${id}`);
    }

    const handleDelete = async (): Promise<void> => {
        if (_.isEmpty(selectedLists)) {
            toast.error('선택된 내역이 없습니다.');
        } else {
            if (window.confirm('삭제하시겠습니까?')) {
                for (const id of selectedLists) {
                    await popularSearchWordsApi.patchPopularSearchWord(id, {
                        id,
                        activated: false,
                    })
                }
                toast.success('삭제되었습니다.');
                setSelectedLists([]);
                await getLists();
            }
        }
    }

    return (
        <div {...other}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Box>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant='h6'>총 {getNumberComma(count)} 건</Typography>
                    </Grid>
                </Box>
                <Box>
                    <Button sx={{mb:3}}
                            color="error"
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            size="small"
                            onClick={handleDelete}>
                        삭제
                    </Button>
                </Box>
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
            <Scrollbar>
                <Table sx={{ width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedAllLists}
                                    onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                No.
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                TITLE
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                게시 기간 및 시간
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                                전시상태
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists.length > 0 ? (
                            lists.map((item) => {
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
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {item.id}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}
                                                       onClick={() => handleClick(item.id)}>
                                                <Tooltip arrow={true}
                                                         title={item.keywordItems.filter(value => value.activated).map((value) => {
                                                             return `${value.keyword},`
                                                         })}>
                                                    <Link sx={{cursor: 'pointer'}}>
                                                        {item.description}
                                                    </Link>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {`${getDate(item.startDate)} ~ ${getDate(item.expireDate)}`}
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {item.displayStatus === 'DISPLAY_ON' ? '전시중' : item.displayStatus === 'DISPLAY_END' ? '전시 종료' : '전시 예정'}
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })) : (
                            <Fragment>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                        해당하는 키워드가 존재하지 않습니다.
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

SearchWordsList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired
};