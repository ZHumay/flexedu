const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const moment = require("moment");
const { findByIdAndUpdate } = require("../models/userModel");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let privateKey = "ironmaiden"

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: 'login',
        user: "c8657545@gmail.com",
        pass: "bcozssymjajpqicg",
    },
});

function sendConfirmEMail(to, code) {
    transporter.sendMail({
        from: 'c8657545@gmail.com',
        to: to,
        subject: "Confirm Code",
        text: "Your confirm code: " + code,
    });
}

const get_register = async (req, res) => {
  res.send("Hello from the register page !!");
};

const post_register = async (req, res) => {
    const { name, email, password, cPassword } = req.body;
  
    try {
      const isEmail = await userModel.findOne({ email: email });
  
      if (!isEmail) {
        if (password === cPassword) {
          let confirmCode = Math.floor(Math.random() * 10000);
          let codeExpire = moment().add("59", "s");
          const salt = bcrypt.genSaltSync();
          const hashedPassword = bcrypt.hashSync(password, salt);
          
          const registerUser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            cPassword: hashedPassword,
            code: confirmCode,
            codeExpire: codeExpire,
            isAdmin: email === 'zehmetihumay@gmail.com'
          });
  
          sendConfirmEMail(email, confirmCode);
          res.status(200).json({
            user: registerUser,
            msg: "User Created Successfully !!",
            email: email,
            confirmCode: confirmCode,
          });
        } else {
          console.log("Password does not match!!");
          return res.status(400).json({ msg: "Password does not match!!" });
        }
      } else {
        console.log("Email already exists!!");
        return res.status(400).json({ msg: "Email already exists!!" });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ msg: "Something went wrong", error: error.message });
    }
  };
  

const confirm = async (req, res) => {
    try {
        let code = req.body.code;
        let email = req.body.email;

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ "confirm code error:!": "Kullanıcı bulunamadı" });
        }

        if (user.codeCounter === 0) {
            return res.status(500).json({ "message": "BLOCK!!" });
        }

        if (user.code !== code) {
            user.codeCounter = user.codeCounter - 1;
            await user.save();
            return res.status(404).json({ "confirm code error:!": "Kalan hakkınız " + user.codeCounter });
        }

        if (user.codeExpire <= moment()) {
            return res.status(500).json({ "message": "Expire Date Error!" });
        }

        let token = jwt.sign(email, privateKey);
        user.isActive = true;
        user.codeCounter = 3;
        await user.save();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ "message": "Server error", error: error.message });
    }
};

const get_login = async (req, res) => {
  res.send("Hello from the login page !!");
};

