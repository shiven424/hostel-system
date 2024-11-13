from pymongo import MongoClient
from bson.objectid import ObjectId
import os
import logging
from datetime import datetime
from collections_format import User, Room, Allotment, Hostel, Application, hostels_data, rooms_data

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Establish connection to MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/hostel_db")
client = MongoClient(MONGO_URI)

# Select database and collections
db = client.hostel_db
users_collection = db.users
rooms_collection = db.rooms
allotments_collection = db.allotments
hostels_collection = db.hostels
applications_collection = db.applications

# User Database Functions
def register_user(username, password, role, email, contact_number, bits_id):
    existing_user = users_collection.find_one({"username": username})
    if existing_user:
        logger.info(f"User already exists: {username}")
        return False
    user = User(username=username, password_hash=password, role=role, email=email, contact_number=contact_number, bits_id=bits_id)
    users_collection.insert_one(user.to_dict())
    logger.info(f"User registered successfully: {username}")
    return True

def authenticate_user(email, password):
    """Authenticate a user based on email and password."""
    user = users_collection.find_one({"email": email, "password_hash": password})
    if user:
        logger.info(f"User authenticated: {email}")
        return user
    else:
        logger.warning(f"Failed authentication attempt for: {email}")
        return None

def find_user(email):
    logger.info(f"Finding user for email: {email}")
    return users_collection.find_one({"email": email})

def fetch_all_wardens():
    """Fetch all users with role 'warden' from the users collection."""
    try:
        # Query for all users where role is 'warden'
        wardens = users_collection.find({"role": "warden"}, {"_id": 1, "username": 1, "contact_number": 1, "email": 1})

        # Convert the result to a list of dictionaries
        warden_list = []
        for warden in wardens:
            warden_list.append({
                "id": str(warden["_id"]),  # Convert ObjectId to string
                "username": warden["username"],
                "contact_number": warden["contact_number"],
                "email": warden["email"]
            })

        logger.info("Fetched all wardens from the users collection successfully.")
        return warden_list

    except Exception as e:
        logger.error("Error fetching wardens from users collection", exc_info=True)
        return []

def wardens_to_assign():
    """Fetch all users with role 'warden' from the users collection."""
    try:
        # Query for all users where role is 'warden'
        wardens = users_collection.find({"role": "warden", "hostel_name": None}, {"_id": 1, "username": 1, "contact_number": 1, "email": 1})

        # Convert the result to a list of dictionaries
        warden_list = []
        for warden in wardens:
            warden_list.append({
                "id": str(warden["_id"]),  # Convert ObjectId to string
                "username": warden["username"],
                "contact_number": warden["contact_number"],
                "email": warden["email"]
            })

        logger.info("Fetched all wardens from the users collection successfully.")
        return warden_list

    except Exception as e:
        logger.error("Error fetching wardens from users collection", exc_info=True)
        return []

def update_user_details(user_id, update_data: dict) -> bool:
    """Update user details."""
    result = users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
    logger.info(f"User updated: {user_id}")
    return result.modified_count > 0

def delete_user(user_id: str) -> bool:
    """Delete a user by ID."""
    result = users_collection.delete_one({"_id": user_id})
    return result.deleted_count > 0

# Room Database Functions
def add_rooms():
    """Add all predefined room from collections_format.py into the database."""
    inserted_id = []

    for room in rooms_data:
        try:
            # Convert the room instance to a dictionary
            room_dict = room.to_dict()

            # Optional: Check if the room already exists to prevent duplicates (by room name)
            existing_room = rooms_collection.find_one({"hostel_name": room_dict["hostel_name"],"room_number": room_dict["room_number"]})
            if existing_room:
                logger.info(f"room '{room_dict['room_number']}' already exists in the database.")
                continue

            # Insert the room document into MongoDB
            result = rooms_collection.insert_one(room_dict)
            inserted_id.append(str(result.inserted_id))
            logger.info(f"room '{room_dict['room_number']}' added successfully with ID: {result.inserted_id}")

        except Exception as e:
            logger.error(f"Failed to add room '{room.room_number}' to the database.", exc_info=True)

    return inserted_id

def list_all_rooms():
    """List all rooms across hostels."""
    return list(rooms_collection.find({}))

def check_room_availability(room_id: str) -> bool:
    """Check if a room is available."""
    room = rooms_collection.find_one({"_id": ObjectId(room_id)})
    return room and room["current_occupancy"] < room["capacity"]

def get_room(room_id: str):
    logger.info(f"Fetching room with ID: {room_id}")
    room_data = rooms_collection.find_one({"_id": ObjectId(room_id)})
    return Room(**room_data) if room_data else None

