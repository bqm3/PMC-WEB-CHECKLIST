import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetGiamsatDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import GiamsatNewEditForm from '../giamsat-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function GiamsatEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { giamsat: currentGiamsat } = useGetGiamsatDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Giám sát',
            href: paths.dashboard.giamsat.root,
          },
          { name: currentGiamsat?.Hoten },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <GiamsatNewEditForm currentGiamsat={currentGiamsat} />
    </Container>
  );
}
