import React, { FC, useCallback, useContext, useState } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import classNames from 'classnames';
import Link from 'next/link';
import PropTypes from 'prop-types';
import AuthContext from '../context/authContext';
import useDarkMode from '../hooks/useDarkMode';
import PageWrapper from '../layout/PageWrapper/PageWrapper';
import Page from '../layout/Page/Page';
import Card, { CardBody } from '../components/bootstrap/Card';
import Button from '../components/bootstrap/Button';
import FormGroup from '../components/bootstrap/forms/FormGroup';
import Input from '../components/bootstrap/forms/Input';
import Select from '../components/bootstrap/forms/Select';
import axios from 'axios';
import Swal from 'sweetalert2';
import PostDataService from '../services/postservice'
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = () => {

	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};

interface User {
	password: string,
	email: string,
}

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: NextPage<ILoginProps> = ({ isSignUp }) => {
	const router = useRouter();
	const { darkModeStatus } = useDarkMode();
	const [user, setUser] = useState<User>();

	//get database data 
	const fetchData = async () => {

		try {
			const dataCollection: any = collection(firestore, 'admin');

			const querySnapshot = await getDocs(dataCollection);

			const firebaseData = querySnapshot.docs.map((doc) => {
				const data = doc.data() as User;
				return {

					...data,

					id: doc.id,
				};
			});
			setUser(firebaseData[0]);

		} catch (error) {
			console.error('Error fetching data: ', error);
		}
	};
	fetchData();


	//login
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			email: '',
			password: '',
		},
		validate: (values) => {
			const errors: { email?: string; password?: string } = {};

			if (!values.email) {
				errors.email = 'Required';
			}

			if (!values.password) {
				errors.password = 'Required';
			}

			return errors;
		},
		validateOnChange: false,

		onSubmit: async (values) => {
			try {
				fetchData()
				if (user) {
					if (values.email == user.email && user.password == values.password) {
						router.push('/admin/Dashboard');
					}
					else {
						Swal.fire(' Error', 'Email or password is not correct', 'error');
					}

				} else {
					Swal.fire(' Error', 'Email or password is not correct', 'error');
				}

			} catch (error) {
				console.error("Error occurred:", error);
				Swal.fire(' Error', 'Email or password wrong', 'error');
			}

		},
	});



	return (
		<PageWrapper
			isProtected={false}
		// className={classNames({ 'bg-dark': !singUpStatus, 'bg-light': singUpStatus })}
		>
			<Head>
				<title> Login</title>
			</Head>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										href='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}>
										{/* <Logo width={200} /> */}
									</Link>
								</div>
								{/* <div
									className={classNames('rounded-3', {
										'bg-l10-dark': !darkModeStatus,
										'bg-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										<div className='col-12'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}

												className='rounded-1 w-100'
												size='lg'
											>
												Login
											</Button>
										</div>

									</div>
								</div> */}

								<LoginHeader />


								<form className='row g-4'>

									<>
										<div className='col-12'>
											<FormGroup id='email' label='Your email' className='col-md-12'>
												<Input
													autoComplete='username'
													value={formik.values.email}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													isValid={formik.isValid}
													isTouched={formik.touched.email}
													invalidFeedback={formik.errors.email}
												/>
											</FormGroup>
											<FormGroup id='password' label='Password' className='col-md-12'>
												<Input
													type='password'
													value={formik.values.password}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													isValid={formik.isValid}
													isTouched={formik.touched.password}
													invalidFeedback={formik.errors.password}
												/>
											</FormGroup>
										</div>
										<div className='col-12'>

											<Button
												color='warning'
												className='w-100 py-3'
												onClick={formik.handleSubmit}>
												Login
											</Button>

										</div>
									</>


								</form>
							</CardBody>
						</Card>

					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
});

export default Login;
