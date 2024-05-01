import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Stack
} from "@mui/material";
import _ from 'lodash';
import ClearIcon from "@mui/icons-material/Clear";


export const BrandDialog = (props) => {
    const {items, onClose, value: valueProp, open, handleBrandChange, ...other} = props;
    //brand name
    const [value, setValue] = useState(valueProp);

    useEffect(() => {
        if (!open) {
            console.log(valueProp)
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const handleCancel = () => {
        onClose();
    };

    const handleOk = (value) => {
        onClose(value);
    };

    const handleClickClear = () => {
        setValue('');
    };

    const handleSearchBrand = (e) =>{
        e.preventDefault();
        const brandKeyword = e.target.value;
        setValue(brandKeyword.toLowerCase());
    }

    const brandSearch = _.sortBy(items, 'name').filter((item) => item.name.toLowerCase().indexOf(value) != -1 );

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxWidth: 800, maxHeight: 600}}}
            maxWidth="xs"
            open={open}
            onBackdropClick={handleCancel}
            {...other}
        >
            <DialogTitle>Brand</DialogTitle>
            <DialogContent dividers>
                <Stack sx={{mb: 4}}>
                    <FormControl>
                    <InputLabel htmlFor="brandname">브랜드</InputLabel>
                    <Input id="brandname"
type='text'
value={value}
onChange={handleSearchBrand}
                           endAdornment={
                             <InputAdornment position="end">
                               <IconButton
                                   sx={{p: 0}}
                                   onClick={() => {
                                     handleClickClear();
                                   }}
                               >
                                 <ClearIcon />
                               </IconButton>
                             </InputAdornment>
                           }/>
                    </FormControl>
                </Stack>
                <Grid container
                      spacing={1}>
                    {!value ?  _.sortBy(items, 'name').map((item) => (
                        <Grid
                            item
                            key={item.id}
                            xs={'auto'}
                        >
                            <Button
                                variant= "contained"
                                disabled={!item.activated}
                                size="small"
                                sx={{display: 'flex'}}
                                onClick={() => handleOk(item)}
                            >
                                {item.name}
                            </Button>
                        </Grid>
                    )) : brandSearch.map((item) => (<Grid
                        item
                        key={item.id}
                        xs={'auto'}
                    >
                        <Button
                            variant="contained"
                            size="small"
                            disabled={!item.activated}
                            sx={{display: 'flex'}}
                            onClick={() => handleOk(item)}
                        >
                            {item.name}
                        </Button>
                    </Grid>))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button autoFocus
                        onClick={handleCancel}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