def update_room(room_id: str, update_data: dict) -> bool:
    result = rooms_collection.update_one({"_id": ObjectId(room_id)}, {"$set": update_data})
    logger.info(f"Room updated: {room_id}")
    return result.modified_count > 0

def delete_room(room_id: str) -> bool:
    """Delete a room by ID."""
    result = rooms_collection.delete_one({"_id": room_id})
    return result.deleted_count > 0

# Allotment Database Functions
def add_allotment(allotment_data: Allotment) -> str:
    result = allotments_collection.insert_one(allotment_data.to_dict())
    logger.info(f"Allotment added with ID: {result.inserted_id}")
    return str(result.inserted_id)

def list_allotments_by_user(user_id: str):
    """List all allotments by user ID."""
    return list(allotments_collection.find({"user_id": user_id}))

def remove_allotment(allotment_id: str) -> bool:
    """Remove an allotment by ID."""
    result = allotments_collection.delete_one({"_id": ObjectId(allotment_id)})
    logger.info(f"Allotment removed: {allotment_id}")
    return result.deleted_count > 0

def update_allotment(allotment_id: str, update_data: dict) -> bool:
    """Update allotment details."""
    result = allotments_collection.update_one({"_id": allotment_id}, {"$set": update_data})
    return result.modified_count > 0

def delete_allotment(allotment_id: str) -> bool:
    """Delete an allotment by ID."""
    result = allotments_collection.delete_one({"_id": allotment_id})
    return result.deleted_count > 0

def get_allotment(allotment_id: str):
    logger.info(f"Fetching allotment with ID: {allotment_id}")
    allotment_data = allotments_collection.find_one({"_id": ObjectId(allotment_id)})
    return Allotment(**allotment_data) if allotment_data else None

# Hostel Database Functions
def add_hostels():
    """Add all predefined hostels from collections_format.py into the database."""
    inserted_ids = []

    for hostel in hostels_data:
        try:
            # Convert the Hostel instance to a dictionary
            hostel_dict = hostel.to_dict()

            # Optional: Check if the hostel already exists to prevent duplicates (by hostel name)
            existing_hostel = hostels_collection.find_one({"hostel_name": hostel_dict["hostel_name"]})
            if existing_hostel:
                logger.info(f"Hostel '{hostel_dict['hostel_name']}' already exists in the database.")
                continue

            # Insert the hostel document into MongoDB
            result = hostels_collection.insert_one(hostel_dict)
            inserted_ids.append(str(result.inserted_id))
            logger.info(f"Hostel '{hostel_dict['hostel_name']}' added successfully with ID: {result.inserted_id}")

        except Exception as e:
            logger.error(f"Failed to add hostel '{hostel.hostel_name}' to the database.", exc_info=True)

    return inserted_ids

def list_all_hostels():
    """Fetch and return the list of hostels from the database with warden details."""
    try:
        # Fetch all hostel documents from the database
        hostels = list(hostels_collection.find({}))

        # Convert each hostel document to a dictionary format and include necessary fields
        hostel_list = [
            {
                "_id": str(hostel["_id"]),
                "hostel_name": hostel.get("hostel_name"),
                "location": hostel.get("location"),
                "total_rooms": hostel.get("total_rooms"),
                "capacity": hostel.get("capacity"),
                "current_occupancy": hostel.get("current_occupancy"),
                "warden_name": hostel.get("warden_name", None),  # Get warden name if available
                "warden_contact": hostel.get("warden_contact", None),  # Get warden contact if available
                "warden_email": hostel.get("warden_email", None)  # Get warden email if available
            }
            for hostel in hostels
        ]

        logger.info("Fetched all hostels successfully from the database.")
        return hostel_list

    except Exception as e:
        logger.error("Error fetching hostels from the database", exc_info=True)
        return []

def update_hostel(hostel_id: str, update_data: dict) -> bool:
    """Update hostel details."""
    result = hostels_collection.update_one({"_id": ObjectId(hostel_id)}, {"$set": update_data})
    logger.info(f"Hostel updated: {hostel_id}")
    return result.modified_count > 0

def get_hostel(hostel_id: str):
    logger.info(f"Fetching hostel with ID: {hostel_id}")
    hostel_data = hostels_collection.find_one({"_id": ObjectId(hostel_id)})
    return Hostel(**hostel_data) if hostel_data else None

def get_available_hostels():
    """Fetches all hostels where remaining capacity (capacity - current_occupancy) is greater than zero."""
    try:
        # Query to find hostels where remaining capacity > 0
        available_hostels = hostels_collection.find({
            "$expr": { "$gt": ["$capacity", "$current_occupancy"] }
        })
        
        # Convert each hostel document to a dictionary, and add it to the list
        hostel_list = []
        for hostel in available_hostels:
            hostel["_id"] = str(hostel["_id"])  # Convert MongoDB ObjectId to string
            hostel_list.append(hostel)
        
        return hostel_list
    except Exception as e:
        print(f"Error fetching available hostels: {e}")
        return []

