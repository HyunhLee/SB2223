import {
    Box,
    Stack,
    Typography,
    Grid,
    Button,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    TablePagination,
    Checkbox,
    Link,
    TableContainer
} from "@mui/material";
import React, {ChangeEvent, Fragment, useContext, useState, MouseEvent, FC} from 'react';
import {Scrollbar} from "../scrollbar";
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {ImageInListWidget} from "../widgets/image-widget";
import {DataContext} from "../../contexts/data-context";
import {getDataContextValue, getDate} from "../../utils/data-convert";
import {useTranslation} from "react-i18next";
import ProductCorrection from "./product-correction";
import {ProductModel} from "../../types/btb-product-model";
import {toast} from "react-hot-toast";
import _ from "lodash";
import {b2bProductApi} from "../../api/btb-product-api";
import {btbJennieFitAssignmentApi} from "../../api/btb-jennie-fit-assignment-api";
import {ReasonTooltip} from "../widgets/custom-tooltip";


interface ListProps {
    data: ProductModel[];
    count: number;
    onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    page: number;
    rowsPerPage: number;
    getProductList: () => void;
}

const ProductTotalList: FC<ListProps> = (props) => {
    const {
        data,
        count,
        onPageChange,
        onRowsPerPageChange,
        page,
        rowsPerPage,
        getProductList
    } = props;
    let items = data;
    const {t} = useTranslation();

    const dataContext = useContext(DataContext);
    const [idLists, setIdLists] = useState<number[]>([]);
    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [productDetail, setProductDetail] = useState([]);
    const result = [];
    const [reason, setReason] = useState({id: null, message:''})
    const gender = localStorage.getItem('mallGender');

    const getProductColorsForRequestJennieFit = (list) => {
        const mergedItems = {};
        for (const item of items) {
            if (list.includes(item.id)) {
                if (mergedItems[item.productId]) {
                    mergedItems[item.productId].push(item.id);
                } else {
                    mergedItems[item.productId] = [item.id];
                }
            }
        }

        for (const [productId, productColorIds] of Object.entries(mergedItems)) {
            result.push({ productId: Number(productId), productColorIds });
        }
    }

    const handleRequestJennieFit = async () => {
        //유저의 패키지 내용 갯수
        //유저가 신청 완료한 갯수
        let idArr = [];
        if (_.isEmpty(selectedLists)) {
            toast.error(`${t("toast_error")}`);
        } else {
            if (window.confirm(t("window_confirm"))) {
                let temp = data.filter((v) => idLists.includes(v.id));
                let arr = temp.filter((item) => {
                    if (item.fitRequestStatus === "Completed") {
                        if (idArr.length > 0) {
                            idArr.pop();
                        }
                        idArr.push(item.id)
                        toast.error(`${t('component_btbProduct_productTotalList_toastError_complete', {number: [...idArr]})}`)
                        return;
                    } else if (item.fitRequestStatus === "Inspection" || item.fitRequestStatus === "InputWait" || item.fitRequestStatus === "Rejected") {
                        if (idArr.length > 0) {
                            idArr.pop();
                        }
                        idArr.push(item.id)
                        if (item.fitRequestStatus == 'Inspection') {
                            toast.error(`${t("component_btbProduct_productTotalList_toastError_requestStatusInspection", {number: [...idArr]})}`)
                            return;
                        }else if(item.fitRequestStatus == 'InputWait'){
                            toast.error(`${t('component_btbProduct_productTotalList_toastError_requestStatus', {number: [...idArr]})}`)
                            return;
                        }else if(item.fitRequestStatus == 'Rejected'){
                            toast.error(`${t('component_btbProduct_productTotalList_toastError_requestStatusRejected', {number: [...idArr]})}`)
                            return;
                        }

                    } else if (item.categoryIds.length == 1 && item.categoryIds[0] == 2) {
                        if (idArr.length > 0) {
                            idArr.pop();
                        }
                        idArr.push(item.id)
                        toast.error(`${t("component_btbProduct_productTotalList_toastError_categoryBottom")}`)
                        return;
                    }
                })
                if (idArr.length > 0) {
                    return;
                }

                //선택된 상품들의 productId와 productProductColorIds
                getProductColorsForRequestJennieFit(idLists)

                const resultStatus = await btbJennieFitAssignmentApi.postJennieFit(result)
                if (resultStatus == 201) {
                    toast.success(`${t("toast_success_change")}`);
                    getProductList();
                    setIdLists([]);
                    setSelectedLists([]);
                    setSelectedAllLists(false);
                }
            } else {
                return;
            }

        }
    }

    const handleDelete = async () => {
        if (_.isEmpty(selectedLists)) {
            toast.error(`${t("toast_error")}`);
        } else {
            if (window.confirm(t("window_delete_confirm"))) {
                let data: { ids: number[], activated: boolean } = {
                    ids: selectedLists,
                    activated: false
                }
                const result = await b2bProductApi.patchProductSoldOutStatusAndDelete(data)
                if(result ==200){
                toast.success(`${t("toast_success_delete")}`);
                getProductList();
                setSelectedLists([]);
                setIdLists([]);
            }
        }
    }
    }

    const handleDisplayStatus = async (status) => {
        if (_.isEmpty(selectedLists)) {
            toast.error(`${t("toast_error")}`);
        } else {
            let idArr = [];
            let selectedArr = [];
            if (window.confirm(t("window_confirm"))) {
                if (status == Object.keys(dataContext.BTB_STATUS_LIST)[0]) {
                    //선택된 id에 따라서 리스트에서 아이디값을 찾아낸다.
                    let temp = items.filter((v) => selectedLists.includes(v.id))
                    let arrTemp = items.filter((v) => selectedLists.includes(v.id) ? selectedArr.push(v.productId) : '')
                    let arr = temp.filter((item) => {
                        if (item.displayStatus === 'DisplayOn') {
                            if (idArr.length > 0) {
                                idArr.pop();
                            }
                            idArr.push(item.productId)
                            toast.error(`${t("component_btbProduct_productTotalList_toastError_displayOn", {number: [...idArr]})}`)
                            return;
                        }

                        if (item.fitRequestStatus !== 'Completed') {
                            if (idArr.length > 0) {
                                idArr.pop();
                            }
                            idArr.push(item.productId)
                            toast.error(`${t("component_btbProduct_productTotalList_toastError_displayOnValidation", {number: [...idArr]})}`)
                            return;
                        }

                    })
                    if (idArr.length > 0) {
                        return;
                    }

                } else if (status == Object.keys(dataContext.BTB_STATUS_LIST)[1]) {
                    if(window.confirm('선택한 productId에 해당하는 모든 컬러가 진열 중지됨을 알려드립니다. 진행하시겠습니까?')){
                        let temp = items.filter((v) => selectedLists.includes(v.id))
                        let arrTemp = items.filter((v) => selectedLists.includes(v.id) ? selectedArr.push(v.productId) : '')
                        let arr = temp.filter((item) => {
                            if (item.displayStatus === 'DisplayEnd') {
                                if (idArr.length > 0) {
                                    idArr.pop();
                                }
                                idArr.push(item.productId)
                                toast.error(`${t("component_btbProduct_productTotalList_toastError_displayEnd", {number: [...idArr]})}`)
                                return;
                            }

                        })
                        if (idArr.length > 0) {
                            return;
                        }
                    }
                }

                const set = new Set(selectedArr);
                let removeDuplicate = [...set];
                const responseStatus = await b2bProductApi.patchProductStatus({
                    ids: removeDuplicate,
                    displayStatus: status,
                })

                if(responseStatus == 200){
                    toast.success(`${t("toast_success_change")}`)
                    getProductList();
                    setSelectedLists([]);
                    setIdLists([]);
                }
            }

        }

    }

    const handleSoldOutStatus = async (props) => {
        let data: { ids: number[], isSoldOut: boolean } = {
            ids: [],
            isSoldOut: false,
        }

        if (_.isEmpty(selectedLists)) {
            toast.error(`${t("toast_error")}`);
        } else {
            let idArr = [];
            if (window.confirm(t("window_confirm"))) {
                if (props == Object.keys(dataContext.BTB_STATUS_LIST)[2]) {
                    let temp = items.filter((v) => selectedLists.includes(v.id))
                    let arr = temp.filter((item) => {
                        if (item.isSoldOut) {
                            idArr.push(item.id)
                            toast.error(`${t("component_btbProduct_productTotalList_toastError_isSoldOut", {number: [...idArr]})}`)
                            return;
                        }
                    })

                    if (idArr.length > 0) {
                        return;
                    }

                    data = {
                        ids: selectedLists,
                        isSoldOut: true,
                    }

                } else {
                    let temp = items.filter((v) => selectedLists.includes(v.id))
                    let arr = temp.filter((item) => {
                        if (!item.isSoldOut) {
                            idArr.push(item.id)
                            toast.error(`${t("component_btbProduct_productTotalList_toastError_inSale", {number: [...idArr]})}`)
                            return;
                        }
                    })

                    if (idArr.length > 0) {
                        return;
                    }

                    data = {
                        ids: selectedLists,
                        isSoldOut: false,
                    }
                }

                const resultStatus = await b2bProductApi. patchProductSoldOutStatusAndDelete(data)
                if(resultStatus == 200){
                    toast.success(`${t("toast_success_change")}`)
                    getProductList();
                    setSelectedLists([]);
                    setIdLists([]);
                }
            }

        }
    }

    const handleOpenDetailDialog = async (item) => {
        setProductDetail(item);
        setOpenDetailDialog(true);
    }

    const handleCloseDetailDialog = () => {
        setOpenDetailDialog(false);
        getProductList();
    };

    const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAllLists(event.target.checked);
        setSelectedLists(event.target.checked
            ? items.map((list) => list.id)
            : []);
        setIdLists(event.target.checked
            ? items.map((list) => list.id)
            : []);
    };

    const handleSelectOneList = (
        event: ChangeEvent<HTMLInputElement>,
        listId: number
    ): void => {
        setSelectedAllLists(false)
        if (!selectedLists.includes(listId)) {
            setSelectedLists((prevSelected) => [...prevSelected, listId]);
            setIdLists((prevSelected) => [...prevSelected, listId]);
        } else {
            setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
            setIdLists((prevSelected) => prevSelected.filter((id) => id !== listId));
        }
    };

    const handleUnworkableReason = async (id, productId) => {
        const res = await b2bProductApi.getTheReason(id, productId)
        setReason({id: id, message: res});
    }


    const switchGenderCategories = (data) => {
        if(gender == 'F'){
            return getDataContextValue(dataContext, 'FEMALE_CATEGORY_MAP', data.categoryIds[data.categoryIds.length - 1], 'path')
        }else{
            return getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', data.categoryIds[data.categoryIds.length - 1], 'path')
        }
    }


    return (
        <div>
            <Box>
                <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Typography variant="h6">총 {count} 건</Typography>
                    <Box>
                        <Stack direction='row'>
                            <Button sx={{mr: 1}}
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<AutorenewIcon/>}
                                    size="small"
                                    onClick={() => handleDisplayStatus('DisplayOn')}
                            >
                                {t('button_displayOn')}
                            </Button>
                            <Button sx={{mr: 1}}
                                    color="primary"
                                    variant="outlined"
                                    startIcon={<AutorenewIcon/>}
                                    size="small"
                                    onClick={() => handleDisplayStatus('DisplayEnd')}
                            >
                                {t('button_displayOff')}
                            </Button>
                            <Button sx={{mr: 1}}
                                    color="success"
                                    variant="outlined"
                                    startIcon={<AutorenewIcon/>}
                                    size="small"
                                    onClick={handleRequestJennieFit}
                            >
                                {t('button_requestJennieFit')}
                            </Button>
                            <Button sx={{mr: 1}}
                                    color="warning"
                                    variant="outlined"
                                    startIcon={<AutorenewIcon/>}
                                    size="small"
                                    onClick={() => handleSoldOutStatus('IsSoldOut')}
                            >
                                {t('button_soldOut')}
                            </Button>
                            <Button sx={{mr: 1}}
                                    color="warning"
                                    variant="outlined"
                                    startIcon={<AutorenewIcon/>}
                                    size="small"
                                    onClick={() => handleSoldOutStatus('InSale')}
                            >
                                {t('button_forSale')}
                            </Button>
                            <Button sx={{mr: 1}}
                                    color="error"
                                    variant="outlined"
                                    startIcon={<DeleteIcon/>}
                                    size="small"
                                    onClick={handleDelete}
                            >
                                {t('button_delete')}
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
                <TableContainer sx={{minWidth: '100%'}}>
                <Table sx={{width: '2100px'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell width='2%'>
                                <Checkbox
                                    checked={selectedAllLists}
                                    onChange={handleSelectAllLists}
                                />
                            </TableCell>
                            <TableCell align="center" width='2%'>
                                {t('label_image')}
                            </TableCell>
                            <TableCell align="center"  width='4%'>
                                {t('label_productId')}
                            </TableCell>
                            <TableCell align="center" width='17%'>
                                {t('label_nameKo')}
                            </TableCell>
                            <TableCell align="center" width='9%'>
                                {t('label_brand')}
                            </TableCell>
                            <TableCell align="center" width='13%'>
                                {t('label_category')}
                            </TableCell>
                            <TableCell align="center" width='5%'>
                                {t('label_color')}
                            </TableCell>
                            <TableCell align="center" width='5%'>
                                {t('label_jennieFit')}
                            </TableCell>
                            <TableCell align="center" width='5%'>
                                {t('label_soldOutStatus')}
                            </TableCell>
                            <TableCell align="center" width='5%'>
                                {t('label_displayStatus')}
                            </TableCell>
                            <TableCell align="center" width='5%'>
                                {t('label_status')}
                            </TableCell>
                            <TableCell align="center" width='9%'>
                                {t('label_registrationType')}
                            </TableCell>
                            <TableCell align="center" width='9%'>
                                {t('label_registrationDate')}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((item, index) => {
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
                                        <TableCell align="center" >
                                            <Link href={"#"}>
                                                {item.mainImageUrl ?
                                                    <ImageInListWidget imageName={item.nameKo}
                                                                       imageUrl={item.mainImageUrl}/> :
                                                    ''}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center" sx={{cursor: 'pointer'}}
                                                   onClick={() => handleOpenDetailDialog(item)}>
                                            {item.productId}
                                        </TableCell>
                                        <TableCell align="left" sx={{minWidth: 400, cursor: 'pointer'}}
                                                   onClick={() => handleOpenDetailDialog(item)}>
                                            {item.nameKo}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.brandName}
                                        </TableCell>
                                        <TableCell align="left">
                                            {item.categoryIds[0] ? switchGenderCategories(item) : ''}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.colorName}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.JENNIE_FIT_REQUEST_TYPE[item.fitRequestType]}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.isSoldOut ? '품절' : '정상'}
                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.DISPLAY_STATUS[item.displayStatus]}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box>
                                                {dataContext.REQUEST_STATUS[item.fitRequestStatus]}
                                            </Box>
                                            <ReasonTooltip title={reason?.id == item.id ? reason?.message: ''} placement="top" >
                                                {item.fitRequestStatus == "Rejected" ?
                                                  <Button
                                                    variant={'contained'}
                                                    color={'error'}
                                                    sx={{width: 85, height: 30, fontSize: '0.7rem'}}
                                                    onClick={() => handleUnworkableReason(item.id, item.productId)}
                                                  >
                                                      사유보기
                                                  </Button> : <></>}
                                            </ReasonTooltip>

                                        </TableCell>
                                        <TableCell align="center">
                                            {dataContext.REGISTRATION_TYPE[item.registrationType]}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.createdDate ? getDate(item.createdDate) : ''}
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
                </TableContainer>
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
            <ProductCorrection
                open={openDetailDialog}
                close={handleCloseDetailDialog}
                item={productDetail}
            />
        </div>
    );
}

export default ProductTotalList;