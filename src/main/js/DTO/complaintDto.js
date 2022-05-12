class complaintDto {

    setComplaintNumber(complaintNumber) {
        this.complaintNumber = complaintNumber;
    }
    setForceNumber(forceNumber) {
        this.forceNumber = forceNumber;
    }
    setCategory(category) {
        this.category = category;
    }
    setRegistrationDate(registrationDate) {
        this.registrationDate = registrationDate;
    }
    setComplaint(complaint) {
        this.complaint = complaint;
    }
    setQuarterNumber(quarterNumber) {
        this.quarterNumber = quarterNumber;
    }
    setResolutionDate(resolutionDate) {
        this.resolutionDate = resolutionDate;
    }
    setReasonOfCancellation(reasonOfCancellation) {
        this.reasonOfCancellation = reasonOfCancellation;
    }
    setFeedbackRating(feedbackRating) {
        this.feedbackRating = feedbackRating;
    }
    getComplaintNumber() {
        return this.complaintNumber;
    }
    getForceNumber() {
        return this.forceNumber;
    }
    setCategory() {
        return this.category;
    }
    getRegistrationDate() {
        return this.registrationDate;
    }
    getComplaint() {
        return this.complaint;
    }
    getQuarterNumber() {
        return this.quarterNumber;
    }
    getResolutionDate() {
        return this.resolutionDate;
    }
    getReasonOfCancellation() {
        return this.reasonOfCancellation;
    }
    getFeedbackRating() {
        return this.feedbackRating;
    }

}

module.exports = complaintDto;