const post_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isEmailMatched = await userModel.findOne({ email: email });

    if (isEmailMatched) {
      const isPasswordMatched = await bcrypt.compareSync(
        password,
        isEmailMatched.password
      );

      if (isPasswordMatched) {
        const token = jwt.sign(
          { _id: isEmailMatched._id },
          process.env.SECRET_KEY
        );

        if (token) {
          res
            .status(200)
            .json({
              msg: "Login Successfull !!",
              user: isEmailMatched,
              token: token,
            });
        } else {
          res.json({ msg: "token, not generated, please login first !!" });
        }
      } else {
        res.json({ msg: "Password does not matched" });
      }
    } else {
      res.json({ msg: "Email not found !!" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const get_all_users = async (req, res) => {
  try {
    const users = await userModel.find({});

    if (users) {
      res.status(200).json({ users: users });
    } else {
      res.json({ msg: "Users not found" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const get_user = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await userModel.findById(id);

    if (user) {
      res.status(200).json({ user: user });
    } else {
      res.json({ msg: "user not found" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const update_user = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const updateUser = await userModel.findOneAndUpdate(email, {
      name: name,
      email: email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
      cPassword: bcrypt.hashSync(password, bcrypt.genSaltSync()),
    });

    if (updateUser) {
      res.status(200).json({ msg: "Update Successfull!!", user: updateUser });
    } else {
      res.json({ msg: "user not updated" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const delete_user = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteUser = await userModel.findByIdAndDelete(id);

    if (deleteUser) {
      res
        .status(200)
        .json({ msg: "user deleted successfully !!", user: deleteUser });
    } else {
      res.json({ msg: "user not deleted !!" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const verify_user = async (req, res) => {
  try {
    if (req.body.token) {
      const token = req.body.token;

      const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

      if (verifyToken) {
        res.status(200).json({ msg: "User is verified", isAuth: true });
      } else {
        res.json({ msg: "Login first !!", isAuth: false });
      }
    } else {
      res.json({ msg: "Token not found" });
    }
  } catch (error) {
    res.json({ msg: error.message, isAuth: false });
  }
};

const active_user = async (req, res) => {
  try {
    const token = req.body.token;

    const user = jwt.verify(token, process.env.SECRET_KEY);

    if (user) {
      const activeUser = await userModel.findById(user._id);

      if (activeUser) {
        res.status(200).json({ user: activeUser });
      } else {
        res.json({ msg: "Please login" });
      }
    } else {
      res.json({ msg: "Please login" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ msg: "Please login" });
  }
};

const update_profile_image = async (req, res) => {
  try {
    const file = req.files.profileImage;

    const userId = req.params.id;

    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      try {
        if (result) {
          const updateUser = await userModel.findByIdAndUpdate(userId, {
            profileImage: result.url,
          });

          if (updateUser) {
            res
              .status(200)
              .json({ msg: "Profile Update successfully", user: updateUser });
          } else {
            res.json({ msg: "Something wents wrong" });
          }
        } else {
          res.json({ msg: "Something wents wrong" });
        }
      } catch (error) {
        res.json({ msg: error.message });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ msg: error.message });
  }
};

const get_basketItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Get the basket items from the user object
    const basketItems = user.basketItem;

    return res.status(200).json({ basketItems });
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};
const get_favItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Get the basket items from the user object
    const favItems = user.favItem;

    return res.status(200).json({ favItems });
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};

const get_orderItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Get the basket items from the user object
    const orderItems = user.orders;

    return res.status(200).json({ orderItems});
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};

const post_basketItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Extract the new basket item from the request body
    const { newItem } = req.body;

    // Add the new item to the user's basketItem array
    user.basketItem.push(newItem);

    // Save the updated user to the database
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser.basketItem);
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};

const post_favItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Extract the new basket item from the request body
    const { newItem } = req.body;

    // Add the new item to the user's basketItem array
    user.favItem.push(newItem);

    // Save the updated user to the database
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser.favItem);
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};
const post_orderItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Extract the new basket item from the request body
    const newItem  = req.body;

    // Add the new item to the user's basketItem array
    user.orders.push(newItem);

    // Save the updated user to the database
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser.orders);
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};

const delete_basketItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the item to delete from the request body
    const { itemToDelete } = req.body;

    // Remove the item from the user's basketItem array
    user.basketItem = user.basketItem.filter((item) => item._id.toString() !== itemToDelete._id.toString());

    // Save the updated user to the database
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser.basketItem);
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};

const delete_favItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the item to delete from the request body
    const { itemToDelete } = req.body;

    // Remove the item from the user's basketItem array
    user.favItem = user.favItem.filter((item) => item._id.toString() !== itemToDelete._id.toString());

    // Save the updated user to the database
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser.favItem);
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};

const update_basketItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the updated basket items from the request body
    const { updatedItems } = req.body;

    // Update the basket items in the user's basketItem array
    user.basketItem = updatedItems;

    // Save the updated user to the database
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser.basketItem);
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};

const update_FavItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the updated basket items from the request body
    const { updatedItems } = req.body;

    // Update the basket items in the user's basketItem array
    user.favItem = updatedItems;

    // Save the updated user to the database
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser.favItem);
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};

