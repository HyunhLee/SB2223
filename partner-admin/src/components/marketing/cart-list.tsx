import React, {ChangeEvent, Fragment, useContext, useState} from 'react';
import {
  Checkbox,
 Link,
  Table,
  TableBody,
  TableCell,
  TableHead, TablePagination,
  TableRow,
  Stack,
  Typography
} from "@mui/material";
import {Scrollbar} from "../scrollbar";
import {ImageInListWidget} from "../widgets/image-widget";
import {useTranslation} from "react-i18next";
import {DataContext} from "../../contexts/data-context";

//cart 관련 리스트에 재활용할 코드
const CartList = (props) => {
  const {
    count,
    items,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage
  } = props


  const {t} = useTranslation();
  const dataContext = useContext(DataContext);

  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

  const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedAllLists(event.target.checked);
    setSelectedLists(event.target.checked
      ? items.map((list) => list.product.id)
      : []);
  };

  const handleSelectOneList = (
    event: ChangeEvent<HTMLInputElement>,
    listId: number
  ): void => {
    setSelectedAllLists(false)
    if (!selectedLists.includes(listId)) {
      setSelectedLists((prevSelected) => [...prevSelected, listId]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
    }
  };

  const getCategory = (value) => {
   const result = dataContext.CATEGORY_GROUP.find((item) => item.groupId === value)
    return result.groupName
  }

  const getImage = (item) => {
    if(item.product.fitRefImageUrl == ''){
      return item.thumnailImage
    }else{
      return item.product.fitRefImageUrl
    }
  }

  return(
    <>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 20, 30]}
        showFirstButton
        showLastButton
      />
      <Scrollbar>
        <Table sx={{minWidth: '100%', position: 'relative', minHeight: 200}}>
          <TableHead>
            <TableRow>
                {/*<TableCell padding="checkbox">*/}
                {/*  <Checkbox*/}
                {/*    checked={selectedAllLists}*/}
                {/*    onChange={handleSelectAllLists}*/}
                {/*  />*/}
                {/*</TableCell>*/}
                <TableCell align="center">
                    {t('label_image')}
                </TableCell>
                <TableCell align="center">
                    {t('label_productNo')}
                </TableCell>
                <TableCell align="center">
                    {t('label_nameKo')}
                </TableCell>
                <TableCell align="center">
                {t('label_brand')}
              </TableCell>
              <TableCell align="center">
                {t('label_category')}
              </TableCell>
              <TableCell align="center">
                {t('label_price')}
              </TableCell>
              <TableCell align="center">
                {t('label_countsInCart')}
              </TableCell>
            </TableRow>
          </TableHead>
          {items.length > 0 ?
              <TableBody>
              {items?.map((item, index) => {
                const isListSelected = selectedLists.includes(item.product.id);
                return (
                  <Fragment key={item.product.id}>
                      <TableRow
                          hover
                          key={item.product.id}
                      >
                          {/*<TableCell*/}
                          {/*  padding="checkbox"*/}
                          {/*  sx={{*/}
                          {/*    ...(open && {*/}
                          {/*      position: 'relative',*/}
                          {/*      '&:after': {*/}
                          {/*        position: 'absolute',*/}
                          {/*        content: '" "',*/}
                          {/*        top: 0,*/}
                          {/*        left: 0,*/}
                          {/*        width: 3,*/}
                          {/*        height: 'calc(100% + 1px)'*/}
                          {/*      }*/}
                          {/*    })*/}
                          {/*  }}*/}
                          {/*  width="25%"*/}
                          {/*>*/}
                          {/*  <Checkbox*/}
                          {/*    checked={isListSelected}*/}
                          {/*    onChange={(event) => handleSelectOneList(*/}
                          {/*      event,*/}
                          {/*      item.product.id*/}
                          {/*    )}*/}
                          {/*    value={isListSelected}*/}
                          {/*  />*/}
                          {/*</TableCell>*/}
                          <TableCell align="center" sx={{width: 100}}>
                                  {getImage(item) ?
                                      <ImageInListWidget imageName={item.product.nameKo}
                                                         imageUrl={getImage(item)}/> :
                                      ''}
                          </TableCell>
                          <TableCell align="center">
                              {item.product.productNo}
                      </TableCell>
                      <TableCell align="left" sx={{width: 650, cursor: 'pointer'}}>
                        {item.product.nameKo}
                      </TableCell>
                      <TableCell align="center">
                        {item.product.brand.name}
                      </TableCell>
                      <TableCell align="center">
                        {getCategory(item.product.closetCategoryId)}
                      </TableCell>
                      <TableCell align="center">
                        {item.product.priceNormal}
                      </TableCell>
                      <TableCell align="center">
                        {item.containCounts}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
              </TableBody>
            :
                  <Stack sx={{
                      position: 'absolute',
                      top: 80,
                      left: '40%',
                      zIndex: 10,
                      fontSize: '16px',
                      fontWeight: '500'
                  }}>{t("components_marketing_totalPurchaseInCartDetail_cartList")}</Stack>
            }
            </Table>

      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 20, 30]}
        showFirstButton
        showLastButton
      />
    </>
  )
};

export default CartList;