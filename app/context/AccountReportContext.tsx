import { createContext, Dispatch, ReactNode, useState } from 'react';

interface reportTypes {
  id: string;
  approved: boolean;
}

interface reportStateTypes {
  worker: reportTypes;
  setWorker: Dispatch<reportTypes>;
}

export const AccountReportContext = createContext<reportStateTypes>({
  worker: { id: '', approved: false },
  setWorker: () => {},
});

export default function AccountReportProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [worker, setWorker] = useState({ id: '', approved: false });

  return (
    <AccountReportContext value={{ worker, setWorker }}>
      {children}
    </AccountReportContext>
  );
}
