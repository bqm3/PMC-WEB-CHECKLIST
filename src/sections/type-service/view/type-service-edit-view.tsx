// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// api
import { useGetProduct, useGetTypeRoom, useGetTypeService } from 'src/api/product';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import TypeRoomNewEditForm from '../type-service-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function TypeRoomEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { data: currentProduct } = useGetTypeService(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Create"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Type Service',
            href: paths.dashboard.typeService.root,
          },
          { name: currentProduct?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TypeRoomNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}
