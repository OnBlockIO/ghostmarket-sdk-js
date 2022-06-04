# GhostMarket underlying SDK API changelog

GhostMarket is constantly innovating. This means the underlying API that this SDK aims to help with will be undergoing changes along the way. The intent of this document is to lay out the roadmap that this SDK will cover across different versions based on knowledge at the current time.

## v1

### User Information
 
* Discover and Search users - GET - `/api/v1/users`
* Check user exists - GET - `/api/v1/userexists`
* Create User - POST - `/api/v1/createuser`
* Delete User - POST - `/api/v1/deleteuser`
* Add Crypto Address - POST - `/api/v1/addaddress`
* Remove Crypto Address - POST - `/api/v1/removeaddress`
* Edit User Details - POST - `/api/v1/edituser`
 
### Marketplace Information
 
* Discover and Search collections - GET - `/api/v1/collections` - deprecated
* Discover and Search series - GET - `/api/v1/series`
* Discover and Search assets - GET - `/api/v1/assets` - deprecated
* Discover and Search events - GET - `/api/v1/events`
* Marketplace statistics - GET - `/api/v1/statistics`
* NFT Token URI - GET - `/api/v1/tokenuri`
* NFT metadata - GET - `/api/v1/metadata`
* NFT metadata refresh trigger - GET - `/api/v1/refreshmetadata`
 
### Order Management
 
* Create an order - POST - `/api/v1/createopenorder`
* List open orders - GET - `/api/v1/getopenorders`
 
### NFT Open Mint Management
 
* List open mints - GET - `/api/v1/getopenmintings`

### GmSupply
 
* Supply of supported chains - GET - `/api/v1/GmSupply`
* Total supply of supported chains - GET - `/api/v1/GmTotalSupply`
* Circulating supply of supported chains - GET - `/api/v1/GmCirculatingSupply`


## v2

* Discover and Search collections - GET - `/api/v2/collections`
* Discover and Search assets - GET - `/api/v2/assets`




 
## Not included

### Referrals

* Referal Endpoint - POST
 
### Developer endpoints
 
* Moderator edit tools - POST
* Blacklist tools - POST
* Development Info - GET
* Development Metrics - GET
* Developer Statistics - GET
* Manage platform and users - POST
* Lock - GET
* Unlock - POST

 
## Deprecated
