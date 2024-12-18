import { Helmet } from 'react-helmet-async';
// sections
import { DayChecklistCalvListView } from 'src/sections/checklist/view';

// ----------------------------------------------------------------------

export default function ChecklistCaTrongNgayPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Checklist theo ca</title>
            </Helmet>

            <DayChecklistCalvListView />
        </>
    );
}
