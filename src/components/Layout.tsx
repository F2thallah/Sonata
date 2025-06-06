
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import MusicBar from './MusicBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-y-auto">
          {children}
        </main>
      </div>
      <MusicBar />
    </div>
  );
};

export default Layout;
