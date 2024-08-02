import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetGiamsatDetail, useGetToanha, useGetToanhaDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import ToanhaNewEditForm from '../toanha-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function GiamsatEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { toanha: currentToanha } = useGetToanhaDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Toà nhà',
            href: paths.dashboard.toanha.root,
          },
          { name: currentToanha?.Toanha },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ToanhaNewEditForm currentToanha={currentToanha} />
    </Container>
  );
}
