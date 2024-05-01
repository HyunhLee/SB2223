import React, {ChangeEvent, Fragment, useState} from 'react';
import {
  Box,
  Button,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {Scrollbar} from "../../scrollbar";
import {getDate, stateDay} from "../../../utils/data-convert";
import {useRouter} from "next/router";
import {mdsPickApi} from "../../../api/mds-pickp-api";
import toast from "react-hot-toast";
import _ from "lodash";

export const MdsPickList = (props) => {
  const {
    list,
    count,
    setRequestList,
    onPageChange,
    onRowsPerPageChange,
    page,
    rowsPerPage,
  } = props;

  const router = useRouter();
  const [selectedLists, setSelectedLists] = useState<number[]>([]);
  const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

  const handleDelete = async () => {
    if (_.isEmpty(selectedLists)) {
      toast.error('선택된 내역이 없습니다.');
    } else if(selectedLists.length != 1){
      window.confirm('다중삭제가 불가합니다.')
      return
    }else{
      if (window.confirm('해당 자료를 삭제하시겠습니까?')) {
        const result = await mdsPickApi.deleteMdsPick(selectedLists)
        if (result == 200) {
          toast.success('삭제가 완료되었습니다.');
          setSelectedLists([]);
          setRequestList(true)
        }
      }
    }

  }


  const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedAllLists(event.target.checked);
    setSelectedLists(event.target.checked
      ? list.map((list) => list.id)
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


  const handleMoveToCorrection = (id) => {
    router.push(`/home-app/mds-pick/mds-pick-correction?id=${id}`)
  }

  const getStatus = (start, end) => {
    const get = () => {
      return `${stateDay(start)}` < '0' ? '전시 중' : "전시 예정"
    }
    return `${stateDay(end)}` < '0' ? '전시 종료' :  get()
  }

  return(
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant='h6'>총 {count} 건</Typography>
        </Grid>
        <Button color="error"
                variant="outlined"
                startIcon={<DeleteIcon/>}
                size="small"
                onClick={handleDelete}>
          삭제
        </Button>
      </Box>
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
        <Table  sx={{minWidth: '100%', position: 'relative', minHeight: 200}}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAllLists || selectedLists.length == list.length && list.length != 0 }
                  onChange={handleSelectAllLists}
                />
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                ID
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                TITLE
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                영문 TITLE
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                게시 기간 및 시간
              </TableCell>
              <TableCell sx={{ textAlign: 'center'}}>
                전시상태
              </TableCell>
            </TableRow>
          </TableHead>
          {list.length > 0 ?
            <TableBody>
              {list.map((item) => {
                const isListSelected = selectedLists.includes(item.id);
                return (
                  <Fragment key={item.id}>
                    <TableRow
                      hover
                      key={item.id}
                    >
                      <TableCell
                        padding="checkbox"
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
                      <TableCell sx={{ textAlign: 'center' }}>
                        {item.id}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }}
                                 onClick={() => handleMoveToCorrection(item.id)}
                      >
                        {item.titleKo}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }}
                                 onClick={() => handleMoveToCorrection(item.id)}
                      >
                        {item.titleEn}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {`${getDate(item.startDate)} ~ ${getDate(item.expireDate)}`}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {getStatus(item.startDate, item.expireDate)}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
          </TableBody> :
              <>
              <Stack sx={{position: 'absolute',
                top: 80,
                left: '40%',
                zIndex: 10,
                fontSize: '16px',
                fontWeight: '500'}}>
              해당 데이터가 없습니다.
              </Stack>
              </>}
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
}
