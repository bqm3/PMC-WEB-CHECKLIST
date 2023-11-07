import useSWR from 'swr';
import keyBy from 'lodash/keyBy';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints } from 'src/utils/axios';
// types
import { IMail, IMails, IMailLabel } from 'src/types/mail';

// ----------------------------------------------------------------------

export function useGetLabels() {
  const URL = endpoints.mail.labels;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      labels: (data?.labels as IMailLabel[]) || [],
      labelsLoading: isLoading,
      labelsError: error,
      labelsValidating: isValidating,
      labelsEmpty: !isLoading && !data?.labels.length,
    }),
    [data?.labels, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetMails(labelId: string) {
  const URL = labelId ? [endpoints.mail.list, { params: { labelId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(() => {
    const byId = keyBy(data?.mails, 'id') || {};
    const allIds = Object.keys(byId) || [];

    return {
      mails: {
        byId,
        allIds,
      } as IMails,
      mailsLoading: isLoading,
      mailsError: error,
      mailsValidating: isValidating,
      mailsEmpty: !isLoading && !allIds.length,
    };
  }, [data?.mails, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetMail(mailId: string) {
  const URL = mailId ? [endpoints.mail.details, { params: { mailId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      mail: data?.mail as IMail,
      mailLoading: isLoading,
      mailError: error,
      mailValidating: isValidating,
    }),
    [data?.mail, error, isLoading, isValidating]
  );

  return memoizedValue;
}
