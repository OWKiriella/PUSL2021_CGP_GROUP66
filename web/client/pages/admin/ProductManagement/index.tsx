import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Swal from 'sweetalert2';
import Button from '../../../components/bootstrap/Button';
import CustomerEditModal from './AddProduct/CustomerEditModal';
import CustomerUpdateModal from './updateProduct/CustomerEditModal';
import { firestore } from '../../../firebaseConfig';
import { deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import showNotification from '../../../components/extras/showNotification';
import { set } from 'date-fns';
import { promises } from 'dns';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';

const Index: NextPage = () => {

  interface Product {
    id: string,
    name: string,
    category: string,
    description: string,
    price: number,
    quantity: number,
    imgUrl: string


  }

  const [searchTerm, setSearchTerm] = useState("");
  const [id, setId] = useState("");
  const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
  const [updateModalStatus, setUpdateModalStatus] = useState<boolean>(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1); // Initialize state for selected row index
  const [count, setCount] = useState<boolean>(false);


  const handleRowClick = (index: any) => {
    setSelectedRowIndex(index === selectedRowIndex ? -1 : index); // Toggle selected row index
  };

  //get data 

  const [product, setProduct] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const dataCollection: any = collection(firestore, 'product');

        const querySnapshot = await getDocs(dataCollection);

        const firebaseData = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Product;
          return {

            ...data,

            id: doc.id,
          };
        });
        setProduct(firebaseData);
       
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, [searchTerm, addModalStatus,updateModalStatus,count]);



  //delete product
  const handleClickDelete = async (id: any) => {
		try {
			const result = await Swal.fire({
				title: 'Are you sure?',
				text: 'You will not be able to recover this product!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!',
			});

			if (result.isConfirmed) {
				const docRef = doc(firestore, 'product',id);
				await deleteDoc(docRef);

				// Show success message
				Swal.fire('Deleted!', 'Product has been deleted.', 'success');
				if(count){
          setCount(false)
        }
        else{
          setCount(true)
        }
				
			}
		} catch (error) {
			console.error('Error deleting document: ', error);
			// Handle error (e.g., show an error message)
			Swal.fire('Error', 'Failed to delete product.', 'error');
		}
	};

  return (
    <PageWrapper>

      <SubHeader>
        <SubHeaderLeft>
          {/* Search input */}
          <label className='border-0 bg-transparent cursor-pointer me-0' htmlFor='searchInput'>
            <Icon icon='Search' size='2x' color='primary' />
          </label>
          <Input
            id='searchInput'
            type='search'
            className='border-0 shadow-none bg-transparent'
            placeholder='Search Product...'
            // onChange={formik.handleChange}
            onChange={(event: any) => { setSearchTerm(event.target.value); }}
            value={searchTerm}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
        {/* <Dropdown>
            <DropdownToggle hasIcon={false}>
              <Button
                icon='FilterAlt'
                color='dark'
                isLight
                className='btn-only-icon position-relative'>

              </Button>
            </DropdownToggle>
            <DropdownMenu isAlignmentEnd size='lg'>
              <div className='container py-2'>
                <div className='row g-3'>

                  <FormGroup label='category' className='col-12'>
                    <ChecksGroup>
                      <Checks
                        key="fruit"
                        id="fruit"
                        label="fruit"
                        name='fruit'
                        value="fruit"

                        onClick={handlefruitfilter}
                        checked={fruit}
                      />

                      <Checks
                       key="fruit"
                       id="fruit"
                       label="fruit"
                       name='fruit'
                       value="fruit"

                       onClick={handlefruitfilter1}
                       checked={veh}

                      />

                    </ChecksGroup>
                  </FormGroup>
                </div>
              </div>
            </DropdownMenu>
          </Dropdown> */}
          <SubheaderSeparator />
          <Button icon='Person' color='primary' isLight onClick={() => setAddModalStatus(true)}>
            Add new Product
          </Button>
          <></>
        </SubHeaderRight>

      </SubHeader>
      <Page>
        <div className='row h-100'>
          <div className='col-12'>
            {/* Table for displaying customer data */}
            <Card stretch id="1">
              <CardBody isScrollable className='table-responsive'>
                <table className='table table-modern table-hover'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {product
                      .filter((val) => {
                        if (searchTerm === "") {
                          return val;
                        } else if (val.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return val;
                        }
                      })
                      .map((product, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td onClick={() => handleRowClick(index)}>{index + 1}</td>
                            <td onClick={() => handleRowClick(index)}>{product.name}</td>
                            <td onClick={() => handleRowClick(index)}>{product.category}</td>
                            <td onClick={() => handleRowClick(index)}>{product.price}</td>
                            <td onClick={() => handleRowClick(index)}>{product.quantity}</td>
                            <td>
                              <Button color='info' icon='Edit'  onClick={() => (setUpdateModalStatus(true),setId(product.id))}>
                                Update
                              </Button>
                              
                            </td>
                            <td>
                            <Button color='warning' icon='Delete'  onClick={() => (handleClickDelete(product.id))}>
                               Delete
                              </Button>
                            </td>
                          </tr>
                          <tr hidden={selectedRowIndex !== index}>
                            <td>
                              <img
                                src={product.imgUrl}
                                alt="No image available"
                                style={{ width: '150px', height: '150px' }}
                              />
                            </td>
                            <td colSpan={5}>{product.description}</td>

                          </tr>
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>



              </CardBody>

            </Card>


          </div>
        </div>
      </Page>
      <CustomerEditModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id="" />
      <CustomerUpdateModal setIsOpen={setUpdateModalStatus} isOpen={updateModalStatus} id={id} />
    </PageWrapper>
  );
};




export default Index;




