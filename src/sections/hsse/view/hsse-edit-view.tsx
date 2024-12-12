import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import { useGetDuanDetail, useGetHSSEDetail } from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import DuanNewEditForm from '../hsse-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function GiamsatEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { hsse: currentHSSE } = useGetHSSEDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Xem chi tiết"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: currentHSSE?.Ten_du_an,
            href: paths.dashboard.hsse.root,
          },
          { name: currentHSSE?.Ngay_ghi_nhan },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DuanNewEditForm currentHSSE={currentHSSE} />
    </Container>
  );
}
