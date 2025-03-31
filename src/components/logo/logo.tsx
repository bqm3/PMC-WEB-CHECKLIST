import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const { user, logout } = useAuthContext();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    const logo = (
      <Box
        component="img"
        src="/logo/logo-pmc-big.png"
        sx={{ width: 185, height: 180, cursor: 'pointer', ...sx }}
      />
    );

    if (disabledLink) {
      return logo;
    }

    if (disabledLink || `${user?.ent_chucvu?.Role}` === `3`) {
      return logo;
    }

    const getDashboardLink = () => {
      if (!user) {
        return '/';
      }

      if (`${user.ent_chucvu?.Role}` === '1' || `${user.ent_chucvu?.Role}` === '2') {
        return '/dashboard/analytics';
      }

      return '/dashboard/management';
    };
    return (
      <Link component={RouterLink} href={getDashboardLink()} sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
