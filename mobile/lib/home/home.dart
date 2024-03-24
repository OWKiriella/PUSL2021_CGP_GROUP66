import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:grocery_store/home/display_item.dart';
import 'package:grocery_store/home/favourite_screen.dart';
import 'package:grocery_store/home/mycart.dart';
import 'package:grocery_store/home/profile.dart';
import 'package:grocery_store/login/login.dart';

class  home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<home> {
  int _selectedIndex = 0; 
  bool showAllProducts = false;// Index of the selected tab
 // Filter products based on category
  List<Map<String, dynamic>> originalProducts = []; // Original list of products
 List<Map<String, dynamic>> featuredProducts = [];
 // Filter products based on category
  List<Map<String, dynamic>> filterProducts(String category) {
    return originalProducts.where((product) => product['category'] == category).toList();
  }
  // Define the pages to navigate to
  final List<Widget> _pages = [
    home(),
    MyCartPage(),
    favourite(),
    profile(),
  ];
  // Handle navigation item selection
 void _onItemTapped(int index) {
  Navigator.pop(context); // Close the drawer
  Navigator.pushReplacement( // Navigate to the selected page
    context,
    MaterialPageRoute(builder: (context) => _pages[index]),
  );
}


  final List<Map<String, dynamic>> imageData = [
    {
      'assetPath': "assets/h1.png",
      'text': 'Make your life easy',
    },
    {
      'assetPath': "assets/h2.png",
      'text': 'Easy payment',
    },
    {
      'assetPath': "assets/h3.png",
      'text': 'Fast delivery',
    },
    {
      'assetPath': "assets/h4.png",
      'text': 'Fresh Foods',
    },
  ];

  final List<Map<String, dynamic>> categoryData = [
    {
      'assetPath': "assets/c1.png",
      'text': 'Vegetable',
    },
    {
      'assetPath': "assets/c2.png",
      'text': 'Fruit',
    },
    {
      'assetPath': "assets/c3.png",
      'text': 'Grocery',
    },
    {
      'assetPath': "assets/c4.png",
      'text': 'Items',
    },
    {
      'assetPath': "assets/c5.png",
      'text': 'Bakery',
    },
  ];
  



  @override
  void initState() {
    super.initState();
    _getProductsFromFirestore();
  }

