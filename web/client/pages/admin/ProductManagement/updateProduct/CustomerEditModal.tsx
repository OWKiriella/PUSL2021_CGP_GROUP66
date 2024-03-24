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
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../../../firebaseConfig';
import showNotification from '../../../../components/extras/showNotification';
import Icon from '../../../../components/icon/Icon';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import Select from '../../../../components/bootstrap/forms/Select';
import Option, { Options } from '../../../../components/bootstrap/Option';


interface Product {
	id: any,
	name: string,
	category: string,
	description: string,
	price: number,
	quantity: number,
	imgUrl: string


}

// Define the props for the CustomerEditModal component
interface ICustomerEditModalProps {
	id: string;
	isOpen: boolean;
	setIsOpen(...args: unknown[]): unknown;
}

// CustomerEditModal component definition
const CustomerEditModal: FC<ICustomerEditModalProps> = ({ id, isOpen, setIsOpen }) => {

	console.log(id)
	const [imageurl, setImageurl] = useState<any>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [product, setProduct] = useState<Product>();

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



	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataDoc = doc(firestore, `product/${id}`);
				const docSnap = await getDoc(dataDoc);
				if (docSnap.exists()) {
					const data = docSnap.data();
					const firebaseData: any = {
						...data,
						id: docSnap.id,
					};
					setProduct(firebaseData);
					setSelectedImage(firebaseData.imgUrl)
				} else {
					console.log('No such document!');
				}
			} catch (error) {
				console.error('Error fetching data: ', error);
			}
		};
		fetchData();
	}, [id]);


	//assign data to item 

	const item: any = product

	const formik = useFormik({
		initialValues: {
			name: product ? product.name : '',
			category: product ? product.category : '',
			price: product ? product.price.toString() : '',
			quantity: product ? product.quantity.toString() : '',
			description: product ? product.description : '',
			imgUrl: product ? product.imgUrl : '',
		},
		validate: (values) => {
			const errors: {
				name?: string;
				category?: string;
				price?: string;
				quantity?: string;
				description?: string;
				imgUrl?: string;
			} = {};
			if (!item?.category) {
				errors.category = 'Required';
			}
			if (!product?.name) {
				errors.name = 'Required';
			}
			if (!product?.description) {
				errors.description = 'Required';
			}
			if (!product?.price) {
				errors.price = 'Required';
			}
			if (!product?.quantity) {
				errors.quantity = 'Required';
			}
			return errors;
		},
		onSubmit: async (values) => {

			try {
				const processingPopup = Swal.fire({
					title: 'Processing...',
					html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
					allowOutsideClick: false,
					showCancelButton: false,
					showConfirmButton: false,
				});
				const imgurl: any = await handleUploadimage();
				item.imgUrl = imgurl || product?.imgUrl;


				const docRef = doc(firestore, "product", id);

				updateDoc(docRef, item)
					.then(() => {
						setIsOpen(false);
						showNotification(
							<span className="d-flex align-items-center">
								<Icon icon="Info" size="lg" className="me-1" />
								<span>Successfully Update</span>
							</span>,
							'Product has been update successfully',
						);
					})
					.catch((error) => {
						console.error('Error update document: ', error);
						alert('An error occurred while adding the document. Please try again later.');
					});

				Swal.fire('Updated!', 'Product has been update.', 'success');
			} catch (error) {
				console.error('Error during handleUpload: ', error);
				alert('An error occurred during file upload. Please try again later.');
			}
		},
	});

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='lg' titleId={id}>
			<ModalHeader setIsOpen={setIsOpen} className='p-4'>
				<ModalTitle id="">{'Update product'}</ModalTitle>
			</ModalHeader>
			<ModalBody className='px-4'>
				<div className='row g-4'>

					<FormGroup id='name' label='Product name' onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => { item.name = e.target.value }}
							value={item?.name}

							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.name}
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='category' label='Category' onChange={formik.handleChange} className='col-md-6'>
						{/* <Input
							required
							onChange={(e: any) => { item.category = e.target.value }}

							value={item?.category}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.category}
							invalidFeedback={formik.errors.category}
							validFeedback='Looks good!'

						/> */}

						<Select
							ariaLabel='Default select example'
							placeholder={item?.category}
							onChange={(e: any) => { item.category = e.target.value }}

							value={item?.category}
							>
							<Option value='Vegetable'>Vegetable</Option>
							<Option value='Fruit'>Fruit</Option>
							<Option value='Bakery'>Bakery</Option>
							<Option value='wef'>Four</Option>
							<Option value='wef'>Four</Option>
						</Select>



					</FormGroup>
					<FormGroup id='price' label='Price' onChange={formik.handleChange} className='col-md-6'>
						<Input
							type='number'

							onChange={(e: any) => { item.price = e.target.value }}
							value={item?.price}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.price}
							invalidFeedback={formik.errors.price}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='quantity' label='Quantity' onChange={formik.handleChange} className='col-md-6'>
						<Input
							type='number'
							onChange={(e: any) => { item.quantity = e.target.value }}

							value={item?.quantity}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.quantity}
							invalidFeedback={formik.errors.quantity}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup id='description' label='Description' onChange={formik.handleChange} className='col-md-6'>
						<Input
							onChange={(e: any) => { item.description = e.target.value }}

							value={item?.description}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched={formik.touched.description}
							invalidFeedback={formik.errors.description}
							validFeedback='Looks good!'


						/>
					</FormGroup>
					<FormGroup label='Profile Picture' className='col-md-6'>
						<Input
							type='file'
							onChange={(e: any) => {
								setImageurl(e.target.files[0]);
								// Display the selected image
								setSelectedImage(URL.createObjectURL(e.target.files[0]));
							}}
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
