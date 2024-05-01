import React, {ChangeEvent, FC, useContext} from "react";
import {FaqDetailModel} from "../../../types/b2b-partner-model/faq-model";
import {DataContext} from "../../../contexts/data-context";
import {PropertyList} from "../../property-list";
import {PropertyListItem} from "../../property-list-item";
import {MenuItem, Select, TextField, Theme, Typography, useMediaQuery} from "@mui/material";

interface ListProps {
    faqModel: FaqDetailModel;
    setFaqModel: (faqModel) => void;
}

const CreateFaqDetail: FC<ListProps> = (props) => {
    const {
        faqModel,
        setFaqModel
    } = props;
    const dataContext = useContext(DataContext);
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    const handleChange = (prop: keyof FaqDetailModel) => (event: ChangeEvent<HTMLInputElement>) => {
        setFaqModel({...faqModel, [prop]: event.target.value});
    };

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
                    label="카테고리"
                >
                    <Select
                        value={faqModel.faqType}
                        size={"small"}
                        sx={{minWidth: 100}}
                        onChange={handleChange('faqType')}
                    >
                        {renderType('FAQ_TYPE')}
                    </Select>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="FAQ 질문"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{width: '100%'}}
                    >
                        <TextField
                            fullWidth
                            id='title'
                            value={faqModel.question}
                            placeholder={'질문을 입력해주세요'}
                            onChange={handleChange('question')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="FAQ 내용"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{width: '100%'}}
                    >
                        <TextField
                            fullWidth
                            id='content'
                            value={faqModel.answer}
                            multiline={true}
                            rows={15}
                            placeholder={'내용을 입력해주세요'}
                            onChange={handleChange('answer')}
                        />
                    </Typography>
                </PropertyListItem>
            </PropertyList>
        </>
    )
};

export default CreateFaqDetail;