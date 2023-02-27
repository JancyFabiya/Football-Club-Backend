const ErrorHander = require("../utils/errorhandler");
const Club = require('../models/clubModel');
const catchAsyncError = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary");




//Add Club

exports.addClub = catchAsyncError(async (req,res,next) => {
    let logo = [];
    if (typeof req.body.logo === "string") {
        logo.push(req.body.logo);
      } else {
        logo = req.body.logo;
      }
      const imagesLinks = [];
      for (let i = 0; i < logo.length; i++) {
        const result = await cloudinary.v2.uploader.upload(logo[i], {
          folder: "clubs",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.logo = imagesLinks;
      const club = await Club.create(req.body);
      res.status(201).json({
        success: true,
        club,
      });
})


//Get all club without pagination

exports.getAllclub = catchAsyncError(async (req, res, next) => {
  const club = await Club.find();
  res.status(200).json({
    success: true,
    club,
  });
});


//Get club Details

exports.getClubDetails = catchAsyncError(async (req, res, next) => {
    const club = await Club.findById(req.params.id);
  
    if (!club) {
      return next(new ErrorHander("This Club is not found", 404));
    }
  
    res.status(200).json({
      success: true,
      club,
    });
  });


  //Get All club --ADMIN
exports.getAdminclub = catchAsyncError(async (req, res, next) => {
    const club = await Club.find();
  
    res.status(200).json({
      success: true,
      club,
    });
  });
  
  //Update club --Admin
  exports.updateClub = catchAsyncError(async (req, res, next) => {
    let club = await Club.findById(req.params.id);
    if (!club) {
      return next(new ErrorHander("club not found", 404));
    }
  
    //Update Cloudinary Images
    let logo = [];
    if (typeof req.body.logo === "string") {
      logo.push(req.body.logo);
    } else {
      logo = req.body.logo;
    }
  
    if (logo !== undefined) {
      // Deleting images from Cloudinary
      for (let i = 0; i < club.logo.length; i++) {
        await cloudinary.v2.uploader.destroy(club.logo[i].public_id);
      }
  
      const imagesLinks = [];
      for (let i = 0; i < logo.length; i++) {
        const result = await cloudinary.v2.uploader.upload(logo[i], {
          folder: "club",
        });
  
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
  
      req.body.logo = imagesLinks;
    }
  
    club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      club,
      message: "Club Updated Successfully",
    });
  });
  
  //Delete Club ---Admin
  exports.deleteClub = catchAsyncError(async (req, res, next) => {
    const club = await Club.findById(req.params.id);
  
    if (!club) {
      return next(new ErrorHander("Club not found", 404));
    }
  
    // Deleting images from Cloudinary
    for (let i = 0; i < club.logo.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        club.logo[i].public_id
      );
    }
  
    await club.remove();
  
    res.status(200).json({
      success: true,
      message: "Club Deleted Successfully",
    });
  });
  
  // //Delete Club ---Admin
  // exports.removeClub = catchAsyncError(async (req, res, next) => {
  //   const club = await Club.findById(req.params.id);
  // console.log('de',req.params.id);
  //   if (!club) {
  //     return next(new ErrorHander("Club not found", 404));
  //   }
  //   const name = club.clubName;
  //   await Club.updateOne(
  //     { _id: req.params.id },
  //     { $set: { isRemoved: true } }
  //   );
  
  //   res.status(200).json({
  //     success: true,
  //     message: `Successfully deleted club ${name}`,
  //   });
  // });