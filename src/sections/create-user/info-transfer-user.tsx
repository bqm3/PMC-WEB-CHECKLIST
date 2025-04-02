import { Card, Typography, Box, Divider, Stack, useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';

type TransferProjectDialogProps = {
  userHistory?: any[];
};

export default function TransferProjectDialog({ userHistory = [] }: TransferProjectDialogProps) {
  const theme = useTheme();

  if (!userHistory?.length) {
    return (
      <Card sx={{ p: 3, mb: 3, borderRadius: 1 }}>
        <Typography variant="h6" align="center" sx={{ my: 2, color: 'text.secondary' }}>
          Không có lịch sử điều chuyển
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, mb: 3, borderRadius: 1, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 3,
            height: 20,
            bgcolor: 'primary.main',
            mr: 1,
            borderRadius: 0.5,
          }}
        />
        <Typography variant="h6">Lịch sử điều chuyển</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        {userHistory.map((history: any, index: number) => (
          <Box
            key={history.ID}
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: index === 0 ? 'primary.lighter' : 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
            }}
          >
            {index === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: 16,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontSize: 12,
                  py: 0.5,
                  px: 1,
                  borderRadius: 0.5,
                }}
              >
                Gần nhất
              </Box>
            )}

            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Iconify
                  icon="eva:calendar-outline"
                  width={18}
                  height={18}
                  sx={{ mr: 1, color: 'text.secondary' }}
                />
                <Typography variant="body2" fontWeight="medium">
                  {history.Ngay
                    ? new Date(history.Ngay).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : 'Không có thông tin'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 150 }}>
                  <Iconify
                    icon="eva:briefcase-outline"
                    width={18}
                    height={18}
                    sx={{ mr: 1, color: 'text.secondary' }}
                  />
                  <Typography variant="body2">
                    Dự án:{' '}
                    <Typography component="span" fontWeight="medium" variant="body2">
                      {history.ent_duan?.Duan ?? 'Không có thông tin'}
                    </Typography>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify
                    icon="eva:person-done-outline"
                    width={18}
                    height={18}
                    sx={{ mr: 1, color: 'text.secondary' }}
                  />
                  <Typography variant="body2">
                    Chức vụ:{' '}
                    <Typography component="span" fontWeight="medium" variant="body2">
                      {history.ent_chucvu?.Chucvu ?? 'Không có thông tin'}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
