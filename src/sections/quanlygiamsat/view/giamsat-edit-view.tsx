import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import { useGetGiamsatDetail } from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

import { IUser } from 'src/types/khuvuc';
//
import GiamsatNewEditForm from '../giamsat-new-edit-form';




// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function GiamsatEditView({ id }: Props) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Thiết lập khu vực checklist cho tài khoản"
        links={[
          { name: '', href: paths.dashboard.root },

        ]}
        sx={{
          mb: { xs: 1, md: 3 },
        }}
      />

      <GiamsatNewEditForm id={id} />
    </Container>
  );
}
