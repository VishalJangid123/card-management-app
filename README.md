# **Card Management App using React Native and Omise Payment Gateway 🚀**

This project is a **React Native** mobile application that integrates with the **Omise Payment Gateway** to allow users to make payments using their credit cards. The app provides a set of features such as managing customer data, adding cards, and processing payments.

## **Features 📱**

- **Customer List**: Users can add new customers via email or use a default test customer.
- **Card List**: Displays a list of cards associated with the selected customer. Random amount and Pay
- **Add Card**: Allows users to add new credit cards to the selected customer.

## **Screenshots 📸**

Below are some screenshots showcasing the app's UI:

 
| Empty Customer List         | Customer List                                   | Add Customer |
|---------------------|-------------------------------------------------|-------------------|
|   ![Empty Customer List](https://github.com/user-attachments/assets/76b76b1f-b2d8-4cca-9b7b-42f7ac29a8bb) | ![Customer List](https://github.com/user-attachments/assets/4e4002e6-1940-45a6-aeb3-f4b1527b62cf)      |  ![Customer List - Add Customer](https://github.com/user-attachments/assets/fb2d3bde-0245-436c-b1fd-5376c407becf) 
|


| No Cards         | Add Card                                | Card List |
|---------------------|-------------------------------------------------|-------------------|
|![No Cards](https://github.com/user-attachments/assets/a6167b62-1087-4e6b-a969-f6e88879439b)       | ![Add Card](https://github.com/user-attachments/assets/1a702762-c580-4af1-a0e6-74b4f9cb150e)   |  ![Card List](https://github.com/user-attachments/assets/408f6776-2472-410f-8e3e-6be1c60a16f0)    |

| Pay Modal         | Payment Success                              | Card List |
|---------------------|-------------------------------------------------|-------------------|
|![Pay Modal](https://github.com/user-attachments/assets/40557d65-aa55-4dd0-b7ca-041d58332046)      | ![Payment success](https://github.com/user-attachments/assets/3ffba911-8407-41a3-9c65-ffcfa97fccc2)   |  ![Payment Failed](https://github.com/user-attachments/assets/9edaeee8-b855-408c-9bdf-7d4323cca72e) |

## **Technologies Used ⚙️**

### **Frontend**

- **React Native**: For building the mobile app UI.
- **Omise Payment Gateway**: Integrated to handle payment processing.
- **React Navigation**: For smooth navigation between app screens.
- **TypeScript**: Ensures type safety for more robust code.
- **React Context API**: Manages global state, specifically customer data.
- **Custom Hooks**: **`useOmise`** custom hook for API interaction between React Native and Omise.
- **Nativewind**: A utility-first CSS framework for styling the components.
- **Expo Fonts**: For custom fonts across the app.

### **Backend**

- **Node.js** with **Express**: Backend framework for managing API routes and payment handling.
- **Omise API**: For processing payments securely.
- **Socket.io**: For real-time communication.
- **RabbitMQ**: For message queuing and handling scalability.
- **Docker**: For running RabbitMQ in a containerized environment.

## **Application Flow 🌐**

This section outlines how data flows through the app, from user actions to payment processing, and explains the roles of **Socket.io** and **RabbitMQ** in managing real-time updates and scalable message delivery.

### **1. User Interaction 💬**

### **Customer List Screen:**

- The user can:
    - Add a new customer by entering their **email**. The app validates the email and calls the **Omise API** to create the customer. Upon success, the app stores the **Omise customer ID** and email in **AsyncStorage** for future use.
    - Alternatively, the user can create a **default test customer** for quick testing.
- Once a customer is created or selected, the user can proceed to manage cards or make a payment.

### **Card List Screen:**

- The user can see a list of cards associated with the selected customer.
- From here, the user can click the **Pay** button to initiate a payment.

### **Add Card Screen:**

- The user adds a credit card to the customer’s account.
- The app calls the **Omise API** to generate a **payment token** for the card.
- This token is then linked to the customer, and the card is added to the customer’s profile for future payments.

### **2. Payment Process 💳**

### **Initiating Payment:**

- When the user clicks **Pay**, the frontend (React Native app) sends a **payment request** to the backend, passing along the **customer ID** and payment **amount**.
- The frontend **subscribes** to updates using **Socket.io**. The **customer ID** is used as a unique identifier for the socket connection, ensuring that the app only receives updates relevant to the current customer.

### **Backend Processing:**

- The backend (Node.js + Express) receives the payment request and calls the **Omise API** to attempt the charge.
- The backend then sends a **Socket.io** message to the frontend, notifying the app that the payment process has been initialized.

### **Payment Status Update:**

- After processing the payment through Omise, the backend updates the payment status (success or failure).
- A **Socket.io** message is sent to the frontend in real-time, using the **customer ID** to target the correct client. The frontend receives this update and shows the status of the payment to the user.
- If the payment is successful, the frontend displays a **success message**. If there is an error (e.g., insufficient funds, card decline), the frontend displays an **error message**.

### **RabbitMQ Integration:**

- To ensure scalability and reliability, the backend places payment-related messages (e.g., payment status) into a **RabbitMQ queue**.
- The **RabbitMQ queue** ensures that messages are processed in order and without loss, even during high traffic or multiple concurrent requests. This helps the system handle payments and other tasks asynchronously.

### **3. Socket.io Communication 📡**

- **Frontend (React Native)** subscribes to **Socket.io** events using the **customer ID** to ensure each customer receives updates about their payment process in real-time.
    - The frontend establishes a connection to the backend with the **customer ID**.
    - **Backend (Node.js)** emits **Socket.io** events specific to that **customer ID**, ensuring that the correct client receives the update (e.g., payment success, failure, or progress).
 
 ## **Setup and Testing Instructions 🛠️**

### **Frontend Setup (React Native with React Navigation & Expo) 📱**

1. **Clone the Repository**: First, clone the repository from GitHub and to the project directory.
    
    ```bash
    git clone https://github.com/VishalJangid123/card-management-app.git
    cd card-management-app
    ```
    
2. **Install Dependencies**: Make sure you have **Node.js** and **npm** installed. Then, install the frontend dependencies.
    
    ```bash
    npm install
    ```
    
3. **Start the React Native App Using Expo**: To run the app on your local device or simulator, you’ll use **Expo Go**. First, make sure you have **Expo Go** installed on your phone or use an emulator.
    
    To start the app:
    
    ```bash
    npm start
    ```
    
    This will open the Expo CLI in your terminal, where you can scan the QR code using the **Expo Go** app on your phone (available on **iOS** and **Android**), or choose *i* **"Run in iOS simulator"** or *a* **"Run in Android emulator"**.
    
4. **Run the App on iOS**: If you are on macOS and want to run the app directly on an iOS simulator, use:
    
    ```bash
    npm run ios
    ```
    This will build and launch the app in the iOS simulator.

### **Backend Setup (Node.js with Express & Omise Integration) 💻**

1. **Navigate to the Backend Directory**: Backend is in a separate folder inside the project directory (**`/api`**), navigate to that folder:
    
    ```bash
    cd card-management-app/api
    ```
    
2. **Install Dependencies**: Install all necessary backend dependencies using npm:
    
    ```bash
    npm install
    ```
    
3. **Start the Backend Server**: To start the backend server using **Nodemon** for live-reloading, run:
    
    ```bash
    npm start
    ```
    
    **Note**: Make sure you have **Nodemon** installed globally or locally as part of the dependencies. If it's not installed, you can add it:
    
    ```bash
    npm install --save-dev nodemon
    ```
    
4. **Verify Backend is Running**: Once the backend is running, you should see output like this in your terminal:
    
    ```text
    Server running on http://localhost:3000
    Listening for payment status updates...
    ```
    

### **RabbitMQ Setup in Docker 🐇**

1. **Start RabbitMQ in Docker**: RabbitMQ will be used for managing message queues. To start RabbitMQ in a Docker container, run the following commands:
    
    ```bash
    docker run --rm -it --hostname my-rabbit -p 15672:15672 -p 5672:5672 rabbitmq:3-management
    ```
This command will pull the RabbitMQ image and run the RabbitMQ container and exposes the necessary ports.
        - **`5672`** is the default RabbitMQ AMQP protocol port.
        - **`15672`** is the web management console (Access it via **`http://localhost:15672`**) with Username and Password as **`guest`**. This web console help to verify queues, exchanges, and messages being published/consumed

### **Environment Variables Setup 🔑**

You will need two sets of environment variables for the project:

1. **Frontend** (React Native) Environment Variables for Omise Keys and backend URL.
2. **Backend** (Node.js) Environment Variables for Omise Keys.

### **Frontend (.env.development) 🌐**

Create a **`.env.development`** file in the root directory **`card-management-app`**.

Example **`.env.development`** file:

```
EXPO_PUBLIC_OMISE_PUBLIC_KEY = pkey_test_.......
EXPO_PUBLIC_OMISE_SECRET_KEY = skey_test_.......
EXPO_PUBLIC_BACKEND_URL = http://localhost:3000
```
Make sure to replace the actual test keys you get from **Omise Dashboard**.

### **Backend (.env) 🔐**

In the **backend** folder (**`/api`**), create a **`.env`** file that includes the **Omise API keys**.

Example **`.env`** file:

```
OMISE_PUBLIC_KEY = pkey_test_........
OMISE_SECRET_KEY = skey_test_........
```

### **Omise Test Keys 🔑**

To interact with the Omise API in **test mode**, you will need test keys from Omise. You can [Sign up](https://dashboard.omise.co/v2/signup). You can find the keys at [Dashboard](https://dashboard.omise.co/v2/settings)  → Settings → Keys. The keys will containing `_test_` for the test mode.
- **Secret Key**: **`skey_test_.........`**
- **Public Key**: **`pkey_test_.........`**

### **Omise Testing Card Numbers 💳**

When testing payments, you can use the following **Omise test credit card numbers**. These cards will simulate different payment scenarios:

- **Successful Payment**:
    
    **`4242 4242 4242 4242`** (Visa card, no expiration, any CVC)
    
- **Declined Payment (Insufficient Funds)**:
    
    **`4111 1111 1114 0011`** 
    
- **Payment Rejected**:
    
    **`4111 1111 1111 0014`** 
    
- **Stolen or lost card**:
    
    **`4111 1111 1113 0012`** 
    

These test cards will allow you to simulate a range of real-world payment scenarios without the need for actual card details.
For more information on Omise APIs, test cards, refer to the [Omise Testing Documentation](https://docs.opn.ooo/).
