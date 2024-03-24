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
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../../../firebaseConfig';
import showNotification from '../../../../components/extras/showNotification';
import Icon from '../../../../components/icon/Icon';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Select from '../../../../components/bootstrap/forms/Select';
import Option, { Options } from '../../../../components/bootstrap/Option';



// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

// CustomerEditModal component definition
const CustomerEditModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {

	const [imageurl, setImageurl] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	//upload image
	const handleUploadimage = async () => {

		if (imageurl) {
			// Assuming generatePDF returns a Promise
			const pdfFile = imageurl;
			console.log(imageurl)
			const storageRef = ref(storage, `${pdfFile.name}`);
			const uploadTask = uploadBytesResumable(storageRef, pdfFile);

			return new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress1 = Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						);
					},
					(error) => {
						console.error(error.message);
						reject(error.message);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref)
							.then((url) => {
								console.log('File uploaded successfully. URL:', url);

								console.log(url);
								resolve(url); // Resolve the Promise with the URL
							})
							.catch((error) => {
								console.error(error.message);
								reject(error.message);
							});
					}
				);
			});
		} else {
			return null
		}
	}

	// Initialize formik for form management
	const formik = useFormik({

		initialValues: {


			name: '',
			category: "Vegetable",
			price:0,
			quantity: '',
			description: "",
			imgUrl: "",
			unitPrice:0,
			type:"g"


		}
		,
		validate: (values) => {
			const errors: {
				name?: string;
				category?: string;
				price?: string;
				quantity?: string;
				description?: string;
				imgUrl?: string

			} = {};
			
			if (!values.name) {
				errors.name = 'Required';
			}
			if (!values.description) {
				errors.description = 'Required';
			}
			if (!values.imgUrl) {
				errors.imgUrl = 'Required';
			}

			if (!values.price) {
				errors.price = 'Required';
			}
			if (!values.quantity) {
				errors.quantity = 'Required';
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
				const imgurl: any = await handleUploadimage()
			
				values.imgUrl = imgurl ||"";
				if(values.type=="g"){
					values.unitPrice=values.price/100
				}
				else if(values.type="ml"){
					values.unitPrice=values.price/100
				}
				else if(values.type="item"){
					values.unitPrice=values.price
				}
				
				const collectionRef = collection(firestore, 'product');

				addDoc(collectionRef, values).then(() => {

					setIsOpen(false);
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Info' size='lg' className='me-1' />
							<span>Successfully Update</span>
						</span>,
						'Product has been added successfully',
					);
				}).catch((error) => {
					console.error('Error update document: ', error);
					alert('An error occurred while adding the document. Please try again later.');
				});

				Swal.fire('Updated!', 'Product has been added successfully.', 'success');

				// }

			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
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

					<FormGroup id='name' label='Product name' className='col-md-6'>
						<Input
							onChange={formik.handleChange}
							value={formik.values.name}

							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='category' label='Category' className='col-md-6'>
					<Select
							ariaLabel='Default select example'
							placeholder={formik.values.category}
							onChange={formik.handleChange}

							value={formik.values.category}
							>
							<Option value='Vegetable'>Vegetable</Option>
							<Option value='Fruit'>Fruit</Option>
							<Option value='Bakery'>Bakery</Option>
							<Option value='Grocery'>Grocery</Option>
							<Option value='Items'>Items</Option>
						</Select>

					</FormGroup>
					<FormGroup id='price' label='Price' className='col-md-4'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.price}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.price}
							invalidFeedback={formik.errors.price}
							validFeedback='Looks good!'


						/>
						
					</FormGroup>
					<FormGroup id='type' label='Type'  className='col-md-2'>
					<Select
							ariaLabel='Default select example'
							placeholder={formik.values.type}
							onChange={formik.handleChange}

							value={formik.values.type}
							>
							<Option value='g'>100g</Option>
							{/* <Option value='Fruit'>Kg</Option> */}
							
							<Option value='ml'>100ml</Option>
							<Option value='item'>1 Item</Option>
							{/* <Option value='Items'>ml</Option> */}
						</Select>

					</FormGroup>
					<FormGroup id='quantity' label='Quantity' className='col-md-6'>
						<Input
							type='number'
							onChange={formik.handleChange}
							value={formik.values.quantity}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.quantity}
							invalidFeedback={formik.errors.quantity}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='description' label='Description' className='col-md-6'>
						<Input

							onChange={formik.handleChange}
							value={formik.values.description}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.description}
							invalidFeedback={formik.errors.description}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup label='imgUrl' onChange={formik.handleChange}className='col-md-6'>
						<Input
							type='file'
							onChange={(e: any) => {
								setImageurl(e.target.files[0]);
								formik.values.imgUrl="img"
								setSelectedImage(URL.createObjectURL(e.target.files[0]));
							}}
							
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.imgUrl}
							invalidFeedback={formik.errors.imgUrl}
						/>

					</FormGroup>
					{selectedImage && <img src={selectedImage} className=" d-block mb-4" alt="Selected Profile Picture" style={{ width: '150px', height: '150px' }} />}





				</div>
			</ModalBody>
			<ModalFooter className='px-4 pb-4'>
				<Button color='info' onClick={formik.handleSubmit}>
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
