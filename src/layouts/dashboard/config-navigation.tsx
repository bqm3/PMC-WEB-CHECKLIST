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

  const data = useMemo(
    () => {
      const navigationData = [
        // OVERVIEW
        {
          subheader: t('overview'),
          items: [
            {
              title: t('app'),
              path: paths.dashboard.root,
              icon: ICONS.dashboard,
            },
            // {
            //   title: t('ecommerce'),
            //   path: paths.dashboard.general.ecommerce,
            //   icon: ICONS.ecommerce,
            // },
            // {
            //   title: t('analytics'),
            //   path: paths.dashboard.general.analytics,
            //   icon: ICONS.analytics,
            // },
            // {
            //   title: t('banking'),
            //   path: paths.dashboard.general.banking,
            //   icon: ICONS.banking,
            // },
            // {
            //   title: t('booking'),
            //   path: paths.dashboard.general.booking,
            //   icon: ICONS.booking,
            // },
            // {
            //   title: t('file'),
            //   path: paths.dashboard.general.file,
            //   icon: ICONS.file,
            // },
            // {
            //   title: t('ficilities'),
            //   path: paths.dashboard.general.ficilities,
            //   icon: ICONS.banking,
            // },
          ],
        },
        // MANAGEMENT
        {
          subheader: t('management'),
          items: [
            // TYPE ROOM
            {
              title: t('type room'),
              path: paths.dashboard.typeRoom.root,
              icon: ICONS.menuItem,
              children: [
                { title: t('list'), path: paths.dashboard.typeRoom.root },
                { title: t('create'), path: paths.dashboard.typeRoom.new },
              ],
            },
            // TYPE SERVICE
            {
              title: t('type service'),
              path: paths.dashboard.typeService.root,
              icon: ICONS.menuItem,
              children: [
                { title: t('list'), path: paths.dashboard.typeService.root },
                { title: t('create'), path: paths.dashboard.typeService.new },
              ],
            },
            // SERVICE
            {
              title: t('service'),
              path: paths.dashboard.service.root,
              icon: ICONS.label,
              children: [
                { title: t('list'), path: paths.dashboard.service.root },
                { title: t('create'), path: paths.dashboard.service.new },
              ],
            },
            // ROOM
            {
              title: t('room'),
              path: paths.dashboard.room.root,
              icon: ICONS.job,
              children: [
                { title: t('list'), path: paths.dashboard.room.root },
                { title: t('create'), path: paths.dashboard.room.new },
              ],
            },
            // ORDER
            {
              title: t('booking'),
              path: paths.dashboard.orderBooking.root,
              icon: ICONS.invoice,
              children: [
                { title: t('list'), path: paths.dashboard.orderBooking.root },
              ],
            },
            {
              title: t('User'),
              path: paths.dashboard.accountEmployee.root,
              icon: ICONS.user,
              children: [
                { title: t('Profile'), path: paths.dashboard.accountEmployee.root },
              ],
            }
          ],
        },
      ];

      // Conditionally add "Tạo tài khoản" tab if user's role_id is 1
      if (user?.role_id === 1) {
        navigationData[1].items.push({
          title: t('Create Account'),
          path: paths.dashboard.createEmployee.root,
          icon: ICONS.user,
          children: [
            { title: t('create'), path: paths.dashboard.createEmployee.root },
            { title: t('list'), path: paths.dashboard.createEmployee.list }
          ],
        });
      }

      return navigationData;
    },
    [t, user?.role_id]
  );

  return data;
}

