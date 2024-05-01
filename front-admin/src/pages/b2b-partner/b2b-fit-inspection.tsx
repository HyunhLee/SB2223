import {NextPage} from "next";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
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
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {styled} from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {
    defaultInspectionSearch,
    defaultSearch,
    Search
} from "../../types/b2b-partner-model/b2b-jennie-fit-assignment-model";
import {getDataContextValue} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import {BtbJennieFitWorkerModel} from "../../types/b2b-partner-model/b2b-jennie-fit-worker-model";
import {btbJennieFitProductAssignmentApi} from "../../b2b-partner-api/b2b-jennie-fit-assignment-api";
import {CategoryDialog} from "../../components/dialog/category-dialog";
import {BrandDialog} from "../../components/dialog/brand-dialog";
import B2bInspectionProductList from "../../components/b2b-partner/b2b-inspection-product-list";


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


const B2bFitInspection: NextPage = () => {
    const dataContext = useContext(DataContext);
    const [expanded, setExpanded] = useState(false);

    const [search, setSearch] = useState<Search>(defaultInspectionSearch());
    const [workerLists, setWorkerLists] = useState<BtbJennieFitWorkerModel[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openMaleCategoryDialog, setOpenMaleCategoryDialog] = useState(false);
    const [brandOpen, setBrandOpen] = useState(false);
    const [urgencyList, setUrgencyList] = useState([]);
    const [urgencyCount, setUrgencyCount] = useState<number>(0);
    const [normalList, setNormalList] = useState([]);
    const [normalCount, setNormalCount] = useState<number>(0);
    const [reload, setReload] = useState(true);


    const getWorkerList = async () => {
        const response = await btbJennieFitProductAssignmentApi.getJennieFitAssignmentWorkerList({workType: 'FitProduct'});
        setWorkerLists(response)
    }

    const getInspectionProductList = async () => {
        const query = {
            ...search
        }
        query.priorityType = 'Urgency';
        const urgencyList = await btbJennieFitProductAssignmentApi.getJennieFitInspectionList(query)
        setUrgencyList(urgencyList.lists)
        setUrgencyCount(urgencyList.count)

        query.priorityType = 'Normal';
        const normalList = await btbJennieFitProductAssignmentApi.getJennieFitInspectionList(query)
        setNormalList(normalList.lists)
        setNormalCount(normalList.count)

    }

    const searchWorkerLists = (_event, item) => {
        setSearch({
            ...search,
            workerId: item.props.value,
            workerName: item.props['data-workerName'],
        })
    }

    const renderWorkers = () => {
        return workerLists.map(item => {
            return (<MenuItem key={item.workerId}
                              value={item.workerId}
                              data-workerName={item.workerName}>{item.workerName}</MenuItem>)
        })
    }

    const getStatus = (status) => {
        return search[status] ? search[status] : 'All';
    }

    const renderType = (target) => {
        return Object.keys(dataContext[target]).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext[target][key]}</MenuItem>)
        });
    }

    const handleClickOpen = () => {
        setOpenDialog(true);
    }

    const handleClickOpenMale = () => {
        setOpenMaleCategoryDialog(true);
    }

    const handleClickBrandOpen = () => {
        setBrandOpen(true);
    };

    const handleBrandClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                brandId: value.id,
                brandName: value.name,
            });
        }
        setBrandOpen(false);
    };

    const handleClickClearBrand = () => {
        setSearch({
            ...search,
            brandId: null,
            brandName: ''
        });
    };

    const handleClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                categoryIds: value.id,
                categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpenDialog(false);
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

    const handleClearCategory = () => {
        setSearch({...search, categoryIds: null, categoryName: ''})
    }

    const handleClearMaleCategory = () => {
        setSearch({...search, maleCategoryIds: null, maleCategoryName: ''})
    }

    const handleChange = (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value == 'All') {
            setSearch({...search, [prop]: ''})
        } else {
            setSearch({...search, [prop]: event.target.value})
        }
    }

    const handleChangeDate = (prop: keyof Search) => (value) => {
        setSearch({...search, [prop]: value})
    }

    const handleKeyUp = async (e) => {
        if (e.key === 'Enter') {
            await getInspectionProductList();
        }
    }

    const handleClickReset = () => {
        setSearch(defaultSearch());
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        (async () => {
            if(reload){
                await getWorkerList();
                await getInspectionProductList();
                setReload(false);
            }
        })()
    }, [reload])


    const handlePageChange = async (_event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setSearch({...search, page: newPage});
        setReload(true)
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSearch({...search, size: parseInt(event.target.value, 10)});
        setReload(true)
    };

    const handleReload = () => {
        setReload(true)
    }

    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 0,
        });
        setReload(true);
    }

    return (
        <>
            <Box component="main"
                 sx={{
                     flexGrow: 2,
                     py: 2,
                 }}>
                <Container maxWidth="xl">
                    <Typography variant="h4"
sx={{mb:2}}>
                        B2B Jennie FIT 검수
                    </Typography>
                    <Card sx={{py: 1}}>
                        <CardContent sx={{py:1}}>
                                <Stack direction="row">
                                    <Stack>
                                        <TextField
                                            label="상품ID"
                                            variant="standard"
                                            value={search.productId || ''}
                                            onChange={handleChange('productId')}
                                            onKeyUp={handleKeyUp}
                                            sx={{m: 1, mr: 2}}
                                        />
                                    </Stack>
                                    <Stack>
                                        <TextField
                                          label="제니FIT ID"
                                          variant="standard"
                                          value={search.id || ''}
                                          onChange={handleChange('id')}
                                          onKeyUp={handleKeyUp}
                                          sx={{m: 1, mr: 2}}
                                        />
                                    </Stack>
                                    <Stack>
                                        <FormControl sx={{m: 1,width: '25ch'}}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-brand"
                                                        sx={{px: 1}}>브랜드</InputLabel>
                                            <Input
                                              type='text'
                                              value={search.brandName}
                                              readOnly={true}
                                              sx={{m: 1}}
                                              endAdornment={
                                                  <InputAdornment position="end">
                                                      <IconButton
                                                        sx={{p: 0}}
                                                        onClick={handleClickClearBrand}
                                                      >
                                                          <ClearIcon/>
                                                      </IconButton>
                                                      <IconButton
                                                        sx={{p: 0}}
                                                        onClick={handleClickBrandOpen}
                                                      >
                                                          <SearchIcon/>
                                                      </IconButton>
                                                  </InputAdornment>
                                              }
                                            />
                                        </FormControl>
                                    </Stack>
                                    <Stack direction="row"
                                           sx={{mr: 1, ml: 1, mt: 0.5}}>
                                        <Stack justifyContent={"center"}
                                               sx={{mr: 2, mt: 1}}>
                                            <FormLabel component="legend">검수상태</FormLabel>
                                        </Stack>
                                        <Stack justifyContent={"center"}
                                               sx={{mt: 1, minWidth: 130}}>
                                            <Select
                                              size={"small"}
                                              value={getStatus('jennieFitAssignmentStatus') || ''}
                                              onChange={handleChange('jennieFitAssignmentStatus')}
                                            >
                                                {renderType('BTB_INSPECTION_STATUS')}
                                            </Select>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                    <Stack direction={'row'}>
                                        <FormControl sx={{m: 1, width: '30ch'}}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">여성 카테고리</InputLabel>
                                            <Input
                                                type='text'
                                                value={search.categoryName || ''}
                                                readOnly={true}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            disabled={search.maleCategoryName !== ''}
                                                            onClick={handleClearCategory}
                                                        >
                                                            <ClearIcon/>
                                                        </IconButton>
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            disabled={search.maleCategoryName !== ''}
                                                            onClick={handleClickOpen}
                                                        >
                                                            <SearchIcon/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                        <FormControl sx={{m: 1, width: '30ch'}}
                                                     variant="standard">
                                            <InputLabel htmlFor="standard-adornment-password">남성 카테고리</InputLabel>
                                            <Input
                                                type='text'
                                                value={search.maleCategoryName || ''}
                                                readOnly={true}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            disabled={search.categoryName !== ''}
                                                            onClick={handleClearMaleCategory}
                                                        >
                                                            <ClearIcon/>
                                                        </IconButton>
                                                        <IconButton
                                                            sx={{p: 0}}
                                                            disabled={search.categoryName !== ''}
                                                            onClick={handleClickOpenMale}
                                                        >
                                                            <SearchIcon/>
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </Stack>


                                <Collapse in={expanded}
                                          timeout="auto"
                                          unmountOnExit>
                                    <Stack direction="row">
                                        <Stack direction="row"
sx={{mb: 1, mt: 3}}>
                                            <Stack justifyContent={"center"}
sx={{mr: 2, ml: 1, mt: 2.5}}>
                                                <FormLabel>작업일</FormLabel>
                                            </Stack>
                                            <Stack sx={{mt: 2.5, px: 1}}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        value={search.startDate}
                                                        inputFormat={"yyyy-MM-dd"}
                                                        mask={"____-__-__"}
                                                        onChange={handleChangeDate('startDate')}
                                                        renderInput={(params) => <TextField {...params}
                                                                                            variant="standard"
                                                                                            sx={{height: 40, width: 150}}/>}
                                                    />
                                                </LocalizationProvider>
                                            </Stack>
                                            <Stack sx={{mr: 2, ml: 2, mt: 3}}>
                                                ~
                                            </Stack>
                                            <Stack sx={{mt: 2.5, px: 1}}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        value={search.endDate}
                                                        inputFormat={"yyyy-MM-dd"}
                                                        mask={"____-__-__"}
                                                        onChange={handleChangeDate('endDate')}
                                                        renderInput={(params) => <TextField {...params}
                                                                                            variant="standard"
                                                                                            sx={{height: 40, width: 150}}/>}
                                                    />
                                                </LocalizationProvider>
                                            </Stack>
                                        </Stack>
                                        <Stack direction="row"
                                               sx={{mr: 1, ml: 1, mt: 3}}>
                                            <Stack justifyContent={"center"}
sx={{mr: 2, mt: 1, ml: 2}}>
                                                <FormLabel component="legend">생성타입</FormLabel>
                                            </Stack>
                                            <Stack justifyContent={"center"}
sx={{mt: 1, width: 150}}>
                                                <Select
                                                    size={"small"}
                                                    value={getStatus('registrationType') || ''}
                                                    onChange={handleChange('registrationType')}
                                                >
                                                    {renderType('BTB_REGISTRATION_TYPE')}
                                                </Select>
                                            </Stack>
                                        </Stack>
                                        <Stack direction="row"
                                               sx={{mr: 1, ml: 3, mt: 3}}>
                                            <Stack justifyContent={"center"}
sx={{mr: 2, mt: 1}}>
                                                <FormLabel component="legend">작업자</FormLabel>
                                            </Stack>
                                            <Stack justifyContent={"center"}
sx={{mt: 1, width: 200}}>
                                                <Select
                                                    sx={{width: 150, height: 40, mr: 3}}
                                                    size={"small"}
                                                    value={getStatus('workerId') || ''}
                                                    onChange={searchWorkerLists}
                                                >
                                                    <MenuItem value={'All'}>전체</MenuItem>
                                                    {renderWorkers()}
                                                </Select>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Collapse>
                                <Stack direction="row"
                                       justifyContent={"flex-end"}
                                       sx={{mb: 1, mt: 3}}>
                                    <ExpandMore expand={expanded}
                                                aria-expanded={expanded}
                                                sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                                onClick={handleExpandClick}>
                                        <ExpandMoreOutlinedIcon/>
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
                    <Card sx={{mt:1}}>
                        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant="h4"
sx={{py:1.5}}>긴급 작업</Typography>
                        </Grid>
                        <B2bInspectionProductList lists={urgencyList}
                                                  count={urgencyCount}
                                                  onPageChange={handlePageChange}
                                                  onRowsPerPageChange={handleRowsPerPageChange}
                                                  rowsPerPage={search.size}
                                                  page={search.page}
                                                  reload={handleReload}/>
                    </Card>
                    <Card sx={{mt:1}}>
                        <Grid sx={{m: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant="h4"
sx={{py:1.5}}>일반 작업</Typography>
                        </Grid>
                        <B2bInspectionProductList lists={normalList}
                                                  count={normalCount}
                                                  onPageChange={handlePageChange}
                                                  onRowsPerPageChange={handleRowsPerPageChange}
                                                  rowsPerPage={search.size}
                                                  page={search.page}
                                                  reload={handleReload}/>
                    </Card>
                </Container>
            </Box>
            <CategoryDialog
                open={openDialog}
                onClose={handleClose}
                category={dataContext.CATEGORY}
                value={search.categoryIds}
            />
            <CategoryDialog
                open={openMaleCategoryDialog}
                onClose={handleCloseMale}
                category={dataContext.MALE_CATEGORY}
                value={search.maleCategoryIds}
            />
            <BrandDialog
                open={brandOpen}
                onClose={handleBrandClose}
                items={dataContext.B2B_MALL_BRANDS}
                value={search.brandId}
            />
        </>
    )
}


B2bFitInspection.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default B2bFitInspection