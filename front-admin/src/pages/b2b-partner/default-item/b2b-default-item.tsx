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
    FormLabel,
    Grid,
    IconButton,
    IconButtonProps,
    Input,
    InputAdornment,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {DataContext} from "../../../contexts/data-context";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {Plus as PlusIcon} from "../../../icons/plus";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {getDataContextValue, getNumberComma, renderKeyword} from "../../../utils/data-convert";
import {CategoryDialog, ColorDialog, PatternDialog} from "../../../components/dialog/category-dialog";
import toast from 'react-hot-toast';
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import {useRouter} from "next/router";
import {DefaultItemList} from "../../../components/b2b-partner/default-item/default-item-list";
import {
    B2bDefaultItemModel,
    defaultSearch,
    Search,
    StyleKeywordsStatus
} from "../../../types/b2b-partner-model/b2b-default-item-model";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {styled} from "@mui/material/styles";
import {b2bDefaultItemApi} from "../../../b2b-partner-api/b2b-default-item-api";

const SeasonOptions = ['SPRING', 'SUMMER', 'FALL', 'WINTER'];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            minWidth: 180,
        },
    },
};

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

export const B2bDefaultItem: NextPage = () => {
    const [list, setLists] = useState<B2bDefaultItemModel[]>([]);
    const [count, setCount] = useState<number>(0);
    const [expanded, setExpanded] = useState(false);

    const [requestList, setRequestList] = useState<boolean>(false);

    const [open, setOpen] = React.useState(false);
    const [openMaleCategoryDialog, setOpenMaleCategoryDialog] = useState(false);

    const dataContext = useContext(DataContext);

    const [search, setSearch] = useState<Search>(defaultSearch());

    const [openColor, setOpenColor] = React.useState(false);
    const [openPattern, setOpenPattern] = React.useState(false);
    const [gender, setGender] = useState<string>('');
    const [status, setStatus] = useState<StyleKeywordsStatus>();
    const [cnt, setCnt] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isCountLoaded, setCountIsLoaded] = useState<boolean>(false);
    const [control, setControl] = useState(true);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

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

    const router = useRouter();
    const {storeSearch} = router.query;

    useEffect(() => {
        if (storeSearch === 'true') {
            const B2bDefaultItemSearch = sessionStorage.getItem('B2bDefaultItemSearch');
            setSearch(JSON.parse(B2bDefaultItemSearch));
        }
        setRequestList(true);
    },[]);

    useEffect(
        () => {
            sessionStorage.setItem('B2bDefaultItemSearch', JSON.stringify(search));
        },
        [search]
    );

    useEffect(
        () => {
            (async () => {
                if (requestList) {
                    setIsLoaded(false);
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

    const getLists = async () => {
        try {
            const query = {
                ...search,
                seasonTypes: search.seasonTypesList.join(',')
            }
            const result = await b2bDefaultItemApi.getDefaultItems(query);
            setLists(result.lists);
            setCount(result.count);

            if(control) {
                setCountIsLoaded(false);
                const statusResult = await b2bDefaultItemApi.getDefaultStat(gender);
                setStatus(statusResult);
                if (gender == '') {
                    setCnt(statusResult.gender[0].cnt + statusResult.gender[1].cnt);
                }
                setControl(false);
                setCountIsLoaded(true);
            }
            setIsLoaded(true);
        } catch (err) {
            console.error(err);
            toast.error('데이터를 불러오는데 실패하였습니다.');
        }
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

    const handleClickOpenMale = () => {
        setOpenMaleCategoryDialog(true);
    }

    const handleClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                categoryId: value.id,
                categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpen(false);
    };

    const handleCloseMale = (value) => {
        if (value) {
            setSearch({
                ...search,
                maleCategoryIds: value.id,
                maleCategoryName: getDataContextValue(dataContext, 'MALE_CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpenMaleCategoryDialog(false);
    };

    const handleClickClearCategory = (prop) => {
        setSearch({ ...search,
            categoryId: '',
            categoryName: ''
        });
    };

    const handleClearMaleCategory = () => {
        setSearch({...search, maleCategoryIds: null, maleCategoryName: ''})
    }

    const handleClickReset = () => {
        setSearch(defaultSearch());
    };

    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 0,
        });
        setControl(false);
        setRequestList(true);
    }

    const handleKeyUp = (e) => {
        if(e.key === 'Enter') {
            handleClickSearch()
        }
    }

    const handleClickClear = (prop: keyof Search) => {
        setSearch({ ...search, [prop]: '' });
    };

    const handleClickOpenColor = () => {
        setOpenColor(true);
    };

    const handleClickOpenPattern = () => {
        setOpenPattern(true);
    };

    const handleCloseColor = (values) => {
        if (values) {
            console.log(values);
            setSearch({
                ...search,
                colorName: values.map(item => {
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
                patternName: values.map(item => {
                    return item.name;
                }).join(',')
            });
        }
        setOpenPattern(false);
    };

    const handleChangeSeason = (event: SelectChangeEvent<typeof search.seasonTypesList>) => {
        setSearch({...search, seasonTypesList: event.target.value})
    };

    const renderSeason = () => {
        return SeasonOptions.map((season, idx) => {
            return (<MenuItem key={idx}
                              value={season}>
                <Checkbox checked={search.seasonTypesList?.indexOf(season) > -1}/>
                <ListItemText primary={season}/>
            </MenuItem>)
        })
    }

    const handleChangeKeyword = (event: SelectChangeEvent<typeof search.styleKeywordsList>) => {
        const {
            target: {value},
        } = event;
        let keywords = '';
        if(value.length > 0) {
            keywords = [...value].map((name) => renderKeyword(name)).join(',');
        }
        setSearch({...search, styleKeywords: keywords, styleKeywordsList: value})
    };

    const renderKeywords = () => {
        if(gender == 'M') {
            return Object.keys(dataContext.B2BMALEKEYWORDS).map(key => {
                return (<MenuItem key={dataContext.B2BMALEKEYWORDS[key]}
                                  value={dataContext.B2BMALEKEYWORDS[key]}>
                    <Checkbox checked={search.styleKeywordsList?.indexOf(dataContext.B2BMALEKEYWORDS[key]) > -1}/>
                    <ListItemText primary={dataContext.B2BMALEKEYWORDS[key]}/>
                </MenuItem>)
            })
        } else {
            return Object.keys(dataContext.B2BKEYWORDS).map(key => {
                return (<MenuItem key={dataContext.B2BKEYWORDS[key]}
                                  value={dataContext.B2BKEYWORDS[key]}>
                    <Checkbox checked={search.styleKeywordsList?.indexOf(dataContext.B2BKEYWORDS[key]) > -1}/>
                    <ListItemText primary={dataContext.B2BKEYWORDS[key]}/>
                </MenuItem>)
            })
        }
    };

    const MoveToAddItem = () => {
        router.push(`/b2b-partner/default-item/b2b-add-default-item`);
    }

    const handleGenderChange = (g) => {
        setGender(g);
        setSearch({...search, gender: g});
        if(g == '') {
            setCnt(status.gender[0].cnt+status.gender[1].cnt);
        } else {
            setCnt(status.gender.filter(v => {
                return v.gender == g
            })[0].cnt);
        }
        setControl(true);
        setRequestList(true);
    }

    return (
        <>
            <Head>
                DefaultItem | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 2
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{mb: 1, py: 2, ml: 3, mt: 2}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Typography variant="h4">
                                디폴트 아이템 리스트
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<PlusIcon />}
                                onClick={MoveToAddItem}
                            >
                                디폴트 아이템 추가
                            </Button>
                        </Grid>
                    </Box>
                    <Card sx={{py: 1}}>
                        <CardContent sx={{py: 1}}>
                            <Box sx={{width: '100%', mt: 0.5, mb:3}}>
                                <Grid container
                                      sx={{mb: 3, mt:1}}
                                      spacing={0.5}
                                      justifyContent={'start'}>
                                    <Stack direction={'row'}>
                                        <Grid item
                                              xs={12}>
                                            <Typography variant={'h6'}>디폴트 상품 현황: {isCountLoaded ? getNumberComma(cnt) : ' 데이터 로딩 중..'}</Typography>
                                        </Grid>
                                        <Button size={'small'}
variant={gender == '' ? 'contained' : 'outlined'}
color={'success'}
sx={{ml: 2, mt: -1, height: 40}}
                                                onClick={() => handleGenderChange('')}
                                        >전체</Button>
                                        <Button size={'small'}
variant={gender == 'M' ? 'contained' : 'outlined'}
color={'info'}
sx={{ml: 2, mt: -1, height: 40}}
                                                onClick={() => handleGenderChange('M')}
                                        >남성</Button>
                                        <Button size={'small'}
variant={gender == 'F' ? 'contained' : 'outlined'}
color={'warning'}
sx={{ml: 2, mt: -1, height: 40}}
                                                onClick={() => handleGenderChange('F')}
                                        >여성</Button>
                                    </Stack>
                                </Grid>
                                <Grid container
                                      sx={{m: 0}}
                                      spacing={0.8}
                                      justifyContent={'start'}>
                                    {status?.styleKeyword.map((v) => {
                                        return (
                                            <>
                                                <Grid item
                                                      xs={2}>
                                                    <Typography variant={'body2'}>{v.styleKeyword}: {v.cnt}</Typography>
                                                </Grid>
                                            </>
                                        )
                                    })}
                                </Grid>
                            </Box>
                            <Collapse in={expanded}
                                      timeout="auto"
                                      unmountOnExit>
                                <Stack direction="row"
sx={{mt:1, mb:2}}>
                                    <Stack>
                                        <FormControl sx={{ m: 1, width: '30ch' , mr: 2}}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">여성 카테고리</InputLabel>
                                            <Input
                                                id="standard-adornment-password"
                                                type='text'
                                                value={search.categoryName}
                                                readOnly={true}
                                                disabled={search.maleCategoryName != ''}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            disabled={search.maleCategoryName != ''}
                                                            onClick={handleClickClearCategory}
                                                        >
                                                            <ClearIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            disabled={search.maleCategoryName != ''}
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
                                        <FormControl sx={{m: 1, width: '30ch'}}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">남성 카테고리</InputLabel>
                                            <Input
                                                type='text'
                                                value={search.maleCategoryName || ''}
                                                readOnly={true}
                                                disabled={search.categoryName != ''}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            disabled={search.categoryName != ''}
                                                            onClick={handleClearMaleCategory}
                                                        >
                                                            <ClearIcon/>
                                                        </IconButton>
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            disabled={search.categoryName != ''}
                                                            onClick={handleClickOpenMale}
                                                        >
                                                            <SearchIcon/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Stack>
                                    <Stack direction="row"
                                           sx={{mb: 1, mt:3}}>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, ml: 1}}>
                                            <FormLabel component="legend">등록일</FormLabel>
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
                                        <Stack sx={{mr: 1.5, ml: 1.5, mt: 0.5}}>
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
                                </Stack>
                                <Stack direction="row">
                                    <Stack>
                                        <FormControl sx={{ m: 1, maxWidth: '250px'  }}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">컬러</InputLabel>
                                            <Input
                                              id="standard-adornment-password"
                                              type='text'
                                              value={search.colorName}
                                              onChange={handleChange('colorName')}
                                              endAdornment={
                                                  <InputAdornment position="end">
                                                      <IconButton
                                                        sx={{p: 0}}
                                                        onClick={() => handleClickClear('colorName')}
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
                                        <FormControl sx={{ m: 1, maxWidth: '250px' }}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">패턴</InputLabel>
                                            <Input
                                              id="standard-adornment-password"
                                              type='text'
                                              value={search.patternName}
                                              onChange={handleChange('patternName')}
                                              endAdornment={
                                                  <InputAdornment position="end">
                                                      <IconButton
                                                        sx={{p: 0}}
                                                        onClick={() => handleClickClear('patternName')}
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
                                    <Stack direction="row"
sx={{mt:1,}}>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, ml: 2}}>
                                            <FormLabel component="legend">시즌</FormLabel>
                                        </Stack>
                                        <Stack direction="row"
                                               justifyContent={"space-between"}
sx={{mt:1}}>
                                            <Select
                                              name="keyword"
                                              onChange={handleChangeSeason}
                                              multiple={true}
                                              sx={{minWidth: 180, height: 50}}
                                              value={search.seasonTypesList || ''}
                                              renderValue={(selected) => selected.join(',')}
                                              MenuProps={MenuProps}
                                            >
                                                {renderSeason()}
                                            </Select>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack direction="row"
sx={{mt:3}}>
                                    <Stack justifyContent={"center"}>
                                        <TextField
                                            label="상품명"
                                            variant="standard"
                                            value={search.nameKo==null?'':search.nameKo}
                                            onChange={handleChange('nameKo')}
                                            onKeyUp={handleKeyUp}
                                            sx={{ m: 1 }}
                                        />
                                    </Stack>
                                    <Stack justifyContent={"center"}>
                                        <TextField
                                            label="상품ID"
                                            variant="standard"
                                            value={search.id==null?'':search.id}
                                            onChange={handleChange('id')}
                                            onKeyUp={handleKeyUp}
                                            sx={{ m: 1 }}
                                        />
                                    </Stack>
                                    <Stack direction="row"
sx={{mt:1}}>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, ml: 2, mt:0.5}}>
                                            <FormLabel component="legend">스타일 키워드</FormLabel>
                                        </Stack>
                                        <Select
                                          name="keyword"
                                          onChange={handleChangeKeyword}
                                          multiple={true}
                                          sx={{minWidth: 180, height: 50, mt: 1}}
                                          value={search.styleKeywordsList || ''}
                                          renderValue={(selected) => selected.join(',')}
                                          MenuProps={MenuProps}
                                        >
                                            {renderKeywords()}
                                        </Select>
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
                                </ExpandMore>
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
                    <Card sx={{mt: 1}}>
                        <DefaultItemList
                            lists={list}
                            count={count}
                            refreshList={handleRefreshList}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPage={search.size}
                            page={search.page}
                            isLoaded={isLoaded}
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
            <CategoryDialog
                open={openMaleCategoryDialog}
                onClose={handleCloseMale}
                category={dataContext.MALE_CATEGORY}
                value={search.maleCategoryIds}
            />
            <ColorDialog
                keepMounted
                open={openColor}
                onClose={handleCloseColor}
                items={dataContext.COLOR}
                value={search.colorName}
                multiple={true}
            />
            <PatternDialog
                keepMounted
                open={openPattern}
                onClose={handleClosePattern}
                items={dataContext.PATTERN}
                value={search.patternName}
                multiple={true}
            />
        </>
    )
}

B2bDefaultItem.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default B2bDefaultItem;