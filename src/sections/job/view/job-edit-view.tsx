// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _jobs } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import JobNewEditForm from '../job-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function JobEditView({ id }: Props) {
  const settings = useSettingsContext();

  const currentJob = _jobs.find((job) => job.id === id);

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
            name: 'Job',
            href: paths.dashboard.job.root,
          },
          { name: currentJob?.title },
        ]}
        sx={{
          mb: { xs: 1, md: 3 },
        }}
      />

      <JobNewEditForm currentJob={currentJob} />
    </Container>
  );
}
