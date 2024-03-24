import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight, SubheaderSeparator } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Page from '../../../layout/Page/Page';
import Card, { CardBody, CardHeader } from '../../../components/bootstrap/Card';
import Swal from 'sweetalert2';
import Button from '../../../components/bootstrap/Button';

import { firestore } from '../../../firebaseConfig';
import { doc, getDocs, updateDoc } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import showNotification from '../../../components/extras/showNotification';
import { set } from 'date-fns';

const Index: NextPage = () => {

  interface Order {
    id: string,
    product: [],
    user: string,
    price: number,
    status: boolean,
    discount: string,
    progress: string,

  }

  const [searchTerm, setSearchTerm] = useState("");
  const [addModalStatus, setAddModalStatus] = useState<boolean>(false);
  const [count, setCount] = useState<boolean>(false);

  //get data 

  const [order, setOrder] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const dataCollection: any = collection(firestore, 'order');

        const querySnapshot = await getDocs(dataCollection);

        const firebaseData = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Order;
          return {

            ...data,

            id: doc.id,
          };
        });
        setOrder(firebaseData);

      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, [searchTerm, count]);


  //deactivate user
  const canselorder = async (status: any, values: any) => {
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


          const docRef = doc(firestore, "order", values.id);
          // Update the data

          updateDoc(docRef, values).then(() => {
            Swal.fire('Updated!', 'order has been cancel.', 'success');
            if (count) {
              setCount(false)
            }
            else {
              setCount(true)
            }
          }).catch((error) => {
            console.error('Error update document: ', error);
            alert('An error occurred while adding the document. Please try again later.');
          });
        } else {
          // console.log(status)
          // values.status = true
          // const docRef = doc(firestore, "user", values.id);
          // // Update the data

          // updateDoc(docRef, values).then(() => {


          //   Swal.fire('Updated!', 'user has been update.', 'success');
          //   if(count){
          //     setCount(false)
          //   }
          //   else{
          //     setCount(true)
          //   }
          // }).catch((error) => {
          //   console.error('Error update document: ', error);
          //   alert('An error occurred while adding the document. Please try again later.');
          // });


        }
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
      Swal.fire('Error', 'Failed to dactivate  telescope.', 'error');
    }

  }

  // update progress
  const updateprogress = async (progress: any, values: any) => {
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
        if (progress == "Pending") {


          values.progress = "delivery"


          const docRef = doc(firestore, "order", values.id);
          // Update the data

          updateDoc(docRef, values).then(() => {
            Swal.fire('Updated!', 'order has been updated.', 'success');
            if (count) {
              setCount(false)
            }
            else {
              setCount(true)
            }
          }).catch((error) => {
            console.error('Error update document: ', error);
            alert('An error occurred while adding the document. Please try again later.');
          });

        } else if (progress == "delivery") {

          values.progress = "delivered"
          const docRef = doc(firestore, "order", values.id);
          // Update the data

          updateDoc(docRef, values).then(() => {


            Swal.fire('Updated!', 'user has been update.', 'success');
            if (count) {
              setCount(false)
            }
            else {
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
                      <th>ID  </th>
                      <th>product</th>
                      <th>Price (Rs.)</th>
                      <th>User</th>
                      <th>progress  </th>
                      <th>ststus</th>
                      <th></th>


                    </tr>
                  </thead>
                  <tbody>

                    {order
                      .filter((val: Order) => {
                        if (searchTerm === "") {
                          return val
                        } else if (val.progress?.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return val
                        }

                      }).map((order, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            {Array.isArray(order.product) ? (
                              order.product.map((product, idx) => (
                                <>
                                <span key={idx}>{product}</span><br/>
                                </>
                              ))
                            ) : (
                              <span>{order.product}</span>
                            )}
                          </td>
                          <td>{order.price}.00 </td>
                          <td>{order.user}</td>
                          <td>{order.progress}</td>
                          <td>
                            {order.status ? <>
                              {order.progress == "Pending" ?
                                <Button icon='Delete' color='info' onClick={() => { updateprogress(order.progress, order) }}>
                                  delivery
                                </Button>
                                :
                                <>
                                  {order.progress == "delivery" ?

                                    <Button icon='Delete' color='info' onClick={() => { updateprogress(order.progress, order) }}>
                                      delivered
                                    </Button>
                                    :
                                    <>
                                      complete
                                    </>

                                  }
                                </>
                              }

                            </>
                              :
                              <>
                              </>
                            }

                          </td>

                          <td>
                            {order.status ?
                              <Button icon='Delete' color='warning' onClick={() => { canselorder(order.status, order) }}>
                                Cancel
                              </Button>
                              :
                              <></>

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

    </PageWrapper>
  );
};




export default Index;




