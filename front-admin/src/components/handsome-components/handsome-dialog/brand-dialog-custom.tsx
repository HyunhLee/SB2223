import React, {FC, useContext, useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@mui/material";
import _ from 'lodash';
import {DataContext} from "../../../contexts/data-context";
import {Brand} from "../../../types/popular-search-words";

interface BrandDialogProps {
  /**
   * 다이얼 로그 open
   */
  dialogControl?: boolean;

  /**
   * 선택된 item 보내기
   */
  selectBrandItem?: (brandObject?: Brand)=>void;

}

export const BrandDialogCustom:FC <BrandDialogProps> = ({ dialogControl , selectBrandItem }) => {
  // const {items, onClose, value: valueProp, open, handleBrandChange, ...other} = props;
  const dataContext = useContext(DataContext);

  const brandItem = dataContext.BRAND;

  const [dialogOpenClose, setDialogOpenClose] = useState<boolean>(true);

  useEffect(()=>{
    setDialogOpenClose(prevState => !prevState)
  },[dialogControl])



  const handleDialogClose = ()=>{
    setDialogOpenClose(false)
  }

  /**
   * 브랜드 이름 클릭시 데이터 넘기기
   * @param brandObject
   */
  const onBrandNameClick = (brandObject?: Brand)=>{
    handleDialogClose();
    selectBrandItem(brandObject);
  }

  return (
    <Dialog
      sx={{'& .MuiDialog-paper': {maxWidth: 800, maxHeight: 600}}}
      maxWidth="xs"
      open={dialogOpenClose}
      onBackdropClick={handleDialogClose}

    >
      <DialogTitle>Brand</DialogTitle>
      <DialogContent dividers>
        <Grid container
spacing={1}>
          {_.sortBy(brandItem, 'name').map((item) => (
            <Grid
              item
              key={item.id}
              xs={3}
            >
              <Button
                variant="contained"
                size="small"
                sx={{display: 'flex'}}
                onClick={()=>onBrandNameClick(item)}
              >
                {item.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus
onClick={handleDialogClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BrandDialogCustom;