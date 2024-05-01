import {
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    Card,
    Grid,
    FormControlLabel,
    Switch,
    Stack,
    Typography, TextField
} from "@mui/material";
import {PropertyListItem} from "../property-list-item";
import ProductRegisterDetail from "./product-register-detail";
import {useTranslation} from "react-i18next";
import React, {useContext, useEffect, useState} from "react";
import {DataContext} from "../../contexts/data-context";
import {b2bProductApi} from "../../api/btb-product-api";
import {toast} from "react-hot-toast";
import SaveIcon from "@mui/icons-material/Save";
import {defaultProductColorModel, ProductColorModel} from "../../types/btb-product-color-model";

const ProductCorrection = (props) => {
    const {open, item, close} = props;
    const {t} = useTranslation();
    const dataContext = useContext(DataContext);
    const [product, setProduct] = useState<ProductColorModel>(defaultProductColorModel);
    const [displayStatus, setDisplayStatus] = useState(item.displayStatus == 'DisplayEnd');
    const [correct, setCorrect] = useState<boolean>(false);
    const [complete, setComplete] = useState<boolean>(false);
    const state = 'cor';
    const [curColor, setCurColor]= useState([]);

    useEffect(() => {
        if (open) {
            getProduct();
            if (item.fitRequestStatus == 'Inspection') {
                setCorrect(true);
            } else if (item.fitRequestStatus == 'Completed') {
                setComplete(true);
            }
        }
    }, [open]);

    useEffect(() => {
        setDisplayStatus(item.displayStatus == 'DisplayEnd')
    }, [item, close])

    const getProduct = async () => {
        await b2bProductApi.getOneProduct(item.productId).then(res => {
            setProduct(res);
            const curColorValue = res.productColors.filter((value) => value.id == item.id)
            setCurColor([...curColorValue]);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleCancel = () => {
        close();
        setCorrect(false);
        setComplete(false);
    };

    const toggleDisplayStatus = () => {
        if (displayStatus) {
            setDisplayStatus(!displayStatus)
            setProduct({...product, displayStatus: 'DisplayOn'})
        } else {
            setDisplayStatus(!displayStatus)
            setProduct({...product, displayStatus: 'DisplayEnd'})
        }
    }

    const handlePutProduct = async () => {
        if (product.nameKo && product.nameEn && product.brandId && product.detailSiteUrl && product.categoryIds.length > 1) {
            if (product.nameKo.trim() && product.nameEn.trim() && product.brandId && product.detailSiteUrl.trim() && product.fitRequestStatus == 'InputWait') {
                product.fitRequestStatus = "InputComplete";
            }
        } else {
            product.fitRequestStatus = "InputWait";
        }
        if (window.confirm(t("component_btbProduct_productCorrection_putProduct_window"))) {
            if (product.categoryIds.length == 1 && product.categoryIds[0] == 2) {
                toast.error(`${t("component_btbProduct_productTotalList_toastError_categoryBottom")}`)
                return;
            }
            product.mallId = Number(localStorage.getItem('mallId'));
            product.priceNormal = Number(String(product.priceNormal).replace(",", ""));
            product.priceDiscount = Number(String(product.priceDiscount).replace(",", ""));
            await b2bProductApi.putProduct(product
            ).then(res => {
                console.log(res);
                toast.success(`${t("toast_success_correction")}`);
                close();
            }).catch(err => {
                console.log(err);
            })
        } else {
            return;
        }
    }




    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
            maxWidth="lg"
            fullWidth={true}
            open={open}
        >
            <DialogActions>
                <Button color="primary"
                        variant="contained"
                        startIcon={<SaveIcon fontSize="small"/>}
                        onClick={handlePutProduct}>
                    {t('button_correction')}
                </Button>
            </DialogActions>
            <DialogContent>
                <Card sx={{px: 2, py:0, mb: 1}}>
                    <Grid sx={{display: 'flex', mt: 2}}>
                        <PropertyListItem
                            label={`${t('label_displayStatus')}`}
                            sx={{width: 100}}
                        />
                        <FormControlLabel
                            sx={{display: 'block', mt: 2.3}}
                            control={
                                <Switch
                                    checked={!displayStatus}
                                    onChange={toggleDisplayStatus}
                                    disabled={product.fitRequestStatus !== 'Completed'}
                                    name="loading"
                                    color="primary"
                                    sx={{mr: 2}}
                                />
                            }
                            label={displayStatus ? `${t('label_displayEnd')}` : `${t('label_displayOn')}`}
                        />
                    </Grid>
                    <Stack direction={'row'} sx={{mb: 2}}>
                        <Grid sx={{display: 'flex', mr: 10, width: 340}}>
                            <PropertyListItem
                                label={`${t('label_jennieFit')}`}
                                sx={{width: 100}}
                            />
                            <Typography
                                sx={{mt: 3}}>{dataContext.JENNIE_FIT_REQUEST_TYPE[item.fitRequestType]}</Typography>
                        </Grid>
                        <Stack direction={'row'}>
                            <PropertyListItem
                                label={`${t('label_status')}`}
                                sx={{width: 80}}
                            />
                            <Stack direction={'row'} sx={{display: 'flex',alignItems: 'center'}}>
                            <Typography
                                sx={{mb: 0.5, mr:1.5}}>{dataContext.REQUEST_STATUS[curColor[0]?.fitRequestStatus]}</Typography>
                            {curColor[0]?.fitRequestStatus === 'Rejected' ?
                              <Typography sx={{border: '1px solid #efefef', borderRadius: 1, p: 1, fontSize: '13px'}}>{curColor[0].message}</Typography>
                              :<></>
                            }
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
                <Card sx={{pt: 1}}>
                    <ProductRegisterDetail data={product} setData={setProduct} state={state} correct={correct}
                                           complete={complete}/>
                </Card>
            </DialogContent>
            <DialogActions>
                <Button color="error"
                        variant="contained"
                        onClick={handleCancel}>
                    {t('button_close')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProductCorrection;