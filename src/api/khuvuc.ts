
import { IKhuvuc, IToanha, IKhoiCV, IHangMuc, IChecklist, ICalv, E_Tang, IGiamsat, IChucvu, IDuan, IUser, ITang, ITbChecklist, TbChecklistCalv, IThietLapCa, IDuanKhoiCV, ISucongoai, ILocation, ILoaiChiSo, IHangMucChiSo, IChinhanh, IHSSE, IDayChecklistC, IP0, IPhanhe, ILoaisosanh, IBeboi, ITailieuphanhe } from 'src/types/khuvuc';
// utils
import { endpoints, fetcher } from 'src/utils/axios';
import { useEffect, useMemo } from 'react';

// types
import useSWR from 'swr';

const STORAGE_KEY = 'accessToken';

export function useGetChuKyDuAn() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_duan_khoicv/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      duankhoicv: (data?.data as IDuanKhoiCV[]) || [],
      duankhoicvLoading: isLoading,
      duankhoicvError: error,
      duankhoicvValidating: isValidating,
      duankhoicvEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChuKyDuAnDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_duan_khoicv/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      duankhoicv: (data?.data as IDuanKhoiCV) || [],
      duankhoicvLoading: isLoading,
      duankhoicvError: error,
      duankhoicvValidating: isValidating,
      duankhoicvEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCalv() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_calv/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      calv: (data?.data as ICalv[]) || [],
      calvLoading: isLoading,
      calvError: error,
      calvValidating: isValidating,
      calvEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCalvDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_calv/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      calv: (data?.data as ICalv) || [],
      calvLoading: isLoading,
      calvError: error,
      calvValidating: isValidating,
      calvEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChiSoDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/hangmuc-chiso/byDuan/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      hmChiSo: (data?.data as IHangMucChiSo) || [],
      hmChiSoLoading: isLoading,
      hmChiSoError: error,
      hmChiSoValidating: isValidating,
      hmChiSoEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetCalvFilter(inp : any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const dataInput = {
    ID_KhoiCV: inp?.ID_KhoiCV
  }
  const URL = `${process.env.REACT_APP_HOST_API}/ent_calv/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dataInput),
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      calv: (data?.data as ICalv[]) || [],
      calvLoading: isLoading,
      calvError: error,
      calvValidating: isValidating,
      calvEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetToanha() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_toanha/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      toanha: (data?.data as IToanha[]) || [],
      toanhaLoading: isLoading,
      toanhaError: error,
      toanhaValidating: isValidating,
      toanhaEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTang() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_tang`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      tang: (data?.data as ITang[]) || [],
      tangLoading: isLoading,
      tangError: error,
      tangValidating: isValidating,
      tangEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTaiLieuPhanHe() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_tailieuphanhe/by-duan`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      tailieuphanhe: (data?.data as ITailieuphanhe[]) || [],
      tailieuphanheLoading: isLoading,
      tailieuphanheError: error,
      tailieuphanheValidating: isValidating,
      tailieuphanheEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhoiCV() {
  const URL = `${process.env.REACT_APP_HOST_API}/ent_khoicv`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      khoiCV: (data?.data as IKhoiCV[]) || [],
      khoiCVLoading: isLoading,
      khoiCVError: error,
      khoiCVValidating: isValidating,
      khoiCVEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetLoaiCS() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/loai-chiso/byDuan`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      loaiCS: (data?.data as ILoaiChiSo[]) || [],
      loaiCSLoading: isLoading,
      loaiCSError: error,
      loaiCSValidating: isValidating,
      loaiCSEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChucvu() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_chucvu`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      chucVu: (data?.data as IChucvu[]) || [],
      chucVuLoading: isLoading,
      chucVuError: error,
      chucVuValidating: isValidating,
      chucVuEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhuVuc() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_khuvuc/filter`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      khuvuc: (data?.data as IKhuvuc[]) || [],
      khuvucLoading: isLoading,
      khuvucError: error,
      khuvucValidating: isValidating,
      khuvucEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetLocations() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/tb_checklistc/report-location`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      location: (data?.data as ILocation[]) || [],
      locationLoading: isLoading,
      locationError: error,
      locationValidating: isValidating,
      locationEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export function useGetDuan() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_duan`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      duan: (data?.data as IDuan[]) || [],
      duanLoading: isLoading,
      duanError: error,
      duanValidating: isValidating,
      duanEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDuanWeb() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_duan/thong-tin-du-an`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      duan: (data?.data as IDuan[]) || [],
      duanLoading: isLoading,
      duanError: error,
      duanValidating: isValidating,
      duanEmpty: !isLoading && !data?.length,
      reloadDuan: mutate,
    }),
    [data, error, isLoading, isValidating, mutate ]
  );

  return memoizedValue;
}

export function useGetHSSE() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/hsse/all`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      hsse: (data?.data as IHSSE[]) || [],
      hsseLoading: isLoading,
      hsseError: error,
      hsseValidating: isValidating,
      hsseEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetBeBoi() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/beboi`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      beboi: (data?.data as IBeboi[]) || [],
      beboiLoading: isLoading,
      beboiError: error,
      beboiValidating: isValidating,
      beboiEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetHSSEAll() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/hsse/admin`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      hsse: (data?.data as IHSSE[]) || [],
      hsseLoading: isLoading,
      hsseError: error,
      hsseValidating: isValidating,
      hsseEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetP0_ByDuan(page: any, limit: any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/p0/all-duan?page=${page}&limit=${limit}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      p0: (data?.data as IP0[]) || [],
      p0Loading: isLoading,
      p0Error: error,
      p0Validating: isValidating,
      p0Empty: !isLoading && !data?.length,
      p0Count: data?.count,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetGiamsat() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_giamsat/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      giamsat: (data?.data as IGiamsat[]) || [],
      giamsatLoading: isLoading,
      giamsatError: error,
      giamsatValidating: isValidating,
      giamsatEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetGiamsatDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_giamsat/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      giamsat: (data?.data as IGiamsat) || [],
      giamsatLoading: isLoading,
      giamsatError: error,
      giamsatValidating: isValidating,
      giamsatEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDuanDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_duan/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      duan: (data?.data as IDuan) || [],
      duanLoading: isLoading,
      duanError: error,
      duanValidating: isValidating,
      duanEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetHSSEDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/hsse/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      hsse: (data?.data as IHSSE) || [],
      hsseLoading: isLoading,
      hsseError: error,
      hsseValidating: isValidating,
      hsseEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetBeBoiDetail(date: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/beboi/${date}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      beboi: (data?.data as IBeboi[]) || [],
      beboiLoading: isLoading,
      beboiError: error,
      beboiValidating: isValidating,
      beboiEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetP0Detail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/p0/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      p0: (data?.data as IP0) || [],
      p0Loading: isLoading,
      p0Error: error,
      p0Validating: isValidating,
      p0Empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetToanhaDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_toanha/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      toanha: (data?.data as IToanha) || [],
      toanhaLoading: isLoading,
      toanhaError: error,
      toanhaValidating: isValidating,
      toanhaEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhuVucDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_khuvuc/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      khuvuc: (data?.data as IKhuvuc) || [],
      khuvucLoading: isLoading,
      khuvucError: error,
      khuvucValidating: isValidating,
      khuvucEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetHangMuc() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_hangmuc/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      hangMuc: (data?.data as IHangMuc[]) || [],
      hangMucLoading: isLoading,
      hangMucError: error,
      hangMucValidating: isValidating,
      hangMucEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUsers() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_user/get-online`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      users: (data?.data as IUser[]) || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetRoleUsers() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_user/get-role`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      user: (data?.data as IUser[]) || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetHangMucDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_hangmuc/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      hangMuc: (data?.data as IHangMuc) || [],
      hangMucLoading: isLoading,
      hangMucError: error,
      hangMucValidating: isValidating,
      hangMucEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTaiLieuPhanHeByID(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_tailieuphanhe/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      taiLieuPhanHe: (data?.data as ITailieuphanhe) || [],
      taiLieuPhanHeLoading: isLoading,
      taiLieuPhanHeError: error,
      taiLieuPhanHeValidating: isValidating,
      taiLieuPhanHeEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChecklist(pag: any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_checklist/?page=${Number(pag?.page) + 1}&limit=${pag?.limit}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      checkList: (data?.data as IChecklist[]) || [],
      checkListLoading: isLoading,
      checkListError: error,
      checkListValidating: isValidating,
      checkListEmpty: !isLoading && !data?.length,
      checkListTotalPages: data?.totalPages,
      checklistPage: data?.page,
      checklistTotalCount: data?.totalCount
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTb_Checklist(pag: any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/tb_checklistc/?page=0&limit=300`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      tb_checkList: (data?.data as ITbChecklist[]) || [],
      tb_checkListLoading: isLoading,
      tb_checkListError: error,
      tb_checkListValidating: isValidating,
      tb_checkListEmpty: !isLoading && !data?.length,
      tb_checkListTotalPages: data?.totalPages,
      tb_checklistPage: data?.page,
      tb_checklistTotalCount: data?.totalCount,
      mutateTb_Checklist: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetDayTb_Checklist(pag: any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/tb_checklistc/day?page=0&limit=300`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      tb_day_checkList: (data?.data as IDayChecklistC[]) || [],
      tb_day_checkListLoading: isLoading,
      tb_day_checkListError: error,
      tb_day_checkListValidating: isValidating,
      tb_day_checkListEmpty: !isLoading && !data?.length,
      tb_day_checkListTotalPages: data?.totalPages,
      tb_day_checklistPage: data?.page,
      tb_day_checklistTotalCount: data?.totalCount,
      mutateTb_Checklist: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetTb_ChecklistDetail(id:any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/tb_checklistc/ca/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      checkList: (data?.data as TbChecklistCalv[]) || [],
      dataChecklistC: (data?.dataChecklistC as any) || null,
      checkListLoading: isLoading,
      checkListError: error,
      checkListValidating: isValidating,
      checkListEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDayTb_ChecklistDetail(Ngay:string, ID_Calv: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_checklist/filter-mul-day/${Ngay}/${ID_Calv}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      checkList: (data?.data as any) || [],
      checkListLoading: isLoading,
      checkListError: error,
      checkListValidating: isValidating,
      checkListEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChecklistWeb() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_checklist/all`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      checkList: (data?.data as IChecklist[]) || [],
      checkListLoading: isLoading,
      checkListError: error,
      checkListValidating: isValidating,
      checkListEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChecklistDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_checklist/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      checkList: (data?.data as IChecklist) || [],
      checkListLoading: isLoading,
      checkListError: error,
      checkListValidating: isValidating,
      checkListEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUserDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_user/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      user: (data?.data as IUser) || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhuvucByToanha(id?: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_toanha/khuvuc/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      khuvuc: (data?.data as IKhuvuc[]) || [],
      user: (data?.user as IUser) || [],
      khuvucLoading: isLoading,
      khuvucError: error,
      khuvucValidating: isValidating,
      khuvucEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetGiamSatByDuan(){
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_user/gs`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      user: (data?.data as IUser[]) || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPhanCaByDuan(){
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_thietlapca`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      thietlapca: (data?.data as IThietLapCa[]) || [],
      thietlapcaLoading: isLoading,
      thietlapcaError: error,
      thietlapcaValidating: isValidating,
      thietlapcaEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetDetailPhanCaByDuan(id?: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_thietlapca/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      thietlapca: (data?.thietlapca as IThietLapCa),
      khuvucCheck: (data?.data as IKhuvuc[]) || [],
      thietlapcaLoading: isLoading,
      thietlapcaError: error,
      thietlapcaValidating: isValidating,
      thietlapcaEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetNhomDuAn() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_duan/du-an`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      nhomduan: (data?.data as any),
      nhomduanLoading: isLoading,
      nhomduanError: error,
      nhomduanValidating: isValidating,
      nhomduanEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetProfile(id: string){
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_user/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      user: (data?.data as IUser) || [],
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating,
      userEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// export function useGetNhompb(){
//   const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_nhompb/all`;
//   const fetCher = (url: string) =>
//     fetch(url, {
//       method: 'get',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }).then((res) => res.json());
//   const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

//   const memoizedValue = useMemo(
//     () => ({
//       nhompb: (data?.data as INhompb[]) || [],
//       nhompbLoading: isLoading,
//       nhompbError: error,
//       nhompbValidating: isValidating,
//     }),
//     [data, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

export function useGetChinhanh(){
  const URL = `${process.env.REACT_APP_HOST_API}/ent_chinhanh/all`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      chinhanh: (data?.data as IChinhanh[]) || [],
      chinhanhLoading: isLoading,
      chinhanhError: error,
      chinhanhValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPhanhe(){
  const URL = `${process.env.REACT_APP_HOST_API}/ent_phanhe/all`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      phanHe: (data?.data as IPhanhe[]) || [],
      phanHeLoading: isLoading,
      phanHeError: error,
      phanHeValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetLoaisosanh(){
  const URL = `${process.env.REACT_APP_HOST_API}/ent_loaisosanh/all`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      loaiSoSanh: (data?.data as ILoaisosanh[]) || [],
      loaiSoSanhLoading: isLoading,
      loaiSoSanhError: error,
      loaiSoSanhValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// export function useGetChucVu(){
//   const URL = 'https://checklist.pmcweb.vn/pmc-assets/api/ent_chucvu/all`;
//   const fetCher = (url: string) =>
//     fetch(url, {
//       method: 'get',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }).then((res) => res.json());
//   const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

//   const memoizedValue = useMemo(
//     () => ({
//       chucvu: (data?.data as IChucVu[]) || [],
//       chucvuLoading: isLoading,
//       chucvuError: error,
//       chucvuValidating: isValidating,
//     }),
//     [data, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

export function useGetSuCoNgoai() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/tb_sucongoai/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      sucongoai: (data?.data as ISucongoai[]) || [],
      sucongoaiLoading: isLoading,
      sucongoaiError: error,
      sucongoaiValidating: isValidating,
      sucongoaiEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetLoaiChiSo() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/loai-chiso/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      loaichiso: (data?.data as ILoaiChiSo[]) || [],
      loaichisoLoading: isLoading,
      loaichisoError: error,
      loaichisoValidating: isValidating,
      loaichisoEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetLoaiChiSoByDuan(){
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/hangmuc-chiso/byDuan/`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      hmCS: (data?.data as IHangMucChiSo[]) || [],
      hmCSLoading: isLoading,
      hmCSError: error,
      hmCSValidating: isValidating,
      hmCSEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUserHistory(id: any){
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/user-history/${id}`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      userHistory: (data?.data as IHangMucChiSo[]) || [],
      userHistoryLoading: isLoading,
      userHistoryError: error,
      userHistoryValidating: isValidating,
      userHistoryEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetThamSoPhanHeAll() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_thamsophanhe`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      ThamSophanhe: (data?.data as any[]) || [],
      ThamSophanheLoading: isLoading,
      ThamSophanheError: error,
      ThamSophanheValidating: isValidating,
      ThamSophanheEmpty: !isLoading && !data?.length,
      ThamSophanheMutate: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

export function useGetPhanHeAll() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `${process.env.REACT_APP_HOST_API}/ent_phanhe`;
  const fetCher = (url: string) =>
    fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      phanhe: (data?.data as any[]) || [],
      phanheLoading: isLoading,
      phanheError: error,
      phanheValidating: isValidating,
      phanheEmpty: !isLoading && !data?.length,
      phanheMutate: mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}