def delete_hostel(hostel_id: str) -> bool:
    """Delete a hostel by ID."""
    result = hostels_collection.delete_one({"_id": hostel_id})
    return result.deleted_count > 0

def assign_hostel_to_student(bits_id: str, hostel_name: str):
    try:        
        # Check if the selected hostel has available capacity
        hostel = hostels_collection.find_one({"hostel_name": hostel_name})
        
        if not hostel or hostel["current_occupancy"] >= hostel["capacity"]:
            print("Hostel is full or does not exist.")
            return False
        
        # Update the application with the assigned hostel
        applications_collection.update_one(
            {"bits_id": bits_id},
            {"$set": {"hostel_status": "assigned", "alloted_hostel": hostel_name}}
        )

        users_collection.update_one(
            {"bits_id": bits_id},
            {"$set": {"hostel_name": hostel_name}}
        )
        
        # Increment the current occupancy of the assigned hostel
        hostels_collection.update_one(
            {"hostel_name": hostel_name},
            {"$inc": {"current_occupancy": 1}}
        )
        
        print(f"Hostel {hostel_name} assigned successfully to BITS ID {bits_id}.")
        return True
    except Exception as e:
        print(f"Error assigning hostel: {e}")
        return False

# Application Database Functions
def create_application(user_id, hostel_preference, room_type_preference):
    application = Application(
        _id=str(ObjectId()),
        bits_id=user_id,
        hostel_preference=hostel_preference,
        room_type_preference=room_type_preference,
        application_date=datetime.now(),
        hostel_status="pending",
        room_status="pending"
    )
    result = applications_collection.insert_one(application.to_dict())
    return str(result.inserted_id)

def get_closed_applications_admin():
    """Get applications by their status (e.g., pending, approved)."""
    return list(applications_collection.find({"hostel_status": {"$ne": "pending"}}))

def get_pending_applications_admin():
    """Get applications by their status (e.g., pending, approved)."""
    return list(applications_collection.find({"hostel_status": "pending"}))

def get_closed_applications_warden(hostel_name: str):
    """Get applications by their status (e.g., pending, approved)."""
    return list(applications_collection.find({"room_status": {"$ne": "pending"}, "alloted_hostel":hostel_name}))

def get_pending_applications_warden(hostel_name: str):
    """Get applications by their status (e.g., pending, approved)."""
    return list(applications_collection.find({"room_status": "pending", "hostel_status": "assigned", "alloted_hostel":hostel_name}))

def update_application_status(application_id: str, status: str) -> bool:
    """Update the status of an application."""
    result = applications_collection.update_one({"_id": ObjectId(application_id)}, {"$set": {"status": status}})
    logger.info(f"Application status updated for: {application_id}")
    return result.modified_count > 0

def get_application(application_id: str):
    logger.info(f"Fetching application with ID: {application_id}")
    application_data = applications_collection.find_one({"_id": ObjectId(application_id)})
    return Application(**application_data) if application_data else None

def delete_application(application_id: str) -> bool:
    """Delete an application by ID."""
    result = applications_collection.delete_one({"_id": application_id})
    return result.deleted_count > 0

# Utility Functions
def find_available_rooms(hostel_name: str):
    try:
        # Query to find rooms with current occupancy less than capacity
        rooms = rooms_collection.find({
            "hostel_name": hostel_name,
            "$expr": {"$lt": ["$current_occupancy", "$capacity"]}
        })

        logger.info(f"Fetched available rooms for hostel: {hostel_name}")

        # Convert MongoDB result to Room dataclass instances
        return [Room(
            hostel_name=room["hostel_name"],
            room_number=room["room_number"],
            type=room["type"],
            capacity=room["capacity"],
            current_occupancy=room["current_occupancy"],
            occupants=room.get("occupants", []),
            features=room.get("features", [])
        ) for room in rooms]

    except Exception as e:
        logger.error(f"Error finding available rooms for hostel {hostel_name}: {e}")
        return []

