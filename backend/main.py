from flask import Flask, request, jsonify
from flask_cors import CORS 
from bson import ObjectId
from database import (
    register_user, authenticate_user, find_user, update_user_details, delete_user,
    add_rooms, list_all_rooms, check_room_availability, get_room, update_room, delete_room,
    add_allotment, list_allotments_by_user, remove_allotment, update_allotment, delete_allotment, get_allotment,
    add_hostels, list_all_hostels, update_hostel, get_hostel, delete_hostel, 
    update_application_status, get_application, delete_application,
    find_available_rooms, fetch_all_wardens, assign_warden_to_hostel, remove_warden_from_hostel, create_application,
    get_pending_applications_admin, get_closed_applications_admin, get_available_hostels, assign_hostel_to_student, get_students_by_hostel,
    get_closed_applications_warden, get_pending_applications_warden, assign_room_to_student, wardens_to_assign
)
import logging

app = Flask(__name__)

CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

logging.getLogger("pymongo").setLevel(logging.WARNING)

# Helper function to convert ObjectId to string recursively
def convert_objectid(data):
    if isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(element) for element in data]
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

# Sample route to check the server is running
@app.route('/')
def index():
    return jsonify({"message": "Hostel Allotment System API is running."})

# User Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    success = register_user(data['name'], data['password'], data['role'], data['email'], data['contact_number'], data['bits_id'])
    if success:
        return jsonify({"message": "User registered successfully"}), 201
    return jsonify({"message": "User already exists"}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Ensure that 'email' and 'password' are present in the request
    if 'email' not in data or 'password' not in data:
        return jsonify({"message": "Missing email or password"}), 400

    # Authenticate user based on the provided email and password
    user = authenticate_user(data['email'], data['password'])

    # If no user is found, return an error
    if user is None:
        return jsonify({"message": "Invalid credentials"}), 401

    # If user contains an ObjectId, convert it to string
    if '_id' in user and isinstance(user['_id'], ObjectId):
        user['_id'] = str(user['_id'])

    # Ensure the user has a 'role' field (e.g., 'student', 'admin', 'warden')
    if 'role' not in user:
        return jsonify({"message": "User role not found"}), 400

    # Return the successful login response with user data and role
    return jsonify({
        "message": "Login successful",
        "user": {
            "_id": user['_id'],
            "email": user['email'],
            "role": user['role']  # Include the user's role in the response
        }
    }), 200

@app.route('/user/<email>', methods=['GET'])
def get_user(email):
    user = find_user(email)
    if user:
        user = convert_objectid(user)
        return jsonify(user), 200
    return jsonify({"message": "User not found"}), 404

@app.route('/wardens', methods=['GET'])
def get_all_wardens():
    """API endpoint to fetch all wardens."""
    try:
        wardens = fetch_all_wardens()  # Call the database function
        logger.info("Successfully fetched all wardens.")
        return jsonify(wardens), 200
    except Exception as e:
        logger.error("Error fetching wardens", exc_info=True)
        return jsonify({"error": "Unable to fetch wardens"}), 500

@app.route('/wardens-for-assign', methods=['GET'])
def get_wardens_to_assign():
    """API endpoint to fetch all wardens."""
    try:
        wardens = wardens_to_assign()  # Call the database function
        logger.info("Successfully fetched all wardens.")
        return jsonify(wardens), 200
    except Exception as e:
        logger.error("Error fetching wardens", exc_info=True)
        return jsonify({"error": "Unable to fetch wardens"}), 500

# Room Routes
@app.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = list_all_rooms()
    return jsonify(rooms), 200

@app.route('/room/<room_id>/availability', methods=['GET'])
def check_availability(room_id):
    available = check_room_availability(room_id)
    return jsonify({"available": available}), 200

@app.route('/room/<room_id>', methods=['GET'])
def get_room_info(room_id):
    room = get_room(room_id)
    if room:
        return jsonify(room.to_dict()), 200
    return jsonify({"message": "Room not found"}), 404

@app.route('/room/<room_id>', methods=['PUT'])
def update_room_info(room_id):
    data = request.json
    success = update_room(room_id, data)
    if success:
        return jsonify({"message": "Room updated successfully"}), 200
    return jsonify({"message": "Room update failed"}), 400

@app.route('/room/<room_id>', methods=['DELETE'])
def delete_room_info(room_id):
    success = delete_room(room_id)
    if success:
        return jsonify({"message": "Room deleted successfully"}), 200
    return jsonify({"message": "Room deletion failed"}), 400

# Allotment Routes
@app.route('/allotment', methods=['POST'])
def create_allotment():
    data = request.json
    allotment_id = add_allotment(data)
    return jsonify({"message": "Allotment created", "allotment_id": allotment_id}), 201

@app.route('/allotments/user/<user_id>', methods=['GET'])
def get_user_allotments(user_id):
    allotments = list_allotments_by_user(user_id)
    return jsonify(allotments), 200

@app.route('/allotment/<allotment_id>', methods=['DELETE'])
def remove_allotment(allotment_id):
    success = remove_allotment(allotment_id)
    if success:
        return jsonify({"message": "Allotment removed successfully"}), 200
    return jsonify({"message": "Failed to remove allotment"}), 400

# Hostel Routes
@app.route('/hostels', methods=['GET'])
def get_hostels():
    """Route to fetch the list of hostels, including warden information."""
    try:
        hostels = list_all_hostels()
        return jsonify(hostels), 200
    except Exception as e:
        logger.error("Error in get_hostels route", exc_info=True)
        return jsonify({"error": "Failed to fetch hostels"}), 500

@app.route('/available-hostels', methods=['GET'])
def available_hostels():
    """API endpoint to get the list of available hostels."""
    try:
        # Fetch available hostels from the database function
        hostels = get_available_hostels()
        
        # Return the list of hostels in JSON format
        return jsonify(hostels), 200
    except Exception as e:
        print(f"Error in available_hostels endpoint: {e}")
        return jsonify({"error": "Failed to fetch available hostels"}), 500

@app.route('/assign-hostel/<bits_id>', methods=['POST', 'PUT'])
def assign_hostel(bits_id):
    try:
        data = request.get_json()
        hostel_name = data.get("hostel_name")
        
        if not hostel_name:
            return jsonify({"error": "hostel_name is required"}), 400
        
        # Call the database function to assign the hostel
        success = assign_hostel_to_student(bits_id, hostel_name)
        
        if success:
            return jsonify({"message": "Hostel assigned successfully"}), 200
        else:
            return jsonify({"error": "Failed to assign hostel. Hostel may be full or not exist."}), 400
    except Exception as e:
        print(f"Error in assign_hostel endpoint: {e}")
        return jsonify({"error": "An error occurred while assigning hostel"}), 500

@app.route('/hostel', methods=['POST'])
def create_hostel():
    data = request.json
    hostel_id = add_hostels(data)
    return jsonify({"message": "Hostel created", "hostel_id": hostel_id}), 201

@app.route('/hostel/<hostel_id>', methods=['PUT'])
def update_hostel_info(hostel_id):
    data = request.json
    success = update_hostel(hostel_id, data)
    if success:
        return jsonify({"message": "Hostel updated successfully"}), 200
    return jsonify({"message": "Hostel update failed"}), 400

# Application Routes
@app.route('/closed-requests-admin', methods=['GET'])
def get_closed_applications_for_admin():
    applications = get_closed_applications_admin()
    return jsonify(applications), 200

@app.route('/pending-requests-admin', methods=['GET'])
def get_pending_applications_for_admin():
    applications = get_pending_applications_admin()
    return jsonify(applications), 200
 
@app.route('/closed-requests-warden/<hostel_name>', methods=['GET'])
def get_closed_applications_for_warden(hostel_name):
    applications = get_closed_applications_warden(hostel_name)
    return jsonify(applications), 200

@app.route('/pending-requests-warden/<hostel_name>', methods=['GET'])
def get_pending_applications_for_warden(hostel_name):
    applications = get_pending_applications_warden(hostel_name)
    return jsonify(applications), 200
 
@app.route('/applications', methods=['POST'])
def submit_application():
    data = request.json
    user_id = data.get('user_id')
    hostel_preference = data.get('hostel_preference', [])
    room_type_preference = data.get('room_type_preference')

    if not user_id or not hostel_preference or not room_type_preference:
        return jsonify({"error": "Missing required fields"}), 400

    application_id = create_application(user_id, hostel_preference, room_type_preference)
    return jsonify({"message": "Application submitted", "application_id": application_id}), 201

@app.route('/application/<application_id>/status', methods=['PUT'])
def update_application_status_route(application_id):
    data = request.json
    success = update_application_status(application_id, data['status'])
    if success:
        return jsonify({"message": "Application status updated"}), 200
    return jsonify({"message": "Failed to update application status"}), 400

# Utility Routes
@app.route('/hostels/<hostel_name>/available_rooms', methods=['GET'])
def available_rooms(hostel_name):
    try:
        rooms = find_available_rooms(hostel_name)
        return jsonify([room.to_dict() for room in rooms]), 200
    except Exception as e:
        logger.error(f"Error fetching available rooms for hostel {hostel_name}: {e}")
        return jsonify({"error": "Unable to fetch available rooms"}), 500

@app.route('/room-requests/<bits_id>/assign-room', methods=['PUT'])
def assign_room(bits_id):
    try:
        # Retrieve the student_id and room_id from the request body
        data = request.json
        hostel_name = data.get("hostel_name")
        room_number = data.get("room_number")

        if not hostel_name or not room_number:
            return jsonify({"error": "Both hostel_name and room_number are required"}), 400

        # Call the database function to assign the room
        success = assign_room_to_student(bits_id, room_number, hostel_name)

        if success:
            logger.info(f"Room assigned successfully for bits_id {bits_id}.")
            return jsonify({"message": "Room assigned successfully"}), 200
        else:
            return jsonify({"error": "Failed to assign room"}), 500

    except Exception as e:
        logger.error("Error processing room assignment request", exc_info=True)
        return jsonify({"error": "An error occurred while assigning the room"}), 500

@app.route('/hostels/<hostel_name>/assign-warden', methods=['PUT'])
def assign_warden(hostel_name):
    """API endpoint to assign a warden to a specific hostel."""
    try:
        # Get warden name from the request JSON body
        data = request.json
        warden_email = data.get("warden_email")

        # Log the received hostel ID and warden name for debugging
        logger.debug(f"Received request to assign warden '{warden_email}' to hostel ID: {hostel_name}")

        # Validate required field
        if not warden_email:
            logger.error("warden_email is missing in request.")
            return jsonify({"error": "warden_email is required"}), 400

        # Call the database function to assign the warden
        success = assign_warden_to_hostel(hostel_name, warden_email)

        # Log the result of the assignment operation
        if success:
            logger.info(f"Warden '{warden_email}' assigned to hostel with name {hostel_name}.")
            return jsonify({"message": "Warden assigned successfully"}), 200
        else:
            logger.error(f"Failed to assign warden '{warden_email}' to hostel with name {hostel_name}.")
            return jsonify({"error": "Failed to assign warden"}), 500

    except Exception as e:
        logger.error("Error assigning warden", exc_info=True)
        return jsonify({"error": "An error occurred while assigning warden"}), 500

@app.route('/hostels/<hostel_name>/remove-warden', methods=['PUT'])
def remove_warden(hostel_name):
    """API endpoint to remove a warden from a specific hostel."""
    try:
        data = request.json
        warden_email = data.get("warden_email")

        # Debug log for hostel ID
        logger.debug(f"Received request to remove warden '{warden_email}' from hostel with ID '{hostel_name}'.")

        # Call the database function to remove the warden
        success = remove_warden_from_hostel(hostel_name, warden_email)

        # Debug: Log the result of the removal
        if success:
            logger.info(f"Warden removed from hostel with ID '{hostel_name}'.")
            return jsonify({"message": "Warden removed successfully"}), 200
        else:
            logger.error(f"Failed to remove warden from hostel with ID '{hostel_name}'.")
            return jsonify({"error": "Failed to remove warden"}), 500

    except Exception as e:
        logger.error("Error removing warden", exc_info=True)
        return jsonify({"error": "An error occurred while removing warden"}), 500
    
@app.route('/hostels/<hostel_name>/students', methods=['GET'])
def get_students_in_hostel(hostel_name):
    """API endpoint to fetch all students in a specific hostel."""
    try:
        # Fetch the students using the database function
        students = get_students_by_hostel(hostel_name)
        # Return student details as JSON
        return jsonify([student.to_dict() for student in students]), 200
    except Exception as e:
        print(f"Error retrieving students for hostel {hostel_name}: {e}")
        return jsonify({"error": "Failed to retrieve students"}), 500

if __name__ == '__main__':
    inserted_ids = add_hostels()
    print("Inserted hostel IDs:", inserted_ids)
    inserted_id = add_rooms()
    print("Inserted room:", inserted_id)
    app.run(debug=True)
