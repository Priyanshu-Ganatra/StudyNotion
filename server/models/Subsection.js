const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
	title: { type: String },
	timeDuration: { type: String },
	description: { type: String },
	videoUrl: { type: String },
	pdfUrl: { type: String },
	fileName: { type: String },
	type: { type: String, enum: ["video", "pdf"] },
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
