import { useEffect, useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';

// locales
import { useLocales } from 'src/locales';
// components
import SvgColor from 'src/components/svg-color';
// auth
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
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
        items: (() => {
          if (!user) return [];

          // Kiểm tra nếu user có ID_Duan
          if (user.ID_Duan !== null) {
            return [
              {
                title: t('analytics'),
                path: paths.dashboard.general.analytics,
                icon: ICONS.analytics,
              },
              {
                title: t('statistical report'),
                path: paths.dashboard.general.statistical_report,
                icon: ICONS.file,
              },
            ];
          }

          // Các điều kiện với Role thông thường
          if (user?.ent_chucvu?.Role === 1 || user?.ent_chucvu?.Role === 2) {
            return [
              {
                title: t('analytics'),
                path: paths.dashboard.general.analytics,
                icon: ICONS.analytics,
              },
              {
                title: t('statistical report'),
                path: paths.dashboard.general.statistical_report,
                icon: ICONS.file,
              },
            ];
          }

          if (user?.ent_chucvu?.Role === 10 || user?.ent_chucvu?.Role === 0) {
            return [
              {
                title: t('management'),
                path: paths.dashboard.general.management,
                icon: ICONS.analytics,
              },
            ];
          }
          if (user?.ent_chucvu?.Role === 4) {
            return [
              {
                title: t('managementDepartment'),
                path: paths.dashboard.general.managementDepartment,
                icon: ICONS.analytics,
              },
            ];
          }
          return [];
        })(),
      },

      // MANAGEMENT
      {
        subheader: t('management'),
        items:
          user?.ent_chucvu?.Role === 1 || user?.ent_chucvu?.Role === 2 || user?.ID_Duan !== null
            ? [
              // KHU VUC
              {
                title: t('area'),
                path: paths.dashboard.khuvuc.root,
                icon: ICONS.tour,
                children: [
                  { title: t('Danh sách khu vưc'), path: paths.dashboard.khuvuc.root },
                  { title: t('create'), path: paths.dashboard.khuvuc.new },
                ],
              },
              {
                title: t('article'),
                path: paths.dashboard.hangmuc.root,
                icon: ICONS.kanban,
                children: [
                  { title: t('Danh sách hạng mục'), path: paths.dashboard.hangmuc.root },
                  { title: t('create'), path: paths.dashboard.hangmuc.new },
                ],
              },
              {
                title: t('calv'),
                path: paths.dashboard.calv.root,
                icon: ICONS.job,
                children: [
                  { title: t('Danh sách ca'), path: paths.dashboard.calv.root },
                  { title: t('create'), path: paths.dashboard.calv.new },
                ],
              },
              {
                title: t('chukyduan'),
                path: paths.dashboard.chukyduan.root,
                icon: ICONS.analytics,
                children: [
                  { title: t('Danh sách chu kỳ'), path: paths.dashboard.chukyduan.root },
                  { title: t('create'), path: paths.dashboard.chukyduan.new },
                ],
              },
              {
                title: t('phanquyenchecklist'),
                path: paths.dashboard.phanquyenchecklist.root,
                icon: ICONS.external,
                children: [
                  { title: t('Danh sách phân ca'), path: paths.dashboard.phanquyenchecklist.root },
                  { title: t('create'), path: paths.dashboard.phanquyenchecklist.new },
                ],
              },
              {
                title: t('checklist'),
                path: paths.dashboard.checklist.root,
                icon: ICONS.lock,
                children: [
                  { title: t('Danh sách Checklist'), path: paths.dashboard.checklist.root },
                  { title: t('create'), path: paths.dashboard.checklist.new },
                  { title: t('calamviec'), path: paths.dashboard.checklist.lists },
                ],
              },
              {
                title: t('suco'),
                path: paths.dashboard.sucongoai.root,
                icon: ICONS.disabled,
                children: [
                  { title: t('Danh sách sự cố'), path: paths.dashboard.sucongoai.root },
                ],
              },
              {
                title: t('baocaochiso'),
                path: paths.dashboard.baocaochiso.root,
                icon: ICONS.blog,
                children: [
                  { title: t('Danh sách chỉ số'), path: paths.dashboard.baocaochiso.root },
                  { title: t('create'), path: paths.dashboard.baocaochiso.new },
                  { title: t('thông tin'), path: paths.dashboard.baocaochiso.thongTin },
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

    // Kiểm tra nếu Role là 1, 2, 10, 4 hoặc user.ID_Duan không phải null
    if (user?.ent_chucvu?.Role === 1 || user?.ent_chucvu?.Role === 2 || (user?.ID_Duan !== null && user?.ent_chucvu?.Role !== 3)) {
      navigationData[1].items.unshift(
        {
          title: t('building'),
          path: paths.dashboard.toanha.root,
          icon: ICONS.banking,
          children: [
            { title: t('create'), path: paths.dashboard.toanha.new },
            { title: t('Danh sách tòa nhà'), path: paths.dashboard.toanha.root },
          ],
        },
        {
          title: t('tang'),
          path: paths.dashboard.tang.root,
          icon: ICONS.tour,
          children: [
            { title: t('create'), path: paths.dashboard.tang.new },
            { title: t('Danh sách tầng'), path: paths.dashboard.tang.root },
          ],
        },
        {
          title: t('createaccount'),
          path: paths.dashboard.createUser.root,
          icon: ICONS.user,
          children: [
            { title: t('create'), path: paths.dashboard.createUser.root },
            { title: t('Danh sách tài khoản'), path: paths.dashboard.createUser.list },
          ],
        }
      );
    }

    if (user?.ent_chucvu?.Role === 10 && user?.ID_Duan == null) {
      navigationData[1].items.unshift(
        {
          title: t('project'),
          path: paths.dashboard.duan.root,
          icon: ICONS.tour,
          children: [
            { title: t('create'), path: paths.dashboard.duan.new },
            { title: t('Danh sách dự án'), path: paths.dashboard.duan.root },
          ],
        },
        {
          title: t('baocaovitri'),
          path: paths.dashboard.general.location,
          icon: ICONS.analytics,
          children: [
            { title: t('Danh sách vị trí'), path: paths.dashboard.general.location },
          ]
        },
        {
          title: t('createaccount'),
          path: paths.dashboard.quanlytaikhoan.root,
          icon: ICONS.user,
          children: [
            { title: t('create'), path: paths.dashboard.quanlytaikhoan.root },
            { title: t('Danh sách tài khoản'), path: paths.dashboard.quanlytaikhoan.list },
            { title: t('user_error'), path: paths.dashboard.quanlytaikhoan.error },
            { title: t('resetPassWord'), path: paths.dashboard.quanlytaikhoan.resetPassWord },
          ],
        }
      );
    }

    if (user?.ent_chucvu?.Role === 10 && user?.ID_Duan !== null) {
      navigationData[1].items.unshift(
        {
          title: t('project'),
          path: paths.dashboard.duan.root,
          icon: ICONS.tour,
          children: [
            { title: t('create'), path: paths.dashboard.duan.new },
            { title: t('Danh sách dự án'), path: paths.dashboard.duan.root },
          ],
        },
        {
          title: t('baocaovitri'),
          path: paths.dashboard.general.location,
          icon: ICONS.analytics,
          children: [
            { title: t('list'), path: paths.dashboard.general.location },
          ]
        },

      );
    }

    if (user?.ent_chucvu?.Role === 4) {
      navigationData[1].items.unshift(
        {
          title: t('project'),
          path: paths.dashboard.duan.root,
          icon: ICONS.tour,
          children: [
            { title: t('Danh sách dự án'), path: paths.dashboard.duan.root },
          ],
        },

      );
    }

    if (user?.ent_chucvu?.Role === 3 && user?.ID_Duan !== null) {
      navigationData[1].items = [];  // Hoặc loại bỏ các mục không mong muốn
      navigationData[0].items = [];  // Hoặc loại bỏ các mục không mong muốn
    }

    if (user?.ent_chucvu?.Role === 1 && user?.arr_Duan !== null && user?.arr_Duan !== "") {
      navigationData[1].items.unshift(
        {
          title: t('project'),
          path: paths.dashboard.duan.root,
          icon: ICONS.tour,
          children: [
            { title: t('Danh sách dự án'), path: paths.dashboard.duan.root },
          ],
        },

      );
    }

    if (user?.ent_chucvu?.Role === 5 && user?.arr_Duan !== null) {
      navigationData[1].items.unshift(
        {
          title: t('project'),
          path: paths.dashboard.duan.root,
          icon: ICONS.tour,
          children: [
            { title: t('Danh sách dự án'), path: paths.dashboard.duan.root },
          ],
        },

      );
    }
    if (user?.ent_chucvu?.Role === 1 || user?.ent_chucvu?.Role === 2 || user?.ent_chucvu?.Role === 3) {
      if (user?.ent_chucvu?.Role === 1) {
        navigationData[0].items.push({
          title: t('hsse'),
          path: paths.dashboard.hsse.root,
          icon: ICONS.tour,
          children: [

            { title: t('phanquyen'), path: paths.dashboard.hsse.phanquyen },
            { title: t('Dữ liệu'), path: paths.dashboard.hsse.root },
            { title: t('create'), path: paths.dashboard.hsse.new },
          ]
        });
      } else {
        // If Role is not 1, create the HSE section without 'phanquyen'
        navigationData[0].items.push({
          title: t('hsse'),
          path: paths.dashboard.hsse.root,
          icon: ICONS.tour,
          children: [
            { title: t('Dữ liệu'), path: paths.dashboard.hsse.root },
            { title: t('create'), path: paths.dashboard.hsse.new }
          ]
        });
      }
    }
    // {
    //   title: t('project'),
    //   path: paths.dashboard.duan.root,
    //   icon: ICONS.tour,
    //   children: [
    //     { title: t('create'), path: paths.dashboard.duan.new },
    //     { title: t('list'), path: paths.dashboard.duan.root },
    //   ],
    // },
    return navigationData;
  }, [t, user]);

  return data;
}

