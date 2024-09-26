import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
// import Spreadsheet from 'react-spreadsheet';/
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LoadingButton } from '@mui/lab';
// routes
import { useRouter } from 'src/routes/hooks';
// api
import { useGetKhoiCV, useGetKhuVuc } from 'src/api/khuvuc';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { PRODUCT_STOCK_OPTIONS, _jobs, _roles, REPORT_CHECKLIST } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import { useTable, getComparator } from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';

// types
import { IBaoCaoTableFilters, IBaoCaoTableFilterValue, ITbChecklist } from 'src/types/khuvuc';
//
import StatisticalTableToolbar from '../statistical-table-toolbar';

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

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const accessToken = localStorage.getItem(STORAGE_KEY);

  const { khoiCV } = useGetKhoiCV();

  const [indexBaoCao, setIndexBaoCao] = useState(null);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState(defaultFilters);

  const confirm = useBoolean();

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

  const [tableData, setTableData] = useState<any>([]);

  const handleFile = async (blob: any) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setTableData(jsonData); // Cập nhật state với dữ liệu JSON từ Excel
    };

    reader.readAsArrayBuffer(blob);
  };

  const handleShowFile = async () => {
    const response = await axios.post(
      `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/thong-ke-hang-muc-quan-trong`,
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

    // Gọi hàm để xử lý file Excel và cập nhật vào state
    handleFile(blob);
  };

  const handleExportReport = async () => {
    setLoading(true);
    const response = await axios.post(
      `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/cac-loai-bao-cao/${indexBaoCao}`,
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
      `https://checklist.pmcweb.vn/be/api/v2/tb_checklistc/thong-ke-hang-muc-quan-trong`,
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

  const handleValidate = (data: string) => {
    // Common validation function
    const isMissingRequiredFields =
      filters.startDate === null || filters.endDate === null || filters.publish.length === 0;

    // Display error message
    const showError = () => {
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 2000,
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

  return (
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
        {/* handleShowFile  */}
        {/* <Button
            sx={{ m: 2.5, float: 'right', background: '#2986cc' }}
            variant="contained"
            onClick={() => handleShowFile()}
            disabled={loading}
          >
            Preview
          </Button> */}
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
      </Card>

      {tableData.length > 0 && (
        <table border={1}>
          <thead>
            <tr>
              {tableData[0].map((col: any, index: any) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row: any, rowIndex: any) => (
              <tr key={rowIndex}>
                {row.map((cell: any, cellIndex: any) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
};
