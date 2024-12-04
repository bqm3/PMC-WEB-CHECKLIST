import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetKhuVucDetail, useGetHangMucDetail, useGetChecklistDetail, useGetUserDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import UserlistNewEditForm from '../user-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { user: currentUser } = useGetUserDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Cập nhật"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Thông tin tài khoản',
            href: paths.dashboard.createUser.list,
          },
          { name: currentUser?.UserName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserlistNewEditForm currentUser={currentUser} />
    </Container>
  );
}
