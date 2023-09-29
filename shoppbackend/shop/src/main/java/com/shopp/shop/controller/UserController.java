package com.shopp.shop.controller;

import com.shopp.shop.model.*;
import com.shopp.shop.repository.*;
import com.shopp.shop.requestBody.*;
import com.shopp.shop.response.CustomErrorResponse;
import com.shopp.shop.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/shop")
public class UserController {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuyerService buyerService;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private SupplierService supplierService;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderHistoryRepository orderHistoryRepository;

    @Autowired
    private OrderHistoryService orderHistoryService;

    @Autowired
    private ShoppPayService shoppPayService;

    @Autowired
    private ShoppPayRepository shoppPayRepository;

    @Autowired
    private TopUpRequestRepository topUpRequestRepository;

    @Autowired
    private OrderStatusService orderStatusService;

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    private SupplierPayRepository supplierPayRepository;

    @Autowired
    private SupplierPayService supplierPayService;

    @Autowired
    private ProductReviewService productReviewService;

    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private ContactMessageService contactMessageService;

    @Autowired
    private ShoppProfitService shoppProfitService;


    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody RegisterRequestBody registerRequestBody){
        User user = new User();
        UserDetails userDetails = new UserDetails();
        Buyer buyer = new Buyer();
        Supplier supplier = new Supplier();


        user.setActive(true);
        user.setEmail(registerRequestBody.getEmail());
        user.setPassword(registerRequestBody.getPassword());
        user.setJoinedDate(LocalDate.now());
        userDetails.setAge(registerRequestBody.getAge());
        userDetails.setName(registerRequestBody.getName());
        userDetails.setPhoneNumber(registerRequestBody.getPhoneNumber());

        user.setUserDetails(userDetails);
        userService.saveUser(user);

        if(Objects.equals(registerRequestBody.getRole(), "BUYER")){

            user.setRole(Role.BUYER);
            buyer.setName(registerRequestBody.getName());
            buyer.setLatitude(registerRequestBody.getLatitude());
            buyer.setLongitude(registerRequestBody.getLongitude());
            buyer.setCity(registerRequestBody.getCity());
            buyer.setState(registerRequestBody.getState());
            buyer.setCountry(registerRequestBody.getCountry());
            buyer.setRoad(registerRequestBody.getRoad());
            buyer.setVillage(registerRequestBody.getVillage());
            buyer.setSubdistrict(registerRequestBody.getSubdistrict());
            buyer.setPostcode(registerRequestBody.getPostcode());
            buyer.setUserId(user);
            buyerService.saveBuyer(buyer);

            Cart cart = buyer.getCart();
            if (cart == null){
                cart = new Cart();
                buyer.setCart(cart);
            }
            cartService.addCart(cart);

            user.setBuyer(buyer);
        }
        if(Objects.equals(registerRequestBody.getRole(), "SUPPLIER")){
            user.setRole(Role.SUPPLIER);

            supplier.setName(registerRequestBody.getName());
            supplier.setCompanyNumber(registerRequestBody.getPhoneNumber());
            supplier.setCompanyEmail(registerRequestBody.getEmail());
            supplier.setLatitude(registerRequestBody.getLatitude());
            supplier.setLongitude(registerRequestBody.getLongitude());
            supplier.setRoad(registerRequestBody.getRoad());
            supplier.setVillage(registerRequestBody.getVillage());
            supplier.setSubdistrict(registerRequestBody.getSubdistrict());
            supplier.setCity(registerRequestBody.getCity());
            supplier.setState(registerRequestBody.getState());
            supplier.setCountry(registerRequestBody.getCountry());
            supplier.setPostcode(registerRequestBody.getPostcode());
            supplier.setUserId(user);

            supplierService.saveSupplier(supplier);

            SupplierPay supplierPay = supplier.getSupplierPay();
            if(supplierPay == null){
                supplierPay = new SupplierPay();
                supplierPay.setSupplier(supplier);
                supplierPay.setEmail(supplier.getCompanyEmail());
                supplierPay.setName(supplier.getName());
                supplierPay.setCity(supplier.getCity());
                supplierPay.setCountry(supplier.getCountry());
                supplierPay.setState(supplier.getState());
                supplierPay.setPostcode(supplier.getPostcode());
                supplierPay.setPhoneNumber(supplier.getCompanyNumber());
                supplierPay.setPassword(supplier.getUserId().getPassword());
                supplierPayService.newAccount(supplierPay);

                supplier.setSupplierPay(supplierPay);
            }

            user.setSupplier(supplier);
        }
        if(registerRequestBody.getRole() == null){
            throw new IllegalArgumentException("User did not choose a role");
        }



        return ResponseEntity.ok(user);
    }

    @PostMapping("/check-email")
    public ResponseEntity<Object>checkMail(@RequestBody CheckMailRequestBody checkMailRequestBody){
        Optional<User> userMail = userRepository.findByEmail(checkMailRequestBody.getEmail());
        if(userMail.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        return ResponseEntity.ok("email found");
    }

    @PostMapping("/check-email-exist")
    public ResponseEntity<Object>checkMailExist(@RequestBody CheckMailRequestBody checkMailRequestBody){
        Optional<User> userMail = userRepository.findByEmail(checkMailRequestBody.getEmail());
        if(userMail.isPresent()){
            CustomErrorResponse error = new CustomErrorResponse("Email in use.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        return ResponseEntity.ok("Email " + checkMailRequestBody.getEmail() + " is not in use");
    }

    @PostMapping("/change-password")
    public ResponseEntity<Object>changePassword(@RequestBody ChangePasswordRequestBody changePasswordRequestBody){

    Optional<User> userMail = userRepository.findByEmail(changePasswordRequestBody.getEmail());
    if(userMail.isEmpty()){
        CustomErrorResponse error = new CustomErrorResponse("Email not found.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    if(Objects.equals(userMail.get().getPassword(), changePasswordRequestBody.getPassword())){
        CustomErrorResponse error = new CustomErrorResponse("password same");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
    User updatedUserPass = userMail.get();
    updatedUserPass.setPassword(changePasswordRequestBody.getPassword());


    userService.updateUser(updatedUserPass);
    return ResponseEntity.ok("password of user " + updatedUserPass.getEmail() + " is changed.");
    }

    @PostMapping("/create-shoppPay")
    public ResponseEntity<Object> createShoppPayAccount(@RequestBody NewShoppPayRequestBody newShoppPayRequestBody, @RequestParam(name = "email") String email){
        Optional<User> userMail = userRepository.findByEmail(email);
        if(userMail.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        User user = userMail.get();
        Buyer buyer = user.getBuyer();

        if (newShoppPayRequestBody.getPassword() == null) {
            CustomErrorResponse error = new CustomErrorResponse("Password cannot be null.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        String passwordPattern = "^[0-9]+$"; // Only digits are allowed
        if (!newShoppPayRequestBody.getPassword().matches(passwordPattern)) {
            CustomErrorResponse error = new CustomErrorResponse("Password should contain only digits.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        if (newShoppPayRequestBody.getPassword().length() != 4) {
            CustomErrorResponse error = new CustomErrorResponse("Password should be exactly 4 digits.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        ShoppPay newShoppPay = new ShoppPay();
        newShoppPay.setPassword(newShoppPayRequestBody.getPassword());

        newShoppPay.setName(user.getUserDetails().getName());
        newShoppPay.setEmail(user.getEmail());
        newShoppPay.setPhoneNumber(user.getUserDetails().getPhoneNumber());
        newShoppPay.setCity(buyer.getCity());
        newShoppPay.setState(buyer.getState());
        newShoppPay.setCountry(buyer.getCountry());
        newShoppPay.setPostcode(buyer.getPostcode());
        newShoppPay.setBalance(0.00);
        newShoppPay.setBuyer(buyer);
        shoppPayService.newAccount(newShoppPay);
        buyer.setShoppPay(newShoppPay);
        buyerRepository.save(buyer);

        return ResponseEntity.ok(newShoppPay);
    }

    @PostMapping("/top-up")
    public ResponseEntity<Object> topUp(@RequestBody TopUpRequestBody topUpRequestBody, @RequestParam(name = "email") String email){
        Optional<User> userMail = userRepository.findByEmail(email);
        if(userMail.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        if (topUpRequestBody.getBalance() == 0){
            CustomErrorResponse error = new CustomErrorResponse("Balance cannot be 0.");
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
        }

        User user = userMail.get();
        TopUpRequests topUpRequests = new TopUpRequests();
        topUpRequests.setBalance(topUpRequestBody.getBalance());
        topUpRequests.setDescription(topUpRequestBody.getDescription());
        topUpRequests.setPaid(false);
        topUpRequests.setPaymentMethod("paypal");
        topUpRequests.setBuyer(user.getBuyer());
        shoppPayService.newTopUpRequest(topUpRequests);

        return ResponseEntity.ok(topUpRequests);
    }

    @PutMapping("/top-up/{topUpId}/payment/{email}")
    public ResponseEntity<Object> paidTopUp(@PathVariable Long topUpId, @PathVariable String email) {
        Optional<User> userMail = userRepository.findByEmail(email);
        if (userMail.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        User user = userMail.get();
        Buyer buyer = user.getBuyer();

        Optional<TopUpRequests> idTopUp = topUpRequestRepository.findById(topUpId);
        if (idTopUp.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("TopUp request not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        TopUpRequests topUpRequest = idTopUp.get();

        ShoppPay shoppPay = userMail.get().getBuyer().getShoppPay();
        if (shoppPay == null) {
            CustomErrorResponse error = new CustomErrorResponse("ShoppPay account not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        double currentBalance = shoppPay.getBalance();
        shoppPay.setBalance(currentBalance + topUpRequest.getBalance());

        shoppPayRepository.save(shoppPay);

        topUpRequest.setPaid(true);
        topUpRequest.setDate(LocalDate.now());
        topUpRequestRepository.save(topUpRequest);

        buyerRepository.save(buyer);

        user.getBuyer().setShoppPay(shoppPay);
        userService.saveUserNoException(user);

        return ResponseEntity.ok(buyer);
    }

    @GetMapping("/shoppPay-account/{email}")
    public ResponseEntity<ShoppPay> getShoppPayByEmail(@PathVariable String email){
        Optional<User> userMail = userRepository.findByEmail(email);
        if (userMail.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.notFound().build();
        }
        User user = userMail.get();
        Buyer buyer = user.getBuyer();
        ShoppPay shoppPay = buyer.getShoppPay();

        return ResponseEntity.ok(shoppPay);
    }

    @GetMapping("/top-up-requests/{email}")
    public List<TopUpRequests> getRequestByEmail(@PathVariable String email){
        Optional<User> userMail = userRepository.findByEmail(email);
        if(userMail.isEmpty()){
           throw new IllegalArgumentException("not found top up");
        }
        User user = userMail.get();
        return user.getBuyer().getTopUpRequests();
    }

    @DeleteMapping("/delete-top-up/{topUpId}")
    public ResponseEntity<String> deleteTopUpRequest(@PathVariable Long topUpId){
        Optional<TopUpRequests> idRequest = topUpRequestRepository.findById(topUpId);
        if (idRequest.isEmpty()){
            throw new IllegalArgumentException("request not found");
        }
        topUpRequestRepository.delete(idRequest.get());
        return ResponseEntity.ok("Top up request deleted");
    }

    @GetMapping("/top-up-request-details/{topUpId}")
    public ResponseEntity<TopUpRequests> topUpRequestDetails(@PathVariable Long topUpId){
        Optional<TopUpRequests> idTopUp = topUpRequestRepository.findById(topUpId);
        if(idTopUp.isEmpty()){
            throw new IllegalArgumentException("top up not found");
        }
        return ResponseEntity.ok(idTopUp.get());
    }

    @PostMapping("/edit-user")
    public ResponseEntity<Object> adminEditUser(@RequestBody AdminEditUserRequestBody adminEditUserRequestBody, @RequestParam(name = "userId") Long userId){
        Optional<User> idUser = userRepository.findById(userId);
        if (idUser.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        User user = idUser.get();
        UserDetails userDetails = user.getUserDetails();

        userDetails.setName(adminEditUserRequestBody.getName());
        userDetails.setAge(adminEditUserRequestBody.getAge());
        userDetails.setPhoneNumber(adminEditUserRequestBody.getPhoneNumber());
        user.setUserDetails(userDetails);

        userService.saveUserNoException(user);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/delete-profile-picture/{userId}")
    public ResponseEntity<Object> disableProfilePicture(@PathVariable Long userId){
        Optional<User> idUser = userRepository.findById(userId);
        if (idUser.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        User user = idUser.get();
        user.setProfilePicture(null);
        userService.saveUserNoException(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/edit-profile/buyer")
    public ResponseEntity<Object> editProfileBuyer(EditProfileBuyerRequestBody editProfileBuyerRequestBody, @RequestParam(name = "email") String email){
        Optional<User> userMail = userRepository.findByEmail(email);
        if(userMail.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        User updatedUser = userMail.get();
        double currentLat = updatedUser.getBuyer().getLatitude();
        double currentLng = updatedUser.getBuyer().getLongitude();

        updatedUser.getUserDetails().setName(editProfileBuyerRequestBody.getName());
        updatedUser.getUserDetails().setPhoneNumber(editProfileBuyerRequestBody.getPhoneNumber());
        updatedUser.getUserDetails().setAge(editProfileBuyerRequestBody.getAge());

//        LOCATION VALUES
        updatedUser.getBuyer().setLatitude(editProfileBuyerRequestBody.getLatitude());
        updatedUser.getBuyer().setLongitude(editProfileBuyerRequestBody.getLongitude());
        updatedUser.getBuyer().setRoad(editProfileBuyerRequestBody.getRoad());
        updatedUser.getBuyer().setCity(editProfileBuyerRequestBody.getCity());
        updatedUser.getBuyer().setState(editProfileBuyerRequestBody.getState());
        updatedUser.getBuyer().setCountry(editProfileBuyerRequestBody.getCountry());
        updatedUser.getBuyer().setPostcode(editProfileBuyerRequestBody.getPostcode());


        try {
            userService.editUser(updatedUser, editProfileBuyerRequestBody.getProfilePicture());
        } catch (IOException e) {
            CustomErrorResponse error = new CustomErrorResponse("Error uploading image.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        return ResponseEntity.ok(updatedUser);

    }


    @PostMapping("/edit-profile/supplier")
    public ResponseEntity<Object> editProfileSupplier(EditProfileSupplierRequestBody editProfileSupplierRequestBody, @RequestParam(name = "email") String email){
        Optional<User> userMail = userRepository.findByEmail(email);
        if(userMail.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        User updatedUser = userMail.get();
        updatedUser.getSupplier().setCompanyName(editProfileSupplierRequestBody.getCompanyName());
        updatedUser.getSupplier().setCompanyNumber(editProfileSupplierRequestBody.getCompanyNumber());

//        LOCATION VALUES
        updatedUser.getSupplier().setLatitude(editProfileSupplierRequestBody.getLatitude());
        updatedUser.getSupplier().setLongitude(editProfileSupplierRequestBody.getLongitude());
        updatedUser.getSupplier().setRoad(editProfileSupplierRequestBody.getRoad());
        updatedUser.getSupplier().setCity(editProfileSupplierRequestBody.getCity());
        updatedUser.getSupplier().setState(editProfileSupplierRequestBody.getState());
        updatedUser.getSupplier().setCountry(editProfileSupplierRequestBody.getCountry());
        updatedUser.getSupplier().setPostcode(editProfileSupplierRequestBody.getPostcode());

        try {
            userService.editUser(updatedUser, editProfileSupplierRequestBody.getProfilePicture());
            Supplier supplier = updatedUser.getSupplier();
            supplierService.saveImage(supplier, editProfileSupplierRequestBody.getProfilePicture());
        } catch (IOException e) {
            CustomErrorResponse error = new CustomErrorResponse("Error uploading image.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/user-info/{email}")
    public ResponseEntity<User> getUserInfo(@PathVariable String email){
        Optional<User> idUser = userRepository.findByEmail(email);
        if (idUser.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(idUser.get());
    }

    @GetMapping("/get-buyer/{email}")
    public ResponseEntity<Buyer> getBuyerByUserEmail(@PathVariable String email){
        Optional<User> idUser = userRepository.findByEmail(email);
        if (idUser.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        User user = idUser.get();
        Buyer buyer = user.getBuyer();

        return ResponseEntity.ok(buyer);
    }

    @GetMapping("/get-supplier/{email}")
    public ResponseEntity<Supplier> getSupplierByUserEmail(@PathVariable String email){
        Optional<User> idUser = userRepository.findByEmail(email);
        if (idUser.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        User user = idUser.get();
        Supplier supplier = user.getSupplier();

        return ResponseEntity.ok(supplier);
    }

    @GetMapping("/get-supplier/id/{supplierId}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long supplierId){
        Optional<Supplier> idUser = supplierRepository.findById(supplierId);
        if (idUser.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(idUser.get());
    }

    @GetMapping("/all-stores")
    public List<Supplier> getAllSuppliers(){
        return supplierService.allStores();
    }

    @GetMapping("/supplier-pay/{email}")
    public ResponseEntity<SupplierPay> getSupplierPay(@PathVariable String email){
        Optional<User> idUser = userRepository.findByEmail(email);
        if (idUser.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        User user = idUser.get();
        Supplier supplier = user.getSupplier();
        SupplierPay supplierPay = supplier.getSupplierPay();

        return ResponseEntity.ok(supplierPay);
    }

    @PostMapping("/add-product")
    public ResponseEntity<Object>addProduct(NewProductRequestBody newProductRequestBody,@RequestParam(name = "email") String email){

        Optional<User> userMail = userRepository.findByEmail(email);
        if(userMail.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        User supplyingUser = userMail.get();

        Product product = new Product();

        product.setProductName(newProductRequestBody.getProductName());
        product.setProductDescription(newProductRequestBody.getProductDescription());
        product.setPrice(newProductRequestBody.getPrice());
        product.setStock(newProductRequestBody.getStock());
        product.setProductionDate(LocalDate.now());
        product.setSupplier(supplyingUser.getSupplier());


        if(Objects.equals(newProductRequestBody.getProductType(), "ELECTRONIC")){
            product.setProductType(ProductType.ELECTRONIC);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "FOOD")){
            product.setProductType(ProductType.FOOD);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "HARDWARE")){
            product.setProductType(ProductType.HARDWARE);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "VEHICLE")){
            product.setProductType(ProductType.VEHICLE);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "SKINCARE")){
            product.setProductType(ProductType.SKINCARE);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "SOAP")){
            product.setProductType(ProductType.SOAP);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "FURNITURE")){
            product.setProductType(ProductType.FURNITURE);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "TOYS")){
            product.setProductType(ProductType.TOYS);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "ACCESSORIES")){
            product.setProductType(ProductType.ACCESSORIES);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "STATIONERY")){
            product.setProductType(ProductType.STATIONERY);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "MEDIA")){
            product.setProductType(ProductType.MEDIA);
        }
        if(Objects.equals(newProductRequestBody.getProductType(), "") || newProductRequestBody.getProductType() == null){
            product.setProductType(ProductType.UNKNOWN);
        }

        try{
            productService.addProduct(product, newProductRequestBody.getProductImage());
        }catch (IOException e){
            CustomErrorResponse error = new CustomErrorResponse("Error uploading image.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        return ResponseEntity.ok("Product added");

    }

    @PostMapping("/edit-product")
    public ResponseEntity<Object> editProduct(EditProductRequestBody editProductRequestBody, @RequestParam(name = "productId") Long productId, @RequestParam(name = "productImage", required = false) MultipartFile productImage){
        Optional<Product> idProduct = productRepository.findById(productId);
        if (idProduct.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Product not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Product currentProduct = idProduct.get();

        currentProduct.setProductName(editProductRequestBody.getProductName());
        currentProduct.setProductDescription(editProductRequestBody.getProductDescription());
        currentProduct.setStock(editProductRequestBody.getStock());
        currentProduct.setPrice(editProductRequestBody.getPrice());

        if(Objects.equals(editProductRequestBody.getProductType(), "ELECTRONIC")){
            currentProduct.setProductType(ProductType.ELECTRONIC);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "FOOD")){
            currentProduct.setProductType(ProductType.FOOD);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "HARDWARE")){
            currentProduct.setProductType(ProductType.HARDWARE);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "VEHICLE")){
            currentProduct.setProductType(ProductType.VEHICLE);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "SKINCARE")){
            currentProduct.setProductType(ProductType.SKINCARE);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "SOAP")){
            currentProduct.setProductType(ProductType.SOAP);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "FURNITURE")){
            currentProduct.setProductType(ProductType.FURNITURE);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "TOYS")){
            currentProduct.setProductType(ProductType.TOYS);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "ACCESSORIES")){
            currentProduct.setProductType(ProductType.ACCESSORIES);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "STATIONERY")){
            currentProduct.setProductType(ProductType.STATIONERY);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "MEDIA")){
            currentProduct.setProductType(ProductType.MEDIA);
        }
        if(Objects.equals(editProductRequestBody.getProductType(), "") || editProductRequestBody.getProductType() == null){
            currentProduct.setProductType(ProductType.UNKNOWN);
        }

        try {
            if (productImage != null && !productImage.isEmpty()) {
                productService.addProduct(currentProduct, productImage);
            } else {
                currentProduct.setProductImage(currentProduct.getProductImage());
                productRepository.save(currentProduct);
            }
        } catch (IOException e) {
            CustomErrorResponse error = new CustomErrorResponse("Error uploading image.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        return ResponseEntity.ok("Product updated");
    }

    @DeleteMapping("/delete-product/{productId}")
    public ResponseEntity<String> deleteProductById(@PathVariable Long productId){
        productService.deleteProduct(productId);
        return ResponseEntity.ok("product with id: " + productId + " is deleted");
    }

    @GetMapping("/all-users")
    public List<User> allUser(){
        return userService.getAllUsers();
    }

    @GetMapping("/all-products")
    public List<Product> allProducts(){
        return productService.allProducts();
    }

    @GetMapping("/all-products/supplier/{email}")
    public List<Product> myProducts(@PathVariable String email){
        Optional<User> userMail = userRepository.findByEmail(email);
        if(userMail.isEmpty()){
            throw new IllegalArgumentException("not found email");
        }
        User user = userMail.get();
        Supplier supplier = user.getSupplier();

        return supplier.getProducts();
    }

    @GetMapping("/all-products/supplier/id/{supplierId}")
    public List<Product> supplierProducts(@PathVariable Long supplierId){
        Optional<Supplier> userMail = supplierRepository.findById(supplierId);
        if(userMail.isEmpty()){
            throw new IllegalArgumentException("not found email");
        }
        Supplier supplier = userMail.get();
        return supplier.getProducts();
    }

    @PutMapping("product/{productId}/addToCart/{email}")
    public ResponseEntity<Object> addToCart(@PathVariable String email, @PathVariable Long productId){
        Optional<User> emailUser = userRepository.findByEmail(email);
        if(emailUser.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Optional<Product> idProduct = productRepository.findById(productId);
        if(idProduct.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Product not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User userCart = emailUser.get();
        Product addedProduct = idProduct.get();

        Cart cart = userCart.getBuyer().getCart();
        if (cart == null){
            cart = new Cart();
            userCart.getBuyer().setCart(cart);
        }

        boolean productExistsInCart = false;
        for (CartItem cartItem : cart.getCartItems()) {
            if (cartItem.getProduct().equals(addedProduct)) {
                int cartQuantity = cartItem.getQuantity();
                int productStock = addedProduct.getStock();

                if (cartQuantity + 1 > productStock) {
                    CustomErrorResponse error = new CustomErrorResponse("Insufficient stock.");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
                }

                cartItem.setQuantity(cartQuantity + 1);
                productExistsInCart = true;
                break;
            }
        }
        if (!productExistsInCart) {
            int productStock = addedProduct.getStock();

            if (productStock < 1) {
                CustomErrorResponse error = new CustomErrorResponse("Insufficient stock.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            int quantityToAdd = 1;

            if (quantityToAdd > productStock) {
                CustomErrorResponse error = new CustomErrorResponse("Insufficient stock.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            CartItem cartItem = new CartItem();
            cartItem.setProduct(addedProduct);
            cartItem.setQuantity(1);
            cartItem.setCart(cart);
            cart.getCartItems().add(cartItem);
        }

        cartService.addCart(cart);
        return ResponseEntity.ok("Added to cart");
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the Earth in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private double calculateTotalCost(List<CartItem> cartItems) {
        double totalCost = 0;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            totalCost += product.getPrice() * cartItem.getQuantity();
        }
        return totalCost;
    }

    private double calculateTotalDeliveryFee(List<CartItem> cartItems, Buyer buyer) {
        double totalDeliveryFee = 0;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            Supplier supplier = product.getSupplier();
            double distance = calculateDistance(buyer.getLatitude(), buyer.getLongitude(), supplier.getLatitude(), supplier.getLongitude());
            double deliveryFee = 0.12 * (int) distance; // Modify this formula as needed
            totalDeliveryFee += deliveryFee;
        }
        return totalDeliveryFee;
    }

    @PutMapping("/order/{email}")
    public ResponseEntity<Object> createOrder(@PathVariable String email){
        Optional<User> emailUser = userRepository.findByEmail(email);
        if (emailUser.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = emailUser.get();
        Cart cart = user.getBuyer().getCart();
        if (cart == null || cart.getCartItems().isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("Cart is empty. Add items to your cart before placing an order.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        double totalCost = calculateTotalCost(cart.getCartItems());
        double totalDeliveryFee = calculateTotalDeliveryFee(cart.getCartItems(), user.getBuyer());
        double tax = totalCost * 0.02;
        double serviceFee = 1.00;

        double totalOrderCost = totalCost + totalDeliveryFee + tax + serviceFee;

        double buyerLat = user.getBuyer().getLatitude();
        double buyerLng = user.getBuyer().getLongitude();

        PurchaseOrder order = new PurchaseOrder();
        order.setOrderDate(LocalDateTime.now());

        if (totalDeliveryFee > 150.00){

            double maxDeliveryFee = 150.00;
            order.setTotalDelivery(maxDeliveryFee);

            double totalOrderMaxDelivery = totalCost + maxDeliveryFee + tax + serviceFee;
            order.setTotalCost(totalOrderMaxDelivery);

        } else {
            order.setTotalDelivery(totalDeliveryFee);
            order.setTotalCost(totalOrderCost);
        }

        order.setTotalPrice(totalCost);
        order.setTax(tax);
        order.setServiceFee(serviceFee);

        order.setBuyer(user.getBuyer());
        order.setOrderMaker(user.getUserDetails().getName());

        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            order.getOrderItems().add(orderItem);
            Product product = cartItem.getProduct();
            Supplier supplier = product.getSupplier();

            order.setOrderMail(email);

            double supplierLat = supplier.getLatitude();
            double supplierLng = supplier.getLongitude();
            double distance = calculateDistance(buyerLat, buyerLng, supplierLat, supplierLng);

            order.setOrderDistance(distance);
        }
        orderRepository.save(order);

        cart.getCartItems().clear();
        cartRepository.save(cart);

        userRepository.save(user);

        return ResponseEntity.ok(order);
    }

    @PostMapping("/add-voucher")
    public ResponseEntity<Object> adminGiveVoucher(@RequestBody AdminGiveVoucherRequestBody adminGiveVoucherRequestBody, @RequestParam(name = "email") String email){
        Optional<User> emailUser = userRepository.findByEmail(email);
        if (emailUser.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        if(adminGiveVoucherRequestBody.getVoucherName() == null || adminGiveVoucherRequestBody.getQuantity() == 0){
            CustomErrorResponse error = new CustomErrorResponse("Cannot submit empty");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = emailUser.get();
        Buyer buyer = user.getBuyer();

        Vouchers vouchers = new Vouchers();
        if (Objects.equals(adminGiveVoucherRequestBody.getVoucherName(), "TWENTY")){
            vouchers.setVoucherName("20% Discount");
            vouchers.setDiscount(Discount.TWENTY);
        }
        if (Objects.equals(adminGiveVoucherRequestBody.getVoucherName(), "QUARTER")){
            vouchers.setVoucherName("25% Discount");
            vouchers.setDiscount(Discount.QUARTER);
        }
        if (Objects.equals(adminGiveVoucherRequestBody.getVoucherName(), "HALF")){
            vouchers.setVoucherName("50% Discount");
            vouchers.setDiscount(Discount.HALF);
        }
        if (Objects.equals(adminGiveVoucherRequestBody.getVoucherName(), "SEVENTYFIVE")){
            vouchers.setVoucherName("75% Discount");
            vouchers.setDiscount(Discount.SEVENTYFIVE);
        }
        if (Objects.equals(adminGiveVoucherRequestBody.getVoucherName(), "FULL")){
            vouchers.setVoucherName("99% Discount");
            vouchers.setDiscount(Discount.FULL);
        }
        else if(Objects.equals(adminGiveVoucherRequestBody.getVoucherName(),null)){
            CustomErrorResponse error = new CustomErrorResponse("Discount type not available");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        vouchers.setQuantity(adminGiveVoucherRequestBody.getQuantity());
        vouchers.setBuyer(buyer);
        vouchers.setActivated(false);
        voucherRepository.save(vouchers);

        buyer.getVouchers().add(vouchers);
        buyerRepository.save(buyer);

        return ResponseEntity.ok(buyer);
    }

    @GetMapping("/vouchers/buyer/{email}")
    public List<Vouchers> getVouchersByBuyer(@PathVariable String email){
        Optional<User> emailUser = userRepository.findByEmail(email);
        if (emailUser.isEmpty()) {
            throw new IllegalArgumentException("user not found");
        }
        User user = emailUser.get();
        Buyer buyer = user.getBuyer();

        return buyer.getVouchers();
    }

    @PutMapping("/discount/{email}/order/{orderId}/voucher/{voucherId}")
    public ResponseEntity<Object> putDiscount(
            @PathVariable String email,
            @PathVariable Long orderId,
            @PathVariable Long voucherId
    ) {
        Optional<User> emailUser = userRepository.findByEmail(email);
        if (emailUser.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = emailUser.get();
        Buyer buyer = user.getBuyer();

        Optional<PurchaseOrder> idOrder = orderRepository.findById(orderId);
        if (idOrder.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("Order not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        PurchaseOrder purchaseOrder = idOrder.get();

        if (!purchaseOrder.getBuyer().equals(buyer)) {
            CustomErrorResponse error = new CustomErrorResponse("Order does not belong to the user.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        if (purchaseOrder.isPayed()) {
            CustomErrorResponse error = new CustomErrorResponse("Order is already paid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        if (purchaseOrder.getDiscount() != null) {
            CustomErrorResponse error = new CustomErrorResponse("A voucher has already been applied to this order.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        List<Vouchers> userVouchers = buyer.getVouchers();
        Vouchers selectedVoucher = null;

        for (Vouchers voucher : userVouchers) {
            if (voucher.getVoucherId().equals(voucherId)) {
                selectedVoucher = voucher;
                break;
            }
        }

        if (selectedVoucher == null) {
            CustomErrorResponse error = new CustomErrorResponse("No available discount voucher found with the specified ID.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        double totalCost = purchaseOrder.getTotalCost();

        switch (selectedVoucher.getDiscount()) {
            case TWENTY -> {
                purchaseOrder.setDiscount(Discount.TWENTY);
                totalCost *= 0.80;
            }
            case QUARTER -> {
                purchaseOrder.setDiscount(Discount.QUARTER);
                totalCost *= 0.75;
            }
            case HALF -> {
                purchaseOrder.setDiscount(Discount.HALF);
                totalCost *= 0.50;
            }
            case SEVENTYFIVE -> {
                purchaseOrder.setDiscount(Discount.SEVENTYFIVE);
                totalCost *= 0.25;
            }
            case FULL -> {
                purchaseOrder.setDiscount(Discount.FULL);
                totalCost *= 0.01;
            }
            default -> {
            }
        }

        selectedVoucher.setQuantity(selectedVoucher.getQuantity() - 1);

        selectedVoucher.setActivated(true);
        voucherRepository.save(selectedVoucher);

        purchaseOrder.setDiscount(selectedVoucher.getDiscount());

        purchaseOrder.setTotalCost(totalCost);
        orderService.newOrder(purchaseOrder);

        return ResponseEntity.ok(purchaseOrder);
    }

    @GetMapping("/get-order-mail/{orderId}")
    public ResponseEntity<String> getOrderMailByOrderId(@PathVariable Long orderId){
        Optional<PurchaseOrder> idOrder = orderRepository.findById(orderId);
        if (idOrder.isEmpty()){
            throw new IllegalArgumentException("order not found");
        }
        PurchaseOrder order = idOrder.get();
        String orderMail = order.getOrderMail();

        return ResponseEntity.ok(orderMail);
    }


    @PostMapping("/edit-order")
    public ResponseEntity<Object> editOrder(
            @RequestBody EditOrderRequestBody editOrderRequestBody,
            @RequestParam(name = "cartId") Long cartId,
            @RequestParam(name = "cartItemId") Long cartItemId
    ) {
        Optional<Cart> cartOptional = cartRepository.findById(cartId);
        if (cartOptional.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("Cart not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Cart cart = cartOptional.get();
        List<CartItem> cartItems = cart.getCartItems();

        Optional<CartItem> optionalCartItem = cartItems.stream()
                .filter(item -> item.getCartItemId().equals(cartItemId))
                .findFirst();

        if (optionalCartItem.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("CartItem not found in the cart.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        CartItem cartItem = optionalCartItem.get();
        int newQuantity = editOrderRequestBody.getQuantity();
        int availableStock = cartItem.getProduct().getStock();

        if (newQuantity > availableStock) {
            CustomErrorResponse error = new CustomErrorResponse("Insufficient stock.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        cartItem.setQuantity(newQuantity);
        cartRepository.save(cart);

        return ResponseEntity.ok("Cart item updated successfully");
    }


    @PutMapping("buyer/{email}/completed-order/{orderId}")
    public ResponseEntity<Object> newOrderStatus(@PathVariable Long orderId, @PathVariable String email){
        Optional<PurchaseOrder> idOrder = orderRepository.findById(orderId);
        if(idOrder.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Order not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if(!idOrder.get().isPayed()){
            CustomErrorResponse error = new CustomErrorResponse("Order not paid.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        PurchaseOrder newOrder = idOrder.get();

        Optional<User> emailUser = userRepository.findByEmail(email);
        if(emailUser.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if(emailUser.get().getBuyer() == null){
            CustomErrorResponse error = new CustomErrorResponse("User is not a buyer.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = emailUser.get();
        Buyer buyer = user.getBuyer();


        OrderStatus orderStatus = new OrderStatus();
        orderStatus.setPurchaseOrder(newOrder);
        orderStatus.setBuyer(buyer);
        orderStatus.setArrived(false);
        orderStatus.setCanceled(false);
        orderStatus.setRequestedToCancel(false);

        orderStatusService.newStatus(orderStatus);

        return ResponseEntity.ok(orderStatus);
    }


    @PutMapping("/confirm-arrived/{orderStatusId}")
    public ResponseEntity<Object> confirmOrderArrived(@PathVariable Long orderStatusId) {
        Optional<OrderStatus> idOrderStatus = orderStatusRepository.findById(orderStatusId);
        if (idOrderStatus.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("Order not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        OrderStatus orderStatus = idOrderStatus.get();
        if (orderStatus.isArrived()) {
            CustomErrorResponse error = new CustomErrorResponse("Order already marked as arrived.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        if (orderStatus.isCanceled()) {
            CustomErrorResponse error = new CustomErrorResponse("Order already canceled.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        PurchaseOrder purchaseOrder = orderStatus.getPurchaseOrder();
        double income = calculateSupplierIncome(purchaseOrder);

        Supplier supplier = getSupplierFromOrder(purchaseOrder);
        updateSupplierBalance(supplier, income);

        orderStatus.setArrived(true);
        orderStatusRepository.save(orderStatus);

        return ResponseEntity.ok("Order with id: " + orderStatusId + " is marked as arrived. Supplier income updated.");
    }

    private double calculateSupplierIncome(PurchaseOrder purchaseOrder) {
        double income = 0.0;
        for (OrderItem orderItem : purchaseOrder.getOrderItems()) {
            double price = orderItem.getProduct().getPrice();
            int orderQuantity = orderItem.getQuantity();
            income += (price * orderQuantity);
        }
        return income;
    }

    private Supplier getSupplierFromOrder(PurchaseOrder purchaseOrder) {
        OrderItem orderItem = purchaseOrder.getOrderItems().get(0);
        return orderItem.getProduct().getSupplier();
    }

    private void updateSupplierBalance(Supplier supplier, double income) {
        double currentBalance = supplier.getSupplierPay().getBalance();
        supplier.getSupplierPay().setBalance(currentBalance + income);
        supplierRepository.save(supplier);
    }


    @PutMapping("/request-cancel/order/{orderStatusId}")
    public ResponseEntity<Object> requestCancelOrder(@PathVariable Long orderStatusId){
        Optional<OrderStatus> idOrderStatus = orderStatusRepository.findById(orderStatusId);
        if(idOrderStatus.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Order not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        OrderStatus orderStatus = idOrderStatus.get();
        if (orderStatus.isRequestedToCancel()){
            CustomErrorResponse error = new CustomErrorResponse("Already requested to cancel.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if (orderStatus.isArrived()){
            CustomErrorResponse error = new CustomErrorResponse("Already arrived.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if (orderStatus.isCanceled()){
            CustomErrorResponse error = new CustomErrorResponse("Already canceled.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        orderStatus.setRequestedToCancel(true);
        orderStatusRepository.save(orderStatus);

        return ResponseEntity.ok(orderStatus);
    }



    @PutMapping("/decline-cancel/order/{orderStatusId}")
    public ResponseEntity<Object> declineCancelOrder(@PathVariable Long orderStatusId){
        Optional<OrderStatus> idOrderStatus = orderStatusRepository.findById(orderStatusId);
        if(idOrderStatus.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Order not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        OrderStatus orderStatus = idOrderStatus.get();
        orderStatus.setRequestedToCancel(false);
        orderStatusRepository.save(orderStatus);

        return ResponseEntity.ok(orderStatus);
    }

    @PutMapping("/accept-cancel/delete/{orderStatusId}/order/{email}")
    public ResponseEntity<Object> finalCancelOrder(@PathVariable Long orderStatusId, @PathVariable String email){
        Optional<OrderStatus> idOrderStatus = orderStatusRepository.findById(orderStatusId);
        if(idOrderStatus.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Order not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        OrderStatus orderStatus = idOrderStatus.get();
        if (orderStatus.isArrived()){
            CustomErrorResponse error = new CustomErrorResponse("Already arrived.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if (orderStatus.isCanceled()){
            CustomErrorResponse error = new CustomErrorResponse("Already canceled.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if (!orderStatus.isRequestedToCancel()){
            CustomErrorResponse error = new CustomErrorResponse("This order is not requested to cancel.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Optional<User> emailUser = userRepository.findByEmail(email);

        if(emailUser.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if(emailUser.get().getBuyer() == null){
            CustomErrorResponse error = new CustomErrorResponse("User is not a buyer.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }


        User user = emailUser.get();
        Buyer buyer = user.getBuyer();

        ShoppPay shoppPay = buyer.getShoppPay();
        PurchaseOrder purchaseOrder = orderStatus.getPurchaseOrder();

        double shoppPayBalance = shoppPay.getBalance();
        double canceledOrderBalance = purchaseOrder.getTotalCost();
        double canceledOrderBalanceByShoppPay = purchaseOrder.getTotalPrice();
        double newBalanceIfShoppPay = (shoppPayBalance + canceledOrderBalanceByShoppPay);
        double newBalance = (shoppPayBalance + canceledOrderBalance);

        if(Objects.equals(purchaseOrder.getPaymentMethod(), "PayPal")){
            shoppPay.setBalance(newBalance);
            shoppPayRepository.save(shoppPay);
        }

        if(Objects.equals(purchaseOrder.getPaymentMethod(), "ShoppPay")){
            shoppPay.setBalance(newBalanceIfShoppPay);
            shoppPayRepository.save(shoppPay);
        }


        orderStatus.setCanceled(true);
        orderStatusRepository.save(orderStatus);

        return ResponseEntity.ok(orderStatus);
    }

    @PutMapping("/force-cancel/{orderStatusId}/order/{email}")
    public ResponseEntity<Object> forceCancelOrder(@PathVariable Long orderStatusId, @PathVariable String email){
        Optional<OrderStatus> idOrderStatus = orderStatusRepository.findById(orderStatusId);
        if(idOrderStatus.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("Order not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        OrderStatus orderStatus = idOrderStatus.get();
        if (orderStatus.isArrived()){
            CustomErrorResponse error = new CustomErrorResponse("Already arrived.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if (orderStatus.isCanceled()){
            CustomErrorResponse error = new CustomErrorResponse("Already canceled.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Optional<User> emailUser = userRepository.findByEmail(email);

        if(emailUser.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        if(emailUser.get().getBuyer() == null){
            CustomErrorResponse error = new CustomErrorResponse("User is not a buyer.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }


        User user = emailUser.get();
        Buyer buyer = user.getBuyer();

        ShoppPay shoppPay = buyer.getShoppPay();
        PurchaseOrder purchaseOrder = orderStatus.getPurchaseOrder();

        double shoppPayBalance = shoppPay.getBalance();
        double canceledOrderBalance = purchaseOrder.getTotalCost();
        double canceledOrderBalanceByShoppPay = purchaseOrder.getTotalPrice();
        double newBalanceIfShoppPay = (shoppPayBalance + canceledOrderBalanceByShoppPay);
        double newBalance = (shoppPayBalance + canceledOrderBalance);

        if(Objects.equals(purchaseOrder.getPaymentMethod(), "PayPal")){
            shoppPay.setBalance(newBalance);
            shoppPayRepository.save(shoppPay);
        }

        if(Objects.equals(purchaseOrder.getPaymentMethod(), "ShoppPay")){
            shoppPay.setBalance(newBalanceIfShoppPay);
            shoppPayRepository.save(shoppPay);
        }

        orderStatus.setRequestedToCancel(true);
        orderStatus.setCanceled(true);
        orderStatusRepository.save(orderStatus);

        return ResponseEntity.ok(orderStatus);
    }


    @GetMapping("/delivered-orders/{email}")
    public List<OrderStatus> getAllOrderStatus(@PathVariable String email){
        Optional<User> emailUser = userRepository.findByEmail(email);
        if(emailUser.isEmpty()){
            throw new IllegalArgumentException("user not found");
        }
        if(emailUser.get().getBuyer() == null){
            throw new IllegalArgumentException("user is not a buyer");
        }
        User user = emailUser.get();
        Buyer buyer = user.getBuyer();

        return orderStatusRepository.findAllByBuyer(buyer);
    }

    @PostMapping("/by-shoppPay/{email}/pay/{orderId}")
    public ResponseEntity<Object> payByShoppPay(@RequestBody PayShoppPayRequestBody payShoppPayRequestBody, @PathVariable Long orderId, @PathVariable String email){
        Optional<User> emailUser = userRepository.findByEmail(email);
        if (emailUser.isEmpty()){
            CustomErrorResponse error = new CustomErrorResponse("User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = emailUser.get();
        Buyer buyer = user.getBuyer();
        ShoppPay shoppPay = buyer.getShoppPay();

        if(!passwordEncoder.matches(payShoppPayRequestBody.getPassword(), shoppPay.getPassword())){
            CustomErrorResponse error = new CustomErrorResponse("Invalid password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Optional<PurchaseOrder> idOrder = orderRepository.findById(orderId);
        if (idOrder.isEmpty()) {
            throw new IllegalArgumentException("Order not found");
        }
        PurchaseOrder paidOrder = idOrder.get();

        if(paidOrder.isPayed()){
            CustomErrorResponse error = new CustomErrorResponse("Order paid.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        paidOrder.setPayed(true);
        paidOrder.setPaymentMethod("ShoppPay");
        paidOrder.setOrderDate(LocalDateTime.now());

        if (paidOrder.getDiscount() == null) {
            double totalCost = paidOrder.getTotalCost();
            double delivery = paidOrder.getTotalDelivery();
            double totalToPay = ( totalCost - delivery );
            double currentShoppPay = buyer.getShoppPay().getBalance();
            double afterPayment = (currentShoppPay - totalToPay);
            buyer.getShoppPay().setBalance(afterPayment);
            paidOrder.setTotalCost(totalToPay);
            buyerRepository.save(buyer);
        }
        else  {
            double totalCost = paidOrder.getTotalCost();
            double currentShoppPay = buyer.getShoppPay().getBalance();
            double afterPayment = (currentShoppPay - totalCost);
            buyer.getShoppPay().setBalance(afterPayment);
            buyerRepository.save(buyer);
        }
        orderRepository.save(paidOrder);

        OrderHistory newHistory = new OrderHistory();

        List<OrderItem> newOrderItems = new ArrayList<>();
        for (OrderItem paidOrderItem : paidOrder.getOrderItems()) {
            OrderItem newOrderItem = new OrderItem();
            newOrderItem.setProduct(paidOrderItem.getProduct());
            newOrderItem.setQuantity(paidOrderItem.getQuantity());
            newOrderItems.add(newOrderItem);
        }
        if (paidOrder.getDiscount() == null){
            newHistory.setTotalCost(paidOrder.getTotalPrice());
        } else {
            newHistory.setTotalCost(paidOrder.getTotalCost());
        }

        newHistory.setOrderItems(newOrderItems);
        newHistory.setOrderDate(paidOrder.getOrderDate());
        newHistory.setBuyer(paidOrder.getBuyer());
        newHistory.setTotalPrice(paidOrder.getTotalPrice());

        newHistory.setPaymentMethod(paidOrder.getPaymentMethod());
        paidOrder.getOrderItems().clear();
        orderHistoryService.newOrderHistory(newHistory);

        return ResponseEntity.ok("Order with id: " + orderId + " is paid. New order history created: " + newHistory);

    }

    @PutMapping("/order-paid/{orderId}")
    public ResponseEntity<Object> setOrderPaid(@PathVariable Long orderId) {
        Optional<PurchaseOrder> idOrder = orderRepository.findById(orderId);
        if (idOrder.isEmpty()) {
            throw new IllegalArgumentException("Order not found");
        }
        PurchaseOrder paidOrder = idOrder.get();
        if(paidOrder.isPayed()){
            CustomErrorResponse error = new CustomErrorResponse("Order paid.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        paidOrder.setPayed(true);
        paidOrder.setPaymentMethod("PayPal");
        orderRepository.save(paidOrder);

        OrderHistory newHistory = new OrderHistory();

        List<OrderItem> newOrderItems = new ArrayList<>();
        for (OrderItem paidOrderItem : paidOrder.getOrderItems()) {
            OrderItem newOrderItem = new OrderItem();
            newOrderItem.setProduct(paidOrderItem.getProduct());
            newOrderItem.setQuantity(paidOrderItem.getQuantity());
            newOrderItems.add(newOrderItem);
        }
        newHistory.setOrderItems(newOrderItems);
        newHistory.setOrderDate(paidOrder.getOrderDate());
        newHistory.setBuyer(paidOrder.getBuyer());
        newHistory.setTotalPrice(paidOrder.getTotalPrice());
        newHistory.setTotalCost(paidOrder.getTotalCost());
        newHistory.setTotalDelivery(paidOrder.getTotalDelivery());
        newHistory.setPaymentMethod(paidOrder.getPaymentMethod());


        paidOrder.getOrderItems().clear();

        orderHistoryService.newOrderHistory(newHistory);

        return ResponseEntity.ok("Order with id: " + orderId + " is paid. New order history created: " + newHistory);
    }

    @GetMapping("/order-history/{email}")
    public List<OrderHistory> getOrderHistory(@PathVariable String email){
        Optional<User> emailUser = userRepository.findByEmail(email);
        if (emailUser.isEmpty()){
            throw new IllegalArgumentException("email not exist");
        }
        User user = emailUser.get();
        return user.getBuyer().getOrderHistory();
    }

    @GetMapping("/order-item/{orderItemId}/product")
    public ResponseEntity<Product> getProductByOrderItemId(@PathVariable Long orderItemId) {
        Product product = productService.getProductByOrderItemId(orderItemId);

        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/order/{orderId}/updateStock/{productId}")
    public ResponseEntity<Object> updateStock(@PathVariable Long orderId, @PathVariable Long productId){
        PurchaseOrder purchaseOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Purchase order not found"));

        Map<Long, Integer> productQuantities = new HashMap<>();
        for (OrderItem orderItem : purchaseOrder.getOrderItems()) {
            Long productID = orderItem.getProduct().getProductId();
            int quantity = orderItem.getQuantity();
            productQuantities.put(productID, productQuantities.getOrDefault(productID, 0) + quantity);
        }

        for (Map.Entry<Long, Integer> entry : productQuantities.entrySet()) {
            Long productID = entry.getKey();
            int quantity = entry.getValue();

            Product product = productRepository.findById(productID)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            int currentStock = product.getStock();
            if (currentStock < quantity) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Insufficient stock for product ID: " + productID);
            }

            product.setStock(currentStock - quantity);
            productRepository.save(product);
        }

        return ResponseEntity.ok("Stock updated successfully");
    }

    @GetMapping("/order-details/{orderId}")
    public  ResponseEntity<PurchaseOrder> getOrderDetails(@PathVariable Long orderId){
        Optional<PurchaseOrder> idOrder = orderRepository.findById(orderId);
        if(idOrder.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(idOrder.get());
    }

    @GetMapping("/all-orders")
    public List<PurchaseOrder> getAllOrders(){
        return orderService.allOrders();
    }

    @GetMapping("/all-order-status")
    public List<OrderStatus> allOrderAndStatus(){
        return orderStatusRepository.findAll();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Product> getOrderById(@PathVariable Long productId) {
        Optional<Product> idProduct = productRepository.findById(productId);
        if (idProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Product product = idProduct.get();
        double averageRating = calculateAverageRating(product.getProductReviews());
        product.setRating(averageRating);
        productRepository.save(product);
        return ResponseEntity.ok(product);
    }
    private double calculateAverageRating(List<ProductReview> productReviews) {
        if (productReviews.isEmpty()) {
            return 0.0;
        }
        int totalRating = 0;
        for (ProductReview review : productReviews) {
            totalRating += review.getRating();
        }
        return (double) totalRating / productReviews.size();
    }


    @GetMapping("/cart/{cartId}")
    public ResponseEntity<List<CartItem>> getAllCartItemsForCart(@PathVariable Long cartId) {
        List<CartItem> cartItems = cartService.getAllCartItemsForCart(cartId);
        return ResponseEntity.ok(cartItems);
    }

    @GetMapping("/cart/email/{email}")
    public ResponseEntity<List<CartItem>> getAllCartItemsByEmail(@PathVariable String email) {
        Optional<User> emailUser = userRepository.findByEmail(email);
        if (emailUser.isEmpty()){
            throw new IllegalArgumentException("user not found");
        }
        User user = emailUser.get();
        Buyer buyer = user.getBuyer();
        Long cartId = buyer.getCart().getCartId();

        List<CartItem> cartItems = cartService.getAllCartItemsForCart(cartId);
        return ResponseEntity.ok(cartItems);
    }

    @DeleteMapping("/clear-items/{cartId}")
    public ResponseEntity<String> deleteAllCartItemsForCart(@PathVariable Long cartId) {
        cartService.deleteAllCartItemsForCart(cartId);
        return ResponseEntity.ok("All cart items deleted for Cart ID: " + cartId);
    }

    @DeleteMapping("/delete-orders/{buyerId}")
    public ResponseEntity<String> deleteOrdersByBuyer(@PathVariable Long buyerId){
        orderService.deleteOrderByBuyerId(buyerId);
        return ResponseEntity.ok("All orders deleted for Buyer: buyer id " + buyerId);
    }

    @DeleteMapping("/delete-history/order/{orderStatusId}")
    public ResponseEntity<String> deleteAnOrderHistory(@PathVariable Long orderStatusId){
        Optional<OrderStatus> idStatus = orderStatusRepository.findById(orderStatusId);
        if (idStatus.isEmpty()){
            throw new IllegalArgumentException("order not found");
        }
        orderStatusService.deleteStatus(orderStatusId);
        return ResponseEntity.ok("order history deleted");
    }

    @DeleteMapping("/cancel-item/{cartItemId}")
    public ResponseEntity<String> deleteAnItemInCart(@PathVariable Long cartItemId){
        Optional<CartItem> idCartItem = cartItemRepository.findById(cartItemId);
        if(idCartItem.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        cartItemRepository.delete(idCartItem.get());
        return ResponseEntity.ok("order item canceled");
    }

    @DeleteMapping("delete-user/{userId}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long userId){
        Optional<User> idUser = userRepository.findById(userId);
        if (idUser.isEmpty()){
            throw new IllegalArgumentException("user not found");
        }

        userService.deleteUserById(userId);
        return ResponseEntity.ok("user deleted");
    }

    @PutMapping("/suspend/{userId}")
    public ResponseEntity<Object> suspendUser(@PathVariable Long userId){
        Optional<User> idUser = userRepository.findById(userId);
        if (idUser.isEmpty()){
            throw new IllegalArgumentException("user not found");
        }
        User user = idUser.get();
        user.setActive(false);
        userService.saveUserNoException(user);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/un-suspend/{userId}")
    public ResponseEntity<Object> unSuspendUser(@PathVariable Long userId){
        Optional<User> idUser = userRepository.findById(userId);
        if (idUser.isEmpty()){
            throw new IllegalArgumentException("user not found");
        }
        User user = idUser.get();
        user.setActive(true);
        userService.saveUserNoException(user);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/review")
    public ResponseEntity<Object> reviewProduct(
            ReviewProductRequestBody reviewProductRequestBody,
            @RequestParam(name = "productId") Long productId,
            @RequestParam(name = "email") String email) {

        Optional<Product> idProduct = productRepository.findById(productId);
        if (idProduct.isEmpty()) {
            CustomErrorResponse error = new CustomErrorResponse("Product not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        Product product = idProduct.get();
        if (product.getProductReviews().stream().anyMatch(
                review -> email != null && email.equals(review.getEmail()))) {
            CustomErrorResponse error = new CustomErrorResponse("Already reviewed.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        ProductReview productReview = new ProductReview();
        productReview.setComment(reviewProductRequestBody.getComment());
        productReview.setRating(reviewProductRequestBody.getRating());
        productReview.setEmail(email);
        productReview.setProduct(product);

        if(reviewProductRequestBody.getReviewImage() == null)
        {
            productReview.setReviewImage(null);
            productReviewRepository.save(productReview);
        }
        else if (reviewProductRequestBody.getReviewImage() != null)
        {
            try {
                productReviewService.newReview(productReview, reviewProductRequestBody.getReviewImage());
            } catch (IOException e) {
                CustomErrorResponse error = new CustomErrorResponse("Failed to upload image.");
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
            }
        }

        product.getProductReviews().add(productReview);
        productRepository.save(product);

        return ResponseEntity.ok(productReview);
    }



    @DeleteMapping("/delete-review/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId){
        Optional<ProductReview> idReview = productReviewRepository.findById(reviewId);
        if (idReview.isEmpty()){
            throw new IllegalArgumentException("review does not exists");
        }
        productReviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted");
    }

    @GetMapping("/reviews/{productId}")
    public List<ProductReview> getAllReviewsForProduct(@PathVariable Long productId){
        Optional<Product> idProduct = productRepository.findById(productId);
        if (idProduct.isEmpty()){
            throw new IllegalArgumentException("product not found.");
        }

        List<ProductReview> productReviews = idProduct.get().getProductReviews();
        return productReviews;
    }

    @PostMapping("/contactUs/send")
    public ResponseEntity<Object> contactUs(@RequestBody ContactMessageRequestBody contactMessageRequestBody){

        ContactMessage contactMessage = new ContactMessage();
        contactMessage.setEmail(contactMessageRequestBody.getEmail());
        contactMessage.setMessage(contactMessageRequestBody.getMessage());

        contactMessageService.saveMessage(contactMessage);
        return ResponseEntity.ok(contactMessage);
    }


    @DeleteMapping("/deleteMessage/{contactId}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long contactId) {
        contactMessageService.deleteMessage(contactId);
        return ResponseEntity.ok("Message deleted successfully");
    }

    @GetMapping("/allContacts")
    public List<ContactMessage> findAllContacts(){
        return contactMessageService.allMessages();
    }

    @GetMapping("/calculate-master-profit")
    public ResponseEntity<Double> calculateMasterProfit() {
        double masterProfit = shoppProfitService.calculateAndUpdateMasterProfit();
        return ResponseEntity.ok(masterProfit);
    }

}
