import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import { DayNotChecklistCalvDetailView } from 'src/sections/checklist/view';
// ----------------------------------------------------------------------

export default function NotChecklistCaTrongNgayPage() {
    const params = useParams();

    const { ngay, idc } = params;

    return (
        <>
            <Helmet>
                <title> Dashboard: Danh sách chưa checklist theo ca</title>
            </Helmet>

            <DayNotChecklistCalvDetailView Ngay={`${ngay}`} ID_Calv={`${idc}`} />
        </>
    );
}
