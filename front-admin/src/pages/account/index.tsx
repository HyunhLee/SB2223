import type {NextPage} from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Divider, Grid,
  IconButton,
  Table, TableBody, TableCell,
  TableHead, TableRow, TableSortLabel, Tooltip,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {BlogNewsletter} from '../../components/blog/blog-newsletter';
import {BlogPostCard} from '../../components/blog/blog-post-card';
import {ArrowLeft as ArrowLeftIcon} from '../../icons/arrow-left';
import {AuthGuard} from "../../components/authentication/auth-guard";
import {DashboardLayout} from "../../components/dashboard/dashboard-layout";
import {DotsHorizontal as DotsHorizontalIcon} from "../../icons/dots-horizontal";
import {Scrollbar} from "../../components/scrollbar";
import {SeverityPill} from "../../components/severity-pill";
import {format} from "date-fns";
import {ChevronRight as ChevronRightIcon} from "../../icons/chevron-right";
import {useEffect, useState} from "react";
import {customerApi} from "../../api/customer-api";
import {Plus as PlusIcon} from "../../icons/plus";
import {Upload as UploadIcon} from "../../icons/upload";
import {Download as DownloadIcon} from "../../icons/download";

const Account: NextPage = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    (async () => {
      await getAccounts()
    })()
  }, []);

  const getAccounts = async () => {
    const query = {
      size, page
    }
    const data = await customerApi.getAccounts(query);
    setAccounts(data);
  }

  return (
    <>
      <Head>
        <title>
          Account | Style Bot
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  Accounts
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Card>
            <Scrollbar>
              <Table sx={{minWidth: 700}}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      User Id
                    </TableCell>
                    <TableCell>
                      Nickname
                    </TableCell>
                    <TableCell>
                      Profile
                    </TableCell>
                    <TableCell align="right">
                      Created Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow
                      hover
                      key={account.userId}
                    >
                      <TableCell>
                        {account.userId}
                      </TableCell>
                      <TableCell>
                        {account.nickmame}
                      </TableCell>
                      <TableCell>
                        {account.profileImageUrl}
                      </TableCell>
                      <TableCell align="right">
                        {account.createdDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </Card>
        </Container>
      </Box>
    </>
  );
};

Account.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Account;
