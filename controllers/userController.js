const ErrorHander = require("../utils/errorhandler");
const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken")
const cloudinary = require("cloudinary");





//Register a user
exports.registerUser = catchAsyncError(async (req,res,next) => {
   

      const { name,phone,password } = req.body;


      
      
      const isUser = await User.findOne({ phone });
      if (isUser) {
        return next(new ErrorHander("User already exists", 403));
      }else{
    
      const user = await User.create({
        name,
        phone,
        password,
      });

   

     
      
      sendToken(user, 201, res);
    }
})


//Verify OTP
exports.verifyRegisterOtp = catchAsyncError(async (req,res,next) => {
    try {
        
        const aotp ="1111";
        const otp = req.body.otp;
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHander("Invalid User", 401));
          }


          
          if(otp == aotp){
            await User.findByIdAndUpdate(req.user.id, 
            {$set: {role:'admin',verified:true}})
            res.status(200).json({
                success: true,
                message: `Your ${user.phone} verified successfully`,
              });
          }else {
            res.status(404).json({
              success: false,
              message: `Invalid OTP!!!!`,
            });
          }

          
    } catch (error) {
    res.status(400).json({ verified: false, msg: "Something went wrong ...." });
        
    }
})



//Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return next(new ErrorHander("Please Enter Phone Number and Password", 400));
  }

  const user = await User.findOne({ phone }).select("+password");
  if (!user) {
    return next(new ErrorHander("Invalid Phone Number or Password", 401));
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHander("Invalid Phone Number or Password", 401));
  }

  sendToken(user, 200, res);
});



//Add Manager

exports.addManager = catchAsyncError(async (req,res,next) => {
    let avatar = [];
    if (typeof req.body.avatar === "string") {
        avatar.push(req.body.avatar);
      } else {
        avatar = req.body.avatar;
      }
      const imagesLinks = [];
      for (let i = 0; i < avatar.length; i++) {
        const result = await cloudinary.v2.uploader.upload(avatar[i], {
          folder: "User",
        });
    
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    
      req.body.avatar = imagesLinks;
      const user = await User.create(req.body);
    
      res.status(201).json({
        success: true,
        user,
      });
})


//Get all Manager without pagination

exports.getAllManager = catchAsyncError(async (req, res, next) => {
  const user = await User.find({clubName:req.params.clubName}&&{role:"manager"});
  res.status(200).json({
    success: true,
    user,
  });
});


//Get Manager Details

exports.getManagerDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHander("This User is not found", 404));
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });


  //Get All Manager --ADMIN
exports.getAdminManager = catchAsyncError(async (req, res, next) => {
    const user = await User.find({role:"manager"});
  
    res.status(200).json({
      success: true,
      user,
    });
  });
  
  //Update manager --Admin
  exports.updateManager = catchAsyncError(async (req, res, next) => {
    let user = await User.findById(req.params.id);
  
    if (!user) {
      return next(new ErrorHander("user not found", 404));
    }
  
    //Update Cloudinary Images
    let avatar = [];
    if (typeof req.body.avatar === "string") {
        avatar.push(req.body.avatar);
    } else {
        avatar = req.body.avatar;
    }
  
    if (avatar !== undefined) {
      // Deleting images from Cloudinary
      for (let i = 0; i < user.avatar.length; i++) {
        await cloudinary.v2.uploader.destroy(user.avatar[i].public_id);
      }
  
      const imagesLinks = [];
      for (let i = 0; i < avatar.length; i++) {
        const result = await cloudinary.v2.uploader.upload(avatar[i], {
          folder: "user",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.avatar = imagesLinks;
    }
  
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      user,
      message: "User Updated Successfully",
    });
  });
  
  //Delete Manager ---Admin
  exports.deleteManager = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(new ErrorHander("user not found", 404));
    }
  
    // Deleting images from Cloudinary
    for (let i = 0; i < user.avatar.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        user.avatar[i].public_id
      );
    }
  
    await user.remove();
  
    res.status(200).json({
      success: true,
      message: "user Deleted Successfully",
    });
  });
  
  // //Delete Manager ---Admin
  // exports.removeManager = catchAsyncError(async (req, res, next) => {
  //   const user = await User.findById(req.params.id);
  
  //   if (!user) {
  //     return next(new ErrorHander("user not found", 404));
  //   }
  //   const name = user.name;
  //   await User.updateOne(
  //     { _id: req.params.id },
  //     { $set: { isRemoved: true } }
  //   );
  
  //   res.status(200).json({
  //     success: true,
  //     message: `Successfully deleted user ${name}`,
  //   });
  // });



  //Add Player

exports.addPlayer = catchAsyncError(async (req,res,next) => {
    let avatar = [];
    if (typeof req.body.avatar === "string") {
        avatar.push(req.body.avatar);
      } else {
        avatar = req.body.avatar;
      }
    
      const imagesLinks = [];
      for (let i = 0; i < avatar.length; i++) {
        const result = await cloudinary.v2.uploader.upload(avatar[i], {
          folder: "User",
        });
    
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    
      req.body.avatar = imagesLinks;
      const user = await User.create(req.body);
    
      res.status(201).json({
        success: true,
        user,
      });
})


//Get all Player without pagination

exports.getAllPlayer = catchAsyncError(async (req, res, next) => {
  const user = await User.find({clubName:req.params.clubName}&&{role:"player"});
  res.status(200).json({
    success: true,
    user,
  });
});


//Get Player Details

exports.getPlayerDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(new ErrorHander("This User is not found", 404));
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });


  //Get All Player --ADMIN
exports.getAdminPlayer = catchAsyncError(async (req, res, next) => {
    const user = await User.find({role:"player"});
  
    res.status(200).json({
      success: true,
      user,
    });
  });
  
  //Update Player --Admin
  exports.updatePlayer = catchAsyncError(async (req, res, next) => {
    let user = await User.findById(req.params.id);
  
    if (!user) {
      return next(new ErrorHander("user not found", 404));
    }
  
    //Update Cloudinary Images
    let avatar = [];
    if (typeof req.body.avatar === "string") {
        avatar.push(req.body.avatar);
    } else {
        avatar = req.body.avatar;
    }
  
    if (avatar !== undefined) {
      // Deleting images from Cloudinary
      for (let i = 0; i < user.avatar.length; i++) {
        await cloudinary.v2.uploader.destroy(user.avatar[i].public_id);
      }
  
      const imagesLinks = [];
      for (let i = 0; i < avatar.length; i++) {
        const result = await cloudinary.v2.uploader.upload(avatar[i], {
          folder: "user",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.avatar = imagesLinks;
    }
  
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      user,
      message: "User Updated Successfully",
    });
  });
  
  //Delete Player ---Admin
  exports.deletePlayer = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(new ErrorHander("user not found", 404));
    }
  
    // Deleting images from Cloudinary
    for (let i = 0; i < user.avatar.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        user.avatar[i].public_id
      );
    }
  
    await user.remove();
  
    res.status(200).json({
      success: true,
      message: "user Deleted Successfully",
    });
  });
  
  //Delete Player ---Admin
  // exports.removePlayer = catchAsyncError(async (req, res, next) => {
  //   const user = await User.findById(req.params.id);
  
  //   if (!user) {
  //     return next(new ErrorHander("user not found", 404));
  //   }
  //   const name = user.name;
  //   await User.updateOne(
  //     { _id: req.params.id },
  //     { $set: { isRemoved: true } }
  //   );
  
  //   res.status(200).json({
  //     success: true,
  //     message: `Successfully deleted user ${name}`,
  //   });
  // });




//Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});