import React, { useState, useEffect, FC } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Swal from 'sweetalert2';
import PostDataService from '../../../../services/postservice';



// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

// CustomerEditModal component definition
const CustomerEditModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {

	// Initialize formik for form management
	const formik = useFormik({

		initialValues: {

			userID: "",
			name: '',
			address: "",
			email: '',
			contact: '',
			status: 1

		}
		,
		validate: (values) => {
			const errors: {
				userID?: string;
				name?: string;
				address?: string;
				email?: string;
				contact?: string;

			} = {};
			if (!values.userID) {
				errors.userID = 'Required';
			}
			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.email) {
				errors.email = 'Required';
			}
			if (!values.contact) {
				errors.contact = 'Required';
			}
			if (!values.address) {
				errors.address= 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {

			try {
				const processingPopup = Swal.fire({
					title: "Processing...",
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				console.log(values)
				
			} catch (error) {
				Swal.fire('Network Error', 'Please try again later', 'error');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='lg' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id="">{'New Customer'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>

					<FormGroup id='userID' label='User ID' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.userID}

							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.userID}
							invalidFeedback={formik.errors.userID}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='name' label='Name' className='col-md-6'>
						<Input
							required

							onChange={formik.handleChange}
							value={formik.values.name}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'

						/>
					</FormGroup>
					<FormGroup id='address' label='Address' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.address}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.address}
							invalidFeedback={formik.errors.address}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='email' label='Email' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.email}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.email}
							invalidFeedback={formik.errors.email}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='contact' label='Contact' className='col-md-6'>
						<Input

							onChange={formik.handleChange}
							value={formik.values.contact}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.contact}
							invalidFeedback={formik.errors.contact}
							validFeedback='Looks good!'


						/>
					</FormGroup>





				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				{/* Save button to submit the form */}
				<Button color='info' onClick={formik.handleSubmit} >
					Save
				</Button>
			</ModalFooter>
		</Modal>
	);
}
// If 'id' is not present, return null (modal won't be rendered)



// Prop types definition for CustomerEditModal component
CustomerEditModal.propTypes = {
	id: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CustomerEditModal;
