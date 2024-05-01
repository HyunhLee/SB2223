import {Box, Button, FormLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import React, {ChangeEvent, MouseEvent, useContext, useEffect, useState} from "react";
import {marketingApi} from "../../api/marketing-api";
import {toast} from "react-hot-toast";
import {defaultSearchUser, SearchUser, UserModel} from "../../types/marketing-model/marketing-user-model";
import {UserDetailList} from "./user-detail-list";
import _ from "lodash";
import {DataContext} from "../../contexts/data-context";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import SearchIcon from "@mui/icons-material/Search";

const UserDetail = (props) => {
    const {open, startDate, endDate, mallId} = props;

    const dataContext = useContext(DataContext);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [lists, setLists] = useState<UserModel[]>([]);
    const [count, setCount] = useState<number>(0);

    const [search, setSearch] = useState<SearchUser>(defaultSearchUser);

    const [requestList, setRequestList] = useState<boolean>(false);

    const handleChange =
        (prop: keyof SearchUser) => (event: ChangeEvent<HTMLInputElement>) => {
            setSearch({...search, [prop]: event.target.value});
        };

    const handleChangeDate =
        (prop: keyof SearchUser) => (value) => {
            setSearch({...search, [prop]: value});
        };

    useEffect(() => {
        if(open && startDate != null && endDate != null && mallId != null) {
            setSearch({
                ...search,
                mallId: mallId,
                startDate: startDate,
                endDate: endDate
            })
            setRequestList(true);
        }
    }, [open])

    useEffect(() => {
        if (requestList && open) {
            getUserInfo();
        }
    }, [requestList, open])

    const getUserInfo = async () => {
        const query = {
            ...search,
            size: size,
            page: page
        }
        await marketingApi.getUserInfo(query).then(res => {
            setLists(res.lists);
            setCount(res.count);
            setRequestList(false);
            console.log(res)
        }).catch(err => {
            console.log(err);
        })
    }

    const handleReset = () => {
            setSearch({
                id: null,
                mallId: null,
                userId: '',
                startDate: null,
                endDate: null,
                page: 0,
                size: 10
            })
    }

    const handleClickSearch = () => {
        if(!search.startDate || !search.endDate){
            toast.error('기간을 입력해주세요.')
            return;
        } else if (!search.mallId) {
            toast.error('몰을 입력해주세요.')
            return;
        } else {
            setPage(0);
            setRequestList(true);
        }
    }

    const handlePageChange = async (event: MouseEvent<HTMLButtonElement> | null, newPage: number): Promise<void> => {
        setSearch({...search, page: newPage})
        setPage(newPage);
        setRequestList(true);
    };

    const handleRowsPerPageChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        setSearch({...search, size: Number(event.target.value)})
        setSize(parseInt(event.target.value, 10));
        setRequestList(true);
    };

    const helpText = `[데이터 조회 기간 제한]\n\n기간 : 최대 1년\n`;
    return (
        <Box sx={{p: 1}}>
            <Stack direction="row">
                <Stack direction="row"
justifyContent={"center"}
                       sx={{mr: 1, ml: 1, mt:2}}>
                    <FormLabel component="legend">기간*</FormLabel>
                    <CustomWidthTooltip title={helpText}
sx={{whiteSpace: 'pre-wrap', mt:0.5}}
placement="bottom"
arrow>
                        <IconButton sx={{height: 20}}>
                            <HelpIcon color="primary"
fontSize="small"/>
                        </IconButton>
                    </CustomWidthTooltip>
                </Stack>
                <Stack justifyContent={"center"}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                            value={search.startDate ? search.startDate : null}
                            inputFormat={"yyyy-MM-dd"}
                            mask={"____-__-__"}
                            onChange={handleChangeDate('startDate')}
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
                            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                            value={search.endDate ? search.endDate : null}
                            inputFormat={"yyyy-MM-dd"}
                            mask={"____-__-__"}
                            onChange={handleChangeDate('endDate')}
                            renderInput={(params) => <TextField {...params}
                                                                variant="standard"
                                                                sx={{width: 150}}/>}
                        />
                    </LocalizationProvider>
                </Stack>
                <Stack justifyContent={"center"}
                       sx={{mr: 1, ml: 2, mt: 0.5}}>
                    <FormLabel
                        component="legend">몰*</FormLabel>
                </Stack>
                <Select
                    sx={{width: 160, height: 40, mt: 0.5}}
                    size={"small"}
                    value={search.mallId ? search.mallId : ''}
                    onChange={handleChange('mallId')}
                >
                    {_.sortBy(dataContext.MALL, 'name').map((mall) => {
                        return (
                            <MenuItem key={mall.mall.id}
                                      value={mall.mall.id}>{mall.mall.name}</MenuItem>
                        )
                    })}
                </Select>
                <Stack justifyContent={"center"}>
                    <TextField
                        label={'유저ID'}
                        variant="standard"
                        value={search.userId ? search.userId : ''}
                        onChange={handleChange('userId')}
                        sx={{m: 1, ml: 4, mt: -1}}
                    />
                </Stack>
            </Stack>
            <Stack direction="row"
                   justifyContent={"flex-end"}
                   sx={{mb: 1, mt:3}}>
                <Button size='small'
                        variant="outlined"
                        sx={{mr: 1}}
                        onClick={handleReset}>
                    초기화
                </Button>
                <Button size='small'
                        color="primary"
                        variant="contained"
                        sx={{mr: 1}}
                        startIcon={<SearchIcon/>}
                        onClick={handleClickSearch}>
                    검색
                </Button>
            </Stack>
            <Box sx={{display: 'flex', direction: 'row'}}>
                <Box sx={{flexGrow: 1}}>
                    <UserDetailList
                        lists={lists}
                        count={count}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPage={size}
                        page={page}
                        search={search}
                        setSearch={setSearch}
                        setRequestList={setRequestList}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default UserDetail;