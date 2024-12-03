




# # Housing Rental Platform

## Project Overview

The **Housing Rental Platform** is a blockchain-based application designed to streamline property rentals for **owners** and **tenants**. The platform facilitates property listing, property rental proposal, tenant agreements, and fee management, offering a seamless experience for both parties.  

---

## Features

### Common Features

- **Register/Login**: Role-based authentication for Owners and Tenants.  

### Owner-Specific Features

- **Property Management**:  
  - Add, edit, delete, or hide property listings.  
  - Include essential property information such as address, owner id, contact, and property image.  
- **Proposal Management**:  
  - View and manage proposal statuses (can approve or reject proposal if it is in pending status).  
- **Tenant Management**:  
  - View tenants, proposals, and fee details per tenant that related to currrent owner.  
- **Agreement Management**:
  - Review and sign agreements.
- **Fee Listing**:  
  - View fee statuses (Paid, Pending).  

### Tenant-Specific Features

- **Property Browsing**:  
  - View and filter property listings.  
- **Proposal Submission**:  
  - Submit property rental proposals.  
  - Manage proposal statuses (change status from pending to cancelled).  
- **Agreement Management**:  
  - Review and sign agreements after owner signed.  
  - Pay deposit.
  - Receive returned deposit after agreement end.
- **Fee Management**:  
  - Pay pending fees and view payment history.  



---

## Notes

**Rental Agreement**:

- Auto generated once the proposal is approved.
- Include deposit payment and return.
- Automatic expiration for unsigned agreements after 7 days.
- The agreement status will changed to completed if deposit is returned.

---
