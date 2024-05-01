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
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import React, {ChangeEvent, MouseEvent, useEffect, useState,} from 'react';
import {NextPage} from "next";
import {useRouter} from "next/router";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import {Plus as PlusIcon} from "../../../icons/plus";
import {defaultSearch, Search} from "../../../types/home-app-model/mds-pick";
import {MdsPickList} from "../../../components/home-app/mds-pick/mds-pick-list";
import {mdsPickApi} from "../../../api/mds-pickp-api";


const MdsPick: NextPage = () => {
    const router = useRouter();
    const eventStatus = ['전시예정', '전시중', '전시종료']

    const [search, setSearch] = useState<Search>(defaultSearch);
    const [list, setList] = useState([{id:1, title: '올 겨울 인기있는 코트 추천'}]);
    const [count, setCount] = useState(0);
    const [requestList, setRequestList] = useState<boolean>(true);

  const handleClickAdd = () => {
    router.push(`/home-app/mds-pick/mds-pick-register`)
  }
    const getPickList = async () => {
     const result = await mdsPickApi.getMdsPick(search);
     setCount(result.count);
      // @ts-ignore
      setList(result.list);
    }

  const handleChangeDate = (prop: keyof Search) => (value) => {
    setSearch({ ...search, [prop]: value });
  };

  const handleSearch = (prop: keyof  Search) => (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.value === '전시종료' || event.target.value === '전시예정' || event.target.value === '전시중' ){
      setSearch({...search, expireDate: null, startDate: null, [prop]: event.target.value})
    }else{
      setSearch({ ...search, [prop]: event.target.value });
    }

  };

  const renderTypes = () => {
    return eventStatus.map((key, index) => {
      return <MenuItem key={index}
value={key}>{key}</MenuItem>
    })
  }
  const handleKeyUp = async (e) => {
    if(e.key === 'Enter') {
      await getPickList();
    }
  }

  const handleClickReset = () => {
    setSearch(defaultSearch())
  };


  const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
    setSearch({
      ...search,
      page: newPage,
    });
    setRequestList(!requestList)
  };

  const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    setSearch({
      ...search,
      size: parseInt(event.target.value, 10),
    });
    setRequestList(!requestList)
  };

  useEffect(() => {
    if(requestList){
      getPickList();
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
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{mb: 4}}>
              <Stack
                  direction={'row'}
                  sx={{justifyContent: "space-between"}}
              >
                <Grid item>
                  <Typography variant="h4">
                    {`MD's Pick`}
                  </Typography>
                </Grid>
                <Grid>
                  <Button sx={{mt:0.5}}
                          variant="contained"
                          startIcon={<PlusIcon />}
                          size="small"
                          onClick={handleClickAdd}
                  >
                    {`신규 MD's Pick 등록`}
                  </Button>
                </Grid>
              </Stack>
            </Box>
            <Divider />
            <Card sx={{py: 1, mb: 1}}>
              <CardContent sx={{py: 1}}>
                <Stack direction="row">
                  <TextField
                    label="ID"
                    variant='standard'
                    sx={{width: 150,mr: 5}}
                    value={search.id == null ? '' : search.id}
                    placeholder={'숫자만 입력해주세요'}
                    onChange={handleSearch("id")}
                    onKeyUp={handleKeyUp}
                  />

                  <TextField
                    label='Title'
                    variant='standard'
                    sx={{width: 300}}
                    value={search.title == null ? '' : search.title}
                    onChange={handleSearch("title")}
                    onKeyUp={handleKeyUp}
                  />
                  <Stack justifyContent={"center"}
                         sx={{mt: 2, mr: 2, ml: 3}}>
                    <FormLabel component="legend">게시 기간</FormLabel>
                  </Stack>
                  <Stack sx={{mt: 2, ml: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={search.startDate}
                        inputFormat={"yyyy-MM-dd"}
                        mask={"____-__-__"}
                        readOnly={search.displayStatus === '전시중' || search.displayStatus === '전시예정' || search.displayStatus === '전시종료' }
                        onChange={handleChangeDate('startDate')}
                        renderInput={(params) => <TextField {...params}
                                                            variant="standard"
                                                            sx={{width: 200}} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack sx={{mt: 2,mr: 2, ml: 2}}>
                    ~
                  </Stack>
                  <Stack sx={{mt: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={search.expireDate}
                        inputFormat={"yyyy-MM-dd"}
                        mask={"____-__-__"}
                        readOnly={search.displayStatus === '전시중' || search.displayStatus === '전시예정' || search.displayStatus === '전시종료'}
                        onChange={handleChangeDate('expireDate')}
                        renderInput={(params) => <TextField {...params}
                                                            variant="standard"
                                                            sx={{width: 200}} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack justifyContent={"center"}
                         sx={{mr: 2, ml: 5, mt: 1.5}}>
                    <FormLabel
                      component="legend">전시 상태</FormLabel>
                  </Stack>
                  <Select
                    sx={{width: 160, mt: 1.5}}
                    size={"small"}
                    value={search.displayStatus}
                    onChange={handleSearch('displayStatus')}
                  >
                    <MenuItem value={'all'}>전체</MenuItem>
                    {renderTypes()}
                  </Select>
                </Stack>
                <Stack direction="row"
                       justifyContent={"flex-end"}
                       sx={{ mt: 2}}>
                  <Button size='small'
                          variant="outlined"
                          sx={{mr: 1}}
                          onClick={handleClickReset}
                  >
                    초기화
                  </Button>
                  <Button size='small'
                          color="primary"
                          variant="contained"
                          startIcon={<SearchIcon />}
                          onClick={handleClickSearch}
                  >
                    검색
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Divider />
            <Card>
              <CardContent>
                <MdsPickList
                  list={list}
                  count={count}
                  setRequestList={setRequestList}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPage={search.size}
                  page={search.page}
                />
              </CardContent>
            </Card>
          </Container>
        </Box>
      </>

    )
}


MdsPick.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default MdsPick;