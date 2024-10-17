
import {catchAsyncError} from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js"
import { Application } from "../models/applicationSchema.js";
import cloudinary from 'cloudinary';
import { Job } from '../models/jobSchema.js';


 // employerGetAllApplications
 export const employerGetAllApplications = catchAsyncError(async(req ,res ,next)=>{

     const { role } = req.user;

    if (role === "Job Seeker") {
      return next(new ErrorHandler("Job Seeker is not allowed to access this resource", 400));
     }


    const {_id} = req.user;
    const applications = await Application.find({"employerID.user": _id});
    res.status(200).json(
        {
            success: true,
         applications
        });

})





// jobGetAllApplications
export const jobGetseekerAllApplications = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resource", 400));
    }


    const {_id} = req.user;
    const applications = await Application.find({"applicantID.user": _id});
    res.status(200).json(
        {
            success: true,
         applications
        });

})



// jobSeekerDeleteApplication
export const jobSeekerDeleteApplication = catchAsyncError(async(req ,res , next)=>{

    const { role } = req.user;

    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resource", 400));
    }


    const {id} = req.params;
    const application = await Application.findById(id);
    if(!application) {
         return next(new ErrorHandler("Opps, Application not found", 404));
    }
    await application.deleteOne();
    res.status(200).json({
        success: true,
        message: "Application deleted successfully"
    });


})




export const postApplication = catchAsyncError(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("User not authenticated", 401));
    }

    const { role } = req.user;
    console.log("Authenticated User:", req.user);

    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allowed to access this resource", 400));
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Resume File Required", 400));
    }

    const { resume } = req.files;
    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp' , ];

    if (!allowedFormats.includes(resume.mimetype)) {
        return next(new ErrorHandler("Invalid File Format. Please upload your resume in PNG, JPG, or WEBP format", 400));
    }

    const cloudinaryResponse = await cloudinary.v2.uploader.upload(resume.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Failed to upload resume", 500));
    }

    const { name, email, coverLetter, phone, address, jobId } = req.body;

    const applicantID = {
        user: req.user._id,
        role: "Job Seeker"
    };

    if (!jobId) {
        return next(new ErrorHandler("Job not Found", 404));
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(new ErrorHandler("Job not Found", 404));
    }

    const employerID = {
        user: jobDetails.employer._id,
        role: "Employer"
    };

    if (!name || !email || !coverLetter || !phone || !address || !resume) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    });

    res.status(200).json({
        success: true,
        message: "Application submitted successfully",
        application
    });
});









