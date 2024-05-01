import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@mui/material";
import _ from 'lodash';


export const BrandDialog = (props) => {

  const {items, onClose, value: valueProp, open, handleBrandChange, ...other} = props;
  const [value, setValue] = React.useState(valueProp);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = (value) => {
    onClose(value);
  };

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
        <Grid container
spacing={1}>
          {_.sortBy(items, 'nameEn').map((item) => (
            <Grid
              item
              key={item.id}
              xs={3}
            >
              <Button
                variant="contained"
                size="small"
                sx={{display: 'flex'}}
                onClick={() => handleOk(item)}
              >
                {item.nameEn}
              </Button>
            </Grid>
          ))}
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