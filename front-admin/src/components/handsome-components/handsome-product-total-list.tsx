import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useCallback, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Checkbox,
    FormLabel,
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
import {Scrollbar} from "../scrollbar";
import {getDate, getNumberComma} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import _ from "lodash";
import toast from "react-hot-toast";
import {ImageInListWidget} from "./image-widget";
import {HandsomeProductModel} from "../../types/handsome-model/handsome-product-model"
import {useRouter} from "next/router";
import {productApi} from "../../handsome-api/product-api";
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from "@mui/icons-material/Autorenew";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {ExcelUploadDialog} from "../dialog/excel-upload-dialog";
import DownloadIcon from "@mui/icons-material/Download";
import moment from "moment";
import * as XLSX from "xlsx";


interface Search {
    size: number,
    page: number,
    id: number;
    jennieFitAssignStatus: string;
    number: string;
    displayStatus: string;
    isSoldOut: boolean;
    grade: number;
}

interface ListProps {
    lists: HandsomeProductModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    refreshList?: () => void;
    getLists?: () => void;
    selectedLists?: HandsomeProductModel[],
    selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
    selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: HandsomeProductModel) => void;
    search: Search;
}


export const HandsomeProductTotalList: FC<ListProps> = (props) => {

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
        search,
        ...other
    } = props;

    const dataContext = useContext(DataContext);

    const [idLists, setIdLists] = useState<number[]>([]);
    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);
    const [excelOpen, setExcelOpen] = useState<boolean>(false);
    const [download, setDownload] = useState<boolean>(false);

    const [open, setOpen] = React.useState(false);
    let jennieFitAssignStatusCompleted = 'COMPLETED';

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
            setSelectedLists((prevSelected) => [...prevSelected, listId]);
            setIdLists((prevSelected) => [...prevSelected, listId]);
        } else {
            setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
            setIdLists((prevSelected) => prevSelected.filter((id) => id !== listId));
        }
    };

    const handleDelete = async (): Promise<void> => {
        if (_.isEmpty(selectedLists)) {
            toast.error('선택된 내역이 없습니다.');
        } else {
            if (window.confirm('삭제하시겠습니까?')) {
                // for (const id of selectedLists) {
                await productApi.deleteProduct({
                    ids : idLists,
                    activated: false,
                })
                // }
                toast.success('삭제되었습니다.');
                setSelectedLists([]);
                setIdLists([]);
                refreshList();
            }
        }
    }

    const handleDisplayStatus = async (status) => {
        let idArr = [];
        if (_.isEmpty(selectedLists)) {
            toast.error('선택된 내역이 없습니다.');
        } else {
            if (window.confirm('변경하시겠습니까?')) {
                if(status == Object.keys(dataContext.DISPLAY_STATUS)[0]){
                    let temp = lists.filter((v) => idLists.includes(v.id) );
                    let arr = temp.filter((item) => {
                            if( item.jennieFitImageUrl == null){
                                if(idArr.length > 0){
                                    idArr.pop();
                                }
                                idArr.push(item.id)
                                toast.error(`상품 ID ${[...idArr]}는 제니핏 이미지가 존재하지 않아 진열중으로 변경 불가합니다.`)
                                return;
                            }

                            if(item.jennieFitRequestStatus !== 'REQUESTED'){
                                if(idArr.length > 0){
                                    idArr.pop();
                                }
                                idArr.push(item.id)
                                toast.error(`상품 ID ${[...idArr]}는 진열중으로 변경 불가합니다. 제니FIT 신청을 진행해주세요`)
                                return;

                            }

                            if(item.jennieFitAssignStatus !== 'COMPLETED'){
                                if(idArr.length > 0){
                                    idArr.pop();
                                }
                                idArr.push(item.id)
                                toast.error(`상품 ID ${[...idArr]}는 현재 제니FIT 검수가 완료되지 않아 진열이 불가합니다`)
                                return;

                            }
                        }
                    )

                    if(idArr.length > 0){
                        return;
                    }

                }
                await productApi.putDisplayStatus( {
                    productDisplayStatus: status,
                    ids: idLists
                })
                toast.success('변경되었습니다.');
                getLists();
                setSelectedAllLists(false);
                router.push('/handsome/handsome-product-total');
            }
        }
    }

    const handleSoldOutStatus = async () => {
        if (_.isEmpty(selectedLists)) {
            toast.error('선택된 내역이 없습니다.');
        } else {
            if (window.confirm('변경하시겠습니까?')) {
                await productApi.putSoldOutStatus( {
                    ids: idLists
                })
                toast.success('변경되었습니다.');
                getLists();
                setSelectedAllLists(false);
                router.push('/handsome/handsome-product-total');
            }
        }
    }

    const handleExcelUpload = () => {
        setExcelOpen(true);
    }

    const handleExcelClose = () => {
        setExcelOpen(false);
    }

    const getSoldOutStatus = (status) =>{
        return status ? 'Y' : 'N';
    }

    const handleExcelDownload = useCallback(async () => {
            if(count == 0) {
                window.confirm('다운로드가 가능한 자료가 없습니다.')
                return;
            }
            let test = [];
            await productApi.getProducts({...search, size: count}
            ).then(res => {
                res.lists.forEach((item) => {
                    return test.push({
                        id: item.id,
                        mainImageUrl: item.jennieFitThumbnailImageUrl,
                        productNo: item.number,
                        styleGrade: item.grade,
                        nameKo: item.name,
                        brandName: item.brand['nameEn'],
                        jenniFitStatus: dataContext.JENNIE_FIT_REQUEST[item.jennieFitRequestStatus],
                        jenniFitAssignStatus: dataContext.JENNIE_FIT_ASSIGN[item.jennieFitAssignStatus],
                        displayStatus: dataContext.DISPLAY_STATUS[item.displayStatus],
                        isSoldOut: getSoldOutStatus(item.isSoldOut),
                createdDate: getDate(item.createdDate)
                    })
                });
            });

            const excelHandler = {
                getExcelFileName:() => {
                    return "한섬_상품등록_리스트_"+ moment().format('YYYYMMDD')+'.xlsx';
                },

                getSheetName: () => {
                    return '상품리스트'
                },

                getExcelData: () =>{
                    return test;
                },

                getWorksheet: () => {
                    return XLSX.utils.json_to_sheet(excelHandler.getExcelData())
                }
            };

            const datas = excelHandler.getWorksheet();
            ['상품ID', '메인 이미지', '상품 품번', '스타일라이브 레벨', '상품명', '브랜드','제니FIT신청','FIT검수상태','진열상태', '품절상태', '등록일'].forEach((x, idx) => {
                const cellAdd = XLSX.utils.encode_cell({c:idx, r:0});
                datas[cellAdd].v = x;
            })
            datas['!cols'] = [];
            datas['!cols'][11] = { hidden: true };
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, datas, excelHandler.getSheetName());
            XLSX.writeFile(workbook, excelHandler.getExcelFileName());
            setDownload(false);
        }, [count]);


    const handleClick = (id) => {
        router.push(`/handsome/handsome-product-correction?id=${id}`);
    }

    return (
        <div {...other}>
            <Box>
                <Stack sx={{m: 1, display: 'flex', alignItems: 'end', justifyContent: 'end'}}>
                    <Stack direction={'row'}
sx={{mt: 0.5, mb: 0.5}}>
                        <Button sx={{mr: 1}}
                                color="success"
                                variant="contained"
                                startIcon={<UploadFileIcon/>}
                                size="small"
                                onClick={handleExcelUpload}>
                            엑셀 업로드
                        </Button>
                        <Button sx={{mr: 1}}
                                color="primary"
                                variant="contained"
                                startIcon={<DownloadIcon/>}
                                size="small"
                                onClick={handleExcelDownload}>
                            엑셀 다운로드
                        </Button>
                    </Stack>
                </Stack>
                <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography sx={{ml: 1}}
variant="h6">총 {getNumberComma(count)} 건</Typography>
                    <Box>
                        <Stack
                            direction='row'>
                            <Stack justifyContent={"center"}
                                   sx={{mr: 1, ml: 5, mt: 1}}>
                                <FormLabel component="legend">진열 상태 변경</FormLabel>
                            </Stack>
                            <Button sx={{mr: 1}}
                                    color="success"
                                    variant="outlined"
                                    startIcon={<AutorenewIcon/>}
                                    size="small"
                                    onClick={() =>  handleDisplayStatus('DISPLAY_END')}>
                                진열 중지
                            </Button>
                            <Button sx={{mr: 1}}
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<AutorenewIcon/>}
                                    size="small"
                                    onClick={() => handleDisplayStatus('DISPLAY_ON')}>
                                진열중
                            </Button>
                            {/*<Button sx={{mr: 1}}*/}
                            {/*        color="warning"*/}
                            {/*        variant="outlined"*/}
                            {/*        startIcon={<AutorenewIcon/>}*/}
                            {/*        size="small"*/}
                            {/*        onClick={handleSoldOutStatus}>*/}
                            {/*    품절*/}
                            {/*</Button>*/}
                            <Button sx={{mr: 1}}
                                    color="error"
                                    variant="outlined"
                                    startIcon={<DeleteIcon/>}
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
                                상품ID
                            </TableCell>
                            <TableCell align="center">
                                메인 이미지
                            </TableCell>
                            <TableCell align="center">
                                상품 품번
                            </TableCell>
                            <TableCell align="center">
                                스타일라이브 레벨
                            </TableCell>
                            <TableCell align="center">
                                상품명
                            </TableCell>
                            <TableCell align="center">
                                브랜드
                            </TableCell>
                            <TableCell align="center">
                                제니FIT신청
                            </TableCell>
                            <TableCell align="center">
                                FIT검수상태
                            </TableCell>
                            <TableCell align="center">
                                진열상태
                            </TableCell>
                            <TableCell align="center">
                                품절상태
                            </TableCell>
                            <TableCell align="center">
                                등록일
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
                                        <TableCell align="center"
                                                   onClick={() => handleClick(item.id)}
                                        >
                                            <Link sx={{cursor: 'pointer'}}>
                                                {item.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.jennieFitThumbnailImageUrl && item.jennieFitAssignStatus == jennieFitAssignStatusCompleted ?
                                                <ImageInListWidget imageName={item.name}
                                                                   imageUrl={item.jennieFitThumbnailImageUrl}/> :
                                                ''}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.number}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.grade}
                                        </TableCell>
                                        <TableCell>
                                            {item.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.brand['nameEn']}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.JENNIE_FIT_REQUEST[item.jennieFitRequestStatus]}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.JENNIE_FIT_ASSIGN[item.jennieFitAssignStatus]}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.DISPLAY_STATUS[item.displayStatus]}
                                        </TableCell>
                                        <TableCell align="center">
                                            {getSoldOutStatus(item.isSoldOut)}
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
            <ExcelUploadDialog
                onClose={handleExcelClose}
                open={excelOpen}
            />
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

HandsomeProductTotalList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    refreshList: PropTypes.func,
};