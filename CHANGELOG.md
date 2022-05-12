# Ghost Market underlying SDK API changelog

Ghost Market is constantly innovating. This means the underlying API that this SDK aims to solve will be undergoing changes along the way. The intent of this document is to lay out the roadmap that this SDK will cover across different versions based on knowledge at the current point in time.

## v1

### User Information
 
* User details - GET - `/api/v1/users`
* Check user exists - GET - `/api/v1/userexists`
 
### Marketplace Information
 
* Discover and Search collections - GET - `/api/v1/collections`
* Discover and Search series - GET - `/api/v1/series`
* List and Search available assets - GET - `/api/v1/assets`
* Marketplace statistics - GET - `/api/v1/statistics`
* Track events across the Ghost Marketplace - GET - `/api/v1/events`
* NFT Token URI - GET - `/api/v1/tokenuri`
* NFT metadata - GET - `/api/v1/metadata`
* Trigger NFT metadata refresh - GET - `/api/v1/refreshmetadata`
 
### Order Management
 
* ~~List and search open orders - GET - `/api/v1/openorders`~~
* Create an order - POST - `/api/v1/createopenorder`
* Remove open order - POST - `/api/v1/deleteopenorder`
* List open orders - GET - `/api/v1/getopenorders`
 
### NFT Mint Management
 
* Create Mint - POST - `/api/v1/createopenmint`
* Delete Mint -  POST - `/api/v1/deleteopenmint`
* ~~List open mints - GET - `/api/v1/openmintings`~~
* List open mints - GET - `/api/v1/getopenmintings`


## v2
 
### User Management
 
* Create User - POST - `/api/v1/createuser`
* Delete User - POST - `/api/v1/deleteuser`
* Add Crypto Address - POST - `/api/v1/addaddress`
* Remove Crypto Address - POST - `/api/v1/removeaddress`
* Edit User Details - POST - `/api/v1/edituser`
 
### Referrals
* Referal Endpoint - POST
 
## Not included
 
### Developer endpoints
 
* Moderator edit tools - POST
* Blacklist tools - POST
* Development Info - GET
* Development Metrics - GET
* Developer Statistics - GET
* Manage platform and users - POST
* Lock - GET
* Unlock - POST
 
### GmSupply
 
* Supply of supported chains - GET - `/api/v1/GmSupply`
* Total supply of supported chains - GET - `/api/v1/GmTotalSupply`
* Circulating supply of supported chains - GET - `/api/v1/GmCirculatingSupply`
 
### NFT Mint Management
 
* Indicate mint is full - GET - `/api/v1/openmintingsfull`

 
## Deprecated
 
### User Management
 
* Create/Edit User - POST
* Add Address - POST
* Remove Address - POST
* Verify User - POST
