// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BCCSNewEditForm from '../bccs-new-edit-form';

// ----------------------------------------------------------------------

export default function BaoCaoChiSoCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Báo cáo chỉ số"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Báo cáo chỉ số',
            href: paths.dashboard.calv.root,
          },
          { name: 'Tạo mới' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BCCSNewEditForm />
    </Container>
  );
}
