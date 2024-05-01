import {Scrollbar} from "../scrollbar";
import {
    Dialog, DialogActions, DialogContent, Grid,
    Table, TableBody, TableCell, TableHead, TableRow,
    Button, Stack, TextField, IconButton, TablePagination
} from "@mui/material";
import React, {Fragment, useState} from "react";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import LaunchIcon from "@mui/icons-material/Launch";


const BrandInfoDialog = (props) => {
    const {open, data, onClose} = props;

    const handleCancel = () => {
        onClose();
    };

    const handleOpenUrl = () => {
        const ShopUrl = (document.getElementById('shopUrl') as HTMLInputElement).value;
        return window.open(ShopUrl, '_blank')
    };

    return (
        <Dialog sx={{'& .MuiDialog-paper': {maxHeight: 500}}}
                maxWidth={'md'}
                fullWidth={true}
                open={open}>
            <DialogContent dividers style={{height: '400px', padding: '100px 50px'}}>
                <PropertyList>
                    <Grid sx={{display: 'flex', justifyContent: "space-between", alignItems: 'center'}}>
                        <PropertyListItem label={'브랜드명(국문)'} sx={{width: 200}}/> <TextField sx={{width: 300, mr: 3}}
                                                                                            value={data.brandNameKo}
                                                                                            disabled={true}/>
                        <PropertyListItem label={'브랜드명(영문)'} sx={{width: 200}}/> <TextField sx={{width: 300}}
                                                                                            value={data.brandNameEn}
                                                                                            disabled={true}/>
                    </Grid>
                </PropertyList>
                <PropertyList>
                    <Stack direction={'row'} sx={{mt: 4}}>
                        <PropertyListItem label={'쇼핑몰URL'} sx={{width: 200}}/>
                        <TextField
                            sx={{minWidth: 500, mt: 1, ml: -3}}
                            id='shopUrl'
                            disabled={true}
                            defaultValue={data.brandShopUrl}
                        />
                        <IconButton color="primary"
                                    component="span"
                                    sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                    onClick={handleOpenUrl}
                        >
                            <LaunchIcon/>
                        </IconButton>
                    </Stack>
                </PropertyList>
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


const BrandDetail = (props) => {
    const {data} = props;
    const [open, setOpen] = useState(false);
    const [brand, setBrand] = useState('');
    const pagecount = 20;

    const handleClick = (value) => {
        console.log(value)
        setOpen(true);
        setBrand(value);
    }

    const handleClose = () => {
        setOpen(false);
        setBrand('');
    };


    return (
        <>
            <Stack>
                <Scrollbar>
                    <Table sx={{minWidth: '100%'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{width: '80%', textAlign: 'start', px: 5}}>
                                    {'브랜드'}
                                </TableCell>
                                <TableCell align="center">
                                    {'등록일'}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((item) => {
                                return (
                                    <Fragment key={item.id}>
                                        <TableRow
                                            hover
                                            key={item.id}
                                        >
                                            <TableCell align="center"
                                                       sx={{cursor: 'pointer', textAlign: 'start', px: 5}}
                                                       onClick={() => handleClick(item)}>
                                                {item.brandNameKo}
                                            </TableCell>
                                            <TableCell align="center">
                                                {item.registrationDate}
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Scrollbar>
                {pagecount > 10 ? <TablePagination
                    component="div"
                    count={0}
                    onPageChange={() => {
                    }}
                    onRowsPerPageChange={() => {
                    }}
                    page={0}
                    rowsPerPage={10}
                    rowsPerPageOptions={[10, 20, 30]}
                    showFirstButton
                    showLastButton
                /> : <></>}

                <BrandInfoDialog open={open} onClose={handleClose} data={brand}/>
            </Stack>
        </>
    )
}

export default BrandDetail;