import {
  Box,
  Button,
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
import {getDate} from "../../../utils/data-convert";
import {Scrollbar} from "../../scrollbar";
import React, {Fragment, useContext} from "react";
import {DataContext} from "../../../contexts/data-context";


export const B2bInquiryList = (props) => {
  const {
    list,
    count,
    onOpenDrawer,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPage,
    page
  } = props;
  const dataContext = useContext(DataContext);

  //글 줄임
  const textArea = (content) => {
    if (content.length > 50) {
      return content.substr(0, 40) + '...';
    }else{
      return content
    }
  }

  return (
    <div>
      <Stack sx={{justifyContent: 'space-between'}}
             direction={'row'}>
        <Box>
          <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography variant='h6'>총 {count} 건</Typography>
          </Grid>
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
      </Stack>
      <Scrollbar>
        <Table sx={{minWidth: '100%', position: 'relative'}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', width: 150 }}>
                ID
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: 200 }}>
                문의 유형
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: 150 }}>
                작성자
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: 250 }}>
                작성일
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: 550 }}>
                문의 내역
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: 150 }}>
                답변상태
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: 150 }}>
                상세보기
              </TableCell>
            </TableRow>
          </TableHead>
          {list.length > 0 ?
            <TableBody>
              {list.map((item) => {
                return (
                  <Fragment key={item.id}>
                    <TableRow
                      hover
                      key={item.id}
                    >
                      <TableCell sx={{ textAlign: 'center' }}>
                        {item.id}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {dataContext.BTB_INQUIRY_TYPE[item.type]}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {item.userName}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {getDate(item.createdDate)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {textArea(item.contents)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {item.status === 'OPEN' ? '답변대기' : '답변완료'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          component="a"
                          sx={{ m: 1, cursor: 'pointer', width: 70, height: 35, textAlign: 'center' }}
                          variant="contained"
                          onClick={() => onOpenDrawer(item.id)}
                        >
                          상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
              </TableBody>
              :
          <>
              <Stack sx={{
                position: 'absolute',
                top: 80,
                left: '40%',
                zIndex: 10,
                fontSize: '16px',
                fontWeight: '500'
              }}>현재 해당하는 자료가 없습니다.</Stack>
          </>
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
    </div>
  )
}