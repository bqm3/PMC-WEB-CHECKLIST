// @mui
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  dense?: boolean;
  action?: React.ReactNode;
  rowCount: number;
  numSelected: number;
}

export default function TableSelectedAction({
  dense,
  action,
  rowCount,
  numSelected,
  sx,
  ...other
}: Props) {
  if (!numSelected) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 1,
        pr: 2,
        top: 0,
        left: 0,
        width: 1,
        zIndex: 9,
        height: 58,
        position: 'absolute',
        bgcolor: 'primary.lighter',
        ...(dense && {
          height: 38,
        }),
        ...sx,
      }}
      {...other}
    >
      <Typography
        variant="subtitle2"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: 'primary.main',
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {numSelected} chọn
      </Typography>

      {action && action}
    </Stack>
  );
}