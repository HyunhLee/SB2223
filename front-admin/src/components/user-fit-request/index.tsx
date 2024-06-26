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
import {UserFitRequestList} from "./user-fit-request-list";
import {jennieFitWorkerApi} from "../../api/jennie-fit-worker-api";
import {JennieFitWorkerModel} from "../../types/jennie-fit-worker-model";
import _ from "lodash";
import toast from "react-hot-toast";
import moment from "moment";
import {userDressApi} from "../../api/user-dress-api";
import {UserDressAssignmentModel} from "../../types/user-dress-model";
import {jennieFitUserAssignmentApi} from "../../api/jennie-fit-user-assignment-api";

interface Search {
  categoryId: number;
  categoryName: string;
  id: string;
  registrationType: string;
  startDate: Date;
  endDate: Date;
}

const defaultAssign = () => {
  return {
    priorityType: '',
    userDressIdList: [],
    status: 'ASSIGNED',
    workStartDay: null,
    workerId: '',
    workerName: '',
    maskless: false,
    isAi: false,
  }
}

const defaultSearch = () => {
  return {
    categoryId: null,
    categoryName: '',
    id: '',
    startDate: null,
    endDate: null,
    registrationType: ''
  }
}

const UserFitRequest = () => {
  const dataContext = useContext(DataContext);

  const [lists, setLists] = useState<UserDressAssignmentModel[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(0);
  const [assign, setAssign] = useState(defaultAssign());

  const [workerlists, setWorkerLists] = useState<JennieFitWorkerModel[]>([]);

  const [selectedLists, setSelectedLists] = useState<UserDressAssignmentModel[]>([]);
  const [search, setSearch] = useState<Search>(defaultSearch());

  const [open, setOpen] = React.useState(false);
  const [requestList, setRequestList] = useState<boolean>(false);

  const handleChange =
    (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
      setSearch({...search, [prop]: event.target.value});
    };

  const handleChangeDate =
    (prop: keyof Search) => (value) => {
      setSearch({...search, [prop]: value});
    };

  const handleClickClear = (prop: keyof Search) => {
    setSearch({...search, [prop]: ''});
  };

  const handleClickReset = () => {
    setSearch(defaultSearch());
  };

  useEffect(
    () => {
      (async () => {
        await getWorkerLists();
      })()
    },
    []
  );

  useEffect(
    () => {
      (async () => {
        if (requestList) {
          await getLists();
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
      const result = await userDressApi.getUserDressAssignments(query);
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
    item: UserDressAssignmentModel
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

  const changeWorker = (event, item) => {
    setAssign(prevData => ({
      ...prevData,
      workerId: item.props.value,
      workerName: item.props['data-name'],
    }))
  }

  const changePriorityType = (value) => {
    setAssign(prevData => ({
      ...prevData,
      priorityType: value
    }))
  }

  const handleChangeAssignDate = (value) => {
    setAssign(prevData => ({
      ...prevData,
      workStartDay: value
    }))
  }

  const handleChangeMaskless = (value: string, checked: boolean): void => {
    if(!assign.isAi) {
      setAssign(prevData => ({
        ...prevData,
        maskless: checked
      }))
    } else {
      toast.error('AI처리와 함께 체크 될 수 없습니다.')
    }
  }

  const handleChangeAi = (value: string, checked: boolean): void => {
    if(!assign.maskless) {
      setAssign(prevData => ({
        ...prevData,
        isAi: checked
      }))
    } else {
      toast.error('마스크 작업 불필요와 함께 체크 될 수 없습니다.')
    }
  }

  const handleAssignSave = async () => {
    const saveData = {...assign};
    console.log('handleAssign', assign);
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
    saveData.userDressIdList = [];
    selectedLists.forEach(userDress => {
      saveData.userDressIdList.push(userDress.id)
    })
    saveData.workStartDay = moment(saveData.workStartDay).format('YYYY-MM-DD');

    const statusCode = await jennieFitUserAssignmentApi.postJennieFitAssignment(saveData);
    if (statusCode === 201) {
      setAssign(defaultAssign());
      setSelectedLists([]);
      setRequestList(true);
      toast.success('배정되었습니다.');
    }
  }

  const renderWorkers = () => {
    return workerlists.map(item => {
      return (<MenuItem key={item.workerId}
value={item.workerId}
                        data-name={item.workerName}>{item.workerName}</MenuItem>)
    })
  }

  const renderPriority = () => {
    return Object.keys(dataContext.ASSIGN_PRIORITY).map(key => {
      return (<MenuItem key={key}
value={key}>{dataContext.ASSIGN_PRIORITY[key]}</MenuItem>)
    });
  }

  const renderRegistrationType = () => {
    return Object.keys(dataContext.REGISTRATION_TYPE).map(key => {
      return (<MenuItem key={key}
value={key}>{dataContext.REGISTRATION_TYPE[key]}</MenuItem>)
    });
  }

  const handleClickSearch = async () => {
    setPage(0);
    setRequestList(true);
  }

  return (
    <Box sx={{p: 1}}>
      <Stack direction="row">
        <Stack>
          <FormControl sx={{m: 1, width: '30ch'}}
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
                    onClick={() => {
                      handleClickClear('categoryId');
                      handleClickClear('categoryName')
                    }}
                  >
                    <ClearIcon/>
                  </IconButton>
                  <IconButton
                    sx={{p: 0}}
                    onClick={handleClickOpen}
                  >
                    <SearchIcon/>
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
            sx={{m: 1}}
          />
        </Stack>
      </Stack>
      <Stack direction="row">
        <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
          <FormLabel component="legend">등록일</FormLabel>
        </Stack>
        <Stack>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              inputFormat={"yyyy-MM-dd"}
              mask={"____-__-__"}
              value={search.startDate}
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
              inputFormat={"yyyy-MM-dd"}
              mask={"____-__-__"}
              value={search.endDate}
              onChange={handleChangeDate('endDate')}
              renderInput={(params) => <TextField {...params}
variant="standard"
sx={{width: 150}}/>}
            />
          </LocalizationProvider>
        </Stack>
        <Stack direction="row"
sx={{mr: 1, ml: 1.5}}>
          <Stack justifyContent={"center"}>
            <FormLabel component="legend">등록자</FormLabel>
          </Stack>
          <Stack>
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
              value={assign.workerId}
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
              value={assign.priorityType}
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
                value={assign.workStartDay}
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
              value={assign.maskless}
              control={<Checkbox
                onChange={e => {
                  handleChangeMaskless(e.target.defaultValue, e.target.checked)
                }}
                checked={assign.maskless}
              />}
label="마스크 작업 불필요"/>
          </Stack>
        </Stack>
        <Stack direction="row">
          <Stack direction="row"
                 sx={{mr: 1, ml: 1.5}}>
            <FormControlLabel
                value={assign.isAi}
                control={<Checkbox
                    onChange={e => {
                      handleChangeAi(e.target.defaultValue, e.target.checked)
                    }}
                    checked={assign.isAi}
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
              배정
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <UserFitRequestList
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

export default UserFitRequest;