import React, {FC, Fragment, useContext} from 'react';
import {CardHeader, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow,} from '@mui/material';
import {DefModel} from "../../types/marketing-model/marketing-model";
import HelpIcon from "@mui/icons-material/Help";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";
import {DataContext} from "../../contexts/data-context";

interface ListTableProps {
    graph: DefModel[];
    check: string;
    setLabel: (e) => void;
    setName: (e) => void;
}

const GraphAllList: FC<ListTableProps> = (props) => {
    const {graph, check, setLabel, setName} = props;
    const dataContext = useContext(DataContext);

    const title = () => {
        let t = '';
        if(check == 'click') {
            t = '상품 클릭 수';
        } else if(check == 'style') {
            t = 'MY 스타일 저장 수';
        } else if(check == 'detail') {
            t = '상품 상세 페이지 조회 수';
        } else if(check == 'cart') {
            t = '피팅룸 기여 장바구니 총액';
        } else if(check == 'sale') {
            t = '피팅룸 기여 매출(장바구니 구매전환 총액)';
        } else if(check == 'user') {
            t = '회원 가입 수';
        }
        return t;
    }

    const helpText = () => {
        let text = '';
        if(check == 'click'){
            text ='상품 클릭 수\n\n -피팅룸에서 유저가 상품썸네일을 클릭한 총합.'
        }else if(check == 'style'){
            text ='MY 스타일 저장 수\n\n -피팅룸에서 유저가 스타일을 저장한 총 횟수'
        }else if(check == 'detail'){
            text ='상품 상세 페이지 조회 수\n\n -유저가 피팅룸에서 [i]버튼을 클릭하여 외부링크(자사몰 상품상세페이지)로 나가는 조회수 총합.'
        }else if(check == 'cart') {
            text = '기여 장바구니 총액\n\n -유저들이 장바구니에 담은 상품가격의 총합.\n -장바구니 총액=상품구매금액.\n -상품구매금액=(판매가*수량)\n'
        }else if(check == 'sale') {
            text = '기여 매출\n\n-피팅룸의 장바구니를 통하여 최종적으로 상품을 구매한 금액의 총합.\n-상품구매금액=(판매가*수량)\n'
        }else if(check == 'user'){
            text ='회원 가입 수\n\n -피팅룸을 통해 회원가입한 수를 집계.'
        }
        return text;
    }

    const newSet = (c, n) => {
        if(c && n) {
            setLabel(c);
            setName(n);
        }
    }

    return (
        <>
            <Stack
                justifyContent='space-between'
                direction='row'
            >
                <Stack direction='row'>
                    <CardHeader
                        title={title()}
                    />
                    <CustomWidthTooltip title={helpText()}
sx={{whiteSpace: 'pre-wrap', mt:0.5}}
placement="bottom"
arrow>
                        <IconButton sx={{ml: -3.5, mr: 2, height: 20, mt: 4.2}}>
                            <HelpIcon color="primary"
fontSize="small"/>
                        </IconButton>
                    </CustomWidthTooltip>
                </Stack>
            </Stack>
            <Table sx={{ minWidth: '100%' }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">
                            날짜
                        </TableCell>
                        <TableCell align="center">
                            1위
                        </TableCell>
                        <TableCell align="center">
                            2위
                        </TableCell>
                        <TableCell align="center">
                            3위
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {graph.map((item) => {
                        if(check == 'click' || check == 'user') {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell align="center">
                                            {item.date}
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, item.dto[0]?.mallId)}>
                                            {item.dto.length > 0 && item.dto[0].clickCount != 0 ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.dto[0].name}`}
                                                    </Stack>
                                                    <Stack>
                                                        {check == 'click' ? `${item.dto[0].clickCount}회` : `${item.dto[0].clickCount}명`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, item.dto[1]?.mallId)}>
                                            {item.dto.length > 1 && item.dto[1].clickCount != 0 ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.dto[1].name}`}
                                                    </Stack>
                                                    <Stack>
                                                        {check == 'click' ? `${item.dto[1].clickCount}회` : `${item.dto[1].clickCount}명`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, item.dto[2]?.mallId)}>
                                            {item.dto.length > 2 && item.dto[2].clickCount != 0 ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.dto[2].name}`}
                                                    </Stack>
                                                    <Stack>
                                                        {check == 'click' ? `${item.dto[2].clickCount}회` : `${item.dto[2].clickCount}명`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        } else if(check == 'style') {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell align="center">
                                            {item.date}
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, dataContext.MALL.find((v) => {return v.mall.name == item.contents[0]?.mallName}).mall.id)}>
                                            {item.contents.length > 0 ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.contents[0].mallName}`}
                                                    </Stack>
                                                    <Stack>
                                                        {`${item.contents[0].count}회`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, dataContext.MALL.find((v) => {return v.mall.name == item.contents[1]?.mallName}).mall.id)}>
                                            {item.contents.length > 1 ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.contents[1].mallName}`}
                                                    </Stack>
                                                    <Stack>
                                                        {`${item.contents[1].count}회`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, dataContext.MALL.find((v) => {return v.mall.name == item.contents[2]?.mallName}).mall.id)}>
                                            {item.contents.length > 2 ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.contents[2].mallName}`}
                                                    </Stack>
                                                    <Stack>
                                                        {`${item.contents[2].count}회`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        } else if(check == 'detail') {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell align="center">
                                            {item.date}
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, item.contents[0]?.mall.id)}>
                                            {item.contents.length > 0 ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.contents[0].mall.name}`}
                                                    </Stack>
                                                    <Stack>
                                                        {`${item.contents[0].clickCounts}회`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, item.contents[1]?.mall.id)}>
                                            {item.contents.length > 1 ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.contents[1].mall.name}`}
                                                    </Stack>
                                                    <Stack>
                                                        {`${item.contents[1].clickCounts}회`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, item.contents[2]?.mall.id)}>
                                            {item.contents.length > 2 ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.contents[2].mall.name}`}
                                                    </Stack>
                                                    <Stack>
                                                        {`${item.contents[2].clickCounts}회`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        } else if(check == 'cart' || check == 'sale') {
                            return (
                                <Fragment key={item.id}>
                                    <TableRow
                                        hover
                                        key={item.id}
                                    >
                                        <TableCell align="center">
                                            {item.aggregateDate}
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, item.rank1?.mallId)}>
                                            {item.rank1.mallName !== '' ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.rank1.mallName}`}
                                                    </Stack>
                                                    <Stack>
                                                        {`${item.rank1.salesPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, item.rank2?.mallId)}>
                                            {item.rank2.mallName !== '' ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.rank2.mallName}`}
                                                    </Stack>
                                                    <Stack>
                                                        {`${item.rank2.salesPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                        <TableCell align="center"
onClick={() => newSet(check, item.rank3?.mallId)}>
                                            {item.rank3.mallName !== '' ?
                                                <Stack direction='column'>
                                                    <Stack>
                                                        {`${item.rank3.mallName}`}
                                                    </Stack>
                                                    <Stack>
                                                        {`${item.rank3.salesPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}
                                                    </Stack>
                                                </Stack>
                                                :
                                                '-'
                                            }
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            );
                        }
                    })}
                </TableBody>
            </Table>
        </>
    )
}

export default GraphAllList;
