import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField
} from "@mui/material";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {CategoryDialog} from "../dialog/category-dialog";
import {getDataContextValue} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import {BrandDialog} from "../dialog/brand-dialog";
import {ProductFitReassginList} from "./product-fit-reassgin-list";
import {jennieFitWorkerApi} from "../../api/jennie-fit-worker-api";
import {JennieFitWorkerModel} from "../../types/jennie-fit-worker-model";
import _ from "lodash";
import toast from "react-hot-toast";
import {jennieFitProductAssignmentApi} from "../../api/jennie-fit-product-assignment-api";
import moment from "moment";
import {JennieFitAssignmentModel} from "../../types/jennie-fit-assignment-model";

interface Search {
  productId: number;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  registrationType: string;
  productCreatedStartDate: Date;
  productCreatedEndDate: Date;
  workerId: number;
  priorityType: string;
  productName: string;
  statusIn: string[];
  sort: string;
  isAi: boolean;
  extraOption: string;
}

const defaultReassign = () => {
  return {
    priorityType: '',
    workStartDay: null,
    workerId: '',
    workerName: '',
    productIdList: [],
    isAi: false,
  }
}

const defaultSearch = () => {
  return {
    productId: null,
    categoryId: null,
    categoryName: '',
    brandId: null,
    brandName: '',
    productName: '',
    registrationType: '',
    productCreatedStartDate: null,
    productCreatedEndDate: null,
    statusIn: ['REQUESTED', 'ASSIGNED', 'REJECTED'],
    workerId: null,
    priorityType: '',
    sort: 'id,desc',
    isAi: null,
    extraOption: ''
  }
}

