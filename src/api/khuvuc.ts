
import { IKhuvuc, IToanha, IKhoiCV, IHangMuc, IChecklist, ICalv, E_Tang } from 'src/types/khuvuc';
import axios, { AxiosRequestConfig } from 'axios';
// utils
import { endpoints, fetcher } from 'src/utils/axios';
import { useEffect, useMemo } from 'react';

// types
import useSWR from 'swr';
// const typePagination = {
//   page: string;
//   limit: string;
// }

const STORAGE_KEY = 'accessToken';

export function useGetCalv() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/api/ent_calv/';
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
      calvEmpty: !isLoading && !data.length,
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
  console.log('dataInput',inp)
  const URL = `https://checklist.pmcweb.vn/api/ent_calv/`;
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
      calvEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetToanha() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/api/ent_toanha/';
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
      toanhaEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTang() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/api/ent_tang/';
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
      tang: (data?.data as E_Tang[]) || [],
      tangLoading: isLoading,
      tangError: error,
      tangValidating: isValidating,
      tangEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhoiCV() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/api/ent_khoicv`;
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
      khoiCV: (data?.data as IKhoiCV[]) || [],
      khoiCVLoading: isLoading,
      khoiCVError: error,
      khoiCVValidating: isValidating,
      khoiCVEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhuVuc() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/api/ent_khuvuc/filter';
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
      khuvucEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetKhuVucDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/api/ent_khuvuc/${id}`;
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
      khuvucEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetHangMuc() {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = 'https://checklist.pmcweb.vn/api/ent_hangmuc/';
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
      hangMucEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetHangMucDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/api/ent_hangmuc/${id}`;
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
      hangMucEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChecklist(pag: any) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/api/ent_checklist/?page=${Number(pag?.page) + 1}&limit=${pag?.limit}`;
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
      checkListEmpty: !isLoading && !data.length,
      checkListTotalPages: data?.totalPages,
      checklistPage: data?.page,
      checklistTotalCount: data?.totalCount
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChecklistDetail(id: string) {
  const accessToken = localStorage.getItem(STORAGE_KEY);
  const URL = `https://checklist.pmcweb.vn/api/ent_checklist/${id}`;
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
      checkListEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

