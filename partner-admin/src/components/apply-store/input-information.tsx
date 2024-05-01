import {PropertyListItem} from "../property-list-item";
import {Box, Button, Stack, TextField, Theme, Typography, useMediaQuery} from "@mui/material";
import {ChangeEvent, FC, useState} from "react";
import toast from "react-hot-toast";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {ApplyStoreModels} from "../../types/apply-store-model";
import {applyStoreApi} from "../../api/apply-store-api";
import {useTranslation} from "react-i18next";

interface Props {
    applyStoreModel: ApplyStoreModels;
    setApplyStoreModel: any;
}

export const InputInformation: FC<Props> = ({applyStoreModel, setApplyStoreModel}) => {
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const {t} = useTranslation();

    const [correct, setCorrect] = useState(true);
    const [overlap, setOverlap] = useState(true);
    const [ment, setMent] = useState("");
    const [isPassword, setIsPassword] = useState(true);
    const [hide, setHide] = useState(true);
    let code = 200;

    const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
        let email = event.target.value;
        const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
        if(email == "" || !exptext.test(email)) {
            setCorrect(false);
        } else if(email !== "" && exptext.test(email)) {
            setCorrect(true);
            setApplyStoreModel({...applyStoreModel, userId: email})
        }
    }

    const handleOverlapCheck = async () => {
        // Api 호출 후 response 상태로 메세지 팝업
        await applyStoreApi.postIdOverlapCheck(applyStoreModel.userId
        ).then(res => {
            console.log(res);
            setMent(res.message);
        }).catch(err => {
            console.log(err);
            setMent(err.message);
        });
        setOverlap(!overlap);
        if (!overlap) {
            code = 500;
        }
        if (code !== 200) {
            setMent("이미 가입된 아이디입니다.")
        } else {
            setMent("사용 가능한 아이디입니다.")
        }
    }

    const handlePassword = (event: ChangeEvent<HTMLInputElement>): void => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{7,10}$/;
        const passwordCurrent = event.target.value;
        if (!passwordRegex.test(passwordCurrent)) {
            setIsPassword(false);
            setHide(false);
        } else {
            setIsPassword(true);
            setHide(false);
            setApplyStoreModel({...applyStoreModel, password: passwordCurrent})
        }
    }

    const handlePasswordCheck = (event: ChangeEvent<HTMLInputElement>): void => {
        setApplyStoreModel({...applyStoreModel, passwordCheck: event.target.value})
    }

    const handleManager = (prop: keyof ApplyStoreModels) => (event: ChangeEvent<HTMLInputElement>): void => {
        setApplyStoreModel({...applyStoreModel, [prop]: event.target.value});
    }

    const handleCertification = async () => {
        // 인증 Api 호출 후 메세지 팝업
        await applyStoreApi.postPhoneNumberCertification(applyStoreModel.managerPhoneNumber
        ).then(res => {
            console.log(res);
            if (res.status == 200) {
                setApplyStoreModel({...applyStoreModel, certificationNumber: res.data});
                toast.success('인증번호가 전송되었습니다.');
            }
        }).catch(err => {
            console.log(err);
            toast.error('인증번호 전송에 실패하였습니다.');
        })
        toast.success('인증번호가 전송되었습니다.')
    }

    const handleIsCertificate = (event: ChangeEvent<HTMLInputElement>): void => {
        // e.t.v === certificationNumber이면 인증메세지 팝업
        if (event.target.value === applyStoreModel.certificationNumber) {
            toast.success(`${t("component_applyStore_inputInformation_toast_certification")}`);
        }
    }

    return (
        <Box sx={{mt: 2, mb: 2}}>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputInformation_propertyListItem_id")}
            >
                <Stack direction='row'>
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            sx={{width: 300}}
                            id='id'
                            placeholder={t("component_applyStore_inputInformation_textField_inputId")}
                            onChange={handleChangeEmail}
                        />
                    </Typography>
                    <Button sx={{ml:3}} variant='contained' disabled={!correct} onClick={handleOverlapCheck}>
                        {t("component_applyStore_inputInformation_button_overlapCheck")}
                    </Button>
                    <Stack direction='column'>
                        {correct ?
                            null
                            :
                            <Typography sx={{ml: 2, mt: 2}} color='error'>
                                {t("component_applyStore_inputInformation_typography_emailValidation")}
                            </Typography>
                        }
                        {overlap ?
                            <Typography sx={{ml: 2, mt: 2}} hidden={!correct} color='error'>
                                {ment}
                            </Typography>
                            :
                            <Typography sx={{ml: 2, mt: 2}} color='primary'>
                                {ment}
                            </Typography>
                        }
                    </Stack>
                </Stack>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputInformation_propertyListItem_password")}
            >
                <Stack direction='row'>
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            sx={{width: 300}}
                            id='password'
                            placeholder={t("component_applyStore_inputInformation_textField_inputPassword")}
                            onChange={handlePassword}
                        />

                    </Typography>
                    {isPassword ?
                        <Box hidden={hide}>
                            <CheckIcon sx={{color: 'green', ml: 5, mt: 2}}/>
                        </Box>
                        :
                        <Box hidden={hide}>
                            <Stack direction='row'>
                                <CloseIcon sx={{color: 'red', ml: 5, mt: 2}}/>
                                <Typography sx={{ml: 2, mt: 2}} color='error'>
                                    {t("component_applyStore_inputInformation_typography_falsePassword")}
                                </Typography>
                            </Stack>
                        </Box>
                    }
                </Stack>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputInformation_propertyListItem_passwordCheck")}
            >
                <Stack direction='row'>
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            sx={{width: 300}}
                            id='checkPassword'
                            placeholder={t("component_applyStore_inputInformation_textField_inputPasswordCheck")}
                            onChange={handlePasswordCheck}
                        />
                    </Typography>
                    {applyStoreModel.password == applyStoreModel.passwordCheck && applyStoreModel.passwordCheck !== "" ?
                        <Box hidden={hide}>
                            <CheckIcon sx={{color: 'green', ml: 5, mt: 2}}/>
                        </Box>
                        :
                        <Box hidden={hide}>
                            <Stack direction='row'>
                                <CloseIcon sx={{color: 'red', ml: 5, mt: 2}}/>
                                <Typography sx={{ml: 2, mt: 2}} color='error'>
                                    {t("component_applyStore_inputInformation_typography_falsePasswordCheck")}
                                </Typography>
                            </Stack>
                        </Box>
                    }
                </Stack>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputInformation_propertyListItem_managerName")}
            >
                <Typography
                    color="primary"
                    variant="body2"
                >
                    <TextField
                        sx={{width: 300}}
                        id='name'
                        placeholder={t("component_applyStore_inputInformation_textField_inputManagerName")}
                        onChange={handleManager('managerName')}
                    />
                </Typography>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_inputInformation_propertyListItem_managerPhoneNumber")}
            >
                <Stack direction='row'>
                    <Typography
                        color="primary"
                        variant="body2"
                    >
                        <TextField
                            sx={{width: 300}}
                            id='phone'
                            placeholder={t("component_applyStore_inputInformation_textField_inputManagerPhoneNumber")}
                            onChange={handleManager('managerPhoneNumber')}
                        />
                    </Typography>
                    <Button
                        sx={{ml: 3}}
                        variant='contained'
                        onClick={handleCertification}>
                        {t("component_applyStore_inputInformation_button_managerPhoneNumberCertificate")}
                    </Button>
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
                        id='certification'
                        type='number'
                        placeholder={t("component_applyStore_inputInformation_textField_inputManagerPhoneNumberCertificate")}
                        onChange={handleIsCertificate}
                    />
                </Typography>
            </PropertyListItem>
        </Box>
    );
};