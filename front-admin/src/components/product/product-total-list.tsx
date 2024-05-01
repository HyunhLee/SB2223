import type {FC} from 'react';
import React, {ChangeEvent, Fragment, MouseEvent, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
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
import {getDataContextValue, getDate, getNumberComma} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import _ from "lodash";
import toast from "react-hot-toast";
import {ImageInListWidget} from "../widgets/image-widget";
import {ProductModel} from "../../types/product-model";
import {useRouter} from "next/router";
import {productApi} from "../../api/product-api";
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from "@mui/icons-material/Autorenew";

interface ListProps {
  lists: ProductModel[];
  count: number;
  onPageChange?: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  refreshList?: () => void;
  getLists?: () => void;
  selectedLists?: ProductModel[],
  selectAllLists?: (event: ChangeEvent<HTMLInputElement>) => void;
  selectOneList?: (event: ChangeEvent<HTMLInputElement>, item: ProductModel) => void;
}


export const ProductTotalList: FC<ListProps> = (props) => {

  const router = useRouter();

  const {
    lists,
    count,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
    refreshList,
    getLists,
    ...other
  } = props;

  const dataContext = useContext(DataContext);

  const [idLists, setIdLists] = useState<number[]>([]);
  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setSelectedLists([]);
    setIdLists([]);
  }, [lists]);

  const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedAllLists(event.target.checked);
    setSelectedLists(event.target.checked
        ? lists.map((list) => list.id)
        : []);
    setIdLists(event.target.checked
        ? lists.map((list) => list.id)
        : []);
  };

  const handleSelectOneList = (
      event: ChangeEvent<HTMLInputElement>,
      listId: number
  ): void => {
    if (!selectedLists.includes(listId)) {
      setSelectedLists((prevSelected) => [...prevSelected, listId]);
      setIdLists((prevSelected) => [...prevSelected, listId]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== listId));
      setIdLists((prevSelected) => prevSelected.filter((id) => id !== listId));
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (_.isEmpty(selectedLists)) {
      toast.error('선택된 내역이 없습니다.');
    } else {
      if (window.confirm('삭제하시겠습니까?')) {
        for (const id of selectedLists) {
          await productApi.deleteProduct(id, {
            id,
            activated: false,
          })
        }
        toast.success('삭제되었습니다.');
        setSelectedLists([]);
        setIdLists([]);
        refreshList();
      }
    }
  }

  const handlePatch = async (status) => {
    if (_.isEmpty(selectedLists)) {
      toast.error('선택된 내역이 없습니다.');
    } else {
      console.log(status)
      if (window.confirm('변경하시겠습니까?')) {
        const ids = [];

        lists.forEach((v) => {
          idLists.forEach((e) => {
            if(v.id == e) {
              ids.push(v);
            }
          })
        })

        const wrong = ids.find((e) => {
          return e.fitRequestStatus !== 'COMPLETED' || e.inspectionStatus !== 'COMPLETED'
        });
        
        if(!wrong) {
          await productApi.patchDisplayStatus(status, {
            displayStatus: status,
            idList: idLists
          })
          toast.success('변경되었습니다.');
          getLists();
          setSelectedAllLists(false);
          router.push('/jennie-product/jennie-product-total');
        } else {
          toast.error('FIT이 등록되지 않은 상품은 진열할 수 없습니다.');
        }
      }
    }
  }

  const handleClick = (id) => {
    router.push(`/jennie-product/jennie-product-correction?id=${id}`);
  }

  return (
      <div {...other}>
        <Box>
          <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography variant="h6">총 {getNumberComma(count)} 건</Typography>
            <Box>
              <Stack
                  direction='row'>
                <Stack justifyContent={"center"}
                       sx={{mr: 1, ml: 5, mt:1}}>
                  <FormLabel component="legend">진열 상태 변경</FormLabel>
                </Stack>
                <Button sx={{mr:1}}
                        color="success"
                        variant="outlined"
                        startIcon={<AutorenewIcon />}
                        size="small"
                        onClick={() => handlePatch('DISPLAY_END')}>
                  진열 중지
                </Button>
                <Button sx={{mr:1}}
                        color="primary"
                        variant="outlined"
                        startIcon={<AutorenewIcon />}
                        size="small"
                        onClick={() => handlePatch('DISPLAY_ON')}>
                  진열중
                </Button>
                <Button sx={{mr:1}}
                        color="warning"
                        variant="outlined"
                        startIcon={<AutorenewIcon />}
                        size="small"
                        onClick={() => handlePatch('SOLD_OUT')}>
                  품절
                </Button>
                <Button sx={{mr:1}}
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        size="small"
                        onClick={handleDelete}>
                  삭제
                </Button>
              </Stack>
            </Box>
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
                  상품ID
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
                  제니FIT
                </TableCell>
                <TableCell>
                  검수상태
                </TableCell>
                <TableCell>
                  진열상태
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
                const isListSelected = selectedLists.includes(item.id);
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
                              onChange={(event) => handleSelectOneList(
                                  event,
                                  item.id
                              )}
                              value={isListSelected}
                          />
                        </TableCell>
                        <TableCell>
                          {item.imageUrlList.length >= 1 ? <ImageInListWidget imageName={item.imageUrlList[0].imageUrl}
                                                                              imageUrl={item.imageUrlList[0].imageUrl} /> : <ImageInListWidget imageName={item.mainImageUrl}
                                                                                                                                               imageUrl={item.mainImageUrl} />}
                        </TableCell>
                        <TableCell
                            onClick={() => handleClick(item.id)}
                        >
                          <Link sx={{cursor: 'pointer'}}>
                            {item.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {item.nameKo}
                        </TableCell>
                        <TableCell>
                          {(dataContext.BRAND_MAP[item.brandId]) ? dataContext.BRAND_MAP[item.brandId].nameEn : item.brandId}
                        </TableCell>
                        <TableCell>
                          {item.categoryIds.length>0?getDataContextValue(dataContext, 'CATEGORY_MAP', item.categoryIds[item.categoryIds.length-1], 'path'):''}
                        </TableCell>
                        <TableCell>
                          {dataContext.FIT_REQUEST_STATUS[item.fitRequestStatus]}
                        </TableCell>
                        <TableCell>
                          {dataContext.INSPECTION_STATUS[item.inspectionStatus]}
                        </TableCell>
                        <TableCell>
                          {dataContext.DISPLAY_STATUS[item.displayStatus]}
                        </TableCell>
                        <TableCell>
                          {dataContext.REGISTRATION_TYPE[item.registrationType]}
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

ProductTotalList.propTypes = {
  lists: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  refreshList: PropTypes.func,
};