import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Stack
} from "@mui/material";
import {getDate, getNumberComma} from "../../../utils/data-convert";
import {Scrollbar} from "../../scrollbar";
import React, {Fragment, useContext, useRef, useState,} from "react";
import {useTranslation} from "react-i18next";
import {InquiryDrawer} from "./inquiry-drawer";
import {b2bInquiryApi} from "../../../api/b2b-inquiry-api";
import {DataContext} from "../../../contexts/data-context";
import {Plus as PlusIcon} from '../../../icons/plus';


export const InquiryDetailList = (props) => {
  const {
    list,
    count,
    onOpenDrawer,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPage,
    page,
    getInquiries,
    onClose,
  } = props;

  const {t} = useTranslation();
  const [selectId, setSelectedId] = useState<number>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [drawer, setDrawer] = useState<boolean>(false);
  const dataContext = useContext(DataContext);
  const onClickPost = () => {
    setDrawer(true)
  }

  const handleDrawer = () => {
    setDrawer(!drawer)
    if(drawer){
      onClose();
    }
  }

  //글 줄임
  const textArea = (content) => {
    if (content.length > 50) {
     return content.substr(0, 40) + '...';
    }else{
      return content
    }
  }

  return (
    <>
      <Box>
        <>
        <Stack direction="row"
               justifyContent={"flex-end"}
               sx={{ mt: 2, mb:1 }}>
          <Button
              size='small'
              color="primary"
              variant="contained"
              startIcon={<PlusIcon/>}
              sx={{minWidth: '100px', height: '40px', mr: 0.5, p: 0.5}}
              onClick={onClickPost}>{t('label_inquiry_registerInquiry')}</Button>
        </Stack>
        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography variant='h6'>{t("label_total", {number: getNumberComma(count)})}</Typography>
        </Grid>
        </>
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
        <Table sx={{minWidth: '100%', position: 'relative'}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', width: '5%' }}>
                {t("label_id")}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: '8%' }}>
                {t("label_inquiry_type")}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: '8%' }}>
                {t("label_inquiry_writer")}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: '10%' }}>
                {t("label_inquiry_dateCreated")}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: '50%' }}>
                {t("label_inquiry_inquiryDetails")}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: '8%' }}>
                {t("label_inquiry_answerStatus")}
              </TableCell>
              <TableCell sx={{ textAlign: 'center', width: '8%' }}>
                {t("label_inquiry_viewDetails")}
              </TableCell>
            </TableRow>
          </TableHead>
          {list?.length > 0 ?
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
                        {dataContext.INQUIRY_TYPE[item.type]}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {item.userName}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {getDate(item.createdDate)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'left' }}>
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
                          {t("label_inquiry_details")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
            </TableBody>
            :
            <>
            </>
          }
        </Table>
      </Scrollbar>
      {list?.length == 0 ? <Stack sx={{
        fontSize: '16px',
        textAlign:'center',
        mt: 5,
        mb:5,
      }}>{t( 'warning_empty_result')}</Stack> : <></> }
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
      <InquiryDrawer
        containerRef={rootRef}
        onClose={handleDrawer}
        setDrawer={setDrawer}
        open={drawer}
        getLists={getInquiries}
        inquiry={list?.find((inquiry) => inquiry.id === selectId)}
      />
    </>
  );
}
