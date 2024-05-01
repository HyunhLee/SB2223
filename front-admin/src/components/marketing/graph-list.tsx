import React, {FC, useEffect, useState} from 'react';
import type {ApexOptions} from 'apexcharts';
import {CardHeader, IconButton, Stack,} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Chart} from "../chart";
import {MarketingDialog} from "../dialog/marketing-dialog";
import moment from "moment";
import {DefModel, SearchDef} from "../../types/marketing-model/marketing-model";
import SearchIcon from "@mui/icons-material/Search";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";
import HelpIcon from "@mui/icons-material/Help";

interface ListTableProps {
    graph: DefModel[];
    check: string;
    search: SearchDef;
}

const GraphList: FC<ListTableProps> = (props) => {
    const {graph, check, search} = props;
    const theme = useTheme();
    const [selectedSeries, setSelectedSeries] = useState(['클릭수', '저장횟수', '상품조회수', '회원가입수']);
    const [datas, setDatas] = useState<number[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [openClick, setOpenClick] = useState<boolean>(false);
    const [openStyle, setOpenStyle] = useState<boolean>(false);
    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [openUser, setOpenUser] = useState<boolean>(false);
    const [chart, setChart] = useState<string>('line');

    useEffect(() => {
        if (graph) {
            if (graph.length > 0) {
                const res = [];
                graph.forEach(cl => res.push(cl.count));
                setDatas(res);

                if (check == 'style') {
                    const dt = [];
                    graph.forEach(date => dt.push(moment(date.createdDate).format('YY/MM/DD')));
                    setDates(dt);
                } else if(check == 'detail') {
                    const dt = [];
                    graph.forEach(date => dt.push(moment(date.aggregateDate).format('YY/MM/DD')));
                    setDates(dt);
                } else {
                    const dt = [];
                    graph.forEach(date => dt.push(moment(date.date).format('YY/MM/DD')));
                    setDates(dt);
                }
            }
        }
    }, [graph])

    const name = () => {
        let n = '';
        if(check == 'click') {
            n = '클릭수'
        } else if(check == 'style') {
            n = '저장횟수'
        } else if(check == 'detail') {
            n = '상품조회수'
        } else if(check == 'user') {
            n = '회원가입수'
        }
        return n;
    }

    const data = {
        series: [
            {
                // color: '#4CAF50',
                data: datas,
                name: name()
            }
        ],
        xaxis: {
            dataPoints: dates
        }
    };

    const chartSeries = data.series.filter((item) => selectedSeries.includes(item.name));

    const chartOptions: ApexOptions = {
        chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
                show: true,
                offsetX: -20
            }
        },
        // colors: chartSeries.map((item) => item.color),
        colors: ['#a900af'],
        dataLabels: {
            enabled: true
        },
        fill: {
            opacity: 1
        },
        grid: {
            borderColor: theme.palette.divider,
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        legend: {
            show: false
        },
        markers: {
            hover: {
                size: undefined,
                sizeOffset: 2
            },
            radius: 2,
            shape: 'circle',
            size: 5,
            strokeWidth: 0
        },
        stroke: {
            curve: 'straight',
            lineCap: 'butt',
            width: 3
        },
        theme: {
            mode: theme.palette.mode
        },
        xaxis: {
            axisBorder: {
                color: theme.palette.divider
            },
            axisTicks: {
                color: theme.palette.divider,
                show: true
            },
            categories: data.xaxis.dataPoints,
            labels: {
                style: {
                    colors: theme.palette.text.secondary
                }
            }
        },
        yaxis: [
            {
                axisBorder: {
                    color: theme.palette.divider,
                    show: true
                },
                axisTicks: {
                    color: theme.palette.divider,
                    show: true
                },
                labels: {
                    style: {
                        colors: theme.palette.text.secondary
                    }
                }
            }
        ]
    };

    const handleOpen = () => {
        if (check == 'click') {
            setOpenClick(true);
        } else if (check == 'style') {
            setOpenStyle(true);
        } else if (check == 'detail') {
            setOpenDetail(true);
        } else if(check == 'user') {
            setOpenUser(true);
        }
    }

    const handleClose = () => {
        if (check == 'click') {
            setOpenClick(false);
        } else if (check == 'style') {
            setOpenStyle(false);
        } else if (check == 'detail') {
            setOpenDetail(false);
        } else if(check == 'user') {
            setOpenUser(false);
        }
    }

    const title = () => {
        let t = '';
        if(check == 'click') {
            t = '상품 클릭 수'
        } else if(check == 'style') {
            t = 'MY 스타일 저장 수'
        } else if(check == 'detail') {
            t = '상품 상세 페이지 조회 수'
        } else if(check == 'user') {
            t = '회원 가입 수'
        }
        return t;
    }

    const changeChart = (value) => {
        setChart(value);
    }

    const helpText = () =>{
        let text = '';
        if(check == 'click'){
            text ='상품 클릭 수\n\n -피팅룸에서 유저가 상품썸네일을 클릭한 총합.'
        }else if(check == 'style'){
            text ='MY 스타일 저장 수\n\n -피팅룸에서 유저가 스타일을 저장한 총 횟수'
        }else if(check == 'detail'){
            text ='상품 상세 페이지 조회 수\n\n -유저가 피팅룸에서 [i]버튼을 클릭하여 외부링크(자사몰 상품상세페이지)로 나가는 조회수 총합.'
        }else if(check == 'user'){
            text ='회원 가입 수\n\n -피팅룸을 통해 회원가입한 수를 집계.'
        }
        return text;
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
                    <IconButton
                        sx={{mt: 3, ml: -3, height: 40}}
                        onClick={handleOpen}>
                        <SearchIcon/>
                    </IconButton>
                </Stack>
            </Stack>
            <Chart
                hidden={chart == 'pie'}
                height={400}
                options={chartOptions}
                series={chartSeries}
                type={chart == 'line' ? 'line' : 'bar'}
            />
            <Chart
                hidden={chart != 'pie'}
                height={400}
                options={{
                    labels:dates
                }}
                series={datas}
                type="pie"
            />
            <MarketingDialog
                check={check}
                onClose={handleClose}
                open={openClick}
                startDate={search.startDate}
                endDate={search.endDate}
                mallId={search.mallId}
                brandId={search.brandId}
            />
            <MarketingDialog
                check={check}
                onClose={handleClose}
                open={openStyle}
                startDate={search.startDate}
                endDate={search.endDate}
                mallId={search.mallId}
                brandId={search.brandId}
            />
            <MarketingDialog
                check={check}
                onClose={handleClose}
                open={openDetail}
                startDate={search.startDate}
                endDate={search.endDate}
                mallId={search.mallId}
                brandId={search.brandId}
            />
            <MarketingDialog
                check={check}
                onClose={handleClose}
                open={openUser}
                startDate={search.startDate}
                endDate={search.endDate}
                mallId={search.mallId}
            />
        </>
    )
}

export default GraphList;
