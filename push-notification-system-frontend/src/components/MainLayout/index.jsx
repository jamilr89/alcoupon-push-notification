

import { Outlet } from 'react-router-dom';
import {SideBar} from '../Sidebar';
import TopBar from '../Topbar';

const MainLayout = ({ children }) => {
  return (

<div className="app">
 
      <SideBar />
  <main className="content">
    <TopBar />
    <Outlet/>
    </main>
    </div>

  
  );
};

export default MainLayout;