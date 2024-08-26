import { Helmet } from 'react-helmet-async';
// sections
import { OverviewReportView } from 'src/sections/overview/statistical-report/view/overview-report-view';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Báo cáo thống kê</title>
      </Helmet>

      <OverviewReportView />
    </>
  );
}
