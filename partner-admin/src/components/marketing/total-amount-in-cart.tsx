import react, {useContext, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Chart} from "../chart";
import type { ApexOptions } from 'apexcharts';
import { alpha, useTheme } from '@mui/material/styles';
import {Stack, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {Close} from "@mui/icons-material";
import TotalAmountInCartDetail from "./total-amount-in-cart-detail";
import moment from "moment";
import {AmountCartModel, DefaultAmountCartModel} from "../../types/marketing-fittingroom";
import {marketingApi} from "../../api/marketing-api";
import {brandApi} from "../../api/brand-api";
import HelpIcon from "@mui/icons-material/Help";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";
import React from "react";
import _ from "lodash";
import {DataContext} from "../../contexts/data-context";
moment.locale('ko');

const TotalAmountInCart = (props) => {
  const {search, requestList, setSearch,} = props;
  const {t} = useTranslation();
  const theme = useTheme();
  const mallId = localStorage.getItem('mallId')
  const [trigger, setTrigger] = useState(false);

  let topBrandId;
  useEffect(() => {
    (async () => {
      const result = await brandApi.getMallBrands(mallId);
      topBrandId = result.data[0].id
      if(search.brandId == null){
        setSearch({...search, brandId: topBrandId})
        setTrigger(true)
      }else{
        setSearch({...search})
      }
    })()
  },[]);

  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState<AmountCartModel[]>(DefaultAmountCartModel)

  const getData = async () => {
    if(!search.startDate || !search.endDate || !search.brandId ){
      window.confirm(`${t("components_marketing_totalAmountInCart_getData")}`);
      return;
    }

   const result = await marketingApi.getCartAmountChartData({...search, mallId: mallId});
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
        name: `${t("components_marketing_totalAmountInCart_dataName")}`
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
    if(requestList && trigger){
      getData();
      getPricePoint();
      getDatePoint();
    }
  },[requestList, trigger])

  const TotalAmountInCartDetailDialog = (props) => {
    const { open, close, search } = props;

    return (
      <>
        <Dialog
            sx={{'& .MuiDialog-paper': {width: 1400, maxHeight: 700}}}
            maxWidth='xl'
            open={open}>
          <Stack justifyContent='space-between' direction='row'>
            <DialogTitle>
              {t('components_marketing_totalAmountInCartDetail_title')}
            </DialogTitle>
            <IconButton sx={{width: 50, marginTop: 0}} onClick={() => close(false)}>
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

  const helpText = `${t('components_marketing_totalAmountInCart_description')}`
      return (
        <>
          <Stack sx={{display: 'flex' , flexDirection: 'row'}}>
          <Typography variant="h6" component="h6" sx={{paddingTop: 3, paddingLeft: 3}}>
            {t('components_marketing_totalAmountInCart_title')}
          </Typography>
            <CustomWidthTooltip title={helpText} sx={{whiteSpace: 'pre-wrap', mt:0.5}} placement="bottom" arrow>
              <IconButton sx={{height: 20, mt: 3.2}}>
                <HelpIcon color="primary" fontSize="small"/>
              </IconButton>
            </CustomWidthTooltip>
            <IconButton sx={{marginTop: 2.3}} onClick={() => setOpenDialog(true)}>
              <SearchIcon/>
            </IconButton >
          </Stack>
          <Chart
            options={chartOptions}
            series={dataSet.series}
            type="line"
            height={500}
          />
          <TotalAmountInCartDetailDialog open={openDialog} close={setOpenDialog} search={search}/>
        </>

      );
};


export default TotalAmountInCart;