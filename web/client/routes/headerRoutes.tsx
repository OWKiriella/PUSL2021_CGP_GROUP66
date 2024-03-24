import React from 'react';
import AdminHeader from '../pages/_layout/_headers/AdminHeader';




const headers = [


	{
		path: `/admin/*`,
		element: <AdminHeader />,
	},
	

];

export default headers;
