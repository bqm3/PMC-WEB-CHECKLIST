
import Container from '@mui/material/Container';
import {useGetTb_ChecklistDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import TbNotChecklistCalvView from '../tbchecklist-not-detail';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ChecklistCalvDetailView({ id }: Props) {


  const settings = useSettingsContext();

  const { checkList: currentChecklist, dataChecklistC } = useGetTb_ChecklistDetail(id);


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
    
      <TbNotChecklistCalvView currentChecklist={currentChecklist}  dataChecklistC={dataChecklistC}/>
    </Container>
  );
}
