import 'package:flutter/material.dart';
import 'package:grocery_store/home/favourite_screen.dart';
import 'package:grocery_store/home/mycart.dart';
import 'package:grocery_store/home/profile.dart';
import 'package:grocery_store/home/home.dart';

class Navigation extends StatefulWidget {
  @override
  _NavigationState createState() => _NavigationState();
}

class _NavigationState extends State<Navigation> {
  int _selectedIndex = 0; // Index of the selected tab

  // Define the pages to navigate to
  final List<Widget> _pages = [
    home(),
    MyCartPage(),
    favourite(),
    profile(),
  ];
  // Handle navigation item selection
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex], // Display the selected page
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.green, // Set background color
        selectedItemColor: Colors.white, // Set selected item color
        unselectedItemColor: Colors.white54, // Set unselected item color
        currentIndex: _selectedIndex, // Set current selected index
        onTap: _onItemTapped, // Handle item tap
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'Cart',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Favorites',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
