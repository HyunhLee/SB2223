import React, {ChangeEvent, MouseEvent, useRef, useState, useEffect,useContext} from 'react';
import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {
  Box, Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Stack, TextField,
  Typography
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import {styled} from "@mui/material/styles";
import {b2bInquiryApi} from "../../../api/b2b-inquiry-api";
import {DefaultInquirySearch, inquirySearch} from "../../../types/inquiry";
import {DataContext} from "../../../contexts/data-context";
import { InquiryDrawer } from "../../../components/general/inquiry/inquiry-drawer";
import { InquiryDetailList} from "../../../components/general/inquiry/inquiry-detail-list";
import {SearchDetailClick} from "../../../types/marketing-detail-click-model";
import {useTranslation} from "react-i18next";
import {CustomWidthTooltip} from "../../../components/widgets/custom-tooltip";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";

const InquiryListInner = styled(
  'div',
  { shouldForwardProp: (prop) => prop !== 'open' }
)<{ open?: boolean; }>(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    paddingBottom: theme.spacing(8),
    paddingTop: theme.spacing(0),
    zIndex: 1,
    [theme.breakpoints.up('xl')]: {
      marginRight: 0
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      [theme.breakpoints.up('xl')]: {
        marginRight: 0
      },
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
  })
);

const InquiryList : NextPage = () => {
  const {t} = useTranslation();
  const dataContext = useContext(DataContext);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [drawer, setDrawer] = useState<boolean>(false);

  const [search, setSearch] = useState<inquirySearch>(DefaultInquirySearch)
  const [list, setList] = useState([]);
  const [count, setCount] = useState<number>(0);
  const [selectId, setSelectedId] = useState<number>(null);
  const [requestList, setRequestList] = useState<boolean>(true);


  useEffect(() =>{
    if(requestList){
      getInquiries();
      setRequestList(false);
    }
  },[requestList])

  const renderType = (target) => {
    return Object.keys(dataContext[target]).map(key => {
      return (<MenuItem key={key}
                        value={key}>{dataContext[target][key]}</MenuItem>)
    });
  }

  const handleClickSearch = () => {
    setRequestList(true);
    handlePageChange(null,0)
  }
  const getInquiries = async () =>{
    const result = await b2bInquiryApi.getPartnersInquiries(search);
    setCount(result?.count)
    setList(result?.lists);
  }

  const getStatus = (prop) => {
    return (search[prop]) ? search[prop] : '';
  }

  const changeTypeHandler = (prop, value) => {
    setSearch(prevData => ({
      ...prevData,
      [prop] : value

    }))
  }

  const handleChange = (prop: keyof inquirySearch) => (e: ChangeEvent<HTMLInputElement>) => {
    setSearch({...search, [prop]: e.target.value})
  }

  const handleChangeDate =
    (prop: keyof inquirySearch) => (value) => {
      setSearch({...search, [prop]: value});
    };
  const handleClickReset = () => {
    setSearch(DefaultInquirySearch);
  }

  const handleKeyUp = async (e) => {
    if(e.key === 'Enter') {
      await getInquiries();
      handlePageChange(null,0)
    }
  }


  const handleOpenDrawer = (id : number) : void => {
    setDrawer(true)
    setSelectedId(id)
  }

  const handleCloseDrawer = () => {
    setDrawer(false);
    setRequestList(true)
  };


  const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
    setSearch({...search, page: newPage});
    setRequestList(true);
  };

  const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    setSearch({...search, size: parseInt(event.target.value, 10)});
    setRequestList(true);
  };

  useEffect(() => {
    if(requestList){
      getInquiries();
      setRequestList(false);
    }
  },[requestList])


  return (
    <>
      <Head>
        B2B Inquiry | Style Bot
      </Head>
      <Box
        component="main"
        ref={rootRef}
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <InquiryListInner
          open={drawer}
        >
          <Container maxWidth="xl">
            <Box sx={{mb: 4}}>
              <Grid
                container
                justifyContent="space-between"
                spacing={3}
              >
                <Grid item>
                  <Typography variant="h4">
                    {t('pages_general_InquiryList_typography_title')}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider/>
            <Card sx={{py: 1, mb: 1}}>
              <CardContent sx={{py: 1}}>
                <Stack direction="row"
                       sx={{mb: 2, mt: 2, mr: 2}}>
                  <Stack direction="row" justifyContent={"center"} sx={{mr: 1, ml: 1}}>
                    <FormLabel component="legend" sx={{mt: 1}}>{t('label_inquiry_type')}</FormLabel>
                    <CustomWidthTooltip title={`${t('pages_general_inquiry_inquiryList_popup')}`}
                                        sx={{whiteSpace: 'pre-wrap', mt: 0.5}} placement="bottom" arrow>
                      <IconButton>
                        <HelpIcon color="primary" fontSize="small"/>
                      </IconButton>
                    </CustomWidthTooltip>
                  </Stack>
                  <Stack direction="row">
                    <Select
                      value={search.type? search.type : ""}
                      size={"small"}
                      sx={{width: 150}}
                      onChange={e=> {changeTypeHandler('type', e.target.value)}}
                    >
                      <MenuItem value={''}>-</MenuItem>
                      {renderType('INQUIRY_TYPE')}
                    </Select>
                  </Stack>
                  <Stack justifyContent={"center"}
                         sx={{mr: 1, ml: 4}}>
                    <FormLabel component="legend">{t('label_registrationDate')}</FormLabel>
                  </Stack>
                  <Stack>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                          value={search.startDate}
                          inputFormat={"yyyy-MM-dd"}
                          mask={"____-__-__"}
                          onChange={handleChangeDate('startDate')}
                          maxDate={new Date(new Date().setDate(new Date().getDate()))}
                          renderInput={(params) => <TextField {...params}
                                                              variant="standard"
                                                              sx={{width: 150}}/>}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack sx={{mr: 1, ml: 1}}>
                    ~
                  </Stack>
                  <Stack>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                          value={search.endDate}
                          inputFormat={"yyyy-MM-dd"}
                          mask={"____-__-__"}
                          onChange={handleChangeDate('endDate')}
                          maxDate={new Date(new Date().setDate(new Date().getDate()))}
                          renderInput={(params) => <TextField {...params}
                                                              variant="standard"
                                                              sx={{width: 150}}/>}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Stack>
                <Stack direction='row'
                       sx={{ mt: 2, mb: 2 }}>
                  <Stack justifyContent={"center"}
                         sx={{mr: 1, ml: 1}}>
                    <FormLabel component="legend">{t('label_inquiry_answerStatus')}</FormLabel>
                  </Stack>
                  <Stack direction="row" sx={{mr: 2}}>
                    <Select
                      value={search.status ? search.status : ''}
                      size={"small"}
                      sx={{width: 150, mr: 1, ml: 1}}
                      onChange={ e =>  changeTypeHandler('status', e.target.value)}
                    >
                      <MenuItem value={''}>-</MenuItem>
                      {renderType('INQUIRY_STATUS')}
                    </Select>
                  </Stack>
                  <Stack justifyContent={"center"}
                         sx={{mr: 1, ml: 1}}>
                    <TextField
                      variant='standard'
                      value={search.content == null ? '' : search.content}
                      onChange={handleChange('content')}
                      onKeyUp={handleKeyUp}
                      placeholder={`${t('label_inquiry_search')}`}
                      sx={{ m: 1 }}
                    />
                  </Stack>
                </Stack>
                <Stack direction="row"
                       justifyContent={"flex-end"}
                       sx={{ mt: 2 }}>
                  <Button size='small'
                          variant="outlined"
                          sx={{mr: 1}}
                          onClick={handleClickReset}>
                    {t('button_clickClear')}
                  </Button>
                  <Button size='small'
                          color="primary"
                          variant="contained"
                          startIcon={<SearchIcon />}
                          onClick={handleClickSearch}>
                    {t('button_search')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Divider />
            <Card>
              <CardContent>
                <InquiryDetailList
                  onOpenDrawer={handleOpenDrawer}
                  onClose={handleCloseDrawer}
                  list={list}
                  count={count}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPage={search.size}
                  page={search.page}
                  getInquiries={getInquiries}
                />
              </CardContent>
            </Card>
          </Container>
        </InquiryListInner>
        <InquiryDrawer
          containerRef={rootRef}
          setDrawer = {setDrawer}
          onClose={handleCloseDrawer}
          open={drawer}
          getLists={getInquiries}
          inquiry={list?.find((inquiry) => inquiry.id === selectId)}
        />
      </Box>
    </>
  );
};

InquiryList.getLayout = (page) =>(
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
)
export default InquiryList;