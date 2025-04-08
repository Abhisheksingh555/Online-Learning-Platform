import React, { useRef } from "react";
import { FaDownload } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";

const Certificate = () => {
  const certificateRef = useRef();

  const handleDownload = useReactToPrint({
    content: () => certificateRef.current,
    documentTitle: "Course Certificate",
  });

  const userData = {
    name: "Abhishek Singh",
    course: "Full Stack Web Development",
    date: "April 8, 2025",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F1A] to-[#1E1E2F] text-white flex flex-col items-center py-10 px-4">
      <motion.h1
        className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Course Completion Certificate
      </motion.h1>

      <div className="w-full max-w-3xl flex flex-col items-center gap-6">
        {/* Certificate Preview */}
        <div
          ref={certificateRef}
          className="w-full bg-white text-black rounded-2xl border-4 border-[#2EC4B6] shadow-2xl px-10 py-8 relative"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 text-[#2EC4B6]">Certificate of Completion</h2>
            <p className="text-lg text-gray-700 mb-6">This is proudly presented to</p>
            <h3 className="text-2xl font-semibold text-[#0F0F1A] mb-4">{userData.name}</h3>
            <p className="text-gray-800 mb-4">
              for successfully completing the course
            </p>
            <h4 className="text-xl font-bold text-[#0F0F1A] mb-4">{userData.course}</h4>
            <p className="text-gray-700">Date of Completion: {userData.date}</p>
          </div>

          {/* Signature & Seal */}
          <div className="flex justify-between items-center mt-10">
            <div className="text-left">
              <p className="border-t-2 border-[#2EC4B6] w-40 text-sm pt-1 text-gray-700">
                Instructor Signature
              </p>
            </div>
            <div className="text-right text-[#2EC4B6] font-bold text-sm tracking-wide">
              LMS Platform
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-[#2EC4B6] hover:bg-[#38BDF8] text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
        >
          <FaDownload />
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default Certificate;