def assign_room_to_student(bits_id: str, room_number: str, hostel_name: str) -> bool:
    try:
        # Find the room by its ObjectId
        room = rooms_collection.find_one({"room_number": room_number, "hostel_name":hostel_name})
        if not room:
            logger.error(f"Room with room_number {room_number} not found.")
            return False

        # Check if the room has available capacity
        if room["current_occupancy"] >= room["capacity"]:
            logger.error(f"Room {room_number} has reached its full capacity.")
            return False

        # Update the student's room and hostel details
        update_student = users_collection.update_one(
            {"bits_id": bits_id},
            {"$set": {"room_number": room_number, "hostel_name": hostel_name}}
        )
        
        if update_student.modified_count == 0:
            logger.error(f"Failed to update student {bits_id} with room information.")
            return False

        # Increment the room's current occupancy
        update_room = rooms_collection.update_one(
            {"room_number": room_number, "hostel_name":hostel_name},
            {"$inc": {"current_occupancy": 1}}
        )

        applications_collection.update_one(
            {"bits_id": bits_id},
            {"$set": {"room_status": "assigned", "alloted_room": room_number}}
        )

        if update_room.modified_count == 0:
            logger.error(f"Failed to update room occupancy for room {room_number}.")
            return False

        logger.info(f"Assigned room {room_number} in hostel {hostel_name} to student {bits_id}.")
        return True

    except Exception as e:
        logger.error("Error assigning room to student", exc_info=True)
        return False

def assign_warden_to_hostel(hostel_name, warden_email):
    """Assign a warden to a specific hostel by finding the warden by name and updating hostel details."""
    try:
        # Log the input parameters for debugging
        logger.debug(f"Assigning warden with name: {warden_email} to hostel with hostel_name: {hostel_name}")

        # Look up the warden in the users collection by name and role
        warden = users_collection.find_one({"email": warden_email, "role": "warden"})
        
        # Check if warden was found and log details
        if not warden:
            logger.warning(f"No warden found with name '{warden_email}'.")
            return False
        else:
            logger.debug(f"Found warden: {warden}")

        # Retrieve the warden's ObjectId and contact details
        warden_id = warden["_id"]
        warden_contact = warden.get("contact_number")
        warden_name = warden.get("username")
        warden_email = warden_email
        
        # Log warden details being assigned to the hostel
        logger.debug(f"Assigning warden ID: {warden_id}, Name: {warden_email}, Contact: {warden_contact} to hostel name: {hostel_name}")

        # Update the hostel document with the warden's name and contact
        result = hostels_collection.update_one(
            {"hostel_name": hostel_name},
            {"$set": {
                "warden_name": warden_name,
                "warden_contact": warden_contact,
                "warden_email": warden_email
            }}
        )

        users_collection.update_one(
            {"email": warden_email},
            {"$set": {
                "hostel_name": hostel_name
            }}
        )

        # Log the result of the update operation
        if result.modified_count > 0:
            logger.info(f"Warden '{warden_name}' assigned to hostel with ID {hostel_name}.")
            return True
        else:
            logger.warning(f"No updates made for hostel with ID {hostel_name}.")
            return False

    except Exception as e:
        logger.error(f"Error assigning warden '{warden_name}' to hostel with ID {hostel_name}", exc_info=True)
        return False
    
def remove_warden_from_hostel(hostel_name, warden_email):
    """Remove the warden from a specific hostel by clearing warden fields."""
    try:
        # Validate if hostel_name is a valid ObjectId
        if not hostel_name:
            logger.error(f"Invalid ObjectId for hostel_name: {hostel_name}")
            return False
        # Update the hostel document to remove the warden details
        result = hostels_collection.update_one(
            {"hostel_name": hostel_name},
            {"$set": {
                "warden_name": None,
                "warden_contact": None,
                "warden_email": None
            }}
        )
        users_collection.update_one(
            {"email": warden_email},
            {"$set": {
                "hostel_name": None
            }}
        )       
        # Log the result
        if result.modified_count > 0:
            logger.info(f"Warden removed from hostel with ID {hostel_name}.")
            return True
        else:
            logger.warning(f"No updates made for hostel with ID {hostel_name}.")
            return False

    except Exception as e:
        logger.error(f"Error removing warden from hostel with ID {hostel_name}", exc_info=True)
        return False
    
def get_students_by_hostel(hostel_name):
    """Fetch all students assigned to a specific hostel."""
    try:
        students = users_collection.find({"hostel_name": hostel_name, "role": "student"})
        
        # Convert MongoDB documents to User instances, converting date strings to datetime if needed
        student_list = []
        for student in students:
            # Convert `registration_date` if it exists and is a string
            if "registration_date" in student and isinstance(student["registration_date"], str):
                student["registration_date"] = datetime.fromisoformat(student["registration_date"])
            # Exclude '_id' field as needed
            student_list.append(User(**{key: value for key, value in student.items() if key != "_id"}))
        
        return student_list
    except Exception as e:
        print(f"Error fetching students for hostel {hostel_name}: {e}")
        return []