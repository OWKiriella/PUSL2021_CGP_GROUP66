import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:grocery_store/home/checkoutPage.dart';
import 'package:grocery_store/home/home.dart';

class OrderConfirmationPage extends StatefulWidget {
  final double totalCost;
  final List<String> itemNames;
  final String? userEmail;

  OrderConfirmationPage({
    required this.totalCost,
    required this.itemNames,
    required this.userEmail,
  });
  @override
  _OrderConfirmationPageState createState() => _OrderConfirmationPageState();
}

class _OrderConfirmationPageState extends State<OrderConfirmationPage> {
  String? _selectedPaymentMethod = '';

  void _saveOrder(String orderId) {
    try {
      final currentUserUid = FirebaseAuth.instance.currentUser?.uid;
      FirebaseFirestore.instance.collection('order').doc().set({
        'id': orderId,
        'product': widget.itemNames,
        'user': widget.userEmail,
        'price': widget.totalCost + 200,
        'progress': "Pending",
        'status': "true",

        // Add other order details here
      }).then((_) {
        // Delete cart data after order is successfully saved
        FirebaseFirestore.instance
            .collection('cart')
            .doc(currentUserUid)
            .collection('cart_item')
            .get()
            .then((querySnapshot) {
          querySnapshot.docs.forEach((doc) {
            doc.reference.delete();
          });
        });
      });
    } catch (error) {
      print('Error saving order: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    double deliveryCharge = 200;
    double totalAmount = widget.totalCost + deliveryCharge;

    return Scaffold(
      appBar: AppBar(
        title: Text('Order Confirmation'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your Details',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            ListTile(
              leading: Icon(Icons.location_on),
              title: TextFormField(
                decoration: InputDecoration(
                  labelText: 'Select Your Location',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.phone),
              title: TextFormField(
                decoration: InputDecoration(
                  labelText: 'Your Contact Number',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.email),
              title: TextFormField(
                decoration: InputDecoration(
                  labelText: 'Your Email',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            SizedBox(height: 20),
            Text(
              'About Your Order',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            ListTile(
              title: Text('Select Payment Method:'),
            ),
            RadioListTile<String>(
              title: Text('Visa'),
              value: 'Visa',
              groupValue: _selectedPaymentMethod,
              onChanged: (value) {
                setState(() {
                  _selectedPaymentMethod = value;
                });
              },
            ),
            RadioListTile<String>(
              title: Text('Master'),
              value: 'Master',
              groupValue: _selectedPaymentMethod,
              onChanged: (value) {
                setState(() {
                  _selectedPaymentMethod = value;
                });
              },
            ),
            SizedBox(height: 10),
            Text(
              'Cost: \$${widget.totalCost}',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              'Delivery Charge: \$200',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              'Total Amount: \$${widget.totalCost + deliveryCharge}',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Check if all input fields are filled and payment method is selected
                if (_selectedPaymentMethod != null &&
                    _selectedPaymentMethod!.isNotEmpty &&
                    widget.totalCost > 0) {
                  // Generate order ID
                  String orderId =
                      'ORD-${DateTime.now().millisecondsSinceEpoch}';

                  // Save order details to Firestore
                  _saveOrder(orderId);

                  // Show confirmation dialog
                  // Show confirmation dialog
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        backgroundColor: Color.fromARGB(255, 199, 249,
                            219), // Set background color to light green
                        title: Text(
                          'Order Confirmed',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.black, // Set text color to black
                            fontSize: 22, // Set text size to 16
                          ),
                        ),
                        content: Text(
                          'Your order has been confirmed. Your order ID is $orderId.',
                          style: TextStyle(
                            color: Colors.black, // Set text color to black
                            fontSize: 16, // Set text size to 16
                          ),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => CheckoutPage(
                                        valueToPass: widget.totalCost + 200)),
                              );
                            },
                            child: Text('OK'),
                          ),
                        ],
                      );
                    },
                  );
                } else {
                  // Show error message if any input field is missing
                  // showDialog(
                  //   context: context,
                  //   builder: (BuildContext context) {
                  //     return AlertDialog(
                  //       title: Text('Error'),
                  //       content: Text('Please fill in all the required information.'),
                  //       actions: [
                  //         TextButton(
                  //           onPressed: () {
                  //             Navigator.of(context).pop();
                  //           },
                  //           child: Text('OK'),
                  //         ),
                  //       ],
                  //     );
                  //   },
                  // );
                  // Show confirmation dialog
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        backgroundColor: Colors
                            .lightGreen, // Set background color to light green
                        title: Text(
                          'Error',
                          style: TextStyle(
                            color: Colors.black, // Set text color to black
                            fontSize: 22,
                            fontWeight: FontWeight.bold, // Set text size to 16
                          ),
                        ),
                        content: Text(
                          'Please fill in all the required information.',
                          style: TextStyle(
                            color: Colors.black, // Set text color to black
                            fontSize: 16, // Set text size to 16
                          ),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                            child: Text('OK'),
                          ),
                        ],
                      );
                    },
                  );
                }
              },
              child: Text(
                'Confirm Order',
                style: TextStyle(fontSize: 24, color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green, // Set background color to green
                padding: EdgeInsets.symmetric(horizontal: 40.0, vertical: 16.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
