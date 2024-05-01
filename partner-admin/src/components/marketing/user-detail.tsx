import {Box, Button, FormLabel, Stack, TextField} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import React, {ChangeEvent, MouseEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {marketingApi} from "../../api/marketing-api";
import {toast} from "react-hot-toast";
import {defaultSearchUser, SearchUser, UserModel} from "../../types/marketing-user-model";
import {UserDetailList} from "./user-detail-list";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import SearchIcon from "@mui/icons-material/Search";

const UserDetail = (props) => {
    const {open, startDate, endDate} = props;

    const {t} = useTranslation();
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
        if (open) {
            setSearch({
                ...search,
                mallId: Number(localStorage.getItem('mallId')),
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
        await marketingApi.getUserInfo(search).then(res => {
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
                mallId: Number(localStorage.getItem('mallId')),
                userId: '',
                startDate: null,
                endDate: null,
                page: 0,
                size: 10
            })
    }

    const handleClickSearch = () => {
        if (!localStorage.getItem('mallId')) {
            toast.error(`${t("pages_marketingDashboard_marketingDashboard_search_error")}`)
            return;
        }
        if(!search.startDate || !search.endDate ){
            window.confirm(`${t("components_marketing_totalPurchaseInCartDetail_getAmountData_date")}`);
            return;
        }else {
            setSearch({...search});
            setRequestList(true);
            handlePageChange(null, 0)
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
                <Stack  direction="row" justifyContent={"center"}
                        sx={{mr: 1, ml: 1, mt:2, height: 20}}>
                    <FormLabel component="legend">{t("label_date")}*</FormLabel>
                    <CustomWidthTooltip title={helpText} sx={{whiteSpace: 'pre-wrap', mt:0.5}} placement="bottom" arrow>
                        <IconButton>
                            <HelpIcon color="primary" fontSize="small"/>
                        </IconButton>
                    </CustomWidthTooltip>
                </Stack>
                <Stack justifyContent={"center"}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
                            minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                            value={search.startDate }
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
                            value={search.endDate }
                            inputFormat={"yyyy-MM-dd"}
                            mask={"____-__-__"}
                            onChange={handleChangeDate('endDate')}
                            renderInput={(params) => <TextField {...params}
                                                                variant="standard"
                                                                sx={{width: 150}}/>}
                        />
                    </LocalizationProvider>
                </Stack>
                <Stack justifyContent={"center"}>
                    <TextField
                        label={`${t('label_userId')}`}
                        variant="standard"
                        value={search.userId ? search.userId : ''}
                        onChange={handleChange('userId')}
                        sx={{m: 1, ml: 4, mt: -1}}
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
                    {t("button_clickClear")}
                </Button>
                <Button size='small'
                        color="primary"
                        variant="contained"
                        startIcon={<SearchIcon/>}
                        onClick={handleClickSearch}>
                    {t("button_clickSearch")}
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