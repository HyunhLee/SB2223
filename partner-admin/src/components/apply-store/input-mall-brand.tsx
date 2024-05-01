import {PropertyListItem} from "../property-list-item";
import {Box, Button, Card, IconButton, Menu, Stack, TextField, Theme, Typography, useMediaQuery} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import {ChangeEvent, FC, useEffect, useState} from "react";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../dropzone";
import {X as XIcon} from "../../icons/x";
import {ApplyStoreModels, Brand} from "../../types/apply-store-model";
import {useTranslation} from "react-i18next";

const ImageUploadBox = (props) => {

    const {header, item, addFileImage} = props;

    let [files, setFiles] = useState<any[]>(item);
    const [visible, setVisible] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        setFiles(item);
    }, [])

    const handleDrop = (newFiles: any): void => {
        console.log(newFiles)
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

    const onDelete = (file) => {
        const newfile = [...files]
        newfile.splice(newfile.indexOf(file), 1)
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
                        accept=".pdf,.jpg"
                        files={files}
                        onDrop={handleDrop}
                        maxFiles={1}
                    />
                </Box>
            </Menu>
            <Box>
                {files.map((file, index) => (
                    <Box sx={{p: 1}}
                         key={file.key}
                         style={{position: 'relative'}}>
                        <Typography>
                            {file.name}
                        </Typography>
                        <div style={{position: 'absolute', right: 15, top: 10}}>
                            <IconButton
                                edge="end"
                                onClick={() => onDelete(file)}
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

const CardComponent = (props) => {
    const {t} = useTranslation();
    const {index, applyStoreModel, setApplyStoreModel} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    const [brandItem, setBrandItem] = useState<Brand>(applyStoreModel.brand[index]);

    const handleChangeUrl = () => {
        const ShopUrl = (document.getElementById('shopUrl') as HTMLInputElement).value;
        return window.open(ShopUrl, '_blank')
    };

    const handleBrandInfoChange = (prop: keyof Brand) => (event: ChangeEvent<HTMLInputElement>): void => {
        const newB = applyStoreModel.brand;
        if(prop !== 'brandIntroduction') {
            brandItem[prop] = event.target.value;
        }
        newB[index] = brandItem;
        setApplyStoreModel({...applyStoreModel, brand: newB});
    }

    const addBrandIntroduce = (imageFile) => {
        imageFile.forEach((file, idx) => {
            file.key = `key${idx}`;
        })
        const newB = applyStoreModel.brand;
        brandItem['brandIntroduction'] = imageFile;
        newB[index] = brandItem;
        setApplyStoreModel({...applyStoreModel, brand: newB});
    }

    return (
        <Card sx={{border: 1, mt: 2, mb: 2}}>
            <Box>
                <Stack direction="row">
                    <PropertyListItem
                        align={align}
                        label={t("component_applyStore_inputMallBrand_propertyListItem_brandNameKo")}
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                sx={{width: 300}}
                                id='brandNameKo'
                                placeholder={t("component_applyStore_inputMallBrand_textField_inputBrandNameKo")}
                                value={applyStoreModel.brand[index].brandNameKo || ""}
                                onChange={handleBrandInfoChange('brandNameKo')}
                            />
                        </Typography>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        label={t("component_applyStore_inputMallBrand_propertyListItem_brandNameEn")}
                    >
                        <Typography
                            color="primary"
                            variant="body2"
                        >
                            <TextField
                                sx={{width: 300}}
                                id='brandNameEn'
                                placeholder={t("component_applyStore_inputMallBrand_textField_inputBrandNameEn")}
                                value={applyStoreModel.brand[index].brandNameEn || ""}
                                onChange={handleBrandInfoChange('brandNameEn')}
                            />
                        </Typography>
                    </PropertyListItem>
                </Stack>
                <PropertyListItem
                    align={align}
                    label={t("component_applyStore_inputMallBrand_propertyListItem_brandShopUrl")}
                >
                    <Stack
                        direction='row'
                    >
                        <TextField
                            sx={{width: 300}}
                            id='shopUrl'
                            placeholder={t("component_applyStore_inputMallBrand_textField_inputBrandShopUrl")}
                            value={applyStoreModel.brand.brandShopUrl || `${t("component_applyStore_inputMallBrand_textField_brandShopUrlValue")}`}
                            onChange={handleBrandInfoChange('brandShopUrl')}
                        />
                        <IconButton color="primary"
                                    component="span"
                                    sx={{mr: 0.7, p: 0.3, fontSize: 12}}
                                    onClick={handleChangeUrl}
                        >
                            <LaunchIcon/>
                        </IconButton>
                    </Stack>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={t("component_applyStore_inputMallBrand_propertyListItem_brandIntro")}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            id='brandIntro'
                            fullWidth
                            multiline
                            rows={4}
                            placeholder={t("component_applyStore_inputMallBrand_textField_inputBrandIntro")}
                            value={applyStoreModel.brand[index].brandIntroduce || ""}
                            onChange={handleBrandInfoChange('brandIntroduce')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label=""
                >
                    <ImageUploadBox
                        target={'Image'}
                        header={t("component_applyStore_inputMallBrand_imageUploadBox_inputBrandIntroduction")}
                        item={applyStoreModel.brand[0].brandIntroduction}
                        addFileImage={addBrandIntroduce}
                    />
                    {t("component_applyStore_inputMallBrand_textField_fileForm")}
                </PropertyListItem>
            </Box>
        </Card>
    );
};

interface Props {
    applyStoreModel: ApplyStoreModels;
    setApplyStoreModel: any;
}

export const InputMallBrand: FC<Props> = ({applyStoreModel, setApplyStoreModel}) => {
    const {t} = useTranslation();

    const handleBrandPlus = () => {
        const addBrand = [{
            brandNameKo: "",
            brandNameEn: "",
            brandShopUrl: "",
            brandIntroduce: "",
            brandIntroduction: []
        }];
        let newBrand = [...applyStoreModel.brand, ...addBrand];
        setApplyStoreModel(prevData => ({...prevData, brand: newBrand}))
    };

    const onDelete = () => {
        if (applyStoreModel.brand.length > 1) {
            const deleteBrand = [...applyStoreModel.brand]
            deleteBrand.splice(applyStoreModel.brand.length - 1, 1)
            setApplyStoreModel({...applyStoreModel, brand: deleteBrand});
        }
    }

    return (
        <Box sx={{mt: 3, mb: 2}}>
            <TextField
                id="standard-multiline-static"
                sx={{width: 1000}}
                label={t("component_applyStore_inputMallBrand_textField_label")}
                multiline
                rows={6}
                defaultValue={t("component_applyStore_inputMallBrand_textField_value")}
                variant="standard"
                disabled={true}
            />
            {applyStoreModel.brand.map((value, index) => {
                return (
                    <CardComponent key={`key${index}`}
                                   index={index}
                                   applyStoreModel={applyStoreModel}
                                   setApplyStoreModel={setApplyStoreModel}/>
                )
            })}
            <Box sx={{display: 'flex', justifyContent: "space-between"}}>
                <Box>
                    <Button onClick={handleBrandPlus}>
                        {t("component_applyStore_inputMallBrand_button_brandPlus")}
                    </Button>
                </Box>
                <Box>
                    <IconButton
                        edge="end"
                        onClick={() => onDelete()}
                    >
                        <XIcon fontSize="small"/>
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};