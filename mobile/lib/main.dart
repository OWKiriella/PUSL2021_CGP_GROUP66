import 'package:flutter/material.dart';
import 'package:grocery_store/first/page.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:grocery_store/home/favourite_screen.dart';
import 'package:grocery_store/home/home.dart';
import 'package:grocery_store/home/profile.dart';
// import 'package:device_preview/device_preview.dart';

void main() async{
   WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp(
      options: const FirebaseOptions(
        apiKey: "AIzaSyCj9q71gf6GA7w8wlkgfTQiNZ3jVWOXQKs",
        appId: "1:606652202773:android:ddd533446b0c9f8963f31c",
        messagingSenderId: "606652202773",
        projectId: "grocerystoreapplication-d99bd",
        storageBucket: "grocerystoreapplication-d99bd.appspot.com"),
        
  );
  //  runApp(
  //   DevicePreview(
  //     enabled: true, // Enable DevicePreview
  //     builder: (context) => MainApp(),
  //   ),
  // );
  
  runApp(MainApp());

  } catch (e) {
    print('Firebase initialization error: $e');
  }
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
       
     debugShowCheckedModeBanner: false,
        title: 'Flutter ',
        theme: ThemeData(
          useMaterial3: true,
        ),
        home: Startpage(),
);
       
  }
}
