import urllib.request
import urllib.parse
import json
import webbrowser
import os
import time

# Configuration
API_URL = "http://localhost:5000/api/auth/login"
APP_URL = "http://localhost:5173"
CONFIG_EMAIL = "subbu@gmail.com"
PASSWORD = "subbu"
LOCAL_STORAGE_KEY = "token"

def login_and_open(email=CONFIG_EMAIL):
    print(f"Attempting to login as {email}...")
    
    data = json.dumps({"email": email, "password": PASSWORD}).encode('utf-8')
    req = urllib.request.Request(API_URL, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                body = response.read().decode('utf-8')
                json_response = json.loads(body)
                token = json_response.get('token')
                
                if token:
                    print("Login successful! Token received.")
                    launch_browser(token, email)
                else:
                    print("Error: No token found in response.")
            else:
                print(f"Failed to login. Status code: {response.status}")
                
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print(f"Login failed (401). User '{email}' might not exist or password mismatch.")
            # If it's the default email, try to register it.
            # If it is ALREADY a fallback email, we might want to stop or try another one? 
            # For simplicity, if 401, we try to Register.
            
            attempt_register(email)
        else:
            print(f"HTTP Error: {e.code} - {e.reason}")

    except Exception as e:
        print(f"An error occurred: {e}")

def attempt_register(email):
    print(f"Attempting to REGISTER '{email}'...")
    register_url = "http://localhost:5000/api/auth/register"
    reg_data = json.dumps({"name": "Subbu Test", "email": email, "password": PASSWORD}).encode('utf-8')
    reg_req = urllib.request.Request(register_url, data=reg_data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(reg_req) as reg_response:
            if reg_response.status == 201:
                print("Registration successful! Retrying login...")
                time.sleep(1)
                login_and_open(email)
            else:
                print(f"Registration failed with status {reg_response.status}")
                
    except urllib.error.HTTPError as reg_e:
            print(f"Registration failed: {reg_e.code} - {reg_e.reason}")
            if reg_e.code == 400:
                print("User already exists (caught 400). Creating fallback user...")
                new_email = f"subbu_{int(time.time())}@gmail.com"
                # Register the NEW user directly
                # To reuse logic, we could call attempt_register(new_email) but that might infinite loop if that fails too?
                # Let's do it explicitly once.
                
                print(f"Registering fallback user {new_email}...")
                reg_data_new = json.dumps({"name": "Subbu Test", "email": new_email, "password": PASSWORD}).encode('utf-8')
                reg_req_new = urllib.request.Request(register_url, data=reg_data_new, headers={'Content-Type': 'application/json'})
                
                try:
                    with urllib.request.urlopen(reg_req_new) as new_res:
                        if new_res.status == 201:
                             print(f"Fallback registration successful for {new_email}")
                             # Get token from response directly if possible, or login
                             body = new_res.read().decode('utf-8')
                             json_response = json.loads(body)
                             token = json_response.get('token')
                             if token:
                                 launch_browser(token, new_email)
                             else:
                                 login_and_open(new_email)
                except Exception as ex:
                    print(f"Fallback registration failed: {ex}")

def launch_browser(token, email):
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Authenticating...</title>
        <script>
            localStorage.setItem('{LOCAL_STORAGE_KEY}', '{token}');
            window.location.href = '{APP_URL}';
        </script>
    </head>
    <body>
        <h1>Logging in as {email}...</h1>
        <p>Redirecting to {APP_URL}</p>
    </body>
    </html>
    """
    temp_file = "login_redirect.html"
    with open(temp_file, "w") as f:
        f.write(html_content)
    
    print(f"Opening browser to {APP_URL}...")
    webbrowser.open(f"file://{os.path.abspath(temp_file)}")

if __name__ == "__main__":
    login_and_open()
