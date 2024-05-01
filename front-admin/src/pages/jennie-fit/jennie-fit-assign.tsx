import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import ProductFitRequest from "../../components/product-fit-request";
import UserFitRequest from 'src/components/user-fit-request';
import {decode} from "../../utils/jwt";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {JennieFitStatusList} from "../../components/jennie-fit/jennie-fit-status-list";
import {JennieFitStatus} from "../../types/jennie-fit-assignment-model";
import {jennieFitProductAssignmentApi} from "../../api/jennie-fit-product-assignment-api";
import moment from 'moment';
import {jennieFitUserAssignmentApi} from "../../api/jennie-fit-user-assignment-api";
import {JennieFitWorkerModel} from "../../types/jennie-fit-worker-model";
import {jennieFitWorkerApi} from "../../api/jennie-fit-worker-api";
import UserFitReassign from "../../components/user-fit-reassign";
import ProductFitReassign from "../../components/product-fit-reassign";

const UserAssignDialog = (props) => {
  const {onClose, open} = props;

  const handleCancel = () => {
    onClose();
  };

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
          maxWidth="xl"
          fullWidth={true}
          open={open}
          onClose={handleCancel}
          onBackdropClick={handleCancel}
      >
        <DialogTitle>User</DialogTitle>
        <DialogContent dividers>
          <UserFitRequest/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
  );
}

const UserReassignDialog = (props) => {
  const {onClose, open} = props;

  const handleCancel = () => {
    onClose();
  };

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
          maxWidth="xl"
          fullWidth={true}
          open={open}
          onClose={handleCancel}
          onBackdropClick={handleCancel}
      >
        <DialogTitle>User</DialogTitle>
        <DialogContent dividers>
          <UserFitReassign />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
  );
}

const ProductAssignDialog = (props) => {
  const {onClose, open} = props;

  const handleCancel = () => {
    onClose();
  };

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
          maxWidth="xl"
          fullWidth={true}
          open={open}
          onClose={handleCancel}
          onBackdropClick={handleCancel}
      >
        <DialogTitle>Product</DialogTitle>
        <DialogContent dividers>
          <ProductFitRequest/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
  );
}

const ProductReassignDialog = (props) => {
  const {onClose, open} = props;

  const handleCancel = () => {
    onClose();
  };

  return (
      <Dialog
          sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
          maxWidth="xl"
          fullWidth={true}
          open={open}
          onClose={handleCancel}
          onBackdropClick={handleCancel}
      >
        <DialogTitle>Product</DialogTitle>
        <DialogContent dividers>
          <ProductFitReassign />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
  );
}


interface Search {
  workDayFrom: Date,
  workDayTo: Date,
  userWorkerId: string,
  productWorkerId: string,
}

const defaultSearch = () => {
  return {
    workDayFrom: moment().add(-15, 'days').toDate(),
    workDayTo: new Date(),
    userWorkerId: '',
    productWorkerId: '',
  }
}


