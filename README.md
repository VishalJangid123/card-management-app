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
