import React, {ChangeEvent, MouseEvent, useContext, useEffect, useRef, useState} from 'react';
import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import {styled} from "@mui/material/styles";
import {B2bInquirySearch, DefaultB2bInquirySearch} from "../../../types/b2b-partner-model/b2b-inquiry-model";
import {B2bInquiryList} from 'src/components/b2b-partner/b2b-inquiry/b2b-inquiry-list';
import {BtbInquiryDrawer} from "../../../components/b2b-partner/b2b-inquiry/b2b-inquiry-drawer";
import {b2bPartnerInquiryApi} from "../../../b2b-partner-api/b2b-partner-inquiry-api";
import {DataContext} from "../../../contexts/data-context";


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


const BtbInquiry : NextPage = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [drawer, setDrawer] = useState<boolean>(false);
  const dataContext = useContext(DataContext);

  const [search, setSearch] = useState<B2bInquirySearch>(DefaultB2bInquirySearch)
  const [list, setList] = useState([]);
  const [count, setCount] = useState<number>(0);
  const [selectId, setSelectedId] = useState<number>(null);
  const [requestList, setRequestList] = useState<boolean>(true);

  const getInquiries = async () =>{
    const result = await b2bPartnerInquiryApi.getPartnersInquiries(search);
    setCount(result.count)
    setList(result.lists);
  }
  const getType = (checkValues) => {
    if (search.type) {
      const findValue = checkValues.find(value => search.type.includes(value));
      return (findValue) ? findValue : '';
    }
    return '';
  }

  const getStatus = (checkValues) => {
    if (search.status) {
      const findValue = checkValues.find(value => search.status.includes(value));
      return (findValue) ? findValue : '';
    }
    return '';
  }

  const changeTypeHandler = (prop, value) => {
    setSearch(prevData => ({
      ...prevData,
      [prop] : value

    }))
  }

  const renderType = (target) => {
    return Object.keys(dataContext[target]).map(key => {
      return (<MenuItem key={key}
                        value={key}>{dataContext[target][key]}</MenuItem>)
    });
  }

  const handleChange = (prop: keyof B2bInquirySearch) => (value) => {
    setSearch({ ...search, [prop]: value });
  };

  const handleOnChange = (value) => {
    setSearch({ ...search, contents: value});
  };

  const handleClickReset = () => {
    setSearch(DefaultB2bInquirySearch);
  }

  const handleKeyUp = async (e) => {
    if(e.key === 'Enter') {
      await getInquiries();
    }
  }

  const handleDrawer = (id : number) : void => {
      setDrawer(true)
      setSelectedId(id)
  }

  const handleCloseDrawer = () => {
    setDrawer(false);
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

  const handleClickSearch = async () => {
    setSearch({
      ...search,
      page: 0,
    });
    setRequestList(true);
  }

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
                    파트너센터 B2B 1:1 문의 관리
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Card sx={{py: 1}}>
              <CardContent sx={{py: 1}}>
                <Stack direction="row"
                       sx={{ mb: 2 , mt: 2, mr: 2}}>
                  <Stack justifyContent={"center"}
                         sx={{mr: 1, ml: 1}}>
                    <FormLabel component="legend">문의 유형</FormLabel>
                  </Stack>
                  <Stack direction="row">
                    <Select
                      value={search.type ? search.type : ''}
                      size={"small"}
                      sx={{width: 150}}
                      onChange={e=> {changeTypeHandler('type', e.target.value)}}
                    >
                      <MenuItem value={''}>-</MenuItem>
                      {renderType('BTB_INQUIRY_TYPE')}
                    </Select>
                  </Stack>
                  <Stack justifyContent={"center"}
                         sx={{mr: 1, ml: 4}}>
                    <FormLabel component="legend">등록일</FormLabel>
                  </Stack>
                  <Stack>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={search.startDate}
                        inputFormat={"yyyy-MM-dd"}
                        mask={"____-__-__"}
                        onChange={handleChange('startDate')}
                        maxDate={new Date(new Date().setDate(new Date().getDate()))}
                        renderInput={(params) => <TextField {...params}
                                                            variant="standard"
                                                            sx={{width: 150}} />}
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
                        onChange={handleChange('endDate')}
                        maxDate={new Date(new Date().setDate(new Date().getDate()))}
                        renderInput={(params) => <TextField {...params}
                                                            variant="standard"
                                                            sx={{width: 150}} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Stack>
                <Stack direction='row'
                       sx={{ mt: 2, mb: 2 }}>
                  <Stack justifyContent={"center"}
                         sx={{mr: 1, ml: 1}}>
                    <FormLabel component="legend">답변 상태</FormLabel>
                  </Stack>
                  <Stack direction="row"
sx={{mr: 2}}>
                    <Select
                      value={getStatus(['CLOSE', 'OPEN'])}
                      size={"small"}
                      sx={{width: 150, mr: 1, ml: 1}}
                      onChange={ e =>  changeTypeHandler('status', e.target.value)}
                    >
                      <MenuItem value={''}>-</MenuItem>
                      {renderType('BTB_INQUIRY_STATUS')}
                    </Select>
                  </Stack>
                  <Stack justifyContent={"center"}
                         sx={{mr: 1, ml: 1}}>
                    <TextField
                      variant='standard'
                      value={search.contents == null ? '' : search.contents}
                      onChange={e => handleOnChange(e.target.value)}
                      onKeyUp={handleKeyUp}
                      placeholder="문의 검색"
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
                    초기화
                  </Button>
                  <Button size='small'
                          color="primary"
                          variant="contained"
                          startIcon={<SearchIcon/>}
                          onClick={handleClickSearch}>
                    검색
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Divider />
            <Card>
              <CardContent>
                <B2bInquiryList
                  onOpenDrawer={handleDrawer}
                  list={list}
                  count={count}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPage={search.size}
                  page={search.page}
                />
              </CardContent>
            </Card>
          </Container>
        </InquiryListInner>
        <BtbInquiryDrawer
          containerRef={rootRef}
          onClose={handleCloseDrawer}
          open={drawer}
          getLists={getInquiries}
          inquiry={list.find((inquiry) => inquiry.id === selectId)}
        />
      </Box>
    </>
  );
};

BtbInquiry.getLayout = (page) =>(
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
)
export default BtbInquiry;