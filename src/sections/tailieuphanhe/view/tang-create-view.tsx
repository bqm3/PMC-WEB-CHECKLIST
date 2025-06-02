// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import TangNewEditForm from '../tang-new-edit-form';

// ----------------------------------------------------------------------

export default function TangCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo tài liệu"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },

          { name: 'Tạo mới' },
        ]}
        sx={{
          mb: { xs: 1, md: 3 },
        }}
      />

      <TangNewEditForm />
    </Container>
  );
}
