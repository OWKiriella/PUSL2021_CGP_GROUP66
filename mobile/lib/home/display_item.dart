import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:grocery_store/home/mycart.dart';

class ItemDetailsPage extends StatefulWidget {
  final Map<String, dynamic> itemDetails;

  const ItemDetailsPage({Key? key, required this.itemDetails})
      : super(key: key);

  @override
  _ItemDetailsPageState createState() => _ItemDetailsPageState();
}

class _ItemDetailsPageState extends State<ItemDetailsPage> {
  int quantity = 0;
 bool isQuantityEntered = false; // Track if quantity is entered
  String? get currentUserUid {
    final user = FirebaseAuth.instance.currentUser;
    return user
        ?.uid; // Return the user ID if the user is logged in, otherwise return null
  }
  


  @override
  Widget build(BuildContext context) {
    double unitPrice = double.parse(widget.itemDetails['unitPrice']);

    return Scaffold(
      appBar: AppBar(
        title: Text('Item Details'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Align(
              alignment: Alignment.topCenter,
              child: Text(
                widget.itemDetails['name'],
                style: TextStyle(
                  fontSize: 24.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            SizedBox(height: 16.0),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12.0),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.5),
                    spreadRadius: 3,
                    blurRadius: 6,
                    offset: Offset(0, 3),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12.0),
                child: Image.network(
                  widget.itemDetails['assetPath'],
                  width: MediaQuery.of(context).size.width,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            SizedBox(height: 16.0),
            Text(
              'Quantity: ${widget.itemDetails['quantity']}',
              style: TextStyle(
                fontSize: 18.0,
                color: Colors.blue,
              ),
            ),
            SizedBox(height: 8.0),
            Text(
              'Price: \$${widget.itemDetails['price']}',
              style: TextStyle(
                fontSize: 18.0,
                color: Colors.green,
              ),
            ),
            SizedBox(height: 16.0),
            Text(
              'Description:',
              style: TextStyle(
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8.0),
            Container(
              padding: EdgeInsets.all(12.0),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Text(
                widget.itemDetails['description'],
                style: TextStyle(fontSize: 18.0),
              ),
            ),
            SizedBox(height: 16.0),
            Text(
              'Enter quantity you want:',
              style: TextStyle(
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8.0),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      labelText: 'Quantity',
                      border: OutlineInputBorder(),
                      errorText: isQuantityEntered
                          ? null
                          : 'Please enter quantity', // Display error message if quantity is not entered
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (value) {
                      setState(() {
                        quantity = int.tryParse(value) ?? 0;
                        isQuantityEntered = value.isNotEmpty; // Update isQuantityEntered
                      });
                    },
                  ),
                ),
                SizedBox(width: 16.0),
                Text(
                  'Type: ${widget.itemDetails['type']}',
                  style: TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16.0),
            Text(
              'Total Cost: \$${(quantity * unitPrice).toStringAsFixed(2)}',
              style: TextStyle(
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
                color: Colors.red,
              ),
            ),
            SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: isQuantityEntered // Disable button if quantity is not entered
                  ? () async {
                      try {
                        // Save item details to Firestore
                        await FirebaseFirestore.instance
                            .collection('cart')

                       .doc(currentUserUid)
                            .collection('cart_item')
                            .add({
                          'name': widget.itemDetails['name'],
                          'assetPath': widget.itemDetails['assetPath'],
                          'cost': (quantity * unitPrice).toStringAsFixed(2),
                          'quantity': widget.itemDetails['quantity'],
                        });

                        // Navigate to MyCartPage
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MyCartPage(),
                          ),
                        );
                      } catch (error) {
                        // Handle error, e.g., show a snackbar
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content:
                                Text('Failed to add item to cart: $error'),
                          ),
                        );
                      }
                    }
                  : null, // Set onPressed to null when quantity is not entered
              child: Text(
                'Add to Cart',
                style: TextStyle(fontSize: 18.0, color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
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
