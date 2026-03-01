// import mongoose from "mongoose";

// const roomSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//     },

//     capacity: {
//       type: Number,
//       required: true,
//     },

//     images: [
//       {
//         type: String,
//       },
//     ],

//     amenities: [
//       {
//         type: String,
//       },
//     ],

//     isAvailable: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const Room = mongoose.model("Room", roomSchema);

// export default Room;

// import mongoose from "mongoose";

// const roomSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     price: {
//       type: Number,
//       required: true,
//     },

//     capacity: {
//       type: Number,
//       required: true,
//     },

//     images: [
//       {
//         type: String,
//       },
//     ],

//     coverImages: [
//       {
//         type: String,
//       },
//     ],

//     galleryImages: [
//       {
//         type: String,
//       },
//     ],

//     amenities: [
//       {
//         title: String,
//         icon: String,
//         description: String,
//       },
//     ],

//     isAvailable: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const Room = mongoose.model("Room", roomSchema);

// export default Room;

import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      enum: ["1BHK", "2BHK", "Full Room"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    subDescription: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    coverImages: [
      {
        type: String,
      },
    ],

    galleryImages: [
      {
        type: String,
      },
    ],

    amenities: [
      {
        title: String,
        icon: String,
        description: String,
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
