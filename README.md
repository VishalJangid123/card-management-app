# **Card Management App using React Native and Omise Payment Gateway 🚀**

This project is a **React Native** mobile application that integrates with the **Omise Payment Gateway** to allow users to make payments using their credit cards. The app provides a set of features such as managing customer data, adding cards, and processing payments.

## **Features 📱**

- **Customer List**: Users can add new customers via email or use a default test customer.
- **Card List**: Displays a list of cards associated with the selected customer. Random amount and Pay
- **Add Card**: Allows users to add new credit cards to the selected customer.

## **Screenshots 📸**

Below are some screenshots showcasing the app's UI:

 
| Customer List         | Add new customer                                      | Add card |
|---------------------|-------------------------------------------------|-------------------|
| ![Customer List](https://github.com/user-attachments/assets/4e4002e6-1940-45a6-aeb3-f4b1527b62cf)       |![Customer List - Add Customer](https://github.com/user-attachments/assets/fb2d3bde-0245-436c-b1fd-5376c407becf)    | ![Add Card](https://github.com/user-attachments/assets/13b38048-cd2d-4e18-adc0-a3010c673c79) |


| Card List         | Pay                                | Payment Success |
|---------------------|-------------------------------------------------|-------------------|
| ![Card List](https://github.com/user-attachments/assets/408f6776-2472-410f-8e3e-6be1c60a16f0)       |![Pay Modal](https://github.com/user-attachments/assets/40557d65-aa55-4dd0-b7ca-041d58332046)    | ![Payment success](https://github.com/user-attachments/assets/3ffba911-8407-41a3-9c65-ffcfa97fccc2) |


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
