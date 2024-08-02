// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// api
import { useGetFacilities } from 'src/api/product';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import PacilityNewEditForm from '../facility-new-edit-form';

// ----------------------------------------------------------------------


export default function OverviewFacilitiesView() {
  const settings = useSettingsContext();

  const { facilities: currentPost } = useGetFacilities();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Facilities',
            href: paths.dashboard.general.ficilities,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <PacilityNewEditForm currentFacilities={currentPost} />
    </Container>
  );
}