const JennieFitAssign: NextPage = () => {

  const [productStatusList, setProductStatusList] = useState<JennieFitStatus[]>([]);
  const [userStatusList, setUserStatusList] = useState<JennieFitStatus[]>([]);
  const [userWorkerList, setUserWorkerList] = useState<JennieFitWorkerModel[]>([]);
  const [productWorkerList, setProductWorkerList] = useState<JennieFitWorkerModel[]>([]);

  const [search, setSearch] = useState<Search>(defaultSearch());

  const [openUserAssign, setOpenUserAssign] = React.useState(false);
  const [openUserReassign, setOpenUserReassign] = React.useState(false);

  const [openProductAssign, setOpenProductAssign] = React.useState(false);
  const [openProductReassign, setOpenProductReassign] = React.useState(false);

  useEffect(
      () => {
        (async () => {
          await getLists();
          await getWorkerLists('FIT_USER');
          await getWorkerLists('FIT_PRODUCT');
        })()
      },
      []
  );

  const getLists = async () => {
    try {
      const userQuery = {
        ...search,
        workerId: search.userWorkerId,
      }
      const userStatusList = await jennieFitUserAssignmentApi.getJennieFitAssignmentsStatus(userQuery);
      setUserStatusList(userStatusList);

      const productQuery = {
        ...search,
        workerId: search.productWorkerId,
      }
      const productStatusList = await jennieFitProductAssignmentApi.getJennieFitAssignmentsStatus(productQuery);
      setProductStatusList(productStatusList);
    } catch (err) {
      console.error(err);
    }
  }

  const getWorkerLists = async (workType) => {
    try {
      const query = {
        activated: true,
        workType: workType
      }
      const result = await jennieFitWorkerApi.getJennieFitWorkers(query);
      if (workType === 'FIT_PRODUCT') {
        setProductWorkerList(result.lists);
      } else if (workType === 'FIT_USER') {
        setUserWorkerList(result.lists);
      }
    } catch (err) {
      console.error(err);
    }
  };


  const changeUserWorkerId = (event): void => {
    setSearch(prevData => ({
      ...prevData,
      userWorkerId: event.target.value
    }))
  }

  const changeProductWorkerId = (event): void => {
    setSearch(prevData => ({
      ...prevData,
      productWorkerId: event.target.value
    }))
  }

  const handleChangeDate =
      (prop: keyof Search) => (value) => {
        setSearch({...search, [prop]: value});
      };

  const handleClickUserAssign = () => {
    setOpenUserAssign(true);
  }

  const handleClickReset = () => {
    setSearch(defaultSearch());
  };

  const handleCloseUserAssign = () => {
    setOpenUserAssign(false);
  };

  const handleClickUserReassign = () => {
    setOpenUserReassign(true);
  }

  const handleCloseUserReassign = () => {
    setOpenUserReassign(false);
  };


  const handleClickProductAssign = () => {
    setOpenProductAssign(true);
  }

  const handleCloseProductAssign = () => {
    setOpenProductAssign(false);
  };

  const handleClickProductReassign = () => {
    setOpenProductReassign(true);
  }

  const handleCloseProductReassign = () => {
    setOpenProductReassign(false);
  };

  const renderProductWorker = () => {
    return productWorkerList.map(worker => {
      const workerId = String(worker.workerId);
      return (<MenuItem key={workerId}
value={workerId}>{worker.workerName}</MenuItem>)
    });
  }

  const renderUserWorker = () => {
    return userWorkerList.map(worker => {
      const workerId = String(worker.workerId);
      return (<MenuItem key={workerId}
value={workerId}>{worker.workerName}</MenuItem>)
    });
  }

  const jennieFitUserAssignDisplay = () => {
    return (decode(localStorage.getItem("accessToken")).auth.split(",").find(role => role === 'ROLE_ADMIN_USERFIT' || role === 'ROLE_ADMIN_MASTER'));
  };

  const jennieFitProductAssignDisplay = () => {
    return (decode(localStorage.getItem("accessToken")).auth.split(",").find(role => role === 'ROLE_ADMIN_PRODUCTFIT' || role === 'ROLE_ADMIN_MASTER'));
  };

  return (
      <>
        <Head>
          Style | Style Bot
        </Head>
        <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 2
            }}
        >
          <Container maxWidth="xl"  >
            <Box sx={{mb: 1}}>
              <Grid
                  container
                  justifyContent="space-between"
                  spacing={3}
              >
                <Grid item>
                  <Typography variant="h4">
                    Jennie Fit Assign
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Card sx={{py: 1}}>
              <CardContent sx={{py: 1}}>
                <Stack direction="row"
