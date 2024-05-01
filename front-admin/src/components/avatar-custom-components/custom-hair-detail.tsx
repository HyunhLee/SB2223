import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {styled} from '@mui/material/styles';
import {
    Box,
    Button,
    Card,
    Divider,
    FormControlLabel,
    IconButton,
    Menu,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Switch,
    SwitchProps,
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import {DataContext} from "../../contexts/data-context";
import {X as XIcon} from "../../icons/x";
import React, {useContext, useEffect, useState} from "react";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../style/dropzone";
import {ImageInFormWidget} from "../widgets/image-widget";
import {AvatarHair, defaultAvatarHair} from "../../types/avatar-custom";
import toast from "react-hot-toast";
import axiosInstance from "../../plugins/axios-instance";
import SaveIcon from "@mui/icons-material/Save";

const ImageUploadBox = (props) => {

    const {header, fileName, imageUrl, data, setData} = props;

    let [file, setFile] = useState<any>(null);
    const [imageTempUrl, setImageTempUrl] = useState<String>(imageUrl);
    const [visible, setVisible] = useState(true)
    const [image, setImage] = useState<string>(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const dataContext = useContext(DataContext);

    const handleDrop = (newFile: any): void => {
        newFile.forEach((file, index) => {
            file.preview = URL.createObjectURL(file)
            file.key = `key${0}`;
        })

        if(fileName === "mainImage"){
            setData(prevData => ({
                ...prevData,
                mainImage: newFile
            }))
        } else if (dataContext.AVATAR_HAIR_COLORS[fileName] !== undefined){
            data.avatarHairColors.filter(hairColor =>hairColor.colorType === fileName)[0].withoutImage = newFile
            setData(prevData => ({
                ...prevData,
                avatarHairColors: data.avatarHairColors
            }))
        }

        setFile(newFile);
    };

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleVisible = () => {
        setVisible(!visible);
    };

    const handleImageClick = (item) => {
        setImage(item.preview);
    }

    const onDelete = (item) => {
        setFile(null);
    }

    const onDeleteUrl = () => {
        setImageTempUrl('')
    }

    useEffect(() => {
        handleClose();
        if (!visible) {
            handleVisible();
        }
    }, [file]);

    return (
        <Box
            sx={{ border: 1, borderRadius: 1, backgroundColor:"white" }}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pr: 0.6,
                    pl: 2
                }}
            >
                <Typography>
                    {header}
                </Typography>
                <IconButton aria-label="add"
                            onClick={handleClick} >
                    <AddBoxRoundedIcon />
                </IconButton>
            </Box>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <Box sx={{m: 2, p: 2}}>
                    <Dropzone
                        accept="image/*"
                        files={file}
                        onDrop={handleDrop}
                        maxFiles={1}
                    />
                </Box>
            </Menu>
            <Box>
                {file !== null?
                    file.map((item, index) => (
                        <Box sx={{p: 1}}
                             key={file}
                             style={{position: 'relative'}}>
                            <ImageInFormWidget
                                imageUrl={`${item.preview}`}
                                onClick={() => handleImageClick(item)}
                            />
                            <div style={{position: 'absolute', right: 15, top: 10}}>
                                <IconButton
                                    edge="end"
                                    onClick={() => onDelete(item)}
                                >
                                    <XIcon fontSize="small"/>
                                </IconButton>
                            </div>
                        </Box>
                    )):
                    <Box sx={{p: 1}}
                         key={file}
                         style={{position: 'relative'}}>
                        <ImageInFormWidget
                            imageUrl={imageTempUrl}
                        />
                        <div style={{position: 'absolute', right: 15, top: 10}}>
                            <IconButton
                                edge="end"
                                onClick={() => onDeleteUrl()}
                            >
                                <XIcon fontSize="small"/>
                            </IconButton>
                        </div>
                    </Box>}
            </Box>
        </Box>
    )
}

