import { useCallback, useEffect, useState } from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import { Box, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { ConfirmDialog } from 'src/components/custom-dialog';
// hooks
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import Image from 'src/components/image';
import IconButton from '@mui/material/IconButton';

// api
import axios from 'axios';
import { useGetKhoiCV } from 'src/api/khuvuc';
import AnalyticsCurrentVisits from '../analytics-current-visits';

import AppCurrentDownload from '../app-current-download';
import BankingRecentTransitions from '../banking-recent-transitions';
import ChecklistRecentTransitions from '../checklist-recent-transitions';

import ChecklistsHoanThanh from '../checklist-hoan-thanh';
import ChecklistsSuCo from '../checklist-su-co';
import ChecklistsSuCoNgoai from '../checklist-su-co-ngoai';

// ==========================================================

const columns: GridColDef<[number]>[] = [
  { field: 'id', headerName: 'Số thứ tự', width: 0 },
  {
    field: 'date',
    headerName: 'Ngày',
    width: 150,
    editable: true,
  },
  {
    field: 'Khối kỹ thuật',
    headerName: 'Khối kỹ thuật',
    width: 150,
    editable: true,
  },
  {
    field: 'Khối làm sạch',
    headerName: 'Khối làm sạch',
    // type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'Khối dịch vụ',
    headerName: 'Khối dịch vụ',
    width: 150,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
  {
    field: 'Khối bảo vệ',
    headerName: 'Khối bảo vệ',
    // description: 'This column has a value getter and is not sortable.',
    // sortable: false,
    width: 150,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
  {
    field: 'Khối F&B',
    headerName: 'Khối F&B',
    // description: 'This column has a value getter and is not sortable.',
    // sortable: false,
    width: 150,
    editable: true,
    // valueGetter: (value: any, row: any) => `${row?.firstName || ''} ${row?.lastName || ''}`,
  },
];

const STORAGE_KEY = 'accessToken';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type SeriesData = {
  label: string;
  value: number;
};

type SeriesDataYear = {
  name: string;
  data: number[];
};

type ChartSeries = {
  type: string;
  data: SeriesDataYear[];
};

type ChartData = {
  categories: string[];
  series: ChartSeries[];
};

const tangGiam = [
  { value: 'desc', label: 'Giảm' },
  { value: 'asc', label: 'Tăng' },
];

export default function OverviewAnalyticsView() {
  const theme = useTheme();
  const router = useRouter();
  const settings = useSettingsContext();

  const { user, logout } = useAuthContext();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const upload = useBoolean();

  const [loading, setLoading] = useState<Boolean | any>(false);
  const [dataPercentDays, setDataPercentDays] = useState<any>([]);

  const [dataTotalKhoiCV, setDataTotalKhoiCV] = useState<SeriesData[]>([]);
  const [dataTotalKhuvuc, setDataTotalKhuvuc] = useState<SeriesData[]>([]);
  const [dataTotalHangmuc, setDataTotalHangmuc] = useState<SeriesData[]>([]);
  const [dataTotalErrorWeek, setDataTotalErrorWeek] = useState<any>([]);
  const [dataChecklistsError, setDataChecklistsError] = useState<any>([]);
  const [dataPercent, setDataPercent] = useState<any>([]);
  const [totalKhoiCV, setTotalKhoiCV] = useState(0);
  const [dataTotalYear, setDataTotalYear] = useState<ChartData>({ categories: [], series: [] });
  const [dataTotalYearSuCo, setDataTotalYearSuCo] = useState<ChartData>({
    categories: [],
    series: [],
  });
  const [dataTotalYearSuCoNgoai, setDataTotalYearSuCoNgoai] = useState<ChartData>({
    categories: [],
    series: [],
  });

  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedKhoiCV, setSelectedKhoiCV] = useState('all');
  const [selectedTangGiam, setSelectedTangGiam] = useState('asc');

  const [selectedYearSuCoNgoai, setSelectedYearSuCoNgoai] = useState('2024');
  const [selectedKhoiCVSuCoNgoai, setSelectedKhoiCVSuCoNgoai] = useState('all');
  const [selectedTangGiamSuCoNgoai, setSelectedTangGiamSuCoNgoai] = useState('asc');

  const [selectedYearSuCo, setSelectedYearSuCo] = useState('2024');
  const [selectedKhoiCVSuCo, setSelectedKhoiCVSuCo] = useState('all');
  const [selectedTangGiamSuCo, setSelectedTangGiamSuCo] = useState('asc');

  const { khoiCV } = useGetKhoiCV();
  const [STATUS_OPTIONS, set_STATUS_OPTIONS] = useState([{ value: 'all', label: 'Tất cả' }]);

  useEffect(() => {
    // Assuming khoiCV is set elsewhere in your component
    khoiCV.forEach((khoi) => {
      set_STATUS_OPTIONS((prevOptions) => [
        ...prevOptions,
        { value: khoi.ID_KhoiCV.toString(), label: khoi.KhoiCV },
      ]);
    });
  }, [khoiCV]);

  useEffect(() => {
    if (user && `${user.ID_Chucvu}` === '5') {
      router.push(paths.dashboard.general.management);
    }
  }, [user, router]);

  useEffect(() => {
    const handleDataPercent = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/percent-checklist-days', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          const dataRes = res.data.data;
          const transformedRows = dataRes.map((project: any, index: number) => ({
            id: index + 1,
            date: project.date,
            'Khối kỹ thuật': project.createdKhois['Khối kỹ thuật']?.completionRatio
              ? `${project.createdKhois['Khối kỹ thuật']?.completionRatio} %`
              : null,
            'Khối làm sạch': project.createdKhois['Khối làm sạch']?.completionRatio
              ? `${project.createdKhois['Khối làm sạch']?.completionRatio} %`
              : null,
            'Khối dịch vụ': project.createdKhois['Khối dịch vụ']?.completionRatio
              ? `${project.createdKhois['Khối dịch vụ']?.completionRatio} %`
              : null,
            'Khối bảo vệ': project.createdKhois['Khối bảo vệ']?.completionRatio
              ? `${project.createdKhois['Khối bảo vệ']?.completionRatio} %`
              : null,
            'Khối F&B': project.createdKhois['Khối F&B']?.completionRatio
              ? `${project.createdKhois['Khối F&B']?.completionRatio} %`
              : null,
          }));

          setDataPercentDays(transformedRows);
        })
        .catch((err) => console.log('err', err));
    };

    handleDataPercent();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhoiCV = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/ent_checklist/total', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataTotalKhoiCV(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhoiCV();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/ent_khuvuc/total', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataTotalKhuvuc(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhuvuc();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/list-checklist-error-project', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataTotalErrorWeek(res.data.data[0].errorDetails);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhuvuc();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalKhuvuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/list-checklist', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataChecklistsError(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalKhuvuc();
  }, [accessToken]);

  useEffect(() => {
    const handleTotalHangmuc = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/ent_hangmuc/total', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataTotalHangmuc(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTotalHangmuc();
  }, [accessToken]);

  useEffect(() => {
    const handlePercent = async () => {
      await axios
        .get('https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/percent', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setDataPercent(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handlePercent();
  }, [accessToken]);

  useEffect(() => {
    const handleTangGiam = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/year?year=${selectedYear}&khoi=${selectedKhoiCV}&tangGiam=${selectedTangGiam}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setDataTotalYear(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTangGiam();
  }, [accessToken, selectedYear, selectedKhoiCV, selectedTangGiam]);

  // Checklikst lỗi
  useEffect(() => {
    const handleTangGiam = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/year-su-co?year=${selectedYearSuCo}&khoi=${selectedKhoiCVSuCo}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setDataTotalYearSuCo(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTangGiam();
  }, [accessToken, selectedYearSuCo, selectedKhoiCVSuCo, selectedTangGiamSuCo]);

  // Sự cố ngoài
  useEffect(() => {
    const handleTangGiam = async () => {
      await axios
        .get(
          `https://checklist.pmcweb.vn/be/api/v2/tb_sucongoai/dashboard-by-duan?year=${selectedYearSuCoNgoai}&khoi=${selectedKhoiCVSuCoNgoai}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setDataTotalYearSuCoNgoai(res.data.data);
        })
        .catch((err) => console.log('err', err));
    };

    handleTangGiam();
  }, [accessToken, selectedYearSuCoNgoai, selectedKhoiCVSuCoNgoai, selectedTangGiamSuCoNgoai]);

  useEffect(() => {
    const totalValue = dataTotalKhoiCV.reduce(
      (accumulator, currentObject) => accumulator + currentObject.value,
      0
    );
    setTotalKhoiCV(totalValue);
  }, [dataTotalKhoiCV]);

  const handleLinkHSSE = useCallback(() => {
    const url =
      'https://pmcwebvn.sharepoint.com/sites/PMCteam/SitePages/B%C3%A1o-c%C3%A1o-HSSE.aspx?csf=1&web=1&share=EUBekLeeP6hLszUcIm2kXQEBm6ZHozG95Gn14yIxExnPFw&e=HsaK0H';
    window.open(url, '_blank');
  }, []);

  const [open, setOpen] = useState(false);
  const [detailChecklist, setDetailChecklist] = useState<any>();

  const handleClickOpen = (data: any) => {
    setOpen(true);
    setDetailChecklist(data);
  };
  const handleClose = () => {
    setOpen(false);
    setDetailChecklist(null)
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Typography variant="h4">Hi, {user?.ent_duan?.Duan}</Typography>
          <LoadingButton
            loading={loading}
            variant="contained"
            startIcon={<Iconify icon="eva:link-2-fill" />}
            onClick={handleLinkHSSE}
          >
            Báo cáo HSSE
          </LoadingButton>
        </Grid>
        <Grid container spacing={3}>


          <Grid xs={12} md={12} lg={12}>
            <Box sx={{ maxHeight: 400, width: '100%', my: 4 }}>
              <Typography sx={{ pb: 1.5, fontWeight: '600', fontSize: 18 }}>
                Tỉ lệ hoàn thành checklist các ngày
              </Typography>
              <DataGrid rows={dataPercentDays} columns={columns} />
            </Box>
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <ChecklistsHoanThanh
              title="Tỉ lệ hoàn thành checklist"
              subheader="Hoàn thành checklist theo ca"
              chart={{
                categories: dataTotalYear?.categories,
                series: dataTotalYear?.series,
              }}
              selectedYear={selectedYear}
              selectedKhoiCV={selectedKhoiCV}
              selectedTangGiam={selectedTangGiam}
              onYearChange={setSelectedYear}
              onTangGiamChange={setSelectedTangGiam}
              onKhoiChange={setSelectedKhoiCV}
              STATUS_OPTIONS={STATUS_OPTIONS}
              tangGiam={tangGiam}
            />
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <ChecklistsSuCo
              title="Sự cố checklist "
              subheader="Số lượng sự cố"
              chart={{
                categories: dataTotalYearSuCo?.categories,
                series: dataTotalYearSuCo?.series,
              }}
              selectedYear={selectedYearSuCo}
              selectedKhoiCV={selectedKhoiCVSuCo}
              selectedTangGiam={selectedTangGiamSuCo}
              onYearChange={setSelectedYearSuCo}
              onTangGiamChange={setSelectedTangGiamSuCo}
              onKhoiChange={setSelectedKhoiCVSuCo}
              STATUS_OPTIONS={STATUS_OPTIONS}
              tangGiam={tangGiam}
            />
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            <ChecklistsSuCoNgoai
              title="Sự cố ngoài checklist "
              subheader="Số lượng sự cố ngoài"
              chart={{
                categories: dataTotalYearSuCoNgoai?.categories,
                series: dataTotalYearSuCoNgoai?.series,
              }}
              selectedYear={selectedYearSuCoNgoai}
              selectedKhoiCV={selectedKhoiCVSuCoNgoai}
              selectedTangGiam={selectedTangGiamSuCoNgoai}
              onYearChange={setSelectedYearSuCoNgoai}
              onTangGiamChange={setSelectedTangGiamSuCoNgoai}
              onKhoiChange={setSelectedKhoiCVSuCoNgoai}
              STATUS_OPTIONS={STATUS_OPTIONS}
              tangGiam={tangGiam}
            />
          </Grid>

          {dataTotalKhuvuc && (
            <Grid xs={12} md={6} lg={4}>
              <AppCurrentDownload
                title="Khai báo khu vực"
                chart={{
                  series: dataTotalKhuvuc,
                  colors: [
                    'rgb(0, 167, 111)',
                    'rgb(255, 171, 0)',
                    'rgb(255, 86, 48)',
                    'rgb(0, 184, 217)',
                  ],
                }}
              />
            </Grid>
          )}

          {dataTotalHangmuc && (
            <Grid xs={12} md={6} lg={4}>
              <AppCurrentDownload
                title="Khai báo hạng mục"
                chart={{
                  series: dataTotalHangmuc,
                  colors: [
                    'rgb(0, 167, 111)',
                    'rgb(255, 171, 0)',
                    'rgb(255, 86, 48)',
                    'rgb(0, 184, 217)',
                  ],
                }}
              />
            </Grid>
          )}

          <Grid xs={12} md={6} lg={4}>
            {dataTotalKhoiCV && (
              <AnalyticsCurrentVisits
                title={`Khai báo Checklists: ${totalKhoiCV}`}
                chart={{
                  series: dataTotalKhoiCV,
                  colors: [
                    'rgb(0, 167, 111)',
                    'rgb(255, 171, 0)',
                    'rgb(255, 86, 48)',
                    'rgb(0, 184, 217)',
                  ],
                }}
              />
            )}
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            {dataTotalErrorWeek && (
              <BankingRecentTransitions
                title="Sự cố ngày hôm trước"
                tableData={dataTotalErrorWeek}
                handleViewRow={handleClickOpen}
                tableLabels={[
                  { id: 'checklistName', label: 'Tên checklist' },
                  { id: 'Ngay', label: 'Ngày' },
                  { id: 'calv', label: 'Ca làm việc' },
                  { id: 'note', label: 'Ghi chú' },
                  { id: 'Giamsat', label: 'Giám sát' },
                  { id: 'image', label: 'Ảnh' },
                  { id: '' },
                ]}
              />
            )}
          </Grid>

          <Grid xs={12} md={12} lg={12}>
            {dataTotalErrorWeek && (
              <ChecklistRecentTransitions
                title="Các checklist lỗi"
                tableData={dataChecklistsError}
                tableLabels={[
                  { id: 'checklistName', label: 'Tên checklist' },
                  { label: 'Giá trị định danh', id: 'Giatridinhdanh' },
                  { label: 'Giá trị nhận', id: 'Giatrinhan' },
                  { label: 'Tầng', id: 'Tentang' },
                  { label: 'Số thứ tự', id: 'Sothutu' },
                  { label: 'Mã số', id: 'Maso' },
                  { label: 'Hạng mục', id: 'Hangmuc' },
                ]}
              />
            )}
          </Grid>
        </Grid>
      </Container>

      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        {/* <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">

</DialogTitle> */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'gray',
          }}
        >
          {/* <CloseIcon /> */}
        </IconButton>
        <DialogContent dividers>
          <Image
            minWidth={500}
            minHeight={500}
            alt={detailChecklist?.ent_checklist?.Checklist}
            src={`https://lh3.googleusercontent.com/d/${detailChecklist?.Anh}=s1000?authuser=0`}
            ratio="1/1"
          />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
