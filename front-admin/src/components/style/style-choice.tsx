import StyleFileBox from "./style-file-box";
import React, {useContext, useState} from "react";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid} from "@mui/material";
import StyleImageBox from "./style-image-box";
import Product from "../product";
import ProductSelect from "../product/product-select";
import {ProductModel} from "../../types/product-model";
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import StyleUserDress from "../user-dress/style-user-dress-index";
import StyleUserDressSelect from "../user-dress/style-user-dress-select";
import {DataContext} from "../../contexts/data-context";

const ProductDialog = (props) => {
  const {items, lookbookImage, onClose, open, categoryId = null, ...other} = props;
  const [lists, setLists] = useState<ProductModel[]>([]);

  const handleCancel = () => {
    onClose();
  };

  const handleApply = () => {
    onClose(lists);
  };

  const changeSelectedList = (lists) => {
    setLists(lists);
  }

  return (
    <Dialog
      sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
      maxWidth="xl"
      fullWidth={true}
      open={open}
      {...other}
    >
      <DialogTitle>Product</DialogTitle>
      <DialogContent dividers>
        <Product onClickApply={handleApply}
changeSelectedList={changeSelectedList}
categoryId={categoryId}
lookbookImage={lookbookImage} />
      </DialogContent>
      <DialogActions>
        <ProductSelect lists={lists}
clickApply={handleApply}></ProductSelect>
        <Button autoFocus
color="success"
onClick={handleApply}>
          적용
        </Button>
        <Button onClick={handleCancel}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const UserDressDialog = (props) => {
  const {items, lookbookImage, onClose, open, categoryId, ...other} = props;
  const [lists, setLists] = useState<ProductModel[]>([]);

  const handleCancel = () => {
    onClose();
  };

  const handleApply = () => {
    onClose(lists);
  };

  const changeSelectedList = (lists) => {
    setLists(lists);
  }

  return (
    <Dialog
      sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
      maxWidth="xl"
      fullWidth={true}
      open={open}
      {...other}
    >
      <DialogTitle>User Dress</DialogTitle>
      <DialogContent dividers>
        <StyleUserDress onClickApply={handleApply}
changeSelectedList={changeSelectedList}
categoryId={categoryId}
lookbookImage={lookbookImage} />
      </DialogContent>
      <DialogActions>
        <StyleUserDressSelect lists={lists}
clickApply={handleApply}></StyleUserDressSelect>
        <Button autoFocus
color="success"
onClick={handleApply}>
          적용
        </Button>
        <Button onClick={handleCancel}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}


const StyleChoice = (props) => {
  const dataContext = useContext(DataContext);

  const {parent, style, addStyleItem, addFileImage, deleteStyleImage, imageUrlData} = props;
  const [open, setOpen] = React.useState(false);
  const [openUserDress, setOpenUserDress] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState(null);

  const openProductHandler = (category) => {
    setCategoryId(category);
    setOpen(true);
  }

  const handleClose = (items) => {
    if (items) {
      console.log('product', items);
      addStyleItem(items);
    }
    setOpen(false);
  };

  const openUserDressHandler = (category) => {
    if (category != null) {
      setCategoryId(category);
    }
    setOpenUserDress(true);
  }

  const handleUserDressClose = (items) => {
    if (items) {
      console.log('user', items);
      const convertItems = [];
      items.forEach(item => {
        if (item.categoryId && dataContext.CATEGORY_MAP[item.categoryId]) {
          const categoryIds = dataContext.CATEGORY_MAP[item.categoryId].ids.split('/');
          console.log(dataContext.CATEGORY_MAP[item.categoryId].ids.split('/'));
          convertItems.push({
            categoryIds: categoryIds,
            colorType: item.colorType,
            patternType: item.patternType,
            mainImageUrl: item.originalImageUrl,
          })
        }
      })
      console.log('convertItems', convertItems)
      addStyleItem(convertItems);
    }
    setOpenUserDress(false);
  };

  return (
    <Box sx={{p: 1}}>
      {parent == 'AI' ? '' :
          <Box sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'right',
            pb: 1
          }}>
            <Button
                component="a"
                size="small"
                startIcon={(<CategoryIcon fontSize="small"/>)}
                sx={{ml: 1}}
                variant="contained"
                onClick={() => openProductHandler(null)}
            >
              상품 추가
            </Button>
            <Button
                component="a"
                size="small"
                startIcon={(<PersonIcon fontSize="small"/>)}
                sx={{ml: 1}}
                variant="outlined"
                onClick={openUserDressHandler}
            >
              사용자 옷 추가
            </Button>
          </Box>
      }
      <Divider/>
      <Grid
        container
        spacing={1}
        sx={{
          pt: 2
        }}
      >
        <Grid
          item
          md={6}
          xs={12}
        >
          <StyleFileBox target={'lookbook'}
                        header={style.lookbook.header}
                        addFileImage={addFileImage}
                        imageUrlData={imageUrlData} />
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
        >
          <StyleImageBox
            category={style.acc}
            addStyleImage={addStyleItem}
            deleteStyleImage={deleteStyleImage}
            productHandler={openProductHandler}
          />
        </Grid>
        {parent == 'AI' ? '' :
          <>
            <Grid
              item
              md={6}
              xs={12}
            >
              <StyleImageBox
                category={style.outer}
                addStyleImage={addStyleItem}
                deleteStyleImage={deleteStyleImage}
                productHandler={openProductHandler}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <StyleImageBox
                category={style.dress}
                addStyleImage={addStyleItem}
                deleteStyleImage={deleteStyleImage}
                productHandler={openProductHandler}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <StyleImageBox
                category={style.top}
                addStyleImage={addStyleItem}
                deleteStyleImage={deleteStyleImage}
                productHandler={openProductHandler}
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <StyleImageBox
                category={style.bottom}
                addStyleImage={addStyleItem}
                deleteStyleImage={deleteStyleImage}
                productHandler={openProductHandler}
              />
            </Grid>
          </>
        }
        <Grid
          item
          md={6}
          xs={12}
        >
          <StyleImageBox
            category={style.shoes}
            addStyleImage={addStyleItem}
            deleteStyleImage={deleteStyleImage}
            productHandler={openProductHandler}
          />
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
        >
          <StyleImageBox
            category={style.bag}
            addStyleImage={addStyleItem}
            deleteStyleImage={deleteStyleImage}
            productHandler={openProductHandler}
          />
        </Grid>
      </Grid>
      <ProductDialog
        open={open}
        onClose={handleClose}
        categoryId={categoryId}
        lookbookImage={imageUrlData}
      />
      <UserDressDialog
        open={openUserDress}
        onClose={handleUserDressClose}
        lookbookImage={imageUrlData}
      />
    </Box>
  )
};

export default StyleChoice;