  Future<void> _getProductsFromFirestore() async {
    try {
      final QuerySnapshot querySnapshot =
          await FirebaseFirestore.instance.collection('product').get();

      setState(() {
        originalProducts = querySnapshot.docs.map((doc) {
          return {
            'name': doc['name'],
            'price': doc['price'].toString(),
            'quantity': doc['quantity'].toString(),
            'assetPath': doc['imgUrl'],
            'description': doc['description'],
            'unitPrice': doc['unitPrice'].toString(),
            'type': doc['type'].toString(),
            'category': doc['category'],
          };
        }).toList();
         // Initialize featuredProducts with originalProducts
        featuredProducts = List.from(originalProducts);
      });
    } catch (error) {
      print('Error fetching data: $error');
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }
 Future<void> _addToFavorites(Map<String, dynamic> product) async {
    try {
      // Get the current user ID
      final currentUser = FirebaseAuth.instance.currentUser;
      if (currentUser != null) {
        // Add the product to the user's favorites collection
        await FirebaseFirestore.instance
            .collection('favorites')
            .doc(currentUser.uid)
            .collection('items')
            .add(product);
        // Show a snackbar indicating success
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Added to favorites'),
          ),
        );
      } else {
        // Show a snackbar indicating that the user is not signed in
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Please sign in to add to favorites'),
          ),
        );
      }
    } catch (error) {
      print('Error adding to favorites: $error');
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }
   Future<void> _logout() async {
    try {
      await FirebaseAuth.instance.signOut();
      // Navigate to login or home screen after logout
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    } catch (error) {
      print('Error logging out: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.green,
              ),
              child: Text(
                'Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.home),
              title: Text('Home'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(0); // Navigate to Home page
              },
            ),
            ListTile(
              leading: Icon(Icons.shopping_cart),
              title: Text('Cart'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(1); // Navigate to Cart page
              },
            ),
            ListTile(
              leading: Icon(Icons.favorite),
              title: Text('Favorites'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(2); // Navigate to Favorites page
              },
            ),
            ListTile(
               leading: Icon(Icons.person),
              title: Text('Profile'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(3); // Navigate to Profile page
              },
            ),
             ListTile(
              leading: Icon(Icons.logout),
              title: Text('Logout'),
              onTap: _logout,
            ),
          ],
        ),
      ),

      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            CarouselSlider(
              options: CarouselOptions(
                aspectRatio: 16 / 9,
                autoPlay: true,
                enlargeCenterPage: true,
              ),
              items: imageData.map((data) {
                return Builder(
                  builder: (BuildContext context) {
                    return Container(
                      width: MediaQuery.of(context).size.width,
                      margin: EdgeInsets.symmetric(horizontal: 5.0),
                      decoration: BoxDecoration(
                        color: Color.fromARGB(213, 35, 198, 60),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Image.asset(
                            data['assetPath'],
                            fit: BoxFit.cover,
                          ),
                          SizedBox(height: 10),
                          Text(
                            data['text'],
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                );
              }).toList(),
            ),
            SizedBox(height: 20),
            const Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                'Categories',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            SizedBox(height: 20),
            Padding(
  padding: EdgeInsets.symmetric(horizontal:20),
  child: Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: categoryData.map((category) {
      return Expanded(
        flex: 1,
        child: GestureDetector(
          onTap: () {
            List<Map<String, dynamic>> filteredProducts = filterProducts(category['text']);
            setState(() {
              featuredProducts = filteredProducts;
            });
          },
          child: Column(
            children: [
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Image.asset(
                    category['assetPath'],
                    width: MediaQuery.of(context).size.width * 0.1,
                    height: MediaQuery.of(context).size.width * 0.1,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(height: 5),
              Text(
                category['text'],
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      );
    }).toList(),
  ),
),
ElevatedButton(
              onPressed: () {
                setState(() {
                  showAllProducts = !showAllProducts;
                  if (showAllProducts) {
                    featuredProducts = List.from(originalProducts);
                  } else {
                    // Reset featured products to empty list to clear any previous filters
                    featuredProducts.clear();
                  }
                });
              },
              child: Text(showAllProducts ? 'Filtered Products' : 'All Products',style: TextStyle(fontSize: 18.0, color: Colors.white),),
               style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: EdgeInsets.only(left: 20.0, right: 20.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
),
            const SizedBox(height: 20),
            const Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                'Featured Products',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            SizedBox(height: 20),
            ListView.builder(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemCount: featuredProducts.length,
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: () {
                    // Navigate to item details page
                    // Navigator.push(
                    //   context,
                    //   MaterialPageRoute(
                    //     builder: (context) => ItemDetailsPage(
                    //         itemDetails: featuredProducts[index]),
                    //   ),
                    // );
                  },
                  child: Container(
                    margin:
                        EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.green.withOpacity(0.3),
                          spreadRadius: 3,
                          blurRadius: 6,
                          // offset: Offset(0, 3),
                        ),
                      ],
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: ListTile(
                      leading: Image.network(
                        featuredProducts[index]['assetPath'],
                        width: 100,
                        height: 150,
                        // fit: BoxFit.cover,
                      ),
                      title: Container(
                                  height: 25, // Adjust this value according to your preference
                                 child: Text(
                                  featuredProducts[index]['name'],
                                 textAlign: TextAlign.end,
                                     style: TextStyle(fontWeight: FontWeight.bold),
                                     ),
                                    ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('Price: \$${featuredProducts[index]['price']}'),
                          Text(
                              'Quantity: ${featuredProducts[index]['quantity']}'),
                          Row(
                            // Row to align both icons horizontally
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              CircleAvatar(
                                backgroundColor: Colors.green,
                                child: IconButton(
                                  icon: Icon(Icons.favorite,
                                      color: Colors.white), // Green heart icon
                                  onPressed: () {
                                    _addToFavorites(featuredProducts[index]);
                                  },
                                ),
                              ),
                              SizedBox(width: 8),
                              CircleAvatar(
                                backgroundColor: Colors.green,
                                child: IconButton(
                                  icon: Icon(Icons.add,
                                      color: Colors.white), // Green add icon
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => ItemDetailsPage(
                                          itemDetails: featuredProducts[index],
                                        ),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
      
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: home(),
  ));
}
