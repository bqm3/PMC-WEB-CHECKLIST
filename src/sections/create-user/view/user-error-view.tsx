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
import UserErrorForm from '../user-error-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserErrorView({ id }: Props) {
  const settings = useSettingsContext();

  const { user: currentUser } = useGetUserDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tài khoản lỗi"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Tài khoản lỗi',
            href: paths.dashboard.createUser.list,
          },
        ]}
        sx={{
          mb: { xs: 1, md: 3 },
        }}
      />

      <UserErrorForm />
    </Container>
  );
}
