

import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import {Job} from "../models/jobSchema.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  console.log("getAllJobs called");
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});





export const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  // Check if the user role is not allowed
  if (role === "Job Seeker") {
    return next(new ErrorHandler("Job Seeker is not allowed to access this resource", 400));
  }

  // Destructure job details from request body
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo
  } = req.body;

  // Validate job details
  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details", 400));
  }

  if ((salaryFrom || salaryTo) && fixedSalary) {
    return next(new ErrorHandler("Please provide either fixed salary or salary range", 400));
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(new ErrorHandler("Cannot provide fixed salary and salary ranges together", 400));
  }

  const postedBy = req.user._id; // Ensure this is the correct ID

  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,  // The ID of the user creating the job
    employer: postedBy,  // Assuming the employer is the user creating the job
  });

  res.status(200).json({
    success: true,
    message: "Job posted successfully",
    job,
  });
});



export const getmyJobs = catchAsyncError(async(req, res , next)=>{
    const {role} = req.user;

    if (role === "Job Seeker") {
        return next
        (new ErrorHandler
            ("Job Seeker is not allowed to access this resource", 
                400 ));
      };


      const myJobs = await Job.find({postedBy: req.user._id});
      res.status(200).json({
        success: true,
        myJobs,
});
});



// Update the Job
export const updateJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "Job Seeker") {
      return next(new ErrorHandler("Job Seeker is not allowed to access this resource", 400));
  }

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
      return next(new ErrorHandler("Oops, job not found", 404));
  }

  job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
  });

  res.status(200).json({
      success: true,
      job,
      message: "Job updated successfully"
  });
});

// Delete the  Job

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;

  if (role === "Job Seeker") {
      return next(new ErrorHandler("Job Seeker is not allowed to access this resource", 400));
  }

  const { id } = req.params;
  let job = await Job.findById(id);

  if (!job) {
      return next(new ErrorHandler("Oops, job not found", 404));
  }

  await job.deleteOne();

  res.status(200).json({
      success: true,
      message: "Job deleted successfully!"
  });
});


export const getSinglejob = catchAsyncError(async(req , res, next)=>{
  const {id} = req.params;

  try{
    const job  = await Job.findById(id);
    if(!job){
      return next(ErrorHandler("Job not Found",404));
    }

    res.status(200).json({
      success:true,
      job
    })
  }
    catch(error){
      return next(ErrorHandler("Invalid ID/CastError",404));
    
  }
})
