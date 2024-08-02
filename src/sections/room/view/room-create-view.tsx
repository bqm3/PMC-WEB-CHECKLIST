// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import RoomNewEditForm from '../room-new-form';

// ----------------------------------------------------------------------

export default function ProductCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Create"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Room',
            href: paths.dashboard.room.root,
          },
          { name: 'Create New Room' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RoomNewEditForm />
    </Container>
  );
}
