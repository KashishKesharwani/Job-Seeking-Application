// import mongoose from "mongoose";

// const jobSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, "Please provide a title"],
//     minlength: [3, "Job title must contain at least 3 characters"],
//     maxlength: [50, "Job title cannot exceed 50 characters"],
//   },
//   description: {
//     type: String,
//     required: [true, "Please provide a job description"],
//     minlength: [10, "Job description must contain at least 10 characters"], 
//     maxlength: [350, "Job description cannot exceed 350 characters"], 
//   },
//   country: {
//     type: String,
//     required: [true, "Job country is required"],
//   },
//   city: {
//     type: String,
//     required: [true, "Job city is required"],
//   },
//   location: {
//     type: String,
//     required: [true, "Please provide an exact location"],
//     minlength: [50, "Job location must contain at least 50 characters"], 
//   },
//   fixedSalary: {
//     type: Number,
//     min: [1000, "Fixed salary must be at least 1000"], 
//     max: [9999999, "Fixed salary cannot exceed 9,999,999"], 
//   },
//   salaryFrom: {
//     type: Number,
//     min: [1000, "Salary from must be at least 1000"], 
//     max: [9999999, "Salary from cannot exceed 9,999,999"],
//   },
//   expired: {
//     type: Boolean,
//     default: false,
//   },
//   jobPostedOn: {
//     type: Date,
//     default: Date.now,
//   },
//   postedBy: {
//     type: mongoose.Schema.ObjectId,
//     ref: "User",
//     required: true,
//   },
// });

// export const Job = mongoose.model("Job", jobSchema);


import mongoose from "mongoose";
import validator from "validator";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    minlength: [3, "Job title must contain at least 3 characters"],
    maxlength: [50, "Job title cannot exceed 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a job description"],
    minlength: [10, "Job description must contain at least 10 characters"], 
    maxlength: [350, "Job description cannot exceed 350 characters"], 
  },
  country: {
    type: String,
    required: [true, "Job country is required"],
  },
  city: {
    type: String,
    required: [true, "Job city is required"],
  },
  location: {
    type: String,
    required: [true, "Please provide an exact location"],
    minlength: [50, "Job location must contain at least 50 characters"], 
  },
  fixedSalary: {
    type: Number,
    min: [1000, "Fixed salary must be at least 1000"], 
    max: [9999999, "Fixed salary cannot exceed 9,999,999"], 
  },
  salaryFrom: {
    type: Number,
    min: [1000, "Salary from must be at least 1000"], 
    max: [9999999, "Salary from cannot exceed 9,999,999"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for the employer
    required: true, // Make it required if every job must have an employer
  }
});

export const Job = mongoose.model("Job", jobSchema);

