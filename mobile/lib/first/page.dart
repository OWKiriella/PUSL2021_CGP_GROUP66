import 'package:flutter/material.dart';
import 'package:grocery_store/home/home.dart';
import 'package:grocery_store/login/login.dart';

class Startpage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage("assets/01.jpg"),
            fit: BoxFit.cover,
          ),
        ),
        child: SafeArea(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(height: MediaQuery.of(context).size.height * 0.1), // Adjust as needed

              GestureDetector(
                onTap: () {},
                child: const Text(
                  "WELCOME",
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 30,
                      fontWeight: FontWeight.w900),
                  textAlign: TextAlign.center,
                ),
              ),
              SizedBox(height: 30),

              GestureDetector(
                onTap: () {},
                child: const Text(
                  "Order Grocery from anywhere and get get delivery at your door",
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w900),
                  textAlign: TextAlign.center,
                ),
              ),
              SizedBox(height: 30),
              
              // button
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 40,
                  vertical: 5,
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: MaterialButton(
  shape: RoundedRectangleBorder(
    side: const BorderSide(
      color: Color.fromARGB(213, 35, 198, 60),
    ),
    borderRadius: BorderRadius.circular(8),
  ),
  color: Color.fromARGB(213, 35, 198, 60), // Set button background color
  onPressed: () {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => LoginScreen()),
    );
  },
  child: Padding(
    padding: EdgeInsets.all(15.0),
    child: Text(
      "Get start",
      style: TextStyle(
        color: Colors.white, // Set text color to white
        fontSize: 20,
      ),
    ),
  ),
),

                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
     ),
);
}
}
