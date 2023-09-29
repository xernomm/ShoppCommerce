# ShoppCommerce
HELLO GUYS

Thank you for downloading my e-commerce App Shopp!

Here are some instructions to run the application:

1. Install visual studio code
Visual studio code is perfect for running this application as it is now a popular coding app.
After you install it, make sure you also install extensions for spring boot to run the backend.

2. Create your database schema
First, go to your MySql Workbench, and create a new schema
![image](https://github.com/xernomm/ShoppCommerce/assets/137773855/b60a1220-d8de-4ff1-8214-0147bfa67b1b)
then click apply in the bottom right
![image](https://github.com/xernomm/ShoppCommerce/assets/137773855/1320f954-1d69-4124-b948-05772e3a824e)

Then, find this file inside the directory of shoppbackend
![image](https://github.com/xernomm/ShoppCommerce/assets/137773855/3d2731c0-7400-44b9-8749-8be749e645bd)
In the directory you can find application.properties
      ##Database -- connect mysql
      spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
      spring.datasource.url=jdbc:mysql://localhost:3306/shopp?useSSL=false&allowPublicKeyRetrieval=true
      spring.datasource.username=[CHANGE TO YOUR USERNAME]
      spring.datasource.password=[CHANGE TO YOUR DB PASSWORD]
      
      ##JPA-HIBERNATE
      spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5Dialect
      
      ## CREATE,UPDATE,CREATE-DROP
      spring.jpa.hibernate.ddl-auto=update
      spring.jpa.properties.hibernate.show_sql=true
      jwt.secretKey=janganDihapus
      
      # File upload properties
      spring.servlet.multipart.enabled=true
      spring.servlet.multipart.file-size-threshold=2KB
      spring.servlet.multipart.max-file-size=10MB
      spring.servlet.multipart.max-request-size=10MB
      
      #Paypal
      paypal.mode=sandbox
      paypal.clientId=ASDu0G9O-xzDXS60XTpUWQzLqYkerjoEuOGm9-RXL1ILs1rxP4AnvW1sxcGZWIz9MBMKnKJSHPJ6xYCA
      paypal.clientSecret=EFC6QVz9_cqeJcy4bdjR3oV_Q95gRyho6rUvSNSYG2K_QJEi_NUOgneLaerDc8khkpQgDrdYw_UJjU7Y

3. Install Node Modules.
This project is developed using ReactJs, the node modules is too big to upload within the zip file of this app.
So install the node modules in your laptop by following these instruction:
 a. Go to visual studio code
 b. Open the terminal
 c. Navigate to shoppfrontend (cd shoppfrontend)
 d. npm update
![Screenshot 2023-09-29 140625](https://github.com/xernomm/ShoppCommerce/assets/137773855/e2663fe0-feae-43cd-a7f0-123fec8847a1)
wait for the process to finish.

4. Running the App
  A. Running the back end
To run the backend, go trough shoppbackend folder and find ShopApplication.java
![image](https://github.com/xernomm/ShoppCommerce/assets/137773855/f0d4fa1b-af53-4e03-b0de-907b3d1307b7)

Then, right click the file and choose "Run Java"
![image](https://github.com/xernomm/ShoppCommerce/assets/137773855/df404fff-24b7-489a-bba9-a831b22aba00)

If your database is properly settled then Shopp should be successfully started like this:
![image](https://github.com/xernomm/ShoppCommerce/assets/137773855/6319a2bc-4d9f-49a8-a484-95ea28f7cb13)

Happy coding!




