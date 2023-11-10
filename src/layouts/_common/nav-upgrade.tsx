// @mui

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Label from 'src/components/label';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { useLocales } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';

// hooks

// routes

// locales

// components


// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { user, logout } = useAuthContext();

  const { t } = useLocales();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src='https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg'
            alt={user?.fullname}
            sx={{
              width: 36,
              height: 36,
              border: (theme) => `solid 2px ${theme.palette.background.default}`,
            }}
          >
            {user?.fullname?.charAt(0).toUpperCase()}
          </Avatar>
          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            {user?.role_id === 2 ? 'Staff' : "Admin"}
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.fullname}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>

      </Stack>
    </Stack>
  );
}
