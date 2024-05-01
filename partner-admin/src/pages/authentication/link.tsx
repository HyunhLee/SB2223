import {useRouter} from "next/router";
import { useEffect, useState} from "react";
import {partnerAuthApi} from "../../api/partner-auth-api";

const Link = () => {
    const router = useRouter();
    const [error, setError] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        (async () => {
            const {code} = router.query;
            if (code) {
                if(token){
                    try {
                        let data = {
                            code: code,
                            mallId: localStorage.getItem("mallId"),
                        }
                        await partnerAuthApi.login({...data});
                        await router.push(`/product-linkage-management/product-linkage-management`);
                        return;

                    } catch (err) {
                        setError('server error');
                    }
                }else{
                    await router.push(`/authentication/login`);
                    return;
                }

            }

        })();
    }, [router])

    if (error) {
        return <div>{error}</div>;
    }

    return <div>Loading...</div>;
}

export default Link;