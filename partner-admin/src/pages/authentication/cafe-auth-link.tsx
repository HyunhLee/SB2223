import {useRouter} from "next/router";
import {useEffect} from "react";
import {cafeClientIdConfig} from "../../config";
import { Stack} from "@mui/material";


const CafeAuthLink = () => {
  const router = useRouter();

  const data = {
    client_id: cafeClientIdConfig.clientId,
    state: cafeClientIdConfig.state,
    redirect_uri: cafeClientIdConfig.redirectUri,
    scope: cafeClientIdConfig.scope,
  }

  useEffect(() => {
    (async () => {
      const {mall_id} = router.query;
      console.log(mall_id, 'mallId');
      if(mall_id){
        let url = `https://${mall_id}.cafe24api.com/api/v2/oauth/authorize?response_type=code&client_id=${data.client_id}&state=${data.state}&redirect_uri=${data.redirect_uri}&scope=${data.scope}`;
        window.location.href = url;
      }

    })();
  }, [router])


  return (
    <Stack
     sx={{
       height: 500,
       display:'flex',
       textAlign:'center',
       justifyContent:'center',
       alignItems:'center'}}>
      로딩 중입니다.
    </Stack>
  )

}

export default CafeAuthLink