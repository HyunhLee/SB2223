import {
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from "@mui/material";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {DataContext} from "../../../contexts/data-context";
import {BrandDialog} from "../handsome-dialog/brand-dialog";
import {ProductFitReassginList} from "./product-fit-reassgin-list";
import {jennieFitWorkerApi} from "../../../handsome-api/jennie-fit-worker-api";
import {jennieFitProductAssignmentApi} from "../../../handsome-api/jennie-fit-product-assignment-api";
import _ from "lodash";
import toast from "react-hot-toast";
import moment from "moment";
import {HandsomeJennieFitAssignmentProduct,} from "../../../types/handsome-model/handsome-jennie-fit-assignment-model";
import {HandsomeJennieFitUserModel} from "../../../types/handsome-model/handsome-jennie-fit-worker-model";


interface Search {
    id: number;
    brandId: number;
    brandName: string;
    number: string;
}

const defaultReassign = () => {
    return {
        jennieFitAssignmentPriorityType: '',
        workStartDay: moment().format('YYYY-MM-DD'),
        productIds: [],
    }
}

const defaultSearch = () => {
    return {
        id: null,
        brandId: null,
        brandName: '',
        number: null,
    }
}

const ProductFitReassign = (props) => {
    const dataContext = useContext(DataContext);

    const [lists, setLists] = useState<HandsomeJennieFitAssignmentProduct[]>([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [count, setCount] = useState(0);
    const [reassign, setReassign] = useState(defaultReassign());

    const [workerlists, setWorkerLists] = useState<HandsomeJennieFitUserModel[]>([]);
    const [worker, setWorker] = useState<String>('');
    const [selectedLists, setSelectedLists] = useState<HandsomeJennieFitAssignmentProduct[]>([]);
    const [search, setSearch] = useState<Search>(defaultSearch());
    const [reset, setReset] = useState<boolean>(false);

    const [brandOpen, setBrandOpen] = React.useState(false);
    const [requestList, setRequestList] = useState<boolean>(false);

    // @ts-ignore
    useEffect(async ()=> {
            if(requestList){
                await getLists();
                await getWorkerLists();
                setRequestList(false);
                setReset(false);
            }

        },
        [requestList, reset]
    );

    const getLists = async () => {
        try {
            const query = {
                size, page, productId: search.id, brandId: search.brandId, number: search.number
            }
            const result = await jennieFitProductAssignmentApi.getJennieFitAssignProduct(query);
            setLists(result.lists);
            setCount(result.count)
            setSelectedLists([]);
        } catch (err) {
            console.error(err);
        }
    };

    //for workerlist
    const getWorkerLists = async () => {
        try {
            const result = await jennieFitWorkerApi.getJennieFitWorkers();
            setWorkerLists(result);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(
        () => {
            setRequestList(true);
        },
        []
    );

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setPage(newPage + 1);
        setRequestList(true);
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSize(parseInt(event.target.value, 10));
        setRequestList(true);
    };

    const handleSelectAllLists = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedLists(event.target.checked ? lists : []);
    };

    const handleSelectOneList = (
        event: ChangeEvent<HTMLInputElement>,
        item: HandsomeJennieFitAssignmentProduct
    ): void => {
        if (!selectedLists.includes(item)) {
            setSelectedLists((prevSelected) => [...prevSelected, item]);
        } else {
            setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== item));
        }
    };


    const handleClickBrandOpen = () => {
        setBrandOpen(true);
    };

    const handleBrandClose = (value) => {
        if (value) {
            setSearch({
                ...search,
                brandId: value.id,
                brandName: value.nameEn,
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

    const handleClickReset = () => {
        setSearch(defaultSearch());
        setReset(true)
        setRequestList(true);
    };



    const changeWorker = (item) => {
        setWorker(item.target.value)
    }

    const changePriorityType = (value) => {
        setReassign(prevData => ({
            ...prevData,
            jennieFitAssignmentPriorityType: value
        }))
    }

    const handleChangeAssignDate = (value) => {
        setReassign(prevData => ({
            ...prevData,
            workStartDay: value
        }))
    }


    const handleAssignSave = async () => {
        const saveData = {...reassign};

        if (selectedLists.length === 0) {
            toast.error('선택된 목록이 없습니다.');
            return;
        }
        if (worker === null) {
            toast.error('작업자를 선택해주세요.');
            return;
        }
        if (_.isEmpty(saveData.jennieFitAssignmentPriorityType)) {
            toast.error('작업유형을 선택해주세요.');
            return;
        }
        if (saveData.workStartDay === null) {
            toast.error('배정일을 선택해주세요.');
            return;
        }
        saveData.productIds = [];
        selectedLists.forEach(product => {
            saveData.productIds.push(product.id)
        })
        // @ts-ignore
        saveData.workStartDay = moment(saveData.workStartDay).format('YYYYMMDD');

        const statusCode = await jennieFitProductAssignmentApi.postJennieFitReassign(worker, saveData);
        if (statusCode === 200) {
            setReassign(defaultReassign());
            setSelectedLists([]);
            setRequestList(true);
            toast.success('재배정되었습니다.');
        }
    }

    const renderWorkers = () => {
        return workerlists.map(item => {
            return (<MenuItem key={item.id}
                              value={item.userId}
                              data-workerName={item.name}>{item.name}</MenuItem>)
        })
    }

    const handleChange = (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({...search, [prop]: event.target.value});
    };


    const handleKeyUp = async (e) => {
        if (e.key === 'Enter') {
            await getLists();
        }
    }

    const handleClickSearch = async () => {
        setPage(1);
        setRequestList(true);
    }

    return (
        <Box sx={{p: 1}}>
            <Stack direction="row"
sx={{mb: 2}}>
                <Stack>
                    <TextField
                        label="상품ID"
                        variant="standard"
                        value={search.id == null ? '' : search.id}
                        onChange={handleChange('id')}
                        onKeyUp={handleKeyUp}
                        sx={{m: 1, mr: 2}}
                    />
                </Stack>
                <Stack>
                    <TextField
                      label="상품품번"
                      variant="standard"
                      value={search.number? search.number : ''}
                      onChange={handleChange('number')}
                      onKeyUp={handleKeyUp}
                      sx={{m: 1, mr: 2}}
                    />
                </Stack>
                <Stack>
                    <FormControl sx={{m: 1, width: '25ch'}}
                                 variant="standard">
                        <InputLabel sx={{pl: 1}}
htmlFor="standard-adornment-brand">브랜드</InputLabel>
                        <Input
                            type='text'
                            value={search.brandName}
                            readOnly={true}
                            sx={{m: 1, mr: 2}}
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
            </Stack>
            <Stack direction="row"
                   justifyContent={"flex-end"}
                   sx={{mb: 4}}>
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
                           sx={{mr: 1, ml: 1}}>
                        <FormLabel component="legend">작업자</FormLabel>
                    </Stack>
                    <Stack direction="row">
                        <Select
                            sx={{width: 200, height: 40, mt: 2.5, mr: 3}}
                            size={"small"}
                            value={worker}
                            onChange={changeWorker}
                        >
                            {renderWorkers()}
                        </Select>
                    </Stack>
                </Stack>
                <Stack direction="row">
                    <Stack justifyContent={"center"}
                           sx={{mr: 1, ml: 1.5}}>
                        <FormLabel component="legend">작업 유형</FormLabel>
                    </Stack>
                    <Stack direction="row">
                        <Select
                            sx={{width: 200, height: 40, mt: 2.5, mr: 3}}
                            size={"small"}
                            value={reassign.jennieFitAssignmentPriorityType}
                            onChange={e => {
                                changePriorityType(e.target.value)
                            }}
                        >
                            <MenuItem value={''}>-</MenuItem>
                            <MenuItem value={'NORMAL'}>일반</MenuItem>
                            <MenuItem value={'URGENCY'}>긴급</MenuItem>
                        </Select>
                    </Stack>
                </Stack>
                <Stack direction="row">
                    <Stack justifyContent={"center"}
                           sx={{mr: 2, ml: 1.5}}>
                        <FormLabel component="legend">배정일</FormLabel>
                    </Stack>
                    <Stack direction="row"
sx={{mt: 3, mr: 10}}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                inputFormat={"yyyy-MM-dd"}
                                mask={"____-__-__"}
                                value={reassign.workStartDay}
                                onChange={handleChangeAssignDate}
                                renderInput={(params) => <TextField {...params}
                                                                    variant="standard"
                                                                    sx={{width: 150}}/>}
                            />
                        </LocalizationProvider>
                    </Stack>
                </Stack>
                <Stack direction="row"
                       justifyContent={"flex-start"}
                       sx={{mb: 3, mt: 4}}>
                    <Stack direction="row">
                        <Stack justifyContent={"center"}
                               sx={{mr: 1, ml: 1}}>
                            <FormLabel component="legend">총 선택: {selectedLists.length} 건</FormLabel>
                        </Stack>
                        <Stack justifyContent={"center"}>
                            <Button size='small'
                                    variant="outlined"
                                    sx={{ml: 2}}
                                    onClick={handleAssignSave}>
                                재배정
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <ProductFitReassginList
                lists={lists}
                count={count}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={size}
                page={page - 1}
                selectedLists={selectedLists}
                selectAllLists={handleSelectAllLists}
                selectOneList={handleSelectOneList}
            />
            <BrandDialog
                keepMounted
                open={brandOpen}
                onClose={handleBrandClose}
                items={dataContext.HANDSOME_BRAND}
                value={search.brandId}
            />
        </Box>
    )
}

export default ProductFitReassign;