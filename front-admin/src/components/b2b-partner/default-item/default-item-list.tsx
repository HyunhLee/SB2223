import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Checkbox,
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
} from '@mui/material';
import {Scrollbar} from "../../scrollbar";
import {getDataContextValue, getDate, getNumberComma} from "../../../utils/data-convert";
import {DataContext, renderBrandKeyword} from "../../../contexts/data-context";
import toast from "react-hot-toast";
import {ImageInListWidget} from "../../widgets/image-widget";
import {useRouter} from "next/router";
import DeleteIcon from '@mui/icons-material/Delete';
import {B2bDefaultItemModel} from "../../../types/b2b-partner-model/b2b-default-item-model";
import {b2bDefaultItemApi} from "../../../b2b-partner-api/b2b-default-item-api";
import _ from "lodash";

interface ListProps {
    lists: B2bDefaultItemModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    refreshList?: () => void;
    selectedLists?: B2bDefaultItemModel[],
    selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
    isLoaded?: boolean;
}

export const DefaultItemList: FC<ListProps> = (props) => {
    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        refreshList,
        isLoaded,
        ...other
    } = props;

    const router = useRouter();
    const dataContext = useContext(DataContext);

    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

    useEffect(() => {
        setSelectedLists([]);
    }, [lists]);

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

    const handleDelete = async (): Promise<void> => {
        if (_.isEmpty(selectedLists)) {
            toast.error('선택된 내역이 없습니다.');
        } else {
            if (window.confirm('삭제하시겠습니까?')) {
                await b2bDefaultItemApi.deleteDefaultItems({
                    ids: selectedLists,
                    activated: false
                }).then(res => {
                    console.log(res);
                    toast.success('삭제되었습니다.');
                    setSelectedLists([]);
                    refreshList();
                }).catch(err => {
                    console.log(err);
                })
            }
        }
    }

    const handleClick = (id) => {
       router.push(`/b2b-partner/default-item/b2b-default-correction?id=${id}`);
    }

    return (
        <div {...other}>
            <Box>
                <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant="h6">총 {count ? getNumberComma(count) : 0} 건</Typography>
                    <Box>
                        <Stack
                            direction='row'>
                            <Button sx={{mr:1}}
                                    color="error"
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    size="small"
                                    onClick={handleDelete}>
                                삭제
                            </Button>
                        </Stack>
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
                rowsPerPageOptions={[20, 40, 60]}
                showFirstButton
                showLastButton
            />
            <Scrollbar>
                <Table sx={{ minWidth: '1600px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox
                                    checked={selectedAllLists}
                                    onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell sx={{width: '8%'}}
align={'center'}>
                                이미지
                            </TableCell>
                            <TableCell align={'center'}
width={'12%'}>
                                상품명
                            </TableCell>
                            <TableCell align={'center'}
width={'10%'}>
                                상품ID
                            </TableCell>
                            <TableCell align={'center'}
width={'10%'}>
                                스타일 키워드
                            </TableCell>
                            <TableCell align={'center'}
width={'25%'}>
                                카테고리
                            </TableCell>
                            <TableCell align={'center'}
width={'8%'}>
                                컬러
                            </TableCell>
                            <TableCell align={'center'}
width={'8%'}>
                                패턴
                            </TableCell>
                            <TableCell align={'center'}
width={'5%'}>
                                시즌
                            </TableCell>
                            <TableCell align={'center'}
width={'10%'}>
                                등록일
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoaded && lists?.map((item) => {
                            const isListSelected = selectedLists.includes(item.id);
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell>
                                            <Checkbox
                                                checked={isListSelected}
                                                onChange={(event) => handleSelectOneList(
                                                    event,
                                                    item.id
                                                )}
                                                value={isListSelected}
                                            />
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            <ImageInListWidget imageName={item?.mainImageUrl}
                                                               imageUrl={item?.mainImageUrl} />
                                        </TableCell>
                                        <TableCell
                                            align={'center'}
                                            onClick={() => handleClick(item.productId)}
                                        >
                                            <Link sx={{cursor: 'pointer'}}>
                                                {item.nameKo}
                                            </Link>
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.productId}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.productStyleKeyWords.map(v => {
                                                return renderBrandKeyword(v);
                                            }).join(',')}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.categoryIds.length>0 && item.gender == 'F'?getDataContextValue(dataContext, 'CATEGORY_MAP', item.categoryIds[item.categoryIds.length-1], 'path'):getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', item.categoryIds[item.categoryIds.length-1], 'path')}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.colorName ? item.colorName : ''}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.patternName ? item.patternName : ''}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {item.seasonTypes ? item.seasonTypes : ''}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {getDate(item.createdDate)}
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
                {isLoaded && lists.length === 0 ?  <Stack
                    sx={{
                        height: 100,
                        width: '100%',
                        textAlign:'center',
                        mt: 15
                    }}>검색한 자료가 없습니다.</Stack> : <></>}
                {!isLoaded &&
                    <Stack
                        sx={{
                            height: 100,
                            width: '100%',
                            textAlign:'center',
                            mt: 15
                        }}>데이터 로딩 중입니다...</Stack>}
            </Scrollbar>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[20, 40, 60]}
                showFirstButton
                showLastButton
            />
        </div>
    );
};

DefaultItemList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    refreshList: PropTypes.func,
};