import React from 'react';
import dynamic from 'next/dynamic';
import { demoPagesMenu, pageLayoutTypesPagesMenu } from '../menu';


const AdminAside = dynamic(() => import('../pages/_layout/_asides/AdminAside'));



const asides = [
	
	{ path: '/admin/*', element: <AdminAside/>, exact: true },


];

export default asides;
