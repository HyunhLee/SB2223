import React, {ChangeEvent} from "react";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {MenuItem, Select, TextField, Theme, Typography, useMediaQuery} from "@mui/material";
import {B2bPartnerAccountModel} from "../../types/b2b-partner-model/b2b-partner-account-model";
import _ from "lodash";

const B2bPartnerCreateAccountDetail = (props) => {
    const {accountModel, setAccountModel, company} = props;
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const align = smDown ? 'vertical' : 'horizontal';

    const handleChange = (prop: keyof B2bPartnerAccountModel) => (event: ChangeEvent<HTMLInputElement>) => {
        setAccountModel({...accountModel, [prop]: event.target.value});
    };

    const getMallId = () => {
        return (accountModel.mallId) ? accountModel.mallId : '';
    }

    const changeMallIdHandler = (changeValues) => {
        setAccountModel({...accountModel, mallId: changeValues});
    }

    return (
        <>
            <PropertyList>
                <PropertyListItem
                    align={align}
                    label="* 회사명"
                >
                    <Select
                        size={"small"}
                        sx={{ml: 5, width: 250, height: 56}}
                        value={getMallId()}
                        onChange={e => {
                            changeMallIdHandler(e.target.value)
                        }}
                    >
                        <MenuItem value={null}>-</MenuItem>
                        {_.sortBy(company, 'name').map((mall) => {
                            return (
                                <MenuItem key={mall.mall.id}
                                          value={mall.mall.id}>{mall.mall.name}</MenuItem>
                            )
                        })}
                    </Select>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="* 아이디(이메일 형식)"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{ml: 5}}
                    >
                        <TextField
                            id='accountId'
                            placeholder={'아이디를 입력하세요'}
                            onChange={handleChange('login')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="* 비밀번호"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{ml: 5}}
                    >
                        <TextField
                            id='password'
                            placeholder={'비밀번호를 입력해주세요'}
                            onChange={handleChange('password')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="* 이메일"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{ml: 5}}
                    >
                        <TextField
                            id='email'
                            placeholder={'이메일을 입력해주세요'}
                            onChange={handleChange('email')}
                        />
                    </Typography>
                </PropertyListItem>
                <PropertyListItem
                    align={align}
                    label="담당자"
                >
                    <Typography
                        color="primary"
                        variant="body2"
                        sx={{ml: 5}}
                    >
                        <TextField
                            id='managerName'
                            placeholder={'담당자를 입력해주세요'}
                            onChange={handleChange('name')}
                        />
                    </Typography>
                </PropertyListItem>
            </PropertyList>
        </>
    )
};

export default B2bPartnerCreateAccountDetail;