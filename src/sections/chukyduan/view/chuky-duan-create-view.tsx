// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import CalvNewEditForm from '../chuky-duan-new-edit-form';

// ----------------------------------------------------------------------

export default function CalvCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo mới chu kỳ làm việc cho dự án"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Chu kỳ dự án',
            href: paths.dashboard.calv.root,
          },
          { name: 'Tạo mới' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CalvNewEditForm />
    </Container>
  );
}
