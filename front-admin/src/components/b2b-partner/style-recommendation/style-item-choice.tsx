import React, {useContext, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem,
    Select,
    Stack,
    Theme,
    useMediaQuery
} from "@mui/material";
import StyleImageBox from "./style-image-box";
import StyleProduct from "./style-product";
import {ProductModel} from "../../../types/product-model";
import _ from "lodash";
import {DataContext} from "../../../contexts/data-context";
import {PropertyListItem} from "../../property-list-item";
import toast from "react-hot-toast";

const BrandDialog = (props) => {
    const {onClose, open, ...other} = props;
    const [lists, setLists] = useState('');
    const dataContext = useContext(DataContext);

    const handleCancel = () => {
        onClose();
    };

    const handleApply = () => {
        onClose(lists);
    };

    const changeBrandNameHandler = (changeValues) => {
        setLists(changeValues)
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {minWidth: 200, maxHeight: 700}}}
            maxWidth="xl"
            open={open}
            {...other}
        >
            <DialogTitle>Brand</DialogTitle>
            <DialogContent dividers>
                <Stack direction={'row'}>
                    <Stack justifyContent={"center"}
                           sx={{mr: 1, mt:1}}>
                        <FormLabel component="legend">브랜드</FormLabel>
                    </Stack>
                    <Select
                        size={"small"}
                        value={lists}
                        onChange={e=> {changeBrandNameHandler(e.target.value)}}
                    >
                        <MenuItem value={''}>전체</MenuItem>
                        {_.sortBy(dataContext.BRAND, 'name').map((brand, index) => {
                            return (
                                <MenuItem key={index}
                                          value={brand.id}>{brand.name}</MenuItem>
                            )
                        })}
                    </Select>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button autoFocus
                        color="success"
                        disabled={lists == ''}
                        onClick={handleApply}>
                    적용
                </Button>
                <Button onClick={handleCancel}>
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const ProductDialog = (props) => {
    const {brand, header, gender, items, onClose, open, categoryId = null, ...other} = props;
    const [lists, setLists] = useState<ProductModel[]>([]);

    const handleCancel = () => {
        onClose();
    };

    const handleApply = () => {
        if(lists.length > 1) {
            toast.error('아이템은 1개만 선택해주세요.')
        } else {
            onClose(lists);
        }
    };

    const changeSelectedList = (lists) => {
        setLists(lists);
    }

    return (
        <Dialog
            sx={{'& .MuiDialog-paper': {maxHeight: 700}}}
            maxWidth="xl"
            fullWidth={true}
            open={open}
            {...other}
        >
            <DialogTitle>{header}</DialogTitle>
            <DialogContent dividers>
                <StyleProduct onClickApply={handleApply}
                         changeSelectedList={changeSelectedList}
                         categoryId={categoryId}
                         brand={brand}
                              gender={gender} />
            </DialogContent>
            <DialogActions>
                {/*<StyleProductSelect lists={lists}*/}
                {/*               clickApply={handleApply}></StyleProductSelect>*/}
                <Button autoFocus
                        color="success"
                        disabled={lists.length == 0}
                        onClick={handleApply}>
                    적용
                </Button>
                <Button onClick={handleCancel}>
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const StyleItemChoice = (props) => {
    const {brand, setBrand, itemStyle, setItemStyle, gender, setGender, style, addStyleItem, deleteStyleImage, styleRecommend, setStyleRecommend} = props;
    const [open, setOpen] = React.useState(false);
    const [openBrand, setOpenBrand] = React.useState(false);
    const [categoryId, setCategoryId] = React.useState(null);
    const [prodHeader, setProdHeader] = React.useState("");
    const top = ["TOP(IN)", "TOP(OUT)"];
    const outer = ["OUTER(IN)", "OUTER(OUT)"];
    const dataContext = useContext(DataContext);
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    const openProductHandler = (category, header) => {
        setCategoryId(category);
        setOpen(true);
        setProdHeader(header);
        // setOpenBrand(true);
    }

    const handleClose = (items) => {
        if (items) {
            console.log('product', items);
            addStyleItem(items);
        }
        setOpen(false);
    };

    const handleBrandClose = (items) => {
        if (items) {
            console.log('brand', items);
            setBrand(items);
            setOpenBrand(false);
            setOpen(true);
        } else {
            setOpenBrand(false);
        }
    };

    const changeSeason = (value: string, checked: boolean): void => {
        let season = []
        if (styleRecommend.seasonTypes) {
            season = styleRecommend.seasonTypes.split(',');
        }
        if (checked) {
            season.push(value);
        } else {
            _.remove(season, (data) => {
                return data == value;
            });
        }
        setStyleRecommend(prevData => ({
            ...prevData,
            seasonTypes: season.join(','),
            loaded: true
        }))
    }

    const checkedSeason = (season) => {
        if (styleRecommend.seasonTypes) {
            let seasonTemp = styleRecommend.seasonTypes.split(',');
            return seasonTemp.includes(season)
        }
        return false;
    }

    const renderCheckBox = () => {
        return Object.keys(dataContext.PRODUCT_SEASON_TYPE).map((key, idx) => {
            return (
                <>
                    <FormControlLabel
                        key={idx}
                        value={key}
                        label={key}
                        control={<Checkbox
                            onChange={e => {
                                changeSeason(e.target.defaultValue, e.target.checked)
                            }}
                            checked={checkedSeason(key)}
                        />}
                    />
                </>)
        })
    }

    const handleGenderChange = (g) => {
        setGender(g);
    }

    const handleStyleChange = (g) => {
        setItemStyle(g);
        if(g == "D") {
            setStyleRecommend({...styleRecommend, registerType: 'Daily'});
        } else if(g == "S") {
            setStyleRecommend({...styleRecommend, registerType: 'Suit'})
        }
    }

    return (
        <Box sx={{p: 1}}>
            <Box sx={{
                alignItems: 'center',
                display: 'flex',
                pb: 1
            }}>
                <Stack direction={'column'}>
                    <PropertyListItem
                        align={align}
                        label="1. 성별 입력"
                    >
                        <Stack direction="row">
                            <Button size={'small'}
                                    variant={gender == 'M' ? 'contained' : 'outlined'}
                                    color={'info'}
                                    sx={{mt: -1, height: 40}}
                                    onClick={() => handleGenderChange('M')}
                            >남성</Button>
                            <Button size={'small'}
                                    variant={gender == 'F' ? 'contained' : 'outlined'}
                                    color={'warning'}
                                    sx={{ml: 2, mt: -1, height: 40}}
                                    onClick={() => handleGenderChange('F')}
                            >여성</Button>
                        </Stack>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="2. 시즌 입력"
                    >
                        <Stack direction="row"
                               justifyContent={"space-between"}>
                            {renderCheckBox()}
                        </Stack>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label="3. 필수 입력 상품"
                    >
                    </PropertyListItem>
                </Stack>
            </Box>
            {gender == 'M' ?
                <Stack direction="row">
                    <Button size={'small'}
                            variant={itemStyle == 'D' ? 'contained' : 'outlined'}
                            color={'primary'}
                            sx={{mt: -1, height: 40, width: 110}}
                            onClick={() => handleStyleChange('D')}
                    >Daily Style</Button>
                    <Button size={'small'}
                            variant={itemStyle == 'S' ? 'contained' : 'outlined'}
                            color={'secondary'}
                            sx={{mt: -1, height: 40, width: 110}}
                            onClick={() => handleStyleChange('S')}
                    >Suit Style</Button>
                </Stack>
                :
                ''
            }
            <Box border={1}
borderRadius={1}
sx={{mb: 2}}>
                {itemStyle == 'D' ?
                    <Grid
                        container
                        spacing={1}
                        sx={{
                            pt: 2, pb: 2
                        }}
                    >
                        {gender == 'F' ?
                            <Grid
                                item
                                md={2.3}
                                xs={12}
                            >
                                <StyleImageBox
                                    gender={gender}
                                    header={'DRESS'}
                                    category={style.dress}
                                    addStyleImage={addStyleItem}
                                    deleteStyleImage={deleteStyleImage}
                                    productHandler={openProductHandler}
                                />
                            </Grid>
                            :
                            ''
                        }
                        {top.map((v) => {
                            return (
                                <>
                                    <Grid
                                        item
                                        md={2.3}
                                        xs={12}
                                    >
                                        <StyleImageBox
                                            gender={gender}
                                            header={v}
                                            category={style.top}
                                            addStyleImage={addStyleItem}
                                            deleteStyleImage={deleteStyleImage}
                                            productHandler={openProductHandler}
                                        />
                                    </Grid>
                                </>
                            )})
                        }
                        <Grid
                            item
                            md={2.3}
                            xs={12}
                        >
                            <StyleImageBox
                                gender={gender}
                                header={'BOTTOM'}
                                category={style.bottom}
                                addStyleImage={addStyleItem}
                                deleteStyleImage={deleteStyleImage}
                                productHandler={openProductHandler}
                            />
                        </Grid>
                        <Grid
                            item
                            md={2.3}
                            xs={12}
                        >
                            <StyleImageBox
                                gender={gender}
                                header={'SHOES'}
                                category={style.shoes}
                                addStyleImage={addStyleItem}
                                deleteStyleImage={deleteStyleImage}
                                productHandler={openProductHandler}
                            />
                        </Grid>
                    </Grid>
                    :
                    <Grid
                        container
                        spacing={1}
                        sx={{
                            pt: 2, pb: 2
                        }}
                    >
                        <Grid
                            item
                            md={2.3}
                            xs={12}
                        >
                            <StyleImageBox
                                gender={gender}
                                header={'DRESSSHIRT'}
                                category={style.dressshirt}
                                addStyleImage={addStyleItem}
                                deleteStyleImage={deleteStyleImage}
                                productHandler={openProductHandler}
                            />
                        </Grid>
                        <Grid
                            item
                            md={2.3}
                            xs={12}
                        >
                            <StyleImageBox
                                gender={gender}
                                header={'SUITPANTS'}
                                category={style.suitpants}
                                addStyleImage={addStyleItem}
                                deleteStyleImage={deleteStyleImage}
                                productHandler={openProductHandler}
                            />
                        </Grid>
                        <Grid
                            item
                            md={2.3}
                            xs={12}
                        >
                            <StyleImageBox
                                gender={gender}
                                header={'SHOES'}
                                category={style.shoes}
                                addStyleImage={addStyleItem}
                                deleteStyleImage={deleteStyleImage}
                                productHandler={openProductHandler}
                            />
                        </Grid>
                    </Grid>
                }
            </Box>
            <Divider />
            <PropertyListItem
                align={align}
                label="4. 선택 입력 상품"
            >
            </PropertyListItem>
            <Grid container
                  spacing={1}
                  sx={{
                      pt: 2
                  }}>
                {itemStyle == 'S' ?
                    <>
                        <Grid
                            item
                            md={2.3}
                            xs={12}
                        >
                            <StyleImageBox
                                gender={gender}
                                header={'SUITJACKET'}
                                category={style.suitjacket}
                                addStyleImage={addStyleItem}
                                deleteStyleImage={deleteStyleImage}
                                productHandler={openProductHandler}
                            />
                        </Grid>
                        <Grid
                            item
                            md={2.3}
                            xs={12}
                            >
                            <StyleImageBox
                                gender={gender}
                                header={'SUITVEST'}
                                category={style.suitvest}
                                addStyleImage={addStyleItem}
                                deleteStyleImage={deleteStyleImage}
                                productHandler={openProductHandler}
                            />
                        </Grid>
                    </>
                    : ''
                }
                {outer.map((v) => {
                    return (
                        <>
                            <Grid
                                item
                                md={2.3}
                                xs={12}
                            >
                                <StyleImageBox
                                    gender={gender}
                                    header={v}
                                    category={style.outer}
                                    addStyleImage={addStyleItem}
                                    deleteStyleImage={deleteStyleImage}
                                    productHandler={openProductHandler}
                                />
                            </Grid>
                        </>
                    )})
                }
                <Grid
                    item
                    md={2.3}
                    xs={12}
                >
                    <StyleImageBox
                        gender={gender}
                        header={'BAG'}
                        category={style.bag}
                        addStyleImage={addStyleItem}
                        deleteStyleImage={deleteStyleImage}
                        productHandler={openProductHandler}
                    />
                </Grid>
                <Grid
                    item
                    md={2.3}
                    xs={12}
                >
                    <StyleImageBox
                        gender={gender}
                        header={'HAT'}
                        category={style.hat}
                        addStyleImage={addStyleItem}
                        deleteStyleImage={deleteStyleImage}
                        productHandler={openProductHandler}
                    />
                </Grid>
                <Grid
                    item
                    md={2.3}
                    xs={12}
                >
                    <StyleImageBox
                        gender={gender}
                        header={'GLASSES'}
                        category={style.glasses}
                        addStyleImage={addStyleItem}
                        deleteStyleImage={deleteStyleImage}
                        productHandler={openProductHandler}
                    />
                </Grid>
                <Grid
                    item
                    md={2.3}
                    xs={12}
                >
                    <StyleImageBox
                        gender={gender}
                        header={'SOCKS'}
                        category={style.socks}
                        addStyleImage={addStyleItem}
                        deleteStyleImage={deleteStyleImage}
                        productHandler={openProductHandler}
                    />
                </Grid>
                <Grid
                    item
                    md={2.3}
                    xs={12}
                >
                    <StyleImageBox
                        gender={gender}
                        header={'SCARF'}
                        category={style.scarf}
                        addStyleImage={addStyleItem}
                        deleteStyleImage={deleteStyleImage}
                        productHandler={openProductHandler}
                    />
                </Grid>
                {gender == 'M' ?
                    <Grid
                        item
                        md={2.3}
                        xs={12}
                    >
                        <StyleImageBox
                            gender={gender}
                            header={'TIE'}
                            category={style.tie}
                            addStyleImage={addStyleItem}
                            deleteStyleImage={deleteStyleImage}
                            productHandler={openProductHandler}
                        />
                    </Grid>
                    :
                    ''
                }
                <Grid
                    item
                    md={2.3}
                    xs={12}
                >
                    <StyleImageBox
                        gender={gender}
                        header={'MUFFLER'}
                        category={style.muffler}
                        addStyleImage={addStyleItem}
                        deleteStyleImage={deleteStyleImage}
                        productHandler={openProductHandler}
                    />
                </Grid>
                {gender == 'M' ?
                    <Grid
                        item
                        md={2.3}
                        xs={12}
                    >
                        <StyleImageBox
                            gender={gender}
                            header={'ETC'}
                            category={style.etc}
                            addStyleImage={addStyleItem}
                            deleteStyleImage={deleteStyleImage}
                            productHandler={openProductHandler}
                        />
                    </Grid>
                    :
                    ''
                }
            </Grid>
            <BrandDialog
                open={openBrand}
                onClose={handleBrandClose}
            />
            <ProductDialog
                open={open}
                onClose={handleClose}
                brand={brand}
                header={prodHeader}
                gender={gender}
                categoryId={categoryId}
            />
        </Box>
    )
};

export default StyleItemChoice;