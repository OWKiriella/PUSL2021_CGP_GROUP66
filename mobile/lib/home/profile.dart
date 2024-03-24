import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:grocery_store/home/favourite_screen.dart';
import 'package:grocery_store/home/home.dart';
import 'package:grocery_store/home/mycart.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_storage/firebase_storage.dart' as firebase_storage;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:grocery_store/login/login.dart';

class profile extends StatefulWidget {
  const profile({Key? key}) : super(key: key);

  @override
  _ProfileState createState() => _ProfileState();
}

class _ProfileState extends State<profile> {
  late String _profileImageUrl = ''; // Initialize with an empty string
  late String _userEmail = ''; // Initialize with an empty string
  late TextEditingController _nameController = TextEditingController();
  late TextEditingController _addressController = TextEditingController();
  late TextEditingController _emailController = TextEditingController();
  late TextEditingController _contactController = TextEditingController();
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _loadProfileImage();
    _loadUserData();
  }

  Future<void> _loadProfileImage() async {
    try {
      final currentUser = FirebaseAuth.instance.currentUser;
      if (currentUser != null) {
        final ref = firebase_storage.FirebaseStorage.instance
            .ref('profile/${currentUser.uid}/profile.jpg');
        final url = await ref.getDownloadURL();
        setState(() {
          _profileImageUrl = url;
        });
      }
    } catch (error) {
      print('Error loading profile image: $error');
    }
  }

  Future<void> _uploadProfileImage() async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(source: ImageSource.gallery);

      if (pickedFile != null) {
        final file = File(pickedFile.path);
        final currentUser = FirebaseAuth.instance.currentUser;
        if (currentUser != null) {
          final ref = firebase_storage.FirebaseStorage.instance
              .ref('profile/${currentUser.uid}/profile.jpg');
          await ref.putFile(file);
          _loadProfileImage();
        }
      }
    } catch (error) {
      print('Error uploading profile image: $error');
    }
  }

  Future<void> _loadUserData() async {
    try {
      final currentUser = FirebaseAuth.instance.currentUser;
      if (currentUser != null) {
        final userData = await FirebaseFirestore.instance
            .collection('users')
            .doc(currentUser.uid)
            .get();
        setState(() {
          _userEmail = userData['email'];
          _nameController.text = userData['name'] ?? '';
          _addressController.text = userData['address'] ?? '';
          _emailController.text = userData['email'] ?? '';
          _contactController.text = userData['contact'] ?? '';
        });
      }
    } catch (error) {
      print('Error loading user data: $error');
    }
  }

  Future<void> _saveUserData() async {
    try {
      final currentUser = FirebaseAuth.instance.currentUser;
      if (currentUser != null) {
        await FirebaseFirestore.instance
            .collection('users')
            .doc(currentUser.uid)
            .set({
          'name': _nameController.text,
          'address': _addressController.text,
          'email': _emailController.text,
          'contact': _contactController.text,
        });
        
      }
    } catch (error) {
      print('Error saving user data: $error');
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
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text('Profile'),
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
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => home()),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.favorite),
              title: Text('Favorites'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => favourite()),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.person),
              title: Text('Cart'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => MyCartPage()),
                );
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
        padding: EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Align(
              alignment: Alignment.topCenter,
              child: GestureDetector(
                onTap: _uploadProfileImage,
                child: CircleAvatar(
                  radius: 70,
                  backgroundColor: Colors.grey[200],
                  backgroundImage: _profileImageUrl.isNotEmpty
                      ? NetworkImage(_profileImageUrl)
                      : null,
                  child: _profileImageUrl.isEmpty
                      ? Icon(
                          Icons.camera_alt,
                          size: 40,
                          color: Colors.grey[800],
                        )
                      : null,
                ),
              ),
            ),
            SizedBox(height: 20),
            _buildTextField(_nameController, 'Enter Name'),
            SizedBox(height: 10),
            _buildTextField(_addressController, 'Enter Address'),
            SizedBox(height: 10),
            _buildTextField(_emailController, 'Enter Email'),
            SizedBox(height: 10),
            _buildTextField(_contactController, 'Enter Contact Number'),
            SizedBox(height: 20),
            ElevatedButton(
  onPressed: _saveUserData,
  style: ElevatedButton.styleFrom(
    backgroundColor: Colors.green,
    padding: EdgeInsets.symmetric(vertical: 15),
  ),
  child: Text(
    'Save',
    style: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    ),
  ),
),

          ],
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String labelText) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: labelText,
        border: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.green),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.green, width: 2.0),
        ),
      ),
    );
  }
}
