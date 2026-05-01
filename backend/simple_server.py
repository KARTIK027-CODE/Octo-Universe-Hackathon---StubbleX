import http.server
import socketserver
import json
import random
import os

PORT = int(os.environ.get("PORT", 8081))
OTP_STORE = {}
# Simple User Store: {phone_number: user_data}
USER_STORE = {
    "8668988623": {
        "name": "Kartik Singh",
        "phone_number": "8668988623",
        "location": "Ludhiana, Punjab",
        "pincode": "141001",
        "stats": {"score": 5500, "co2": 18.5, "waste": 25},
        "listings": [],
        "orders": [
            {"id": "ORD-7721", "date": "Oct 12, 2023", "item": "Rice Straw", "qty": "5.5T", "amount": "₹12,650", "status": "Paid"},
            {"id": "ORD-7604", "date": "Sep 28, 2023", "item": "Wheat Stubble", "qty": "12T", "amount": "₹32,400", "status": "Picked Up"}
        ],
        "kyc_verified": True
    }
}

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.end_headers()

    def do_POST(self):
        content_length_str = self.headers.get('Content-Length')
        if content_length_str:
            content_length = int(content_length_str)
            post_data = self.rfile.read(content_length)
        else:
            post_data = b''
        
        data = {}
        try:
            if content_length_str and int(content_length_str) > 0:
                data = json.loads(post_data.decode('utf-8'))
        except Exception as e:
            print(f"Error parsing body: {e}")
            pass
        
        response = {}
        
        if self.path == '/api/send-otp':
            phone = data.get('phone_number')
            # Mock OTP logic
            otp = str(random.randint(1000, 9999))
            if phone:
                OTP_STORE[str(phone)] = otp
                print(f"Generated OTP for {phone}: {otp}")
                response = {"status": "success", "message": "OTP sent successfully", "otp": otp}
            else:
                 self.send_response(400)
                 self.end_headers()
                 return
            
        elif self.path == '/api/verify-otp':
            phone = str(data.get('phone_number'))
            user_otp = str(data.get('otp'))
            
            # Simple verification for demo
            valid_otp = OTP_STORE.get(phone)
            print(f"Verifying {phone}: User sent {user_otp}, Stored {valid_otp}")

            if (valid_otp and valid_otp == user_otp) or user_otp == "1234":
                # Check for registration data
                new_name = data.get('name') or data.get('firstName')
                if new_name:
                    print(f"Registration/Sync Name detected: {new_name}")
                if not new_name and data.get('lastName'):
                    new_name = f"{data.get('firstName', '')} {data.get('lastName')}".strip()
                
                # Create or Update user
                if phone not in USER_STORE:
                    USER_STORE[phone] = {
                        "name": new_name or f"Farmer {phone[-4:]}",
                        "phone_number": phone,
                        "location": data.get('location', "Punjab, India"),
                        "pincode": data.get('pincode', ""),
                        "stats": {"score": 100, "co2": 0, "waste": 0},
                        "listings": [],
                        "orders": [],
                        "kyc_verified": False,
                        "kyc_status": "Not Verified",
                        "kyc_data": {}
                    }
                elif new_name:
                    # Update name if user exists but we have a better name now
                    USER_STORE[phone]["name"] = new_name
                
                response = {"status": "success", "message": "OTP verified", "token": f"token-{phone}", "phone": phone}
            else:
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Invalid OTP"}).encode('utf-8'))
                return

        elif self.path == '/api/get-profile':
            phone = data.get('phone_number')
            profile = USER_STORE.get(str(phone))
            if profile:
                response = {"status": "success", "profile": profile}
            else:
                self.send_response(404)
                self.end_headers()
                return

        elif self.path == '/api/update-profile':
            phone = str(data.get('phone_number'))
            updates = data.get('updates', {})
            if phone in USER_STORE:
                USER_STORE[phone].update(updates)
                # Auto-verify KYC if it's a kyc update for demo purposes
                if 'kyc_data' in updates:
                    USER_STORE[phone]['kyc_verified'] = True
                    USER_STORE[phone]['kyc_status'] = 'Verified'
                response = {"status": "success", "profile": USER_STORE[phone]}
            else:
                self.send_response(404)
                self.end_headers()
                return

        elif self.path == '/api/add-listing':
            phone = str(data.get('phone_number'))
            listing = data.get('listing')
            if phone in USER_STORE:
                USER_STORE[phone]['listings'].append(listing)
                response = {"status": "success", "profile": USER_STORE[phone]}
            else:
                self.send_response(404)
                self.end_headers()
                return

        elif self.path == '/api/predict-price':
            qty = data.get('quantity', 0)
            waste_type = data.get('waste_type', 'unknown')
            base_price = 2000 if 'rice' in str(waste_type).lower() else 3000
            total = base_price * float(qty) if qty else 0
            response = {"estimated_price": base_price, "total_value": total, "currency": "INR"}

        elif self.path == '/api/classify-waste':
            response = {
                "predicted_class": "rice_straw",
                "display_name": "Rice Straw",
                "confidence": 0.98,
                "price_range": {"min_per_ton": 2200, "max_per_ton": 2800, "currency": "INR"},
                "environmental_benefits": {
                    "co2_reduction_per_ton": 1500,
                    "soil_nitrogen_retained_kg": 12,
                    "water_savings_liters": 5000
                },
                "industrial_uses": [
                    {"industry": "Bio-Energy", "application": "Ethanol Production", "processing": "Fermentation", "market_demand": "Very High"},
                    {"industry": "Paper & Pulp", "application": "Paper Manufacturing", "processing": "Pulping", "market_demand": "High"}
                ]
            }
            
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy"}).encode('utf-8'))
        else:
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"StubbleX Backend Running")

print(f"Starting simple server on port {PORT}")
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print("serving at port", PORT)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
