// api
import { useGetProduct, useGetService, useGetTypeRoom } from 'src/api/product';

// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';

//
import ServiceNewEditForm from '../service-new-edit-form';

// ----------------------------------------------------------------------

export default function ServiceNewView() {
  const settings = useSettingsContext();


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading='New'
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Service',
            href: paths.dashboard.service.root,
          },
          { name: 'New service' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ServiceNewEditForm />
    </Container>
  );
}
