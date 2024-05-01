import React, {ChangeEvent, FC, useContext} from "react";
import {DataContext} from "../../../contexts/data-context";
import {PropertyList} from "../../property-list";
import {PropertyListItem} from "../../property-list-item";
import {MenuItem, Select, TextField, Theme, Typography, useMediaQuery} from "@mui/material";
import {FaqDetailModel} from "../../../types/faq-model";
import {useTranslation} from "react-i18next";

interface ListProps {
    faqModel: FaqDetailModel;
}

const CreateFaqDetail: FC<ListProps> = (props) => {
    const {
        faqModel
    } = props;
    const dataContext = useContext(DataContext);
    const {t} = useTranslation();
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    const renderType = (target) => {
        return Object.keys(dataContext[target]).map(key => {
            return (<MenuItem key={key}
                              value={key}>{dataContext[target][key]}</MenuItem>)
        });
    }

    return (
        <>
            <PropertyList>
                <PropertyListItem
                    align={align}
                    label={t("label_question")}
                >
                    <Select
                        disabled={true}
                        value={faqModel.faqType}
                        size={"small"}
                        sx={{minWidth: 100}}
                    >
                        {renderType('FAQ_TYPE')}
                    </Select>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={t("components_general_createFaqDetail_typography_title")}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{width: '100%'}}
                    >
                        <TextField
                            disabled={true}
                            fullWidth
                            id='title'
                            value={faqModel.question}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label={t("components_general_createFaqDetail_typography_contents")}
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{width: '100%'}}
                    >
                        <TextField
                            disabled={true}
                            fullWidth
                            id='content'
                            value={faqModel.answer}
                            multiline={true}
                            rows={15}
                        />
                    </Typography>
                </PropertyListItem>
            </PropertyList>
        </>
    )
};

export default CreateFaqDetail;