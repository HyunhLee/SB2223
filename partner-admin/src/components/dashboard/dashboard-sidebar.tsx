import {ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import type {FC} from 'react';
import {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import type {TFunction} from 'react-i18next';
import {Box, Divider, Drawer, useMediaQuery} from '@mui/material';
import type {Theme} from '@mui/material';
import {Home as HomeIcon} from '../../icons/home';
import {UserCircle as UserCircleIcon} from '../../icons/user-circle';
import {Scrollbar} from '../scrollbar';
import {DashboardSidebarSection} from './dashboard-sidebar-section';
import {OrganizationPopover} from './organization-popover';
import {decode} from "../../utils/jwt";
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

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
                path: '/dashboard',
                icon: <HomeIcon fontSize="small"/>,
                roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
            }
        ],
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
    },
    // {
    //     title: t('Partner Management'),
    //     items: [
    //         {
    //             title: t('신규 입점 신청 현황'),
    //             path: '/new-apply-store-status/new-apply-store-status',
    //             icon: <InventoryIcon/>,
    //             roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
    //         },
    //         {
    //             title: t('고객사 현황'),
    //             path: '/partner-store-status/partner-store-status',
    //             icon: <InventoryIcon/>,
    //             roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
    //         }
    //     ],
    //     roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
    // },
    {
        title: t('B2B Prod.M'),
        items: [
            {
                title: t('전체 상품리스트'),
                path: '/btb-product/product-total/',
                icon: <InventoryIcon/>,
                roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
            },
            {
                title: t('상품 연동 관리'),
                path: '/product-linkage-management/product-linkage-management/',
                icon: <InventoryIcon/>,
                roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
            },
            {
                title: t('상품 수동등록'),
                path: '/btb-product/product-register/',
                icon: <InventoryIcon/>,
                roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B'],
            },
            {
                title: t('pages_marketingDashboard_marketingDashboard_typography_title'),
                path: '/marketing-dashboard/marketing-dashboard/',
                icon: <InventoryIcon/>,
                roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN', 'ROLE_ADMIN_PARTNER', 'ROLE_PARTNER_B2B'],
            },
        ],
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_ADMIN', 'ROLE_ADMIN_PARTNER', 'ROLE_PARTNER_B2B'],
    },
    {
        title: t('Mypage'),
        items: [
            {
                title: t('마이페이지'),
                path: '/btb-my-page/my-page/',
                icon: <UserCircleIcon fontSize="small"/>,
                roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B', 'ROLE_EXPIRED'],
            }
        ],
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B', 'ROLE_EXPIRED'],
    },
    {
        title: t('General'),
        items: [
            {
                title: t('공지사항'),
                path: '/general/notice/notice-list/',
                icon: <AssignmentIcon fontSize="small"/>,
                roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B', 'ROLE_EXPIRED'],
            },
            {
                title: t('FAQ'),
                path: '/general/faq/faq-list/',
                icon: <HelpCenterIcon fontSize="small"/>,
                roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B', 'ROLE_EXPIRED'],
            },
            {
                title: t('Inquiry'),
                path: '/general/inquiry/inquiry-list/',
                icon: <HelpCenterIcon fontSize="small"/>,
                roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B', 'ROLE_EXPIRED'],
            }
        ],
        roles: ['ROLE_ADMIN_MASTER', 'ROLE_PARTNER_B2B', 'ROLE_EXPIRED'],
    },
];

export const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
    const {onClose, open} = props;
    const router = useRouter();
    const {t} = useTranslation();
    const lgUp = useMediaQuery(
        (theme: Theme) => theme.breakpoints.up('lg'),
        {
            noSsr: true
        }
    );
    const sections = useMemo(() => {
        const accessToken = localStorage.getItem('accessToken');
        const {auth} = decode(accessToken) as any;
        console.log(auth);
        const menus = getSections(t);
        let newAuth = 'ROLE_EXPIRED';
        if (localStorage.getItem('expired') == 'false') {
            newAuth = `${auth}`;
        }
        const authorityMenus = menus.filter((menu: any) => {
            let isAllow = false;
            const newItem: any = [];
            newAuth.split(',').forEach((role: any) => {
                if (menu.roles.includes(role)) {
                    menu.items.forEach((item: any) => {
                        if (item.roles.includes(role)) {
                            newItem.push(item);
                        }
                    })
                    isAllow = true;
                }
            });
            menu.items = Array.from(new Set(newItem));
            if (isAllow) {
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
                    <Box sx={{flexGrow: 1}}>
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
            sx={{zIndex: (theme) => theme.zIndex.appBar + 100}}
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
