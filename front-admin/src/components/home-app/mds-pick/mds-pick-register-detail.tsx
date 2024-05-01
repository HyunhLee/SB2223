import {Box, Grid, Stack, TextField} from "@mui/material";
import {PropertyListItem} from "../../property-list-item";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import FittingRoom from "./fitting-room";
import React, {useEffect, useState} from "react";
import {mdsPick, mdsPickModel} from "../../../types/home-app-model/mds-pick";


const MdsPickRegisterDetail = (props) => {
    const { data, setData, mergeImage } = props;


    let firstStyle = data?.mdPickStyles[0];
    let secondStyle = data?.mdPickStyles[1];
    let thirdStyle = data?.mdPickStyles[2];

    //three avatar
    const [avatarOne, setAvatarOne] = useState<mdsPick>(firstStyle.id != null ? firstStyle : '')
    const [avatarTwo, setAvatarTwo] = useState<mdsPick>(secondStyle.id != null ? secondStyle: '')
    const [avatarThree, setAvatarThree] = useState<mdsPick>(thirdStyle.id != null ? thirdStyle : '')

    const handleOnChange = (prop: keyof mdsPickModel) => (value) => {
        if (prop == 'startDate') {
            setData({ ...data, startDate: value});
        }else if (prop == 'expireDate') {
            setData({ ...data, expireDate: value});
        }
    };

    //수정시 아바타에 입힐 데이터들 넣어주기, 여기에 listorder 조건 넣으면 하나만 출력됨
    useEffect(() =>{
        if(firstStyle.id != null){
            setAvatarOne(firstStyle)
        }

    },[firstStyle])

    useEffect(() =>{
        if(secondStyle.id != null){
            setAvatarTwo(secondStyle)
        }

    },[secondStyle])

    useEffect(() =>{
        if(thirdStyle.id != null){
            setAvatarThree(thirdStyle)
        }

    },[thirdStyle])



    //수정 트리거 하나 있어야할듯
    useEffect(() => {
        setData({...data, mdPickStyles : [avatarOne, avatarTwo, avatarThree]})
    },[avatarOne, avatarTwo, avatarThree])


    return (
        <>
            <Box sx={{px: 22}}>
                <Stack direction="column">
                    <Stack direction="row">
                        <PropertyListItem
                          label="TITLE"
                          sx={{mt: 0, ml: -2 , width: '130px'}}
                        />
                        <TextField
                          id='title'
                          value={data?.titleKo || ''}
                          onChange={ (e) => setData({...data, titleKo: e.target.value})}
                          sx={{width: '600px', mr: 4}}
                        />
                        <PropertyListItem
                          label="영문 TITLE"
                          sx={{mt: 0, ml: -2 , width: '130px'}}
                        />
                        <TextField
                          id='title'
                          value={data?.titleEn || ''}
                          onChange={ (e) => setData({...data, titleEn: e.target.value})}
                          sx={{width: '600px'}}
                        />
                    </Stack>
                </Stack>
                <Stack direction="column"
                       sx={{ mb: 1}}>
                    <PropertyListItem
                        label="게시 기간 및 시간"
                        sx={{mt: 2, ml: -2 }}
                    />
                    <Stack sx={{mt: 0 }}
                           direction="row">
                        <Stack sx={{mb: 2.5}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={data?.startDate  || ''}
                                    inputFormat={"yyyy-MM-dd HH:mm"}
                                    mask={"____-__-__ __:__"}
                                    onChange={handleOnChange('startDate')}
                                    minDate={new Date()}
                                    renderInput={(params) => <TextField {...params}
                                                                        size={'small'}
                                                                        sx={{height: 40, width: 200}}/>}
                                />
                            </LocalizationProvider>
                        </Stack>
                        <Stack sx={{mr: 2, ml: 2, mt:0.5}}>
                            ~
                        </Stack>
                        <Stack sx={{mb: 2.5}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={data?.expireDate || ''}
                                    inputFormat={"yyyy-MM-dd HH:mm"}
                                    mask={"____-__-__ __:__"}
                                    onChange={handleOnChange('expireDate')}
                                    minDate={new Date()}
                                    renderInput={(params) => <TextField {...params}
                                                                        size={'small'}
                                                                        sx={{height: 40, width: 200}}/>}
                                />
                            </LocalizationProvider>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
            <Grid container
                  sx={{display: 'flex', justifyContent:'center', alignItems: 'center'}}>
                <FittingRoom item={avatarOne}
                             setItems={setAvatarOne}
avatarType={'one'}
mergeImage={mergeImage}
data={data}/>
                <FittingRoom item={avatarTwo}
                             setItems={setAvatarTwo}
avatarType={'two'}
mergeImage={mergeImage}
data={data}/>
                <FittingRoom item={avatarThree}
                             setItems={setAvatarThree}
avatarType={'three'}
mergeImage={mergeImage}
data={data}/>
            </Grid>
        </>
    )
}

export default MdsPickRegisterDetail;