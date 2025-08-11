import { asynchandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/responsehandler.js";
import { apierror } from "../utils/apierror.js";
import { PDF } from "../models/pdf.model.js";
import cloudinary from '../middelwares/cloudinary.middelware.js';

// Upload PDF
export const uploadPDF = asynchandler(async (req, res) => {
    if (!req.file) {
        throw new apierror(400, "PDF file is required");
    }

    // Check if file is PDF
    if (!req.file.mimetype.includes('pdf')) {
        throw new apierror(400, "Only PDF files are allowed");
    }

    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'raw',
            format: 'pdf',
            folder: 'pdfs'
        });

        // Create PDF record in database
        const pdf = await PDF.create({
            url: result.secure_url,
            cloudinaryId: result.public_id
        });

        res.status(201).json(
            new apiresponse(201, pdf, "PDF uploaded successfully")
        );
    } catch (error) {
        throw new apierror(500, "Error uploading PDF to Cloudinary");
    }
});

// Get all PDFs
export const getAllPDFs = asynchandler(async (req, res) => {
    const pdfs = await PDF.find({}).sort({ createdAt: -1 });
    
    res.status(200).json(
        new apiresponse(200, pdfs, "All PDFs retrieved successfully")
    );
});

// Get PDF by ID
export const getPDFById = asynchandler(async (req, res) => {
    const { id } = req.params;
    
    const pdf = await PDF.findById(id);
    if (!pdf) {
        throw new apierror(404, "PDF not found");
    }
    
    res.status(200).json(
        new apiresponse(200, pdf, "PDF retrieved successfully")
    );
});

// Update PDF
export const updatePDF = asynchandler(async (req, res) => {
    const { id } = req.params;
    
    if (!req.file) {
        throw new apierror(400, "New PDF file is required");
    }

    // Check if file is PDF
    if (!req.file.mimetype.includes('pdf')) {
        throw new apierror(400, "Only PDF files are allowed");
    }

    const pdf = await PDF.findById(id);
    if (!pdf) {
        throw new apierror(404, "PDF not found");
    }

    try {
        // Delete old file from Cloudinary
        await cloudinary.uploader.destroy(pdf.cloudinaryId);

        // Upload new file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'raw',
            format: 'pdf',
            folder: 'pdfs'
        });

        // Update PDF record
        pdf.url = result.secure_url;
        pdf.cloudinaryId = result.public_id;
        await pdf.save();

        res.status(200).json(
            new apiresponse(200, pdf, "PDF updated successfully")
        );
    } catch (error) {
        throw new apierror(500, "Error updating PDF");
    }
});

// Delete PDF
export const deletePDF = asynchandler(async (req, res) => {
    const { id } = req.params;
    
    const pdf = await PDF.findById(id);
    if (!pdf) {
        throw new apierror(404, "PDF not found");
    }

    try {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(pdf.cloudinaryId);
        
        // Delete from database
        await PDF.findByIdAndDelete(id);

        res.status(200).json(
            new apiresponse(200, null, "PDF deleted successfully")
        );
    } catch (error) {
        throw new apierror(500, "Error deleting PDF");
    }
}); 