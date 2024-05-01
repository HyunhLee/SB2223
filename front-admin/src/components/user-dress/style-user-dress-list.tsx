import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Checkbox,
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
import {Scrollbar} from "../scrollbar";
import {getDataContextValue, getDate, getNumberComma} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import {UserDressModel} from "../../types/user-dress-model";
import {ImageInListWidget} from "../widgets/image-widget";

interface ListProps {
  lists: UserDressModel[];
  count: number;
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  selectedLists?: UserDressModel[],
  selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
  selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: UserDressModel) => void;
}

export const StyleUserDressList: FC<ListProps> = (props) => {

  const {
    lists,
    count,
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

  const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

  const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedAllLists(event.target.checked);
    selectAllLists(event);
  };

  const renderCategoryPath = (categoryId) => {
    if (categoryId) {
      return getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId, 'path')
    }
    return '';
  }

  const renderBrand = (brandId) => {
    return (dataContext.BRAND_MAP[brandId]) ? dataContext.BRAND_MAP[brandId].name : '';
  }

  const renderDisplayStatus = (displayStatus) => {
    return (dataContext.DISPLAY_STATUS[displayStatus]) ? dataContext.DISPLAY_STATUS[displayStatus] : '';
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
                <TableCell padding="checkbox">
                  <Checkbox
                      checked={selectedAllLists}
                      onChange={handleSelectAllLists}
                  />
                </TableCell>
                <TableCell>
                  이미지
                </TableCell>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  유저ID
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
                  등록자
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
                          hover
                          key={item.id}
                      >
                        <TableCell
                            padding="checkbox"
                            sx={{
                              ...(open && {
                                position: 'relative',
                                '&:after': {
                                  position: 'absolute',
                                  content: '" "',
                                  top: 0,
                                  left: 0,
                                  backgroundColor: 'primary.main',
                                  width: 3,
                                  height: 'calc(100% + 1px)'
                                }
                              })
                            }}
                            width="25%"
                        >
                          <Checkbox
                              checked={isListSelected}
                              onChange={(event) => selectOneList(
                                  event,
                                  item
                              )}
                              value={isListSelected}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                              sx={{
                                alignItems: 'center',
                                display: 'flex'
                              }}
                          >
                            {
                              item.originalImageUrl
                                  ? (
                                      // <img
                                      //   src={`${item.originalImageUrl}`}
                                      //   style={{objectFit: 'contain'}}
                                      //   loading="lazy"
                                      //   height={80}
                                      //   width={80}
                                      // />
                                      <ImageInListWidget
                                          imageName={item.originalImageUrl}
                                          imageUrl={item.originalImageUrl} />
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
                          {item.id}
                        </TableCell>
                        <TableCell>
                          {item.userId}
                        </TableCell>
                        <TableCell>
                          {renderCategoryPath(item.categoryId)}
                        </TableCell>
                        <TableCell>
                          {item.colorType}
                        </TableCell>
                        <TableCell>
                          {item.patternType}
                        </TableCell>
                        <TableCell>
                          {getDataContextValue(dataContext, 'USER_DRESS_REGISTRATION_TYPE', item.registrationType, null)}
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

StyleUserDressList.propTypes = {
  lists: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};