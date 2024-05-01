import type {FC} from 'react';
import {useState} from "react";
import {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import {Avatar, Box, Divider, ListItemIcon, ListItemText, MenuItem, Popover, Stack, Typography} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {useAuth} from '../../hooks/use-auth';
import {UserCircle as UserCircleIcon} from '../../icons/user-circle';
import {SettingsDrawer} from "../settings-drawer";
import {typeApi} from "../../api/type-api";

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const { logout } = useAuth();
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
    name: 'Anika Visser'
  };

  const handleLogout = async (): Promise<void> => {
    try {
      onClose?.();
      await logout();
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpenDrawer(true);
  };

  const russelTest = async () => {
    const items = await typeApi.postRusselTest();
  };

  const handleClose = (): void => {
    setOpenDrawer(false);
  };

  return (
      <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            horizontal: 'center',
        vertical: 'bottom'
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}
    >
      <Box
        sx={{
          alignItems: 'center',
          p: 2,
          display: 'flex'
        }}
      >
        <Avatar
          sx={{
            height: 40,
            width: 40
          }}
        >
          <UserCircleIcon fontSize="small" />
        </Avatar>
        <Box
          sx={{
            ml: 1
          }}
        >
          <Typography variant="body1">
            {localStorage.getItem('email')}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ my: 1 }}>
        <Stack sx={{mr: 1, display: 'flex' , justifyContent: 'flex-end'}}
direction='row'>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
                primary={(
                    <Typography variant="body1">
                      Logout
                    </Typography>
                )}
            />
          </MenuItem>
          {/*<Button sx={{mr: 2}}*/}
          {/*        onClick={handleOpen}>Theme</Button>*/}
          {/*<Button sx={{mr: 2}}*/}
          {/*        onClick={russelTest}>russel</Button>*/}
        </Stack>
      </Box>
      <SettingsDrawer
        onClose={handleClose}
        open={openDrawer}
      />
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
