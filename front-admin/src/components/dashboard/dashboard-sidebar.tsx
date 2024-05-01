import type {FC} from 'react';
import {ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import type {TFunction} from 'react-i18next';
import {useTranslation} from 'react-i18next';
import type {Theme} from '@mui/material';
import {Box, Divider, Drawer, useMediaQuery} from '@mui/material';
import {Home as HomeIcon} from '../../icons/home';
import {Scrollbar} from '../scrollbar';
import {DashboardSidebarSection} from './dashboard-sidebar-section';
import {OrganizationPopover} from './organization-popover';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FaceIcon from '@mui/icons-material/Face';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import InventoryIcon from '@mui/icons-material/Inventory';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import {decode} from "../../utils/jwt";

interface DashboardSidebarProps {
  onClose: () => void;
  open: boolean;
}

interface Item {
  title: string;
  children?: Item[];
  chip?: ReactNode;
  icon?: ReactNode;
  path?: string;
  roles?: string[];
}

interface Section {
  title: string;
  items: Item[];
  roles?: string[];
}

const getSections = (t: TFunction): Section[] => [
  {
    title: t('Dashboard'),
    items: [
      {
        title: t('Overview'),
        path: '/dashboard/',
        icon: <HomeIcon fontSize="small" />,
        roles: ['ROLE_ADMIN_MASTER'],
      }
    ],
    roles: ['ROLE_ADMIN_MASTER'],
  },
  {
    title: 'Jennie Fit',
    items: [
      {
        icon: <InventoryIcon />,
        title: '내 옷 수동 등록',
        path: '/jennie-fit/my-closet-upload/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_CC', 'ROLE_ADMIN_USERFIT', 'ROLE_ADMIN_PRODUCTFIT', 'ROLE_WORKER_USERFIT', 'ROLE_WORKER_PRODUCTFIT'],
      },
      {
        icon: <CameraAltIcon />,
        title: 'Jennie C.C',
        path: '/jennie-fit/jennie-cc/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_CC'],
      },
      {
        icon: <AssignmentIcon />,
        title: '작업 현황 및 배정',
        path: '/jennie-fit/jennie-fit-assign/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_USERFIT', 'ROLE_ADMIN_PRODUCTFIT'],
      },
      {
        icon: <CloudUploadIcon />,
        title: 'Jennie FIT User',
        path: '/jennie-fit/jennie-fit-user/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_WORKER_USERFIT', 'ROLE_ADMIN_USERFIT'],
      },
      {
        icon: <CloudUploadIcon />,
        title: 'Jennie FIT Product',
        path: '/jennie-fit/jennie-fit-product/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_WORKER_PRODUCTFIT', 'ROLE_ADMIN_PRODUCTFIT'],
      },
      {
        icon: <FactCheckIcon />,
        title: 'Jennie FIT 검수',
        path: '/jennie-fit/jennie-fit-inspection/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_USERFIT', 'ROLE_ADMIN_PRODUCTFIT'],
      }
    ],
    roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_CC', 'ROLE_ADMIN_USERFIT', 'ROLE_ADMIN_PRODUCTFIT', 'ROLE_WORKER_USERFIT', 'ROLE_WORKER_PRODUCTFIT'],
  },
  {
    title: 'Jennie Product',
    items: [
      {
        icon: <InventoryIcon />,
        title: '스타일봇 수동 등록',
        path: '/jennie-product/jennie-product/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_PRODUCT'],
      }
      ,
      {
        icon: <InventoryIcon />,
        title: '전체 상품 리스트',
        path: '/jennie-product/jennie-product-total/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_PRODUCT'],
      }
    ],
    roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_PRODUCT'],
  },
  {
    title: 'JENNIE\'s PICK',
    items: [
      {
        icon: <FaceIcon />,
        title: '스타일 봇',
        path: '/style/jennies-pick/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_PICK', 'ROLE_WORKER_PICK'],
      },
      {
        icon: <FaceIcon />,
        title: '제니 솔루션(남)',
        path: '/b2b-partner/style-recommendation/indexMale/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_PICK', 'ROLE_WORKER_PICK'],
      },
      {
        icon: <FaceIcon />,
        title: '제니 솔루션(여)',
        path: '/b2b-partner/style-recommendation/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_PICK', 'ROLE_WORKER_PICK'],
      },
    ],
    roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_PICK', 'ROLE_WORKER_PICK'],
  },
  {
    title: '고객사 관리',
    items: [
      {
        icon: <InventoryIcon />,
        title: 'B2C 관리',
        children: [
          {
            title: '브랜드 관리',
            path: '/brand-management/brand-total/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_BRAND'],
          }

        ],
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_BRAND'],
      },
      {
        icon: <InventoryIcon />,
        title: 'B2B 관리',
        children: [
          {
            title: 'B2B 마케팅 대시보드',
            path: '/marketing-dashboard/marketing-dashboard/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
          },
          {
            title: 'B2B 회사 현황',
            path: '/b2b-partner/b2b-partner-list/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
          },
          {
            title: 'B2B 담당자 계정 관리',
            path: '/b2b-partner/b2b-partner-create-account/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
          },
          {
            title: 'FAQ',
            path: '/b2b-partner/faq/faq-list/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
          },
          {
            title: '공지사항',
            path: '/b2b-partner/notice/notice-list/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
          },
          {
            title: '1:1문의',
            path: '/b2b-partner/b2b-inquiry/inquiry/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
          }
        ],
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
      }
    ],
    roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B', 'ROLE_ADMIN_BRAND'],
  },
  {
    title: '한섬',
    items: [
      {
        icon: <AssignmentIcon />,
        title: '한섬 작업 현황 및 배정',
        path: '/handsome/handsome-fit-assign/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_HANDSOME_PRODUCTFIT'],
      },
      {
        icon: <CloudUploadIcon />,
        title: '한섬 Jennie FIT Product',
        path: '/handsome/handsome-jennie-fit-product/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_WORKER_HANDSOME'],
      },
      {
        icon: <FactCheckIcon />,
        title: '한섬 Jennie FIT 검수',
        path: '/handsome/handsome-jennie-fit-inspection/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_HANDSOME_PRODUCTFIT'],
      },
      {
        icon: <InventoryIcon />,
        title: '한섬 전체 상품 리스트',
        path: '/handsome/handsome-product-total/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_HANDSOME_PRODUCT'],
      }
    ],
    roles: ['ROLE_ADMIN_MASTER', 'ROLE_HANDSOME_PRODUCTFIT', 'ROLE_HANDSOME_PRODUCT', 'ROLE_WORKER_HANDSOME'],
  },
  {
    title: 'B2B PRODUCT',
    items: [
      {
        icon: <AssignmentIcon />,
        title: 'B2B 작업 현황 및 배정',
        path: '/b2b-partner/b2b-fit-assign/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
      },
      {
        icon: <CloudUploadIcon />,
        title: 'B2B Jennie FIT Product',
        path: '/b2b-partner/b2b-fit-product/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
      },
      {
        icon: <FactCheckIcon />,
        title: 'B2B Jennie FIT 검수',
        path: '/b2b-partner/b2b-fit-inspection/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
      },
      {
        icon: <InventoryIcon />,
        title: 'B2B 디폴트 상품 리스트',
        path: '/b2b-partner/default-item/b2b-default-item/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
      },
    ],
    roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
  },
  {
    title: 'App',
    items: [
      {
        icon: <InventoryIcon />,
        title: 'HOME 관리',
        children: [
          {
            title: '브랜드 신상품 업데이트',
            path: '/home-app/brand-new-arrivals/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_BRANDNEW'],
          },
          {
            title: '인스타 피드 링크',
            path: '/home-app/instagram-feed/instagram-feed-link/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_MAGAGINE'],
          },
          {
            title: '기획전 리스트',
            path: '/home-app/planning/planning-total/',
            roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_EXHIBITION'],
          },
          {
            title: "MD's Pick",
            path: '/home-app/mds-pick/mds-pick/',
            roles: ['ROLE_ADMIN_MASTER','ROLE_ADMIN_MDPICK'],
          }
        ],
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_BRANDNEW', 'ROLE_ADMIN_MAGAGINE', 'ROLE_ADMIN_EXHIBITION','ROLE_ADMIN_MDPICK'],
      },
      {
        icon: <AutoFixHighIcon />,
        title: '아바타 관리',
        path: '/avatar-custom/avatar-custom/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_MAGAGINE'],
      },
      {
        icon: <FavoriteIcon />,
        title: '인기 키워드 관리',
        path: '/popular-search-words/popular-search-words/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_PRODUCT'],

      },
      {
        icon:<InventoryIcon />,
        title: '팝업 광고 관리',
        path: '/event/event-popup/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_BRAND'],
      },
      {
        icon: <HelpCenterIcon fontSize="small" />,
        title: '1:1문의 관리',
        path: '/inquiry/inquiry/',
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_CS'],
      }
    ],
    roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN_CS', 'ROLE_ADMIN_PRODUCT', 'ROLE_ADMIN_BRAND', 'ROLE_ADMIN_BRANDNEW', 'ROLE_ADMIN_MAGAGINE', 'ROLE_ADMIN_EXHIBITION', 'ROLE_ADMIN_MDPICK'],
  },
];