const ProductFitReassign = () => {
  const dataContext = useContext(DataContext);

  const [lists, setLists] = useState<JennieFitAssignmentModel[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(0);
  const [reassign, setReassign] = useState(defaultReassign());

  const [workerlists, setWorkerLists] = useState<JennieFitWorkerModel[]>([]);

  const [selectedLists, setSelectedLists] = useState<JennieFitAssignmentModel[]>([]);
  const [search, setSearch] = useState<Search>(defaultSearch());

  const [open, setOpen] = React.useState(false);
  const [brandOpen, setBrandOpen] = React.useState(false);
  const [requestList, setRequestList] = useState<boolean>(false);

  const handleChangeDate =
    (prop: keyof Search) => (value) => {
      setSearch({ ...search, [prop]: value });
    };

  useEffect(
    () => {
      (async () => {
        if (requestList) {
          await getLists();
          await getWorkerLists();
          setRequestList(false);
        }
      })()
    },
    [requestList]
  );

  const getLists = async () => {
    try {
      const query = {
        size, page, ...search
      }
      const result = await jennieFitProductAssignmentApi.getJennieFitAssignmentsWithProduct(query);
      setLists(result.lists);
      setCount(result.count);
      setSelectedLists([]);
    } catch (err) {
      console.error(err);
    }
  };

  const getWorkerLists = async () => {
    try {
      const query = {
        activated: true,
        workType: 'FIT_PRODUCT'
      }
      const result = await jennieFitWorkerApi.getJennieFitWorkers(query);
      setWorkerLists(result.lists);
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
    setPage(newPage);
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
    item: JennieFitAssignmentModel
  ): void => {
    if (!selectedLists.includes(item)) {
      setSelectedLists((prevSelected) => [...prevSelected, item]);
    } else {
      setSelectedLists((prevSelected) => prevSelected.filter((id) => id !== item));
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

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

  const handleClickReset = () => {
    setSearch(defaultSearch());
  };

  const changeWorker = (event, item) => {
    setReassign(prevData => ({
      ...prevData,
      workerId: item.props.value,
      workerName: item.props['data-workerName'],
    }))
  }

  const changePriorityType = (value) => {
    setReassign(prevData => ({
      ...prevData,
      priorityType: value
    }))
  }

  const handleChangeAssignDate = (value) => {
    setReassign(prevData => ({
      ...prevData,
      workStartDay: value
    }))
  }

  const handleClickClearCategory = () => {
    setSearch({ ...search,
      categoryId: null,
      categoryName: ''
    });
  };

  const handleClickClearBrand = () => {
    setSearch({ ...search,
      brandId: null,
      brandName: ''
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<typeof search.statusIn>) => {
    const {
      target: { value },
    } = event;
    setSearch({...search, statusIn: typeof value === 'string' ? value.split(',') : value});
  };

  const handleAssignSave = async () => {
    const saveData = {...reassign};

    if (selectedLists.length === 0) {
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
    if(selectedLists.filter(v => {
      return v.status == "REQUESTED" || v.status == "COMPLETED"
    }).length > 0) {
      toast.error('검수 신청 혹은 승인 완료 상태인 상품은 재배정 할 수 없습니다.');
      return;
    }
    saveData.productIdList = [];
    selectedLists.forEach(product => {
      saveData.productIdList.push(product.productId)
    })
    saveData.workStartDay = moment(saveData.workStartDay);

    const statusCode = await jennieFitProductAssignmentApi.postJennieFitReassign(saveData);
    if (statusCode === 201) {
      setReassign(defaultReassign());
      setSelectedLists([]);
      setRequestList(true);
      toast.success('재배정되었습니다.');
    }
  }

  const renderWorkers = () => {
    return workerlists.map(item => {
      return (<MenuItem key={item.workerId}
value={item.workerId}
data-workerName={item.workerName}>{item.workerName}</MenuItem>)
    })
  }

  const renderPriority = () => {
    return Object.keys(dataContext.ASSIGN_PRIORITY).map(key => {
      return (<MenuItem key={key}
value={key}>{dataContext.ASSIGN_PRIORITY[key]}</MenuItem>)
    });
  }

  const renderStatus = () => {
    return Object.keys(dataContext.ASSIGN_STATUS_FOR_SEARCH).map(key => {
      return (<MenuItem key={key}
value={key}>{dataContext.ASSIGN_STATUS_FOR_SEARCH[key]}</MenuItem>)
    });
  }

  const renderRegistrationType = () => {
    return Object.keys(dataContext.REGISTRATION_TYPE).map(key => {
      return (<MenuItem key={key}
value={key}>{dataContext.REGISTRATION_TYPE[key]}</MenuItem>)
    });
  }

  const handleChange = (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearch({ ...search, [prop]: event.target.value });
  };

  const handleChangeIsAi = () => (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.value == 'notAi') {
      setSearch({...search, isAi: false, extraOption: event.target.value});
    } else if(event.target.value == 'ai') {
      setSearch({...search, isAi: true, extraOption: event.target.value});
    } else {
      setSearch({...search, isAi: null, extraOption: ''});
    }
  };

  const handleKeyUp = async (e) => {
      if(e.key === 'Enter') {
          await getLists();
      }
  }

  const handleChangeAi = (value: string, checked: boolean): void => {
    setReassign(prevData => ({
      ...prevData,
      isAi: checked
    }))
  }

  const handleClickSearch = async () => {
    setPage(0);
    setRequestList(true);
  }

  return (
    <Box sx={{p: 1}}>
      <Stack direction="row">
        <Stack>
          <FormControl sx={{ m: 1, width: '30ch' }}
variant="standard">
            <InputLabel htmlFor="standard-adornment-password">카테고리</InputLabel>
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
        <Stack direction="row"
sx={{mr: 1, ml: 1.5, mt: 1.5}}>
          <Stack justifyContent={"center"}>
            <FormLabel component="legend">생성타입</FormLabel>
          </Stack>
          <Stack justifyContent={"center"}>
            <Select
              size={"small"}
              value={search.registrationType}
              onChange={handleChange('registrationType')}
            >
              <MenuItem value={''}>-</MenuItem>
              {renderRegistrationType()}
            </Select>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row"
sx={{mt: 2}}>
        <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
          <FormLabel component="legend">등록일</FormLabel>
        </Stack>
        <Stack>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={search.productCreatedStartDate}
              inputFormat={"yyyy-MM-dd"}
              mask={"____-__-__"}
              onChange={handleChangeDate('productCreatedStartDate')}
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
              value={search.productCreatedEndDate}
              inputFormat={"yyyy-MM-dd"}
              mask={"____-__-__"}
              onChange={handleChangeDate('productCreatedEndDate')}
              renderInput={(params) => <TextField {...params}
variant="standard"
sx={{width: 150}} />}
            />
          </LocalizationProvider>
        </Stack>
        <Stack direction="row"
sx={{mr: 1, ml: 1.5}}>
          <Stack justifyContent={"center"}>
            <FormLabel component="legend">작업유형</FormLabel>
          </Stack>
          <Stack direction="row">
            <Select
              size={"small"}
              value={search.priorityType}
              onChange={handleChange('priorityType')}
            >
              <MenuItem value={''}>-</MenuItem>
              {renderPriority()}
            </Select>
          </Stack>
        </Stack>
        <Stack direction="row"
sx={{mr: 1, ml: 1.5}}>
          <Stack justifyContent={"center"}>
            <FormLabel component="legend">작업상태</FormLabel>
          </Stack>
          <Stack direction="row">
            <Select
              size={"small"}
              value={search.statusIn}
              onChange={handleStatusChange}
              multiple
            >
              <MenuItem value={''}>-</MenuItem>
              {renderStatus()}
            </Select>
          </Stack>
        </Stack>
        <Stack direction="row">
          <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
            <FormLabel component="legend">작업자</FormLabel>
          </Stack>
          <Stack justifyContent={"center"}>
            <Select
              size={"small"}
              value={search.workerId}
              onChange={handleChange('workerId')}
            >
              <MenuItem value={''}>-</MenuItem>
              {renderWorkers()}
            </Select>
          </Stack>
        </Stack>
        <Stack direction="row"
               sx={{mr: 1, ml: 1.5}}>
          <Stack justifyContent={"center"}>
            <FormLabel component="legend">추가옵션</FormLabel>
          </Stack>
          <Stack direction="row">
            <Select
                size={"small"}
                value={search.extraOption}
                onChange={handleChangeIsAi()}
            >
              <MenuItem value={''}>전체</MenuItem>
              <MenuItem value={'notAi'}>기존 상품</MenuItem>
              <MenuItem value={'ai'}>AI 처리</MenuItem>
            </Select>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row">
        <Stack>
          <TextField
            label="상품명"
            variant="standard"
            value={search.productName}
            onChange={handleChange('productName')}
            onKeyUp={handleKeyUp}
            sx={{ m: 1 }}
          />
        </Stack>
        <Stack>
            <TextField
                label="상품ID"
                variant="standard"
                value={search.productId==null?'':search.productId}
                onChange={handleChange('productId')}
                onKeyUp={handleKeyUp}
                sx={{ m: 1 }}
            />
        </Stack>
        <Stack>
          <FormControl sx={{ m: 1, width: '25ch' }}
variant="standard">
            <InputLabel htmlFor="standard-adornment-brand">브랜드</InputLabel>
            <Input
              type='text'
              value={search.brandName}
              readOnly={true}
              sx={{ m: 1 }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{p: 0}}
                    onClick={handleClickClearBrand}
                  >
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    sx={{p: 0}}
                    onClick={handleClickBrandOpen}
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
justifyContent={"flex-end"}
sx={{mb: 1}}>
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
      <Divider />
      <Stack direction="row"
justifyContent={"flex-start"}
sx={{mb: 1, mt: 1}}>
        <Stack direction="row">
          <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
            <FormLabel component="legend">작업자</FormLabel>
          </Stack>
          <Stack direction="row">
            <Select
              size={"small"}
              value={reassign.workerId}
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
              size={"small"}
              value={reassign.priorityType}
              onChange={e=> {changePriorityType(e.target.value)}}
            >
              <MenuItem value={''}>-</MenuItem>
              <MenuItem value={'NORMAL'}>일반</MenuItem>
              <MenuItem value={'URGENCY'}>긴급</MenuItem>
            </Select>
          </Stack>
        </Stack>
        <Stack direction="row">
          <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1.5}}>
            <FormLabel component="legend">배정일</FormLabel>
          </Stack>
          <Stack direction="row">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                inputFormat={"yyyy-MM-dd"}
                mask={"____-__-__"}
                value={reassign.workStartDay}
                onChange={handleChangeAssignDate}
                renderInput={(params) => <TextField {...params}
variant="standard"
sx={{width: 150}} />}
               />
            </LocalizationProvider>
          </Stack>
        </Stack>
        <Stack direction="row">
          <Stack direction="row"
                 sx={{mr: 1, ml: 1.5}}>
            <FormControlLabel
                value={reassign.isAi}
                control={<Checkbox
                    onChange={e => {
                      handleChangeAi(e.target.defaultValue, e.target.checked)
                    }}
                    checked={reassign.isAi}
                />}
                label="AI처리"/>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row"
justifyContent={"flex-start"}
sx={{mb: 1}}>
        <Stack direction="row">
          <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
            <FormLabel component="legend">총 선택: {selectedLists.length} 건</FormLabel>
          </Stack>
          <Stack direction="row">
            <Button size='small'
variant="outlined"
sx={{mr: 0.5, p: 0.3, fontSize: 12}}
onClick={handleAssignSave}>
              재배정
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <ProductFitReassginList
        lists={lists}
        count={count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPage={size}
        page={page}
        selectedLists={selectedLists}
        selectAllLists={handleSelectAllLists}
        selectOneList={handleSelectOneList}
      />
      <CategoryDialog
        keepMounted
        open={open}
        onClose={handleClose}
        category={dataContext.CATEGORY}
        value={search.categoryId}
      />
      <BrandDialog
        keepMounted
        open={brandOpen}
        onClose={handleBrandClose}
        items={dataContext.BRAND}
        value={search.brandId}
      />
    </Box>
  )
}

export default ProductFitReassign;
