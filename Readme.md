# EcommerceHub

## Information
This is a demonstration repository showcasing basic Ecommerce-like functionality through simple APIs.

## Prerequisites
Have the env file placed in the project directory of your machine with the following details:
| Parameter | Description                |Example                |
| :-------- | :------------------------- | :------------------------- |
| `PORT` | Port for running the server | 3001
| `MONGODB_URI` | MongoDB Connection URI | mongodb://localhost/ecommerce
| `JWT_SECRET` | Secret to be used for JWT authentication | your_secret
| `ADMINS` | Comma separated emails which you want to be admins | test@gmail.com,test2@gmail.com
| `NTH_ORDER` | Number of orders after which a coupon would be applied | 5

## Local Dev Server
To run the backend server:
```bash
$npm install
$npm run dev
```

## API Reference

#### Register new user
```http
POST /auth/signup
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Email Id of the user |
| `password` | `string` | **Required**. Password for the user |

#### Logout user from current session
```http
POST /auth/logout
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain Bearer token |

#### Login user
```http
POST /auth/login
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Email Id of the user |
| `password` | `string` | **Required**. Password of the user |

#### Fetch information of logged-in user
This will be used to fetch details of the logged-in user

```http
GET /user/me
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain Bearer token |

#### Add to Cart
This will be used to items to the cart of an user

```http
POST /user/add-to-cart
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain  Bearer token |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `items` | `array` | **Required**. Array of objects detailing item information |
| `items.id` | `array` | **Required**. ID of the item |
| `items.name` | `array` | **Required**. Name of the item |
| `items.quantity` | `array` | **Required**. Quantity of item |
| `items.amount` | `array` | **Required**. amount of a single item |


#### Checkout
This will be used to checkout with the current items in the cart

```http
GET /orders/checkout
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain Bearer token |

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `discount_code` | `number` | Discount code if any |

#### **ADMIN APIs**: Generate Discount Code
This will be used to generate a discount code for the system

```http
POST /admin/generate-discount-code
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain Bearer token |

#### **ADMIN APIs**: Fetch Total Orders Stats
This will be used to fetch stats of all orders in the system

```http
GET /admin/order_details
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain  Bearer token |

#### Fetch All Orders of the logged in user
This will be used to fetch all orders of an user

```http
GET /orders
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain Bearer token |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `number` | Pagination number |
| `limit` | `number` | Pagination limit |

#### Get Order Info
This will be used to fetch information of a single order

```http
GET /orders/:id
```
| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain Bearer token |

| Path Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `string` | **Required**. The ID of the order |

#### Logout user from current session
This will be used to log out the user from current session

```http
POST /auth/logout
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain  Bearer token |

#### Logout user from all sessions
This will be used to log out the user from all sessions

```http
POST /auth/logoutall
```

| Header | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**. Should contain  Bearer token |

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.