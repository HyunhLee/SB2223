import React, {FC, MutableRefObject} from "react";
import PropTypes from "prop-types";
import {Box, Button, Drawer, IconButton, Stack, TextField, Typography} from "@mui/material";
import {X as XIcon} from "../../icons/x";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {styled} from "@mui/material/styles";
import {getDate} from "../../utils/data-convert";
import {toast} from "react-hot-toast";
import {InquiryModel} from "../../types/inquiry";
import {inquiryApi} from "../../api/inquiry-api";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

interface InquiryDrawerProps {
    containerRef?: MutableRefObject<HTMLDivElement>;
    open?: boolean;
    onClose?: () => void;
    inquiry?: InquiryModel;
    getLists?: () =>  void;
}

const InquiryDrawerMobile = styled(Drawer)({
    flexShrink: 0,
    maxWidth: '100%',
    height: 'calc(100% - 64px)',
    width: 500,
    '& .MuiDrawer-paper': {
        height: 'calc(100% - 64px)',
        maxWidth: '100%',
        top: 64,
        width: 800
    }
});

export const InquiryDrawer: FC<InquiryDrawerProps> = (props) => {
    const { containerRef, onClose, open, inquiry, getLists, ...other } = props;

    const handleAnswerChange = () => {
        const newAnswer = (document.getElementById('answer') as HTMLInputElement).value;
        inquiry.answer = newAnswer;
    }

    const onSave = async (): Promise<void> => {
        if(inquiry.answer == '' || !inquiry.answer) {
            toast.error('답변을 입력해주세요.')
            return;
        } else if(inquiry.answer !== '') {
            inquiry.status = 'CLOSE'
        }
        const saveData = {...inquiry};
        if(inquiry.status === 'CLOSE') {
            if (window.confirm('저장하시겠습니까?')) {
                await inquiryApi.putInquiry(saveData);
                toast.success('저장되었습니다.');
            }
            onClose();
        }
    };

    const onDelete = async (id): Promise<void> => {
        if (window.confirm('삭제하시겠습니까?')) {
            await inquiryApi.deleteInquiry(id, {
                id,
                activated: false,
            })
                .catch((err) => console.log(err))
            toast.success('삭제되었습니다.');
            await getLists();
        }
    }

    const content = inquiry
        ? (
            <>
                <Box
                    sx={{
                        alignItems: 'center',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        justifyContent: 'space-between',
                        px: 3,
                        py: 2
                    }}
                >
                    <Typography
                        color="inherit"
                        variant="h6"
                    >
                        1:1 문의 상세내역
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={onClose}
                    >
                        <XIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        px: 3,
                        py: 4
                    }}
                >
                    <PropertyList>
                        <Stack
                            direction="row"
                        >
                            <PropertyListItem label="아이디"
                                              sx={{width: 200}}
                            />
                            <TextField
                                disabled
                                fullWidth
                                margin="normal"
                                name="id"
                                value={inquiry.id || ''}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                        >
                            <PropertyListItem label="회원 닉네임"
                                              sx={{width: 200}}
                            />
                            <TextField
                                disabled
                                fullWidth
                                margin="normal"
                                name="createdBy"
                                value={inquiry.userName || ''}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                        >
                            <PropertyListItem label="카테고리"
                                              sx={{width: 200}}
                            />
                            <TextField
                                disabled
                                fullWidth
                                margin="normal"
                                name="category"
                                value={inquiry.type || ''}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                        >
                            <PropertyListItem label="등록일자"
                                              sx={{width: 200}}
                            />
                            <TextField
                                disabled
                                fullWidth
                                margin="normal"
                                name="createdDate"
                                value={getDate(inquiry.createdDate) || ''}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                        >
                            <PropertyListItem label="질문"
                                              sx={{width: 200}}
                            />
                            <TextField
                                disabled
                                fullWidth
                                margin="normal"
                                name="question"
                                multiline={true}
                                value={inquiry.contents || ''}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                        >
                            <PropertyListItem label="답변"
                                              sx={{width: 200}}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                id="answer"
                                multiline={true}
                                defaultValue={inquiry.answer || ''}
                                onChange={handleAnswerChange}
                            />
                        </Stack>
                    </PropertyList>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            m: -1,
                            '& > button': {
                                m: 1
                            }
                        }}
                    >
                        <Button
                            color="primary"
                            onClick={onSave}
                            size="small"
                            variant="contained"
                            startIcon={<SaveIcon fontSize="small"/>}
                        >
                            저장
                        </Button>
                        <Button
                            onClick={() => onDelete(inquiry.id)}
                            color="error"
                            size="small"
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                        >
                            삭제
                        </Button>
                    </Box>
                </Box>
            </>
        ) : null;

    return (
        <InquiryDrawerMobile
            anchor="right"
            ModalProps={{ container: containerRef?.current }}
            onClose={onClose}
            open={open}
            SlideProps={{ container: containerRef?.current }}
            variant="temporary"
            {...other}
        >
            {content}
        </InquiryDrawerMobile>
    );
}

InquiryDrawer.propTypes = {
    containerRef: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    // @ts-ignore
    inquiry: PropTypes.object
};