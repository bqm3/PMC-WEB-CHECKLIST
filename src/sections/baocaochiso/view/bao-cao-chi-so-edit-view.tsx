import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import { useGetKhuVucDetail, useGetHangMucDetail, useGetCalvDetail, useGetChiSoDetail } from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import BCCSNewEditForm from '../bccs-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function CalvEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { hmChiSo: currentLoaiCS } = useGetChiSoDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Cập nhập báo cáo chỉ số"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Báo cáo chỉ số',
            href: paths.dashboard.calv.root,
          },
          { name: 'Tạo mới' },
        ]}
        sx={{
          mb: { xs: 1, md: 3 },
        }}
      />

      <BCCSNewEditForm currentLoaiCS={currentLoaiCS} />
    </Container>
  );
}
