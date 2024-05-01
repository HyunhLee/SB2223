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
import {DataContext} from "../../contexts/data-context";
import {jennieFitWorkerApi} from "../../api/jennie-fit-worker-api";
import {JennieFitWorkerModel} from "../../types/jennie-fit-worker-model";
import _ from "lodash";
import toast from "react-hot-toast";
import moment from "moment";
import {jennieFitUserAssignmentApi} from "../../api/jennie-fit-user-assignment-api";
import {JennieFitAssignmentModel} from "../../types/jennie-fit-assignment-model";
import {UserFitReassignList} from "./user-fit-reassign-list";
import {getDataContextValue} from "../../utils/data-convert";

interface Search {
  categoryConcat: string;
  categoryId: number;
  categoryName: string;
  id: string;
  userDressCreatedStartDate: Date;
  userDressCreatedEndDate: Date;
  workerId: number;
  priorityType: string;
  statusIn: string[];
  registrationType: string;
  userDressId:number;
  isAi: boolean;
  maskless: boolean;
  extraOption: string;
}

const defaultReassign = () => {
  return {
    priorityType: '',
    workStartDay: null,
    workerId: '',
    workerName: '',
    userDressIdList: [],
    maskless: false,
    isAi: false
  }
}

const defaultSearch = () => {
  return {
    categoryConcat: '',
    id: '',
    userDressCreatedStartDate: null,
    userDressCreatedEndDate: null,
    statusIn: ['REQUESTED', 'ASSIGNED', 'REJECTED'],
    workerId: null,
    priorityType: '',
    registrationType: '',
    userDressId:null,
    isAi: null,
    maskless: null,
    categoryId: null,
    categoryName: '',
    extraOption: ''
  }
}

