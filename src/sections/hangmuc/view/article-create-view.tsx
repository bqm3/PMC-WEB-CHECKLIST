// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ArticleNewEditForm from '../article-new-edit-form';

// ----------------------------------------------------------------------

export default function ArticleCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Tạo mới hạng mục"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Hạng mục',
            href: paths.dashboard.hangmuc.root,
          },
          { name: 'Tạo mới' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ArticleNewEditForm />
    </Container>
  );
}
