import React, {ChangeEvent, FC, useContext, useEffect, useState} from "react";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    IconButton,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery,
} from "@mui/material";
import {B2bPartnerMallDetailModel, Brand, Mall} from "../../types/b2b-partner-model/b2b-partner-mall-model";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DataContext} from "../../contexts/data-context";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const CardComponent = (props) => {
    const {index, mallModel, setMallModel, onDelete} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const dataContext = useContext(DataContext);

    const [brandItem, setBrandItem] = useState<Brand>(null);

    useEffect(() => {
        setBrandItem(mallModel.brands[index])
    }, [mallModel])

    const handleChange = (prop: keyof Brand) => (event: ChangeEvent<HTMLInputElement>) => {
        const newB = mallModel.brands;
        if(prop == 'nameEn') {
            brandItem['name'] = event.target.value;
            brandItem[prop] = event.target.value;
        } else if(prop == 'nameKo') {
            brandItem[prop] = event.target.value;
        }
        newB[index] = brandItem;
        setMallModel({...mallModel, brands: newB});
    };

    const handleChangeKeyword = (event: SelectChangeEvent<typeof mallModel.brand.styleKeywordsList>) => {
        const {
            target: {value},
        } = event;
        let keywords = '';
        if(value.length > 0) {
            keywords = [...value].join(',');
        }
        const newB = mallModel.brands;
        brandItem['styleKeywords'] = keywords;
        brandItem['styleKeywordsList'] = value;
        newB[index] = brandItem;
        setMallModel({...mallModel, brands: newB});
    };

    const renderKeywords = () => {
        if(mallModel.gender == 'M') {
            return Object.keys(dataContext.B2BMALEKEYWORDS).map(key => {
                return (<MenuItem key={key}
                                  value={key}>
                    <Checkbox
                        checked={mallModel.brands[index].styleKeywordsList?.indexOf(key) > -1}/>
                    <ListItemText primary={key}/>
                </MenuItem>)
            })
        } else {
            return Object.keys(dataContext.B2BKEYWORDS).map(key => {
                return (<MenuItem key={key}
                                  value={key}>
                    <Checkbox
                        checked={mallModel.brands[index].styleKeywordsList?.indexOf(key) > -1}/>
                    <ListItemText primary={key}/>
                </MenuItem>)
            })
        }
    }

    const clickDelete = (index) => {
        onDelete(index);
    }

    return (
        <>
            <Stack direction='row'>
                <PropertyListItem
                    align={align}
                    label="브랜드명(국문)"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{ml: 5}}
                    >
                        <TextField
                            id='nameKo'
                            placeholder={'브랜드명을 입력해주세요'}
                            value={mallModel.brands[index].nameKo || ""}
                            onChange={handleChange('nameKo')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="브랜드명(영문)"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{ml: 5}}
                    >
                        <TextField
                            id='nameEn'
                            placeholder={'브랜드명을 입력해주세요'}
                            value={mallModel.brands[index].nameEn || ""}
                            onChange={handleChange('nameEn')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="키워드 (최대 2가지)"
                >
                    <Select
                        name="keyword"
                        onChange={handleChangeKeyword}
                        multiple={true}
                        sx={{minWidth: 200, maxHeight: 40, ml: 5}}
                        value={mallModel.brands[index].styleKeywordsList || []}
                        renderValue={(selected) => selected.join(',')}
                        MenuProps={MenuProps}
                    >
                        {renderKeywords()}
                    </Select>
                </PropertyListItem>
                {index >= 1 ?
                    <Box sx={{mt: 2.5, mr: 4, ml: -7}}>
                        <IconButton
                            edge="end"
                            onClick={() => clickDelete(index)}
                        >
                            <CloseIcon fontSize="small"/>
                        </IconButton>
                    </Box>
                    :
                    <></>
                }
            </Stack>
        </>
    )
};

interface ListProps {
    mallModel: B2bPartnerMallDetailModel;
    setMallModel: (mallModel) => void;
}