export const CustomHairDetail = (props) => {
    const IOSSwitch = styled((props: SwitchProps) => (
        <Switch focusVisibleClassName=".Mui-focusVisible"
                disableRipple
                {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color:
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[600],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }));
    const {hair, register, setHair, onClose, hairLengthType} = props;

    useEffect(() => {
        register?setData(defaultAvatarHair(hairLengthType)):setData(hair)
        console.log('###### data : ',data)
        console.log('###### hair : ',hair)
    }, []);

    const [data, setData] = useState<AvatarHair>(register?defaultAvatarHair(hairLengthType):hair);
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    const onDeleteImage = (deleteImage) => {

    }

    const dataContext = useContext(DataContext);

    const getHairLength = (checkValues) => {
        if (data.hairLengthType) {
            const findValue = checkValues.find(value => data.hairLengthType.includes(value));
            return (findValue) ? findValue : '';
        }
        return '';
    }

    const changeHairLengthHandler = (value, checkValues): void => {
        setData({ ...data, hairLengthType: value });
    }

    const hasBangsHandleChange = () => {
        setData({ ...data, hasBangs: !data.hasBangs });
    }

    const avatarHairTypeClick = (event, value) => {
        return setData({ ...data, hairType: value });
    }

    const avatarHairColorsDefaultClick = (event, value) => {
        data.avatarHairColors.forEach(hairColor =>
            hairColor.colorType === value? hairColor.defaulted=true:hairColor.defaulted=false
        )
        return setData({ ...data, avatarHairColors: data.avatarHairColors });
    }

    const registerAvatarHair = () => {
        if(!data.mainImage) {
            toast.error('메인 이미지를 첨부해주세요');
            return;
        }
        data.avatarHairColors.forEach(hairColor => {
            if (!hairColor.withoutImage) {
                toast.error(dataContext.AVATAR_HAIR_COLORS[hairColor.colorType]+ ' 이미지를 첨부해주세요');
                return;
            }
        })
        const saveData = {...data};
        if (window.confirm('헤어 스타일을 등록 하시겠습니까?')) {
            let formData = new FormData()
            Object.keys(saveData).forEach(key => {
                if(key === 'mainImage') {
                    formData.append(key, saveData[key][0], saveData[key][0].name)
                } else if(key === 'avatarHairColors') {
                    saveData.avatarHairColors.forEach((avatarHairColor, index) => {
                        formData.append('avatarHairColors['+index+'].colorType', String(avatarHairColor.colorType));
                        formData.append('avatarHairColors['+index+'].defaulted', String(avatarHairColor.defaulted));
                        formData.append('avatarHairColors['+index+'].withoutImage', avatarHairColor.withoutImage[0], avatarHairColor.withoutImage[0].name);
                    })
                } else {
                    if(saveData[key] !== null){
                        formData.append(key, String(saveData[key]));
                    }
                }
            })

            return axiosInstance.post(`/services/member/api/avatar-hair`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).then(res => {
                toast.success('저장되었습니다.');
                location.reload();
            }).catch(err => {
                console.log(err);
                toast.error('저장에 실패했습니다.');
            });
        }
    }

    const updateAvatarHair = () => {
        if(!data.mainImage && !data.mainImageUrl) {
            toast.error('메인 이미지를 첨부해주세요');
            return;
        }
        data.avatarHairColors.forEach(hairColor => {
            if (!hairColor.withoutImage && !hairColor.withoutImageUrl) {
                toast.error(dataContext.AVATAR_HAIR_COLORS[hairColor.colorType]+ ' 이미지를 첨부해주세요');
                return;
            }
        })
        const saveData = {...data};
        if (window.confirm('수정된 헤어 스타일을 저장 하시겠습니까?')) {
            let formData = new FormData()
            Object.keys(saveData).forEach(key => {
                if(key === 'mainImage') {
                    formData.append(key, saveData[key][0], saveData[key][0].name)
                } else if(key === 'avatarHairColors') {
                    saveData.avatarHairColors.forEach((avatarHairColor, index) => {
                        // @ts-ignore
                        formData.append('avatarHairColors['+index+'].id', (avatarHairColor.id));
                        formData.append('avatarHairColors['+index+'].colorType', String(avatarHairColor.colorType));
                        formData.append('avatarHairColors['+index+'].defaulted', String(avatarHairColor.defaulted));
                        if(avatarHairColor.withoutImage){
                            formData.append('avatarHairColors['+index+'].withoutImage', avatarHairColor.withoutImage[0], avatarHairColor.withoutImage[0].name);
                            formData.append('avatarHairColors['+index+'].withoutImageUrl', String(avatarHairColor.withoutImageUrl));
                        }
                    })
                } else if(key === 'id') {
                    // @ts-ignore
                    formData.append('id', (saveData['id']));
                } else {
                    if(saveData[key] !== null){
                        formData.append(key, String(saveData[key]));
                    }
                }
            })

            return axiosInstance.post(`/services/member/api/avatar-hair/${saveData.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).then(res => {
                toast.success('저장되었습니다.');
                location.reload();
            }).catch(err => {
                console.log(err);
                toast.error('저장에 실패했습니다.');
            });
        }
    }

    return (
        <Card>
            <Box sx={{display: 'flex', justifyContent: 'space-between', m:5}}>
                {register?
                    <Typography variant="h3">
                        헤어스타일 등록
                    </Typography>:
                    <Typography variant="h3">
                        헤어스타일 상세
                    </Typography>
                }
                <Button
                    size='small'
                    color="primary"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{p: 1}}
                    onClick={() => register?registerAvatarHair():updateAvatarHair()}
                >
                    저장
                </Button>
            </Box>
            <PropertyList>
                <Stack sx={{mt:7, ml:7}}
                       direction='row'>
                    <Stack
                        direction='column'>
                        <Typography sx={{m:2}}>
                            {"메인 이미지"}
                        </Typography>
                        <ImageUploadBox
                            target={'Image'}
                            fileName={"mainImage"}
                            imageUrl={data.mainImageUrl || ''}
                            data={data}
                            setData={setData}
                        />
                        <div style={{position: 'absolute', right: 15, top: 10, display:"none"}}>
                            <Stack
                                direction='column'
                            >
                                <IconButton
                                    edge="end"
                                    onClick={() => onDeleteImage('ghostImageUrl')}
                                >
                                    <XIcon fontSize="small"/>
                                </IconButton>
                            </Stack>
                        </div>
                    </Stack>
                    <Stack sx={{ml:50}}
                           direction='column'>
                        <PropertyListItem
                            align={align}
                            label="기장"
                        >
                            <Box
                                sx={{
                                    alignItems: {
                                        sm: 'center'
                                    },
                                    display: 'flex',
                                    flexDirection: {
                                        xs: 'column',
                                        sm: 'row'
                                    },
                                    mx: -1
                                }}
                            >
                                <Select
                                    value={getHairLength(['LONG', 'MIDDLE', 'SHORT'])}
                                    size={"small"}
                                    onChange={e=> {changeHairLengthHandler(e.target.value, ['LONG', 'MIDDLE', 'SHORT'])}}
                                >
                                    <MenuItem value={'LONG'}>LONG</MenuItem>
                                    <MenuItem value={'MIDDLE'}>MIDDLE</MenuItem>
                                    <MenuItem value={'SHORT'}>SHORT</MenuItem>
                                </Select>
                            </Box>
                        </PropertyListItem>
                        <Stack
                            direction='row'
                        >
                            <PropertyListItem
                                align={align}
                                label= "앞머리 유무"
                            >
                                <Stack direction="row">
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }}
                                                            defaultChecked
                                                            onChange={hasBangsHandleChange}
                                                            checked={data.hasBangs}
                                                            value={data.hasBangs}
                                        />
                                        }
                                        label={data.hasBangs?'있음':'없음'}
                                    />
                                </Stack>
                            </PropertyListItem>
                        </Stack>
                        <Stack
                            direction='row'
                        >
                            <PropertyListItem
                                align={align}
                                label="헤어 스타일"
                            >
                                <Stack direction="row">
                                    <RadioGroup
                                        row
                                        value={data.hairType}
                                        onChange={avatarHairTypeClick}
                                    >
                                        <FormControlLabel value="WAVE"
                                                          control={<Radio color="success"/>}
                                                          label="웨이브" />
                                        <FormControlLabel value="STRAIGHT"
                                                          control={<Radio color="success" />}
                                                          label="생머리" />
                                    </RadioGroup>
                                </Stack>
                            </PropertyListItem>
                        </Stack>
                    </Stack>
                </Stack>
                <Divider sx={{mt:7, ml:7}}/>
                <Stack
                    direction='row'
                    sx={{mt:7, ml:7}}
                >                    <Typography sx={{m:2}}>
                    {'헤어컬러'}
                </Typography>
                    <RadioGroup
                        value={data.avatarHairColors.filter(avatarHair => avatarHair.defaulted === true).map(avatarHair => avatarHair.colorType)}
                        onChange={avatarHairColorsDefaultClick}>
                        <Stack
                            direction='row'>
                            <Box sx={{mr:2, ml:6, p:1, border: 1, borderRadius: 1, borderColor: 'black', width:300, backgroundColor:"lightgray"}}>
                                <Box >
                                    <Stack
                                        direction='column'>
                                        <FormControlLabel value="DARK_BROWN"
                                                          control={<Radio color="success" />}
                                                          label="다크브라운" />
                                        <ImageUploadBox
                                            target={'Image'}
                                            imageUrl={data.avatarHairColors.filter(hairColor => hairColor.colorType === 'DARK_BROWN')[0].withoutImageUrl}
                                            fileName = {"DARK_BROWN"}
                                            data={data}
                                            setData={setData}
                                        />
                                    </Stack>
                                </Box>
                                <div style={{position: 'absolute', right: 15, top: 10, display:"none"}}>
                                    <Stack
                                        direction='column'
                                    >
                                        <IconButton
                                            edge="end"
                                            onClick={() => onDeleteImage('ghostImageUrl')}
                                        >
                                            <XIcon fontSize="small"/>
                                        </IconButton>
                                    </Stack>
                                </div>
                            </Box>
                            <Box sx={{mr:2, ml:6, p:1, border: 1, borderRadius: 1, borderColor: 'black', width:300, backgroundColor:"lightgray"}}>
                                <Stack
                                    direction='column'>
                                    <FormControlLabel value="BROWN"
                                                      control={<Radio color="success" />}
                                                      label="브라운" />
                                    <ImageUploadBox
                                        target={'Image'}
                                        imageUrl={data.avatarHairColors.filter(hairColor => hairColor.colorType === 'BROWN')[0].withoutImageUrl}
                                        fileName = {"BROWN"}
                                        data={data}
                                        setData={setData}
                                    />
                                </Stack>
                                <div style={{position: 'absolute', right: 15, top: 10, display:"none"}}>
                                    <Stack
                                        direction='column'
                                    >
                                        <IconButton
                                            edge="end"
                                            onClick={() => onDeleteImage('fitRefImageUrl')}
                                        >
                                            <XIcon fontSize="small"/>
                                        </IconButton>
                                    </Stack>
                                </div>
                            </Box>
                            <Box sx={{mr:2, ml:6, p:1, border: 1, borderRadius: 1, borderColor: 'black', width:300, backgroundColor:"lightgray"}}>
                                <Stack
                                    direction='column'>
                                    <FormControlLabel value="ASH_BROWN"
                                                      control={<Radio color='success' />}
                                                      label="애쉬 브라운" />
                                    {console.log('data : ', data)}
                                    <ImageUploadBox
                                        target={'Image'}
                                        imageUrl={data.avatarHairColors.filter(hairColor => hairColor.colorType === 'ASH_BROWN')[0].withoutImageUrl}
                                        fileName = {"ASH_BROWN"}
                                        data={data}
                                        setData={setData}
                                    />
                                </Stack>
                                <div style={{position: 'absolute', right: 15, top: 10, display:"none"}}>
                                    <Stack
                                        direction='column'
                                    >
                                        <IconButton
                                            edge="end"
                                            onClick={() => onDeleteImage('ghostImageUrl')}
                                        >
                                            <XIcon fontSize="small"/>
                                        </IconButton>
                                    </Stack>
                                </div>
                            </Box>
                            <Box sx={{mr:2, ml:6, p:1, border: 1, borderRadius: 1, borderColor: 'black', width:300, backgroundColor:"lightgray"}}>
                                <Stack
                                    direction='column'>
                                    <FormControlLabel value="DECOLORIZATION"
                                                      control={<Radio color="success" />}
                                                      label="탈색" />
                                    <ImageUploadBox
                                        target={'Image'}
                                        imageUrl={data.avatarHairColors.filter(hairColor => hairColor.colorType === 'DECOLORIZATION')[0].withoutImageUrl}
                                        fileName = {"DECOLORIZATION"}
                                        data={data}
                                        setData={setData}
                                    />
                                </Stack>
                                <div style={{position: 'absolute', right: 15, top: 10, display:"none"}}>
                                    <Stack
                                        direction='column'
                                    >
                                        <IconButton
                                            edge="end"
                                            onClick={() => onDeleteImage('ghostImageUrl')}
                                        >
                                            <XIcon fontSize="small"/>
                                        </IconButton>
                                    </Stack>
                                </div>
                            </Box>
                        </Stack>
                    </RadioGroup>
                </Stack>
            </PropertyList>
        </Card>
    )
}