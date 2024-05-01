import {
    Box,
    Button,
    Collapse,
    Divider,
    FormControl,
    FormLabel,
    IconButton,
    IconButtonProps,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from "@mui/material";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import BtbProductFitAssignList from "./b2b-product-fit-assign-list";
import {
    AssignModel,
    BtbAssignmentModel,
    defaultAssign,
    defaultSearch,
    Search
} from "../../../types/b2b-partner-model/b2b-jennie-fit-assignment-model";
import {DataContext} from "../../../contexts/data-context";
import {BtbJennieFitWorkerModel} from "../../../types/b2b-partner-model/b2b-jennie-fit-worker-model";
import {CategoryDialog} from "../../dialog/category-dialog";
import {getDataContextValue} from "../../../utils/data-convert";
import {btbJennieFitProductAssignmentApi} from "../../../b2b-partner-api/b2b-jennie-fit-assignment-api";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import {styled} from "@mui/material/styles";
import toast from "react-hot-toast";
import _ from "lodash";


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

const ProductFitAssign = () => {
    const dataContext = useContext(DataContext);
    const [expanded, setExpanded] = useState(false);

    const [search, setSearch] = useState<Search>(defaultSearch());
    const [assign, setAssign] = useState<AssignModel>(defaultAssign());
    const [workerLists, setWorkerLists] = useState<BtbJennieFitWorkerModel[]>([]);

    const [selectedOneList, setSelectedOneList] = useState<BtbAssignmentModel[]>([]);
    const [selectedAllLists, setSelectedAllLists] = useState<boolean>(false);

    const [list, setList] = useState<BtbAssignmentModel[]>([]);
    const [count, setCount] = useState<number>(null);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [openMaleCategoryDialog, setOpenMaleCategoryDialog] = useState(false);
    const [requestList, setRequestList] = useState<boolean>(false);

    const getUnAssignedProducts = async () => {
        const query = {
            ...search,
            sort : 'id,desc'
        }
        const result = await btbJennieFitProductAssignmentApi.getJennieFitUnAssignedProducts(query)
        setList(result.lists);
        setCount(result.count)
    }

    const getWorkerList = async () => {
        const response = await btbJennieFitProductAssignmentApi.getJennieFitAssignmentWorkerList({workType: 'FitProduct'});
        setWorkerLists(response)
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleChange = (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.value == 'All'){
            setSearch({...search, [prop]: ''})
        }else{
            setSearch({...search, [prop]: event.target.value})
        }
    }

    const handleClickOpen = () => {
        setOpenCategoryDialog(true);
    }

    const handleClickOpenMale = () => {
        setOpenMaleCategoryDialog(true);
    }

    const handleChangeDate = (prop: keyof Search) => (value) => {
        setSearch({...search, [prop]: value})
    }

    const handleChangeAssignDate = (value) => {
        setAssign(prevData => ({
            ...prevData,
            workStartDay: value
        }))
    }

    const handleClearCategory = () => {
        setSearch({...search, categoryIds: null, categoryName: ''})
    }

    const handleClearMaleCategory = () => {
        setSearch({...search, maleCategoryIds: null, maleCategoryName: ''})
    }

    const renderType = (target) => {
        return Object.keys(dataContext[target]).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext[target][key]}</MenuItem>)
        });
    }

    const renderWorkers = () => {
        return workerLists.map(item => {
            return (<MenuItem key={item.workerId}
                              value={item.workerId}
                              data-workerName={item.workerName}>{item.workerName}</MenuItem>)
        })
    }

    const handleKeyUp = async (e) => {
        if (e.key === 'Enter') {
            await getUnAssignedProducts()
        }
    }

    const handleWorkerLists = (_event, item) => {
        setAssign({
            ...assign,
            workerId: item.props.value,
            workerName: item.props['data-workerName'],
        })
    }

    const handlePriorityType = (value) => {
        setAssign({...assign, priorityType: value})
    }

    const handleClickReset = () => {
        setSearch(defaultSearch());
    }

    const handleAssignSave = async () => {
        const saveData = {...assign};

        if (selectedOneList.length === 0) {
            toast.error('선택된 목록이 없습니다.');
            return;
        }
        if (saveData.workerId === null) {
            toast.error('작업자를 선택해주세요.');
            return;
        }
        if (_.isEmpty(saveData.priorityType)) {
            toast.error('작업유형을 선택해주세요.');
            return;
        }
        if (saveData.workStartDay === null) {
            toast.error('배정일을 선택해주세요.');
            return;
        }
        saveData.ids = [];
        selectedOneList.forEach(product => {
            saveData.ids.push(product.id)
        })

        await btbJennieFitProductAssignmentApi.patchJennieFitAssignment(saveData
        ).then(() => {
            setAssign(defaultAssign());
            setSelectedOneList([]);
            setSelectedAllLists(false);
            getUnAssignedProducts();
            toast.success('배정되었습니다.');
        });
    }

    const handleClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                categoryIds: value.id,
                categoryName: getDataContextValue(dataContext, 'CATEGORY_MAP', value.id, 'path')
            });
        }
        setOpenCategoryDialog(false);
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

    const handlePageChange = async (_event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setSearch({...search, page: newPage});
        setRequestList(true);
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSearch({...search, size: parseInt(event.target.value, 10)});
        setRequestList(true);
    };

    const handleSelectOneList = (
        _event: ChangeEvent<HTMLInputElement>,
        item: BtbAssignmentModel
    ): void => {
        setSelectedAllLists(false)
        if (!selectedOneList.includes(item)) {
            setSelectedOneList((prevSelected) => [...prevSelected, item]);
        } else {
            setSelectedOneList((prevSelected) => prevSelected.filter((id) => id !== item));
        }
    };


    const handleSelectAllLists = () => {
        if (selectedAllLists) {
            setSelectedAllLists(false);
            setSelectedOneList([]);
        } else {
            setSelectedAllLists(true);
            setSelectedOneList(list);
        }

    };

    useEffect(() => {
        getWorkerList();
        getUnAssignedProducts();
    }, [])

    useEffect(() => {
        if(requestList) {
            getWorkerList();
            getUnAssignedProducts();
            setRequestList(false);
        }
    }, [requestList])

    const handleClickSearch = async () => {
        setSearch({
            ...search,
            page: 0,
        });
        setRequestList(true);
    }

    return (
        <Box>
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
                        label="상품명"
                        variant="standard"
                        value={search.productName || ''}
                        onChange={handleChange('productName')}
                        onKeyUp={handleKeyUp}
                        sx={{m: 1}}
                    />
                </Stack>
                <Stack direction="row"
sx={{ml: 2, mb: 2, mt:1}}>
                    <Stack justifyContent={"center"}
sx={{mr: 2, ml: 1, mt: 2}}>
                        <FormLabel> 작업일 </FormLabel>
                    </Stack>
                    <Stack sx={{mt: 2, px: 1}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={search.startDate}
                                inputFormat={"yyyy-MM-dd"}
                                mask={"____-__-__"}
                                onChange={handleChangeDate('startDate')}
                                renderInput={(params) => <TextField {...params}
                                                                    variant="standard"
                                                                    sx={{height: 40, width: 200}}/>}
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
                                onChange={handleChangeDate('endDate')}
                                renderInput={(params) => <TextField {...params}
                                                                    variant="standard"
                                                                    sx={{height: 40, width: 200}}/>}
                            />
                        </LocalizationProvider>
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
                                    disabled={search.maleCategoryName != ''}
                                    onClick={handleClearCategory}
                                  >
                                      <ClearIcon/>
                                  </IconButton>
                                  <IconButton
                                    sx={{p: 0}}
                                    disabled={search.maleCategoryName != ''}
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
                                    disabled={search.categoryName != ""}
                                    onClick={handleClearMaleCategory}
                                  >
                                      <ClearIcon/>
                                  </IconButton>
                                  <IconButton
                                    sx={{p: 0}}
                                    disabled={search.categoryName != ""}
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
                <Stack direction="row"
                       sx={{mr: 1, ml: 1, mt: 3}}>
                    <Stack justifyContent={"center"}
sx={{mr: 2}}>
                        <FormLabel component="legend">생성타입</FormLabel>
                    </Stack>
                    <Stack justifyContent={"center"}
sx={{mt: 1, width: 200}}>
                        <Select
                            size={"small"}
                            value={search.registrationType ? search.registrationType : 'All' || ''}
                            onChange={handleChange('registrationType')}
                        >
                            {renderType('BTB_REGISTRATION_TYPE')}
                        </Select>
                    </Stack>
                </Stack>
            </Collapse>
            <Stack direction="row"
                   justifyContent={"flex-end"}
                   sx={{mb: 4}}>
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
            <Divider></Divider>
            <Stack direction="row"
                   justifyContent={"flex-start"}
                   sx={{mb: 2, mt: 4, height: 80}}>
                <Stack direction="row">
                    <Stack justifyContent={"center"}
                           sx={{mr: 1, ml: 1, mb: 4}}>
                        <FormLabel component="legend">작업자</FormLabel>
                    </Stack>
                    <Stack direction="row">
                        <Select
                            sx={{width: 200, height: 40, mr: 3}}
                            size={"small"}
                            value={assign.workerId || ''}
                            onChange={handleWorkerLists}
                        >
                            {renderWorkers()}
                        </Select>
                    </Stack>
                </Stack>
                <Stack direction="row">
                    <Stack justifyContent={"center"}
                           sx={{mr: 1, ml: 1.5, mb: 4}}>
                        <FormLabel component="legend">작업 유형</FormLabel>
                    </Stack>
                    <Stack direction="row">
                        <Select
                            sx={{width: 200, height: 40, mr: 3}}
                            size={"small"}
                            value={assign.priorityType || ''}
                            onChange={(e) => handlePriorityType(e.target.value)}
                        >
                            {renderType('BTB_ASSIGN_PRIORITY')}
                        </Select>
                    </Stack>
                </Stack>
                <Stack direction="row">
                    <Stack justifyContent={"center"}
                           sx={{mr: 2, ml: 1.5, mb: 5}}>
                        <FormLabel component="legend">배정일</FormLabel>
                    </Stack>
                    <Stack direction="row"
                           sx={{mr: 10}}>
                        <Stack sx={{height: 40, px: 1}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={assign.workStartDay}
                                    inputFormat={"yyyy-MM-dd"}
                                    mask={"____-__-__"}
                                    onChange={handleChangeAssignDate}
                                    renderInput={(params) => <TextField {...params}
                                                                        variant="standard"
                                                                        sx={{width: 200}}/>}
                                />
                            </LocalizationProvider>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction="row"
                       justifyContent={"flex-start"}
                       sx={{mb: 5.5}}>
                    <Stack direction="row">
                        <Stack justifyContent={"center"}
                               sx={{mr: 1, ml: 1}}>
                            <FormLabel component="legend">총 선택 : {selectedOneList.length} 건</FormLabel>
                        </Stack>
                        <Stack direction="row">
                            <Button size='small'
                                    variant="outlined"
                                    sx={{ml: 2, mr: 0.5, p: 0.3, fontSize: 12}}
                                    onClick={handleAssignSave}
                            >
                                배정
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <BtbProductFitAssignList
                lists={list}
                count={count}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={search.size}
                page={search.page}
                selectedLists={selectedOneList}
                selectedAllLists={selectedAllLists}
                selectAllList={handleSelectAllLists}
                selectOneList={handleSelectOneList}
            />
            <CategoryDialog
                open={openCategoryDialog}
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
        </Box>
    )
}

export default ProductFitAssign;