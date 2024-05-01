import {PropertyListItem} from "../property-list-item";
import LaunchIcon from '@mui/icons-material/Launch';
import {Box, Button, IconButton, Menu, Stack, TextField, Theme, Typography, useMediaQuery} from "@mui/material";
import {ChangeEvent, FC, useEffect, useState} from "react";
import {ImageInFormWidget} from "../widgets/image-widget";
import {X as XIcon} from "../../icons/x";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import Dropzone from "../dropzone";
import {ApplyStoreModels, Business} from "../../types/apply-store-model";
import {AddressDialog} from "../dialog/address-dialog";
import {useTranslation} from "react-i18next";

const ImageUploadBox = (props) => {

    const {header, item, addFileImage} = props;

    let [files, setFiles] = useState<any[]>(item);
    const [visible, setVisible] = useState(true)
    const [image, setImage] = useState<string>(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        setFiles(item);
    }, [])

    const handleDrop = (newFiles: any): void => {
        newFiles.forEach((file) => {
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

    const handleImageClick = (imageItem) => {
        setImage(imageItem.preview);
    }

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
                        accept=".jpg"
                        files={files}
                        onDrop={handleDrop}
                        maxFiles={1}
                    />
                </Box>
            </Menu>
            <Box>
                {files.map((file) => (
                    <Box sx={{p: 1}}
                         key={file.key}
                         style={{position: 'relative'}}>
                        <ImageInFormWidget
                            imageUrl={`${file.preview}`}
                            onClick={() => handleImageClick(file)}
                        />
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

const BusinessComponent = (props) => {
    const {t} = useTranslation();
    const {index, applyStoreModel, setApplyStoreModel} = props;
    const [businessItem, setBusinessItem] = useState<Business>(applyStoreModel.business[index]);

    const handleBusiness = (prop: keyof Business) => (event: ChangeEvent<HTMLInputElement>): void => {
        const newB = applyStoreModel.business;
        businessItem[prop] = event.target.value;
        newB[index] = businessItem;
        setApplyStoreModel({...applyStoreModel, business: newB});
    }

    return (
        <Stack direction='row'>
            <Typography
                color="primary"
                variant="body2"
                sx={{mb: 2}}
            >
                <TextField
                    sx={{width: 200}}
                    id='businessStatus'
                    placeholder={t("component_applyStore_inputCompanyInformation_textField_businessStatus")}
                    value={applyStoreModel.business[index].businessStatus || ""}
                    onChange={handleBusiness('businessStatus')}
                />
                <TextField
                    sx={{width: 200, ml: 2}}
                    id='businessEvent'
                    placeholder={t("component_applyStore_inputCompanyInformation_textField_businessEvent")}
                    value={applyStoreModel.business[index].businessEvent || ""}
                    onChange={handleBusiness('businessEvent')}
                />
            </Typography>
        </Stack>
    )
}

interface Props {
    applyStoreModel: ApplyStoreModels;
    setApplyStoreModel: any;
}

export const InputCompanyInformation: FC<Props> = ({applyStoreModel, setApplyStoreModel}) => {
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const {t} = useTranslation();

    const handleChangeUrl = () => {
        const CompanyUrl = (document.getElementById('companyUrl') as HTMLInputElement).value;
        return window.open(CompanyUrl, '_blank')
    };

    const [openPostcode, setOpenPostcode] = useState<boolean>(false);

    const handleClickAddress = () => {
        setOpenPostcode(current => !current);
    }

    const handleCloseAddress = (data) => {
        setApplyStoreModel({...applyStoreModel, companyAddress: data});
        setOpenPostcode(false);
    }

    const handleChange = (prop: keyof ApplyStoreModels) => (event: ChangeEvent<HTMLInputElement>): void => {
        setApplyStoreModel({...applyStoreModel, [prop]: event.target.value});
    }

    const handlePlusInput = () => {
        const addInput = [{businessStatus: "", businessEvent: ""}];
        let newInput = [...applyStoreModel.business, ...addInput];
        setApplyStoreModel(prevData => ({...prevData, business: newInput}))
    }

    const handleAddressChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setApplyStoreModel({...applyStoreModel, companyDetailAddress: event.target.value});
    }

    const addBusinessRegistration = (imageFile) => {
        imageFile.forEach((file, index) => {
            file.key = `key${index}`;
        })
        setApplyStoreModel({...applyStoreModel, businessRegistration: imageFile})
    }

    const addMailOrderBusinessCertificate = (imageFile) => {
        imageFile.forEach((file, index) => {
            file.key = `key${index}`;
        })
        setApplyStoreModel({...applyStoreModel, mailOrderBusinessCertificate: imageFile})
    }

    const handleChangeCompanyUrl = (event: ChangeEvent<HTMLInputElement>): void => {
        setApplyStoreModel({...applyStoreModel, companyUrl: event.target.value});
    }

    const onDelete = () =>{
        if(applyStoreModel.business.length > 1) {
            const deleteInput = [...applyStoreModel.business]
            deleteInput.splice(applyStoreModel.business.length - 1, 1)
            setApplyStoreModel({...applyStoreModel, business: deleteInput});
        }
    }

    return (
        <Box sx={{mt: 2, mb: 2}}>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputCompanyInformation_propertyListItem_registrationNumber")}
            >
                <Typography
                    color="primary"
                    variant="body2"
                >
                    <TextField
                        sx={{width: 300}}
                        id='registrationNumber'
                        placeholder={t("component_applyStore_inputCompanyInformation_textField_inputRegistrationNumber")}
                        onChange={handleChange('companyRegistrationNumber')}
                    />
                </Typography>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputCompanyInformation_propertyListItem_companyName")}
            >
                <Typography
                    color="primary"
                    variant="body2"
                >
                    <TextField
                        sx={{width: 300}}
                        id='companyName'
                        placeholder={t("component_applyStore_inputCompanyInformation_textField_inputCompanyName")}
                        onChange={handleChange('companyName')}
                    />
                </Typography>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputCompanyInformation_propertyListItem_representativeName")}
            >
                <Typography
                    color="primary"
                    variant="body2"
                >
                    <TextField
                        sx={{width: 300}}
                        id='representativeName'
                        placeholder={t("component_applyStore_inputCompanyInformation_textField_inputRepresentativeName")}
                        onChange={handleChange('representativeName')}
                    />
                </Typography>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputCompanyInformation_propertyListItem_statusAndEvent")}
            >
                {applyStoreModel.business.map((value, index) => {
                    return (
                        <BusinessComponent
                            key={`key${index}`}
                            index={index}
                            applyStoreModel={applyStoreModel}
                            setApplyStoreModel={setApplyStoreModel} />
                    )
                })}
                <Stack sx={{display: 'flex', justifyContent: 'space-between'}} direction='row'>
                    <Box>
                        <Button sx={{mb: 2}} onClick={handlePlusInput}>
                            {t("component_applyStore_inputCompanyInformation_button_inputPlus")}
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
                </Stack>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputCompanyInformation_propertyListItem_address")}
            >
                <Stack direction='row'>
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            sx={{width: 300}}
                            id='address'
                            placeholder={t("component_applyStore_inputCompanyInformation_textField_inputAddress")}
                            value={applyStoreModel.companyAddress}
                            disabled={true}
                        />
                    </Typography>
                    <Stack direction='column'>
                        <Button sx={{ml: 3}} variant='contained' onClick={handleClickAddress}>
                            {t("component_applyStore_inputCompanyInformation_button_searchAddress")}
                        </Button>
                    </Stack>
                </Stack>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label=""
            >
                <Typography
                    color="primary"
                    variant="body2"
                >
                    <TextField
                        sx={{width: 300}}
                        id='specificAddress'
                        placeholder={t("component_applyStore_inputCompanyInformation_textField_inputDetailAddress")}
                        onChange={handleAddressChange}
                    />
                </Typography>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputCompanyInformation_propertyListItem_businessRegistration")}
            >
                <ImageUploadBox
                    target={'Image'}
                    header={t("component_applyStore_inputCompanyInformation_imageUploadBox_inputBusinessRegistration")}
                    item={applyStoreModel.businessRegistration}
                    addFileImage={addBusinessRegistration}
                />
                {t("component_applyStore_inputCompanyInformation_textField_fileForm")}
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label=""
            >
                <ImageUploadBox
                    target={'Image'}
                    header={t("component_applyStore_inputCompanyInformation_imageUploadBox_mailOrderBusinessCertificate")}
                    item={applyStoreModel.mailOrderBusinessCertificate}
                    addFileImage={addMailOrderBusinessCertificate}
                />
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputCompanyInformation_propertyListItem_companyUrl")}
            >
                <Stack
                    direction='row'
                >
                    <TextField
                        sx={{width: 300}}
                        id='companyUrl'
                        placeholder={t("component_applyStore_inputCompanyInformation_textField_inputCompanyUrl")}
                        value={applyStoreModel.companyUrl || `${t("component_applyStore_inputCompanyInformation_textField_companyUrlValue")}`}
                        onChange={handleChangeCompanyUrl}
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
            <AddressDialog
                onClose={handleCloseAddress}
                open={openPostcode}
            />
        </Box>
    );
};