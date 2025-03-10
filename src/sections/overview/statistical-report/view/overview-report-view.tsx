/* eslint-disable import/no-extraneous-dependencies */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Spreadsheet from 'react-spreadsheet';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// routes
import { useRouter } from 'src/routes/hooks';
// api
import { useGetKhoiCV, useGetKhuVuc } from 'src/api/khuvuc';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// _mock
import { PRODUCT_STOCK_OPTIONS, _jobs, _roles, REPORT_CHECKLIST } from 'src/_mock';
// components

import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';

import DialogBase from 'src/sections/base/dialogBase';

// types
import { IBaoCaoTableFilters, IBaoCaoTableFilterValue, ITbChecklist } from 'src/types/khuvuc';
//
import StatisticalTableToolbar from '../statistical-table-toolbar';
//
import InvoicePDF from '../invoice-pdf';


// ----------------------------------------------------------------------

const defaultFilters: IBaoCaoTableFilters = {
  name: '',
  publish: [],
  stock: [],
  startDate: null,
  endDate: new Date(),
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export const OverviewReportView = () => {
  const router = useRouter();

  const table = useTable();

  const view = useBoolean();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuthContext();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const { khoiCV } = useGetKhoiCV();

  const [indexBaoCao, setIndexBaoCao] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState<any>(false);
  const [spreadsheetData, setSpreadsheetData] = useState([]);

  const [loadingDiaLog, setLoadingDiaLog] = useState<boolean>(false);

  const [filters, setFilters] = useState(defaultFilters);

  const STATUS_OPTIONS = useMemo(
    () => [
      ...khoiCV.map((khoi: any) => ({
        value: khoi.ID_KhoiCV.toString(),
        label: khoi.KhoiCV,
      })),
    ],
    [khoiCV]
  );

  const handleFilters = useCallback(
    (name: string, value: IBaoCaoTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleClickBaoCao = useCallback((value: any) => {
    setIndexBaoCao(value);
  }, []);

  // xuat file words
  const handleExportReport = async () => {
    try {
      setLoading(true);
      setLoadingDiaLog(true);
      // Chuyển đổi ngày tháng sang định dạng ISO mà không thay đổi giá trị
      const startDate = new Date(filters.startDate ? filters.startDate : '');
      const endDate = new Date(filters.endDate ? filters.endDate : '');

      // Lấy giá trị ngày tháng mà không thay đổi
      const startDateString = `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T00:00:00.000Z`;
      const endDateString = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}T23:59:59.999Z`;
      const response = await axios.post(
        `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/reports/${indexBaoCao}`,
        {
          startDate: startDateString,
          endDate: endDateString,
          ID_KhoiCVs: filters.publish,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });

      // Create a link element
      const link = document.createElement('a');
      // Set the download attribute with a filename
      link.href = window.URL.createObjectURL(blob);
      link.download =
        (indexBaoCao === '1' && 'Tổng hợp ca.xlsx') ||
        (indexBaoCao === '3' && 'Báo cáo checklist có vấn đề.xlsx') ||
        (indexBaoCao === '2' && 'Bảng kê các sự cố khẩn cấp nằm ngoài Checklist.xlsx') ||
        '';

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically trigger a click on the link to download the file
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: error.message,
      });

      console.error('Error fetching Excel data:', error.message);
    } finally {
      setLoading(false);
      setLoadingDiaLog(false);
    }
  };

  // xuat file excel
  const fetchExcelData = async () => {
    try {
      // Chuyển đổi ngày tháng sang định dạng ISO mà không thay đổi giá trị
      const startDate = new Date(filters.startDate ? filters.startDate : '');
      const endDate = new Date(filters.endDate ? filters.endDate : '');

      // Lấy giá trị ngày tháng mà không thay đổi
      const startDateString = `${startDate.getFullYear()}-${(startDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T00:00:00.000Z`;
      const endDateString = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}T23:59:59.999Z`;
      const response = await axios.post(
        `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/preview-reports/${indexBaoCao}`,
        {
          startDate: startDateString,
          endDate: endDateString,
          ID_KhoiCVs: filters.publish,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // Convert the received data into a format suitable for react-spreadsheet
      const formattedData = response.data.map((row: any) =>
        row.map((cell: any) => ({ value: cell }))
      );
      setSpreadsheetData(formattedData);
    } catch (error) {
      console.error('Error fetching Excel data:', error);
    }
  };

  const handleExportStatistical = async () => {
    setLoading(true);
    const response = await axios.post(
      `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/thong-ke`,
      {
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });

    // Create a link element
    const link = document.createElement('a');

    // Set the download attribute with a filename
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Thống kê tra cứu.xlsx';

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically trigger a click on the link to download the file
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
    setLoading(false);
  };

  const handleExportAllArticleImportant = async () => {
    setLoading(true);
    const response = await axios.post(
      `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/report-article-important`,
      {
        startDate: filters.startDate,
        endDate: filters.endDate,
        ID_KhoiCVs: filters.publish,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });

    // Create a link element
    const link = document.createElement('a');

    // Set the download attribute with a filename
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Báo cáo tổng hợp Checklist ngăn ngừa rủi ro.xlsx';

    // Append the link to the body
    document.body.appendChild(link);

    // Programmatically trigger a click on the link to download the file
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
    setLoading(false);
  };

  const handlePreviewExportAllArticleImportant = async () => {
    const response = await axios.post(
      `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/preview-report-article-important`,
      {
        startDate: filters.startDate,
        endDate: filters.endDate,
        ID_KhoiCVs: filters.publish,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const formattedData = response.data.map((row: any) =>
      row.map((cell: any) => ({ value: cell }))
    );
    setSpreadsheetData(formattedData);
  };

  const handleValidate = (data: string) => {
    // Common validation function
    const isMissingRequiredFields =
      filters.startDate === null || filters.endDate === null || filters.publish.length === 0;

    // Display error message
    const showError = () => {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: `Phải nhập đầy đủ thông tin`,
      });
    };

    // Validate and perform actions based on `data` value
    switch (data) {
      case '3':
        if (isMissingRequiredFields) {
          showError();
        } else {
          handleExportReport();
        }
        break;

      case '4':
        if (isMissingRequiredFields) {
          showError();
        } else {
          handleExportStatistical();
        }
        break;
      case '5':
        if (isMissingRequiredFields) {
          showError();
        } else {
          handleExportAllArticleImportant();
        }
        break;
      case '1':
      case '2':
        if (filters.startDate === null || filters.endDate === null) {
          showError();
        } else {
          handleExportReport();
        }
        break;

      default:
        // Optional: Handle cases for invalid `data`
        break;
    }
  };

  const handleValidatePreview = (data: string) => {
    // Common validation function
    const isMissingRequiredFields =
      filters.startDate === null || filters.endDate === null || filters.publish.length === 0;

    // Display error message
    const showError = () => {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: `Phải nhập đầy đủ thông tin`,
      });
    };

    // Validate and perform actions based on `data` value
    switch (data) {
      case '3':
        if (isMissingRequiredFields) {
          showError();
        } else {
          setShowModal(true);
          fetchExcelData();
        }
        break;

      case '4':
        if (isMissingRequiredFields) {
          showError();
        } else {
          handleExportStatistical();
        }
        break;
      case '5':
        if (isMissingRequiredFields) {
          showError();
        } else {
          setShowModal(true);
          handlePreviewExportAllArticleImportant();
        }
        break;
      case '1':
      case '2':
        if (filters.startDate === null || filters.endDate === null) {
          showError();
        } else {
          setShowModal(true);
          fetchExcelData();
        }
        break;

      default:
        break;
    }
  };
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Loại báo cáo
          </Typography>

          <Stack sx={{ mb: 1 }}>
            {REPORT_CHECKLIST.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Radio
                    disabled={option.value === '4'}
                    checked={option.value === indexBaoCao}
                    onClick={() => handleClickBaoCao(option.value)}
                  />
                }
                label={option.label}
                sx={{ textTransform: 'capitalize', fontSize: 20 }}
              />
            ))}
          </Stack>
        </Stack>
        <Card>
          <StatisticalTableToolbar
            filters={filters}
            indexBaoCao={indexBaoCao}
            onFilters={handleFilters}
            publishOptions={STATUS_OPTIONS}
          />

          {`${indexBaoCao}` === '4' ? (
            <Button
              sx={{ m: 2.5, float: 'right', background: '#2986cc' }}
              variant="contained"
              onClick={() => handleValidate(`${indexBaoCao}`)}
              disabled={loading}
            >
              Xuất Thống Kê
            </Button>
          ) : (
            <Button
              sx={{ m: 2.5, float: 'right', background: '#2986cc' }}
              variant="contained"
              onClick={() => handleValidate(`${indexBaoCao}`)}
              disabled={loading}
            >
              Xuất Báo Cáo
            </Button>
          )}
          <Button
            sx={{ m: 2.5, float: 'right' }}
            variant="contained"
            color="success"
            onClick={() => {
              handleValidatePreview(`${indexBaoCao}`);
            }}
            disabled={loading}
          >
            Preview
          </Button>
        </Card>
      </Container>
      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="lg">
        <DialogContent sx={{ mt: 2.5, mr: 2.5 }}>
          <Spreadsheet data={spreadsheetData} />
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            variant="contained"
            onClick={() => handleValidate(`${indexBaoCao}`)}
          >
            Download Excel
          </Button>
          <Button color="error" variant="contained" onClick={view.onTrue}>
            Download PDF
          </Button>
          <Button color="inherit" variant="contained" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Close
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InvoicePDF spreadsheetData={spreadsheetData} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>

      <DialogBase
        open={loadingDiaLog}
        onClose={() => setLoadingDiaLog(false)}
        message="Đang xử lý, vui lòng chờ..."
      />
    </>
  );
};
