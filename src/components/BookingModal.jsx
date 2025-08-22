import React from "react";

const BookingModal = ({
  showBookingModal,
  selectedRide,
  bookingForm,
  handleBookingFormChange,
  submitBooking,
  setShowBookingModal,
}) => {
  if (!showBookingModal || !selectedRide) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[95vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Book Your Ride</h3>
            </div>
            <button
              onClick={() => setShowBookingModal(false)}
              className="text-white hover:text-gray-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[calc(95vh-80px)] overflow-y-auto">
          {/* Ride Details Card */}
          <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900 leading-tight">
                    {selectedRide.source}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-4 h-0.5 bg-gray-400"></div>
                    <svg
                      className="w-3 h-3 text-gray-400 mx-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <div className="w-4 h-0.5 bg-gray-400"></div>
                  </div>
                  <p className="font-bold text-lg text-gray-900 leading-tight">
                    {selectedRide.destination}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  ₹{selectedRide.pricePerSeat}
                </p>
                <p className="text-xs text-gray-500">per seat</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a4 4 0 118 0v4z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  {selectedRide.rideDate}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  {selectedRide.rideTime}
                </span>
              </div>
              <div className="flex items-center space-x-2 col-span-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-gray-700">
                  Driver:{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedRide.driverName}
                  </span>
                </span>
              </div>
            </div>

            {/* Enhanced Seat Availability Display */}
            <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-2">
                Seat Availability
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    <span className="font-medium text-green-700">
                      {selectedRide.availableSeatsRemaining ||
                        selectedRide.availableSeats -
                          (selectedRide.bookedSeats || 0)}{" "}
                      Available
                    </span>
                  </div>
                  {selectedRide.pendingSeats > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                      <span className="font-medium text-yellow-700">
                        {selectedRide.pendingSeats} Pending
                      </span>
                    </div>
                  )}
                  {selectedRide.confirmedSeats > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                      <span className="font-medium text-red-700">
                        {selectedRide.confirmedSeats} Booked
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Seats
                <span className="text-green-600 font-bold ml-2 text-xs bg-green-50 px-2 py-1 rounded-full">
                  {selectedRide.availableSeatsRemaining ||
                    selectedRide.availableSeats -
                      (selectedRide.bookedSeats || 0)}{" "}
                  available
                </span>
              </label>
              {(selectedRide.availableSeatsRemaining ||
                selectedRide.availableSeats - (selectedRide.bookedSeats || 0)) >
              0 ? (
                <select
                  name="seatsBooked"
                  value={bookingForm.seatsBooked}
                  onChange={handleBookingFormChange}
                  className="form-input bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  {[
                    ...Array(
                      Math.min(
                        selectedRide.availableSeatsRemaining ||
                          selectedRide.availableSeats -
                            (selectedRide.bookedSeats || 0),
                        4
                      )
                    ),
                  ].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} seat{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <div>
                      <p className="text-red-700 text-sm font-semibold">
                        No seats available
                      </p>
                      <p className="text-red-600 text-xs">
                        All seats are booked or pending approval
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="passengerName"
                value={bookingForm.passengerName}
                onChange={handleBookingFormChange}
                className="form-input bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Phone
              </label>
              <input
                type="tel"
                name="passengerPhone"
                value={bookingForm.passengerPhone}
                onChange={handleBookingFormChange}
                className="form-input bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="bookingNotes"
                value={bookingForm.bookingNotes}
                onChange={handleBookingFormChange}
                className="form-input bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                rows="3"
                placeholder="Any special requests or notes for the driver..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowBookingModal(false)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={submitBooking}
              disabled={
                !bookingForm.passengerName ||
                !bookingForm.passengerPhone ||
                (selectedRide.availableSeatsRemaining ||
                  selectedRide.availableSeats -
                    (selectedRide.bookedSeats || 0)) <= 0
              }
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {(selectedRide.availableSeatsRemaining ||
                selectedRide.availableSeats -
                  (selectedRide.bookedSeats || 0)) <= 0
                ? "No Seats Available"
                : "Send Booking Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
