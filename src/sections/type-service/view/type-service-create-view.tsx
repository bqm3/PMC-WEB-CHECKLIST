// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import TypeRoomNewEditForm from '../type-service-new-edit-form';

// ----------------------------------------------------------------------

export default function TourCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Tạo loại phòng"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Loại phòng',
            href: paths.dashboard.typeRoom.root,
          },
          { name: "Loại phòng mới" },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TypeRoomNewEditForm />
    </Container>
  );
}
