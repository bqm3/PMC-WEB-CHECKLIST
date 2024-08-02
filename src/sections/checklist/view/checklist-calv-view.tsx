import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetKhuVucDetail, useGetHangMucDetail, useGetChecklistDetail, useGetTb_ChecklistDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import TbChecklistCalvView from '../tbchecklist-calv-detail';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ChecklistCalvDetailView({ id }: Props) {
  const settings = useSettingsContext();

  const { checkList: currentChecklist, dataChecklistC } = useGetTb_ChecklistDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
    
      <TbChecklistCalvView currentChecklist={currentChecklist}  dataChecklistC={dataChecklistC}/>
    </Container>
  );
}
