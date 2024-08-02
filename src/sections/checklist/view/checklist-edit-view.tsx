import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetKhuVucDetail, useGetHangMucDetail, useGetChecklistDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import ChecklistNewEditForm from '../checklist-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ChecklistEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { checkList: currentChecklist } = useGetChecklistDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Cập nhật"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Checklist',
            href: paths.dashboard.checklist.root,
          },
          { name: currentChecklist?.Checklist },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ChecklistNewEditForm currentChecklist={currentChecklist} />
    </Container>
  );
}
