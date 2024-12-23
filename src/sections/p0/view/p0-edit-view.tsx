// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetHSSEDetail, useGetP0Detail } from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import DuanNewEditForm from '../p0-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function GiamsatEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { p0: currentP0 } = useGetP0Detail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Xem chi tiết"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: currentP0?.Ghichu,
            href: paths.dashboard.p0.root,
          },
          { name: currentP0?.Ngaybc },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DuanNewEditForm currentP0={currentP0} />
    </Container>
  );
}
