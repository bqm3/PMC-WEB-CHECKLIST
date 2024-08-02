import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetDuanDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import DuanNewEditForm from '../duan-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function GiamsatEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { duan: currentDuan } = useGetDuanDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Dự án',
            href: paths.dashboard.duan.root,
          },
          { name: currentDuan?.Duan },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DuanNewEditForm currentDuan={currentDuan} />
    </Container>
  );
}
