import type {FC} from 'react';
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
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
} from '@mui/material';
import {Scrollbar} from "../scrollbar";
import {StyleRecommend} from "../../types/style";
import {DataContext} from "../../contexts/data-context";
import {getDataContextValue, getDate, getNumberComma} from "../../utils/data-convert";
import {useRouter} from "next/router";
import DeleteIcon from '@mui/icons-material/Delete';
import {styleApi} from "../../api/style-api";
import _ from "lodash";
import {ImageInListWidget} from "../widgets/image-widget";
import {toast} from "react-hot-toast";
import {decode} from "../../utils/jwt";

interface ListTableProps {
  lists: StyleRecommend[];
  count: number;
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  getLists?: () =>  void;
}

export const StyleRecommendList: FC<ListTableProps> = (props) => {

  const router = useRouter();

  const {
    lists,
    count,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    getLists,
    ...other
  } = props;

  const dataContext = useContext(DataContext);

  useEffect(
      () => {
        if (selectedLists.length) {
          setSelectedLists([]);
        }

      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [lists]
  );



  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

  const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedAllLists(event.target.checked);
    setSelectedLists(event.target.checked
        ? lists.map((list) => list.id)
        : []);
  };

  const handleSelectOneList = (
      event: ChangeEvent<HTMLInputElement>,
      listId: number
  ): void => {
    if (!selectedLists.includes(listId)) {
      setSelectedLists((prevSelected) => [...prevSelected, listId]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
    }
  };

  const renderStyleItem = (items) => {
    return items.map(item => {
      return (
          <div key={item.id}>
            <span style={{marginRight: 8}}>{item.fitOrder}.</span>
            {getDataContextValue(dataContext, 'CATEGORY_MAP', item.category1, 'name')}+
            {getDataContextValue(dataContext, 'CATEGORY_MAP', item.category2, 'name')}+
            {getDataContextValue(dataContext, 'CATEGORY_MAP', item.category3, 'name')}+
            {getDataContextValue(dataContext, 'CATEGORY_MAP', item.category4, 'name')}+
            {getDataContextValue(dataContext, 'CATEGORY_MAP', item.category5, 'name')}++
            {item.colorType}+
            {item.patternType}
          </div>
      )
    });
  }

  const handleClick = (id) => {
    router.push(`/style/manual?id=${id}`);
  }

  const deleteHandler = async (): Promise<void> => {
    if (_.isEmpty(selectedLists)) {
      toast.error('선택된 내역이 없습니다.');
    } else {
      if (window.confirm('삭제하시겠습니까?')) {
        for (const id of selectedLists) {
          await styleApi.deleteStyleRecommend(id, {
            id,
            activated: false,
          });
        }
        toast.success('삭제되었습니다.');
        setSelectedLists([]);
        await getLists();
      }
    }
  }

  const deleteButtonDisplay = () => {
    return (decode(localStorage.getItem("accessToken")).auth.split(",").find(role => role ==='ROLE_ADMIN_MASTER' || role ==='ROLE_ADMIN_PICK') );
  };

  return (
      <div {...other}>
        <Stack sx={{justifyContent: 'space-between'}}
               direction={'row'}>
          <Box>
            <Grid sx={{m: 1, display: 'flex', alignItems: 'center'}}>
              <Typography variant="h6">총 {getNumberComma(count)} 건</Typography>
              {deleteButtonDisplay()?
                  <Box sx={{ml: 1}}>
                    <Button variant="outlined"
                            startIcon={<DeleteIcon />}
                            size="small"
                            color="error"
                            onClick={deleteHandler}  >
                      삭제
                    </Button>
                  </Box>
                  :''
              }
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
                  스타일 ID
                </TableCell>
                <TableCell>
                  등록 유형
                </TableCell>
                <TableCell>
                  스타일 취향
                </TableCell>
                <TableCell>
                  TPO
                </TableCell>
                <TableCell>
                  시즌
                </TableCell>
                <TableCell>
                  착장 구성 목록
                </TableCell>
                <TableCell>
                  등록일
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lists.map((style) => {
                const isListSelected = selectedLists.includes(style.id);
                return (
                    <TableRow
                        hover
                        key={style.id}
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
                            onChange={(event) => handleSelectOneList(
                                event,
                                style.id
                            )}
                            value={isListSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <ImageInListWidget imageName={style.id}
                                           imageUrl={style.lookBookImageUrl} />
                      </TableCell>
                      <TableCell
                          onClick={() => handleClick(style.id)}
                      >
                        <Link sx={{cursor: 'pointer'}}>
                          {style.id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                          {style.registerType}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                          {style.tasteCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {style.tpoType}
                      </TableCell>
                      <TableCell>
                        {style.seasonTypes}
                      </TableCell>
                      <TableCell>
                        {renderStyleItem(style.items)}
                      </TableCell>
                      <TableCell>
                        {getDate(style.createdDate)}
                      </TableCell>
                    </TableRow>
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

StyleRecommendList.propTypes = {
  lists: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};