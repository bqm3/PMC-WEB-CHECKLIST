import { IBookingOrder, IBookingOrderDetail , IBookingOrderData, IBookingService} from 'src/types/room';
import axios, { AxiosRequestConfig } from 'axios';
// utils
import { endpoints, fetcher } from 'src/utils/axios';
import { useEffect, useMemo } from 'react';

// types
import { IProductItem } from 'src/types/product';
import useSWR from 'swr';

// ----------------------------------------------------------------------

export function useGetOrderBookings() {
  const URL = 'https://be-nodejs-project.vercel.app/api/orders'
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      orders: data as IBookingOrder[] || [],
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
export function useGetOrderBookingService() {
  const URL = 'https://be-nodejs-project.vercel.app/api/room_service'
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      services: data as IBookingService[] || [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetOrderBookingServiceDetail(id: string) {
  const URL = `https://be-nodejs-project.vercel.app/api/room_service/${id}`
  const fetCher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading, error, isValidating } = useSWR(URL, fetCher);

  const memoizedValue = useMemo(
    () => ({
      services: data as IBookingService|| [],
      servicesLoading: isLoading,
      servicesError: error,
      servicesValidating: isValidating,
      servicesEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export function useGetOrderDetail(id: string) {
  const URL = id ? [`http://localhost:6969/api/orders/${id}` ] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      order: data as any | [],
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
      orderEmpty: !isLoading && !data.length,
    }),
    [data, error, isLoading, isValidating]
  );


  return memoizedValue;
}
