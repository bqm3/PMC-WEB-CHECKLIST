import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import { useGetKhuVucDetail, useGetHangMucDetail, useGetChecklistDetail, useGetUserDetail } from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import ResetPassForm from '../user-resetpass-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ResetPassView({ id }: Props) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Thiết Lập Lại Mật Khẩu"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Thiết lập lại mật khẩu',
            href: paths.dashboard.createUser.list,
          },
        ]}
        sx={{
          mb: { xs: 1, md: 3 },
        }}
      />

      <ResetPassForm />
    </Container>
  );
}
