import 'package:flutter/material.dart';
import 'package:flutter_paypal_checkout/flutter_paypal_checkout.dart';

class CheckoutPage extends StatefulWidget {
 final double valueToPass; // Define the parameter

  const CheckoutPage({Key? key, required this.valueToPass}) : super(key: key);

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addPostFrameCallback((_) {
      navigateToPaypalCheckout();
    });
  }

  void navigateToPaypalCheckout() {
    Navigator.of(context).push(MaterialPageRoute(
      builder: (BuildContext context) => PaypalCheckout(
        sandboxMode: true,
        clientId:
            "AW1TdvpSGbIM5iP4HJNI5TyTmwpY9Gv9dYw8_8yW5lYIbCqf326vrkrp0ce9TAqjEGMHiV3OqJM_aRT0",
        secretKey:
            "EHHtTDjnmTZATYBPiGzZC_AZUfMpMAzj2VZUeqlFUrRJA_C0pQNCxDccB5qoRQSEdcOnnKQhycuOWdP9",
        returnURL: "https://success.snippetcoder.com",
        cancelURL: "https://cancel.snippetcoder.com",
        transactions: [
          {
            "amount": {
              "total": widget.valueToPass,
              "currency": "USD",
              "details": {
                "subtotal": widget.valueToPass,
                "shipping": '0',
                "shipping_discount": 0
              }
            },
            "description": "The payment transaction description.",
            "item_list": {
              // "items": [
              //   {
              //     "name": "Apple",
              //     "quantity": 4,
              //     "price": '5',
              //     "currency": "USD"
              //   },
              //   {
              //     "name": "Pineapple",
              //     "quantity": 5,
              //     "price": '10',
              //     "currency": "USD"
              //   }
              // ],
            }
          }
        ],
        note: "Contact us for any questions on your order.",
        onSuccess: (Map<String, dynamic> params) async {
          print("onSuccess: $params");
        },
        onError: (dynamic error) {
          print("onError: $error");
          Navigator.pop(context);
        },
        onCancel: () {
          print('cancelled:');
        },
      ),
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "PayPal Checkout",
          style: TextStyle(fontSize: 20),
        ),
      ),
      body: Center(
        child: CircularProgressIndicator(), // Placeholder widget while navigating
      ),
    );
  }
}
