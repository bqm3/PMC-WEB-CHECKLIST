import * as Yup from 'yup';
import { useEffect, useState } from 'react';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
// hooks
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { _tags, _roles, } from 'src/_mock';
// api
import {
  useGetUsers,
} from 'src/api/khuvuc';
// components
import { useSnackbar } from 'src/components/snackbar';
// components
import { useSettingsContext } from 'src/components/settings';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  id?: string;
};

const STORAGE_KEY = 'accessToken';

export default function ChiaCaNewEditForm({ id }: Props) {
  const router = useRouter();

  const settings = useSettingsContext();

  const [loading, setLoading] = useState<Boolean | any>(false);
  const { user, logout } = useAuthContext();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [areasData, setAreasData] = useState<any>([]);

  const [checkedStates, setCheckedStates] = useState<any>([]);

  // const { thietlapca, khuvucCheck } = useGetDetailPhanCaByDuan(id);

  const { users } = useGetUsers();

  useEffect(() => {
    const handleGet = async () => {
      await axios.get('https://checklist.pmcweb.vn/be/api/v2/hsse', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(response => {
        setAreasData(response.data.data)
      })
    }
    handleGet()
  }, [accessToken]);

  // Move this function outside your component
  const getCheckedState = (userId: any, arrUser: any, arrRole: any) => {
    const isChucvu2 = arrUser?.some((userItem: any) => userItem.ID_Chucvu === 2 && userItem.ID_User === userId);
    const isUserInArrHsse = arrRole.some((item: any) => item.ID_User === userId);

    return isUserInArrHsse || isChucvu2;
  };

  // Inside your component, use the function as needed
  useEffect(() => {
    // Khởi tạo trạng thái checked cho tất cả user
    const initialStates = users?.map(item => ({
      ID_User: item.ID_User,
      checked: getCheckedState(item.ID_User, users, areasData) || false,
      disabled: `${item.ID_Chucvu}` === "2" // Nếu ID_Chucvu = 2 thì disable
    }));
    setCheckedStates(initialStates);
  }, [users, areasData]);  // No need to include getCheckedState here

  const handleCheckboxChange = (userId: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCheckedStates = checkedStates.map((state: any) =>
      state.ID_User === userId
        ? { ...state, checked: event.target.checked }
        : state
    );
    setCheckedStates(updatedCheckedStates);
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCheckedStates = checkedStates.map((state: any) => {
      // If the user has ID_Chucvu === 2, keep their state as is (disabled and unmodifiable)
      if (state.disabled) {
        return state;
      }
      // Otherwise, update the checked state based on the "select all" checkbox
      return {
        ...state,
        checked: event.target.checked,
      };
    });
    setCheckedStates(updatedCheckedStates);
  };


  const onSubmit = async () => {
    setLoading(true);
    const ID_Users = checkedStates
      .flat()
      .filter((item: any) => item.checked)
      .map((item: any) => item.ID_User);
    const data = {
      ID_Users
    };
    await axios
      .post(`https://checklist.pmcweb.vn/be/api/v2/hsse/create-role`, data, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setLoading(false);
        enqueueSnackbar({
          variant: 'success',
          autoHideDuration: 4000,
          message: 'Cập nhật thành công',
        });
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 4000,
            message: `${error.response.data.message}`,
          });
        } else if (error.request) {
          // Lỗi không nhận được phản hồi từ server
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 4000,
            message: `Không nhận được phản hồi từ máy chủ`,
          });
        } else {
          // Lỗi khi cấu hình request
          enqueueSnackbar({
            variant: 'error',
            autoHideDuration: 4000,
            message: `Lỗi gửi yêu cầu`,
          });
        }
      });
  };

  const renderDetails = (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <FormControlLabel
        title="Chọn tất cả"
        label="Chọn tất cả"
        control={
          <Checkbox
            size="medium"
            checked={checkedStates.every((item: any) => item.checked)}
            indeterminate={
              checkedStates.some((item: any) => item.checked) &&
              !checkedStates.every((item: any) => item.checked)
            }
            onChange={handleSelectAllChange} // Để xử lý chọn tất cả
          />
        }
        sx={{
          '.MuiFormControlLabel-label': {
            fontWeight: 'bold',
            fontSize: '17px',
          },
        }}
      />

      <Card>
        <Stack spacing={2} p={2}>
          {users.map((item, index) => {
            const state = checkedStates.find((st: any) => st.ID_User === item.ID_User);
            return (
              <FormControlLabel
                key={item.ID_User}
                label={`${item?.UserName} - ${item?.Hoten} (${item?.ent_chucvu?.Chucvu})`}
                control={
                  <Checkbox
                    size="medium"
                    checked={state?.checked || false}
                    disabled={state?.disabled || false}
                    onChange={handleCheckboxChange(item.ID_User)} // Xử lý thay đổi checkbox
                  />
                }
              />
            );
          })}
        </Stack>
      </Card>
    </Container>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid
        xs={12}
        md={8}
        sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse' }}
      >
        {`${user?.ID_Chucvu}` === "2" &&
          <LoadingButton
            type="submit"
            onClick={onSubmit}
            variant="contained"
            size="large"
            loading={loading}
            sx={{ m: 2 }}
          >
            Lưu
          </LoadingButton>
        }
      </Grid>
    </>
  );

  return (
    <Grid container spacing={3}>
      {renderDetails}

      {renderActions}
    </Grid>
  );
}
