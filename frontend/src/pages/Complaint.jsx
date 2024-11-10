import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/Auth";

// Utility functions to format timestamps
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const formatTimestamp1 = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

// Complaint form component
const ComplaintForm = () => {
  const { authToken, headers } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [room, setRoom] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Form validation
    if (!name || name.trim() === "") {
      alert("Please enter a valid name.");
      return;
    }
    if (!room || room.trim() === "") {
      alert("Please enter Room No.");
      return;
    }
    if (!description || description.trim() === "") {
      alert("Please enter a valid complaint.");
      return;
    }

    try {
      const body = { name, description, room };
      const response = await fetch("http://localhost:3000/complaints", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      if (response.ok) {
        window.location = "/";
      }
    } catch (err) {
      console.error("Error submitting complaint:", err.message);
    }
  };

  return (
    <section className="bg-gray-100 py-12 text-gray-800 sm:py-24 h-full">
      <div className="bg-gray-100 mx-auto flex max-w-md flex-col rounded-lg lg:max-w-screen-xl lg:flex-row">
        <div className="max-w-2xl px-4 lg:pr-24">
          {/* Information Section */}
          <p className="mb-2 text-blue-600">Hostel Grievance Redressal</p>
          <h3 className="mb-5 text-3xl font-semibold">Submit Your Grievance</h3>
          <p className="mb-16 text-md text-gray-600">
            Hostel Grievance Redressal ensures a swift and confidential resolution of student concerns. 
          </p>
          {/* Form Section */}
          <div className="p-4 sm:p-8">
            <input
              id="name"
              type="text"
              className="mt-1 w-full resize-y overflow-auto rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none hover:border-blue-500"
              placeholder="Enter Complaint name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              id="room"
              type="text"
              className="peer mt-8 w-full resize-y overflow-auto rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none hover:border-blue-500"
              placeholder="Enter your Room No."
              onChange={(e) => setRoom(e.target.value)}
            />
            <label className="mt-5 mb-2 inline-block max-w-full">Tell us about your grievance</label>
            <textarea
              id="description"
              className="mb-8 w-full resize-y overflow-auto rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none hover:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              className="w-full rounded-lg border border-blue-700 bg-blue-700 p-3 text-center font-medium text-white outline-none transition focus:ring hover:border-blue-700 hover:bg-blue-600 hover:text-white"
              onClick={onSubmitForm}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Complaint display component
const Complaint = () => {
  const { headers } = useAuth();
  const [complaints, setComplaints] = useState([]);

  const getComplaints = async () => {
    try {
      const response = await fetch("http://localhost:3000/complaints", {
        method: "GET",
        headers: headers,
      });
      const jsonData = await response.json();
      
      // Set complaints only if jsonData is an array
      setComplaints(Array.isArray(jsonData) ? jsonData : []);
    } catch (err) {
      console.error("Error fetching complaints:", err.message);
    }
  };

  useEffect(() => {
    getComplaints();
  }, []);

  return (
    <div className="bg-gray-100 p-4 sm:p-8 md:p-10 h-screen">
      <h1 className="text-2xl font-bold mt-20 mb-8">Complaints</h1>
      {complaints.length === 0 ? (
        <p className="ml-4 mt-2 text-gray-600 text-xl">
          No complaints registered yet.
        </p>
      ) : (
        <div className="container mx-auto grid gap-8 md:grid-cols-3 sm:grid-cols-1">
          {complaints.map((complaint) => (
            <div
              key={complaint.complaint_id}
              className="relative flex h-full flex-col rounded-md border border-gray-200 bg-white p-2.5 hover:border-gray-400 sm:rounded-lg sm:p-5"
            >
              <div className="text-lg mb-2 font-semibold text-gray-900 hover:text-black sm:mb-1.5 sm:text-2xl">
                {complaint.name}
              </div>
              <p className="text-sm">
                Created on {formatTimestamp1(complaint.created_at)}
              </p>
              <p className="mb-4 text-sm">
                {complaint.assigned_at
                  ? `Completed on ${formatTimestamp(complaint.assigned_at)}`
                  : "Pending"}
              </p>
              <div
                className="text-md leading-normal text-gray-400 sm:block overflow-hidden"
                style={{ maxHeight: "100px" }}
              >
                {complaint.description}
              </div>
              <button
                className={`group flex w-1/3 mt-3 cursor-pointer items-center justify-center rounded-md px-4 py-2 text-white transition text-sm ${
                  complaint.is_completed ? "bg-green-500" : "bg-red-600"
                }`}
              >
                <span className="group flex w-full items-center justify-center rounded py-1 text-center font-bold">
                  {complaint.is_completed ? "Completed" : "Not Completed"}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
      <ComplaintForm />
    </div>
  );
};

export default Complaint;
