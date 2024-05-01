import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Container,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  IconButtonProps,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {DataContext} from "../../contexts/data-context";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {getDataContextValue} from "../../utils/data-convert";
import {CategoryDialog, ColorDialog, PatternDialog} from "../../components/dialog/category-dialog";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {styled} from "@mui/material/styles";
import {UserDressList} from "../../components/user-dress/user-dress-list";
import {userDressApi} from "../../api/user-dress-api";
import {UserDressModel} from "../../types/user-dress-model";


interface Search {
  categoryId: string;
  categoryName: string;
  colorTypes: string;
  patternTypes: string;
  registerType: string;
  registrationType: string;
  inspectionType: string;
  id: string;
  userId: string;
  inspectionStatusIn: string[];
  startDate: Date;
  endDate: Date;
}

const defaultSearch = () => {
  return {
    categoryId: null,
    categoryName: '',
    colorTypes: '',
    patternTypes: '',
    registerType: '',
    inspectionType: '',
    registrationType: 'USER',
    inspectionStatusIn: ['REQUESTED', 'PRE_COMPLETE', 'NOT_APPLIED'],
    id: '',
    userId: '',
    startDate: null,
    endDate: null,
  }
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const JennieCc: NextPage = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [expanded, setExpanded] = useState(false);

  const [lists, setLists] = useState<UserDressModel[]>([]);
  const [count, setCount] = useState<number>(0);
  const [requestList, setRequestList] = useState<boolean>(false);


  const [open, setOpen] = React.useState(false);
  const [openColor, setOpenColor] = React.useState(false);
  const [openPattern, setOpenPattern] = React.useState(false);

  const dataContext = useContext(DataContext);

  const [search, setSearch] = useState<Search>(defaultSearch());

  const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
    console.log('newPage', newPage);
    setPage(newPage);
    setRequestList(true);
  };

  const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    setSize(parseInt(event.target.value, 10));
    setRequestList(true);
  };

  useEffect(
      () => {
        (async () => {
          if (requestList) {
            await getLists()
            setRequestList(false);
          }
        })()
      },
      [requestList]
  );

  const handleRefreshList = async (): Promise<void> => {
    setRequestList(true);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getLists = async () => {
    try {
      const query = {
        size, page, ...search
      }
      const result = await userDressApi.getUserDresses(query);
      setLists(result.lists);
      setCount(result.count);
      console.log(query)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setRequestList(true);
  },[]);

  const handleChange =
      (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({ ...search, [prop]: event.target.value });
      };

  const handleChangeDate =
      (prop: keyof Search) => (value) => {
        setSearch({ ...search, [prop]: value });
      };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenColor = () => {
    setOpenColor(true);
  };

  const handleClickOpenPattern = () => {
    setOpenPattern(true);
  };

  const handleClose = (value) => {
    if (value) {
      console.log(value);
      setSearch({
        ...search,
        categoryId: value.id,
        categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
      });
    }
    setOpen(false);
  };

  const handleCloseColor = (values) => {
    if (values) {
      console.log(values);
      setSearch({
        ...search,
        colorTypes: values.map(item => {
          return item.name;
        }).join(',')
      });
    }
    setOpenColor(false);
  };

  const handleClosePattern = (values) => {
    if (values) {
      console.log(values);
      setSearch({
        ...search,
        patternTypes: values.map(item => {
          return item.name;
        }).join(',')
      });
    }
    setOpenPattern(false);
  };

  const handleClickClearCategory = (prop) => {
    setSearch({ ...search,
      categoryId: null,
      categoryName: ''
    });
  };

  const handleClickClearColor = (prop: keyof Search) => {
    setSearch({ ...search, [prop]: '' });
  };

  const handleClickClearPattern = (prop: keyof Search) => {
    setSearch({ ...search, [prop]: '' });
  };

  const handleClickReset = () => {
    setSearch(defaultSearch());
  };

  const changeInspectionStatusHandler = (event: SelectChangeEvent<typeof search.inspectionStatusIn>) => {
    const {
      target: { value },
    } = event;
    setSearch({...search, inspectionStatusIn: typeof value === 'string' ? value.split(',') : value});
  };

  const changeRegistrationTypeHandler = (value): void => {
    setSearch(prevData => ({
      ...prevData,
      registrationType: value
    }))
  }

  const renderStatus = () => {
    return Object.keys(dataContext.INSPECTION_STATUS).map(key => {
      return (<MenuItem key={key}
value={key}>{dataContext.INSPECTION_STATUS[key]}</MenuItem>)
    });
  }

  const renderRegistrationType = () => {
    return Object.keys(dataContext.USER_DRESS_REGISTRATION_TYPE).map(key => {
      return (<MenuItem key={key}
value={key}>{dataContext.USER_DRESS_REGISTRATION_TYPE[key]}</MenuItem>)
    });
  }

  const handleKeyUp = async (e) => {
    if(e.key === 'Enter') {
      setPage(0);
      await getLists();
    }
  }

  const handleClickSearch = async () => {
    setPage(0);
    setRequestList(true);
  }

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
          <Container maxWidth="xl">
            <Box sx={{mb: 1}}>
              <Grid
                  container
                  justifyContent="space-between"
                  spacing={3}
              >
                <Grid item>
                  <Typography variant="h4">
                    Jennie Clothes Classification
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Card sx={{py: 1}}>
              <CardContent sx={{py: 1}}>
                <Collapse in={expanded}
timeout="auto"
unmountOnExit>
                  <Stack direction="row">
                    <Stack>
                      <FormControl sx={{ m: 1, width: '30ch' }}
variant="standard">
                        <InputLabel>카테고리</InputLabel>
                        <Input
                            type='text'
                            value={search.categoryName}
                            readOnly={true}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                    sx={{p: 0}}
                                    onClick={handleClickClearCategory}
                                >
                                  <ClearIcon />
                                </IconButton>
                                <IconButton
                                    sx={{p: 0}}
                                    onClick={handleClickOpen}
                                >
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            }
                        />
                      </FormControl>
                    </Stack>
                    <Stack>
                      <TextField
                          label="ID"
                          variant="standard"
                          value={search.id}
                          onChange={handleChange('id')}
                          onKeyUp={handleKeyUp}
                          sx={{ m: 1 }}
                      />
                    </Stack>
                    <Stack>
                      <TextField
                          label="유저ID"
                          variant="standard"
                          value={search.userId}
                          onChange={handleChange('userId')}
                          onKeyUp={handleKeyUp}
                          sx={{ m: 1 }}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row">
                    <Stack>
                      <FormControl sx={{ m: 1, width: '30ch' }}
variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">컬러</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            type='text'
                            value={search.colorTypes}
                            onChange={handleChange('colorTypes')}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                    sx={{p: 0}}
                                    onClick={() => handleClickClearColor('colorTypes')}
                                >
                                  <ClearIcon />
                                </IconButton>
                                <IconButton
                                    sx={{p: 0}}
                                    onClick={handleClickOpenColor}
                                >
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            }
                        />
                      </FormControl>
                    </Stack>
                    <Stack>
                      <FormControl sx={{ m: 1, width: '30ch' }}
variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">패턴</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            type='text'
                            value={search.patternTypes}
                            onChange={handleChange('patternTypes')}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                    sx={{p: 0}}
                                    onClick={() => handleClickClearPattern('patternTypes')}
                                >
                                  <ClearIcon />
                                </IconButton>
                                <IconButton
                                    sx={{p: 0}}
                                    onClick={handleClickOpenPattern}
                                >
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            }
                        />
                      </FormControl>
                    </Stack>
                  </Stack>
                  <Stack direction="row"
sx={{mr: 1, ml: 1, mt: 2}}>
                    <Stack justifyContent={"center"} >
                      <FormLabel component="legend">검수 상태</FormLabel>
                    </Stack>
                    <Stack direction="row">
                      <Select
                          value={search.inspectionStatusIn}
                          size={"small"}
                          multiple
                          onChange={changeInspectionStatusHandler}
                      >
                        <MenuItem value={''}>-</MenuItem>
                        {renderStatus()}
                      </Select>
                    </Stack>
                    <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
                      <FormLabel component="legend">등록자</FormLabel>
                    </Stack>
                    <Stack direction="row">
                      <Select
                          value={search.registrationType}
                          size={"small"}
                          onChange={e=> {changeRegistrationTypeHandler(e.target.value)}}
                      >
                        <MenuItem value={''}>-</MenuItem>
                        {renderRegistrationType()}
                      </Select>
                    </Stack>
                    <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
                      <FormLabel component="legend">등록일</FormLabel>
                    </Stack>
                    <Stack>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={search.startDate}
                            inputFormat={"yyyy-MM-dd"}
                            mask={"____-__-__"}
                            onChange={handleChangeDate('startDate')}
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
                            onChange={handleChangeDate('endDate')}
                            renderInput={(params) => <TextField {...params}
variant="standard"
sx={{width: 150}} />}
                        />
                      </LocalizationProvider>
                    </Stack>
                  </Stack>
                </Collapse>
                <Stack direction="row"
justifyContent={"flex-end"}>
                  <ExpandMore expand={expanded}
aria-expanded={expanded}
sx={{mr: 0.5, p: 0.3, fontSize: 12}}
onClick={handleExpandClick}>
                    <ExpandMoreOutlinedIcon />
                  </ExpandMore >
                  <Button
                      size='small'
                      variant="outlined"
                      sx={{mr: 1}}
                      onClick={handleClickReset}>
                    초기화
                  </Button>
                  <Button
                      size='small'
                      color="primary"
                      variant="contained"
                      startIcon={<SearchIcon/>}
                      onClick={handleClickSearch}>
                    검색
                  </Button>
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{mt: 1}}>
              <UserDressList
                  lists={lists}
                  count={count}
                  refreshList={handleRefreshList}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPage={size}
                  page={page}
              />
            </Card>
          </Container>
        </Box>
        <CategoryDialog
            keepMounted
            open={open}
            onClose={handleClose}
            category={dataContext.CATEGORY}
            value={search.categoryId}
        />
        <ColorDialog
            keepMounted
            open={openColor}
            onClose={handleCloseColor}
            items={dataContext.COLOR}
            value={search.colorTypes}
            multiple={true}
        />
        <PatternDialog
            keepMounted
            open={openPattern}
            onClose={handleClosePattern}
            items={dataContext.PATTERN}
            value={search.patternTypes}
            multiple={true}
        />
      </>
  )
}

JennieCc.getLayout = (page) => (
    <AuthGuard>
      <DashboardLayout>
        {page}
      </DashboardLayout>
    </AuthGuard>
);

export default JennieCc;