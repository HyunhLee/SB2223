import {
  Box,
  Button,
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
  TextField,
  Typography
} from "@mui/material";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import {StyleUserDressList} from "./style-user-dress-list";
import {styled} from "@mui/material/styles";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {CategoryDialog, ColorDialog, PatternDialog} from "../dialog/category-dialog";
import {getDataContextValue} from "../../utils/data-convert";
import {DataContext} from "../../contexts/data-context";
import {userDressApi} from "../../api/user-dress-api";
import {UserDressModel} from "../../types/user-dress-model";

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

interface Search {
  id: string;
  userId: string;
  categoryId: number;
  categoryName: string;
  colorType: string;
  patternType: string;
  registrationType: string;
  startDate?: Date;
  endDate?: Date;
  inspectionStatus: string;
}

const StyleUserDress = (props) => {
  const { changeSelectedList, lookbookImage, onClickApply } = props;

  const dataContext = useContext(DataContext);

  const [lists, setLists] = useState<UserDressModel[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(0);

  const [selectedLists, setSelectedLists] = useState<UserDressModel[]>([]);
  const [search, setSearch] = useState<Search>({
    id: '',
    userId: '',
    categoryId: null,
    categoryName: '',
    colorType: '',
    patternType: '',
    registrationType: '',
    startDate: null,
    endDate: null,
    inspectionStatus: 'COMPLETED',
  });
  const [expanded, setExpanded] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [patternOpen, setPatternOpen] = React.useState(false);
  const [colorOpen, setColorOpen] = React.useState(false);
  const [requestList, setRequestList] = useState<boolean>(true);

  const handleChange =
      (prop: keyof Search) => (event: ChangeEvent<HTMLInputElement>) => {
        setSearch({ ...search, [prop]: event.target.value });
      };

  const handleChangeDate =
      (prop: keyof Search) => (value) => {
        setSearch({ ...search, [prop]: value });
      };

  const handleClickClear = (prop: keyof Search) => {
    setSearch({ ...search, [prop]: '' });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
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

  const getLists = async () => {
    try {
      const query = {
        size, page, ...search
      }
      const result = await userDressApi.getUserDresses(query);
      setLists(result.lists);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setSearch({
      id: '',
      userId: '',
      categoryId: null,
      categoryName: '',
      colorType: '',
      patternType: '',
      registrationType: '',
      startDate: null,
      endDate: null,
      inspectionStatus: 'COMPLETED',
    })
  }

  useEffect(() => {
    changeSelectedList(selectedLists)
  }, [selectedLists]);

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
      item: UserDressModel
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

  const handleClickPatternOpen = () => {
    setPatternOpen(true);
  };

  const handlePatternClose = (value) => {
    if (value) {
      setSearch({
        ...search,
        patternType: value.name,
      });
    }
    setPatternOpen(false);
  };

  const handleClickColorOpen = () => {
    setColorOpen(true);
  };

  const handleColorClose = (value) => {
    if (value) {
      setSearch({
        ...search,
        colorType: value.name,
      });
    }
    setColorOpen(false);
  };

  const changeRegistrationTypeHandler = (value): void => {
    setSearch(prevData => ({
      ...prevData,
      registrationType: value
    }))
  }

  const renderRegistrationType = () => {
    return Object.keys(dataContext.USER_DRESS_REGISTRATION_TYPE).map(key => {
      return (<MenuItem key={key}
value={key}>{dataContext.USER_DRESS_REGISTRATION_TYPE[key]}</MenuItem>)
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
                          onClick={() => {
                            handleClickClear('categoryId');
                            handleClickClear('categoryName')
                          }}
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
            <FormControl sx={{ m: 1, width: '25ch' }}
variant="standard">
              <InputLabel htmlFor="standard-adornment-password">컬러</InputLabel>
              <Input
                  id="standard-adornment-password"
                  type='text'
                  value={search.colorType}
                  readOnly={true}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                          sx={{p: 0}}
                          onClick={() => handleClickClear('colorType')}
                      >
                        <ClearIcon />
                      </IconButton>
                      <IconButton
                          sx={{p: 0}}
                          onClick={handleClickColorOpen}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
              />
            </FormControl>
          </Stack>
          <Stack>
            <FormControl sx={{ m: 1, width: '25ch' }}
variant="standard">
              <InputLabel htmlFor="standard-adornment-password">패턴</InputLabel>
              <Input
                  id="standard-adornment-password"
                  type='text'
                  value={search.patternType}
                  readOnly={true}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                          sx={{p: 0}}
                          onClick={() => handleClickClear('patternType')}
                      >
                        <ClearIcon />
                      </IconButton>
                      <IconButton
                          sx={{p: 0}}
                          onClick={handleClickPatternOpen}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
              />
            </FormControl>
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
          <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
            ~
          </Stack>
          <Stack justifyContent={"center"}>
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
          <Stack justifyContent={"center"}>
            <TextField
                label="ID"
                variant="standard"
                value={search.id}
                onChange={handleChange('id')}
                sx={{ m: 1 }}
            />
          </Stack>
          <Stack justifyContent={"center"}>
            <TextField
                label="유저ID"
                variant="standard"
                value={search.userId}
                onChange={handleChange('userId')}
                sx={{ m: 1 }}
            />
          </Stack>
        </Stack>
        <Stack direction="row"
justifyContent={"flex-end"}
sx={{mb: 1}}>
          <Button size='small'
variant="outlined"
sx={{mr: 1}}
          onClick={handleReset}>
            초기화
          </Button>
          <Button size='small'
variant="contained"
                  startIcon={<SearchIcon />}
onClick={handleClickSearch}>
            검색
          </Button>
        </Stack>
        <Box sx={{display: 'flex', direction: 'row'}}>
          {
            lookbookImage != null ?
                <Box sx={{p: 0.5}}><Typography variant="h6">Lookbook</Typography><img
                    src={lookbookImage}
                    style={{objectFit: 'contain'}}
                    width={'100%'}
                    height={500}
                    loading="lazy"
                /></Box> : <></>
          }
          <Box sx={{flexGrow: 1}}>
            <StyleUserDressList
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
          </Box>
        </Box>

        <CategoryDialog
            keepMounted
            open={open}
            onClose={handleClose}
            category={dataContext.CATEGORY}
            value={search.categoryId}
        />
        <PatternDialog
            keepMounted
            open={patternOpen}
            onClose={handlePatternClose}
            items={dataContext.PATTERN}
            value={search.patternType}
        />
        <ColorDialog
            keepMounted
            open={colorOpen}
            onClose={handleColorClose}
            items={dataContext.COLOR}
            value={search.colorType}
        />
      </Box>
  )
}

export default StyleUserDress;