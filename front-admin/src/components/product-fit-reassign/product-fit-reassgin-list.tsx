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
import {ImageInListWidget} from "../widgets/image-widget";
import {JennieFitAssignmentModel} from "../../types/jennie-fit-assignment-model";

interface ListProps {
  lists: JennieFitAssignmentModel[];
  count: number;
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  selectedLists?: JennieFitAssignmentModel[],
  selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
  selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: JennieFitAssignmentModel) => void;
}

export const ProductFitReassginList: FC<ListProps> = (props) => {

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

  const renderCategory = (categoryIds) => {
    return categoryIds.map(categoryId => {
      return (
          <span key={categoryId}>
          {getDataContextValue(dataContext, 'CATEGORY_MAP', categoryId, 'name')}+
        </span>
      )
    });
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
                  상품명
                </TableCell>
                <TableCell>
                  브랜드
                </TableCell>
                <TableCell>
                  카테고리
                </TableCell>
                <TableCell>
                  작업유형
                </TableCell>
                <TableCell>
                  추가 옵션
                </TableCell>
                <TableCell>
                  작업상태
                </TableCell>
                <TableCell>
                  작업자
                </TableCell>
                <TableCell>
                  생성타입
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
                              item.imageUrlList[0]
                                  ? (
                                      <ImageInListWidget imageUrl={item.imageUrlList[0].imageUrl} />
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
                          {item.productId}
                        </TableCell>
                        <TableCell>
                          {item.productName}
                        </TableCell>
                        <TableCell>
                          {item.brandName}
                        </TableCell>
                        <TableCell>
                          {renderCategory(item.categoryIds)}
                        </TableCell>
                        <TableCell>
                          {getDataContextValue(dataContext, 'ASSIGN_PRIORITY', item.priorityType, null)}
                        </TableCell>
                        <TableCell>
                          {item.isAi ? "AI 피팅 처리" : "-"}
                        </TableCell>
                        <TableCell>
                          {getDataContextValue(dataContext, 'ASSIGN_STATUS', item.status, null)}
                        </TableCell>
                        <TableCell>
                          {item.workerName}
                        </TableCell>
                        <TableCell>
                          {getDataContextValue(dataContext, 'REGISTRATION_TYPE', item.registrationType, null)}
                        </TableCell>
                        <TableCell>
                          {getDate(item.productCreatedDate)}
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

ProductFitReassginList.propTypes = {
  lists: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};