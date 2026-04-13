import { ReactNode } from 'react';

export function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="page-wrapper">{children}</div>;
}
