import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetKhuVucDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import RoomNewEditForm from '../area-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};



export default function AreaEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { khuvuc: currentArea } = useGetKhuVucDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Khu vực',
            href: paths.dashboard.khuvuc.root,
          },
          { name: currentArea?.Tenkhuvuc },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <RoomNewEditForm currentArea={currentArea} />
    </Container>
  );
}
