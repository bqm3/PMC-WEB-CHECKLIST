import { useEffect, useState } from 'react';
// @mui
import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// routes
import { paths } from 'src/routes/paths';
// api
import { useGetRoom } from 'src/api/product';
import {useGetKhuVucDetail, useGetHangMucDetail} from 'src/api/khuvuc'
// components
import { useSettingsContext } from 'src/components/settings';

//
import ArticleNewEditForm from '../article-new-edit-form';


// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ArticleEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { hangMuc: currentArticle } = useGetHangMucDetail(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Khu vực',
            href: paths.dashboard.hangmuc.root,
          },
          { name: currentArticle?.Hangmuc },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ArticleNewEditForm currentArticle={currentArticle} />
    </Container>
  );
}
