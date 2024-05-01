import {useState} from 'react';
import {
    Box, FormControl, Button, Card, OutlinedInput,
    CardActions, InputAdornment, IconButton, Dialog, DialogActions,
    DialogContent, DialogTitle, Stack, TextField, useMediaQuery, Typography
} from '@mui/material';
import type {Theme} from '@mui/material';
import {PropertyList} from '../property-list';
import {PropertyListItem} from '../property-list-item';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {strCheck} from "../../utils/data-convert";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {mypageApi} from "../../api/mypage-api";
import {useTranslation} from 'react-i18next';

const MobileChangeDialog = (props) => {
    const {open, onClose, data} = props;
    const {i18n, t} = useTranslation();
    const [mobile, setMobile] = useState('');
    const [authBtn, setAuthBtn] = useState(false);
    const [authNum, setAuthNum] = useState<number>();
    const [errMobileNum, setErrMobileNum] = useState('');
    const [errAuthNum, setErrAuthNum] = useState('');


    const handleCancelBtn = () => {
        onClose();
        setMobile('');
        setAuthBtn(false);
        setAuthNum(null);
        setErrMobileNum('');
    }

    const handleAuthenticationBtn = () => {
        //넘버 받는 형식에 따라서 validation 걸어줘야함
        let test = strCheck(mobile, 'mobile');
        if (!test) {
            setErrMobileNum(`${t('component_myPage_accountDetail_error_invalidMobileNumber')}`);
            return;
        }
        if (mobile == data) {
            setErrMobileNum(`${t('component_myPage_accountDetail_error_confirmMobileNumber')}`);
            return;
        }
        if (mobile.length == 0) {
            setErrMobileNum(`${t('component_myPage_accountDetail_error_putMobileNumber')}`);
            return;
        }
        setAuthBtn(true);
        //api 연결할 곳 - 인증번호 발송을 위한? 그냥 번호만 넘기면 되나요?...
        setErrMobileNum('');
        window.confirm(`${t('component_myPage_accountDetail_confirm_sendAuthenticationNumber')}`);
        console.log('confirm', mobile);

    }

    const handleAuthNum = (e) => {
        setAuthNum(e.target.value)
        //인증번호가 일치하지 않을 때
        // if(e.target.value){
        //     window.confirm('인증번호가 일치하기 않습니다. 인증 번호를 확인해주세요.')
        // }
    }

    const handleSaveBtn = () => {
        if (!authBtn) {
            window.confirm(`${t('component_myPage_accountDetail_confirm_clickAuthenticationButton')}`);
            return;
        }
        if (mobile.length == 0) {
            setErrAuthNum(`${t('component_myPage_accountDetail_error_putMobileNumber')}`);
            return;
        }

        if (authNum == null) {
            setErrAuthNum(`${t('component_myPage_accountDetail_error_putAuthenticationNumber')}`);
            return;
        }

        if (authNum == 1111) {
            setErrAuthNum(`${t('component_myPage_accountDetail_error_invalidAuthenticationNumber')}`);
            return;
        }
        setErrAuthNum('')
        //api 연결할 곳 - 새로운 휴대폰 번호 서버로 보내기
        let result = mypageApi.postNewPassword(mobile);
        console.log(result)
        if (result) {
            onClose();
            setMobile('');
            setAuthBtn(false);
            setAuthNum(null);
        } else {
            window.confirm('처리 중에 에러가 발생했습니다. 시스템 관리자에게 문의하세요.')
        }


    }

    return (
        <Dialog open={open}>
            <DialogTitle>{t('component_myPage_accountDetail_button_changeMobileNumber')}</DialogTitle>
            <DialogContent>
                <Stack direction={'row'} sx={{mt: 2, mb: 1}}>
                    <TextField value={mobile}
                               placeholder={`${t('component_myPage_accountDetail_placeholder_putNewMobileNumber')}`}
                               sx={{mr: 2, fontSize: 14}}
                               onChange={(e) => setMobile(e.target.value)}/>
                    <Button variant="outlined"
                            onClick={handleAuthenticationBtn}>{t('component_myPage_accountDetail_button_applyAuthentication')}</Button>
                </Stack>
                <Typography sx={{
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'start',
                    mb: 2, ml: 1,
                }}>{errMobileNum}</Typography>
                <Stack direction={'row'}>
                    <TextField value={authNum}
                               placeholder={`${t('component_myPage_accountDetail_error_putAuthenticationNumber')}`}
                               sx={{fontSize: 14}}
                               onChange={handleAuthNum}/>
                </Stack>
                <Typography sx={{
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'start',
                    mt: 0.5, mb: 2, ml: 1,
                }}>{errAuthNum}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSaveBtn}>{t('component_myPage_accountDetail_button_confirm')}</Button>
                <Button onClick={handleCancelBtn}>
                    {t('component_myPage_accountDetail_button_cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const PwChangeDialog = (props) => {
    const {open, onClose, currentPw} = props;
    const {i18n, t} = useTranslation();
    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const align = mdUp ? 'horizontal' : 'vertical';

    const [curPw, setCurPw] = useState<string>();
    const [pw, setPw] = useState({password: '', showPassword: false});
    const [confirmPw, setConfirmPw] = useState({password: '', showPassword: false});
    const [errCurrentPw, setErrCurrentPw] = useState<string>('');
    const [errNewPw, setErrNewPw] = useState<string>('');
    const [errConfirmPw, setErrConfirmPw] = useState<string>('');
    const [showIconPw, setShowIconPw] = useState(true);
    const [showIconNewPw, setShowIconNewPw] = useState(true);
    const [showIconConfirmPw, setShowIconConfirmPw] = useState(true);

    const handleCancelBtn = () => {
        onClose();
        setCurPw(null);
        setPw({password: '', showPassword: false});
        setConfirmPw({password: '', showPassword: false});
        setErrConfirmPw('');
        setErrNewPw('');
        setErrCurrentPw('');
        setShowIconPw(true);
        setShowIconNewPw(true);
        setShowIconConfirmPw(true);
    }

    const handleClickShowPw = () => {
        setPw({
            ...pw,
            showPassword: !pw.showPassword,
        });
    };

    const handleClickShowConfirmPw = () => {
        setConfirmPw({
            ...confirmPw,
            showPassword: !confirmPw.showPassword,
        });
    };


    const handelCurPw = (e) => {
        e.preventDefault();
        setShowIconPw(false);
        let check = strCheck(e.target.value, 'pw')
        if (!check) {
            setErrCurrentPw(`${t('component_myPage_accountDetail_error_invalidPassword')}`)
        } else if (currentPw != e.target.value) {
            setErrCurrentPw(`${t('component_myPage_accountDetail_error_disConfirmPassword')}`);
        } else {
            setErrCurrentPw('')
        }

        setCurPw(e.target.value);
    }

    const handlePw = (e) => {
        e.preventDefault();
        setShowIconNewPw(false);
        let check = strCheck(e.target.value, 'pw')
        if (!check) {
            setErrNewPw(`${t('component_myPage_accountDetail_error_invalidPassword')}`)
        } else {
            setErrNewPw('')
        }

        setPw({...pw, password: e.target.value})
    }

    const handleConfirmPw = (e) => {
        e.preventDefault();
        setShowIconConfirmPw(false);

        let check = strCheck(e.target.value, 'pw')
        if (!check) {
            setErrConfirmPw(`${t('component_myPage_accountDetail_error_invalidPassword')}`)
        } else if (pw.password !== e.target.value) {
            setErrConfirmPw(`${t('component_myPage_accountDetail_error_disConfirmPassword')}`)
        } else {
            setErrConfirmPw('');
        }

        setConfirmPw({...pw, password: e.target.value})
    }

    const handleConfirmBtn = () => {
        if (curPw == '' || pw.password == '' || confirmPw.password == '') {
            window.confirm(`${t('component_myPage_accountDetail_confirm_putInformation')}`)
        } else if (errCurrentPw !== '' || errNewPw !== '' || errConfirmPw !== '') {
            window.confirm(`${t('component_myPage_accountDetail_confirm_doubleCheckInformation')}`)
        } else {
            //api작업할 곳 - 비밀번호만 보내면 되나?../put
            window.confirm(`${t('component_myPage_accountDetail_confirm_confirmPassword')}`);
            onClose();
            setCurPw(null);
            setPw({password: '', showPassword: false});
            setConfirmPw({password: '', showPassword: false});
            setErrConfirmPw('');
            setErrNewPw('');
            setErrCurrentPw('');
            setShowIconPw(true);
            setShowIconNewPw(true);
            setShowIconConfirmPw(true);
        }
    }

    const getStatus = (status, conditions) => {
        if (status) {
            if (conditions == '') {
                return <CheckIcon color="action"/>;
            } else {
                return <CloseIcon color="error"/>;
            }
        }
    }


    // @ts-ignore
    return (
        <Dialog open={open}>
            <DialogTitle>{t('component_myPage_accountDetail_button_changePassword')}</DialogTitle>
            <DialogContent>
                <Stack sx={{mt: 2, mb: 2}}>
                    <Stack direction={'row'}>
                        <PropertyListItem
                            align={align}
                            label={t('component_myPage_accountDetail_label_currentPassword')}
                            sx={{width: 155}}
                        />
                        <Box>
                            <FormControl sx={{width: '25ch'}} variant="outlined">
                                <OutlinedInput
                                    sx={{fontSize: 14}}
                                    type={'password'}
                                    value={curPw}
                                    onChange={handelCurPw}
                                    placeholder={`${t('component_myPage_accountDetail_placeholder_putCurrentPassword')}`}
                                />
                            </FormControl>
                        </Box>
                        <Stack sx={{mt: 2, mb: 2, ml: 1}}>
                            {getStatus(!showIconPw, errCurrentPw)}
                        </Stack>
                    </Stack>
                    <Typography sx={{
                        fontSize: 12,
                        display: 'flex',
                        justifyContent: 'end',
                        mr: 6,
                        mt: 1
                    }}>{errCurrentPw}</Typography>
                </Stack>
                <Stack>
                    <Stack direction={'row'}>
                        <PropertyListItem
                            align={align}
                            label={t('component_myPage_accountDetail_label_newPassword')}
                            sx={{width: 155}}
                        />
                        <Box>
                            <FormControl sx={{width: '25ch'}} variant="outlined">
                                <OutlinedInput
                                    sx={{fontSize: 14}}
                                    type={pw.showPassword ? 'text' : 'password'}
                                    value={pw.password}
                                    onChange={handlePw}
                                    placeholder={`${t('component_myPage_accountDetail_placeholder_conditionPassword')}`}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                // aria-label="toggle password visibility"
                                                onClick={handleClickShowPw}
                                                edge="end"
                                            >
                                                {pw.showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Box>
                        <Stack sx={{mt: 2, mb: 2, ml: 1}}>
                            {getStatus(!showIconNewPw, errNewPw)}
                        </Stack>
                    </Stack>
                    <Typography sx={{
                        fontSize: 12,
                        display: 'flex',
                        justifyContent: 'end',
                        mr: 6,
                        mt: 1
                    }}>{errNewPw}</Typography>
                </Stack>
                <Stack sx={{mt: 2, mb: 2}}>
                    <Stack direction={'row'}>
                        <PropertyListItem
                            align={align}
                            label={t('component_myPage_accountDetail_label_confirmNewPassword')}
                            sx={{width: 155}}
                        />
                        <Box>
                            <FormControl sx={{width: '25ch'}} variant="outlined">
                                <OutlinedInput
                                    sx={{fontSize: 14}}
                                    type={confirmPw.showPassword ? 'text' : 'password'}
                                    value={confirmPw.password}
                                    onChange={handleConfirmPw}
                                    placeholder={`${t('component_myPage_accountDetail_placeholder_rePutPassword')}`}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleClickShowConfirmPw}
                                                edge="end"
                                            >
                                                {confirmPw.showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Box>
                        <Stack sx={{mt: 2, mb: 2, ml: 1}}>
                            {getStatus(!showIconConfirmPw, errConfirmPw)}
                        </Stack>
                    </Stack>
                    <Typography sx={{
                        fontSize: 12,
                        display: 'flex',
                        justifyContent: 'end',
                        mr: 6,
                        mt: 1
                    }}>{errConfirmPw}</Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirmBtn}>{t('component_myPage_accountDetail_button_confirm')}</Button>
                <Button onClick={handleCancelBtn}>
                    {t('component_myPage_accountDetail_button_cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export const AccountDetails = (props) => {
    const {i18n, t} = useTranslation();
    const {data} = props;

    const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
    const align = mdUp ? 'horizontal' : 'vertical';

    const [openMobileChangeDialog, setOpenMobileChangeDialog] = useState<boolean>(false);
    const [openPwChangeDialog, setOpenPwChangeDialog] = useState<boolean>(false);

    const handleOpenMobileChangeDialog = () => {
        setOpenMobileChangeDialog(true)
    }
    const handleCloseMobileChangeDialog = () => {
        setOpenMobileChangeDialog(false)
    }

    const handleOpenPwChangeDialog = () => {
        setOpenPwChangeDialog(true)
    }
    const handleClosePwChangeDialog = () => {
        setOpenPwChangeDialog(false)
    }

    return (
        <>
            <Card>
                <PropertyList>
                    <PropertyListItem
                        align={align}
                        divider
                        label={t('component_myPage_accountDetail_label_company')}
                        value={data?.mallName}
                    />
                    <PropertyListItem
                        align={align}
                        divider
                        label={t('component_myPage_accountDetail_label_id')}
                        value={data?.userLoginId}
                    />
                    <PropertyListItem
                        align={align}
                        divider
                        label={t('component_myPage_accountDetail_label_email')}
                        value={data?.email}
                    />
                    <PropertyListItem
                        align={align}
                        divider
                        label={t('component_myPage_accountDetail_label_role')}
                        value={data?.userName}
                    />
                    {/*<PropertyListItem*/}
                    {/*    align={align}*/}
                    {/*    divider*/}
                    {/*    label={t('component_myPage_accountDetail_label_mobile')}*/}
                    {/*    value={data?.mobile}*/}
                    {/*/>*/}
                </PropertyList>
                {/*<CardActions*/}
                {/*    sx={{*/}
                {/*        flexWrap: 'wrap',*/}
                {/*        px: 3,*/}
                {/*        py: 2,*/}
                {/*        m: -1*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Button*/}
                {/*        sx={{m: 1}}*/}
                {/*        variant="outlined"*/}
                {/*        onClick={handleOpenMobileChangeDialog}*/}
                {/*    >*/}
                {/*        {t("component_myPage_accountDetail_button_changeMobileNumber")}*/}
                {/*    </Button>*/}
                {/*    <Button*/}
                {/*        sx={{m: 1}}*/}
                {/*        variant="outlined"*/}
                {/*        onClick={handleOpenPwChangeDialog}*/}
                {/*    >*/}
                {/*        {t("component_myPage_accountDetail_button_changePassword")}*/}
                {/*    </Button>*/}
                {/*</CardActions>*/}
            </Card>
            <MobileChangeDialog
                open={openMobileChangeDialog}
                onClose={handleCloseMobileChangeDialog}
                data={data?.mobile}
            />
            <PwChangeDialog
                open={openPwChangeDialog}
                onClose={handleClosePwChangeDialog}
                currentPw={data?.password}/>
        </>
    );
};
