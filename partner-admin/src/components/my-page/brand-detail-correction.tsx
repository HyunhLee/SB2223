import {
    Button, Card, CardContent, Checkbox, Collapse, FormControlLabel,
    Grid, IconButton, IconButtonProps, Stack, TextField, Theme, Typography, useMediaQuery
} from "@mui/material";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import SaveIcon from "@mui/icons-material/Save";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {LocalizationProvider, TimePicker} from "@mui/lab";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {styled} from "@mui/material/styles";
import {ChangeEvent, useContext, useState} from "react";
import {BrandDetail} from "../../types/account-model";
import {DataContext} from "../../contexts/data-context";
import axiosInstance from "../../plugins/axios-instance";
import {useTranslation} from "react-i18next";


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export const BrandDetailCorrection = (props) => {
    const {info} = props;
    const dataContext = useContext(DataContext);
    const {i18n, t} = useTranslation();
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const align = mdUp ? 'horizontal' : 'vertical';
    const [expanded, setExpanded] = useState(true);

    const [data, setData] = useState<BrandDetail>(info);
    const [offDayArr, setOffDayArr] = useState(data.offDay);


    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    //empty array - 선택한 요일들만 담을 배열


    const handleChangeDayOff = (value, checked) => {
        setData({...data, off: false})
        if (checked) {
            //빈 배열에 넣어주기
            setOffDayArr([...offDayArr, value])
            //for check value

        } else {
            let arr = offDayArr.filter((v) => v !== value)
            setOffDayArr(arr)
        }
        console.log('temp!!!!!', offDayArr)
        return offDayArr;
    }

    const renderDay = () => {
        return (
            <>
                {Object.values(dataContext.DAY).map((day) => {
                    return (
                        <>
                            <FormControlLabel
                                sx={{mr: 4}}
                                value={day}
                                label={day}
                                control={<Checkbox
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDayOff(e.target.value, e.target.checked)}
                                    checked={offDayArr?.includes(day)}
                                />}
                            />
                        </>
                    )
                })}
            </>
        )
    }


    const handleChange = (prop: keyof BrandDetail) => (event: ChangeEvent<HTMLInputElement>) => {
        setData({...data, [prop]: event.target.value});
    };


    const handleSaveBrandDetail = () => {
        // await axiosInstance.putBrandInfo(data)
        // 데이터 저장이 된 이후 toast message 보내줘야함
        console.log(offDayArr)
        //setdata에 넣지 말고 바로 보내는 값에 휴무일관련 보내기
        setData({...data, offDay: offDayArr})
        console.log({...data, offDay: offDayArr})
        console.log('data!!!!!!', data)
        console.log('save info');
    }


    return (
        <>
            <Card sx={{mt: 2}}>
                <CardContent>
                    <Stack direction={'row'} sx={{mb: 3}}>
                        <Typography sx={{mt: 3}}>{t('component_myPage_brandDetailCorrection_title')}</Typography>
                        <ExpandMore expand={expanded}
                                    aria-expanded={expanded}
                                    sx={{mr: 0.5, p: 0.3, fontSize: 12}}
                                    onClick={handleExpandClick}>
                            <ExpandMoreOutlinedIcon/>
                        </ExpandMore>
                    </Stack>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Grid sx={{display: 'flex', justifyContent: 'end'}}>
                            <Button
                                component="a"
                                startIcon={<SaveIcon fontSize="small"/>}
                                variant="contained"
                                onClick={handleSaveBrandDetail}
                            >
                                {t('component_myPage_brandDetailCorrection_button_save')}
                            </Button>
                        </Grid>
                        <PropertyList>
                            <Grid sx={{display: 'flex', mt: 6}}>
                                <PropertyListItem
                                    align={align}
                                    label={t('component_myPage_brandDetailCorrection_label_supervisor')}
                                    sx={{width: 200, mt: -1}}
                                />
                                <TextField value={data.supervisor} sx={{mr: 2, width: 300}}
                                           onChange={handleChange('supervisor')}/>
                                <PropertyListItem
                                    align={align}
                                    label={t('component_myPage_brandDetailCorrection_label_supervisorNumber')}
                                    sx={{width: 200, mt: -1}}
                                />
                                <TextField value={data.supervisorNum} sx={{mr: 2, width: 300}}
                                           onChange={handleChange('supervisorNum')}/>
                            </Grid>
                            <Grid sx={{display: 'flex', mt: 2}}>
                                <PropertyListItem
                                    align={align}
                                    label={t('component_myPage_brandDetailCorrection_label_csNum')}
                                    sx={{width: 200, mt: -1.5}}
                                />
                                <TextField value={data.csNum} sx={{mr: 2, width: 300}}
                                           onChange={handleChange('csNum')}/>
                            </Grid>
                            <Grid sx={{display: 'flex', mt: 2}}>
                                <PropertyListItem
                                    align={align}
                                    label={t('component_myPage_brandDetailCorrection_label_workingTime')}
                                    sx={{width: 200, mt: -1}}
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="00:00"
                                        value={data.startTime}
                                        onChange={(newValue) => {
                                            setData({...data, startTime: newValue, breakTime: false})
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                <Stack sx={{mr: 1, ml: 1, mt: 2}}>
                                    ~
                                </Stack>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="00:00"
                                        value={data.endTime}
                                        onChange={(newValue) => {
                                            setData({...data, endTime: newValue, breakTime: false})
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid sx={{display: 'flex', mt: 2}}>
                                <PropertyListItem
                                    align={align}
                                    label={t('component_myPage_brandDetailCorrection_label_breakTime')}
                                    sx={{width: 200, mt: -1}}
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="00:00"
                                        value={data.offStartTime}
                                        onChange={(newValue) => {
                                            setData({...data, offStartTime: newValue, breakTime: false})
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                <Stack sx={{mr: 1, ml: 1, mt: 2}}>
                                    ~
                                </Stack>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        label="00:00"
                                        value={data.offEndTime}
                                        onChange={(newValue) => {
                                            setData({...data, offEndTime: newValue, breakTime: false})
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                <FormControlLabel
                                    sx={{mr: 4, ml: 4}}
                                    value={data.breakTime}
                                    label={`${t('component_myPage_brandDetailCorrection_label_noBreakTime')}`}
                                    control={<Checkbox
                                        onChange={() => {
                                            if (data.breakTime) {
                                                setData({...data, breakTime: false})
                                            } else {
                                                setData({
                                                    ...data,
                                                    breakTime: true,
                                                    offEndTime: null,
                                                    offStartTime: null
                                                })
                                            }

                                        }}
                                        checked={data.breakTime}
                                    />}
                                />
                            </Grid>
                            <Grid sx={{display: 'flex', mt: 2}}>
                                <PropertyListItem
                                    align={align}
                                    label={t('component_myPage_brandDetailCorrection_label_offDay')}
                                    sx={{width: 200}}
                                />
                                {renderDay()}
                                <FormControlLabel
                                    value={data.holiday}
                                    label={`${t('component_myPage_brandDetailCorrection_label_holiday')}`}
                                    control={<Checkbox
                                        onChange={() => {
                                            if (data.holiday) {
                                                setData({...data, holiday: false})
                                            } else {
                                                setData({...data, holiday: true, off: false})
                                            }

                                        }}
                                        checked={data.holiday}
                                    />}
                                />
                                <FormControlLabel
                                    value={data.off}
                                    label={`${t('component_myPage_brandDetailCorrection_label_noOffDay')}`}
                                    control={<Checkbox
                                        onChange={() => {
                                            if (data.off) {
                                                setData({...data, off: false})
                                            } else {
                                                setData({...data, off: true, holiday: false})
                                                setOffDayArr([])
                                            }

                                        }}
                                        checked={data.off}
                                    />}
                                />
                            </Grid>
                            <Grid sx={{display: 'flex', mt: 2}}>
                                <PropertyListItem
                                    align={align}
                                    label={t('component_myPage_brandDetailCorrection_label_csManager')}
                                    sx={{width: 200, mt: -1.5}}
                                />
                                <TextField value={data.csManager} sx={{mr: 2, width: 300}}
                                           onChange={handleChange('csManager')}/>
                                <PropertyListItem
                                    align={align}
                                    label={t('component_myPage_brandDetailCorrection_label_csManagerNumber')}
                                    sx={{width: 200, mt: -1.5}}
                                />
                                <TextField value={data.csManagerNum} sx={{mr: 2, width: 300}}
                                           onChange={handleChange('csManagerNum')}/>
                            </Grid>
                        </PropertyList>
                    </Collapse>
                </CardContent>
            </Card>
        </>
    )
}