import { IRoom, IRoomReview, IService, ITypeRoom, IVoucher, IUser, IFacilities } from 'src/types/room';
import axios, { AxiosRequestConfig } from 'axios';
// utils
import { endpoints, fetcher } from 'src/utils/axios';
import { useEffect, useMemo } from 'react';

// types
import { IProductItem } from 'src/types/product';
import useSWR from 'swr';

// ----------------------------------------------------------------------

export function useGetProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: (data?.products as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.products.length,
    }),
    [data?.products, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetFacilities() {
  const URL = 'https://be-nodejs-project.vercel.app/api/facilities'
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      facilities: (data as IFacilities) || [],
      facilitiesLoading: isLoading,
      facilitiesError: error,
      facilitiesValidating: isValidating,
      facilitiesEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTypeRooms() {
  const URL = 'https://be-nodejs-project.vercel.app/api/typerooms'
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      typerooms: (data as ITypeRoom[]) || [],
      typeroomsLoading: isLoading,
      typeroomsError: error,
      typeroomsValidating: isValidating,
      typeroomsEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetVouchers() {
  const URL = 'https://be-nodejs-project.vercel.app/api/voucher/'
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      vouchers: (data as IVoucher[]) || [],
      vouchersLoading: isLoading,
      vouchersError: error,
      vouchersValidating: isValidating,
      vouchersEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTypeServices() {
  const URL = 'https://be-nodejs-project.vercel.app/api/typeservices'
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      typeservices: (data as ITypeRoom[]) || [],
      typeservicesLoading: isLoading,
      typeservicesError: error,
      typeservicesValidating: isValidating,
      typeservicesEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTypeRoom(id: string) {
  const URL = id ? [`https://be-nodejs-project.vercel.app/api/typerooms/${id}` ] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data: data as ITypeRoom,
      dataLoading: isLoading,
      dataError: error,
      dataValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetTypeService(id: string) {
  const URL = id ? [`https://be-nodejs-project.vercel.app/api/typeservices/${id}` ] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data: data as ITypeRoom,
      dataLoading: isLoading,
      dataError: error,
      dataValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetEmployees() {
  const URL = 'https://be-nodejs-project.vercel.app/api/employee/list'
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      employees: (data as IUser[]) || [],
      employeesLoading: isLoading,
      employeesError: error,
      employeesValidating: isValidating,
      employeesEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetServices() {
  const URL = 'https://be-nodejs-project.vercel.app/api/services'
  const fetCher = (url: string) => fetch(url).then((res) => res.json()).catch((err) => console.log('err', err));
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      services: (data as IService[]) || [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetRoomServices() {
  const URL = 'https://be-nodejs-project.vercel.app/api/services'
  const fetCher = (url: string) => fetch(url).then((res) => res.json()).catch((err) => console.log('err', err));
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      services: (data as IService[]) || [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetService(id: string) {
  const URL = id ? [`https://be-nodejs-project.vercel.app/api/services/${id}` ] : null;
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      service: (data as IService) || [],
      serviceLoading: isLoading,
      serviceError: error,
      serviceValidating: isValidating,
      serviceEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export function useGetRooms() {
  const URL = 'https://be-nodejs-project.vercel.app/api/rooms/'
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      rooms: (data as IRoom[]) || [],
      roomsLoading: isLoading,
      roomsError: error,
      roomsValidating: isValidating,
      roomsEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetRoom(id: string) {
  const URL = id ? [`https://be-nodejs-project.vercel.app/api/rooms/${id}` ] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      room: data as any,
      roomLoading: isLoading,
      roomError: error,
      roomValidating: isValidating,
      roomEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetReview(id: string) {
  const URL = id ? [`https://be-nodejs-project.vercel.app/api/reviews/${id}` ] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      reviews: data as IRoomReview[],
      reviewLoading: isLoading,
      reviewError: error,
      reviewValidating: isValidating,
      reviewEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );


  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId: string) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product as IProductItem,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query: string) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.results as IProductItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
