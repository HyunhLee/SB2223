import React, {ChangeEvent, Fragment, useContext, useState} from 'react';
import {
  Box,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import {Scrollbar} from "../scrollbar";
import {getDate} from "../../utils/data-convert";
import {useRouter} from "next/router";
import {DataContext} from "../../contexts/data-context";

const B2BPartnerListDetail = (props) =>{
  const {
    lists,
    count,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,} = props;

  const router = useRouter();
  const dataContext = useContext(DataContext);
  const [selectedLists, setSelectedLists] = useState<any[]>([]);
  const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

  const handleSelectAllLists = () => {
    if (selectedAllLists) {
      setSelectedAllLists(false);
      setSelectedLists([]);
    } else {
      setSelectedAllLists(true);
      setSelectedLists(lists);
    }
  };

  const handleSelectOneList = (
    _event: ChangeEvent<HTMLInputElement>,
    item: any
  ): void => {
    setSelectedAllLists(false)
    if (!selectedLists.includes(item)) {
      setSelectedLists((prevSelected) => [...prevSelected, item]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== item));
    }
  };

  const handleMoveToPage = (id) =>{
    router.push(`/b2b-partner/b2b-partner-correction-mall?id=${id}`);
  }

  const handleDelete = () => {
    console.log('삭제')
  }

  const showBrands = (item) => {
    if(dataContext.B2B_MALL_BRANDS_MAP[item.mall.brands[0].id] && 1 >= item.mall.brands.length) {
      return dataContext.B2B_MALL_BRANDS_MAP[item.mall.brands[0].id].name;
    } else if(dataContext.B2B_MALL_BRANDS_MAP[item.mall.brands[0].id] && item.mall.brands.length > 1) {
      return `${item.mall.brands[0].name}외 ${item.mall.brands.length - 1}개`;
    } else if(item.mall.brands.length > 1) {
      return `${item.mall.brands[0].name}외 ${item.mall.brands.length - 1}개`;
    } else {
      return item.mall.brands[0].name;
    }
  }

  return (
    <div>
        <Stack sx={{justifyContent: 'space-between'}}
direction={'row'}>
          <Box>
            <Grid>
              <Typography>총 {count} 건 </Typography>
              {/*<Button size='small'*/}
              {/*        variant="outlined"*/}
              {/*        onClick={handleDelete}>*/}
              {/*  삭제*/}
              {/*</Button>*/}
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
        </Stack>
        <Scrollbar>
          <Table sx={{minWidth: '100%'}}>
            <TableHead>
              <TableRow>
                {/*<TableCell padding="checkbox">*/}
                {/*  <Checkbox*/}
                {/*    checked={selectedAllLists || selectedLists.length == 20}*/}
                {/*    onChange={handleSelectAllLists}*/}
                {/*  />*/}
                {/*</TableCell>*/}
                <TableCell align="center">
                  회사(법인)명
                </TableCell>
                <TableCell align="center">
                  보유 브랜드
                </TableCell>
                <TableCell align="center">
                  플랜유형
                </TableCell>
                <TableCell align="center">
                  플랜기간
                </TableCell>
                <TableCell align="center">
                  운영상태
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lists?.map((item, idx) => {
                const isListSelected = selectedLists.includes(item);
                return (
                  <Fragment key={item.mall.id}>
                    <TableRow hover>
                      {/*<TableCell>*/}
                      {/*    <Checkbox*/}
                      {/*      checked={isListSelected}*/}
                      {/*      onChange={(event) => handleSelectOneList(*/}
                      {/*        event,*/}
                      {/*        item*/}
                      {/*      )}*/}
                      {/*      value={isListSelected}*/}
                      {/*    />*/}
                      {/*  </TableCell>*/}
                        <TableCell sx={{maxWidth: '150px'}}
                                   align={'center'}
                                   onClick={() => handleMoveToPage(item.mall.id)}>
                          <Link sx={{cursor: 'pointer'}}>
                          {item.mall.name}
                        </Link>
                      </TableCell>
                      <TableCell align={'center'}
sx={{maxWidth: '40%', width: '30%'}}>
                        {`${showBrands(item)}`}
                      </TableCell>
                      <TableCell align={'center'}>
                        {item.mall.b2bServicePlanType}
                      </TableCell>
                      <TableCell align={'center'}>
                        {`${getDate(item.mall.planStartDate)} ~ ${getDate(item.mall.planEndDate)}`}
                      </TableCell>
                      <TableCell align={'center'}>
                        {dataContext.BTB_COMPANY_STATUS[item.planActivate]}
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
    </div>
  );
}

export default B2BPartnerListDetail;