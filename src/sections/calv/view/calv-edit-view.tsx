import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetKhuVucDetail, useGetHangMucDetail, useGetCalvDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import CalvNewEditForm from '../calv-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CalvEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { calv: currentCalv } = useGetCalvDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Ca làm việc',
            href: paths.dashboard.calv.root,
          },
          { name: currentCalv?.Tenca },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CalvNewEditForm currentCalv={currentCalv} />
    </Container>
  );
}
