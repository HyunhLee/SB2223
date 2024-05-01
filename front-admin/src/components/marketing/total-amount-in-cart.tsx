import React, {useEffect, useState} from 'react';
import {Chart} from "../chart";
import type {ApexOptions} from 'apexcharts';
import {useTheme} from '@mui/material/styles';
import {Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {Close} from "@mui/icons-material";
import TotalAmountInCartDetail from "./total-amount-in-cart-detail";
import moment from "moment";
import {AmountCartModel} from "../../types/marketing-model/marketing-fittingroom";
import {marketingApi} from "../../api/marketing-api";
import HelpIcon from "@mui/icons-material/Help";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";

moment.locale('ko');

const TotalAmountInCart = (props) => {

  const {search, requestList} = props;
  const theme = useTheme();

  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState<AmountCartModel[]>([]);

  const getData = async () => {
    if(!search.startDate || !search.endDate || !search.brandId){
      window.confirm('검색할 기간 및 브랜드를 입력 후 검색해주세요');
      return;
    }
   const result = await marketingApi.getCartAmountChartData(search);
   setData(result)

  }
  const getDatePoint = () => {
    let arr = [];
    if(data?.length > 0){
      for(let value of data){
        arr.push(moment(value.aggregateDate).format('YY/MM/DD'));
      }
    }
    return arr;
  }


  //result of data search
  const getPricePoint = () => {
    let chartPrice = []
    if(data?.length > 0){
      for(let value of data){
        chartPrice.push(value.salesPrice)
      }
    }
    return chartPrice
  }

  const dataSet = {
    series: [
      {
        // color: '#4CAF50',
        data: getPricePoint(),
        name: '장바구니 총액'
      }
    ],
    xaxis: {
      dataPoints: getDatePoint()
    }
  };

  //chart option
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
      categories: dataSet.xaxis.dataPoints,
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


  useEffect(() =>{
    if(requestList){
      getData();
      getPricePoint();
      getDatePoint();
    }
  },[requestList])

  const TotalAmountInCartDetailDialog = (props) => {
    const { open, close, search } = props;

    return (
      <>
        <Dialog
            sx={{'& .MuiDialog-paper': {width: 1400, maxHeight: 700}}}
            maxWidth='xl'
            open={open}>
          <Stack justifyContent='space-between'
direction='row'>
            <DialogTitle>
              피팅룸 기여 장바구니 총액 상세
            </DialogTitle>
            <IconButton sx={{width: 50, marginTop: 0}}
onClick={() => close(false)}>
              <Close/>
            </IconButton>
          </Stack>
          <DialogContent dividers>
            <TotalAmountInCartDetail searchData={search}/>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  const helpText = '기여 장바구니 총액\n\n -유저들이 장바구니에 담은 상품가격의 총합.\n -장바구니 총액=상품구매금액.\n -상품구매금액=(판매가*수량)\n'

      return (
        <>
          <Stack justifyContent='space-between'
              direction='row'>
            <Stack sx={{display: 'flex' , flexDirection: 'row'}}>
            <Typography variant="h6"
  component="h6"
  sx={{paddingTop: 3, paddingLeft: 3}}>
              피팅룸 기여 장바구니 총액
            </Typography>
              <CustomWidthTooltip title={helpText}
sx={{whiteSpace: 'pre-wrap', mt:0.5}}
placement="bottom"
arrow>
                <IconButton sx={{ml: -0.5, height: 20, mt: 3.2}}>
                  <HelpIcon color="primary"
fontSize="small"/>
                </IconButton>
              </CustomWidthTooltip>
              <IconButton sx={{marginTop: 2 ,  ml: -1.2,}}
  onClick={() => setOpenDialog(true)}>
                <SearchIcon/>
              </IconButton >
            </Stack>
          </Stack>
          <Chart
            options={chartOptions}
            series={dataSet.series}
            type={'line'}
            height={500}
          />
          <TotalAmountInCartDetailDialog open={openDialog}
close={setOpenDialog}
search={search}/>
        </>

      );
};


export default TotalAmountInCart;