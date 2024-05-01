import Head from "next/head";
import React, {useCallback, useEffect, useState} from "react";
import {Box, Button, Card, Container, Grid, Typography} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import {CustomHairDetail} from "../../../components/avatar-custom-components/custom-hair-detail";
import {NextPage} from "next";
import {AuthGuard} from "../../../components/authentication/auth-guard";
import {DashboardLayout} from "../../../components/dashboard/dashboard-layout";
import {useRouter} from "next/router";
import {useMounted} from "../../../hooks/use-mounted";
import {AvatarHair} from "../../../types/avatar-custom";
import {avatarApi} from "../../../api/avatar-api";
import toast from "react-hot-toast";

const HairModify: NextPage = () => {

    const router = useRouter();
    const {avatarCustomModelId} = router.query;
    const isMounted = useMounted();
    const [hairs, setHairs] = useState<AvatarHair>({
        id: null,
        listOrder: null,
        activated: null,
        avatarHairColors: [],
        hairLengthType: "",
        hairType: "",
        hasBangs: null,
        mainImageUrl: "",
        mainImage: []
    });

    const [search, setSearch] = useState({
        id: avatarCustomModelId
    })

    const getHairs = useCallback(async () => {
        try {
            const query = {...search}
            const result = await avatarApi.getAvatarHairs(query);
            setHairs(result.lists[0]);
        } catch (err) {
            console.error(err);
            toast.error('얼굴 데이터를 불러오는데 실패하였습니다.');
        }
    },[])

    useEffect(() => {
        if (avatarCustomModelId && avatarCustomModelId !== '0') {
            (async () => {
                await getHairs();
            })()
        }
    }, [isMounted]);

    return (
        <>
            <Head>
                Avatar Custom | Style Bot
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Box sx={{mb: 4}}>
                        <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                        >
                            <Grid item>
                                <Typography variant="h4">
                                    헤어스타일 수정
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                sx={{m: -1}}>
                                <Button
                                    component="a"
                                    startIcon={<SaveIcon fontSize="small"/>}
                                    sx={{ m: 1 }}
                                    variant="contained"
                                >
                                    수정
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Card>
                        <CustomHairDetail
                            data={hairs}
                            setdata={setHairs}
                        />
                    </Card>
                </Container>
            </Box>
        </>
    )
}

HairModify.getLayout = (page) => (
    <AuthGuard>
        <DashboardLayout>
            {page}
        </DashboardLayout>
    </AuthGuard>
);

export default HairModify;