export const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const lgUp = useMediaQuery(
      (theme: Theme) => theme.breakpoints.up('lg'),
      {
        noSsr: true
      }
  );
  const sections = useMemo(() => {
    const accessToken = localStorage.getItem('accessToken');
    const { auth } = decode(accessToken) as any;
    console.log(auth);
    const menus = getSections(t);
    const authorityMenus = menus.filter((menu: any) => {
      let isAllow = false;
      const newItem:any = [];
      auth.split(',').forEach((role: any) => {
        if(menu.roles.includes(role)) {
          menu.items.forEach((item: any) => {
            if(item.roles.includes(role)) {
              newItem.push(item);
            }
          })
          isAllow = true;
        };
      });
      menu.items = Array.from(new Set(newItem));
      if(isAllow) {
        return menu;
      }
    })
    console.log('authorityMenus', authorityMenus);
    return authorityMenus;
  }, [t]);
  const organizationsRef = useRef<HTMLButtonElement | null>(null);
  const [openOrganizationsPopover, setOpenOrganizationsPopover] = useState<boolean>(false);

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]
  );

  const handleOpenOrganizationsPopover = (): void => {
    setOpenOrganizationsPopover(true);
  };

  const handleCloseOrganizationsPopover = (): void => {
    setOpenOrganizationsPopover(false);
  };

  const content = (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Divider
            sx={{
              borderColor: '#2D3748', // dark divider
              my: 3
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={section.title}
                path={router.asPath}
                sx={{
                  mt: 2,
                  '& + &': {
                    mt: 2
                  }
                }}
                {...section}
              />
            ))}
          </Box>
        </Box>
      </Scrollbar>
      <OrganizationPopover
        anchorEl={organizationsRef.current}
        onClose={handleCloseOrganizationsPopover}
        open={openOrganizationsPopover}
      />
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) => theme.palette.mode === 'dark' ? 1 : 0,
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
