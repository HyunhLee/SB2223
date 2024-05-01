import {Box, Checkbox, FormControlLabel, TextField, Theme, Typography, useMediaQuery} from "@mui/material";
import {PropertyListItem} from "../property-list-item";
import {FC} from "react";
import {ApplyStoreModels} from "../../types/apply-store-model";
import {useTranslation} from "react-i18next";

interface Props {
    applyStoreModel: ApplyStoreModels;
    setApplyStoreModel: any;
}

export const AgreePolicy: FC<Props> = ({applyStoreModel, setApplyStoreModel}) => {
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';
    const {t} = useTranslation();

    const checkedPolicy = () => {
        return applyStoreModel.agreePolicy;
    }

    const changePolicy = (value, checked) => {
        setApplyStoreModel({...applyStoreModel, agreePolicy: checked});
    }

    const checkedTerms = () => {
        return applyStoreModel.agreeTerm;
    }

    const changeTerms = (value, checked) => {
        setApplyStoreModel({...applyStoreModel, agreeTerm: checked});
    }

    const checkedTenor = () => {
        return applyStoreModel.agreeTenor;
    }

    const changeTenor = (value, checked) => {
        setApplyStoreModel({...applyStoreModel, agreeTenor: checked});
    }

    return (
        <Box sx={{mt: 2, mb: 2}}>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_agreePolicy_propertyListItem_policyGuide")}
            >
                <Typography
                    color="primary"
                    variant="body2"
                >
                    <TextField
                        id="policy-guide"
                        sx={{width: 900}}
                        multiline
                        rows={6}
                        defaultValue={t("component_applyStore_agreePolicy_textField_policyGuide")}
                        disabled={true}
                    />
                </Typography>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label=""
            >
                <FormControlLabel
                    sx={{justifyContent: 'flex-end'}}
                    value={'POLICY'}
                    control={<Checkbox
                        onChange={e => {
                            changePolicy(e.target.defaultValue, e.target.checked)
                        }}
                        checked={checkedPolicy()}
                    />}
                    label={`${t("component_applyStore_agreePolicy_formControlLabel_agreePolicy")}`}/>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_agreePolicy_propertyListItem_termsGuide")}
            >
                <Typography
                    color="primary"
                    variant="body2"
                >
                    <TextField
                        id="terms-guide"
                        sx={{width: 900}}
                        multiline
                        rows={6}
                        defaultValue={t("component_applyStore_agreePolicy_textField_termsGuide")}
                        disabled={true}
                    />
                </Typography>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label=""
            >
                <FormControlLabel
                    sx={{justifyContent: 'flex-end'}}
                    value={'TERMS'}
                    control={<Checkbox
                        onChange={e => {
                            changeTerms(e.target.defaultValue, e.target.checked)
                        }}
                        checked={checkedTerms()}
                    />}
                    label={`${t("component_applyStore_agreePolicy_formControlLabel_agreeTerms")}`}/>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label={t("component_applyStore_agreePolicy_propertyListItem_tenorGuide")}
            >
                <Typography
                    color="primary"
                    variant="body2"
                >
                    <TextField
                        id="tenor-guide"
                        sx={{width: 900}}
                        multiline
                        rows={6}
                        defaultValue={t("component_applyStore_agreePolicy_textField_tenorGuide")}
                        disabled={true}
                    />
                </Typography>
            </PropertyListItem>
            <PropertyListItem
                align={align}
                label=""
            >
                <FormControlLabel
                    sx={{justifyContent: 'flex-end'}}
                    value={'TENOR'}
                    control={<Checkbox
                        onChange={e => {
                            changeTenor(e.target.defaultValue, e.target.checked)
                        }}
                        checked={checkedTenor()}
                    />}
                    label={`${t("component_applyStore_agreePolicy_formControlLabel_agreeTenor")}`}/>
            </PropertyListItem>
        </Box>
    );
};