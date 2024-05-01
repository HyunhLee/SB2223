import {Stack, Card, Theme, useMediaQuery, Typography, Button,} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {PropertyList} from "../property-list";
import {PropertyListItem} from "../property-list-item";
import {useEffect, useState} from "react";
import moment from "moment";
import {getMonth} from "../../utils/data-convert";

export const PlanDetail = (props) => {
  const {i18n, t} = useTranslation();
  const {data} = props;
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const align = mdUp ? 'horizontal' : 'vertical';
  const [curMon, setCurMon] = useState(0)
  const [year, setYear] = useState(0)
  const lastMonth = moment(data.planEndDate).month() + 1
  const lastYear = moment(data.planEndDate).year()

  const getLastMonth = () => {
    const curYear = moment(new Date()).year()
    const curDate = moment(new Date()).month()+1
    if(curDate == 12){
      setYear(curYear+1)
    }else{
      setYear(curYear)
    }
    setCurMon(curDate)
  }

  useEffect(() => {
    getLastMonth();
  },[])

  return (
    <>
      <Card>
        <PropertyList>
          <PropertyListItem
            align={align}
            divider
            label={t('component_btbMyPagePlan_Detail_label_plan')}
            value={data.b2bServicePlanType}
          />
          <PropertyListItem
            align={align}
            divider
            label={t('component_btbMyPagePlan_Detail_label_subscriptionPeriod')}
            value={`${moment(data?.planStartDate).format('ll')} ~ ${moment(data?.planEndDate).format('ll')}`}
          />
          <PropertyListItem
            align={align}
            divider
            label={t('component_btbMyPagePlan_Detail_label_leftCountJennieFit')}
            value={`${data.jennifitCnt - data.jennifitUsedCnt} 회 / ${data.jennifitCnt} 회`}
          />
          <Stack direction={'row'} sx={{display: 'flex', alignItems:'center',}}>
          <PropertyListItem
            align={'horizontal'}
            sx={{width:190, ml:1}}
            divider
            label={t('component_btbMyPagePlan_Detail_label_resetJennieFitApply')}
            value={''}
          />
            {lastMonth - curMon === 0 && lastYear - year === 0 ?
                <Stack direction={'row'} sx={{display: 'flex', alignItems: 'center', ml: 1}}>
                  <Typography sx={{
                    fontSize: '14px',
                    mr: 2.5,
                    color: '#65748B'
                  }}>{moment(`${year}-${curMon}`).endOf('month').format('ll')}</Typography>
                  <Typography sx={{
                    fontSize: '14px',
                    mr: 0.5,
                    color: '#65748B'
                  }}>{t('component_btbMyPagePlan_Detail_label_extendSubscribe')}</Typography>
                  <Typography sx={{fontSize: '14px', color: 'blue', cursor: 'pointer'}}><a
                      href="mailto:contact@stylebot.co.kr">(문의하기)</a></Typography>
                </Stack>
                : lastYear - year >= 1 ? (<Typography sx={{
                      fontSize: '14px',
                      ml: 1,
                      color: '#65748B'
                    }}>{moment(`${year}-${curMon + 1}`).format('ll')}</Typography>) :
                    0 > lastMonth - curMon && 0 == lastYear - year ? (<Typography sx={{
                      fontSize: '14px',
                      ml: 1,
                      color: '#65748B'
                    }}>{t('component_btbMyPagePlan_Detail_label_endSubscribe')}</Typography>) : (<Typography sx={{
                      fontSize: '14px',
                      ml: 1,
                      color: '#65748B'
                    }}>{t('component_btbMyPagePlan_Detail_label_endSubscribe')}</Typography>)
            }
          </Stack>
        </PropertyList>
      </Card>
    </>
  )
}