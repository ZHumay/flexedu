import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useActiveUserContext } from "../../context/activeUserContext";
import axios from "axios";
import "./productspage.css";
import { useAdminContext } from "../../context/AdminContext";
import PageNotFound from "../../Pages/PageNotFound/PageNotFound";

function ProductsPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { activeUser } = useActiveUserContext();
  const [order, setOrders] = useState([]);
  const {admin}=useAdminContext()

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`api/auth/orderItems`);
      console.log(res.data.orderItems);
      setOrders(res.data.orderItems);
      setIsLoading(false);
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `api/auth/users/${editedProduct.userId}/orders/:orderId`
      ); // Ürünü sil
      fetchOrders(); // Silme işlemi sonrası verileri yeniden al
      setOpen(false);
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };
  const updateProduct = async () => {
    try {
      await axios.put(
        `api/auth/users/${editedProduct.userId}/orders/${editedProduct.postId}`, // Use userId from editedProduct
        editedProduct
      ); // Ürünü güncelle
      fetchOrders(); // Güncelleme işlemi sonrası verileri yeniden al
      setEditOpen(false);
      setEditedProduct({});
      setSelectedRowId(null);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleEditOpen = (params) => {
    setEditedProduct({
      ...params.row,
      postId: params.row.postid, // Add postId to editedProduct
      userId: params.row.userid, // Add userId to editedProduct
    });
    setSelectedRowId(params.id);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditedProduct({});
    setSelectedRowId(null);
  };

  const handleEditSave = () => {
    updateProduct(editedProduct);
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 218,
      headerClassName: "custom-header",
      cellClassName: "custom-data-cell",
    },
    {
      field: "price",
      headerName: "Price",
      width: 218,
      headerClassName: "custom-header",
      cellClassName: "custom-data-cell",
    },
    {
      field: "image",
      headerName: "Image",
      headerClassName: "custom-header",
      width: 218,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.title}
          style={{ width: "60px", height: "67px", marginLeft: "-13px" }}
        />
      ),
    },

    {
      field: "count",
      headerName: "Count",
      width: 218,
      headerClassName: "custom-header",
      cellClassName: "custom-data-cell",
    },
    {
      field: "address",
      headerName: "Address",
      width: 218,
      headerClassName: "custom-header",
      cellClassName: "custom-data-cell",
    },

    {
      field: "userid",
      headerName: "UserId",
      width: 218,
      headerClassName: "custom-header",
      cellClassName: "custom-data-cell",
    },
    {
      field: "postid",
      headerName: "PostId",
      width: 218,
      headerClassName: "custom-header",
      cellClassName: "custom-data-cell",
    },

    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   headerClassName: "custom-header",
    //   width: 150,
    //   renderCell: (params) => (
    //     <div>
    //       <Button variant="outlined" color="error" onClick={handleOpen}>
    //         Delete
    //       </Button>
    //       <Dialog
    //         style={{ backgroundColor: "white" }}
    //         open={open}
    //         onClose={() => setOpen(false)}
    //         aria-labelledby="alert-dialog-title"
    //         aria-describedby="alert-dialog-address"
    //       >
    //         <DialogTitle id="alert-dialog-title">
    //           {"Are you sure you want to delete?"}
    //         </DialogTitle>
    //         <DialogContent></DialogContent>
    //         <DialogActions>
    //           <Button onClick={() => setOpen(false)}>Disagree</Button>
    //           <Button onClick={() => deleteProduct(params)} autoFocus>
    //             Agree
    //           </Button>
    //         </DialogActions>
    //       </Dialog>
    //     </div>
    //   ),
    // },
    // {
    //   field: "edit",
    //   headerName: "Edit",
    //   headerClassName: "custom-header",
    //   width: 120,
    //   renderCell: (params) => (
    //     <Button variant="outlined" onClick={() => handleEditOpen(params)}>
    //       Edit
    //     </Button>
    //   ),
    // },
  ];
  console.log(order);
  const rows = [];
  order.forEach((orderItem) => {
    orderItem.items.forEach((item, index) => {
      let uniqueKey = Math.floor(Math.random() * 10000);
      rows.push({
        id: uniqueKey,
        userid:orderItem.id,
        count: item.productcountinbasket,
        title: item.title,
        price: item.price,
        image: item.postImage,
        postid: item.postid,
        address: orderItem.address,
      });
    });
  });

  return (
    <>
    {

      admin ? (
        <>
         {isLoading ? (
        <CircularProgress />
      ) : (
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            rowHeight={70}
          />
        </div>
      )}
        </>
        
      ) :(<PageNotFound/>)
    }
     
{/* 
      <Dialog
        style={{ margin: "30" }}
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-address"
      >
        <DialogTitle id="edit-dialog-title">Edit Product</DialogTitle>
        <DialogContent style={{ margin: "30px", padding: "50px" }}>
          <TextField
            label="Title"
            value={editedProduct.title || ""}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, title: e.target.value })
            }
          />
          <TextField
            label="Price"
            value={editedProduct.price || ""}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, price: e.target.value })
            }
          />

          <TextField
            style={{ marginTop: "0px" }}
            label="Address"
            value={editedProduct.address || ""}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                address: e.target.value,
              })
            }
          />

          <TextField
            style={{ marginTop: "20px" }}
            label="Count"
            value={editedProduct.count || ""}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                count: e.target.value,
              })
            }
          />

          <TextField
            style={{ marginTop: "20px",width:210 }}
            label="UserId"
            value={editedProduct.userId || ""}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                userId: e.target.value,
              })
            }
          />

          <TextField
            style={{ marginTop: "20px",width:210 }}
            label="PostId"
            value={editedProduct.postId || ""}
            onChange={(e) =>
              setEditedProduct({
                ...editedProduct,
                postId: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
}

export default ProductsPage;
