import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {
    Box,
    Card,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    Input,
    InputAdornment,
    Menu,
    MenuItem,
    Select,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import {X as XIcon} from "../../icons/x";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../style/dropzone";
import {getDataContextValue} from "../../utils/data-convert";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {CategoryDialog, ColorDialog, PatternDialog} from "../dialog/category-dialog";
import {DataContext} from "../../contexts/data-context";
import {ProductModel} from "../../types/product-model";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {ImageDialog, ImageInFormWidget} from "../widgets/image-widget";

const ImageUploadBox = (props) => {

    const {header, addFileImage} = props;

    let [files, setFiles] = useState<any[]>([]);
    const [visible, setVisible] = useState(true)
    const [image, setImage] = useState<string>(null);
    const [anchorEl, setAnchorEl] = useState(null);


    const handleDrop = (newFiles: any): void => {
        newFiles.forEach((file, index) => {
            file.preview = URL.createObjectURL(file)
            file.key = `key${0}`;
        })
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
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
        const newfile = [...files]
        newfile.splice(newfile.indexOf(item), 1)
        setFiles(newfile);
    }

    useEffect(() => {
        addFileImage(files);
        handleClose();
        if (!visible) {
            handleVisible();
        }
    }, [files]);

    return (
        <Box
            sx={{ border: 1, borderRadius: 1 }}
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
                        files={files}
                        onDrop={handleDrop}
                        maxFiles={1}
                    />
                </Box>
            </Menu>
            <Box>
                {files.map((item, index) => (
                    <Box sx={{p: 1}}
key={item.key}
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
                ))}
            </Box>
        </Box>
    )
}

const MyClosetUploadComponent = (props) => {
    const {addFileImage, changeSeason, data, setData, emailList, setEmailList, refreshList} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const dataContext = useContext(DataContext);

    const [open, setOpen] = React.useState(false);
    const [colorOpen, setColorOpen] = React.useState(false);
    const [patternOpen, setPatternOpen] = React.useState(false);
    const [openImg, setOpenImg] = React.useState(false);
    const [imageName, setImageName] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');

    const onDeleteImage = (deleteImage) => {
        if(deleteImage === 'originalImage') {
            setData({ ...data, originalImage: []});
        }
    }

    const handleClickClear = (prop: keyof ProductModel) => {
        setData({...data, [prop]: '' });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        if (value) {
            setData({
                ...data,
                categoryIds: value.key.split('/')
            });
        }
        setOpen(false);
    };

    const handleClickColorOpen = () => {
        setColorOpen(true);
    };

    const handleColorClose = (value) => {
        if (value) {
            setData({...data, colorType: value.name})
        }
        setColorOpen(false);
    };

    const handleClickPatternOpen = () => {
        setPatternOpen(true);
    };

    const handlePatternClose = (value) => {
        if (value) {
            setData({...data, patternType: value.name})
        }
        setPatternOpen(false);
    };

    const checkedSeason = (season) => {
        if (data.seasonTypes) {
            return data.seasonTypes.includes(season)
        }
        return false;
    }

    const handleBrandChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setData({ ...data, brandName: event.target.value });
    }

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setData({...data, silhouetteType: newAlignment})
    };

    const handleLengthChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setData({...data, lengthType: newAlignment})
    };

    const handleNeckLineChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setData({...data, necklineType: newAlignment})
    };

    const handleSleeveLengthChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setData({...data, sleeveType: newAlignment})
    };

    const handleOpen = () => {
        if(data.categoryIds[0] == '4') {
            setImageUrl('/static/automatic-guide-images/dress-silhouette-type.png')
        } else if(data.categoryIds[1] == '13') {
            setImageUrl('/static/automatic-guide-images/pants-silhouette-type.png')
        }
        setImageName('실루엣');
        setOpenImg(true);
    };

    const handleLengthOpen = () => {
        if(data.categoryIds[0] == '4') {
            setImageUrl('/static/automatic-guide-images/dress-length-type.png')
        } else if(data.categoryIds[1] == '13') {
            setImageUrl('/static/automatic-guide-images/pants-length-type.png')
        } else if(data.categoryIds[1] == '11') {
            setImageUrl('/static/automatic-guide-images/vest-length-type.png')
        } else if(data.categoryIds[1] == '14') {
            setImageUrl('/static/automatic-guide-images/skirt-length-type.png')
        } else if(data.categoryIds[0] == '1') {
            setImageUrl('/static/automatic-guide-images/outer-length-type.png')
        } else if(data.categoryIds[0] == '3') {
            setImageUrl('/static/automatic-guide-images/top-length-type.png')
        }
        setImageName('기장');
        setOpenImg(true);
    };


    const handleNeckLineOpen = () => {
        if(data.categoryIds[0] == '4' || data.categoryIds[0] == '3') {
            setImageUrl('/static/automatic-guide-images/dress-neckline-type.png')
        } else if(data.categoryIds[1] == '11') {
            setImageUrl('/static/automatic-guide-images/vest-neckline-type.png')
        } else if(data.categoryIds[0] == '1') {
            setImageUrl('/static/automatic-guide-images/outer-neckline-type.png')
        }
        setImageName('네크라인');
        setOpenImg(true);
    };

    const handleClickClose = () => {
        setOpenImg(false);
    };

    const changeRegistrationTypeHandler = (value, checkValues): void => {
        setData(prevData => ({
            ...prevData,
            registrationType: value
        }))
    }

    const changeEmailHandler = (value, checkValues): void => {
        for(let i = 0; i < emailList.length; i++) {
            if(value == emailList[i].email) {
                setData({...data, userId: emailList[i].id, email: value})
            }
        }
    }

    return (
        <Card>
            <PropertyList>
                <Stack sx={{mt: 2}}
direction="row">
                    <Typography
                        sx={{mr: 2, mt: 1.2, ml: 2}}
                        variant='h6'>
                        등록자
                    </Typography>
                    <Select
                        value={data.registrationType || ''}
                        size={"small"}
                        onChange={e=> {changeRegistrationTypeHandler(e.target.value, ['AUTOMATIC_CLOSET', 'AUTOMATIC_LEARNING'])}}
                    >
                        <MenuItem value={'AUTOMATIC_CLOSET'}>AUTOMATIC_CLOSET</MenuItem>
                        <MenuItem value={'AUTOMATIC_LEARNING'}>AUTOMATIC_LEARNING</MenuItem>
                    </Select>
                    {data.registrationType == 'AUTOMATIC_CLOSET' ?
                        <>
                            <Select
                                value={data.email || ''}
                                size={"small"}
                                onChange={e=> {changeEmailHandler(e.target.value, [''])}}
                            >
                                {emailList.map((list) => (
                                    <MenuItem key={list.email}
value={`${list.email}`}>{list.email}</MenuItem>
                                ))}
                            </Select>
                        </>
                    : ''}
                </Stack>
                <Stack
                    direction='row'>
                    <Stack
                        direction='column'>
                        <Typography sx={{m:2}}>
                            {"메인 이미지"}
                        </Typography>
                        <ImageUploadBox
                            target={'Image'}
                            addFileImage={addFileImage}
                        />
                        <div style={{position: 'absolute', right: 15, top: 10, display:"none"}}>
                            <Stack
                                direction='column'
                            >
                                <IconButton
                                    edge="end"
                                    onClick={() => onDeleteImage('originalImage')}
                                >
                                    <XIcon fontSize="small"/>
                                </IconButton>
                            </Stack>
                        </div>
                    </Stack>
                    <Stack
                        direction='column'>
                        <PropertyListItem
                            align={align}
                            label="카테고리"
                        >
                            <Stack
                                direction='row'
                            >
                                <Input
                                    type='text'
                                    style={{width: 350}}
                                    value={data.categoryIds !== undefined ? getDataContextValue(dataContext, 'CATEGORY_MAP', data.categoryIds[data.categoryIds.length - 1], 'path') || '' : null}
                                    readOnly={true}
                                    disabled={true}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                sx={{p: 0}}
                                                onClick={() => {
                                                    handleClickClear('categoryIds');
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
                            </Stack>
                        </PropertyListItem>
                        <PropertyListItem
                            align={align}
                            label="컬러"
                        >
                            <Stack
                                direction='row'
                            >
                                <Input
                                    id="standard-adornment-password"
                                    type='text'
                                    value={data.colorType}
                                    readOnly={true}
                                    disabled={true}
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
                            </Stack>
                        </PropertyListItem>
                        <PropertyListItem
                            align={align}
                            label="패턴"
                        >
                            <Stack
                                direction='row'
                            >
                                <Input
                                    id="standard-adornment-password"
                                    type='text'
                                    value={data.patternType}
                                    readOnly={true}
                                    disabled={true}
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
                            </Stack>
                        </PropertyListItem>
                        <PropertyListItem
                            align={align}
                            label="시즌"
                        >
                            <Stack direction="row"
justifyContent={"space-between"}>
                                <FormControlLabel
                                    value={'SPRING'}
                                    control={<Checkbox
                                        onChange={e=> {changeSeason(e.target.defaultValue, e.target.checked)}}
                                        checked={checkedSeason('SPRING')}
                                    />}
label="봄" />
                                <FormControlLabel
                                    value={'SUMMER'}
                                    control={<Checkbox
                                        onChange={e=> {changeSeason(e.target.defaultValue, e.target.checked)}}
                                        checked={checkedSeason('SUMMER')}
                                    />}
label="여름" />
                                <FormControlLabel
                                    value={'FALL'}
                                    control={<Checkbox
                                        onChange={e=> {changeSeason(e.target.defaultValue, e.target.checked)}}
                                        checked={checkedSeason('FALL')}
                                    />}
label="가을" />
                                <FormControlLabel
                                    value={'WINTER'}
                                    control={<Checkbox
                                        onChange={e=> {changeSeason(e.target.defaultValue, e.target.checked)}}
                                        checked={checkedSeason('WINTER')}
                                    />}
label="겨울" />
                            </Stack>
                        </PropertyListItem>
                        <PropertyListItem
                            align={align}
                            label="브랜드(선택사항)"
                        >
                            <Typography
                                color="primary"
                                variant="body2"
                            >
                                <TextField
                                    id='brand'
                                    placeholder={'브랜드를 입력하세요'}
                                    onChange={handleBrandChange}
                                />
                            </Typography>
                        </PropertyListItem>
                    </Stack>
                </Stack>
                <Divider />
                <Stack
                    direction='column'>
                    <Stack
                        direction='row'>
                        <PropertyListItem
                            align={align}
                            label="실루엣">
                            {data.categoryIds[0] == '4' || data.categoryIds[1] == '13' || data.categoryIds[1] == '14' ? <IconButton
                                color="primary"
                                sx={{mr: 2}}
                                onClick={handleOpen}
                            >
                                <QuestionMarkIcon fontSize='small' />
                            </IconButton> : <IconButton
                                sx={{mr: 2}}
                                    disabled={true}
                                ><QuestionMarkIcon fontSize='small' /></IconButton>}
                            {data.categoryIds[0] == '1' ?
                                <ToggleButtonGroup
                                    color="primary"
                                    value={data.silhouetteType}
                                    exclusive
                                    onChange={handleChange}
                                >
                                    <ToggleButton value="SLIM">SLIM</ToggleButton>
                                    <ToggleButton value="LOOSE">LOOSE</ToggleButton>
                                    <ToggleButton value="EXTRA_OVER_FIT">EXTRA OVER FIT</ToggleButton>
                                </ToggleButtonGroup> :
                                data.categoryIds[1] == '11' || data.categoryIds[0] == '3' ?
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={data.silhouetteType}
                                        exclusive
                                        onChange={handleChange}
                                    >
                                    <ToggleButton value="TIGHT">TIGHT</ToggleButton>
                                    <ToggleButton value="STANDARD">STANDARD</ToggleButton>
                                    <ToggleButton value="LOOSE">LOOSE</ToggleButton>
                                    </ToggleButtonGroup> : data.categoryIds[0] == '4' ?
                                        <ToggleButtonGroup
                                            color="primary"
                                            value={data.silhouetteType}
                                            exclusive
                                            onChange={handleChange}
                                        >
                                            <ToggleButton value="A-LINE">A-LINE</ToggleButton>
                                            <ToggleButton value="H-LINE">H-LINE</ToggleButton>
                                            <ToggleButton value="S-LINE">S-LINE</ToggleButton>
                                        </ToggleButtonGroup> : data.categoryIds[1] == '13' ?
                                            <ToggleButtonGroup
                                                color="primary"
                                                value={data.silhouetteType}
                                                exclusive
                                                onChange={handleChange}
                                            >
                                                <ToggleButton value="일자바지">일자바지</ToggleButton>
                                                <ToggleButton value="와이드">와이드</ToggleButton>
                                                <ToggleButton value="스키니">스키니</ToggleButton>
                                                <ToggleButton value="부츠컷">부츠컷</ToggleButton>
                                            </ToggleButtonGroup> : data.categoryIds[1] == '14' ?
                                                <ToggleButtonGroup
                                                    color="primary"
                                                    value={data.silhouetteType}
                                                    exclusive
                                                    onChange={handleChange}
                                                >
                                                    <ToggleButton value="A-LINE">A-LINE</ToggleButton>
                                                    <ToggleButton value="H-LINE">H-LINE</ToggleButton>
                                                    <ToggleButton value="PENCIL">PENCIL</ToggleButton>
                                                    <ToggleButton value="MERMAID">MERMAID</ToggleButton>
                                                </ToggleButtonGroup> : ''}
                        </PropertyListItem>
                    </Stack>
                    <Divider />
                    <Stack
                        direction='row'>
                        <PropertyListItem
                            align={align}
                            label="기장">
                            {data.categoryIds == '' ? <IconButton
                                sx={{mr: 2}}
                                disabled={true}
                            ><QuestionMarkIcon fontSize='small' /></IconButton> : <IconButton
                                color="primary"
                                sx={{mr: 2}}
                                onClick={handleLengthOpen}
                            >
                                <QuestionMarkIcon fontSize='small' />
                            </IconButton>}
                            {data.categoryIds[0] == '1' ?
                                <ToggleButtonGroup
                                    color="primary"
                                    value={data.lengthType}
                                    exclusive
                                    onChange={handleLengthChange}
                                >
                                    <ToggleButton value="CROP">CROP</ToggleButton>
                                    <ToggleButton value="STANDARD">STANDARD</ToggleButton>
                                    <ToggleButton value="MID">MID</ToggleButton>
                                    <ToggleButton value="KNEE">KNEE</ToggleButton>
                                    <ToggleButton value="LONG">LONG</ToggleButton>
                                </ToggleButtonGroup> :
                                data.categoryIds[1] == '11' ?
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={data.lengthType}
                                        exclusive
                                        onChange={handleLengthChange}
                                    >
                                        <ToggleButton value="CROP">CROP</ToggleButton>
                                        <ToggleButton value="STANDARD">STANDARD</ToggleButton>
                                        <ToggleButton value="HIP">HIP</ToggleButton>
                                        <ToggleButton value="KNEE">KNEE</ToggleButton>
                                        <ToggleButton value="LONG">LONG</ToggleButton>
                                    </ToggleButtonGroup> : data.categoryIds[0] == '4' || data.categoryIds[1] == '14' ?
                                        <ToggleButtonGroup
                                            color="primary"
                                            value={data.lengthType}
                                            exclusive
                                            onChange={handleLengthChange}
                                        >
                                            <ToggleButton value="MINI">MINI</ToggleButton>
                                            <ToggleButton value="KNEE">KNEE</ToggleButton>
                                            <ToggleButton value="MID">MID</ToggleButton>
                                            <ToggleButton value="LONG">LONG</ToggleButton>
                                        </ToggleButtonGroup> : data.categoryIds[1] == '13' ?
                                            <ToggleButtonGroup
                                                color="primary"
                                                value={data.lengthType}
                                                exclusive
                                                onChange={handleLengthChange}
                                            >
                                                <ToggleButton value="SHORT">SHORT</ToggleButton>
                                                <ToggleButton value="KNEE">KNEE</ToggleButton>
                                                <ToggleButton value="MID">MID</ToggleButton>
                                                <ToggleButton value="ANKLE">ANKLE</ToggleButton>
                                                <ToggleButton value="LONG">LONG</ToggleButton>
                                                <ToggleButton value="EXTRA_LONG">EXTRA LONG</ToggleButton>
                                            </ToggleButtonGroup> : data.categoryIds[0] == '3' ?
                                                <ToggleButtonGroup
                                                    color="primary"
                                                    value={data.lengthType}
                                                    exclusive
                                                    onChange={handleLengthChange}
                                                >
                                                    <ToggleButton value="CROP">CROP</ToggleButton>
                                                    <ToggleButton value="STANDARD">STANDARD</ToggleButton>
                                                    <ToggleButton value="LONG">LONG</ToggleButton>
                                                </ToggleButtonGroup> : ''}
                        </PropertyListItem>
                    </Stack>
                    {data.categoryIds[1] === '13' || data.categoryIds[1] === '14' ? '' :
                        <>
                        <Divider/>
                        <Stack
                            direction='row'>
                            <PropertyListItem
                                align={align}
                                label="네크라인">
                                {data.categoryIds == '' ? <IconButton
                                    sx={{mr: 2}}
                                    disabled={true}
                                ><QuestionMarkIcon fontSize='small' /></IconButton> : <IconButton
                                    color="primary"
                                    sx={{mr: 2}}
                                    onClick={handleNeckLineOpen}
                                >
                                    <QuestionMarkIcon fontSize='small' />
                                </IconButton>}
                                {data.categoryIds[0] == '1' ?
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={data.necklineType}
                                        exclusive
                                        onChange={handleNeckLineChange}
                                    >
                                        <ToggleButton value="라운드넥">라운드넥</ToggleButton>
                                        <ToggleButton value="브이넥">브이넥</ToggleButton>
                                        <ToggleButton value="하이넥">하이넥</ToggleButton>
                                        <ToggleButton value="후드">후드</ToggleButton>
                                    </ToggleButtonGroup> :
                                    data.categoryIds[1] == '11' ?
                                        <ToggleButtonGroup
                                            color="primary"
                                            value={data.necklineType}
                                            exclusive
                                            onChange={handleNeckLineChange}
                                        >
                                            <ToggleButton value="라운드넥">라운드넥</ToggleButton>
                                            <ToggleButton value="브이넥">브이넥</ToggleButton>
                                        </ToggleButtonGroup> : data.categoryIds[0] == '4' || data.categoryIds[0] == '3' ?
                                            <ToggleButtonGroup
                                                color="primary"
                                                value={data.necklineType}
                                                exclusive
                                                onChange={handleNeckLineChange}
                                            >
                                                <ToggleButton value="라운드넥">라운드넥</ToggleButton>
                                                <ToggleButton value="브이넥">브이넥</ToggleButton>
                                                <ToggleButton value="스퀘어넥">스퀘어넥</ToggleButton>
                                                <ToggleButton value="키홀넥">키홀넥</ToggleButton>
                                                <ToggleButton value="셔츠">셔츠</ToggleButton>
                                                <ToggleButton value="하이넥">하이넥</ToggleButton>
                                                <ToggleButton value="후드">후드</ToggleButton>
                                            </ToggleButtonGroup> : ''}
                            </PropertyListItem>
                        </Stack>
                        <Divider />
                        <Stack
                            direction='row'>
                            <PropertyListItem
                                align={align}
                                label="소매기장">
                                <IconButton
                                    sx={{mr: 2}}
                                    disabled={true}
                                ><QuestionMarkIcon fontSize='small' /></IconButton>
                                {data.categoryIds[0] == '1' ?
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={data.sleeveType}
                                        exclusive
                                        onChange={handleSleeveLengthChange}
                                    >
                                        <ToggleButton value="반팔">반팔</ToggleButton>
                                        <ToggleButton value="긴팔">긴팔</ToggleButton>
                                        <ToggleButton value="기타">기타</ToggleButton>
                                    </ToggleButtonGroup> :
                                    data.categoryIds[1] == '11' || data.categoryIds[0] == '4' ?
                                        <ToggleButtonGroup
                                            color="primary"
                                            value={data.sleeveType}
                                            exclusive
                                            onChange={handleSleeveLengthChange}
                                        >
                                            <ToggleButton value="끈나시">끈나시</ToggleButton>
                                            <ToggleButton value="민소매">민소매</ToggleButton>
                                            <ToggleButton value="반팔">반팔</ToggleButton>
                                            <ToggleButton value="긴팔">긴팔</ToggleButton>
                                        </ToggleButtonGroup> : data.categoryIds[0] == '3' ?
                                            <ToggleButtonGroup
                                                color="primary"
                                                value={data.sleeveType}
                                                exclusive
                                                onChange={handleSleeveLengthChange}
                                            >
                                                <ToggleButton value="끈나시">끈나시</ToggleButton>
                                                <ToggleButton value="민소매">민소매</ToggleButton>
                                                <ToggleButton value="반팔">반팔</ToggleButton>
                                                <ToggleButton value="긴팔">긴팔</ToggleButton>
                                                <ToggleButton value="튜브탑">튜브탑</ToggleButton>
                                                <ToggleButton value="기타">기타</ToggleButton>
                                            </ToggleButtonGroup> : ''}
                            </PropertyListItem>
                        </Stack>
                        </>
                    }
                </Stack>
            </PropertyList>
            <CategoryDialog
                keepMounted
                parent={'UPLOAD'}
                open={open}
                onClose={handleClose}
                category={dataContext.CATEGORY.filter(value => value.id != 5)}
                value={data.categoryId}
            />
            <ColorDialog
                keepMounted
                open={colorOpen}
                onClose={handleColorClose}
                items={dataContext.COLOR}
                value={data.colorType}
            />
            <PatternDialog
                keepMounted
                open={patternOpen}
                onClose={handlePatternClose}
                items={dataContext.PATTERN}
                value={data.patternType}
            />
            <ImageDialog
                open={openImg}
                onClose={handleClickClose}
                imageName={imageName}
                imageUrl={imageUrl}
            />
        </Card>
    )
}

export default MyClosetUploadComponent;