hOME PAGE PROMPT

Design a   screen for and ecommerce web app in @page.tsx
it has to have all below sections in the given order
1.Header(Logo and login button)
2.Hero Section ( About project) with full width image with text Overlay
3.Testimonials(Reviews)
4.Footer

Use default theme  from  @global.css
Header background should be theme primary color and logo must be white    
Project title should be Wasan Shopee
=============================================================================================
LOGIN & REGISTER
follow shadcn form docs from https://ui.shadcn.com/docs/forms/react-hook-form and build the register form. 
UI must be simple
The background should be white and the form should be centered horizontally and vertically.
the on submit should log the form data to the console in json format. 

Fields are name email mobile number and password

the register form should have links to login at the bottom and home at the top

taking referance from @register/page.tsx build the login page .The two fileds should be email and password.
submit button should console log the data in json format
also add a select component with two value user and admin
the login page should have links to register at the bottom and home at the top 



@user.ts now integrate the regiserNewUser service,disable the button when it is processing,afer success or failure show toast message using shadcn sonner and navigate to login page after sucessfull registration

Now lets us completer the login process. Validate the credentials username password and role  and return db user record if success 
navigate to user/products or admin/dashboard based on the user role

===================================================================================================

https://www.google.com/search?client=opera&q=CLAUDE+SKILL.MD+FOR+NEXT+JS+16&sourceid=opera&ie=UTF-8&oe=UTF-8
=================================================================================================================


LAYOUTS

@page.tsx now build ui for private layout header,it should have project logo at the left and a lucid react menu icon at right.take home screen as referance
logo should be extreme left and icon should be complete right

========================================================================

Get user private-layout.tsx
@user-store.ts @users.ts fetch and store the info of currentuser in usersstore,if it is not present.
if get current user throws error, remove all data from cookies local storage and navigate to login.
handle loading state also
header.tsx
Show the logged in user name next to the button component

======================================================================================
header.tsx
@menu-items.tsx, sheet.tsx
when we click the menu icon,it has to show menu items in a shadcn sheet component.show items based on the role 

now as per menu items navigation, create all the routes pages with empty component,just show the component name

https://nextjs.org/docs/app/getting-started/proxy
Follow the next js proxy and middleware and write logic for protecting the private routes. 
if a route strats with /user or /admin then it is a private route and All these routes must be accessed only after authentication
================================================================================================
CATEGORIES
complete categories crud services @interfaces/index.ts
addCategory
getCategoryById
editCategoryById
getAllCategories
deleteCategory

Now build the category_form.tsx inside @_componennts folder.It hasto be a dialog and it has to open when we click add category button.also integrate the add category service. don't write anything extra

==============================================================================================
PRODUCTS
now complete the products services curd,take categories as referance

complete uploadFileAndReturnUrl in @uploads.ts supabase bucket name is shop_products

now build product_form.tsx inside @_componennts folder.It hasto be a dialog and it has to open when we click add product button. just like the category don't write anything extra @category-form @interfaces/index.ts

==========================================================================
Display All Products User Page
@products.ts now fetch and show the products using tailwind grid.show four products in a row. it has to be responsive.when we click the product it has to show the product details in a dialog. make product-card as a  seperate component and use it in the products page.  do not do anything extra

now build the filter component .I need category filter sort by (high to low and low to high) filter. all add search functionality. just above the products grid in a row . 

 
filters has to be server side. Use  getAllProductsWithFilters in @products.ts for implementing the functionality. Do not do anything extra and revert back for any clarifications

now let us build cart-store.ts.It should have cartitems, addCartItems, Remove CartItems, edit cart quantity and clear Cart. when cartitem is added /  removed / edited / cleared, it should show a toast notification 

next to the user show cart icon.If the cart is empty show just the cart icon.if the cart is not empty show the cart icon with the count of items in the cart

now in the product cart integrate cart-store actions

add a cart page to show the product details and summary on the right. The cart page should open when we click the cart icon on the header

above the checkout button,show address selection dropdown or any picker to select the address



=================================================================================

generte IOrder from the shop-order sql table

now let us complete services for orders module
createOrder
getOrdersOfUser
getOrderById
getAllOrders
updateOrderById
deleteOrder
