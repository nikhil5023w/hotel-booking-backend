// import Room from "../models/Room.js";

// // CREATE ROOM
// export const createRoom = async (req, res, next) => {
//   try {
//     const room = await Room.create(req.body);
//     res.status(201).json(room);
//   } catch (error) {
//     next(error);
//   }
// };

// // GET ALL ROOMS
// export const getRooms = async (req, res, next) => {
//   try {
//     const rooms = await Room.find();
//     res.json(rooms);
//   } catch (error) {
//     next(error);
//   }
// };

// // GET SINGLE ROOM
// export const getRoomById = async (req, res, next) => {
//   try {
//     const room = await Room.findById(req.params.id);

//     if (!room) return res.status(404).json({ message: "Room not found" });

//     res.json(room);
//   } catch (error) {
//     next(error);
//   }
// };

// // UPDATE ROOM
// export const updateRoom = async (req, res, next) => {
//   try {
//     const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!room) return res.status(404).json({ message: "Room not found" });

//     res.json(room);
//   } catch (error) {
//     next(error);
//   }
// };

// // DELETE ROOM
// export const deleteRoom = async (req, res, next) => {
//   try {
//     const room = await Room.findByIdAndDelete(req.params.id);

//     if (!room) return res.status(404).json({ message: "Room not found" });

//     res.json({ message: "Room deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

// import Room from "../models/Room.js";

// // CREATE ROOM
// export const createRoom = async (req, res, next) => {
//   try {
//     const { name, description, price, capacity, amenities, isAvailable } =
//       req.body;

//     // Extract Cloudinary URLs
//     const coverImages = req.files?.coverImages?.map((file) => file.path) || [];

//     const galleryImages =
//       req.files?.galleryImages?.map((file) => file.path) || [];

//     const room = await Room.create({
//       name,
//       description,
//       price,
//       capacity,
//       coverImages,
//       galleryImages,
//       amenities: amenities ? JSON.parse(amenities) : [],
//       isAvailable,
//     });

//     res.status(201).json(room);
//   } catch (error) {
//     next(error);
//   }
// };

// // GET ALL ROOMS
// export const getRooms = async (req, res, next) => {
//   try {
//     const rooms = await Room.find();
//     res.json(rooms);
//   } catch (error) {
//     next(error);
//   }
// };

// // GET SINGLE ROOM
// export const getRoomById = async (req, res, next) => {
//   try {
//     const room = await Room.findById(req.params.id);

//     if (!room) return res.status(404).json({ message: "Room not found" });

//     res.json(room);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateRoom = async (req, res, next) => {
//   try {
//     const { name, description, price, capacity, amenities, isAvailable } =
//       req.body;

//     const updateData = {
//       name,
//       description,
//       price,
//       capacity,
//       isAvailable,
//     };

//     if (amenities) {
//       updateData.amenities = JSON.parse(amenities);
//     }

//     if (req.files?.coverImages) {
//       updateData.coverImages = req.files.coverImages.map((file) => file.path);
//     }

//     if (req.files?.galleryImages) {
//       updateData.galleryImages = req.files.galleryImages.map(
//         (file) => file.path,
//       );
//     }

//     const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
//       returnDocument: "after",
//     });

//     if (!room) return res.status(404).json({ message: "Room not found" });

//     res.json(room);
//   } catch (error) {
//     next(error);
//   }
// };

// // DELETE ROOM
// export const deleteRoom = async (req, res, next) => {
//   try {
//     const room = await Room.findByIdAndDelete(req.params.id);

//     if (!room) return res.status(404).json({ message: "Room not found" });

//     res.json({ message: "Room deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

import Room from "../models/Room.js";

// CREATE ROOM
export const createRoom = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES RECEIVED:", Object.keys(req.files || {}));
    const {
      name,
      roomType,
      description,
      subDescription,
      price,
      capacity,
      amenities,
      isAvailable,
    } = req.body;

    const coverImages = req.files?.coverImages
      ? req.files.coverImages.map((file) => file.path)
      : [];

    const galleryImages = req.files?.galleryImages
      ? req.files.galleryImages.map((file) => file.path)
      : [];

    const room = await Room.create({
      name,
      roomType,
      description,
      subDescription,
      price,
      capacity,
      coverImages,
      galleryImages,
      amenities: amenities ? JSON.parse(amenities || "[]") : [],
      isAvailable,
    });

    res.status(201).json(room);
  } catch (error) {
    console.log("ROOM CREATE ERROR:", error);
    next(error);
  }
};

// GET ALL ROOMS
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE ROOM
export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json(room);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const {
      name,
      roomType,
      description,
      subDescription,
      price,
      capacity,
      amenities,
      isAvailable,
    } = req.body;
    const updateData = {
      name,
      roomType,
      description,
      subDescription,
      price,
      capacity,
      isAvailable,
    };

    if (amenities) {
      updateData.amenities = JSON.parse(amenities);
    }

    if (req.files?.coverImages) {
      updateData.coverImages = req.files.coverImages.map((file) => file.path);
    }

    if (req.files?.galleryImages) {
      updateData.galleryImages = req.files.galleryImages.map(
        (file) => file.path,
      );
    }

    const room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      returnDocument: "after",
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json(room);
  } catch (error) {
    next(error);
  }
};

// DELETE ROOM
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ message: "Room deleted" });
  } catch (error) {
    next(error);
  }
};
