
'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import jwt_decode from 'jwt-decode';
import NavSide from '../components/NavSide';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';


const decodedToken = typeof window !== 'undefined' ? jwt_decode(localStorage.getItem('authToken')) : null;


const getCurrentTimeIn12HourFormat = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

const TaskForm = () => {
  const router = useRouter();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  const handleAssigneeSelection = (employeeId) => {
    if (!selectedAssignees.includes(employeeId)) {
      const updatedAssignees = [...selectedAssignees, employeeId];
      setSelectedAssignees(updatedAssignees);
  
      // Update formData with the latest assignee IDs
      setFormData({
        ...formData,
        assignTo: updatedAssignees, // Update assignTo with the updatedAssignees array
      });
    }
  };
  

  const handleRemoveAssignee = (employeeId) => {
    const updatedAssignees = selectedAssignees.filter((id) => id !== employeeId);
    setSelectedAssignees(updatedAssignees);
  };
  const handleModalClose = () => {
    setIsSuccessModalOpen(false);
    router.push('/taskList');
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    deadlineDate: '',
    assignTo: '',
    picture: null,
    audio: null,
    assignedBy: decodedToken?.employeeId,
  });

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [subemployees, setSubemployees] = useState([]);
  const [currentStartTime, setCurrentStartTime] = useState(getCurrentTimeIn12HourFormat());
  const [currentEndTime, setCurrentEndTime] = useState(getCurrentTimeIn12HourFormat());

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/employee/subemployees/list', {
        headers: {
          Authorization: localStorage.getItem('authToken'),
        },
      })
      .then((response) => {
        const subemployeeList = response.data.map((subemployee) => ({
          id: subemployee._id,
          name: `${subemployee.name}`, // Include type (Employee)
          phoneNumber: subemployee.phoneNumber,
          type: 'Employee', // Indicate type in the data
        }));

        // Also add the Admin as an option
        subemployeeList.push({
          id: decodedToken.employeeId, // Use the Admin's ID
          name: `${decodedToken.name} (Admin)`, // Include type (Admin)
          phoneNumber: null,
          type: 'Admin', // Indicate type in the data
        });

        console.log("subemployeeList", subemployeeList);
        setSubemployees(subemployeeList);
      })
      .catch((error) => {
        console.error('Error fetching subemployees:', error);
      });

    setCurrentStartTime(getCurrentTimeIn12HourFormat());

    // Set current end time when the component mounts
    setCurrentEndTime(getCurrentTimeIn12HourFormat());
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const filteredEmployees = subemployees.filter(subemployee => {
    return subemployee.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: files[0],
  //   });
  // };
  const handleFileChange = (e, fileType) => {
    const { files } = e.target;
    setFormData({
      ...formData,
      [fileType]: files[0],
    });
  };

  const handleRemovePicture = () => {
    setFormData({
      ...formData,
      picture: null,
    });
    const fileInput = document.getElementById('picture');
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleRemoveAudio = () => {
    setFormData({
      ...formData,
      audio: null,
    });
    const audioInput = document.getElementById('audio');
    if (audioInput) {
      audioInput.value = '';
    }
  };
  
  // const handleRemovePicture = () => {
  //   setFormData({
  //     ...formData,
  //     picture: null,
  //   });
  //   const fileInput = document.getElementById('picture');
  //   if (fileInput) {
  //     fileInput.value = '';
  //   }
  // };

  // const handleRemoveAudio = () => {
  //   setFormData({
  //     ...formData,
  //     audio: null,
  //   });
  //   const audioInput = document.getElementById('audio');
  //   if (audioInput) {
  //     audioInput.value = '';
  //   }
  // };


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("clicked")
    console.log(formData.assignTo)
    if (!formData.assignTo || formData.assignTo.length === 0) {
      // Handle the case where no subemployee is selected
      return;
    }
    const selectedSubemployee = subemployees.find((subemployee) => subemployee.id === formData.assignTo);
    const phoneNumber = selectedSubemployee ? selectedSubemployee.phoneNumber : null;


    console.log(selectedSubemployee)
    // if (!selectedSubemployee) {
    //   // Handle the case where no subemployee is selected
    //   return;
    // }

    // const phoneNumber = selectedSubemployee.phoneNumber;

    // const form = new FormData();
    // form.append('title', formData.title);
    // form.append('description', formData.description);
    // form.append('startDate', formData.startDate);
    // form.append('startTime', currentStartTime);
    // form.append('deadlineDate', formData.deadlineDate);
    // form.append('endTime', currentEndTime);
    // form.append('assignTo', formData.assignTo);
    // form.append('phoneNumber', phoneNumber); // Add phone number to the form
    // form.append('picture', formData.picture);
    // form.append('audio', formData.audio);
    // form.append('assignedBy', formData.assignedBy);
    const requestBody = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      startTime: currentStartTime,
      deadlineDate: formData.deadlineDate,
      endTime: currentEndTime,
      assignTo: formData.assignTo,
      phoneNumber: phoneNumber, // Update this with the appropriate variable
      assignedBy: formData.assignedBy,
      picture: formData.picture,
      audio: formData.audio
    };


    try {
      const response = await axios.post('http://localhost:5000/api/task/create', requestBody, {
        headers: {
          Authorization: localStorage.getItem('authToken'),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        console.log('Task created Successfully');
        setSuccessMessage(response.data.message);
        setErrors([]);

        const notificationResponse = await axios.post('http://localhost:5000/api/notification/create', {
          recipientId: formData.assignTo,
          taskId: response.data.taskId,
          message: 'A new task has been assigned to you!',
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          deadlineDate: formData.deadlineDate,
          startTime: currentStartTime,
          endTime: currentEndTime,
          status: 'Pending',
        }, {
          headers: {
            Authorization: localStorage.getItem('authToken'),
          },
        });

        if (notificationResponse.status === 201) {
          console.log('Notification sent Successfully');
        }
        setIsSuccessModalOpen(true);

        // router.push('/taskList');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors([{ msg: 'Internal Server Error' }]);
      }
    }

  };

  return (
    <>

      <NavSide />

      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-container bg-white sm:w-96 sm:p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleModalClose}></button>
            <div className="p-2 text-center">
              {/* Customize this section to display your success message */}
              <FontAwesomeIcon icon={faCircleCheck} className='text-3xl md:text-5xl text-green-600 mt-2' />
              <p className="mb-3 text-center justify-center mt-3">
                {successMessage}
              </p>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-2 text text-xs md:text-base"
                onClick={handleModalClose}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <div className="w-full flex justify-center items-center min-h-screen mt-12 pl-28"> */}
      <div className="w-full md:flex justify-center items-center min-h-screen md:mt-0 md:pl-28 bg-slate-50">
        {/* <div className=" max-w-2xl overflow-x-auto border border-red-200 rounded-lg p-5 bg-gray-50"> */}
        <div className="w-full md:max-w-2xl overflow-x-auto border border-gray-200 rounded-lg p-5 bg-white mt-16">

          <div className=" col-span-2 mb-3 md:text-2xl font-bold text-orange-500 text-left">Create Task</div>
          <div className="mb-2 ">
            <label htmlFor="title" className="block font-semibold text-xs lg:text-sm">
              Title / कार्यासाठी नाव <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder='Enter Task Title'
              value={formData.title}
              onChange={handleInputChange}
              className="border-2 border-gray-200 rounded-md px-3 py-2 w-full "
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="description" className="block font-semibold text-xs lg:text-sm">
              Description / कार्य वर्णन <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder='Enter Task Description'
              value={formData.description}
              onChange={handleInputChange}
              className="border-2 border-gray-200 rounded-md px-3 py-2 w-full"
              required
            />
          </div>


          <div className="mb-2">
            <label htmlFor="assignTo" className="block font-semibold text-xs lg:text-sm">
              Assign To / नियुक्त करा <span className="text-red-500">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="border-2 border-gray-200 rounded-md px-3 py-1 w-full cursor-pointer flex justify-between">
                <span>
                  {selectedAssignees.length > 0 ? selectedAssignees.map(employeeId => filteredEmployees.find(subemployee => subemployee.id === employeeId)?.name).join(', ') : 'Select Employees'}
                </span>
                <span className="ml-2">
                  <FontAwesomeIcon icon={faCaretDown} />
                </span>
              </div>

              {isDropdownOpen && (
                <div className="border border-gray-200 rounded-md mt-1" style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', zIndex: 100 }}>
                  {/* Input for searching employees */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Employees"
                    className="border-2 border-gray-200 rounded-md px-3 py-1 w-full mb-2"
                  />

                  {/* List of employees */}
                  {filteredEmployees.map((subemployee) => (
                    <div
                      key={subemployee.id}
                      onClick={() => {
                        handleAssigneeSelection(subemployee.id);
                      }}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                    >
                      {subemployee.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display selected assignees as comma-separated list */}
            <div>
              Selected Assignees: {selectedAssignees.map((assigneeId) => {
                const assignee = filteredEmployees.find((employee) => employee.id === assigneeId);
                return (
                  <span key={assignee.id}>
                    {assignee.name}
                    <button onClick={() => handleRemoveAssignee(assignee.id)}>X</button>
                    {', '}
                  </span>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
            <div className="mb-1">
              <label htmlFor="startDate" className="block font-semibold text-xs lg:text-sm">
                Start Date /सुरु दिनांक <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                // className="border-2 border-gray-200 rounded-md px-3 py-1 w-full"
                className="border-2 border-gray-200 rounded-md px-2 py-1 w-32 md:w-full" // Adjust the width for mobile and larger screens
                required
                min={new Date().toISOString().split('T')[0]} // Restrict past dates using the min attribute
              />
            </div>


            <div className="mb-2">
              <label htmlFor="startTime" className="block font-semibold text-xs lg:text-sm md:pl-7">
                Start Time / सुरू वेळ <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center md:pl-6">
                <select
                  name="startHour"
                  value={currentStartTime.split(':')[0]}
                  onChange={(e) => {
                    const newHour = e.target.value;
                    setCurrentStartTime(`${newHour}:${currentStartTime.split(':')[1]} ${currentStartTime.split(' ')[1]}`);
                  }}
                  className="border border-gray-200 rounded-md md:px-2 py-1.5 mr-1"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i === 0 ? '12' : i.toString().padStart(2, '0')}>
                      {i === 0 ? '12' : i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <span><strong>: </strong></span>
                <select
                  name="startMinute"
                  value={currentStartTime.split(':')[1].split(' ')[0]}
                  onChange={(e) => {
                    const newMinute = e.target.value;
                    setCurrentStartTime(`${currentStartTime.split(':')[0]}:${newMinute} ${currentStartTime.split(':')[1].split(' ')[1]}`);
                  }}
                  className="border border-gray-200 rounded-md md:px-2 py-1.5 mr-2"
                  required
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  name="startAmPm"
                  value={currentStartTime.split(' ')[1]}
                  onChange={(e) => {
                    const newAmPm = e.target.value;
                    setCurrentStartTime(`${currentStartTime.split(':')[0]}:${currentStartTime.split(':')[1].split(' ')[0]} ${newAmPm}`);
                  }}
                  className="border border-gray-200 rounded-md md:px-2 py-1.5"
                  required
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>


            <div className="mb-1">
              <label htmlFor="deadlineDate" className="block font-semibold text-xs lg:text-sm">
                Deadline /अंतिम दिनांक <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="deadlineDate"
                name="deadlineDate"
                value={formData.deadlineDate}
                onChange={handleInputChange}
                className="border-2 border-gray-200 rounded-md px-2 py-1 w-32 md:w-full" // Adjust the width for mobile and larger screens
                required
                min={new Date().toISOString().split('T')[0]} // Restrict past dates using the min attribute

              />
            </div>




            <div className="mb-2">
              <label htmlFor="endTime" className="block font-semibold md:pl-7 text-xs lg:text-sm ">
                End Time / अंतिम वेळ <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center md:pl-6">
                <select
                  name="endHour"
                  value={currentEndTime.split(':')[0]}
                  onChange={(e) => {
                    const newHour = e.target.value;
                    setCurrentEndTime(`${newHour}:${currentEndTime.split(':')[1]} ${currentEndTime.split(' ')[1]}`);
                  }}
                  className="border border-gray-200 rounded-md md:px-2 py-1.5 mr-1"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i === 0 ? '12' : i.toString().padStart(2, '0')}>
                      {i === 0 ? '12' : i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <span><strong>:</strong></span>
                <select
                  name="endMinute"
                  value={currentEndTime.split(':')[1].split(' ')[0]}
                  onChange={(e) => {
                    const newMinute = e.target.value;
                    setCurrentEndTime(`${currentEndTime.split(':')[0]}:${newMinute} ${currentEndTime.split(':')[1].split(' ')[1]}`);
                  }}
                  className="border border-gray-200 rounded-md md:px-2 py-1.5 mr-2"
                  required
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  name="endAmPm"
                  value={currentEndTime.split(' ')[1]}
                  onChange={(e) => {
                    const newAmPm = e.target.value;
                    setCurrentEndTime(`${currentEndTime.split(':')[0]}:${currentEndTime.split(':')[1].split(' ')[0]} ${newAmPm}`);
                  }}
                  className="border border-gray-200 rounded-md md:px-2 py-1.5 mr-2"
                  required
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>


            <div className="mb-1" style={{ position: 'relative' }}>
              <label htmlFor="picture" className="block font-semibold text-xs lg:text-sm">
                Picture / फोटो
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  id="picture"
                  name="picture"
                  // onChange={handleFileChange}
                  onChange={(e) => handleFileChange(e, 'picture')}

                  className="border-2 border-gray-200 rounded-md px-2 py-1 w-32 md:w-full text-xs md:text-sm"
                  style={{ paddingRight: '2.5rem' }} // Adjust padding to accommodate the button
                />
                {formData.picture && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    className="absolute text-black font-bold py-1 px-1 md:px-2 rounded-md text-xs md:text-sm"
                    style={{ right: '0', top: '0', marginTop: '0.3rem', marginRight: '0.2rem' }}
                  >
                    {/* Remove */}
                    <FontAwesomeIcon icon={faXmark} />

                  </button>
                )}
              </div>
            </div>



            <div className="mb-1 md:pl-6" style={{ position: 'relative' }}>
              <label htmlFor="audio" className="block font-semibold text-xs lg:text-sm">
                Audio / ऑडिओ
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  id="audio"
                  name="audio"
                  // onChange={handleFileChange}
                  onChange={(e) => handleFileChange(e, 'audio')}

                  className="border-2 border-gray-200 rounded-md px-2 py-1 w-32 md:w-full text-xs md:text-sm"
                  style={{ paddingRight: '2.5rem' }} // Adjust padding to accommodate the button
                />
                {formData.audio && (
                  <button
                    type="button"
                    onClick={handleRemoveAudio}
                    className="absolute text-black font-bold py-1 px-2 rounded-md text-xs md:text-sm"
                    style={{ right: '0', top: '0', marginTop: '0.3rem', marginRight: '0.2rem' }}
                  >
                    {/* Remove */}
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Create Task
            </button>
          </form>
          {errors.length > 0 && (
            <div className="mt-4">
              <ul className="text-red-500">
                {errors.map((error, index) => (
                  <li key={index}>{error.msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskForm;