// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import AreaNewEditForm from '../area-new-edit-form';

// ----------------------------------------------------------------------

export default function AreaCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo mới khu vực"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Khu vực',
            href: paths.dashboard.khuvuc.root,
          },
          { name: 'Tạo mới' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AreaNewEditForm />
    </Container>
  );
}
