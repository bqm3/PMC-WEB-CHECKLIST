// utils
import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';
import { IUser } from 'src/types/khuvuc';
// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}/analytics`,
    mail: `${ROOTS.DASHBOARD}/mail`,
    statistical_report: `${ROOTS.DASHBOARD}/statistical-report`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      statistical_report: `${ROOTS.DASHBOARD}/statistical-report`,
      location: `${ROOTS.DASHBOARD}/quan-ly-vi-tri`,
      
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      management: `${ROOTS.DASHBOARD}/management`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      ficilities: `${ROOTS.DASHBOARD}/ficilities`,
    },
    typeRoom: {
      root: `${ROOTS.DASHBOARD}/type-room`,
      new: `${ROOTS.DASHBOARD}/type-room/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/type-room/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/type-room/${MOCK_ID}/edit`,
      },
    },
    typeService: {
      root: `${ROOTS.DASHBOARD}/type-service`,
      new: `${ROOTS.DASHBOARD}/type-service/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/type-service/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/type-service/${MOCK_ID}/edit`,
      },
    },
    service: {
      root: `${ROOTS.DASHBOARD}/service`,
      new: `${ROOTS.DASHBOARD}/service/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/service/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/service/${MOCK_ID}/edit`,
      },
    },
    khuvuc: {
      root: `${ROOTS.DASHBOARD}/khuvuc`,
      new: `${ROOTS.DASHBOARD}/khuvuc/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/khuvuc/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/khuvuc/${id}/edit`,
    },
    tang: {
      root: `${ROOTS.DASHBOARD}/tang`,
      new: `${ROOTS.DASHBOARD}/tang/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tang/${id}`,
    },
    hangmuc: {
      root: `${ROOTS.DASHBOARD}/hangmuc`,
      new: `${ROOTS.DASHBOARD}/hangmuc/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/hangmuc/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/hangmuc/${id}/edit`,
    },
    calv: {
      root: `${ROOTS.DASHBOARD}/calv`,
      new: `${ROOTS.DASHBOARD}/calv/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/calv/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/calv/${id}/edit`,
    },
    phanquyenchecklist: {
      root: `${ROOTS.DASHBOARD}/phan-ca-hang-muc`,
      new: `${ROOTS.DASHBOARD}/phan-ca-hang-muc/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/phan-ca-hang-muc/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/phan-ca-hang-muc/${id}/edit`,
    },
    sucongoai: {
      root: `${ROOTS.DASHBOARD}/su-co-ngoai`,
      // new: `${ROOTS.DASHBOARD}/phan-ca-hang-muc/new`,
      // details: (id: string) => `${ROOTS.DASHBOARD}/phan-ca-hang-muc/${id}`,
      // edit: (id: string) => `${ROOTS.DASHBOARD}/phan-ca-hang-muc/${id}/edit`,
    },
    chukyduan:  {
      root: `${ROOTS.DASHBOARD}/chu-ky-du-an`,
      new: `${ROOTS.DASHBOARD}/chu-ky-du-an/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/chu-ky-du-an/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/chu-ky-du-an/${id}/edit`,
    },
    giamsat: {
      root: `${ROOTS.DASHBOARD}/giamsat`,
      new: `${ROOTS.DASHBOARD}/giamsat/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/giamsat/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/giamsat/${id}/edit`,
    },

    quanlygiamsat: {
      root: `${ROOTS.DASHBOARD}/quan-ly-giam-sat`,
      details: (id: string) => `${ROOTS.DASHBOARD}/quan-ly-giam-sat/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/quan-ly-giam-sat/${id}/edit`,
    },

    checklist: {
      root: `${ROOTS.DASHBOARD}/checklist`,
      new: `${ROOTS.DASHBOARD}/checklist/new`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/checklist/lists/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/checklist/${id}/edit`,
      lists :`${ROOTS.DASHBOARD}/checklist/lists`, 
    },
    createUser: {
      root: `${ROOTS.DASHBOARD}/create-user`,
      list: `${ROOTS.DASHBOARD}/create-user/list`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/create-user/${id}/edit`,
    },
    duan: {
      root: `${ROOTS.DASHBOARD}/duan`,
      new: `${ROOTS.DASHBOARD}/duan/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/duan/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/duan/${id}/edit`,
    },
    toanha: {
      root: `${ROOTS.DASHBOARD}/toanha`,
      new: `${ROOTS.DASHBOARD}/toanha/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/toanha/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/toanha/${id}/edit`,
    },
    userAdmin: {
      root: `${ROOTS.DASHBOARD}/user/`,
      profile: `${ROOTS.DASHBOARD}/user/`,
    },
    room: {
      root: `${ROOTS.DASHBOARD}/room`,
      new: `${ROOTS.DASHBOARD}/room/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/room/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/room/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/room/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/room/${MOCK_ID}/edit`,
      },
    },
    orderBooking: {
      root: `${ROOTS.DASHBOARD}/order-booking`,
      list: `${ROOTS.DASHBOARD}/order-booking/services`,
      details: (id: string|number) => `${ROOTS.DASHBOARD}/order-booking/${id}`,
      edit: (id: string| number) => `${ROOTS.DASHBOARD}/order-booking/${id}/edit`,
      detail_service: (id: string|number) => `${ROOTS.DASHBOARD}/order-booking/services/${id}`,
      edit_service: (id: string| number) => `${ROOTS.DASHBOARD}/order-booking/services/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order-booking/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/order-booking/${MOCK_ID}/edit`,
      },
    },
    accountEmployee: {
      root: `${ROOTS.DASHBOARD}/account-employee`,
    },
    
    user: {
      root: `${ROOTS.DASHBOARD}/userMinimal`,
      new: `${ROOTS.DASHBOARD}/userMinimal/new`,
      list: `${ROOTS.DASHBOARD}/userMinimal/list`,
      cards: `${ROOTS.DASHBOARD}/userMinimal/cards`,
      profile: `${ROOTS.DASHBOARD}/userMinimal/profile`,
      account: `${ROOTS.DASHBOARD}/userMinimal/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/userMinimal/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/userMinimal/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
