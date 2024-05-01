import React, {useEffect, useState} from 'react';
import {NextPage} from "next";
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import Head from "next/head";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import B2bPartnerCreateMallDetail from "../../components/b2b-partner/b2b-partner-create-mall-detail";
import {useRouter} from "next/router";
import {B2bPartnerMallDetailModel, defaultMallDetailModel} from "../../types/b2b-partner-model/b2b-partner-mall-model";
import toast from "react-hot-toast";
import {b2bPartnerMallApi} from "../../b2b-partner-api/b2b-partner-mall-api";
import SaveIcon from "@mui/icons-material/Save";

const B2BPartnerCorrectionMall : NextPage = (props) => {
  const router = useRouter();
  const {id} = router.query;
  const [mallModel, setMallModel] = useState<B2bPartnerMallDetailModel>(defaultMallDetailModel);

  const beforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
    console.log('##############refresh#############')

  };

  //새로고침시 경고 팝업창
  useEffect(() => {
    try {
      window.addEventListener('beforeunload', beforeUnload);
      return () => {
        window.removeEventListener('beforeunload', beforeUnload);
      };
    } catch (error) {
      console.log(error);
    }
  }, []);


  useEffect(() => {
    if(id && id !== '0') {
      getMall(id);
    }
  }, [router.query])

  const getMall = async (id) => {
    await b2bPartnerMallApi.getMallDetail(id).then((res) => {
      res.brands.forEach(v => {
        if(v.brandStyleKeyWords.length == 0) {
          return v.styleKeywordsList = [];
        } else if(v.brandStyleKeyWords.length > 0) {
          const keywordList = [];
          v.brandStyleKeyWords.forEach((k) => {
            keywordList.push(k.styleKeyword);
          })
          return v.styleKeywordsList = keywordList.map(v => {
            return v;
          });
        }
      })
      setMallModel(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleCorrectionAccount = async (): Promise<void> => {
    console.log(mallModel);
    if(!mallModel.name) {
      toast.error('회사명을 입력해주세요.');
      return;
    }
    for(let i = 0; i < mallModel.brands.length; i++) {
      if(!mallModel.brands[i].nameKo) {
        toast.error(`${i+1}번째 브랜드명(국문)을 입력해주세요.`);
        return;
      }
      if(!mallModel.brands[i].nameEn) {
        toast.error(`${i+1}번째 브랜드명(영문)을 입력해주세요.`);
        return;
      }
      if (mallModel.brands[i].styleKeywordsList.length == 0) {
        toast.error(`${i+1}번째 키워드를 선택해주세요.`);
        return;
      }
      if (mallModel.brands[i].styleKeywordsList.length > 2) {
        toast.error(`${i+1}번째 키워드 선택은 2개만 가능합니다.`);
        return;
      }
    }
    if(!mallModel.gender) {
      toast.error('성별을 입력해주세요.');
      return;
    }
    if(mallModel.jennifitCntFirstmonth == 0){
      toast.error('첫 달 제니핏 신청 가능 개수를 기입해주세요.');
      return;
    }

    if(window.confirm('생성하시겠습니까?')) {
      await b2bPartnerMallApi.putPartnerMall(mallModel.id, mallModel
      ).then(res => {
        console.log(res);
        toast.success('생성되었습니다.')
        router.push('/b2b-partner/b2b-partner-list?storeSearch=true');
      }).catch(err => {
        console.log(err);
        toast.error('생성에 실패했습니다.');
      })
    }
  }

  const handleBack = (e) =>{
    e.preventDefault();
    router.push('/b2b-partner/b2b-partner-list?storeSearch=true');
  }

  return(
    <>
      <Head>
        Correction Partner Account | Style Bot
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box>
            <Grid
              container
              justifyContent="space-between"
              sx={{mb: 2}}
            >
              <Grid item
sx={{display: 'flex', justifyContent: "flex-start"}}>
                <ArrowBackIcon
                  fontSize="medium"
                  sx={{mr: 2, mt:1, cursor: 'pointer'}}
                  onClick={handleBack}
                />
                <Typography variant="h4">
                  B2B 회사 상세
                </Typography>
              </Grid>
              <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  size="small"
                  onClick={handleCorrectionAccount}
              >
                수정
              </Button>
            </Grid>
          </Box>
          <Card sx={{pt: 5, pb: 5}}>
            <B2bPartnerCreateMallDetail
              mallModel={mallModel}
              setMallModel={setMallModel}
            />
          </Card>
        </Container>
      </Box>
    </>
  )
};

B2BPartnerCorrectionMall.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);
export default B2BPartnerCorrectionMall;