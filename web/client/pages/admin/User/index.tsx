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
import CustomerEditModal from './AddUser/CustomerEditModal';
import { firestore } from '../../../firebaseConfig';
import { doc, getDocs, updateDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import showNotification from '../../../components/extras/showNotification';
import { set } from 'date-fns';

const Index: NextPage = () => {

  interface User {
    id: string,
    Name: string,
    address1: string,
    address2: string,
    email: string,
    phone: string,
    fav: [],
    cart: [],
    status: boolean
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
  const [count, setCount] = useState<boolean>(false);

  //get data 

  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const dataCollection: any = collection(firestore, 'users');

        const querySnapshot = await getDocs(dataCollection);

        const firebaseData = querySnapshot.docs.map((doc) => {
          const data = doc.data() as User;
          return {

            ...data,

            id: doc.id,
          };
        });
        setUser(firebaseData);
        
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, [searchTerm,count]);


  //deactivate user
  const deactivateuser = async (status: any, values: any) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      })

      if (result.isConfirmed) {
        if (status) {
          console.log(status)

          values.status = false


          const docRef = doc(firestore, "user", values.id);
          // Update the data

          updateDoc(docRef, values).then(() => {
            Swal.fire('Updated!', 'user has been update.', 'success');
            if(count){
              setCount(false)
            }
            else{
              setCount(true)
            }
          }).catch((error) => {
            console.error('Error update document: ', error);
            alert('An error occurred while adding the document. Please try again later.');
          });
        } else {
          console.log(status)
          values.status = true
          const docRef = doc(firestore, "user", values.id);
          // Update the data

          updateDoc(docRef, values).then(() => {


            Swal.fire('Updated!', 'user has been update.', 'success');
            if(count){
              setCount(false)
            }
            else{
              setCount(true)
            }
          }).catch((error) => {
            console.error('Error update document: ', error);
            alert('An error occurred while adding the document. Please try again later.');
          });


        }
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
      Swal.fire('Error', 'Failed to dactivate  telescope.', 'error');
    }

  }



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
            placeholder='Search User...'
            // onChange={formik.handleChange}
            onChange={(event: any) => { setSearchTerm(event.target.value); }}
            value={searchTerm}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          {/* <Button icon='Person' color='primary' isLight onClick={() => setAddModalStatus(true)}>
            New User
          </Button> */}
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
                      <th>User ID  </th>
                      <th>Name </th>
                      <th>Address</th>
                      <th>Email </th>
                      <th>Contact No</th>
                      <th>Status  </th>
                      <th>Action</th>

                    </tr>
                  </thead>
                  <tbody>

                    {user
                      .filter((val: User) => {
                        if (searchTerm === "") {
                          return val
                        } else if (val.Name?.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return val
                        }

                      }).map((user, index) => (
                        <tr>
                          <td>{index+1}</td>
                          <td>{user.Name} </td>
                          <td>{user.address1} </td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>

                          <td>{user.status ? "active" : "Deactivate"}</td>
                          <td>
                            {user.status ?
                              <Button icon='Delete' color='info' onClick={() => { deactivateuser(user.status, user) }}>
                                Deactivate
                              </Button>
                              :
                              <Button icon='Delete' color='info' onClick={() => { deactivateuser(user.status, user) }}>
                                Active
                              </Button>
                            }

                          </td>


                        </tr>
                      ))}

                  </tbody>

                </table>


              </CardBody>

            </Card>


          </div>
        </div>
      </Page>
      <CustomerEditModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id="" />
    </PageWrapper>
  );
};




export default Index;




