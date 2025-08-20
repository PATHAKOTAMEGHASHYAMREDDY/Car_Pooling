import React, { useState } from "react";
import Notification from "./Notification";
import ConfirmModal from "./ConfirmModal";

const NotificationDemo = () => {
  const [notification, setNotification] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
  });

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), type === "error" ? 7000 : 5000);
  };

  const showConfirmModal = (type) => {
    setConfirmModal({
      isOpen: true,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Action`,
      message: `This is a ${type} confirmation dialog. Are you sure you want to proceed?`,
      onConfirm: () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        showNotification(
          `${type.charAt(0).toUpperCase() + type.slice(1)} action completed!`,
          "success"
        );
      },
      type: type,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <Notification
        notification={notification}
        onClose={() => setNotification(null)}
      />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Custom Notification System Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-3">
              <button
                onClick={() =>
                  showNotification("This is a success message!", "success")
                }
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Show Success
              </button>
              <button
                onClick={() =>
                  showNotification("This is an error message!", "error")
                }
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Show Error
              </button>
              <button
                onClick={() =>
                  showNotification("This is a warning message!", "warning")
                }
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Show Warning
              </button>
              <button
                onClick={() =>
                  showNotification("This is an info message!", "info")
                }
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Show Info
              </button>
            </div>
          </div>

          {/* Confirmation Modals */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Confirmation Modals</h2>
            <div className="space-y-3">
              <button
                onClick={() => showConfirmModal("danger")}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Danger Confirm
              </button>
              <button
                onClick={() => showConfirmModal("warning")}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Warning Confirm
              </button>
              <button
                onClick={() => showConfirmModal("info")}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Info Confirm
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Custom styled notifications with icons</li>
            <li>✅ Auto-dismiss after 5-7 seconds</li>
            <li>✅ Manual close button</li>
            <li>✅ Smooth slide-in animations</li>
            <li>✅ Confirmation modals with custom styling</li>
            <li>✅ Different types: success, error, warning, info, danger</li>
            <li>✅ Backdrop blur and modern design</li>
            <li>✅ Responsive and accessible</li>
          </ul>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        type={confirmModal.type}
        confirmText="Yes, Proceed"
        cancelText="Cancel"
      />
    </div>
  );
};

export default NotificationDemo;
