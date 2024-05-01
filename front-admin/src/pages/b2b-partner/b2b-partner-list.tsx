import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import {NextPage} from "next";
import {
  Box,
  Button,
  Card,
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
import {useRouter} from "next/router";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import B2BPartnerListDetail from "../../components/b2b-partner/b2b-partner-list-detail";
import {DataContext} from "../../contexts/data-context";
import {B2bPartnerMallModel, defaultSearchMall, SearchMall} from "../../types/b2b-partner-model/b2b-partner-mall-model";
import {b2bPartnerMallApi} from "../../b2b-partner-api/b2b-partner-mall-api";
import _ from "lodash";
import {Plus as PlusIcon} from "../../icons/plus";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

const B2BPartnerList: NextPage = () => {
  const router = useRouter();
  const {storeSearch} = router.query;
  const dataContext = useContext(DataContext);

  const [data, setData] = useState<B2bPartnerMallModel[]>([])
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<SearchMall>(defaultSearchMall)
  const [requestList, setRequestList] = useState<boolean>(false);

  useEffect(() => {
    if (storeSearch === 'true') {
      const B2bPartnerListSearch = sessionStorage.getItem('B2bPartnerListSearch');
      setSearch(JSON.parse(B2bPartnerListSearch));
    }
    setRequestList(true);
  },[]);


  useEffect(
      () => {
        sessionStorage.setItem('B2bPartnerListSearch', JSON.stringify(search));
      },
      [search]
  );

  const moveToPage = () =>{
    router.push(`/b2b-partner/b2b-partner-create-mall`);
  }

  useEffect(() => {
    if(requestList) {
      getMallList();
      setRequestList(false);
    }
  }, [requestList])

  const getMallList = async () => {
    await b2bPartnerMallApi.getMallList(search).then((res) => {
      setData(res.lists);
      setCount(res.count);
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  const renderType = (target) => {
    return Object.keys(dataContext[target]).map(key => {
      return (<MenuItem key={key}
                        value={key}>{dataContext[target][key]}</MenuItem>)
    });
  }

  const handleSearchDate = (prop: keyof SearchMall) => (value) => {
    setSearch({...search, [prop]: value});
  };

  const handleSearch = (prop: keyof SearchMall) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearch({...search, [prop] : event.target.value})
  };

  const handleKeyUp = async (e) => {
    if(e.key === 'Enter') {
      setRequestList(true);
    }
  }

  const handleClickReset = () => {
    setSearch(defaultSearchMall);
  }

  const handleClickSearch = () => {
    setSearch({
      ...search,
      page: 0,
    });
    setRequestList(true);
  }

  //pagination
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



  return (
    <div>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2
        }}>
        <Container maxWidth="xl">
          <Box sx={{mb: 1, py: 2, ml: 3, mt: 2}}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Typography variant="h4">
                B2B 회사 현황
              </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<PlusIcon fontSize="small"/>}
              onClick={moveToPage}>
              회사 추가
            </Button>
            </Grid>
          </Box>
          <Grid container>
            <Grid sx={{width: "100%"}}>
              <Card>
                <Stack direction="row"
                       sx={{ml: 1, mt: 2}}>
                  <Stack justifyContent={"center"}
                         sx={{mt: 2, mr: 2, ml: 3}}>
                    <FormLabel component="legend">법인(회사명)</FormLabel>
                  </Stack>
                  <Stack sx={{mt:2.5}}>
                  <TextField
                    label=''
                    variant='standard'
                    sx={{width: 200}}
                    value={search.companyName == null ? '' : search.companyName}
                    onChange={handleSearch("companyName")}
                    onKeyUp={handleKeyUp}
                  />
                  </Stack>
                  <Stack direction="row"
                         sx={{ml: 5, mt: 3}}>
                    <FormLabel sx={{mt: 1}}>보유 브랜드</FormLabel>
                    <Select
                      value={search.brandName || ''}
                      size={"small"}
                      sx={{minWidth: 200, ml: 2}}
                      onChange={handleSearch("brandName")}
                    >
                      <MenuItem value={''}>전체</MenuItem>
                      {_.sortBy(dataContext.B2B_MALL_BRANDS, 'name').map((brand) => {
                        return (
                            <MenuItem key={brand.id}
                                      value={brand.name}>{brand.name}</MenuItem>
                        )
                      })}
                    </Select>
                  </Stack>
                  <Stack direction="row"
                         sx={{ml: 4, mt: 3}}>
                    <FormLabel sx={{mt: 1}}>운영상태</FormLabel>
                    <Select
                      size={"small"}
                      value={search.planActivate || ''}
                      sx={{minWidth: 150, ml: 2}}
                      onChange={handleSearch('planActivate')}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value={'ALL'}>전체</MenuItem>
                      {renderType('BTB_COMPANY_STATUS')}
                    </Select>
                  </Stack>
                </Stack>
                <Stack direction="row"
sx={{ml: 1, mt: 2}}>
                  <Stack justifyContent={"center"}
                         sx={{mr: 2, ml: 3, mt: 2}}>
                    <FormLabel> 플랜기간 </FormLabel>
                  </Stack>
                  <Stack sx={{mt: 2, px: 1}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={search.startDate}
                        inputFormat={"yyyy-MM-dd"}
                        // mask={"____-__-__"}
                        onChange={handleSearchDate('startDate')}
                        renderInput={(params) => <TextField {...params}
                                                            variant="standard"
                                                            sx={{width: 200}}/>}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                    ~
                  </Stack>
                  <Stack sx={{mt: 2, px: 1}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={search.endDate}
                        inputFormat={"yyyy-MM-dd"}
                        mask={"____-__-__"}
                        onChange={handleSearchDate('endDate')}
                        renderInput={(params) => <TextField {...params}
                                                            variant="standard"
                                                            sx={{width: 200}}/>}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction="row"
                         sx={{ml: 5, mt: 2}}>
                    <FormLabel sx={{mt: 1}}>플랜유형</FormLabel>
                    <Select
                      value={search.planType || ''}
                      size={"small"}
                      sx={{minWidth: 150, ml: 2}}
                      onChange={handleSearch('planType')}
                      MenuProps={MenuProps}
                    >
                      <MenuItem value={'ALL'}>전체</MenuItem>
                      {renderType('BTB_PLAN_TYPE')}
                    </Select>
                  </Stack>
                </Stack>
                <Stack direction="row"
                       justifyContent={"flex-end"}
                       sx={{mb: 3, mr: 2, mt:3}}>
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
                <Divider/>
              </Card>
            </Grid>
          </Grid>
        </Container>
        <Container maxWidth="xl">
          <Box sx={{mb: 1, py: 2, ml: 3, mt: 2}}>
          <B2BPartnerListDetail
            lists={data}
            count={count}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPage={search.size}
            page={search.page}
          />
        </Box>
        </Container>
      </Box>
    </div>
  );
};



B2BPartnerList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);
export default B2BPartnerList;