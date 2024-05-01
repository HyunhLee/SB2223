import React, {FC, useEffect, useState} from 'react';
import type {ApexOptions} from 'apexcharts';
import {
    CardHeader, IconButton, Stack,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {Chart} from "../chart";
import {useTranslation} from "react-i18next";
import {MarketingDialog} from "../dialog/marketing-dialog";
import moment from "moment";
import {DefModel, SearchDef} from "../../types/marketing-model";
import SearchIcon from "@mui/icons-material/Search";
import i18n from "i18next";
import HelpIcon from "@mui/icons-material/Help";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";

interface ListTableProps {
    graph: DefModel[];
    check: string;
    search: SearchDef;
}

const GraphList: FC<ListTableProps> = (props) => {
    const {graph, check, search} = props;
    const {t} = useTranslation();
    const theme = useTheme();
    const [selectedSeries, setSelectedSeries] = useState([`${t("label_click")}`, `${t("label_add")}`, `${t("label_detail")}`, `${t("label_user")}`]);
    const [datas, setDatas] = useState<number[]>([]);
    const [dates, setDates] = useState<string[]>([]);
    const [openClick, setOpenClick] = useState<boolean>(false);
    const [openStyle, setOpenStyle] = useState<boolean>(false);
    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [openUser, setOpenUser] = useState<boolean>(false);

    useEffect(() => {
        setSelectedSeries([`${t("label_click")}`, `${t("label_add")}`, `${t("label_detail")}`, `${t("label_user")}`])
    }, [i18n.language])

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
                } else if (check == 'detail') {
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



    const val = () => {
        let result = '';
        if(check == 'click') {
            result = `${t("label_click")}`
        } else if(check == 'style') {
            result = `${t("label_add")}`
        } else if(check == 'detail') {
            result = `${t("label_detail")}`
        } else if(check == 'user') {
            result = `${t("label_user")}`
        }
        return result;
    }

    const data = {
        series: [
            {
                // color: '#4CAF50',
                data: datas,
                name: val()
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
        } else if (check == 'user') {
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
        } else if (check == 'user') {
            setOpenUser(false);
        }
    }

    const title = () => {
        let tt = '';
        if (check == 'click') {
            tt = `${t('components_marketing_clickList_cardHeader_title')}`
        } else if (check == 'style') {
            tt = `${t("components_marketing_styleList_cardHeader_title")}`
        } else if (check == 'detail') {
            tt = `${t("components_marketing_detailList_cardHeader_title")}`
        } else if (check == 'user') {
            tt = `${t("components_marketing_userList_cardHeader_title")}`
        }
        return tt;
    }

    const helpText = () =>{
        let text = '';
        if(check == 'click'){
            text =`${t('components_marketing_clickList_cardHeader_description')}`
        }else if(check == 'style'){
            text =`${t("components_marketing_styleList_cardHeader_description")}`
        }else if(check == 'detail'){
            text =`${t("components_marketing_detailList_cardHeader_description")}`
        }else if(check == 'user'){
            text =`${t("components_marketing_userList_cardHeader_description")}`
        }
        return text;
    }

    return (
        <>
            <Stack direction='row'>
                <CardHeader
                    title={title()}
                />
                <CustomWidthTooltip title={helpText()} sx={{whiteSpace: 'pre-wrap', mt:0.5}} placement="bottom" arrow>
                    <IconButton sx={{ml: -3.5, mr: 2, height: 20, mt: 4.2}}>
                        <HelpIcon color="primary" fontSize="small"/>
                    </IconButton>
                </CustomWidthTooltip>
                <IconButton
                    sx={{mt: 3, ml: -3, height: 40}}
                    onClick={handleOpen}>
                    <SearchIcon/>
                </IconButton>
            </Stack>
            <Chart
                height={400}
                options={chartOptions}
                series={chartSeries}
                type="line"
            />
            <MarketingDialog
                check={check}
                onClose={handleClose}
                open={openClick}
                startDate={search.startDate}
                endDate={search.endDate}
                brandId={search.brandId}
            />
            <MarketingDialog
                check={check}
                onClose={handleClose}
                open={openStyle}
                startDate={search.startDate}
                endDate={search.endDate}
                brandId={search.brandId}
            />
            <MarketingDialog
                check={check}
                onClose={handleClose}
                open={openDetail}
                startDate={search.startDate}
                endDate={search.endDate}
                brandId={search.brandId}
            />
            <MarketingDialog
                check={check}
                onClose={handleClose}
                open={openUser}
                startDate={search.startDate}
                endDate={search.endDate}
                brandId={search.brandId}
            />
        </>
    )
}

export default GraphList;
