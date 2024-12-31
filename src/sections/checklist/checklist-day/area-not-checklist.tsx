
import { useTheme } from '@mui/material/styles';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  row: any;
  khoiCV: any;
  selected: boolean;
  onSelectRow: VoidFunction;
  index: number;
};

export default function AreaTableRow({
  row,
  selected,
  onSelectRow,
  khoiCV,
  index,
}: Props) {
  const { ent_khuvuc, hangmucs } = row;

  const collapse = useBoolean();
  const theme = useTheme()

  let ID_KhoiCVsArray: number[];

  // Kiểm tra xem ID_KhoiCVs là một mảng hoặc không
  if (Array.isArray(ent_khuvuc.ID_KhoiCVs)) {
    // Kiểm tra xem các phần tử trong mảng có phải là số không và chuyển đổi
    ID_KhoiCVsArray = ent_khuvuc.ID_KhoiCVs.filter((item: any) => typeof item === 'number').map(
      Number
    );
  } else if (typeof ent_khuvuc.ID_KhoiCVs === 'string') {
    // Chuyển đổi từ chuỗi sang mảng số
    ID_KhoiCVsArray = ent_khuvuc.ID_KhoiCVs.replace(/\[|\]/g, '') // Loại bỏ dấu ngoặc vuông
      .split(', ') // Phân tách các số
      .map((item: any) => Number(item?.trim())) // Chuyển đổi từ chuỗi sang số
      .filter((item: any) => !Number.isNaN(item)); // Loại bỏ các giá trị không hợp lệ
  } else {
    // Trong trường hợp ID_KhoiCVs không phải là mảng hoặc chuỗi, ta gán một mảng rỗng
    ID_KhoiCVsArray = [];
  }

  const shiftNames = ent_khuvuc.ent_khuvuc_khoicvs
    .map((calvId: any) => {
      const workShift = khoiCV?.find(
        (shift: any) => `${shift.ID_KhoiCV}` === `${calvId.ID_KhoiCV}`
      );
      return workShift ? calvId.ent_khoicv.KhoiCV : null;
    })
    .filter((name: any) => name !== null);

  const labels = shiftNames.map((name: any, i: any) => (
    <Label
      key={i}
      variant="soft"
      color={
        (`${name}` === 'Khối làm sạch' && 'success') ||
        (`${name}` === 'Khối kỹ thuật' && 'warning') ||
        (`${name}` === 'Khối an ninh' && 'error') ||
        'default'
      }
      style={{ marginTop: 4, marginLeft: 4 }}
    >
      {name}
    </Label>
  ));

  const backgroundColorStyle =
    index % 2 === 0 ? theme.palette.background.paper : theme.palette.grey[500];
  const renderPrimary = (
    <TableRow hover selected={selected} style={{ backgroundColor: backgroundColorStyle }}>
      <TableCell>
        <Box
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          KV{ent_khuvuc.ID_Khuvuc}
        </Box>
      </TableCell>

      <TableCell>{ent_khuvuc.Tenkhuvuc}</TableCell>
      <TableCell> {ent_khuvuc.ent_toanha?.Toanha} </TableCell>
      <TableCell> {ent_khuvuc.MaQrCode} </TableCell>
      <TableCell>{labels}</TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{
            bgcolor: 'background.default',
            borderTop: () => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack component={Paper} sx={{ m: 1.5, p: 2, borderRadius: 1 }}>
            {hangmucs?.map((hangmuc: any) => {
              const hangmucData = hangmuc?.ent_hangmuc?.dataValues;
              const hangmucChecklist = hangmuc?.ent_hangmuc?.checklists;

              return (
                <Stack
                  key={hangmucData?.ID_Hangmuc}
                  spacing={1.5}
                  sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    boxShadow: () => theme.shadows[1],
                    '&:last-of-type': {
                      mb: 2,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      HM{hangmucData?.ID_Hangmuc}
                    </Box>
                    <ListItemText
                      primary={hangmucData?.Hangmuc}
                      primaryTypographyProps={{
                        variant: 'subtitle1',
                        sx: { fontWeight: 'bold', ml: 2 },
                      }}
                    />
                  </Box>

                  {hangmucChecklist?.length > 0 && (
                    <Stack spacing={1}>
                      {hangmucChecklist.map((checklist: any) => (
                        <Stack
                          key={checklist?.ID_Checklist}
                          direction="row"
                          alignItems="center"
                          sx={{
                            p: 1,
                            bgcolor: 'background.neutral',
                            borderRadius: 1,
                          }}
                        >
                          <Box
                          // sx={{
                          //   minWidth: 36,
                          //   height: 36,
                          //   bgcolor: 'success.lighter',
                          //   color: 'success.dark',
                          //   display: 'flex',
                          //   alignItems: 'center',
                          //   justifyContent: 'center',
                          //   borderRadius: '50%',
                          //   fontWeight: 'bold',
                          // }}
                          >
                            C-{checklist?.ID_Checklist}
                          </Box>
                          <ListItemText
                            primary={checklist?.Checklist}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { ml: 2 },
                            }}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Stack>
              );
            })}
          </Stack>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}
      {renderSecondary}
    </>
  );
}