const UserFitReassign = () => {
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
  const [requestList, setRequestList] = useState<boolean>(false);

  const handleChange =
      (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({...search, [prop]: event.target.value});
      };

  const handleChangeExtraOption = () => (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.value == 'maskX') {
      setSearch({...search, maskless: true, extraOption: event.target.value});
    } else if(event.target.value == 'ai') {
      setSearch({...search, isAi: true, extraOption: event.target.value});
    } else {
      setSearch({...search, maskless: null, isAi: null, extraOption: ''});
    }
  };

  const handleChangeDate =
      (prop: keyof Search) => (value) => {
        setSearch({...search, [prop]: value});
      };

  const handleClickReset = () => {
    setSearch(defaultSearch());
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
      const result = await jennieFitUserAssignmentApi.getJennieFitAssignmentsWithUserDress(query);
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
        workType: 'FIT_USER'
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

  const changeWorker = (event, item) => {
    setReassign(prevData => ({
      ...prevData,
      workerId: item.props.value,
      workerName: item.props['data-name'],
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

  const handleStatusChange = (event: SelectChangeEvent<typeof search.statusIn>) => {
    const {
      target: {value},
    } = event;
    setSearch({...search, statusIn: typeof value === 'string' ? value.split(',') : value});
  };

  const changeRegistrationTypeHandler = (value): void => {
    setSearch(prevData => ({
      ...prevData,
      registrationType: value
    }))
  }

  const handleReassignSave = async () => {
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
    saveData.userDressIdList = [];
    selectedLists.forEach(item => {
      saveData.userDressIdList.push(item.userDressId)
    })
    saveData.workStartDay = moment(saveData.workStartDay).format('YYYY-MM-DD');

    const statusCode = await jennieFitUserAssignmentApi.postJennieFitReassign(saveData);
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
                        data-name={item.workerName}>{item.workerName}</MenuItem>)
    })
  }

  const renderRegistrationType = () => {
    return Object.keys(dataContext.USER_DRESS_REGISTRATION_TYPE).map(key => {
      return (<MenuItem key={key}
                        value={key}>{dataContext.USER_DRESS_REGISTRATION_TYPE[key]}</MenuItem>)
    });
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

  const handleChangeAi = (value: string, checked: boolean): void => {
    if(!reassign.maskless) {
      setReassign(prevData => ({
        ...prevData,
        isAi: checked
      }))
    } else {
      toast.error('마스크 작업 불필요와 함께 체크 될 수 없습니다.')
    }
  }

  const handleChangeMaskless = (value: string, checked: boolean): void => {
    if(!reassign.isAi) {
      setReassign(prevData => ({
        ...prevData,
        maskless: checked
      }))
    } else {
      toast.error('AI처리와 함께 체크 될 수 없습니다.')
    }
  }

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

  const handleClickClearCategory = () => {
    setSearch({ ...search,
      categoryId: null,
      categoryName: ''
    });
  };

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
                  id="standard-adornment-password"
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
              <FormLabel component="legend">작업유형</FormLabel>
            </Stack>
            <Stack justifyContent={"center"}>
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
            <Stack justifyContent={"center"}>
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
          <Stack direction="row"
                 sx={{mr: 1, ml: 1.5}}>
            <Stack justifyContent={"center"}>
              <FormLabel component="legend">추가옵션</FormLabel>
            </Stack>
            <Stack justifyContent={"center"}>
              <Select
                  size={"small"}
                  value={search.extraOption}
                  onChange={handleChangeExtraOption()}
              >
                <MenuItem value={''}>-</MenuItem>
                <MenuItem value={'maskX'}>MASK X</MenuItem>
                <MenuItem value={'ai'}>AI 처리</MenuItem>
              </Select>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="row">
          <Stack justifyContent={"center"}
                 sx={{mr: 1, ml: 1}}>
            <FormLabel component="legend">등록일</FormLabel>
          </Stack>
          <Stack justifyContent={"center"}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  inputFormat={"yyyy-MM-dd"}
                  mask={"____-__-__"}
                  value={search.userDressCreatedStartDate}
                  onChange={handleChangeDate('userDressCreatedStartDate')}
                  renderInput={(params) => <TextField {...params}
                                                      variant="standard"
                                                      sx={{width: 150}}/>}
              />
            </LocalizationProvider>
          </Stack>
          <Stack justifyContent={"center"}
                 sx={{mr: 1, ml: 1}}>
            ~
          </Stack>
          <Stack justifyContent={"center"}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  inputFormat={"yyyy-MM-dd"}
                  mask={"____-__-__"}
                  value={search.userDressCreatedEndDate}
                  onChange={handleChangeDate('userDressCreatedEndDate')}
                  renderInput={(params) => <TextField {...params}
                                                      variant="standard"
                                                      sx={{width: 150}}/>}
              />
            </LocalizationProvider>
          </Stack>
          <Stack justifyContent={"center"}
                 sx={{mr: 1, ml: 1}}>
            <FormLabel component="legend">등록자</FormLabel>
          </Stack>
          <Stack justifyContent={"center"}>
            <Select
                value={search.registrationType}
                size={"small"}
                onChange={e=> {changeRegistrationTypeHandler(e.target.value)}}
            >
              <MenuItem value={''}>-</MenuItem>
              {renderRegistrationType()}
            </Select>
          </Stack>
          <Stack>
            <TextField
                label="ID"
                variant="standard"
                value={search.userDressId}
                onChange={handleChange('userDressId')}
                sx={{m: 1}}
            />
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
              <FormLabel component="legend">작업유형</FormLabel>
            </Stack>
            <Stack direction="row">
              <Select
                  size={"small"}
                  value={reassign.priorityType}
                  onChange={e => {
                    changePriorityType(e.target.value)
                  }}
              >
                <MenuItem value={''}>-</MenuItem>
                {renderPriority()}
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
                                                        sx={{width: 150}}/>}
                />
              </LocalizationProvider>
            </Stack>
          </Stack>
          <Stack direction="row">
            <Stack direction="row"
                   sx={{mr: 1, ml: 1.5}}>
              <FormControlLabel
                  value={reassign.maskless}
                  control={<Checkbox
                      onChange={e => {
                        handleChangeMaskless(e.target.defaultValue, e.target.checked)
                      }}
                      checked={reassign.maskless}
                  />}
                  label="마스크 작업 불필요"/>
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
                      onClick={handleReassignSave}>
                재배정
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <UserFitReassignList
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
      </Box>
  )
}

export default UserFitReassign;
