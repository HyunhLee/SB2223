import type {FC} from 'react';
import {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {
    Avatar,
    Box,
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Popover, Stack,
    Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {useAuth} from '../../hooks/use-auth';
import {UserCircle as UserCircleIcon} from '../../icons/user-circle';
import {useTranslation} from "react-i18next";
import {useState} from "react";

interface AccountPopoverProps {
    anchorEl: null | Element;
    onClose?: () => void;
    open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
    const {anchorEl, onClose, open, ...other} = props;
    const {i18n} = useTranslation();
    const [lan, setLan] = useState<string>('ko');
    const router = useRouter();
    const {logout} = useAuth();
    // To get the user from the authContext, you can use
    // `const { user } = useAuth();`
    const name = localStorage.getItem('email')
    const user = {
        name: name.split('@')[0],
        email: name
    };

    const handleLogout = async (): Promise<void> => {
        try {
            const checkConfirm = window.confirm('로그아웃 하시겠습니까?')
            if (checkConfirm) {
                onClose?.();
                await logout();
                router.push('/');
            }
        } catch (err) {
            console.error(err);
            toast.error('Unable to logout.');
        }
    };

    const handleChangeLanguage = () => {
        if (lan == 'ko') {
            i18n.changeLanguage('en');
            setLan('en');
        } else if (lan == 'en') {
            i18n.changeLanguage('ko');
            setLan('ko');
        }
        onClose?.();
    };

    return (
        <Popover
            sx={{mt: 1}}
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}
            keepMounted
            onClose={onClose}
            open={open}
            PaperProps={{sx: {width: 300}}}
            transitionDuration={0}
            {...other}
        >
            <Box
                sx={{
                    alignItems: 'center',
                    p: 2,
                    display: 'flex',
                }}
            >
                <Avatar
                    sx={{
                        height: 40,
                        width: 40
                    }}
                >
                    <UserCircleIcon fontSize="small"/>
                </Avatar>
                <Box
                    sx={{
                        ml: 1
                    }}
                >
                    <Typography variant="body1">
                        {user.name}
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    ml: 3, mb: 2
                }}
            >
                <Typography variant="body1" sx={{mb: 1}}>
                    {user.email}
                </Typography>
            </Box>
            <Divider/>
            <Box sx={{my: 1}}>
                <Stack sx={{mr: 1, ml: 1}} justifyContent='end' direction='row'>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText
                            primary={(
                                <Typography variant="body1">
                                    Logout
                                </Typography>
                            )}
                        />
                    </MenuItem>
                    {/*<MenuItem onClick={handleChangeLanguage}>*/}
                    {/*    <ListItemText*/}
                    {/*        primary={(*/}
                    {/*            <Typography variant="body1">*/}
                    {/*                {lan == 'ko' ? 'English' : '한국어'}*/}
                    {/*            </Typography>*/}
                    {/*        )}*/}
                    {/*    />*/}
                    {/*</MenuItem>*/}
                </Stack>
            </Box>
        </Popover>
    );
};

AccountPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool
};
