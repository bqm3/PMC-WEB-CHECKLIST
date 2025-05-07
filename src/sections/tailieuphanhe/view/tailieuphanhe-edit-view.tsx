import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetKhuVucDetail, useGetTaiLieuPhanHeByID } from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import TailieuPhanHeNewEditForm from '../tang-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function TaiLieuPhanHeEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { taiLieuPhanHe: currentTailieu } = useGetTaiLieuPhanHeByID(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },

          { name: currentTailieu?.Tenduongdan },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TailieuPhanHeNewEditForm currentTang={currentTailieu} />
    </Container>
  );
}
