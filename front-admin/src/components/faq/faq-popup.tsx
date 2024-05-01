import {FC, MutableRefObject, useCallback, useState} from "react";
import {FaqModel} from "../../types/faq";
import PropTypes from "prop-types";
import {Box, Button, Drawer, IconButton, Stack, TextField, Theme, Typography, useMediaQuery} from "@mui/material";
import {X as XIcon} from "../../icons/x";
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {styled} from "@mui/material/styles";
import {getDate} from "../../utils/data-convert";
import _ from "lodash";
import {toast} from "react-hot-toast";
import {styleApi} from "../../api/style-api";
import {faqApi} from "../../api/faq-api";

interface FaqDrawerProps {
    containerRef?: MutableRefObject<HTMLDivElement>;
    open?: boolean;
    onClose?: () => void;
    faq?: FaqModel;
}

const FaqDrawerDesktop = styled(Drawer)({
    width: 500,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        position: 'relative',
        width: 500
    }
});

const FaqDrawerMobile = styled(Drawer)({
    flexShrink: 0,
    maxWidth: '100%',
    height: 'calc(100% - 64px)',
    width: 500,
    '& .MuiDrawer-paper': {
        height: 'calc(100% - 64px)',
        maxWidth: '100%',
        top: 64,
        width: 500
    }
});

export const FaqPopup: FC<FaqDrawerProps> = (props) => {
    const { containerRef, onClose, open, faq, ...other } = props;
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const handleAnswerChange = () => {
        const newAnswer = (document.getElementById('answer') as HTMLInputElement).value;
        faq.answer = newAnswer;
    }

    const onSave = async (): Promise<void> => {
        const saveData = {...faq};
        if (window.confirm('저장하시겠습니까?')) {
            await faqApi.putFaq(saveData);
            toast.success('저장되었습니다.');
        }
    };

    const onDelete = async (id): Promise<void> => {
        if (window.confirm('삭제하시겠습니까?')) {
                await faqApi.deleteFaq(id, {
                    id,
                    activated: false,
                })
                    .catch((err) => console.log(err))
            toast.success('삭제되었습니다.');
        }
    }

    const content = faq
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
                        <PropertyListItem label="아이디" />
                        <TextField
                            disabled
                            fullWidth
                            margin="normal"
                            name="id"
                            value={faq.id}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                    >
                        <PropertyListItem label="회원 닉네임" />
                        <TextField
                            disabled
                            fullWidth
                            margin="normal"
                            name="createdBy"
                            value={faq.createdBy}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                    >
                        <PropertyListItem label="카테고리" />
                        <TextField
                            disabled
                            fullWidth
                            margin="normal"
                            name="category"
                            value={faq.category}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                    >
                        <PropertyListItem label="등록일자" />
                        <TextField
                            disabled
                            fullWidth
                            margin="normal"
                            name="createdDate"
                            value={getDate(faq.createdDate)}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                    >
                        <PropertyListItem label="질문" />
                        <TextField
                            disabled
                            fullWidth
                            margin="normal"
                            name="question"
                            value={faq.question}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                    >
                        <PropertyListItem label="답변" />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="answer"
                            defaultValue={faq.answer}
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
                    >
                        저장
                    </Button>
                    <Button
                        onClick={() => onDelete(faq.id)}
                        size="small"
                        variant="outlined"
                    >
                        삭제
                    </Button>
                </Box>
            </Box>
        </>
    ) : null;

    if (lgUp) {
        return (
            <FaqDrawerDesktop
                anchor="right"
                open={open}
                SlideProps={{ container: containerRef?.current }}
                variant="persistent"
                {...other}
            >
                {content}
            </FaqDrawerDesktop>
        );
    }
    return (
        <FaqDrawerMobile
            anchor="right"
            ModalProps={{ container: containerRef?.current }}
            onClose={onClose}
            open={open}
            SlideProps={{ container: containerRef?.current }}
            variant="temporary"
            {...other}
        >
            {content}
        </FaqDrawerMobile>
    );
}

FaqPopup.propTypes = {
    containerRef: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    // @ts-ignore
    faq: PropTypes.object
};