import React, {useEffect, useState} from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog, DialogActions, DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Typography
} from "@mui/material";
import {ProductModel} from "../../types/product-model";

const ProductSelect = (props) => {
  const {lists, clickApply} = props;

  const renderProduct = () => {
    return lists.map(item => {
      return (
        <div key={item.id} style={{marginRight: 8}}>
          <Typography variant={'subtitle2'}>{item.nameKo} ,</Typography>
        </div>
      )
    })
  }

  const handleClick = () => {
    clickApply(lists);
  }

  return (
    <Box sx={{p: 1, width: '100%'}}>
      <Box sx={{
        alignItems: 'start',
        display: 'flex',
        justifyContent: 'start',
      }}>
        {renderProduct()}
      </Box>
    </Box>
  )
};

export default ProductSelect;