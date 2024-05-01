import {Box, Button, FormLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {HairStyleList} from "../../components/avatar-custom-components/hair-style-list";
import {avatarApi} from "../../api/avatar-api";
import {AvatarHair} from "../../types/avatar-custom";
import SearchIcon from "@mui/icons-material/Search";

interface Search {
    id: number
    activated: boolean
    avatarHairColors: any[]
    hairLengthType: string
    hairType: string
    hasBangs: boolean
    listOrder: number
    mainImageUrl: string
    startDate: string
    endDate: string
    creactdDate: string
    lastModifiedDate: string
}

const AvatarBoard = (props) => {
    const {hairs, setHairs, categoryId, changeSelectedList, lookbookImage, onClickApply } = props;

    const [lists, setLists] = useState<AvatarHair[]>([]);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState<Search>({
        id: null,
        activated: true,
        avatarHairColors: [],
        hairLengthType: "",
        hairType: "",
        hasBangs: null,
        listOrder: null,
        mainImageUrl: "",
        startDate: "",
        endDate: "",
        creactdDate: "",
        lastModifiedDate: ""
    });
    const [requestList, setRequestList] = useState<boolean>(false);

    const handleChangeDate =
        (prop: keyof Search) => (value) => {
            setSearch({ ...search, [prop]: value });
        };

    useEffect(() => {
        getLists();
    },[])

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
                ...search
            }
            const result = await avatarApi.getAvatarHairs(query);
            setLists(result.lists);
            setCount(result.count);
            console.log(result.lists)
        } catch (err) {
            console.error(err);
        }
    };

    const getHairLength = () => {
        return (search.hairLengthType) ? search.hairLengthType : '';
    }

    const changeHairLengthHandler = (value): void => {
        setSearch(prevData => ({
            ...prevData,
            hairLengthType: value
        }));
    }

    const handleClickReset = () => {
        setSearch({
            id: null,
            activated: true,
            avatarHairColors: [],
            hairLengthType: "",
            hairType: "",
            hasBangs: null,
            listOrder: null,
            mainImageUrl: "",
            startDate: "",
            endDate: "",
            creactdDate: "",
            lastModifiedDate: ""
        });
    };

    const getHairType = () => {
        return (search.hairType) ? search.hairType : '';
    }

    const changeHairTypeHandler = (value): void => {
        setSearch(prevData => ({
            ...prevData,
            hairType: value
        }));
    }

    const getBangType = () => {
        return (search.hasBangs != null) ? search.hasBangs : '';
    }

    const changeBangTypeHandler = (value): void => {
        if(value == 'true') {
            setSearch(prevData => ({
                ...prevData,
                hasBangs: true
            }));
        } else if(value == 'false') {
            setSearch(prevData => ({
                ...prevData,
                hasBangs: false
            }));
        }
    }

    return (
        <Box sx={{p: 1}}>
            <Stack direction="row">
                <Stack justifyContent={"center"}
sx={{mr: 1, ml: 1}}>
                    <FormLabel component="legend">등록일</FormLabel>
                </Stack>
                <Stack>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={search.startDate}
                            inputFormat={"yyyy-MM-dd"}
                            mask={"____-__-__"}
                            onChange={handleChangeDate('startDate')}
                            renderInput={(params) => <TextField {...params}
variant="standard" />}
                        />
                    </LocalizationProvider>
                </Stack>
                <Stack sx={{mr: 1, ml: 1}}>
                    ~
                </Stack>
                <Stack>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={search.endDate}
                            inputFormat={"yyyy-MM-dd"}
                            mask={"____-__-__"}
                            onChange={handleChangeDate('endDate')}
                            renderInput={(params) => <TextField {...params}
variant="standard" />}
                        />
                    </LocalizationProvider>
                </Stack>
            </Stack>
            <Stack direction="row"
sx={{mt: 2}}>
                <Stack direction="row">
                    <Stack justifyContent={"center"}
                           sx={{mr: 1, ml: 1}}>
                        <FormLabel component="legend">기장</FormLabel>
                    </Stack>
                    <Select
                        size={"small"}
                        value={getHairLength()}
                        onChange={e=> {changeHairLengthHandler(e.target.value)}}
                    >
                        <MenuItem value={''}>전체</MenuItem>
                        <MenuItem value={'LONG'}>LONG</MenuItem>
                        <MenuItem value={'MIDDLE'}>MIDDLE</MenuItem>
                        <MenuItem value={'SHORT'}>SHORT</MenuItem>
                    </Select>
                </Stack>
                <Stack direction="row">
                    <Stack justifyContent={"center"}
    sx={{mr: 1, ml: 1}}>
                        <FormLabel component="legend">앞머리 여부</FormLabel>
                    </Stack>
                    <Select
                        size={"small"}
                        value={getBangType()}
                        onChange={e=> {changeBangTypeHandler(e.target.value)}}
                    >
                        <MenuItem value={''}>전체</MenuItem>
                        <MenuItem value={'true'}>앞머리 있음</MenuItem>
                        <MenuItem value={'false'}>앞머리 없음</MenuItem>
                    </Select>
                </Stack>
                <Stack direction="row">
                    <Stack justifyContent={"center"}
    sx={{mr: 1, ml: 1}}>
                        <FormLabel component="legend">머리 상태</FormLabel>
                    </Stack>
                    <Select
                        size={"small"}
                        value={getHairType()}
                        onChange={e=> {changeHairTypeHandler(e.target.value)}}
                    >
                        <MenuItem value={''}>전체</MenuItem>
                        <MenuItem value={'STRAIGHT'}>생머리</MenuItem>
                        <MenuItem value={'WAVE'}>웨이브</MenuItem>
                    </Select>
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
                        startIcon={<SearchIcon />}
onClick={async () => {await getLists();}}>
                    검색
                </Button>
            </Stack>
            <Box sx={{display: 'flex', direction: 'row'}}>
                <Box sx={{flexGrow: 1}}>
                    <HairStyleList
                        lists={lists}
                        count={count}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default AvatarBoard;