// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import JobNewEditForm from '../job-new-edit-form';

// ----------------------------------------------------------------------

export default function JobCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Create a new job"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Job',
            href: paths.dashboard.job.root,
          },
          { name: 'New job' },
        ]}
        sx={{
          mb: { xs: 1, md: 3 },
        }}
      />

      <JobNewEditForm />
    </Container>
  );
}