const forgetpassword= async (req, res) => {
  const email = req.body.email;
  try {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return res.status(404).json("email bulunamadi");
    }
  
    await findUser.save();
    transporter.sendMail({
      from: "c8657545@gmail.com", // sender address
      to:email, // list of receivers
      subject: "Change password: ", // Subject line
      html: `
                 
                  <p> 
                  <a href="http://localhost:3000/changepassword?userId=${findUser._id}">
                  Reset password
                  </a>
                  </p>
              `,
    });
    return res.status(200).json("okay")
  } catch (error) {
      console.log(error);
  }
}

// İlgili kütüphanelerin importları

const changepassword = async (req, res) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;

  try {
    // Kullanıcının kimliğini kullanarak kullanıcıyı bul
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json("Kullanıcı bulunamadı");
    }

    // Yeni şifreyi bcrypt ile hash'le
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Kullanıcının şifresini güncelle
    user.password = hashedPassword;
    user.cPassword = hashedPassword;

    // Kullanıcıyı kaydet
    await user.save();

    return res.status(200).json("Şifre değiştirildi");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Sunucu hatası");
  }
};



const getAllOrderItems = async (req, res) => {
  try {
    // Tüm kullanıcıları bulun
    const users = await userModel.find();

    // Her kullanıcının siparişlerini alın
    const orderItems = [];
    users.forEach(user => {
      orderItems.push(...user.orders);
    });

    return res.status(200).json({ orderItems });
  } catch (error) {
    // İşlem sırasında oluşan hataları yönetin
    return res.status(500).json({ message: "Internal server error" });
  }
};




const postAllOrderItems = async (req, res) => {
  try {
    const userId = req.params.id;
    const { orderDetails } = req.body;

    // Kullanıcıyı bulun
    const user = await userModel.findById(userId);

    // Kullanıcı yoksa hata döndürün
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Siparişi kullanıcının siparişlerine ekleyin
    user.orders.push(orderDetails);

    // Kullanıcıyı kaydedin
    await user.save();

    return res.status(201).json({ message: "Sipariş başarıyla eklendi" });
  } catch (error) {
    return res.status(500).json({ message: "İç sunucu hatası" });
  }
};






const deleteAllorderItems = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderId = req.params.orderId;

    // Kullanıcıyı bulun
    const user = await userModel.findById(userId);

    // Kullanıcı yoksa hata döndürün
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Siparişi kullanıcının siparişlerinden çıkarın
    const index = user.orders.findIndex(order => order.id === orderId);

    if (index === -1) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    user.orders.splice(index, 1);

    // Kullanıcıyı kaydedin
    await user.save();

    return res.status(200).json({ message: "Sipariş başarıyla silindi" });
  } catch (error) {
    return res.status(500).json({ message: "İç sunucu hatası" });
  }
}



const updateAllorderItems = async (req, res) => {
  try {
    // Get the user ID from the request parameters or wherever it's stored
    const userId = req.params.id;

    // Find the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the updated basket items from the request body
    const { updatedOrders } = req.body;

    // Update the basket items in the user's basketItem array
    user.orders = updatedOrders;

    // Save the updated user to the database
    const updatedUser = await user.save();

    return res.status(200).json(updatedUser.orders);
  } catch (error) {
    // Handle any errors that might occur during the process
    return res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = {
  get_login,
  get_register,
  post_login,
  post_register,
  get_all_users,
  get_user,
  update_user,
  delete_user,
  verify_user,
  active_user,
  update_profile_image,
  confirm,
  get_basketItems,
  post_basketItems,
  delete_basketItems,
  update_basketItems,
  post_orderItems,
  get_orderItems,
  changepassword,
  forgetpassword,
  get_favItems,
  post_favItems,
  delete_favItems,
  update_FavItems,
  getAllOrderItems,
  postAllOrderItems,
  deleteAllorderItems,
  updateAllorderItems
};