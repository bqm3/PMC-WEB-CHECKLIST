
import Container from '@mui/material/Container';
import { useGetDayTb_ChecklistDetail } from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import TbDayNotChecklistCalvView from '../checklist-day/tbchecklist-day-not-detail';


// ----------------------------------------------------------------------

type Props = {
  Ngay: string;
  ID_Calv: string;
};

export default function DayNotChecklistCalvDetailView({ Ngay, ID_Calv }: Props) {


  const settings = useSettingsContext();

  const { checkList } = useGetDayTb_ChecklistDetail(Ngay, ID_Calv);


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <TbDayNotChecklistCalvView checkList={checkList} />
    </Container>
  );
}
