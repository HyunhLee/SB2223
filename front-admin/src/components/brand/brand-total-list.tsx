import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormLabel,
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
import {getDate} from "../../utils/data-convert";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {Scrollbar} from "../scrollbar";
import React, {ChangeEvent, FC, Fragment, MouseEvent, useContext, useEffect, useState} from "react";
import {DataContext, renderBrandKeyword} from "../../contexts/data-context";
import {BrandModel} from "../../types/brand-model";
import PropTypes from "prop-types";
import BrandRegisterDetail from "./brand-register-detail";
import {brandApi} from "../../api/brand-api";


interface ListProps {
    lists: BrandModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    getBrandLists?: () => void;
    setLists: any[];
    setRequestList: boolean;
    selectedLists?: BrandModel[];
    selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
    selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: BrandModel) => void;
}

const BrandDetailDialog = (props) => {
    const {item, setLists, open, onClose, lists} = props;

    const handleCancel = () => {
        onClose();
    };

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 900}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
        >
            <DialogContent dividers
                           style={{height: '1000px'}}>
                <BrandRegisterDetail item={item}
                                     setItem={setLists}
                                     lists={lists}/>
            </DialogContent>
            <DialogActions>
                <Button color="error"
                        variant="contained"
                        onClick={handleCancel}>
                    닫기
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export const BrandTotalList: FC<ListProps> = (props) => {
    const {
        lists,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        getBrandLists,
        setLists,
        setRequestList,
        ...other
    } = props;

    const dataContext = useContext(DataContext);
    const [open, setOpen] = useState<boolean>(false);


    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);
    const [brand, setBrand] = useState([])


    useEffect(() => {
        setSelectedLists([]);
    }, [lists]);


    const handleSelectOneList = (
        item: number
    ): void => {
        if (!selectedLists.includes(item)) {
            setSelectedLists((prevSelected) => [...prevSelected, item]);
        } else {
            setSelectedLists((prevSelected) => prevSelected.filter((listItem) => listItem !== item));
        }
    };


    const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAllLists(event.target.checked);
        // @ts-ignore
        setSelectedLists(event.target.checked ? lists.map((list) => list.id ) : []);

    };

    const handleDisplayStatusActive = async () => {
        if (selectedLists.length == 0) {
            window.confirm('상태를 변경할 브랜드를 선택해주세요.');
            return;
        }
        let result = await brandApi.changeActiveStatus(selectedLists);
        window.confirm(result)
        // @ts-ignore
        setRequestList(true);
        setSelectedLists([]);
        setSelectedAllLists(false);
    }

    const handleDisplayStatusInactive = async () => {
        if (selectedLists.length == 0) {
            window.confirm('상태를 변경할 브랜드를 선택해주세요.');
            return;
        }
        let confirmMessage = window.confirm('진열중지로 변경 후 진열중 상태로 변경이 불가합니다. 해당 브랜드를 진열중지 상태로 변경하시겠습니까?');
        if (confirmMessage) {
            let result = await brandApi.changeInactiveStatus(selectedLists);
            window.confirm(result)
        }
        // @ts-ignore
        setRequestList(true);
        setSelectedLists([]);
        setSelectedAllLists(false);
    }

    const handleOpenDetail = (item) => {
        setBrand(item)
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setBrand([])
        getBrandLists();
    };


    return (
        <>
            <div {...other}>
                <Box>
                    <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="h6">총 {count} 건</Typography>
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
                                        onClick={handleDisplayStatusInactive}
                                >
                                    진열 중지
                                </Button>
                                <Button sx={{mr: 1}}
                                        color="primary"
                                        variant="outlined"
                                        startIcon={<AutorenewIcon/>}
                                        size="small"
                                        onClick={handleDisplayStatusActive}
                                >
                                    진열중
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
                                    브랜드ID
                                </TableCell>
                                <TableCell align="center">
                                    브랜드
                                </TableCell>
                                <TableCell align="center">
                                    키워드
                                </TableCell>
                                <TableCell align="center">
                                    진열상태
                                </TableCell>
                                <TableCell align="center">
                                    등록일
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lists?.map((item) => {
                                // @ts-ignore
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
                                                    onChange={() => handleSelectOneList(
                                                        item.id
                                                    )}
                                                    value={isListSelected}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {item.id}
                                            </TableCell>
                                            <TableCell align="center"
                                                       onClick={() => handleOpenDetail(item)}
                                                       sx={{cursor: 'pointer'}}>
                                                {item.name}
                                            </TableCell>
                                            <TableCell align="center">
                                                {item.keywords?.map((data) => data.name).map((k) => renderBrandKeyword(k)).join(' , ')}
                                            </TableCell>
                                            <TableCell align="center">
                                                {item.activated ? (dataContext.BRAND_DISPLAY_STATUS['DISPLAY_ON']) : (dataContext.BRAND_DISPLAY_STATUS['DISPLAY_END'])}
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
                    rowsPerPageOptions={[20, 40, 60]}
                    showFirstButton
                    showLastButton
                />
                <BrandDetailDialog
                    open={open}
                    onClose={handleClose}
                    item={brand}
                />
            </div>
        </>
    );
}
BrandTotalList.propTypes = {
    lists: PropTypes.array.isRequired,
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};