sx={{mr: 1, ml: 0.5}}>
                  <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
                    <FormLabel component="legend">작업일</FormLabel>
                  </Stack>
                  <Stack>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                          value={search.workDayFrom}
                          inputFormat={"yyyy-MM-dd"}
                          mask={"____-__-__"}
                          onChange={handleChangeDate('workDayFrom')}
                          renderInput={(params) => <TextField {...params}
variant="standard"
sx={{width: 150}}/>}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack sx={{mr: 1, ml: 1, mt: 0.5}}>
                    ~
                  </Stack>
                  <Stack>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                          value={search.workDayTo}
                          inputFormat={"yyyy-MM-dd"}
                          mask={"____-__-__"}
                          onChange={handleChangeDate('workDayTo')}
                          renderInput={(params) => <TextField {...params}
variant="standard"
sx={{width: 150}}/>}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Stack>
                <Stack direction="row"
sx={{mt: 1, mr: 1, ml: 1.5}}>
                  <Stack justifyContent={"center"} >
                    <FormLabel component="legend">제니핏_USER ADMIN_DD</FormLabel>
                  </Stack>
                  <Stack direction="row">
                    <Select
                        value={search.userWorkerId}
                        size={"small"}
                        onChange={changeUserWorkerId}
                    >
                      <MenuItem value={''}>전체</MenuItem>
                      {renderUserWorker()}
                    </Select>
                  </Stack>
                  <Stack justifyContent={"center"}
sx={{ml: 1.5}}>
                    <FormLabel component="legend">제니핏_PRODUCT ADMIN_DD</FormLabel>
                  </Stack>
                  <Stack direction="row">
                    <Select
                        value={search.productWorkerId}
                        size={"small"}
                        onChange={changeProductWorkerId}
                    >
                      <MenuItem value={''}>전체</MenuItem>
                      {renderProductWorker()}
                    </Select>
                  </Stack>
                </Stack>
                <Stack direction="row"
justifyContent={"flex-end"}>
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
                          onClick={getLists}>
                    검색
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Divider />
            <Grid container
spacing={1}>
              {jennieFitUserAssignDisplay() ?
                  <Grid item
xs={6}>
                    <Card>
                      <CardHeader
                          title={<Typography>제니핏_USER</Typography>}
                          action={
                            <>
                              <Button size='small'
variant="outlined"
sx={{mr: 1}}
                                      onClick={handleClickUserAssign}>
                                촬영 이미지 - 수동 배정
                              </Button>
                              <Button size='small'
variant="outlined"
onClick={handleClickUserReassign}>
                                작업 재배정
                              </Button>
                            </>
                          }
                      />
                      <JennieFitStatusList
                          lists={userStatusList}
                          target={'USER'}
                          workDayFrom={search.workDayFrom}
                          workDayTo={search.workDayTo}
                      />
                    </Card>
                  </Grid> : <></>
              }
              {jennieFitProductAssignDisplay() ?
                  <Grid item
xs={6}>
                    <Card>
                      <CardHeader
                          title={<Typography>제니핏_PRODUCT</Typography>}
                          action={
                            <>
                              <Button size='small'
variant="outlined"
sx={{mr: 1}}
onClick={handleClickProductAssign}>
                                상품 데이터 - 수동 배정
                              </Button>
                              <Button size='small'
variant="outlined"
onClick={handleClickProductReassign}>
                                작업 재배정
                              </Button>
                            </>
                          }
                      />
                      <JennieFitStatusList
                          lists={productStatusList}
                          target={'PRODUCT'}
                          workDayFrom={search.workDayFrom}
                          workDayTo={search.workDayTo}
                      />
                    </Card>
                  </Grid> : <></>
              }
            </Grid>
          </Container>
        </Box>
        <UserAssignDialog
            open={openUserAssign}
            onClose={handleCloseUserAssign}
        />
        <ProductAssignDialog
            open={openProductAssign}
            onClose={handleCloseProductAssign}
        />
        <UserReassignDialog
            open={openUserReassign}
            onClose={handleCloseUserReassign}
        />
        <ProductReassignDialog
            open={openProductReassign}
            onClose={handleCloseProductReassign}
        />
      </>
  )
}

JennieFitAssign.getLayout = (page) => (
    <AuthGuard>
      <DashboardLayout>
        {page}
      </DashboardLayout>
    </AuthGuard>
);

export default JennieFitAssign;
