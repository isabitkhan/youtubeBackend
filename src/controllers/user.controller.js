import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { userValidate } from "../models/user.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, userName, email, password } = req.body;

  //validation
  const { error } = userValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking already user in dataBase
  const existedUser = await User.findOne({ $or: [{ email }, { userName }] });
  if (existedUser) return res.status(409).send("User already exists");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) return res.status(400).send("Avatar file is required");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) return res.status(400).send("Avatar file is required");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser)
    return res
      .status(500)
      .send(
        "Something went worng while registering the user please try again later"
      );
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  console.log("User Name is ", userName);
});

export { registerUser };
