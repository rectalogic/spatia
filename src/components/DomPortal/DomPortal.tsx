import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';

interface DomPortalProps {
  children: React.ReactNode;
}
export default function DomPortal({ children }: DomPortalProps) {
  const root = useMemo(() => document.createElement('div'), []);
  return ReactDOM.createPortal(<>{children}</>, root);
}
