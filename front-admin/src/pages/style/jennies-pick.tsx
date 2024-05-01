import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from 'react';
import Head from 'next/head';
import type {NextPage} from "next";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Collapse,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  IconButtonProps,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import NextLink from "next/link";
import {Plus as PlusIcon} from "../../icons/plus";
import {StyleRecommendList} from "../../components/style/style-recommend-list";
import {styleApi} from "../../api/style-api";
import {StyleRecommend, StyleRecommendStatus} from "../../types/style";
import {DataContext} from "../../contexts/data-context";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {getDataContextValue, getNumberComma, sortBySeason, sortByTaste} from "../../utils/data-convert";
import {CategoryDialog, ColorDialog, PatternDialog} from "../../components/dialog/category-dialog";
import _ from "lodash";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {styled} from "@mui/material/styles";
import {useRouter} from "next/router";

interface Search {
  size: number,
  page: number,
  categoryKey: string;
  categoryName: string;
  registerType: string;
  tpoType: string;
  seasonTypes: string;
  id: string;
  tasteCode: string;
  startDate: Date;
  endDate: Date;
  colorType: string;
  patternType: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  category5?: string;
}

const defaultSearch = () => {
  return {
    page: 0,
    size: 10,
    categoryKey: '',
    categoryName: '',
    registerType: '',
    tpoType: '',
    seasonTypes: '',
    colorType: '',
    patternType: '',
    id: '',
    tasteCode: '',
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

const JenniesPick: NextPage = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const {storeSearch} = router.query;

  const [lists, setLists] = useState<StyleRecommend[]>([]);
  const [count, setCount] = useState<number>(0);

  const [status, setStatus] = useState<StyleRecommendStatus>({
    winterLow: 0,
    feminine: 0,
    dandy: 0,
    springHigh: 0,
    office: 0,
    winterHigh: 0,
    fallHigh: 0,
    total: 0,
    traditional: 0,
    modern: 0,
    springLow: 0,
    summerLow: 0,
    casual: 0,
    unique: 0,
    fallLow: 0,
    basic: 0,
    summerHigh: 0
  });

  const [open, setOpen] = React.useState(false);
  const [patternOpen, setPatternOpen] = React.useState(false);
  const [colorOpen, setColorOpen] = React.useState(false);

  const dataContext = useContext(DataContext);

  const [search, setSearch] = useState<Search>(defaultSearch());

  const [requestList, setRequestList] = useState<boolean>(false);

  const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
    setSearch({
      ...search,
      page: newPage,
    });
    setRequestList(true);
  };

  const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    setSearch({
      ...search,
      size: parseInt(event.target.value, 10),
    });
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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getLists = async () => {
    try {
      const query = {
        ...search
      }
      if (query.tasteCode) {
        query.tasteCode = sortByTaste(Array.from(query.tasteCode)).join('');
      }
      if (query.seasonTypes) {
        query.seasonTypes = sortBySeason(Array.from(query.seasonTypes.split(','))).join(',');
      }
      if (query.categoryKey) {
        const categories = query.categoryKey.split('/');
        categories.forEach((categoryId, index) => {
          if (index == 0) {
            query.category1 = categoryId;
          } else if (index == 1) {
            query.category2 = categoryId;
          } else if (index == 2) {
            query.category3 = categoryId;
          } else if (index == 3) {
            query.category4 = categoryId;
          } else if (index == 4) {
            query.category5 = categoryId;
          }
        })
      }
      const result = await styleApi.getStyleRecommends(query);
      setLists(result.lists);
      setCount(result.count);

      const statusResult = await styleApi.getStyleRecommendStatus();
      setStatus(statusResult);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (storeSearch === 'true') {
      const jenniesPickSearch = sessionStorage.getItem('JenniesPickSearch');
      setSearch(JSON.parse(jenniesPickSearch));
    }
    setRequestList(true);
  },[]);

  useEffect(
      () => {
        sessionStorage.setItem('JenniesPickSearch', JSON.stringify(search));
      },
      [search]
  );

  const handleClickSearch = async () => {
    setSearch({
      ...search,
      page: 0,
    });
    setRequestList(true);
  }

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
    setColorOpen(true);
  };

  const handleClickOpenPattern = () => {
    setPatternOpen(true);
  };

  const handleClose = (value) => {
    if (value) {
      console.log(value);
      setSearch({
        ...search,
        categoryKey: value.key,
        categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
      });
    }
    setOpen(false);
  };

  const handleColorClose = (value) => {
    if (value) {
      setSearch({...search, colorType: value.name})
    }
    setColorOpen(false);
  };

  const handlePatternClose = (value) => {
    if (value) {
      setSearch({...search, patternType: value.name})
    }
    setPatternOpen(false);
  };

  const handleClickClearCategory = () => {
    setSearch({ ...search,
      categoryKey: null,
      categoryName: ''
    });
  };

  const handleClickClearColor = () => {
    setSearch({ ...search,
      colorType: ''
    });
  };

  const handleClickClearPattern = () => {
    setSearch({ ...search,
      patternType: ''
    });
  };


  const handleClickReset = () => {
    setSearch(defaultSearch());
  };

  const changeTasteHandler = (value, checkValues): void => {
    let tasteCode = [];
    if (search.tasteCode) {
      tasteCode = Array.from(search.tasteCode);
    }
    if (tasteCode.length > 0) {
      const findValue = checkValues.find(checkValue => tasteCode.includes(checkValue));
      if (findValue) {
        _.remove(tasteCode, (data) => {
          return data == findValue;
        })
      }
    }
    tasteCode.push(value);

    setSearch(prevData => ({
      ...prevData,
      tasteCode: tasteCode.join('')
    }))
  }

  const getTasteCode = (checkValues) => {
    if (search.tasteCode) {
      const findValue = checkValues.find(value => search.tasteCode.includes(value));
      return (findValue) ? findValue : '';
    }
    return '';
  }

  const changeTpoHandler = (value: string): void => {
    setSearch(prevData => ({
      ...prevData,
      tpoType: value
    }))
  }

  const changeSeasonHandler = (value: string, checked: boolean): void => {
    let season = []
    if (search.seasonTypes) {
      season = search.seasonTypes.split(',');
    }
    if (checked) {
      season.push(value);
    } else {
      _.remove(season, (data) => {
        return data == value;
      });
    }
    setSearch(prevData => ({
      ...prevData,
      seasonTypes: season.join(',')
    }))
  }

  const getTpo = () => {
    return (search.tpoType) ? search.tpoType : '';
  }

  const renderTpo = () => {
    return dataContext.TPO.map(item => {
      return (<MenuItem key={item.id}
                        value={item.name}>{item.name}</MenuItem>)
    })
  }

  const checkedRegisterType = (value) => {
    if (search.registerType) {
      return search.registerType.includes(value)
    }
    return false;
  }

  const checkedSeasonType = (value) => {
    if (search.seasonTypes) {
      return search.seasonTypes.includes(value)
    }
    return false;
  }

  const changeRegisterTypeHandler = (value: string, checked: boolean): void => {
    let season = []
    if (search.registerType) {
      season = search.registerType.split(',');
    }
    if (checked) {
      season.push(value);
    } else {
      _.remove(season, (data) => {
        return data == value;
      });
    }
    setSearch(prevData => ({
      ...prevData,
      registerType: season.join(',')
    }))
  }

  const renderSeason = () => {
    return Object.keys(dataContext.SEASON).map(key => {
      return (
          <FormControlLabel
              key={key}
              value={key}
              control={<Checkbox
                  onChange={e=> {changeSeasonHandler(e.target.defaultValue, e.target.checked)}}
                  checked={checkedSeasonType(key)}
              />}
              label={dataContext.SEASON[key]} />
      )
    });
  }

  const handleKeyUp = (e) => {
    if(e.key === 'Enter') {
      handleClickSearch()
    }
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
                    Jennie’s Pick
                  </Typography>
                </Grid>
                <Grid
                    item
                    sx={{m: -1}}>
                  <NextLink
                      href="/style/ai-manual"
                      passHref
                  >
                    <Button
                        component="a"
                        startIcon={<PlusIcon fontSize="small"/>}
                        sx={{ m: 1 }}
                        variant="outlined"
                    >
                      AI 검색 스타일 등록
                    </Button>
                  </NextLink>
                  <NextLink
                      href="/style/manual?id=0"
                      passHref
                  >
                    <Button
                        component="a"
                        startIcon={<PlusIcon fontSize="small"/>}
                        sx={{ m: 1 }}
                        variant="contained"
                    >
                      메뉴얼 스타일 등록
                    </Button>
                  </NextLink>
                </Grid>
              </Grid>
            </Box>
            <Card sx={{py: 1, mb: 1}}>
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
                      <FormControl sx={{ m: 1, width: '30ch' }}
                                   variant="standard">
                        <InputLabel>컬러</InputLabel>
                        <Input
                            type='text'
                            value={search.colorType}
                            readOnly={true}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                    sx={{p: 0}}
                                    onClick={handleClickClearColor}
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
                        <InputLabel>패턴</InputLabel>
                        <Input
                            type='text'
                            value={search.patternType}
                            readOnly={true}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                    sx={{p: 0}}
                                    onClick={handleClickClearPattern}
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
                    <Stack>
                      <TextField
                          label="스타일 ID"
                          variant="standard"
                          value={search.id}
                          onChange={handleChange('id')}
                          onKeyUp={handleKeyUp}
                          sx={{ m: 1 }}
                      />
                    </Stack>
                  </Stack>
                  <Stack direction="row"
                         sx={{mb: 1}}>
                    <Stack justifyContent={"center"}
                           sx={{mr: 1, ml: 1}}>
                      <FormLabel component="legend">스타일 취향</FormLabel>
                    </Stack>
                    <Stack direction="row">
                      <Select
                          size={"small"}
                          value={getTasteCode(['F', 'D'])}
                          onChange={e=> {changeTasteHandler(e.target.value, ['F', 'D'])}}
                      >
                        <MenuItem value={''}>-</MenuItem>
                        <MenuItem value={'F'}>F</MenuItem>
                        <MenuItem value={'D'}>D</MenuItem>
                      </Select>
                      <Select
                          size={"small"}
                          value={getTasteCode(['C', 'O'])}
                          onChange={e=> {changeTasteHandler(e.target.value, ['C', 'O'])}}
                      >
                        <MenuItem value={''}>-</MenuItem>
                        <MenuItem value={'C'}>C</MenuItem>
                        <MenuItem value={'O'}>O</MenuItem>
                      </Select>
                      <Select
                          size={"small"}
                          value={getTasteCode(['U', 'B'])}
                          onChange={e=> {changeTasteHandler(e.target.value, ['U', 'B'])}}
                      >
                        <MenuItem value={''}>-</MenuItem>
                        <MenuItem value={'U'}>U</MenuItem>
                        <MenuItem value={'B'}>B</MenuItem>
                      </Select>
                      <Select
                          size={"small"}
                          value={getTasteCode(['T', 'M'])}
                          onChange={e=> {changeTasteHandler(e.target.value, ['T', 'M'])}}
                      >
                        <MenuItem value={''}>-</MenuItem>
                        <MenuItem value={'T'}>T</MenuItem>
                        <MenuItem value={'M'}>M</MenuItem>
                      </Select>
                    </Stack>

                    <Stack justifyContent={"center"}
                           sx={{mr: 1, ml: 8.4}}>
                      <FormLabel component="legend">등록 유형</FormLabel>
                    </Stack>
                    <Stack direction="row">
                      <FormControlLabel value={'AI_SEARCH'}
                                        control={<Checkbox
                                            onChange={e=> {changeRegisterTypeHandler(e.target.defaultValue, e.target.checked)}}
                                            checked={checkedRegisterType('AI_SEARCH')}
                                        />}
                                        label="AI 검색" />
                      <FormControlLabel value={'MANUAL'}
                                        control={<Checkbox
                                            onChange={e=> {changeRegisterTypeHandler(e.target.defaultValue, e.target.checked)}}
                                            checked={checkedRegisterType('MANUAL')}
                                        />}
                                        label="메뉴얼" />
                    </Stack>
                  </Stack>
                  <Stack direction="row">
                    <Stack justifyContent={"center"}
                           sx={{mr: 1, ml: 1}}>
                      <FormLabel component="legend">TPO</FormLabel>
                    </Stack>
                    <Stack direction="row">
                      <Select
                          value={getTpo()}
                          size={"small"}
                          onChange={e=> {changeTpoHandler(e.target.value)}}
                      >
                        <MenuItem value={''}>-</MenuItem>
                        {renderTpo()}
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
                  <Stack direction="row">
                    <Stack justifyContent={"center"}
                           sx={{mr: 2, ml: 2}}>
                      <FormLabel component="legend">시즌</FormLabel>
                    </Stack>
                    <Stack direction="row"
                           justifyContent={"space-between"}>
                      {renderSeason()}
                    </Stack>
                  </Stack>
                </Collapse>
                <Stack direction="row"
                       justifyContent={"flex-end"}>
                  <Box sx={{width: '100%', mt: 0.5}}>
                    <Grid container
                          sx={{m: 0}}
                          spacing={0.5}
                          justifyContent={'start'}>
                      <Grid item
                            xs={12}>
                        <Typography variant={'h6'}>총 코디 수: {getNumberComma(status.total)}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container
                          sx={{m: 0}}
                          spacing={0.5}
                          justifyContent={'start'}>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>SPRING_LOW: {getNumberComma(status.springLow)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>SPRING_HIGH: {getNumberComma(status.springHigh)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>SUMMER_LOW: {getNumberComma(status.summerLow)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>SUMMER_HIGH: {getNumberComma(status.summerHigh)}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container
                          sx={{m: 0}}
                          spacing={0.5}
                          justifyContent={'start'}>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>FALL_LOW: {getNumberComma(status.fallLow)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>FALL_HIGH: {getNumberComma(status.fallHigh)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>WINTER_LOW: {getNumberComma(status.winterLow)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>WINTER_HIGH: {getNumberComma(status.winterHigh)}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container
                          sx={{m: 0}}
                          spacing={0.5}
                          justifyContent={'start'}>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>페미닌: {getNumberComma(status.feminine)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>캐쥬얼: {getNumberComma(status.casual)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>유니크: {getNumberComma(status.unique)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>클래식: {getNumberComma(status.traditional)}</Typography>
                      </Grid>
                    </Grid>
                    <Grid container
                          sx={{m: 0}}
                          spacing={0.5}
                          justifyContent={'start'}>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>댄디: {getNumberComma(status.dandy)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>오피스: {getNumberComma(status.office)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>베이직: {getNumberComma(status.basic)}</Typography>
                      </Grid>
                      <Grid item
                            xs={2}>
                        <Typography variant={'body2'}>모던: {getNumberComma(status.modern)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
                <Stack direction="row"
                       justifyContent={"flex-end"}>
                  <ExpandMore expand={expanded}
                              aria-expanded={expanded}
                              sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                              onClick={handleExpandClick}>
                    <ExpandMoreOutlinedIcon />
                  </ExpandMore >
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
            <Card>
              <StyleRecommendList
                  lists={lists}
                  count={count}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPage={search.size}
                  page={search.page}
                  getLists={getLists}
              />
            </Card>
          </Container>
        </Box>
        <CategoryDialog
            keepMounted
            open={open}
            onClose={handleClose}
            category={dataContext.CATEGORY}
            value={search.categoryKey}
        />
        <ColorDialog
            keepMounted
            open={colorOpen}
            onClose={handleColorClose}
            items={dataContext.COLOR}
            value={search.colorType}
        />
        <PatternDialog
            keepMounted
            open={patternOpen}
            onClose={handlePatternClose}
            items={dataContext.PATTERN}
            value={search.patternType}
        />
      </>
  )
}

JenniesPick.getLayout = (page) => (
    <AuthGuard>
      <DashboardLayout>
        {page}
      </DashboardLayout>
    </AuthGuard>
);

export default JenniesPick;