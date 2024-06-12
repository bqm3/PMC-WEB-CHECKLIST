import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
// auth
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();
  const { user, logout } = useAuthContext();

  const data = useMemo(() => {
    const navigationData = [
      // OVERVIEW
      {
        subheader: t('overview'),
        items: user
          ? [
              user?.Permission === 1
                ? {
                    title: t('analytics'),
                    path: paths.dashboard.general.analytics,
                    icon: ICONS.analytics,
                  }
                : {
                    title: t('management'),
                    path: paths.dashboard.general.management,
                    icon: ICONS.analytics,
                  },
            ]
          : [],
      },
      // MANAGEMENT
      {
        subheader: t('management'),

        items:
          user?.Permission === 1
            ? [
                // KHU VUC
                {
                  title: t('area'),
                  path: paths.dashboard.khuvuc.root,
                  icon: ICONS.tour,
                  children: [
                    { title: t('list'), path: paths.dashboard.khuvuc.root },
                    { title: t('create'), path: paths.dashboard.khuvuc.new },
                  ],
                },
                {
                  title: t('article'),
                  path: paths.dashboard.hangmuc.root,
                  icon: ICONS.kanban,
                  children: [
                    { title: t('list'), path: paths.dashboard.hangmuc.root },
                    { title: t('create'), path: paths.dashboard.hangmuc.new,  },
                    
                  ],
                },
                {
                  title: t('calv'),
                  path: paths.dashboard.calv.root,
                  icon: ICONS.job,
                  children: [
                    { title: t('list'), path: paths.dashboard.calv.root },
                    { title: t('create'), path: paths.dashboard.calv.new },
                  ],
                },
                {
                  title: t('taikhoangiamsat'),
                  path: paths.dashboard.quanlygiamsat.root,
                  icon: ICONS.external,
                  children: [
                    { title: t('list'), path: paths.dashboard.quanlygiamsat.root },
                  ],
                },
                {
                  title: t('giamsat'),
                  path: paths.dashboard.giamsat.root,
                  icon: ICONS.user,
                  children: [
                    { title: t('list'), path: paths.dashboard.giamsat.root },
                    { title: t('create'), path: paths.dashboard.giamsat.new },
                  ],
                },
                {
                  title: t('checklist'),
                  path: paths.dashboard.checklist.root,
                  icon: ICONS.lock,
                  children: [
                    { title: t('list'), path: paths.dashboard.checklist.root },
                    { title: t('create'), path: paths.dashboard.checklist.new },
                    { title: t('calamviec'), path: paths.dashboard.checklist.lists },
                  ],
                },
              ]
            : [],
      },

      {
        subheader: t('profile'),
        items: [
          {
            title: t('user'),
            path: paths.dashboard.userAdmin.root,
            icon: ICONS.user,
            children: [{ title: t('account'), path: paths.dashboard.userAdmin.root }],
          },
        ],
      },
    ];

    // Conditionally add "Tạo tài khoản" tab if user's role_id is 1
    if (user?.Permission === 3) {
      navigationData[1].items.push(
        {
          title: t('project'),
          path: paths.dashboard.duan.root,
          icon: ICONS.tour,
          children: [
            { title: t('create'), path: paths.dashboard.duan.new },
            { title: t('list'), path: paths.dashboard.duan.root },
          ],
        },
        {
          title: t('building'),
          path: paths.dashboard.toanha.root,
          icon: ICONS.banking,
          children: [
            { title: t('create'), path: paths.dashboard.toanha.new },
            { title: t('list'), path: paths.dashboard.toanha.root },
          ],
        },
        {
          title: t('tang'),
          path: paths.dashboard.tang.root,
          icon: ICONS.tour,
          children: [
            { title: t('create'), path: paths.dashboard.tang.new },
            { title: t('list'), path: paths.dashboard.tang.root },
          ],
        },
        {
          title: t('createaccount'),
          path: paths.dashboard.createUser.root,
          icon: ICONS.user,
          children: [
            { title: t('create'), path: paths.dashboard.createUser.root },
            { title: t('list'), path: paths.dashboard.createUser.list },
          ],
        }
      );
    }

    return navigationData;
  }, [t, user]);

  return data;
}
