// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// auth
import { useAuthContext } from 'src/auth/hooks';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// theme
import { bgGradient } from 'src/theme/css';
// components
import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

const METHODS = [
  {
    id: 'jwt',
    label: 'Jwt',
    path: paths.auth.jwt.login,
    icon: '/assets/icons/auth/ic_jwt.svg',
  },
  {
    id: 'firebase',
    label: 'Firebase',
    path: paths.auth.firebase.login,
    icon: '/assets/icons/auth/ic_firebase.svg',
  },
  {
    id: 'amplify',
    label: 'Amplify',
    path: paths.auth.amplify.login,
    icon: '/assets/icons/auth/ic_amplify.svg',
  },
  {
    id: 'auth0',
    label: 'Auth0',
    path: paths.auth.auth0.login,
    icon: '/assets/icons/auth/ic_auth0.svg',
  },
];

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const { method } = useAuthContext();

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  // const renderLogo = (
  //   <Logo
  //     sx={{
  //       zIndex: 9,
  //       position: 'absolute',
  //       m: { xs: 2, md: 5 },
  //     }}
  //   />
  // );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 400,
        justifyContent: 'center',
        // backgroundColor: 'red',
        
      }}
    >
      <Stack
        sx={{
          width: 1,
          mx: 'auto',
          maxWidth: 400,
          px: { xs: 2, md: 3 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 4, md: 6 },
          alignContent: 'center',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // Màu trắng với độ mờ
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        {children}
      </Stack>
    </Stack>
  );

  // const renderSection = (
  //   <Stack
  //     flexGrow={1}
  //     spacing={10}
  //     alignItems="center"
  //     justifyContent="center"

  //     sx={{
  //       backgroundColor: 'red',
  //       ...bgGradient({
  //         // color: alpha(
  //         //   theme.palette.background.default,
  //         //   theme.palette.mode === 'light' ? 0.88 : 0.94
  //         // ),
  //         // imgUrl: '/assets/illustrations/overplay_main.jpg',
  //       }),
  //     }}
  //   >
  //     {/* <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center' }}>
  //       {title || 'Center PMC'}
  //     </Typography> */}

  //     {/* <Box
  //       component="img"
  //       alt="auth"
  //       src={image || '/assets/illustrations/overplay_main.jpg'}
  //       sx={{
  //         maxWidth: {
  //           xs: 440,
  //           lg: 520,
  //           xl: 680,
  //         },
  //       }}
  //     /> */}
  //   </Stack>
  // );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/assets/illustrations/bg.jpg)',
        backgroundSize: 'cover', // Đảm bảo hình nền bao phủ toàn bộ khu vực
        backgroundPosition: 'center', // Đảm bảo hình nền được đặt ở giữa
      }}
    >
      {/* {renderLogo} */}

      {/* {mdUp && renderSection} */}

      {renderContent}
    </Stack>
  );
}