const B2bPartnerCreateMallDetail: FC<ListProps> = (props) => {
    const {mallModel, setMallModel} = props;
    const dataContext = useContext(DataContext);
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    const [curMonth, setMonth] = useState(0);
    const [curYear, setYear] = useState(0);
    const planLastMon = moment(mallModel.planEndDate).month() + 1

    const handleChange = (prop: keyof B2bPartnerMallDetailModel) => (event: ChangeEvent<HTMLInputElement>) => {
        setMallModel({...mallModel, [prop]: event.target.value});
    };

    const handleBrandPlus = () => {
        const addBrand = [{
            id: null,
            name: "",
            nameKo: "",
            nameEn: "",
            mallId: null,
            activated: true,
            product: "",
            styleKeywords: "",
            styleKeywordsList: [],
        }];
        let newBrand = [...mallModel.brands, ...addBrand];
        setMallModel(prevData => ({...prevData, brands: newBrand}))
    };

    const onDelete = (index) => {
        if (mallModel.brands.length > 1) {
            const deleteBrand = [...mallModel.brands]
            deleteBrand.splice(index, 1)
            console.log(deleteBrand)
            setMallModel({...mallModel, brands: deleteBrand});
        }
    }

    const handleSearchDate = (prop: keyof Mall) => (value) => {
        setMallModel({ ...mallModel, [prop]: value });
    };

    const renderType = (target) => {
        return Object.keys(dataContext[target]).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext[target][key]}</MenuItem>)
        });
    }

    const getNextMonth = () =>{
        const year = moment(new Date()).year()
        const mon = moment(new Date()).month() + 1

        setMonth(mon)
        setYear(year)

    }

    useEffect(()=>{
        getNextMonth();
    },[mallModel])

    return (
        <>
            <PropertyList>
                <Stack direction={'row'}
                       sx={{py:2}}>
                    <PropertyListItem
                        align={align}
                        label="회사명"
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                            sx={{ml: 5}}
                        >
                            <TextField
                                id='name'
                                value={mallModel.name}
                                placeholder={'회사명을 입력해주세요'}
                                onChange={handleChange('name')}
                            />
                        </Typography>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="성별"
                    >
                        <Select
                            value={mallModel.gender || ''}
                            size={"small"}
                            sx={{minWidth: 80, ml: 5}}
                            onChange={handleChange('gender')}
                        >
                            <MenuItem value={'M'}>남성</MenuItem>
                            <MenuItem value={'F'}>여성</MenuItem>
                            {/*<MenuItem value={'U'}>유니섹스</MenuItem>*/}
                        </Select>
                    </PropertyListItem>
                </Stack>
                <Divider />
                <Box sx={{display: 'flex', justifyContent: "end", mt: 2, mb: 2, mr: 5, ml: 5}}>
                    <Box>
                        <Button variant={'outlined'}
                                onClick={handleBrandPlus}>
                            {'브랜드 추가'}
                        </Button>
                    </Box>
                </Box>
                {mallModel.brands?.map((value, index) => {
                    return (
                        <>
                            <CardComponent key={`key${index}`}
                                           index={index}
                                           mallModel={mallModel}
                                           setMallModel={setMallModel}
                                           onDelete={onDelete}
                            />
                            <Divider />
                        </>
                    )
                })}
                <Stack sx={{py:2}}>
                    <PropertyListItem
                      align={align}
                      label="플랜유형"
                    >
                        <Select
                          value={mallModel.b2bServicePlanType}
                          size={"small"}
                          sx={{minWidth: 200, ml: 5}}
                          onChange={handleChange('b2bServicePlanType')}
                        >
                            <MenuItem value={'0'}>전체</MenuItem>
                            {renderType('BTB_PLAN_TYPE')}
                        </Select>
                    </PropertyListItem>
                </Stack>
                <Stack>
                    <PropertyListItem
                      align={align}
                      label="플랜기간"
                    >
                        <Stack direction='row'
sx={{ml:5}}>
                        <Stack sx={{mb: 2}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  value={mallModel.planStartDate}
                                  inputFormat={"yyyy-MM-dd"}
                                  mask={"____-__-__"}
                                  onChange={handleSearchDate('planStartDate')}
                                  renderInput={(params) => <TextField {...params}
                                                                      size={'small'}
                                                                      sx={{height: 40, width: 200}}/>}
                                />
                            </LocalizationProvider>
                        </Stack>
                        <Stack sx={{mr: 2, ml: 2, mt:1}}>
                            ~
                        </Stack>
                        <Stack sx={{mb: 2}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  value={mallModel.planEndDate}
                                  inputFormat={"yyyy-MM-dd"}
                                  mask={"____-__-__"}
                                  onChange={handleSearchDate('planEndDate')}
                                  renderInput={(params) => <TextField {...params}
                                                                      size={'small'}
                                                                      sx={{height: 40, width: 200}}/>}
                                />
                            </LocalizationProvider>
                        </Stack>
                        </Stack>
                    </PropertyListItem>
                </Stack>
                {mallModel.id != null ?
                  <Stack>
                      <PropertyListItem label={'잔여 제니핏 신청 횟수'}
align={align}>
                          <Stack direction={'row'}
sx={{display: 'flex', alignItems:'center'}}>
                              <Typography
                                variant="body2"
                                sx={{ml: 6, mr: 1}}
                              >
                                  {mallModel.jennifitCnt-mallModel.jennifitUsedCnt}회 / {mallModel.jennifitCnt}회
                              </Typography>
                          </Stack>
                      </PropertyListItem>
                      <PropertyListItem label={'신청 횟수 초기화'}
align={align}
sx={{mt:3, ml:1}}>
                          {planLastMon - curMonth === 0 ?
                            <Stack direction={'row'}
sx={{display: 'flex', alignItems:'center', ml:6}}>
                                <Typography sx={{fontSize: '14px'}}>{moment(`${curYear}-${curMonth}`).endOf('month').format('ll')}</Typography>
                                <Typography sx={{fontSize: '14px', mr: 0.5, ml:1.5, color: 'red'}}>이번 달 종료. 구독기간 연장여부 확인 필요.</Typography>
                            </Stack>
                            : curYear < moment(mallModel.planEndDate).year() ? (<Typography sx={{fontSize: '14px', ml: 6}}>{moment(`${curMonth == 12 ? curYear + 1 : curYear}-${curMonth == 12 ? 1 : curMonth}`).format('ll')}</Typography>) :
                               planLastMon - curMonth >= 1 ?  (<Typography sx={{fontSize: '14px', ml: 6}}>{moment(`${curYear}-${curMonth}`).format('ll')}</Typography>) : (<Typography sx={{fontSize: '14px', ml: 6}}>만료됨.</Typography>)
                          }
                      </PropertyListItem>
                  </Stack>  :
                  <Stack sx={{display: 'flex', alignItems:'center'}}>
                      <PropertyListItem
                        align={align}
                        label="첫 달 제니핏 제공"
                      >
                          <Stack direction={'row'}
sx={{display: 'flex', alignItems:'center'}}>
                              <Typography
                                color="primary"
                                variant="body2"
                                sx={{ml: 5, mr: 1}}
                              >
                                  <TextField
                                    id='name'
                                    value={mallModel?.jennifitCntFirstmonth}
                                    placeholder={''}
                                    onChange={handleChange('jennifitCntFirstmonth')}
                                  />
                              </Typography>
                              <Typography> 회 (시작일이 월초가 아닌 경우, 첫 월에 한해서 일할 계산된 결과를 기입해주세요.)</Typography>
                          </Stack>
                      </PropertyListItem>
                  </Stack>}
            </PropertyList>
        </>
    )
};

export default B2bPartnerCreateMallDetail;