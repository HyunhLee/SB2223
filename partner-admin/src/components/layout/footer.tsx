import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";

const Footer = () => {
    const {t} = useTranslation();

    return (
        <Box sx={{backgroundColor: '#FFC355', textAlign: 'center'}}>
            <footer>
                <h4>{t("component_layout_footer_h4_footer")}</h4>
            </footer>
        </Box>
    );
};

export default Footer;