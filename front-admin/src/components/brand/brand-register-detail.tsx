import {
    Box,
    Button,
    Card,
    Checkbox,
    Grid,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {DataContext} from "../../contexts/data-context";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import BrandImagePreview from "./brand-image-preview";
import SaveIcon from "@mui/icons-material/Save";
import {BrandModel, defaultBrandModel} from "../../types/brand-model";
import {v4 as uuidv4} from 'uuid';
import {adminAwsApi} from "../../api/aws-api";
import {brandApi} from "../../api/brand-api";
import {toast} from "react-hot-toast";
import {useRouter} from "next/router";


const BrandRegisterDetail = (props) => {
    const {item} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const dataContext = useContext(DataContext);
    const router = useRouter();

    const [data, setData] = useState<BrandModel>(!item ? defaultBrandModel
        : item);
    const [keywordFilter, setKeywordFilter] = useState([]);

    //이미지 파일 더하기 위한 state
    const [anchorBanner, setAnchorBanner] = useState(null);
    const [anchorThumbnail, setAnchorThumbnail] = useState(null);
    const [anchorLogo, setAnchorLogo] = useState(null);
    const bannerDialogOpen = Boolean(anchorBanner);
    const thumbnailDialogOpen = Boolean(anchorThumbnail);
    const logoDialogOpen = Boolean(anchorLogo);


    useEffect(() => {
        getKeywords();
    }, [])


    const handleNameChange = (prop: keyof BrandModel) => (event: ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [prop]: event.target.value });
    };

    const getKeywords = () => {
        let keywordsArr = [];
        let keywordsArrKo = [];
        //브랜드id 맵핑되어있는 것과 데이터조회 id값 비교
        let idArr = dataContext.STYLE.filter((itemData) => {
            if (data.keywords?.map((v) => v.id).includes(itemData.id)) {
                keywordsArr.push(itemData.name)
            }
        })

        //비교해서 반환된 영어로된 키워드와 한글맵핑된 리스트 비교해서 해당값만 반환
        let koArr = Object.keys(dataContext.KEYWORDS).find((key) => {
            if (keywordsArr.includes(key)) {
                keywordsArrKo.push(dataContext.KEYWORDS[key])
            }
        });
        setKeywordFilter(keywordsArrKo)
    }

    const renderKeywords = () => {
        return Object.keys(dataContext.KEYWORDS).map(key => {
            return (<MenuItem key={dataContext.KEYWORDS[key]}
                              value={dataContext.KEYWORDS[key]}>
                <Checkbox checked={keywordFilter?.indexOf(dataContext.KEYWORDS[key]) > -1}/>
                <ListItemText primary={dataContext.KEYWORDS[key]}/>
            </MenuItem>)
        })
    }

    const handleChangeKeyword = (event: SelectChangeEvent<typeof data.keywords>) => {
        const {
            target: {value},
        } = event;

        let arr;
        let keywordsId = [];
        if (typeof value !== "string") {
            arr = value.map((v) => Object.keys(dataContext.KEYWORDS).find((key) => dataContext.KEYWORDS[key] == v));
        }

        //keyword ID찾기
        let keywordArr = dataContext.STYLE.filter((keyId) => {
            if (arr.includes(keyId.name)) {
                keywordsId.push(keyId.id)
            }
        })
        // @ts-ignore
        setKeywordFilter(value);
        setData({...data, keywords: keywordsId})
        console.log('keyword', value, keywordsId, keywordArr)
    };


    const handleThumbnailClick = (e) => {
        setAnchorThumbnail(e.currentTarget)
    }

    const handleBannerClick = (e) => {
        setAnchorBanner(e.currentTarget)
    }

    const handleLogoClick = (e) => {
        setAnchorLogo(e.currentTarget)
    }

    const handleClose = () => {
        setAnchorBanner(null)
        setAnchorThumbnail(null)
        setAnchorLogo(null)
    }


    const addBannerImageHandler = async (file):Promise<void> => {
        if(file?.length> 1){
           window.confirm('이미지 파일은 한 장만 업로드해주세요.');
           return;
        }
        if(file){
            if (file[0].size > 600000) {
                toast.error("이미지 파일은 600kB 이하여야합니다.");
                return;
            }
            file.forEach((banner) => {
                banner.preview = URL.createObjectURL(banner)
            })
            let fileName = uuidv4() + '.png';
            console.log('#### fileName : ', fileName)
            setData({...data, bannerImage: file, bannerImageUrl: fileName})
            console.log('#### data : ', data)
            data.bannerImageUrl = fileName;
            console.log('#### data.bannerImageUrl : ', data.bannerImageUrl)
        }else{
            setData({...data, bannerImage: [], bannerImageUrl: ''})
            console.log('$$$$$$$$$$$$$$$$$$$')
        }

    }

    const addThumbnailImageHandler = async (file):Promise<void> => {
        if(file?.length> 1){
            window.confirm('이미지 파일은 한 장만 업로드해주세요.');
            return;
        }
        if(file){
            if (file[0].size > 600000) {
                toast.error("이미지 파일은 600kB 이하여야합니다.");
                return;
            }
            file.forEach((thumnail) => {
                thumnail.preview = URL.createObjectURL(thumnail)
            })
            let fileName = uuidv4() + '.png';
            setData({...data, thumbnailImage: file, thumbnailImageUrl : fileName})
        }else{
            setData({...data, thumbnailImage: [], thumbnailImageUrl: ''})
        }
    }

    const addLogoImageHandler = async (file):Promise<void> => {
        if(file?.length> 1){
            window.confirm('이미지 파일은 한 장만 업로드해주세요.');
            return;
        }
        if(file){
            if (file[0].size > 600000) {
                toast.error("이미지 파일은 600kB 이하여야합니다.");
                return;
            }
            file.forEach((logo) => {
                logo.preview = URL.createObjectURL(logo)
            })
            let fileName = uuidv4() + '.png';
            setData({...data, logoImage: file, logoImageUrl: fileName})
        }else{
            setData({...data, logoImage: [], logoImageUrl: ''})
        }
    }

    
    const handlePostProduct = async () : Promise<void>  => {
        let response;
        if(!data.nameKo){
            toast.error('국문 브랜드명을 입력해주세요.');
            return;
        }
        if(!data.nameEn){
            toast.error('영문 브랜드명을 입력해주세요.');
            return;
        }
        if(data.keywords.length <= 1){
            toast.error('키워드를 2개 선택해주세요.');
            return;
        }
        if(data.keywords.length > 2 ){
            toast.error('키워드를 2개만 선택해주세요.');
            return;
        }
        if(!data.bannerImage){
            toast.error('배너 이미지를 업로드해주세요.');
            return;
        }
        if(!data.thumbnailImage){
            toast.error('썸네일 이미지를 업로드해주세요.');
            return;
        }
        if(!data.logoImage){
            toast.error('로고 이미지를 업로드해주세요.');
            return;
        }
        if(window.confirm('저장하시겠습니까?')){
            /*img pre-signed*/

            if(data.bannerImage) {
                let fileName = uuidv4() + '.png';
                const awsType = {type: 'BUCKET_URL_BRAND', fileName: fileName}
                data.bannerImageUrl = fileName;
                let result = await adminAwsApi.getPreSignedUrl(awsType, data.bannerImage[0]);
                console.log('banner result', result)
                // @ts-ignore
                if (result == 500) {
                    toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
                    return;
                }
            }

            if(data.thumbnailImage) {
                let fileName = uuidv4() + '.png';
                const awsType = {type: 'BUCKET_URL_BRAND', fileName: fileName}
                data.thumbnailImageUrl = fileName;
                let result = await adminAwsApi.getPreSignedUrl(awsType, data.thumbnailImage[0]);
                // @ts-ignore
                if (result == 500) {
                    toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
                    return;
                }
            }
            if(data.logoImage) {
                let fileName = uuidv4() + '.png';
                const awsType = {type: 'BUCKET_URL_BRAND', fileName: fileName}
                data.logoImageUrl = fileName;
                let result = await adminAwsApi.getPreSignedUrl(awsType, data.logoImage[0]);
                // @ts-ignore
                if (result == 500) {
                    toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
                    return;
                }
            }
            //total data
            response = await brandApi.postNewBrand(data);
            if(response == 201){
                toast.success('저장되었습니다');
                router.push('/brand-management/brand-total');
            }else if(response == 500){
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            }
        }

    }


    const handlePatchProduct = async (id) => {
        if(!data.nameKo){
            toast.error('국문 브랜드명을 입력해주세요.');
            return;
        }
        if(!data.nameEn){
            toast.error('영문 브랜드명을 입력해주세요.');
            return;
        }
        if(data.keywords.length <= 1 ){
            toast.error('키워드를 2개 선택해주세요.');
            return;
        }
        if(data.keywords.length > 2 ){
            toast.error('키워드를 2개만 선택해주세요.');
            return;
        }
        if(!data.bannerImageUrl){
            toast.error('배너 이미지를 업로드해주세요.');
            return;
        }
        if(!data.thumbnailImageUrl){
            toast.error('썸네일 이미지를 업로드해주세요.');
            return;
        }
        if(!data.logoImageUrl){
            toast.error('로고 이미지를 업로드해주세요.');
            return;
        }

        if(data.keywords[0].id){
            data.keywords = data.keywords.map((v) => v.id)
        }

        if(window.confirm('수정 저장하시겠습니까?')){
            console.log('#### data : ', data)
            if(data.bannerImage) {
                let fileName = uuidv4() + '.png';
                const awsType = {type: 'BUCKET_URL_BRAND', fileName: fileName}
                data.bannerImageUrl = fileName;
                await adminAwsApi.getPreSignedUrl(awsType, data.bannerImage[0]);
            }

            if(data.thumbnailImage) {
                let fileName = uuidv4() + '.png';
                const awsType = {type: 'BUCKET_URL_BRAND', fileName: fileName}
                data.thumbnailImageUrl = fileName;
                await adminAwsApi.getPreSignedUrl(awsType, data.thumbnailImage[0]);
            }
            if(data.logoImage) {
                let fileName = uuidv4() + '.png';
                const awsType = {type: 'BUCKET_URL_BRAND', fileName: fileName}
                data.logoImageUrl = fileName;
                await adminAwsApi.getPreSignedUrl(awsType, data.logoImage[0]);
            }

            console.log('!!! data : ', data)

            const result = await brandApi.putBrand(data, id);
            if(result.code == 200){
                toast.success('수정 저장되었습니다')
                console.log('responseeeeeeee', result.data.brandId)
            }else if(result.code == 500){
                toast.error('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.');
            }
        }

    }
    
    // @ts-ignore
    return (
        <Card>
            <Grid
                item
                sx={{mb: 3, display: 'flex', justifyContent: 'end'}}>
                {item?.id == null ? (
                    <Button
                        component="a"
                        startIcon={<SaveIcon fontSize="small"/>}
                        sx={{m: 1, mb: 2, mr: 4}}
                        variant="contained"
                        onClick={() => handlePostProduct()}
                    >
                        저장
                    </Button>
                ) : (<Button
                    component="a"
                    startIcon={<SaveIcon fontSize="small"/>}
                    sx={{m: 1}}
                    variant="contained"
                    onClick={ () => handlePatchProduct(data.id)}
                >
                    수정 저장
                </Button>)}
            </Grid>
            <PropertyList>
                <Stack direction={"row"}>
                    <PropertyListItem
                        align={align}
                        label="브랜드명(국문) *"
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                id='nameKo'
                                value={data?.nameKo}
                                placeholder={'국문 브랜드명을 입력하세요'}
                                onChange={handleNameChange('nameKo')}
                            />
                        </Typography>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="브랜드명(영문) *"
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                id='nameEn'
                                value={data?.nameEn}
                                placeholder={'영문 브랜드명을 입력하세요'}
                                onChange={handleNameChange('nameEn')}
                            />
                        </Typography>
                    </PropertyListItem>
                </Stack>
                <Stack direction={"row"}>
                    <PropertyListItem
                        align={align}
                        label="키워드 선택(2개 선택) *"
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
                                name="keyword"
                                onChange={handleChangeKeyword}
                                multiple={true}
                                sx={{
                                    m: 1,
                                    minWidth: 300,
                                    height: 40
                                }}
                                value={keywordFilter}
                                renderValue={(selected) => selected.join(',')}
                            >
                                {renderKeywords()}
                            </Select>
                        </Box>
                    </PropertyListItem>
                    <PropertyListItem align={align}
                                      label="진열상태 *" >
                        {data.activated ? '진열중' : '진열중지'}
                    </PropertyListItem>
                </Stack>
                <Stack sx={{mt: 3}}>
                    <PropertyListItem
                        align={align}
                        label="배너 *"
                    >
                        <Grid
                            item
                            xs={12}
                            lg={6}
                        >
                            <Box
                                sx={{border: 1, borderRadius: 1, borderColor: "#e5e5e5", height: 200, width: 350}}
                            >
                                <BrandImagePreview data={data}
                                                   image={data?.bannerImage}
                                                   imageUrl = {data?.bannerImageUrl}
                                                   open={bannerDialogOpen}
                                                   anchorEl={anchorBanner}
                                                   handleClose={handleClose}
                                                   addImageHandler={addBannerImageHandler}
                                />
                            </Box>
                            <Stack direction={'column'}
                                   justifyContent={"space-between"}
                                   sx={{mt: 2, mb: 3, ml: 8}}>
                                <Typography variant="subtitle2">
                                    이미지 사이즈 : 1115 x 315
                                </Typography>
                                <Button variant="outlined"
startIcon={<AddBoxRoundedIcon/>}
                                        onClick={handleBannerClick}
                                        sx={{mt: 2, width: 200,}}
                                >
                                    배너 업로드
                                </Button>

                            </Stack>
                        </Grid>

                    </PropertyListItem>
                </Stack>
                <Stack
                    direction='row'
                    sx={{mt: 3}}
                >
                    <PropertyListItem
                        align={align}
                        label="썸네일 *"
                    >

                        <Grid
                        >
                            <Box
                                sx={{border: 1, borderRadius: 1, borderColor: "#e5e5e5", width: 330}}
                            >
                                <BrandImagePreview data={data}
                                                   image={data?.thumbnailImage}
                                                   imageUrl={data?.thumbnailImageUrl}
                                                   open={thumbnailDialogOpen}
                                                   anchorEl={anchorThumbnail}
                                                   handleClose={handleClose}
                                                   addImageHandler={addThumbnailImageHandler}/>
                            </Box>
                            <Stack direction={'column'}
                                   display={"flex"}
                                   justifyContent={"center"}
                                   sx={{mt: 2, mb: 3, ml: 7}}>
                                <Typography variant="subtitle2">
                                    이미지 사이즈 : 222 x 222
                                </Typography>
                                <Button variant="outlined"
startIcon={<AddBoxRoundedIcon/>}
                                        onClick={handleThumbnailClick}
                                        sx={{width: 200, mt: 2,}}
                                >
                                    썸네일 업로드
                                </Button>

                            </Stack>
                        </Grid>

                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="로고 *"
                    >
                        <Grid
                        >
                            <Box
                                sx={{border: 1, borderRadius: 1, borderColor: "#e5e5e5", height: 200, width: 350}}
                                bgcolor="#CBCBCB"
                            >
                                <BrandImagePreview data={data}
                                                   image={data?.logoImage}
                                                   imageUrl={data?.logoImageUrl}
                                                   open={logoDialogOpen}
                                                   anchorEl={anchorLogo}
                                                   handleClose={handleClose}
                                                   addImageHandler={addLogoImageHandler}/>
                            </Box>
                            <Stack direction={'column'}
                                   justifyContent={"space-between"}
                                   sx={{mt: 2, mb: 3, ml: 10}}>
                                <Typography variant="subtitle2">
                                    이미지 사이즈 : 603 x 315
                                </Typography>
                                <Button variant="outlined"
startIcon={<AddBoxRoundedIcon/>}
                                        onClick={handleLogoClick}
                                        sx={{width: 180, mt: 2}}
                                >
                                    로고 업로드
                                </Button>
                            </Stack>

                        </Grid>
                    </PropertyListItem>
                </Stack>
            </PropertyList>
        </Card>
    )

}


export default BrandRegisterDetail;