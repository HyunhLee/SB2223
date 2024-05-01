import {Box, Button, Stack} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";

const Header = (props) => {
    const {t} = useTranslation();
    const {isLogIn} = props;

    const router = useRouter();
    const handleLogout = () => {
        if (window.confirm(`${t("component_layout_header_confirm_message")}`)) {
            router.push("/authentication/login");
        } else {
            return;
        }
    }

    return (
        <Box sx={{backgroundColor: '#FFC355'}}>
            <header>
                <Stack direction='row'>
                    <h2>{t("component_layout_header_h2_header")}</h2>
                    {isLogIn ? <Box sx={{backgroundColor: '#FFC355', marginLeft: 'auto'}}>
                        <Button onClick={handleLogout}><h3>{t("component_layout_header_button_logout")}</h3></Button>
                    </Box> : null}
                </Stack>
            </header>
        </Box>
    );
};

export default Header;