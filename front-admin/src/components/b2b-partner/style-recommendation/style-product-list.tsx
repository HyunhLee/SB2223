import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useContext} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import {Scrollbar} from "../../scrollbar";
import {getDataContextValue, getDate, getNumberComma} from "../../../utils/data-convert";
import {DataContext, renderBrandKeyword} from "../../../contexts/data-context";
import {ImageInListWidget} from "../../widgets/image-widget";
import {B2bDefaultItemModel} from "../../../types/b2b-partner-model/b2b-default-item-model";

interface ListProps {
  // lists: ProductModel[];
  lists: B2bDefaultItemModel[]
  count: number;
  gender: string;
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  // selectedLists?: ProductModel[],
  selectedLists?: B2bDefaultItemModel[]
  selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
  // selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: ProductModel) => void;
  selectOneList?: (item: B2bDefaultItemModel) => void;
}

export const StyleProductList: FC<ListProps> = (props) => {

  const {
    lists,
    count,
    gender,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    selectedLists,
    selectAllLists,
    selectOneList,
    ...other
  } = props;

  const dataContext = useContext(DataContext);

  const renderCategory = (categoryIds) => {
    return categoryIds.map(categoryId => {
      return (
        <span key={categoryId}>
          {getDataContextValue(dataContext, gender == 'F' ? 'CATEGORY_MAP' : 'MALE_CATEGORY_MAP', categoryId, 'name')}+
        </span>
      )
    });
  }

  const renderBrand = (brandId) => {
    if(gender == 'M') {
      return (dataContext.B2B_MALE_MALL_BRANDS[brandId]) ? dataContext.B2B_MALE_MALL_BRANDS[brandId].name : '';
    } else {
      return (dataContext.B2B_FEMALE_MALL_BRANDS[brandId]) ? dataContext.B2B_FEMALE_MALL_BRANDS[brandId].name : '';
    }
  }

  return (
    <div {...other}>
      <Stack sx={{justifyContent: 'space-between'}}
             direction={'row'}>
        <Box>
          <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography variant="h6">총 {getNumberComma(count)} 건</Typography>
          </Grid>
        </Box>
        <TablePagination
            component="div"
            count={count}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
            showFirstButton
            showLastButton
        />
      </Stack>
      <Scrollbar>
        <Table sx={{ minWidth: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>
              </TableCell>
              <TableCell>
                이미지
              </TableCell>
              <TableCell>
                상품명
              </TableCell>
              <TableCell>
                상품ID
              </TableCell>
              <TableCell>
                브랜드
              </TableCell>
              <TableCell>
                스타일 키워드
              </TableCell>
              <TableCell>
                카테고리
              </TableCell>
              <TableCell>
                컬러
              </TableCell>
              <TableCell>
                패턴
              </TableCell>
              <TableCell>
                등록일
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lists.map((item) => {
              const isListSelected = selectedLists.includes(item);
              return (
                <Fragment key={item.id}>
                  <TableRow
                    hover={!isListSelected}
                    sx={{cursor: 'pointer', backgroundColor: isListSelected ? 'lightgrey' : ''}}
                    key={item.id}
                    onClick={() => selectOneList(item)}
                  >
                    <TableCell>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        {
                          item.mainImageUrl
                            ? (
                              // <img
                              //   src={`${item.mainImageUrl}`}
                              //   style={{objectFit: 'contain'}}
                              //   loading="lazy"
                              //   height={80}
                              //   width={80}
                              // />
                                  <ImageInListWidget
                                      imageName={item.mainImageUrl}
                                      imageUrl={item.mainImageUrl} />
                            )
                            : (
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  backgroundColor: 'background.default',
                                  borderRadius: 1,
                                  display: 'flex',
                                  height: 80,
                                  justifyContent: 'center',
                                  width: 80
                                }}
                              >
                              </Box>
                            )
                        }
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {item.productType == 'Default' ? `(D)${item.nameKo}` : item.nameKo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {item.productId}
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {renderBrand(item.brandId)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {item.productStyleKeyWords.length > 1 ?
                          `${renderBrandKeyword(item.productStyleKeyWords[0])}, ${renderBrandKeyword(item.productStyleKeyWords[1])}`
                          :
                          item.productStyleKeyWords.length == 1 ?
                              `${renderBrandKeyword(item.productStyleKeyWords[0])}`
                              :
                              ''
                      }
                    </TableCell>
                    <TableCell>
                      {renderCategory(item.categoryIds)}
                    </TableCell>
                    <TableCell>
                      {item.colorType || item.colorName}
                    </TableCell>
                    <TableCell>
                      {item.patternType || item.patternName}
                    </TableCell>
                    <TableCell>
                      {getDate(item.createdDate)}
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
        rowsPerPageOptions={[10, 25, 50]}
        showFirstButton
        showLastButton
      />
    </div>
  );
};

StyleProductList.propTypes = {
  lists: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};