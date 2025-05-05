// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetBeBoiDetail, useGetHSSEDetail } from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import BeBoiNewEditForm from '../beboi-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  date: string;
};

export default function BeBoiEditView({ date }: Props) {
  const settings = useSettingsContext();

  const { beboi: currentBeBoi } = useGetBeBoiDetail(date);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Xem chi tiết"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },

          { name: date },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BeBoiNewEditForm currentBeBoi={currentBeBoi} />
    </Container>
  );
}
