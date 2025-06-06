// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import HSSENewEditForm from '../beboi-new-edit-form';

// ----------------------------------------------------------------------

export default function HSSECreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo mới"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'HSSE',
            href: paths.dashboard.hsse.root,
          },
          { name: 'Tạo mới' },
        ]}
        sx={{
          mb: { xs: 1, md: 3 },
        }}
      />

      {/* <HSSENewEditForm /> */}
    </Container>
  );
}
