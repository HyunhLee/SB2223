import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useTheme} from "@mui/material/styles";
import moment from "moment/moment";
import {ApexOptions} from "apexcharts";
import {Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import TotalPurchaseInCartDetail from "./total-purchase-in-cart-detail";
import SearchIcon from "@mui/icons-material/Search";
import {Chart} from "../chart";
import {marketingApi} from "../../api/marketing-api";
import {DefaultPurchaseCartModel, purchaseCartModel} from "../../types/marketing-fittingroom";
import {brandApi} from "../../api/brand-api";
import HelpIcon from "@mui/icons-material/Help";
import {CustomWidthTooltip} from "../widgets/custom-tooltip";

const TotalPurchaseInCart = (props) => {
  //main dashboard에서 넘어온 값
  const {search, requestList,  setSearch} = props;
  const {t} = useTranslation();
  const theme = useTheme();
  const mallId = localStorage.getItem('mallId');
  const [trigger, setTrigger] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState<purchaseCartModel[]>([]);

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

  const getData = async () => {
    if(!search.startDate || !search.endDate || !search.brandId ){
      window.confirm(`${t("components_marketing_totalAmountInCart_getData")}`);
      return;
    }
    const result = await marketingApi.getCartPurchaseChartData({...search, mallId: mallId});
    setData(result)
  }
  const getDatePoint = () => {
    let arr = [];
    if(data?.length > 0){
    for(let value of data){
      arr.push(moment(value.date).format('YY/MM/DD'));
    }
    }
    return arr;
  }


  //result of data search
  const getPricePoint = () => {
    let chartPrice = []
    if(data?.length > 0) {
      for (let value of data) {
        chartPrice.push(value.count)
      }
    }
    return chartPrice
  }

  const dataSet = {
    series: [
      {
        // color: '#4CAF50',
        data: getPricePoint(),
        name: `${t("components_marketing_totalPurchaseInCartDetail_dataName")}`
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




  const TotalPurchaseInCartDetailDialog = (props) => {
    const { open, close, search } = props;

    return (
      <>
        <Dialog
            sx={{'& .MuiDialog-paper': {width: 1400, maxHeight: 700}}}
            maxWidth='xl'
            open={open}>
          <Stack justifyContent='space-between' direction='row'>
            <DialogTitle>
              {t('components_marketing_totalPurchaseInCartDetail_title')}
            </DialogTitle>
            <IconButton sx={{width: 50, marginTop: 0}} onClick={() => close(false)}>
              <Close/>
            </IconButton>
          </Stack>
          <DialogContent dividers>
            <TotalPurchaseInCartDetail searchData={search}/>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const helpText = `${t('components_marketing_totalPurchaseInCart_description')}`

  return (
    <>
      <Stack sx={{display: 'flex' , flexDirection: 'row'}}>
        <Typography variant="h6" component="h6" sx={{paddingTop: 3, paddingLeft: 3}}>
          {t('components_marketing_totalPurchaseInCart_title')}
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
      <TotalPurchaseInCartDetailDialog open={openDialog} close={setOpenDialog} search={search}/>
    </>

  );
}
export default TotalPurchaseInCart;